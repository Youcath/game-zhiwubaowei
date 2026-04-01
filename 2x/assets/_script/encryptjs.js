(function (i) {
  "use strict";

  (function (t, i) {
    if (undefined !== exports && undefined !== module) {
      module.exports = i();
    } else if ("function" == typeof define && "object" == typeof define.amd) {
      define(i);
    } else if ("function" == typeof define && "object" == typeof define.petal) {
      define("encryptjs", [], i);
    } else {
      this.encryptjs = i();
    }
  })(0, function (o) {
    (o = {
      version: "1.0.0"
    }).init = function () {
      console.log("--------------------Applying Encryption Algorithm------------------ ");
    };
    if (undefined !== module && module.exports) {
      var n = require("algo");
    }
    o.encrypt = function (t, e, i) {
      if (128 != i && 192 != i && 256 != i) {
        return "";
      }
      t = String(t).utf8Encode();
      e = String(e).utf8Encode();
      var a = i / 8;
      var r = new Array(a);
      for (var s = 0; s < a; s++) {
        r[s] = isNaN(e.charCodeAt(s)) ? 0 : e.charCodeAt(s);
      }
      var c = n.cipher(r, n.keyExpansion(r));
      c = c.concat(c.slice(0, a - 16));
      var l = new Array(16);
      var u = new Date().getTime();
      var p = u % 1e3;
      var h = Math.floor(u / 1e3);
      var d = Math.floor(65535 * Math.random());
      for (s = 0; s < 2; s++) {
        l[s] = p >>> 8 * s & 255;
      }
      for (s = 0; s < 2; s++) {
        l[s + 2] = d >>> 8 * s & 255;
      }
      for (s = 0; s < 4; s++) {
        l[s + 4] = h >>> 8 * s & 255;
      }
      var m = "";
      for (s = 0; s < 8; s++) {
        m += String.fromCharCode(l[s]);
      }
      var f = n.keyExpansion(c);
      var y = Math.ceil(t.length / 16);
      var g = new Array(y);
      for (var _ = 0; _ < y; _++) {
        for (var v = 0; v < 4; v++) {
          l[15 - v] = _ >>> 8 * v & 255;
        }
        for (v = 0; v < 4; v++) {
          l[15 - v - 4] = _ / 4294967296 >>> 8 * v;
        }
        var b = n.cipher(l, f);
        var P = _ < y - 1 ? 16 : (t.length - 1) % 16 + 1;
        var D = new Array(P);
        for (s = 0; s < P; s++) {
          D[s] = b[s] ^ t.charCodeAt(16 * _ + s);
          D[s] = String.fromCharCode(D[s]);
        }
        g[_] = D.join("");
      }
      var S = m + g.join("");
      return o.base64Encode(S);
    };
    o.decrypt = function (t, e, i) {
      if (128 != i && 192 != i && 256 != i) {
        return "";
      }
      t = o.base64Decode(String(t));
      e = String(e).utf8Encode();
      var a = i / 8;
      var r = new Array(a);
      for (var s = 0; s < a; s++) {
        r[s] = isNaN(e.charCodeAt(s)) ? 0 : e.charCodeAt(s);
      }
      var c = n.cipher(r, n.keyExpansion(r));
      c = c.concat(c.slice(0, a - 16));
      var l = new Array(8);
      var u = t.slice(0, 8);
      for (s = 0; s < 8; s++) {
        l[s] = u.charCodeAt(s);
      }
      var p = n.keyExpansion(c);
      var h = Math.ceil((t.length - 8) / 16);
      var d = new Array(h);
      for (var m = 0; m < h; m++) {
        d[m] = t.slice(8 + 16 * m, 24 + 16 * m);
      }
      t = d;
      var f = new Array(t.length);
      for (m = 0; m < h; m++) {
        for (var y = 0; y < 4; y++) {
          l[15 - y] = m >>> 8 * y & 255;
        }
        for (y = 0; y < 4; y++) {
          l[15 - y - 4] = (m + 1) / 4294967296 - 1 >>> 8 * y & 255;
        }
        var g = n.cipher(l, p);
        var _ = new Array(t[m].length);
        for (s = 0; s < t[m].length; s++) {
          _[s] = g[s] ^ t[m].charCodeAt(s);
          _[s] = String.fromCharCode(_[s]);
        }
        f[m] = _.join("");
      }
      var v = f.join("");
      return v.utf8Decode();
    };
    var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    o.base64Encode = function (t) {
      var e;
      var i;
      var n;
      var r;
      var s;
      var c;
      var l;
      var u = "";
      var p = 0;
      for (t = o._utf8_encode(t); p < t.length;) {
        r = (e = t.charCodeAt(p++)) >> 2;
        s = (3 & e) << 4 | (i = t.charCodeAt(p++)) >> 4;
        c = (15 & i) << 2 | (n = t.charCodeAt(p++)) >> 6;
        l = 63 & n;
        if (isNaN(i)) {
          c = l = 64;
        } else {
          isNaN(n) && (l = 64);
        }
        u = u + a.charAt(r) + a.charAt(s) + a.charAt(c) + a.charAt(l);
      }
      return u;
    };
    o.base64Decode = function (t) {
      var e;
      var i;
      var n;
      var r;
      var s;
      var c;
      var l = "";
      var u = 0;
      for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); u < t.length;) {
        e = a.indexOf(t.charAt(u++)) << 2 | (r = a.indexOf(t.charAt(u++))) >> 4;
        i = (15 & r) << 4 | (s = a.indexOf(t.charAt(u++))) >> 2;
        n = (3 & s) << 6 | (c = a.indexOf(t.charAt(u++)));
        l += String.fromCharCode(e);
        64 != s && (l += String.fromCharCode(i));
        64 != c && (l += String.fromCharCode(n));
      }
      return o._utf8_decode(l);
    };
    o._utf8_encode = function (t) {
      t = t.replace(/\r\n/g, "\n");
      var e = "";
      for (var o = 0; o < t.length; o++) {
        var i = t.charCodeAt(o);
        if (i < 128) {
          e += String.fromCharCode(i);
        } else if (i > 127 && i < 2048) {
          e += String.fromCharCode(i >> 6 | 192);
          e += String.fromCharCode(63 & i | 128);
        } else {
          e += String.fromCharCode(i >> 12 | 224);
          e += String.fromCharCode(i >> 6 & 63 | 128);
          e += String.fromCharCode(63 & i | 128);
        }
      }
      return e;
    };
    o._utf8_decode = function (t) {
      var e = "";
      var o = 0;
      var i = 0;
      for (var n = 0; o < t.length;) {
        if ((i = t.charCodeAt(o)) < 128) {
          e += String.fromCharCode(i);
          o++;
        } else if (i > 191 && i < 224) {
          n = t.charCodeAt(o + 1);
          e += String.fromCharCode((31 & i) << 6 | 63 & n);
          o += 2;
        } else {
          n = t.charCodeAt(o + 1);
          c3 = t.charCodeAt(o + 2);
          e += String.fromCharCode((15 & i) << 12 | (63 & n) << 6 | 63 & c3);
          o += 3;
        }
      }
      return e;
    };
    o.getTextEncryptAndSaveToTextFile = function () {
      throw Error("Command line not supported on this platform");
    };
    o.getTextEncryptAndSaveToJSONFile = function () {
      throw Error("Command line not supported on this platform");
    };
    o.writeCipherTextToJSON = function (t, e, o, i) {
      if (null == i) {
        i = o;
        o = {};
      }
      var n = "object" == typeof o && null !== o && "spaces" in o ? o.spaces : this.spaces;
      try {
        JSON.stringify(e, o ? o.replacer : null, n);
      } catch (a) {
        if (i) {
          return i(a, null);
        }
      }
    };
    undefined === String.prototype.utf8Encode && (String.prototype.utf8Encode = function () {
      return unescape(encodeURIComponent(this));
    });
    undefined === String.prototype.utf8Decode && (String.prototype.utf8Decode = function () {
      try {
        return decodeURIComponent(escape(this));
      } catch (t) {
        return this;
      }
    });
    undefined === String.prototype.base64Encode && (String.prototype.base64Encode = function () {
      if ("undefined" != typeof btoa) {
        return btoa(this);
      }
      if (undefined !== i) {
        return new i(this, "utf8").toString("base64");
      }
      throw new Error("No Base64 Encode");
    });
    undefined === String.prototype.base64Decode && (String.prototype.base64Decode = function () {
      if ("undefined" != typeof atob) {
        return atob(this);
      }
      if (undefined !== i) {
        return new i(this, "base64").toString("utf8");
      }
      throw new Error("No Base64 Decode");
    });
    o.init();
    window.EncryptJS = o;
    return o;
  });
}).call(this, require("2").Buffer);