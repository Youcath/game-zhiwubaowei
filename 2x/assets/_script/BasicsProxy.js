var i;
var cc__extends = __extends;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basicsProxy = undefined;
var $10ProxyBase = require("ProxyBase");
var $10TimeUtil = require("TimeUtil");
var s = function (t) {
  function e() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(e, t);
  Object.defineProperty(e.prototype, "bgmVolume", {
    get: function () {
      return this._data.bgm_volume;
    },
    set: function (t) {
      this._data.bgm_volume = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(e.prototype, "effectVolume", {
    get: function () {
      return this._data.effect_volume;
    },
    set: function (t) {
      this._data.effect_volume = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(e.prototype, "vibrateEnable", {
    get: function () {
      return this._data.vibrate_enable;
    },
    set: function (t) {
      this._data.vibrate_enable = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(e.prototype, "followTime", {
    get: function () {
      return this._data.follow_time;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(e.prototype, "shortcutTime", {
    get: function () {
      return this._data.shortcut_time;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(e.prototype, "favoriteGuideTime", {
    get: function () {
      return this._data.favorite_guide_time;
    },
    enumerable: false,
    configurable: true
  });
  e.prototype.addCustomAdNum = function () {
    this._data.custom_ad_num = (this._data.custom_ad_num || 0) + 1;
  };
  e.prototype.saveSettings = function () {};
  e.prototype.getTodayNum = function (t) {
    this._checkSameDay();
    return this._data.today_num[t] || 0;
  };
  e.prototype._checkSameDay = function () {
    var t = $10TimeUtil.TimeUtil.getTime();
    if (!$10TimeUtil.TimeUtil.isSameDay(t, this._data.sync_time)) {
      for (var e in this._data.today_num) {
        this._data.today_num[e] = 0;
      }
      this._data.sync_time = t;
    }
  };
  return e;
}($10ProxyBase.ProxyBase);
exports.basicsProxy = new s(function () {
  this.bgm_volume = 1;
  this.effect_volume = 1;
  this.vibrate_enable = true;
  this.follow_time = 0;
  this.shortcut_time = 0;
  this.favorite_guide_time = 0;
  this.rv_sum = 0;
  this.rv_list = "";
  this.custom_ad_num = 0;
  this.today_num = {};
  this.sync_time = 0;
  this.push_id = null;
  this.push_open_time = 0;
});