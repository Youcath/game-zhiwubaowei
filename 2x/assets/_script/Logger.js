var i;
var cc__read = __read;
var cc__spread = __spread;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logger = exports.LoggerLevel = undefined;
(function (t) {
  t[t.OFF = 0] = "OFF";
  t[t.ERROR = 1] = "ERROR";
  t[t.WARN = 2] = "WARN";
  t[t.INFO = 3] = "INFO";
  t[t.DEBUG = 4] = "DEBUG";
  t[t.ALL = 5] = "ALL";
})(i = exports.LoggerLevel || (exports.LoggerLevel = {}));
(function (t) {
  var e = "[ZS]";
  var o = 0;
  function n() {
    var t = [];
    for (var n = 0; n < arguments.length; n++) {
      t[n] = arguments[n];
    }
    o === i.ALL && console.log.apply(console, cc__spread([e], t));
  }
  function r() {
    var t = [];
    for (var n = 0; n < arguments.length; n++) {
      t[n] = arguments[n];
    }
    o >= i.DEBUG && console.debug.apply(console, cc__spread([e], t));
  }
  function s() {
    var t = [];
    for (var n = 0; n < arguments.length; n++) {
      t[n] = arguments[n];
    }
    o >= i.INFO && console.info.apply(console, cc__spread([e], t));
  }
  function c() {
    var t = [];
    for (var n = 0; n < arguments.length; n++) {
      t[n] = arguments[n];
    }
    o >= i.WARN && console.warn.apply(console, cc__spread([e], t));
  }
  function l() {
    var t = [];
    for (var n = 0; n < arguments.length; n++) {
      t[n] = arguments[n];
    }
    o >= i.ERROR && console.error.apply(console, cc__spread([e], t));
  }
  t.setLoggerLevel = function (t) {
    o = t;
  };
  t.log = n;
  t.debug = r;
  t.info = s;
  t.warn = c;
  t.error = l;
  t.v = function () {
    var t = [];
    for (var e = 0; e < arguments.length; e++) {
      t[e] = arguments[e];
    }
    n.apply(undefined, cc__spread(t));
  };
  t.d = function () {
    var t = [];
    for (var e = 0; e < arguments.length; e++) {
      t[e] = arguments[e];
    }
    r.apply(undefined, cc__spread(t));
  };
  t.i = function () {
    var t = [];
    for (var e = 0; e < arguments.length; e++) {
      t[e] = arguments[e];
    }
    s.apply(undefined, cc__spread(t));
  };
  t.w = function () {
    var t = [];
    for (var e = 0; e < arguments.length; e++) {
      t[e] = arguments[e];
    }
    c.apply(undefined, cc__spread(t));
  };
  t.e = function () {
    var t = [];
    for (var e = 0; e < arguments.length; e++) {
      t[e] = arguments[e];
    }
    l.apply(undefined, cc__spread(t));
  };
  t.realtimeDebug = function () {};
  t.realtimeInfo = function () {};
  t.realtimeWarn = function () {};
  t.realtimeError = function () {};
  t.setRealtimeFilterMsg = function () {};
  t.addRealtimeFilterMsg = function () {};
})(exports.Logger || (exports.Logger = {}));