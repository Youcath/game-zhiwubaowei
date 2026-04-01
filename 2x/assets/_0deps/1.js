// base64-js
"use strict";

  exports.byteLength = function (t) {
    var e = l(t),
      o = e[0],
      i = e[1];
    return 3 * (o + i) / 4 - i;
  }, exports.toByteArray = function (t) {
    var e,
      o,
      i = l(t),
      r = i[0],
      s = i[1],
      c = new a(u(0, r, s)),
      p = 0,
      h = s > 0 ? r - 4 : r;
    for (o = 0; o < h; o += 4) e = n[t.charCodeAt(o)] << 18 | n[t.charCodeAt(o + 1)] << 12 | n[t.charCodeAt(o + 2)] << 6 | n[t.charCodeAt(o + 3)], c[p++] = e >> 16 & 255, c[p++] = e >> 8 & 255, c[p++] = 255 & e;
    return 2 === s && (e = n[t.charCodeAt(o)] << 2 | n[t.charCodeAt(o + 1)] >> 4, c[p++] = 255 & e), 1 === s && (e = n[t.charCodeAt(o)] << 10 | n[t.charCodeAt(o + 1)] << 4 | n[t.charCodeAt(o + 2)] >> 2, c[p++] = e >> 8 & 255, c[p++] = 255 & e), c;
  }, exports.fromByteArray = function (t) {
    for (var e, o = t.length, n = o % 3, a = [], r = 0, s = o - n; r < s; r += 16383) a.push(p(t, r, r + 16383 > s ? s : r + 16383));
    return 1 === n ? (e = t[o - 1], a.push(i[e >> 2] + i[e << 4 & 63] + "==")) : 2 === n && (e = (t[o - 2] << 8) + t[o - 1], a.push(i[e >> 10] + i[e >> 4 & 63] + i[e << 2 & 63] + "=")), a.join("");
  };
  for (var i = [], n = [], a = "undefined" != typeof Uint8Array ? Uint8Array : Array, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, c = r.length; s < c; ++s) i[s] = r[s], n[r.charCodeAt(s)] = s;
  function l(t) {
    var e = t.length;
    if (e % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
    var o = t.indexOf("=");
    return -1 === o && (o = e), [o, o === e ? 0 : 4 - o % 4];
  }
  function u(t, e, o) {
    return 3 * (e + o) / 4 - o;
  }
  function p(t, e, o) {
    for (var n, a, r = [], s = e; s < o; s += 3) n = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (255 & t[s + 2]), r.push(i[(a = n) >> 18 & 63] + i[a >> 12 & 63] + i[a >> 6 & 63] + i[63 & a]);
    return r.join("");
  }
  n["-".charCodeAt(0)] = 62, n["_".charCodeAt(0)] = 63;