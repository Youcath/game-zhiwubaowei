// buffer
(function (e) {
    "use strict";

    var i = require("1"),
      n = require("4"),
      a = require("3");
    function r() {
      return c.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
    }
    function s(t, e) {
      if (r() < e) throw new RangeError("Invalid typed array length");
      return c.TYPED_ARRAY_SUPPORT ? (t = new Uint8Array(e)).__proto__ = c.prototype : (null === t && (t = new c(e)), t.length = e), t;
    }
    function c(t, e, o) {
      if (!(c.TYPED_ARRAY_SUPPORT || this instanceof c)) return new c(t, e, o);
      if ("number" == typeof t) {
        if ("string" == typeof e) throw new Error("If encoding is specified then the first argument must be a string");
        return h(this, t);
      }
      return l(this, t, e, o);
    }
    function l(t, e, o, i) {
      if ("number" == typeof e) throw new TypeError('"value" argument must not be a number');
      return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer ? f(t, e, o, i) : "string" == typeof e ? d(t, e, o) : y(t, e);
    }
    function u(t) {
      if ("number" != typeof t) throw new TypeError('"size" argument must be a number');
      if (t < 0) throw new RangeError('"size" argument must not be negative');
    }
    function p(t, e, o, i) {
      return u(e), e <= 0 ? s(t, e) : void 0 !== o ? "string" == typeof i ? s(t, e).fill(o, i) : s(t, e).fill(o) : s(t, e);
    }
    function h(t, e) {
      if (u(e), t = s(t, e < 0 ? 0 : 0 | g(e)), !c.TYPED_ARRAY_SUPPORT) for (var o = 0; o < e; ++o) t[o] = 0;
      return t;
    }
    function d(t, e, o) {
      if ("string" == typeof o && "" !== o || (o = "utf8"), !c.isEncoding(o)) throw new TypeError('"encoding" must be a valid string encoding');
      var i = 0 | _(e, o),
        n = (t = s(t, i)).write(e, o);
      return n !== i && (t = t.slice(0, n)), t;
    }
    function m(t, e) {
      var o = e.length < 0 ? 0 : 0 | g(e.length);
      t = s(t, o);
      for (var i = 0; i < o; i += 1) t[i] = 255 & e[i];
      return t;
    }
    function f(t, e, o, i) {
      if (e.byteLength, o < 0 || e.byteLength < o) throw new RangeError("'offset' is out of bounds");
      if (e.byteLength < o + (i || 0)) throw new RangeError("'length' is out of bounds");
      return e = void 0 === o && void 0 === i ? new Uint8Array(e) : void 0 === i ? new Uint8Array(e, o) : new Uint8Array(e, o, i), c.TYPED_ARRAY_SUPPORT ? (t = e).__proto__ = c.prototype : t = m(t, e), t;
    }
    function y(t, e) {
      if (c.isBuffer(e)) {
        var o = 0 | g(e.length);
        return 0 === (t = s(t, o)).length ? t : (e.copy(t, 0, 0, o), t);
      }
      if (e) {
        if ("undefined" != typeof ArrayBuffer && e.buffer instanceof ArrayBuffer || "length" in e) return "number" != typeof e.length || (i = e.length) != i ? s(t, 0) : m(t, e);
        if ("Buffer" === e.type && a(e.data)) return m(t, e.data);
      }
      var i;
      throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
    }
    function g(t) {
      if (t >= r()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + r().toString(16) + " bytes");
      return 0 | t;
    }
    function _(t, e) {
      if (c.isBuffer(t)) return t.length;
      if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)) return t.byteLength;
      "string" != typeof t && (t = "" + t);
      var o = t.length;
      if (0 === o) return 0;
      for (var i = !1;;) switch (e) {
        case "ascii":
        case "latin1":
        case "binary":
          return o;
        case "utf8":
        case "utf-8":
        case void 0:
          return Y(t).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return 2 * o;
        case "hex":
          return o >>> 1;
        case "base64":
          return X(t).length;
        default:
          if (i) return Y(t).length;
          e = ("" + e).toLowerCase(), i = !0;
      }
    }
    function v(t, e, o) {
      var i = !1;
      if ((void 0 === e || e < 0) && (e = 0), e > this.length) return "";
      if ((void 0 === o || o > this.length) && (o = this.length), o <= 0) return "";
      if ((o >>>= 0) <= (e >>>= 0)) return "";
      for (t || (t = "utf8");;) switch (t) {
        case "hex":
          return T(this, e, o);
        case "utf8":
        case "utf-8":
          return A(this, e, o);
        case "ascii":
          return N(this, e, o);
        case "latin1":
        case "binary":
          return I(this, e, o);
        case "base64":
          return w(this, e, o);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return k(this, e, o);
        default:
          if (i) throw new TypeError("Unknown encoding: " + t);
          t = (t + "").toLowerCase(), i = !0;
      }
    }
    function b(t, e, o) {
      var i = t[e];
      t[e] = t[o], t[o] = i;
    }
    function P(t, e, o, i, n) {
      if (0 === t.length) return -1;
      if ("string" == typeof o ? (i = o, o = 0) : o > 2147483647 ? o = 2147483647 : o < -2147483648 && (o = -2147483648), o = +o, isNaN(o) && (o = n ? 0 : t.length - 1), o < 0 && (o = t.length + o), o >= t.length) {
        if (n) return -1;
        o = t.length - 1;
      } else if (o < 0) {
        if (!n) return -1;
        o = 0;
      }
      if ("string" == typeof e && (e = c.from(e, i)), c.isBuffer(e)) return 0 === e.length ? -1 : D(t, e, o, i, n);
      if ("number" == typeof e) return e &= 255, c.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? n ? Uint8Array.prototype.indexOf.call(t, e, o) : Uint8Array.prototype.lastIndexOf.call(t, e, o) : D(t, [e], o, i, n);
      throw new TypeError("val must be string, number or Buffer");
    }
    function D(t, e, o, i, n) {
      var a,
        r = 1,
        s = t.length,
        c = e.length;
      if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) {
        if (t.length < 2 || e.length < 2) return -1;
        r = 2, s /= 2, c /= 2, o /= 2;
      }
      function l(t, e) {
        return 1 === r ? t[e] : t.readUInt16BE(e * r);
      }
      if (n) {
        var u = -1;
        for (a = o; a < s; a++) if (l(t, a) === l(e, -1 === u ? 0 : a - u)) {
          if (-1 === u && (u = a), a - u + 1 === c) return u * r;
        } else -1 !== u && (a -= a - u), u = -1;
      } else for (o + c > s && (o = s - c), a = o; a >= 0; a--) {
        for (var p = !0, h = 0; h < c; h++) if (l(t, a + h) !== l(e, h)) {
          p = !1;
          break;
        }
        if (p) return a;
      }
      return -1;
    }
    function S(t, e, o, i) {
      o = Number(o) || 0;
      var n = t.length - o;
      i ? (i = Number(i)) > n && (i = n) : i = n;
      var a = e.length;
      if (a % 2 != 0) throw new TypeError("Invalid hex string");
      i > a / 2 && (i = a / 2);
      for (var r = 0; r < i; ++r) {
        var s = parseInt(e.substr(2 * r, 2), 16);
        if (isNaN(s)) return r;
        t[o + r] = s;
      }
      return r;
    }
    function E(t, e, o, i) {
      return Z(Y(e, t.length - o), t, o, i);
    }
    function C(t, e, o, i) {
      return Z(K(e), t, o, i);
    }
    function B(t, e, o, i) {
      return C(t, e, o, i);
    }
    function x(t, e, o, i) {
      return Z(X(e), t, o, i);
    }
    function M(t, e, o, i) {
      return Z(J(e, t.length - o), t, o, i);
    }
    function w(t, e, o) {
      return 0 === e && o === t.length ? i.fromByteArray(t) : i.fromByteArray(t.slice(e, o));
    }
    function A(t, e, o) {
      o = Math.min(t.length, o);
      for (var i = [], n = e; n < o;) {
        var a,
          r,
          s,
          c,
          l = t[n],
          u = null,
          p = l > 239 ? 4 : l > 223 ? 3 : l > 191 ? 2 : 1;
        if (n + p <= o) switch (p) {
          case 1:
            l < 128 && (u = l);
            break;
          case 2:
            128 == (192 & (a = t[n + 1])) && (c = (31 & l) << 6 | 63 & a) > 127 && (u = c);
            break;
          case 3:
            a = t[n + 1], r = t[n + 2], 128 == (192 & a) && 128 == (192 & r) && (c = (15 & l) << 12 | (63 & a) << 6 | 63 & r) > 2047 && (c < 55296 || c > 57343) && (u = c);
            break;
          case 4:
            a = t[n + 1], r = t[n + 2], s = t[n + 3], 128 == (192 & a) && 128 == (192 & r) && 128 == (192 & s) && (c = (15 & l) << 18 | (63 & a) << 12 | (63 & r) << 6 | 63 & s) > 65535 && c < 1114112 && (u = c);
        }
        null === u ? (u = 65533, p = 1) : u > 65535 && (u -= 65536, i.push(u >>> 10 & 1023 | 55296), u = 56320 | 1023 & u), i.push(u), n += p;
      }
      return O(i);
    }
    exports.Buffer = c, exports.SlowBuffer = function (t) {
      return +t != t && (t = 0), c.alloc(+t);
    }, exports.INSPECT_MAX_BYTES = 50, c.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function () {
      try {
        var t = new Uint8Array(1);
        return t.__proto__ = {
          __proto__: Uint8Array.prototype,
          foo: function () {
            return 42;
          }
        }, 42 === t.foo() && "function" == typeof t.subarray && 0 === t.subarray(1, 1).byteLength;
      } catch (e) {
        return !1;
      }
    }(), exports.kMaxLength = r(), c.poolSize = 8192, c._augment = function (t) {
      return t.__proto__ = c.prototype, t;
    }, c.from = function (t, e, o) {
      return l(null, t, e, o);
    }, c.TYPED_ARRAY_SUPPORT && (c.prototype.__proto__ = Uint8Array.prototype, c.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && c[Symbol.species] === c && Object.defineProperty(c, Symbol.species, {
      value: null,
      configurable: !0
    })), c.alloc = function (t, e, o) {
      return p(null, t, e, o);
    }, c.allocUnsafe = function (t) {
      return h(null, t);
    }, c.allocUnsafeSlow = function (t) {
      return h(null, t);
    }, c.isBuffer = function (t) {
      return !(null == t || !t._isBuffer);
    }, c.compare = function (t, e) {
      if (!c.isBuffer(t) || !c.isBuffer(e)) throw new TypeError("Arguments must be Buffers");
      if (t === e) return 0;
      for (var o = t.length, i = e.length, n = 0, a = Math.min(o, i); n < a; ++n) if (t[n] !== e[n]) {
        o = t[n], i = e[n];
        break;
      }
      return o < i ? -1 : i < o ? 1 : 0;
    }, c.isEncoding = function (t) {
      switch (String(t).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;
        default:
          return !1;
      }
    }, c.concat = function (t, e) {
      if (!a(t)) throw new TypeError('"list" argument must be an Array of Buffers');
      if (0 === t.length) return c.alloc(0);
      var o;
      if (void 0 === e) for (e = 0, o = 0; o < t.length; ++o) e += t[o].length;
      var i = c.allocUnsafe(e),
        n = 0;
      for (o = 0; o < t.length; ++o) {
        var r = t[o];
        if (!c.isBuffer(r)) throw new TypeError('"list" argument must be an Array of Buffers');
        r.copy(i, n), n += r.length;
      }
      return i;
    }, c.byteLength = _, c.prototype._isBuffer = !0, c.prototype.swap16 = function () {
      var t = this.length;
      if (t % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (var e = 0; e < t; e += 2) b(this, e, e + 1);
      return this;
    }, c.prototype.swap32 = function () {
      var t = this.length;
      if (t % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (var e = 0; e < t; e += 4) b(this, e, e + 3), b(this, e + 1, e + 2);
      return this;
    }, c.prototype.swap64 = function () {
      var t = this.length;
      if (t % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (var e = 0; e < t; e += 8) b(this, e, e + 7), b(this, e + 1, e + 6), b(this, e + 2, e + 5), b(this, e + 3, e + 4);
      return this;
    }, c.prototype.toString = function () {
      var t = 0 | this.length;
      return 0 === t ? "" : 0 === arguments.length ? A(this, 0, t) : v.apply(this, arguments);
    }, c.prototype.equals = function (t) {
      if (!c.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
      return this === t || 0 === c.compare(this, t);
    }, c.prototype.inspect = function () {
      var t = "",
        e = exports.INSPECT_MAX_BYTES;
      return this.length > 0 && (t = this.toString("hex", 0, e).match(/.{2}/g).join(" "), this.length > e && (t += " ... ")), "<Buffer " + t + ">";
    }, c.prototype.compare = function (t, e, o, i, n) {
      if (!c.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
      if (void 0 === e && (e = 0), void 0 === o && (o = t ? t.length : 0), void 0 === i && (i = 0), void 0 === n && (n = this.length), e < 0 || o > t.length || i < 0 || n > this.length) throw new RangeError("out of range index");
      if (i >= n && e >= o) return 0;
      if (i >= n) return -1;
      if (e >= o) return 1;
      if (this === t) return 0;
      for (var a = (n >>>= 0) - (i >>>= 0), r = (o >>>= 0) - (e >>>= 0), s = Math.min(a, r), l = this.slice(i, n), u = t.slice(e, o), p = 0; p < s; ++p) if (l[p] !== u[p]) {
        a = l[p], r = u[p];
        break;
      }
      return a < r ? -1 : r < a ? 1 : 0;
    }, c.prototype.includes = function (t, e, o) {
      return -1 !== this.indexOf(t, e, o);
    }, c.prototype.indexOf = function (t, e, o) {
      return P(this, t, e, o, !0);
    }, c.prototype.lastIndexOf = function (t, e, o) {
      return P(this, t, e, o, !1);
    }, c.prototype.write = function (t, e, o, i) {
      if (void 0 === e) i = "utf8", o = this.length, e = 0;else if (void 0 === o && "string" == typeof e) i = e, o = this.length, e = 0;else {
        if (!isFinite(e)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        e |= 0, isFinite(o) ? (o |= 0, void 0 === i && (i = "utf8")) : (i = o, o = void 0);
      }
      var n = this.length - e;
      if ((void 0 === o || o > n) && (o = n), t.length > 0 && (o < 0 || e < 0) || e > this.length) throw new RangeError("Attempt to write outside buffer bounds");
      i || (i = "utf8");
      for (var a = !1;;) switch (i) {
        case "hex":
          return S(this, t, e, o);
        case "utf8":
        case "utf-8":
          return E(this, t, e, o);
        case "ascii":
          return C(this, t, e, o);
        case "latin1":
        case "binary":
          return B(this, t, e, o);
        case "base64":
          return x(this, t, e, o);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return M(this, t, e, o);
        default:
          if (a) throw new TypeError("Unknown encoding: " + i);
          i = ("" + i).toLowerCase(), a = !0;
      }
    }, c.prototype.toJSON = function () {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    var R = 4096;
    function O(t) {
      var e = t.length;
      if (e <= R) return String.fromCharCode.apply(String, t);
      for (var o = "", i = 0; i < e;) o += String.fromCharCode.apply(String, t.slice(i, i += R));
      return o;
    }
    function N(t, e, o) {
      var i = "";
      o = Math.min(t.length, o);
      for (var n = e; n < o; ++n) i += String.fromCharCode(127 & t[n]);
      return i;
    }
    function I(t, e, o) {
      var i = "";
      o = Math.min(t.length, o);
      for (var n = e; n < o; ++n) i += String.fromCharCode(t[n]);
      return i;
    }
    function T(t, e, o) {
      var i,
        n = t.length;
      (!e || e < 0) && (e = 0), (!o || o < 0 || o > n) && (o = n);
      for (var a = "", r = e; r < o; ++r) a += (i = t[r]) < 16 ? "0" + i.toString(16) : i.toString(16);
      return a;
    }
    function k(t, e, o) {
      for (var i = t.slice(e, o), n = "", a = 0; a < i.length; a += 2) n += String.fromCharCode(i[a] + 256 * i[a + 1]);
      return n;
    }
    function U(t, e, o) {
      if (t % 1 != 0 || t < 0) throw new RangeError("offset is not uint");
      if (t + e > o) throw new RangeError("Trying to access beyond buffer length");
    }
    function L(t, e, o, i, n, a) {
      if (!c.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (e > n || e < a) throw new RangeError('"value" argument is out of bounds');
      if (o + i > t.length) throw new RangeError("Index out of range");
    }
    function j(t, e, o, i) {
      e < 0 && (e = 65535 + e + 1);
      for (var n = 0, a = Math.min(t.length - o, 2); n < a; ++n) t[o + n] = (e & 255 << 8 * (i ? n : 1 - n)) >>> 8 * (i ? n : 1 - n);
    }
    function F(t, e, o, i) {
      e < 0 && (e = 4294967295 + e + 1);
      for (var n = 0, a = Math.min(t.length - o, 4); n < a; ++n) t[o + n] = e >>> 8 * (i ? n : 3 - n) & 255;
    }
    function G(t, e, o, i) {
      if (o + i > t.length) throw new RangeError("Index out of range");
      if (o < 0) throw new RangeError("Index out of range");
    }
    function H(t, e, o, i, a) {
      return a || G(t, 0, o, 4), n.write(t, e, o, i, 23, 4), o + 4;
    }
    function V(t, e, o, i, a) {
      return a || G(t, 0, o, 8), n.write(t, e, o, i, 52, 8), o + 8;
    }
    c.prototype.slice = function (t, e) {
      var o,
        i = this.length;
      if ((t = ~~t) < 0 ? (t += i) < 0 && (t = 0) : t > i && (t = i), (e = void 0 === e ? i : ~~e) < 0 ? (e += i) < 0 && (e = 0) : e > i && (e = i), e < t && (e = t), c.TYPED_ARRAY_SUPPORT) (o = this.subarray(t, e)).__proto__ = c.prototype;else {
        var n = e - t;
        o = new c(n, void 0);
        for (var a = 0; a < n; ++a) o[a] = this[a + t];
      }
      return o;
    }, c.prototype.readUIntLE = function (t, e, o) {
      t |= 0, e |= 0, o || U(t, e, this.length);
      for (var i = this[t], n = 1, a = 0; ++a < e && (n *= 256);) i += this[t + a] * n;
      return i;
    }, c.prototype.readUIntBE = function (t, e, o) {
      t |= 0, e |= 0, o || U(t, e, this.length);
      for (var i = this[t + --e], n = 1; e > 0 && (n *= 256);) i += this[t + --e] * n;
      return i;
    }, c.prototype.readUInt8 = function (t, e) {
      return e || U(t, 1, this.length), this[t];
    }, c.prototype.readUInt16LE = function (t, e) {
      return e || U(t, 2, this.length), this[t] | this[t + 1] << 8;
    }, c.prototype.readUInt16BE = function (t, e) {
      return e || U(t, 2, this.length), this[t] << 8 | this[t + 1];
    }, c.prototype.readUInt32LE = function (t, e) {
      return e || U(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3];
    }, c.prototype.readUInt32BE = function (t, e) {
      return e || U(t, 4, this.length), 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
    }, c.prototype.readIntLE = function (t, e, o) {
      t |= 0, e |= 0, o || U(t, e, this.length);
      for (var i = this[t], n = 1, a = 0; ++a < e && (n *= 256);) i += this[t + a] * n;
      return i >= (n *= 128) && (i -= Math.pow(2, 8 * e)), i;
    }, c.prototype.readIntBE = function (t, e, o) {
      t |= 0, e |= 0, o || U(t, e, this.length);
      for (var i = e, n = 1, a = this[t + --i]; i > 0 && (n *= 256);) a += this[t + --i] * n;
      return a >= (n *= 128) && (a -= Math.pow(2, 8 * e)), a;
    }, c.prototype.readInt8 = function (t, e) {
      return e || U(t, 1, this.length), 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t];
    }, c.prototype.readInt16LE = function (t, e) {
      e || U(t, 2, this.length);
      var o = this[t] | this[t + 1] << 8;
      return 32768 & o ? 4294901760 | o : o;
    }, c.prototype.readInt16BE = function (t, e) {
      e || U(t, 2, this.length);
      var o = this[t + 1] | this[t] << 8;
      return 32768 & o ? 4294901760 | o : o;
    }, c.prototype.readInt32LE = function (t, e) {
      return e || U(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
    }, c.prototype.readInt32BE = function (t, e) {
      return e || U(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
    }, c.prototype.readFloatLE = function (t, e) {
      return e || U(t, 4, this.length), n.read(this, t, !0, 23, 4);
    }, c.prototype.readFloatBE = function (t, e) {
      return e || U(t, 4, this.length), n.read(this, t, !1, 23, 4);
    }, c.prototype.readDoubleLE = function (t, e) {
      return e || U(t, 8, this.length), n.read(this, t, !0, 52, 8);
    }, c.prototype.readDoubleBE = function (t, e) {
      return e || U(t, 8, this.length), n.read(this, t, !1, 52, 8);
    }, c.prototype.writeUIntLE = function (t, e, o, i) {
      t = +t, e |= 0, o |= 0, i || L(this, t, e, o, Math.pow(2, 8 * o) - 1, 0);
      var n = 1,
        a = 0;
      for (this[e] = 255 & t; ++a < o && (n *= 256);) this[e + a] = t / n & 255;
      return e + o;
    }, c.prototype.writeUIntBE = function (t, e, o, i) {
      t = +t, e |= 0, o |= 0, i || L(this, t, e, o, Math.pow(2, 8 * o) - 1, 0);
      var n = o - 1,
        a = 1;
      for (this[e + n] = 255 & t; --n >= 0 && (a *= 256);) this[e + n] = t / a & 255;
      return e + o;
    }, c.prototype.writeUInt8 = function (t, e, o) {
      return t = +t, e |= 0, o || L(this, t, e, 1, 255, 0), c.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), this[e] = 255 & t, e + 1;
    }, c.prototype.writeUInt16LE = function (t, e, o) {
      return t = +t, e |= 0, o || L(this, t, e, 2, 65535, 0), c.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8) : j(this, t, e, !0), e + 2;
    }, c.prototype.writeUInt16BE = function (t, e, o) {
      return t = +t, e |= 0, o || L(this, t, e, 2, 65535, 0), c.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8, this[e + 1] = 255 & t) : j(this, t, e, !1), e + 2;
    }, c.prototype.writeUInt32LE = function (t, e, o) {
      return t = +t, e |= 0, o || L(this, t, e, 4, 4294967295, 0), c.TYPED_ARRAY_SUPPORT ? (this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = 255 & t) : F(this, t, e, !0), e + 4;
    }, c.prototype.writeUInt32BE = function (t, e, o) {
      return t = +t, e |= 0, o || L(this, t, e, 4, 4294967295, 0), c.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t) : F(this, t, e, !1), e + 4;
    }, c.prototype.writeIntLE = function (t, e, o, i) {
      if (t = +t, e |= 0, !i) {
        var n = Math.pow(2, 8 * o - 1);
        L(this, t, e, o, n - 1, -n);
      }
      var a = 0,
        r = 1,
        s = 0;
      for (this[e] = 255 & t; ++a < o && (r *= 256);) t < 0 && 0 === s && 0 !== this[e + a - 1] && (s = 1), this[e + a] = (t / r >> 0) - s & 255;
      return e + o;
    }, c.prototype.writeIntBE = function (t, e, o, i) {
      if (t = +t, e |= 0, !i) {
        var n = Math.pow(2, 8 * o - 1);
        L(this, t, e, o, n - 1, -n);
      }
      var a = o - 1,
        r = 1,
        s = 0;
      for (this[e + a] = 255 & t; --a >= 0 && (r *= 256);) t < 0 && 0 === s && 0 !== this[e + a + 1] && (s = 1), this[e + a] = (t / r >> 0) - s & 255;
      return e + o;
    }, c.prototype.writeInt8 = function (t, e, o) {
      return t = +t, e |= 0, o || L(this, t, e, 1, 127, -128), c.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), t < 0 && (t = 255 + t + 1), this[e] = 255 & t, e + 1;
    }, c.prototype.writeInt16LE = function (t, e, o) {
      return t = +t, e |= 0, o || L(this, t, e, 2, 32767, -32768), c.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8) : j(this, t, e, !0), e + 2;
    }, c.prototype.writeInt16BE = function (t, e, o) {
      return t = +t, e |= 0, o || L(this, t, e, 2, 32767, -32768), c.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8, this[e + 1] = 255 & t) : j(this, t, e, !1), e + 2;
    }, c.prototype.writeInt32LE = function (t, e, o) {
      return t = +t, e |= 0, o || L(this, t, e, 4, 2147483647, -2147483648), c.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24) : F(this, t, e, !0), e + 4;
    }, c.prototype.writeInt32BE = function (t, e, o) {
      return t = +t, e |= 0, o || L(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), c.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t) : F(this, t, e, !1), e + 4;
    }, c.prototype.writeFloatLE = function (t, e, o) {
      return H(this, t, e, !0, o);
    }, c.prototype.writeFloatBE = function (t, e, o) {
      return H(this, t, e, !1, o);
    }, c.prototype.writeDoubleLE = function (t, e, o) {
      return V(this, t, e, !0, o);
    }, c.prototype.writeDoubleBE = function (t, e, o) {
      return V(this, t, e, !1, o);
    }, c.prototype.copy = function (t, e, o, i) {
      if (o || (o = 0), i || 0 === i || (i = this.length), e >= t.length && (e = t.length), e || (e = 0), i > 0 && i < o && (i = o), i === o) return 0;
      if (0 === t.length || 0 === this.length) return 0;
      if (e < 0) throw new RangeError("targetStart out of bounds");
      if (o < 0 || o >= this.length) throw new RangeError("sourceStart out of bounds");
      if (i < 0) throw new RangeError("sourceEnd out of bounds");
      i > this.length && (i = this.length), t.length - e < i - o && (i = t.length - e + o);
      var n,
        a = i - o;
      if (this === t && o < e && e < i) for (n = a - 1; n >= 0; --n) t[n + e] = this[n + o];else if (a < 1e3 || !c.TYPED_ARRAY_SUPPORT) for (n = 0; n < a; ++n) t[n + e] = this[n + o];else Uint8Array.prototype.set.call(t, this.subarray(o, o + a), e);
      return a;
    }, c.prototype.fill = function (t, e, o, i) {
      if ("string" == typeof t) {
        if ("string" == typeof e ? (i = e, e = 0, o = this.length) : "string" == typeof o && (i = o, o = this.length), 1 === t.length) {
          var n = t.charCodeAt(0);
          n < 256 && (t = n);
        }
        if (void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
        if ("string" == typeof i && !c.isEncoding(i)) throw new TypeError("Unknown encoding: " + i);
      } else "number" == typeof t && (t &= 255);
      if (e < 0 || this.length < e || this.length < o) throw new RangeError("Out of range index");
      if (o <= e) return this;
      var a;
      if (e >>>= 0, o = void 0 === o ? this.length : o >>> 0, t || (t = 0), "number" == typeof t) for (a = e; a < o; ++a) this[a] = t;else {
        var r = c.isBuffer(t) ? t : Y(new c(t, i).toString()),
          s = r.length;
        for (a = 0; a < o - e; ++a) this[a + e] = r[a % s];
      }
      return this;
    };
    var W = /[^+\/0-9A-Za-z-_]/g;
    function q(t) {
      if ((t = z(t).replace(W, "")).length < 2) return "";
      for (; t.length % 4 != 0;) t += "=";
      return t;
    }
    function z(t) {
      return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
    }
    function Y(t, e) {
      var o;
      e = e || Infinity;
      for (var i = t.length, n = null, a = [], r = 0; r < i; ++r) {
        if ((o = t.charCodeAt(r)) > 55295 && o < 57344) {
          if (!n) {
            if (o > 56319) {
              (e -= 3) > -1 && a.push(239, 191, 189);
              continue;
            }
            if (r + 1 === i) {
              (e -= 3) > -1 && a.push(239, 191, 189);
              continue;
            }
            n = o;
            continue;
          }
          if (o < 56320) {
            (e -= 3) > -1 && a.push(239, 191, 189), n = o;
            continue;
          }
          o = 65536 + (n - 55296 << 10 | o - 56320);
        } else n && (e -= 3) > -1 && a.push(239, 191, 189);
        if (n = null, o < 128) {
          if ((e -= 1) < 0) break;
          a.push(o);
        } else if (o < 2048) {
          if ((e -= 2) < 0) break;
          a.push(o >> 6 | 192, 63 & o | 128);
        } else if (o < 65536) {
          if ((e -= 3) < 0) break;
          a.push(o >> 12 | 224, o >> 6 & 63 | 128, 63 & o | 128);
        } else {
          if (!(o < 1114112)) throw new Error("Invalid code point");
          if ((e -= 4) < 0) break;
          a.push(o >> 18 | 240, o >> 12 & 63 | 128, o >> 6 & 63 | 128, 63 & o | 128);
        }
      }
      return a;
    }
    function K(t) {
      for (var e = [], o = 0; o < t.length; ++o) e.push(255 & t.charCodeAt(o));
      return e;
    }
    function J(t, e) {
      for (var o, i, n, a = [], r = 0; r < t.length && !((e -= 2) < 0); ++r) i = (o = t.charCodeAt(r)) >> 8, n = o % 256, a.push(n), a.push(i);
      return a;
    }
    function X(t) {
      return i.toByteArray(q(t));
    }
    function Z(t, e, o, i) {
      for (var n = 0; n < i && !(n + o >= e.length || n >= t.length); ++n) e[n + o] = t[n];
      return n;
    }
  }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});