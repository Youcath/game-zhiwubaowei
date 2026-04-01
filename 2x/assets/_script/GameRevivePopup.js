var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10PopupBase = require("PopupBase");
var $10AdsMgr = require("AdsMgr");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10GameUIManager = require("GameUIManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GameRevivePopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mTime = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.PAUSE;
    this.updateVideoCardNum();
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/revive", $10HomeEnum.Bundles.RES);
    this.mTime.string = "剩余复活次数:" + (3 - ($10BattleDataProxy.battleDataProxy.battleData.reviveNum - 1)) + "/3";
  };
  _ctor.prototype.updateVideoCardNum = function () {
    var t = this.node.getChildByName("BtnRevive").getChildByName("pic_AD_yello");
    $10BattleDataProxy.battleDataProxy.setVideoCardIcon(t, 4, 1.5);
  };
  _ctor.prototype.onBtnRevive = function () {
    var t = this;
    if ($10UserDataProxy.userDataProxy.getProp(4) > 0) {
      $10UserDataProxy.userDataProxy.addProp(4, -1);
      return void this.onRevive();
    }
    $10AdsMgr.default.showVideoAds({
      id: 1,
      eventId: "game_revive_ad",
      success: function () {
        t.onRevive();
      },
      fail: function () {},
      error: function () {}
    }, true);
  };
  _ctor.prototype.onRevive = function () {
    $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.RESURGENCE);
    this.removeUI();
  };
  _ctor.prototype.onBtnClose = function () {
    if ($10BattleDataProxy.battleDataProxy.isEndless) {
      $10GameUIManager.gameUIMgr.showEndlessOverPopup();
    } else {
      $10GameUIManager.gameUIMgr.showGameLosePopup();
    }
    this.removeUI();
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mTime", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_GameRevivePopup;