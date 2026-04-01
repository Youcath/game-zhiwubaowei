var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameGlobal = exports.GGC = undefined;
var $10AudioManager = require("AudioManager");
var $10ComponentBase = require("ComponentBase");
var $10EventManager = require("EventManager");
var $10CommonUtil = require("CommonUtil");
var $10AppProxy = require("AppProxy");
var $10HomeEnum = require("HomeEnum");
var $10AudioUtil = require("AudioUtil");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
exports.GGC = null;
var exp_GameGlobal = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._musicName = "";
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "musicName", {
    get: function () {
      return this._musicName;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
    exports.GGC = this;
    $10AudioUtil.audioUtil.init();
  };
  _ctor.prototype.registerEvents = function () {
    $10EventManager.EventManager.instance.on($10AppProxy.AppEvent.AUDIO_CLICK, this.playBtnAudio, this);
    $10EventManager.EventManager.instance.on($10AppProxy.AppEvent.BGM_CHANGED, this.playBgm, this);
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10AppProxy.AppEvent.AUDIO_CLICK, this.playBtnAudio, this);
    $10EventManager.EventManager.instance.off($10AppProxy.AppEvent.BGM_CHANGED, this.playBgm, this);
    t.prototype.onDestroy.call(this);
  };
  _ctor.prototype.playBtnAudio = function () {
    $10AudioUtil.audioUtil.playBtnAudio();
  };
  _ctor.prototype.playBgm = function (t) {
    if (!$10CommonUtil.CommonUtil.isEmpty(t)) {
      switch (t) {
        case $10AppProxy.BgmTypes.close:
          this._musicName;
          $10AudioManager.AudioManager.instance.stopBgm();
          break;
        case $10AppProxy.BgmTypes.open:
          this._musicName;
          $10AudioManager.AudioManager.instance.playBgmPath("sounds/bgm", $10HomeEnum.Bundles.RES, true);
          break;
        case $10AppProxy.BgmTypes.load:
        case $10AppProxy.BgmTypes.main:
        case $10AppProxy.BgmTypes.draw:
        case $10AppProxy.BgmTypes.battle_ready:
          break;
        case $10AppProxy.BgmTypes.battle:
      }
    }
    $10AudioManager.AudioManager.instance.setBgmVolume(1);
  };
  _ctor.isFirstOpen = true;
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComponentBase.ComponentBase);
exports.GameGlobal = exp_GameGlobal;