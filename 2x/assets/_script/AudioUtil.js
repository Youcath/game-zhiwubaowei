Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.audioUtil = exports.AudioUtil = undefined;
var $10AudioManager = require("AudioManager");
var $10SqlUtil = require("SqlUtil");
var exp_AudioUtil = function () {
  function _ctor() {
    this._vibrate = 1;
    this._shockScreen = 1;
  }
  Object.defineProperty(_ctor.prototype, "vibrate", {
    get: function () {
      return this._vibrate;
    },
    set: function (t) {
      $10SqlUtil.SqlUtil.set("vibrate", t);
      this._vibrate = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "shockScreen", {
    get: function () {
      return this._shockScreen;
    },
    set: function (t) {
      $10SqlUtil.SqlUtil.set("shockScreen", t);
      this._shockScreen = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.init = function () {
    this._vibrate = $10SqlUtil.SqlUtil.get("vibrate", 1);
    this._shockScreen = $10SqlUtil.SqlUtil.get("shockScreen", 1);
  };
  _ctor.prototype.vibrateShort = function () {
    this.vibrate;
  };
  _ctor.prototype.vibrateLong = function () {
    this.vibrate;
  };
  _ctor.prototype.playBtnAudio = function () {
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/click", "Res");
  };
  return _ctor;
}();
exports.AudioUtil = exp_AudioUtil;
exports.audioUtil = new exp_AudioUtil();