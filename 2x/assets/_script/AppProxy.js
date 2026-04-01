var i;
var cc__extends = __extends;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appProxy = exports.BgmTypes = exports.AppEvent = undefined;
var $10ProxyBase = require("ProxyBase");
(function (t) {
  t.POPUP_SHOW = "APP_POPUP_SHOW";
  t.POPUP_HIDE = "APP_POPUP_HIDE";
  t.ENTER_GAME = "APP_ENTER_GAME";
  t.AUDIO_CLICK = "APP_AUDIO_CLICK";
  t.BGM_CHANGED = "BGM_CHANGED";
  t.BGM_CHANGE_TOP = "BGM_CHANGE_TOP";
  t.POPUP_CHANGED = "APP_POPUP_CHANGED";
  t.SCENE_CHANGED = "APP_SCENE_CHANGED";
  t.FRAGMENT_CHANGED = "APP_FRAGMENT_CHANGED";
  t.STYLE = "APP_STYLE";
  t.DAY_UPDATE = "APP_DAY_UPDATE";
  t.FOLLOW_GAME = "APP_FOLLOW_GAME";
  t.ADD_SHORTCUT = "APP_ADD_SHORTCUT";
  t.TIME_DOWN_END = "APP_TIME_DOWN_END";
  t.GAME_SHOW = "APP_GAME_SHOW";
  t.GAME_HIDE = "APP_GAME_HIDE";
  t.GET_SIDEBAR = "GET_SIDEBAR";
})(exports.AppEvent || (exports.AppEvent = {}));
(function (t) {
  t[t.none = 0] = "none";
  t[t.close = 1] = "close";
  t[t.open = 2] = "open";
  t[t.load = 3] = "load";
  t[t.main = 4] = "main";
  t[t.draw = 5] = "draw";
  t[t.battle_ready = 6] = "battle_ready";
  t[t.battle = 7] = "battle";
})(exports.BgmTypes || (exports.BgmTypes = {}));
var r = function (t) {
  function e() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(e, t);
  Object.defineProperty(e.prototype, "clientVersion", {
    get: function () {
      return this._data.clientVersion;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(e.prototype, "clientCode", {
    get: function () {
      return this._data.clientCode;
    },
    enumerable: false,
    configurable: true
  });
  e.prototype.setClientVersion = function (t, e) {
    this._data.clientVersion = t;
    this._data.clientCode = e;
  };
  Object.defineProperty(e.prototype, "buttonSound", {
    get: function () {
      return this._data.buttonSound;
    },
    set: function (t) {
      this._data.buttonSound = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(e.prototype, "autoRef", {
    get: function () {
      return this._data.autoRef;
    },
    enumerable: false,
    configurable: true
  });
  return e;
}($10ProxyBase.ProxyBase);
exports.appProxy = new r(function () {
  this.privacyUrl = null;
  this.agreementUrl = null;
  this.clientVersion = null;
  this.clientCode = 0;
  this.autoRef = true;
  this.buttonSound = null;
});