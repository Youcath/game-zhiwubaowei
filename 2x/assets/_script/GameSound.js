var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameSound = undefined;
var $10AudioManager = require("AudioManager");
var $10ComponentBase = require("ComponentBase");
var $10EventManager = require("EventManager");
var $10AppProxy = require("AppProxy");
var $10HomeEnum = require("HomeEnum");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var exp_GameSound = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
    $10EventManager.EventManager.instance.on($10AppProxy.AppEvent.AUDIO_CLICK, this.playClick, this);
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10AppProxy.AppEvent.AUDIO_CLICK, this.playClick, this);
    t.prototype.onDestroy.call(this);
  };
  _ctor.prototype.playClick = function () {
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/click", $10HomeEnum.Bundles.RES);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComponentBase.ComponentBase);
exports.GameSound = exp_GameSound;