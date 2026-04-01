var cc__read = __read;
var cc__spread = __spread;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringBuffer = exports.StringUtil = undefined;
(function (t) {
  function e(t) {
    return null == t || "" === t;
  }
  function o() {
    var t = [];
    for (var o = 0; o < arguments.length; o++) {
      t[o] = arguments[o];
    }
    if (null == t || 0 == t.length) {
      return true;
    }
    for (var i in t) {
      if (e(i)) {
        return true;
      }
    }
    return false;
  }
  t.formatDescStr = function (t, e, o, i) {
    undefined === i && (i = /\[(.*?)\]/g);
    return t.replace(i, function (t, i) {
      var n = false;
      var a = i;
      if (i.includes("%")) {
        n = true;
        a = i.slice(0, i.length - 1);
      }
      if (e.hasOwnProperty(a)) {
        var r = e[a];
        if (n) {
          return "string" == typeof r && (r = r.split("|").map(Number)[o - 1]), r *= 100, (r = Math.round(100 * r) / 100) % 1 == 0 ? Math.floor(r) + "%" : r + "%";
        } else {
          return "string" == typeof r && (r = r.split("|").map(Number)[o - 1]), r;
        }
      }
      return t;
    });
  };
  t.transRichText = function (t, e) {
    undefined === e && (e = "#69FF3A");
    return "<outline color=black width=1>" + t.replace(/(\d+%)|(\d+\u79d2)|(\d+)/g, function (t) {
      return "<color=" + e + ">" + t + "</color>";
    }) + "</color>";
  };
  t.isEmpty = e;
  t.isNotEmpty = function (t) {
    return !e(t);
  };
  t.isAnyEmpty = o;
  t.isNoneEmpty = function () {
    var t = [];
    for (var e = 0; e < arguments.length; e++) {
      t[e] = arguments[e];
    }
    return !o.apply(undefined, cc__spread(t));
  };
  t.versionCompare = function (t, e) {
    var o = t.split(".");
    var i = e.split(".");
    for (var n = 0; n < o.length; n++) {
      if (null == i[n]) {
        return 1;
      }
      if (o[n] != i[n]) {
        return Number(o[n]) - Number(i[n]);
      }
    }
    return 0;
  };
  t.copyObj = function t(e) {
    var o;
    o = "[object Array]" === Object.prototype.toString.call(e) ? [] : {};
    for (var i in e) {
      if (null == e[i]) {
        o[i] = e[i];
      } else if ("object" == typeof e[i]) {
        o[i] = t(e[i]);
      } else {
        o[i] = e[i];
      }
    }
    return o;
  };
  t.strLenLimit = function (t, e, o) {
    undefined === e && (e = 8);
    undefined === o && (o = "...");
    var i = t;
    if (t.length > e) {
      i = t.substring(0, e);
      i += o;
    }
    return i;
  };
})(exports.StringUtil || (exports.StringUtil = {}));
var exp_StringBuffer = function () {
  function _ctor() {
    this._strings = new Array();
  }
  _ctor.prototype.append = function (t) {
    this._strings.push(t);
  };
  _ctor.prototype.toString = function () {
    return this._strings.join("");
  };
  return _ctor;
}();
exports.StringBuffer = exp_StringBuffer;