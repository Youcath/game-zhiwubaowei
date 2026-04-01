Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StroageMgr = exports.Encrypt = exports.StroageDict = undefined;
exports.StroageDict = {
  LastResetDate: {
    k: "LastResetDate",
    v: 0
  }
};
exports.Encrypt = {
  encrypt: function (t) {
    var e = String.fromCharCode(t.charCodeAt(0) + t.length);
    for (var o = 1; o < t.length; o++) {
      e += String.fromCharCode(t.charCodeAt(o) + t.charCodeAt(o - 1));
    }
    return escape(e);
  },
  decrypt: function (t) {
    t = unescape(t);
    var e = String.fromCharCode(t.charCodeAt(0) - t.length);
    for (var o = 1; o < t.length; o++) {
      e += String.fromCharCode(t.charCodeAt(o) - e.charCodeAt(o - 1));
    }
    return e;
  }
};
var exp_StroageMgr = function () {
  function _ctor() {}
  Object.defineProperty(_ctor, "Inst", {
    get: function () {
      return this.inst || (this.inst = new this());
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.clear = function () {
    var t = this.getNumber(exports.StroageDict.LastResetDate);
    cc.sys.localStorage.clear();
    this.setValue(exports.StroageDict.LastResetDate, t);
  };
  _ctor.prototype.getNumber = function (t) {
    var e = cc.sys.localStorage.getItem(t.k);
    var i = null;
    if (0 === e) {
      return 0;
    } else {
      return i = e ? exports.Encrypt.decrypt(e) : t.v, Number(i);
    }
  };
  _ctor.prototype.getString = function (t) {
    var e;
    var i = cc.sys.localStorage.getItem(t.k);
    e = i ? exports.Encrypt.decrypt(i) : t.v;
    return String(e);
  };
  _ctor.prototype.getBoolean = function (t) {
    var e = cc.sys.localStorage.getItem(t.k) + "";
    if (!e) {
      return t.v;
    }
    var i = exports.Encrypt.decrypt(e);
    if ("true" != i && "false" != i) {
      return t.v;
    } else {
      return "false" != i;
    }
  };
  _ctor.prototype.getObject = function (t) {
    var e = cc.sys.localStorage.getItem(t.k);
    if (!e) {
      return t.v;
    }
    var i = exports.Encrypt.decrypt(e);
    return JSON.parse(i);
  };
  _ctor.prototype.setValue = function (t, e) {
    "object" == typeof e && (e = JSON.stringify(e));
    e = exports.Encrypt.encrypt(e + "");
    cc.sys.localStorage.setItem(t.k, e);
  };
  _ctor.inst = null;
  return _ctor;
}();
exports.StroageMgr = exp_StroageMgr;