var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10AppProxy = require("AppProxy");
var $10PopupBase = require("PopupBase");
var $10SceneManager = require("SceneManager");
var $10GameEnum = require("GameEnum");
var $10STJDataProxy = require("STJDataProxy");
var $10UserSetDataProxy = require("UserSetDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_STSettingPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.nShake = null;
    e.musicVolumeSlider = null;
    e.musicVolumePro = null;
    e.effectVolumeSlider = null;
    e.effectVolumePro = null;
    e.mMusicVolumeLab = null;
    e.mEffectVolumeLab = null;
    e.mShakeLab = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    $10STJDataProxy.sTJDataProxy.gameState == $10GameEnum.GameState.PLAYING && ($10STJDataProxy.sTJDataProxy.gameState = $10GameEnum.GameState.PAUSE);
    $10EventManager.EventManager.instance.on($10AudioManager.EAudioEvent.BACKGROUND_AUDIO_SWITCH_CHANGE, this.updateView, this);
    $10EventManager.EventManager.instance.on($10AudioManager.EAudioEvent.EFFECT_AUDIO_SWITCH_CHANGE, this.updateView, this);
    this.updateView();
  };
  _ctor.prototype.onDisable = function () {
    $10EventManager.EventManager.instance.off($10AudioManager.EAudioEvent.BACKGROUND_AUDIO_SWITCH_CHANGE, this.updateView, this);
    $10EventManager.EventManager.instance.off($10AudioManager.EAudioEvent.EFFECT_AUDIO_SWITCH_CHANGE, this.updateView, this);
    t.prototype.onDisable.call(this);
    $10UserSetDataProxy.userSetDataProxy.saveData();
  };
  _ctor.prototype.updateView = function () {
    this.musicVolumeSlider.progress = $10UserSetDataProxy.userSetDataProxy.setData.musicVolume;
    this.musicVolumePro.fillRange = $10UserSetDataProxy.userSetDataProxy.setData.musicVolume;
    this.effectVolumeSlider.progress = $10UserSetDataProxy.userSetDataProxy.setData.effectVolume;
    this.effectVolumePro.fillRange = $10UserSetDataProxy.userSetDataProxy.setData.effectVolume;
    var t = $10UserSetDataProxy.userSetDataProxy.setData.isOpenShake;
    this.nShake.getChildByName("Close").active = !t;
    this.nShake.getChildByName("Open").active = t;
    this.mShakeLab.string = t ? "开" : "关";
    this.mMusicVolumeLab.string = (100 * $10UserSetDataProxy.userSetDataProxy.setData.musicVolume).toFixed(0);
    this.mEffectVolumeLab.string = (100 * $10UserSetDataProxy.userSetDataProxy.setData.effectVolume).toFixed(0);
  };
  _ctor.prototype.onClickBtnEffectAudio = function () {};
  _ctor.prototype.onClickBtnMusicAudio = function () {};
  _ctor.prototype.onMusicVolumeSlider = function (t) {
    this.musicVolumeSlider.progress = t.progress;
    this.musicVolumePro.fillRange = t.progress;
    $10AudioManager.AudioManager.instance.setBgmVolume(t.progress);
    $10UserSetDataProxy.userSetDataProxy.setData.musicVolume = t.progress;
    this.mMusicVolumeLab.string = (100 * $10UserSetDataProxy.userSetDataProxy.setData.musicVolume).toFixed(0);
  };
  _ctor.prototype.onEffectVolumeSlider = function (t) {
    this.effectVolumeSlider.progress = t.progress;
    this.effectVolumePro.fillRange = t.progress;
    $10AudioManager.AudioManager.instance.setEffectVolume(t.progress);
    $10UserSetDataProxy.userSetDataProxy.setData.effectVolume = t.progress;
    this.mEffectVolumeLab.string = (100 * $10UserSetDataProxy.userSetDataProxy.setData.effectVolume).toFixed(0);
  };
  _ctor.prototype.onClickBtnShake = function () {
    $10UserSetDataProxy.userSetDataProxy.setVibrate(!$10UserSetDataProxy.userSetDataProxy.setData.isOpenShake);
    this.updateView();
  };
  _ctor.prototype.onClickBtnBack = function () {
    $10STJDataProxy.sTJDataProxy.STJData.btnStartTime = new Date().getTime();
    $10STJDataProxy.sTJDataProxy.saveData();
    this.removeUI();
    $10SceneManager.SceneManager.instance.runScene("Home", "", function () {
      $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.ENTER_GAME);
    });
  };
  _ctor.prototype.onClickBtnClose = function () {
    $10STJDataProxy.sTJDataProxy.gameState == $10GameEnum.GameState.PAUSE && ($10STJDataProxy.sTJDataProxy.gameState = $10GameEnum.GameState.PLAYING);
    this.removeUI();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nShake", undefined);
  cc__decorate([ccp_property(cc.Slider)], _ctor.prototype, "musicVolumeSlider", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "musicVolumePro", undefined);
  cc__decorate([ccp_property(cc.Slider)], _ctor.prototype, "effectVolumeSlider", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "effectVolumePro", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mMusicVolumeLab", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mEffectVolumeLab", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mShakeLab", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_STSettingPopup;