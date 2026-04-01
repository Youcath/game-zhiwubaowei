var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10PopupBase = require("PopupBase");
var $10SceneManager = require("SceneManager");
var $10AdsMgr = require("AdsMgr");
var $10MBGameDataProxy = require("MBGameDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_MBFailPopup = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    $10MBGameDataProxy.mbGameDataProxy.fail();
    $10MBGameDataProxy.mbGameDataProxy.btnStartTime = new Date().getTime();
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/fail", "res_MB");
  };
  _ctor.prototype.onClickBtnBack = function () {
    this.removeUI();
    $10SceneManager.SceneManager.instance.runScene("Home", "");
  };
  _ctor.prototype.onClickBtnRestart = function () {
    var t = this;
    $10AdsMgr.default.showVideoAds({
      id: 1,
      eventId: "mb_game_enter",
      success: function () {
        t.removeUI();
        $10SceneManager.SceneManager.instance.runScene("mb", "");
      },
      fail: function (t) {
        return console.log(t);
      },
      error: function (t) {
        return console.log(t);
      }
    }, true);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_MBFailPopup;