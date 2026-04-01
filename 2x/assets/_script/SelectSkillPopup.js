var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10PopupBase = require("PopupBase");
var $10AdsMgr = require("AdsMgr");
var $10GameEnum = require("GameEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10SelectSkillItem = require("SelectSkillItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_SelectSkillPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSkillLayout = null;
    e.mBtnRefresh = null;
    e.mBtnAll = null;
    e.mGetAllNum = null;
    e.mRefreshNum = null;
    e._selectSkillList = [];
    e._skillLists = [];
    e._isRefresh = false;
    e._isCanClick = true;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.UPDATE_VIDEO_CARD, this.updateVideoCardNum, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.SELECT_SKILL_FINISH, this.selectSkill, this);
    this.initUI();
    this.initSkillUI();
    this.updateVideoCardNum();
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.UPDATE_VIDEO_CARD, this.updateVideoCardNum, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.SELECT_SKILL_FINISH, this.selectSkill, this);
  };
  _ctor.prototype.updateVideoCardNum = function () {
    var t = this.mBtnAll.getChildByName("video");
    $10BattleDataProxy.battleDataProxy.setVideoCardIcon(t, 1);
    var e = this.mBtnRefresh.getChildByName("video");
    $10BattleDataProxy.battleDataProxy.setVideoCardIcon(e, 2);
  };
  _ctor.prototype.initUI = function () {
    this._isCanClick = true;
    var t = Number($10DataManager.DataManager.instance.eData.datapara[39].num);
    var e = Number($10DataManager.DataManager.instance.eData.datapara[38].num);
    var o = $10BattleDataProxy.battleDataProxy.battleData.refreshNum;
    this.mRefreshNum.string = t - o + "/" + t;
    this.mBtnRefresh.getComponent(cc.Button).interactable = o < t;
    var i = $10BattleDataProxy.battleDataProxy.battleData.getAllNum;
    this.mGetAllNum.string = e - i + "/" + e;
    this.mBtnAll.getComponent(cc.Button).interactable = i < e;
    if (o >= t) {
      var n = this.mBtnRefresh.children;
      for (var a = 0; a < n.length; ++a) {
        if ("video" == (r = n[a]).name) {
          $10Util.default.setSpriteGrayMaterial(r.getComponent(cc.Sprite));
        } else {
          r.color = cc.color(75, 75, 75);
        }
      }
    }
    if (i >= e) {
      n = this.mBtnAll.children;
      for (a = 0; a < n.length; ++a) {
        var r;
        if ("video" == (r = n[a]).name) {
          $10Util.default.setSpriteGrayMaterial(r.getComponent(cc.Sprite));
        } else {
          r.color = cc.color(75, 75, 75);
        }
      }
    }
    var s = this.node.getChildByName("residueNum");
    if ($10BattleDataProxy.battleDataProxy.isEndless) {
      s.active = $10BattleDataProxy.battleDataProxy.endlessSelectSkillNum >= 0;
      s.getComponent(cc.Label).string = "剩余选择次数：" + ($10BattleDataProxy.battleDataProxy.endlessSelectSkillNum + 1);
    } else {
      s.active = false;
    }
  };
  _ctor.prototype.initSkillUI = function () {
    this._skillLists = $10BattleDataProxy.battleDataProxy.getSkillList();
    if (this._skillLists && this._skillLists.length <= 0) {
      console.log("没技能了");
      this.node.destroy();
      return void this.node.removeFromParent();
    }
    var t = -1;
    if (this._isRefresh) {
      this._isRefresh = true;
      t = Math.floor(1e3 * Math.random()) % 3;
    }
    this._selectSkillList = [];
    for (var e = 0; e < this.mSkillLayout.childrenCount; e++) {
      var o = this.mSkillLayout.children[e];
      var i = null;
      if (e == t) {
        console.log("必出最高等级的技能在位置:", t);
        i = this.randMaxLvSkill();
      } else {
        var n = $10MathUtil.MathUtil.objectWeightedRandom(this._skillLists);
        i = this._skillLists[n];
        n >= 0 && this._skillLists.splice(n, 1);
      }
      if (i) {
        o.active = true;
        o.getComponent($10SelectSkillItem.default).initSkillItem(i);
        this._selectSkillList.push(i);
      } else {
        o.active = false;
      }
    }
  };
  _ctor.prototype.randMaxLvSkill = function () {
    var t = 2;
    for (var e = 0; e < this._skillLists.length; ++e) {
      (i = this._skillLists[e]).quality > t && (t = i.quality);
    }
    var o = [];
    for (e = 0; e < this._skillLists.length; ++e) {
      var i;
      (i = this._skillLists[e]).quality == t && o.push({
        skill: i,
        idx: e
      });
    }
    if (o.length <= 0) {
      return null;
    }
    var n = o[Math.floor(1e3 * Math.random()) % o.length];
    this._skillLists.splice(n.idx, 1);
    return n.skill;
  };
  _ctor.prototype.onDisable = function () {
    if ($10BattleDataProxy.battleDataProxy.isStartFight) {
      $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.PLAYING;
    } else {
      $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.READY;
    }
  };
  _ctor.prototype.onBtnGetAll = function () {
    var t = this;
    if (this._isCanClick) {
      if ($10UserDataProxy.userDataProxy.getProp(4) > 0) {
        $10UserDataProxy.userDataProxy.addProp(4, -1);
        return void this.onGetAll();
      }
      $10AdsMgr.default.showVideoAds({
        id: 1,
        eventId: "getAll_skill_ad",
        success: function () {
          t.onGetAll();
        },
        fail: function () {},
        error: function (t) {
          cc.log(t);
        }
      }, true);
    }
  };
  _ctor.prototype.getAllSkill = function () {
    for (var t = 0; t < this._selectSkillList.length; ++t) {
      var e = this._selectSkillList[t];
      var o = this.mSkillLayout.children[t];
      if (o && o.isValid) {
        o.getComponent($10SelectSkillItem.default).playSelectEffect(t == this._selectSkillList.length - 1);
        $10BattleDataProxy.battleDataProxy.selectSkill(e.id, o);
      }
    }
    this._isCanClick = false;
  };
  _ctor.prototype.selectSkill = function () {
    if ($10BattleDataProxy.battleDataProxy.isEndless && $10BattleDataProxy.battleDataProxy.endlessSelectSkillNum > 0) {
      $10BattleDataProxy.battleDataProxy.endlessSelectSkillNum--;
      this.initUI();
      this.initSkillUI();
      this.updateVideoCardNum();
    } else {
      this.removeUI();
      $10BattleDataProxy.battleDataProxy.saveData();
    }
  };
  _ctor.prototype.onBtnRefresh = function () {
    var t = this;
    if ($10UserDataProxy.userDataProxy.getProp(4) > 0) {
      $10UserDataProxy.userDataProxy.addProp(4, -1);
      return void this.onRefresh();
    }
    $10AdsMgr.default.showVideoAds({
      id: 1,
      eventId: "refresh_skill_ad",
      success: function () {
        t.onRefresh();
      },
      fail: function () {},
      error: function (t) {
        cc.log(t);
      }
    }, true);
  };
  _ctor.prototype.onGetAll = function () {
    var t = $10BattleDataProxy.battleDataProxy.battleData.getAllNum;
    t++;
    $10BattleDataProxy.battleDataProxy.battleData.getAllNum = t;
    this.getAllSkill();
  };
  _ctor.prototype.onRefresh = function () {
    this._isRefresh = true;
    var t = $10BattleDataProxy.battleDataProxy.battleData.refreshNum;
    t++;
    $10BattleDataProxy.battleDataProxy.battleData.refreshNum = t;
    this.initUI();
    this.initSkillUI();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mSkillLayout", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnRefresh", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnAll", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mGetAllNum", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mRefreshNum", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_SelectSkillPopup;