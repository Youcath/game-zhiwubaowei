(function (t, i) {
  "use strict";

  (function (t, i) {
    var n;
    var a;
    if ("object" == typeof exports && undefined !== module) {
      module.exports = i();
    } else if ("function" == typeof define && define.amd) {
      define(i);
    } else {
      n = t.Base64;
      (a = i()).noConflict = function () {
        t.Base64 = n;
        return a;
      };
      t.Meteor && (Base64 = a);
      t.Base64 = a;
    }
  })("undefined" != typeof self ? self : "undefined" != typeof window ? window : undefined !== t ? t : undefined, function () {
    var t;
    var e = "function" == typeof i;
    var o = "function" == typeof TextDecoder ? new TextDecoder() : undefined;
    var n = "function" == typeof TextEncoder ? new TextEncoder() : undefined;
    var a = Array.prototype.slice.call("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=");
    t = {};
    a.forEach(function (e, o) {
      return t[e] = o;
    });
    var r = t;
    var s = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
    var c = String.fromCharCode.bind(String);
    var l = "function" == typeof Uint8Array.from ? Uint8Array.from.bind(Uint8Array) : function (t) {
      return new Uint8Array(Array.prototype.slice.call(t, 0));
    };
    var u = function (t) {
      return t.replace(/=/g, "").replace(/[+\/]/g, function (t) {
        if ("+" == t) {
          return "-";
        } else {
          return "_";
        }
      });
    };
    var p = function (t) {
      return t.replace(/[^A-Za-z0-9\+\/]/g, "");
    };
    var h = function (t) {
      var e;
      var o;
      var i;
      var n;
      var r = "";
      var s = t.length % 3;
      for (var c = 0; c < t.length;) {
        if ((o = t.charCodeAt(c++)) > 255 || (i = t.charCodeAt(c++)) > 255 || (n = t.charCodeAt(c++)) > 255) {
          throw new TypeError("invalid character found");
        }
        r += a[(e = o << 16 | i << 8 | n) >> 18 & 63] + a[e >> 12 & 63] + a[e >> 6 & 63] + a[63 & e];
      }
      if (s) {
        return r.slice(0, s - 3) + "===".substring(s);
      } else {
        return r;
      }
    };
    var d = "function" == typeof btoa ? function (t) {
      return btoa(t);
    } : e ? function (t) {
      return i.from(t, "binary").toString("base64");
    } : h;
    var m = e ? function (t) {
      return i.from(t).toString("base64");
    } : function (t) {
      var e = [];
      var o = 0;
      for (var i = t.length; o < i; o += 4096) {
        e.push(c.apply(null, t.subarray(o, o + 4096)));
      }
      return d(e.join(""));
    };
    var f = function (t, e) {
      undefined === e && (e = false);
      if (e) {
        return u(m(t));
      } else {
        return m(t);
      }
    };
    var y = function (t) {
      if (t.length < 2) {
        if ((e = t.charCodeAt(0)) < 128) {
          return t;
        } else {
          if (e < 2048) {
            return c(192 | e >>> 6) + c(128 | 63 & e);
          } else {
            return c(224 | e >>> 12 & 15) + c(128 | e >>> 6 & 63) + c(128 | 63 & e);
          }
        }
      }
      var e = 65536 + 1024 * (t.charCodeAt(0) - 55296) + (t.charCodeAt(1) - 56320);
      return c(240 | e >>> 18 & 7) + c(128 | e >>> 12 & 63) + c(128 | e >>> 6 & 63) + c(128 | 63 & e);
    };
    var g = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var _ = function (t) {
      return t.replace(g, y);
    };
    var v = e ? function (t) {
      return i.from(t, "utf8").toString("base64");
    } : n ? function (t) {
      return m(n.encode(t));
    } : function (t) {
      return d(_(t));
    };
    var b = function (t, e) {
      undefined === e && (e = false);
      if (e) {
        return u(v(t));
      } else {
        return v(t);
      }
    };
    var P = function (t) {
      return b(t, true);
    };
    var D = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    var S = function (t) {
      switch (t.length) {
        case 4:
          var e = ((7 & t.charCodeAt(0)) << 18 | (63 & t.charCodeAt(1)) << 12 | (63 & t.charCodeAt(2)) << 6 | 63 & t.charCodeAt(3)) - 65536;
          return c(55296 + (e >>> 10)) + c(56320 + (1023 & e));
        case 3:
          return c((15 & t.charCodeAt(0)) << 12 | (63 & t.charCodeAt(1)) << 6 | 63 & t.charCodeAt(2));
        default:
          return c((31 & t.charCodeAt(0)) << 6 | 63 & t.charCodeAt(1));
      }
    };
    var E = function (t) {
      return t.replace(D, S);
    };
    var C = function (t) {
      t = t.replace(/\s+/g, "");
      if (!s.test(t)) {
        throw new TypeError("malformed base64.");
      }
      t += "==".slice(2 - (3 & t.length));
      var e;
      var o;
      var i;
      var n = "";
      for (var a = 0; a < t.length;) {
        e = r[t.charAt(a++)] << 18 | r[t.charAt(a++)] << 12 | (o = r[t.charAt(a++)]) << 6 | (i = r[t.charAt(a++)]);
        n += 64 === o ? c(e >> 16 & 255) : 64 === i ? c(e >> 16 & 255, e >> 8 & 255) : c(e >> 16 & 255, e >> 8 & 255, 255 & e);
      }
      return n;
    };
    var B = "function" == typeof atob ? function (t) {
      return atob(p(t));
    } : e ? function (t) {
      return i.from(t, "base64").toString("binary");
    } : C;
    var x = e ? function (t) {
      return l(i.from(t, "base64"));
    } : function (t) {
      return l(B(t).split("").map(function (t) {
        return t.charCodeAt(0);
      }));
    };
    var M = function (t) {
      return x(A(t));
    };
    var w = e ? function (t) {
      return i.from(t, "base64").toString("utf8");
    } : o ? function (t) {
      return o.decode(x(t));
    } : function (t) {
      return E(B(t));
    };
    var A = function (t) {
      return p(t.replace(/[-_]/g, function (t) {
        if ("-" == t) {
          return "+";
        } else {
          return "/";
        }
      }));
    };
    var R = function (t) {
      return w(A(t));
    };
    var O = function (t) {
      return {
        value: t,
        enumerable: false,
        writable: true,
        configurable: true
      };
    };
    var N = function () {
      var t = function (t, e) {
        return Object.defineProperty(String.prototype, t, O(e));
      };
      t("fromBase64", function () {
        return R(this);
      });
      t("toBase64", function (t) {
        return b(this, t);
      });
      t("toBase64URI", function () {
        return b(this, true);
      });
      t("toBase64URL", function () {
        return b(this, true);
      });
      t("toUint8Array", function () {
        return M(this);
      });
    };
    var I = function () {
      var t = function (t, e) {
        return Object.defineProperty(Uint8Array.prototype, t, O(e));
      };
      t("toBase64", function (t) {
        return f(this, t);
      });
      t("toBase64URI", function () {
        return f(this, true);
      });
      t("toBase64URL", function () {
        return f(this, true);
      });
    };
    var T = {
      version: "3.7.7",
      VERSION: "3.7.7",
      atob: B,
      atobPolyfill: C,
      btoa: d,
      btoaPolyfill: h,
      fromBase64: R,
      toBase64: b,
      encode: b,
      encodeURI: P,
      encodeURL: P,
      utob: _,
      btou: E,
      decode: R,
      isValid: function (t) {
        if ("string" != typeof t) {
          return false;
        }
        var e = t.replace(/\s+/g, "").replace(/={0,2}$/, "");
        return !/[^\s0-9a-zA-Z\+/]/.test(e) || !/[^\s0-9a-zA-Z\-_]/.test(e);
      },
      fromUint8Array: f,
      toUint8Array: M,
      extendString: N,
      extendUint8Array: I,
      extendBuiltins: function () {
        N();
        I();
      },
      Base64: {}
    };
    Object.keys(T).forEach(function (t) {
      return T.Base64[t] = T[t];
    });
    return T;
  });
}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, require("2").Buffer);