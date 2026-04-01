var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10List = require("List");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10PopupBase = require("PopupBase");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var $10GameUIManager = require("GameUIManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_EndlessRewardPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mMyList = null;
    e.mMaxWave = null;
    e._myRank = 0;
    e._rewardData = [];
    e._rankStr = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    this._myRank = $10UserDataProxy.userDataProxy.mYesterdayRank;
    var t = this.node.getChildByName("BtnReceive");
    var e = $10UserDataProxy.userDataProxy.userData.endlessData;
    t.getComponent(cc.Button).interactable = $10UserDataProxy.userDataProxy.mYesterdayRank > 0 && 0 == e.isReceive && this._myRank > 0;
    if ($10UserDataProxy.userDataProxy.mYesterdayRank > 0) {
      this.mMaxWave.string = "" + $10UserDataProxy.userDataProxy.mYesterdayRank;
    } else {
      this.mMaxWave.string = "未上榜";
    }
    this.node.getChildByName("BtnClose").y -= 20;
    if (1 == e.isReceive) {
      t.getChildByName("lab").getComponent(cc.Label).string = "已领取";
    } else {
      t.getChildByName("lab").getComponent(cc.Label).string = "领取";
    }
    for (var o = 1008; o < 1015; ++o) {
      var i = $10DataManager.DataManager.instance.eData.datapara[o].num;
      this._rewardData.push(i);
    }
    this._rankStr = ["1", "2", "3", "4-10", "11-20", "21-50", "50+"];
  };
  _ctor.prototype.onShow = function () {
    this.mMyList.numItems = this._rewardData.length;
  };
  _ctor.prototype.onUpdateItem = function (t, e) {
    var o = t.getChildByName("rankNum");
    var i = t.getChildByName("greenBg");
    var n = t.getChildByName("yellowBg");
    if (n) {
      n.active = e <= 2;
      i.active = !n.active;
    } else {
      i.active = true;
    }
    o.getComponent(cc.Label).string = this._rankStr[e];
    for (var a = 0; a < 3; ++a) {
      t.getChildByName("pic_" + (a + 1)).active = e == a;
    }
    o.active = e > 2;
    var r = this._rewardData[e].split("|");
    var s = t.getChildByName("layout");
    s.children.forEach(function (t) {
      t.active = false;
    });
    var l = function (t) {
      var e = r[t].split("_").map(Number);
      var o = e[0];
      var i = e[1];
      var n = $10DataManager.DataManager.instance.eData.dataitem[o];
      if (!n) {
        console.log("没有这个物品:", o);
        return "continue";
      }
      var a = s.children[t];
      if (!a) {
        a = cc.instantiate(s.children[0]);
        s.addChild(a);
      }
      a.active = true;
      var l = a.getChildByName("gradeIcon");
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/public/item_bg" + n.qulity,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        l.getComponent(cc.Sprite).spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      var h = a.getChildByName("rewardIcon").getComponent(cc.Sprite);
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/item/" + n.icon,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        h.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      a.getChildByName("num").getComponent(cc.Label).string = "x" + i;
    };
    for (a = 0; a < r.length; ++a) {
      l(a);
    }
  };
  _ctor.prototype.onBtnReceive = function () {
    if (1 != $10UserDataProxy.userDataProxy.userData.endlessData.isReceive) {
      var t = 1014;
      if (1 == this._myRank) {
        t = 1008;
      } else if (2 == this._myRank) {
        t = 1009;
      } else if (3 == this._myRank) {
        t = 1010;
      } else if (this._myRank >= 4 && this._myRank <= 10) {
        t = 1011;
      } else if (this._myRank >= 11 && this._myRank <= 20) {
        t = 1012;
      } else {
        this._myRank >= 21 && this._myRank <= 50 && (t = 1013);
      }
      var e = $10DataManager.DataManager.instance.eData.datapara[t].num.split("|");
      var o = [];
      for (var i = 0; i < e.length; ++i) {
        var n = e[i].split("_");
        var a = Math.floor(Number(n[1]));
        a > 0 && o.push({
          id: Number(n[0]),
          num: a
        });
      }
      var r = this.node.getChildByName("BtnReceive");
      r.getComponent(cc.Button).interactable = false;
      r.getChildByName("lab").getComponent(cc.Label).string = "已领取";
      $10UserDataProxy.userDataProxy.userData.endlessData.isReceive = 1;
      $10UserDataProxy.userDataProxy.saveData();
      o = $10UserDataProxy.userDataProxy.checkBoxRetrunAwards(o);
      $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
        list: o,
        type: 1
      });
      $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.RECEIVE_ENDLESS_RWWARDS);
    } else {
      $10GameUIManager.gameUIMgr.showTips("今日奖励已经领取");
    }
  };
  cc__decorate([ccp_property($10List.default)], _ctor.prototype, "mMyList", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mMaxWave", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_EndlessRewardPopup;