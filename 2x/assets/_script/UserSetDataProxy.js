var i;
var cc__extends = __extends;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userSetDataProxy = exports.SetData = undefined;
var $10AudioManager = require("AudioManager");
var $10ProxyBase = require("ProxyBase");
var $10EventManager = require("EventManager");
var $10GameEnum = require("GameEnum");
var $10DataManager = require("DataManager");
var exp_SetData = function () {
  this.isOpenShake = true;
  this.musicVolume = 1;
  this.effectVolume = 1;
};
exports.SetData = exp_SetData;
var def_UserSetDataProxy = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.notActiveTime = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initData = function () {
    $10EventManager.EventManager.instance.on($10GameEnum.EGameEvent.SCENE_TOUCH_START, this.onSceneTouch, this);
    $10AudioManager.AudioManager.instance.setBgmVolume(this._data.musicVolume);
    $10AudioManager.AudioManager.instance.setEffectVolume(this._data.effectVolume);
  };
  Object.defineProperty(_ctor.prototype, "setData", {
    get: function () {
      return this._data;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.updateSecond = function () {};
  _ctor.prototype.onSceneTouch = function () {
    this.resetNotActiveTime();
  };
  _ctor.prototype.resetNotActiveTime = function () {
    this.notActiveTime = 0;
  };
  _ctor.prototype.setEffectAudio = function (t) {
    $10AudioManager.AudioManager.instance.isOpenEffectAudio = t;
    this.saveData();
  };
  _ctor.prototype.setBackgroundAudio = function (t) {
    $10AudioManager.AudioManager.instance.isOpenBackgroundAudio = t;
    this.saveData();
  };
  _ctor.prototype.setVibrate = function (t) {
    this.setData.isOpenShake = t;
    this.saveData();
  };
  _ctor.prototype.saveData = function () {
    $10DataManager.DataManager.instance.writeGameDataBase($10ProxyBase.ProxyKey.SetData, this.setData);
  };
  return _ctor;
}($10ProxyBase.ProxyBase);
exports.default = def_UserSetDataProxy;
exports.userSetDataProxy = new def_UserSetDataProxy(exp_SetData);