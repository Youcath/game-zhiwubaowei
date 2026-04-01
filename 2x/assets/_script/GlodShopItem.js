var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10TimeUtil = require("TimeUtil");
var $10AdsMgr = require("AdsMgr");
var $10HomeEnum = require("HomeEnum");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10GameUIManager = require("GameUIManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_GlodShopItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._itemData = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    var e = this;
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.DIAMOD_UPDATE, this.updateDiamond, this);
    this._itemData = t;
    var o = $10UserDataProxy.userDataProxy.userData.goldData;
    var i = this._itemData.buyType;
    var n = Number(this._itemData.reward.split("_")[1]);
    this.node.getChildByName("numLabel").getComponent(cc.Label).string = "X" + n;
    if (1 == i) {
      this.unscheduleAllCallbacks();
      this.node.getChildByName("mianfeiBtn").active = this._itemData.freeNum > o.mfNum;
      var a = this.node.getChildByName("proLabel");
      if (this._itemData.buyNum > 1 && this._itemData.freeNum == o.mfNum) {
        var r = 10 - o.videoNum;
        a.getComponent(cc.Label).string = r + "/" + this._itemData.buyNum;
        a.active = true;
      }
      this.node.getChildByName("videoBtn").active = this._itemData.freeNum <= o.mfNum && this._itemData.buyNum > o.videoNum;
      if (o.videoNum >= this._itemData.buyNum) {
        var l = $10Util.default.getNextDayZeroTimestamp() - Date.now();
        var u = this.node.getChildByName("timerCd").getComponent(cc.Label);
        u.node.active = true;
        u.string = $10TimeUtil.TimeUtil.format_MMSS(l);
        this.schedule(function () {
          (l -= 1e3) < 0 && e.unscheduleAllCallbacks();
          u.string = $10TimeUtil.TimeUtil.format_MMSS(l);
        }, 1);
      }
    } else {
      var d = Number(this._itemData.cost.split("_")[1]);
      var m = this.node.getChildByName("buyBtn");
      m.getChildByName("label").getComponent(cc.Label).string = "" + d;
      m.active = true;
      if ($10UserDataProxy.userDataProxy.userData.diamond >= d) {
        m.getChildByName("label").color = cc.Color.WHITE;
      } else {
        m.getChildByName("label").color = cc.Color.RED;
      }
    }
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.DIAMOD_UPDATE, this.updateDiamond, this);
  };
  _ctor.prototype.updateDiamond = function () {
    var t = Number(this._itemData.cost.split("_")[1]);
    var e = this.node.getChildByName("buyBtn");
    if ($10UserDataProxy.userDataProxy.userData.diamond >= t) {
      e.getChildByName("label").color = cc.Color.WHITE;
    } else {
      e.getChildByName("label").color = cc.Color.RED;
    }
  };
  _ctor.prototype.onMianFeiClick = function () {
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/click", $10HomeEnum.Bundles.RES);
    $10UserDataProxy.userDataProxy.userData.goldData.mfNum += 1;
    $10UserDataProxy.userDataProxy.saveData();
    var t = this._itemData.reward.split("_");
    var e = [{
      id: Number(t[0]),
      num: Number(t[1])
    }];
    $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
      list: e,
      type: 1
    });
    this.init(this._itemData);
    $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.UPDATE_HOME_REDDOT, [$10HomeEnum.HOME_REDDOT.SHOPRED]);
  };
  _ctor.prototype.onBuyClick = function () {
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/click", $10HomeEnum.Bundles.RES);
    var t = Number(this._itemData.cost.split("_")[1]);
    if (!($10UserDataProxy.userDataProxy.userData.diamond >= t)) {
      $10GameUIManager.gameUIMgr.showTips("钻石不够！");
      return void $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.SHOW_VIDEO_DIAMOMND_POPUP);
    }
    $10UserDataProxy.userDataProxy.changeDiamond(-t);
    var e = this._itemData.reward.split("_");
    var o = [{
      id: Number(e[0]),
      num: Number(e[1])
    }];
    $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
      list: o,
      type: 1
    });
  };
  _ctor.prototype.onVideoClick = function () {
    var t = this;
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/click", $10HomeEnum.Bundles.RES);
    if (this._itemData.buyNum > $10UserDataProxy.userDataProxy.userData.goldData.videoNum) {
      $10AdsMgr.default.showVideoAds({
        id: 1,
        eventId: "shop_getGold_ad",
        success: function () {
          $10UserDataProxy.userDataProxy.userData.goldData.videoNum += 1;
          $10UserDataProxy.userDataProxy.saveData();
          var e = t._itemData.reward.split("_");
          var o = [{
            id: Number(e[0]),
            num: Number(e[1])
          }];
          $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
            list: o,
            type: 1
          });
          t.init(t._itemData);
        },
        fail: function (t) {
          return console.log(t);
        },
        error: function (t) {
          return console.log(t);
        }
      }, true);
    } else {
      $10GameUIManager.gameUIMgr.showTips("广告次数超过了!");
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_GlodShopItem;