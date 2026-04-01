var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10PopupBase = require("PopupBase");
var $10SceneManager = require("SceneManager");
var $10AdsMgr = require("AdsMgr");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var $10ResUtil = require("ResUtil");
var $10AnimationMgr = require("AnimationMgr");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDWinPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mTips1 = null;
    e.mTips2 = null;
    e.mItemLayout = null;
    e._reawards = [];
    e._isCanClick = true;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (e) {
    $10AudioManager.AudioManager.instance.stopBgm();
    t.prototype.init.call(this, e);
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.PlantDefenseData.stageLoseNum[$10PlantDefenseDataProxy.plantDefenseDataProxy.selectStageId]) {
      $10PlantDefenseDataProxy.plantDefenseDataProxy.PlantDefenseData.stageLoseNum[$10PlantDefenseDataProxy.plantDefenseDataProxy.selectStageId] = 0;
      $10PlantDefenseDataProxy.plantDefenseDataProxy.saveData();
    }
    var n = $10PlantDefenseDataProxy.plantDefenseDataProxy.selectStageId + 1;
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.PlantDefenseData.unlockLevels.indexOf(n) < 0) {
      $10PlantDefenseDataProxy.plantDefenseDataProxy.PlantDefenseData.unlockLevels.push(n);
      $10PlantDefenseDataProxy.plantDefenseDataProxy.saveData();
    }
    var o = [];
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/win", "Res");
    var i = Math.floor(1e3 * Math.random()) % 3 + 1;
    var a = $10DataManager.DataManager.instance.eData.datasettlement[1]["des" + i].split("|");
    this.mTips1.string = a[0];
    this.mTips2.string = a[1];
    this._reawards = o;
    var s = $10DataManager.DataManager.instance.eData.datapara[103];
    if (s) {
      var l = s.num.split("|");
      for (var c = 0; c < l.length; c++) {
        var d = l[c].split("_");
        var m = {};
        m.id = d[0];
        m.num = d[1];
        o.push(m);
      }
    }
    o.length;
    var y = function (t) {
      var e = $10DataManager.DataManager.instance.eData.dataitem[o[t].id];
      var n = _.mItemLayout.children[t];
      n || ((n = cc.instantiate(_.mItemLayout.children[0])).parent = _.mItemLayout);
      n.active = true;
      var i = n.getChildByName("itemBg").getComponent(cc.Sprite);
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/public/item_bg" + e.qulity,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        i.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      var a = n.getChildByName("itemImg").getComponent(cc.Sprite);
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/item/" + e.icon,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        a.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      n.getChildByName("itemNum").getComponent(cc.Label).string = "x" + o[t].num;
    };
    var _ = this;
    c = 0;
    for (var P = o.length; c < P; c++) {
      y(c);
    }
  };
  _ctor.prototype.toHome = function (t) {
    var e = this;
    this._isCanClick = false;
    var n = this.node.getChildByName("layout");
    var o = 0;
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameMode == $10PlantDefenseDataProxy.PDGameMode.PD_GAME) {
      $10PlantDefenseDataProxy.plantDefenseDataProxy.PlantDefenseData.btnStartTime = new Date().getTime();
    } else {
      $10PlantDefenseDataProxy.plantDefenseDataProxy.gameMode == $10PlantDefenseDataProxy.PDGameMode.SJ_GAME && ($10PlantDefenseDataProxy.plantDefenseDataProxy.PlantDefenseData.btnStartTime2 = new Date().getTime());
    }
    $10PlantDefenseDataProxy.plantDefenseDataProxy.saveData();
    var i = this._reawards.length;
    var a = i > 0 ? 2 : 0;
    var r = function (a) {
      var r = n.children[a];
      if (!r.active) {
        return "continue";
      }
      var l = s._reawards[o];
      l.num = t ? 2 * l.num : l.num;
      s.scheduleOnce(function () {
        if (l) {
          r.active = false;
          $10AnimationMgr.default.instance.showAwardAni(l, e.node, r, 0, cc.v3(-250, l.id > 6 ? -850 : 850));
          $10UserDataProxy.userDataProxy.addProp(l.id, l.num, o + 1 == i);
        }
      }, .1 * o);
      o++;
    };
    var s = this;
    for (var c = 0; c < n.children.length; ++c) {
      r(c);
    }
    this.scheduleOnce(function () {
      $10SceneManager.SceneManager.instance.runScene("Home", "");
      e.removeUI();
    }, .1 * o + a);
  };
  _ctor.prototype.onClickBtnClose = function () {
    this._isCanClick && this.toHome(false);
  };
  _ctor.prototype.onClickBtnDouble = function () {
    var t = this;
    this._isCanClick && $10AdsMgr.default.showVideoAds({
      id: 1,
      eventId: "pd_double_reward",
      success: function () {
        t.toHome(true);
      },
      fail: function (t) {
        return console.log(t);
      },
      error: function (t) {
        return console.log(t);
      }
    }, true);
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mTips1", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mTips2", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mItemLayout", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_PDWinPopup;