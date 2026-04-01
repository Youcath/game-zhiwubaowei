Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.md5 = undefined;
exports.md5 = function (t) {
  var e = function (t, e) {
    return t << e | t >>> 32 - e;
  };
  var o = function (t, e) {
    var o;
    var i;
    var n;
    var a;
    var r;
    n = 2147483648 & t;
    a = 2147483648 & e;
    r = (1073741823 & t) + (1073741823 & e);
    if ((o = 1073741824 & t) & (i = 1073741824 & e)) {
      return 2147483648 ^ r ^ n ^ a;
    } else {
      if (o | i) {
        if (1073741824 & r) {
          return 3221225472 ^ r ^ n ^ a;
        } else {
          return 1073741824 ^ r ^ n ^ a;
        }
      } else {
        return r ^ n ^ a;
      }
    }
  };
  var i = function (t, e, o) {
    return t & e | ~t & o;
  };
  var n = function (t, e, o) {
    return t & o | e & ~o;
  };
  var a = function (t, e, o) {
    return t ^ e ^ o;
  };
  var r = function (t, e, o) {
    return e ^ (t | ~o);
  };
  var s = function (t, n, a, r, s, c, l) {
    t = o(t, o(o(i(n, a, r), s), l));
    return o(e(t, c), n);
  };
  var c = function (t, i, a, r, s, c, l) {
    t = o(t, o(o(n(i, a, r), s), l));
    return o(e(t, c), i);
  };
  var l = function (t, i, n, r, s, c, l) {
    t = o(t, o(o(a(i, n, r), s), l));
    return o(e(t, c), i);
  };
  var u = function (t, i, n, a, s, c, l) {
    t = o(t, o(o(r(i, n, a), s), l));
    return o(e(t, c), i);
  };
  var p = function (t) {
    var e;
    var o = t.length;
    var i = o + 8;
    var n = 16 * ((i - i % 64) / 64 + 1);
    var a = Array(n - 1);
    var r = 0;
    for (var s = 0; s < o;) {
      r = s % 4 * 8;
      a[e = (s - s % 4) / 4] = a[e] | t.charCodeAt(s) << r;
      s++;
    }
    r = s % 4 * 8;
    a[e = (s - s % 4) / 4] = a[e] | 128 << r;
    a[n - 2] = o << 3;
    a[n - 1] = o >>> 29;
    return a;
  };
  var h = function (t) {
    var e;
    var o = "";
    var i = "";
    for (e = 0; e <= 3; e++) {
      o += (i = "0" + (t >>> 8 * e & 255).toString(16)).substr(i.length - 2, 2);
    }
    return o;
  };
  var d = function (t) {
    t = t.toString().replace(/\x0d\x0a/g, "\n");
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
  return function (t) {
    var e;
    var i;
    var n;
    var a;
    var r;
    var m;
    var f;
    var y;
    var g;
    var _ = Array();
    t = d(t);
    _ = p(t);
    m = 1732584193;
    f = 4023233417;
    y = 2562383102;
    g = 271733878;
    for (e = 0; e < _.length; e += 16) {
      i = m;
      n = f;
      a = y;
      r = g;
      m = s(m, f, y, g, _[e + 0], 7, 3614090360);
      g = s(g, m, f, y, _[e + 1], 12, 3905402710);
      y = s(y, g, m, f, _[e + 2], 17, 606105819);
      f = s(f, y, g, m, _[e + 3], 22, 3250441966);
      m = s(m, f, y, g, _[e + 4], 7, 4118548399);
      g = s(g, m, f, y, _[e + 5], 12, 1200080426);
      y = s(y, g, m, f, _[e + 6], 17, 2821735955);
      f = s(f, y, g, m, _[e + 7], 22, 4249261313);
      m = s(m, f, y, g, _[e + 8], 7, 1770035416);
      g = s(g, m, f, y, _[e + 9], 12, 2336552879);
      y = s(y, g, m, f, _[e + 10], 17, 4294925233);
      f = s(f, y, g, m, _[e + 11], 22, 2304563134);
      m = s(m, f, y, g, _[e + 12], 7, 1804603682);
      g = s(g, m, f, y, _[e + 13], 12, 4254626195);
      y = s(y, g, m, f, _[e + 14], 17, 2792965006);
      f = s(f, y, g, m, _[e + 15], 22, 1236535329);
      m = c(m, f, y, g, _[e + 1], 5, 4129170786);
      g = c(g, m, f, y, _[e + 6], 9, 3225465664);
      y = c(y, g, m, f, _[e + 11], 14, 643717713);
      f = c(f, y, g, m, _[e + 0], 20, 3921069994);
      m = c(m, f, y, g, _[e + 5], 5, 3593408605);
      g = c(g, m, f, y, _[e + 10], 9, 38016083);
      y = c(y, g, m, f, _[e + 15], 14, 3634488961);
      f = c(f, y, g, m, _[e + 4], 20, 3889429448);
      m = c(m, f, y, g, _[e + 9], 5, 568446438);
      g = c(g, m, f, y, _[e + 14], 9, 3275163606);
      y = c(y, g, m, f, _[e + 3], 14, 4107603335);
      f = c(f, y, g, m, _[e + 8], 20, 1163531501);
      m = c(m, f, y, g, _[e + 13], 5, 2850285829);
      g = c(g, m, f, y, _[e + 2], 9, 4243563512);
      y = c(y, g, m, f, _[e + 7], 14, 1735328473);
      f = c(f, y, g, m, _[e + 12], 20, 2368359562);
      m = l(m, f, y, g, _[e + 5], 4, 4294588738);
      g = l(g, m, f, y, _[e + 8], 11, 2272392833);
      y = l(y, g, m, f, _[e + 11], 16, 1839030562);
      f = l(f, y, g, m, _[e + 14], 23, 4259657740);
      m = l(m, f, y, g, _[e + 1], 4, 2763975236);
      g = l(g, m, f, y, _[e + 4], 11, 1272893353);
      y = l(y, g, m, f, _[e + 7], 16, 4139469664);
      f = l(f, y, g, m, _[e + 10], 23, 3200236656);
      m = l(m, f, y, g, _[e + 13], 4, 681279174);
      g = l(g, m, f, y, _[e + 0], 11, 3936430074);
      y = l(y, g, m, f, _[e + 3], 16, 3572445317);
      f = l(f, y, g, m, _[e + 6], 23, 76029189);
      m = l(m, f, y, g, _[e + 9], 4, 3654602809);
      g = l(g, m, f, y, _[e + 12], 11, 3873151461);
      y = l(y, g, m, f, _[e + 15], 16, 530742520);
      f = l(f, y, g, m, _[e + 2], 23, 3299628645);
      m = u(m, f, y, g, _[e + 0], 6, 4096336452);
      g = u(g, m, f, y, _[e + 7], 10, 1126891415);
      y = u(y, g, m, f, _[e + 14], 15, 2878612391);
      f = u(f, y, g, m, _[e + 5], 21, 4237533241);
      m = u(m, f, y, g, _[e + 12], 6, 1700485571);
      g = u(g, m, f, y, _[e + 3], 10, 2399980690);
      y = u(y, g, m, f, _[e + 10], 15, 4293915773);
      f = u(f, y, g, m, _[e + 1], 21, 2240044497);
      m = u(m, f, y, g, _[e + 8], 6, 1873313359);
      g = u(g, m, f, y, _[e + 15], 10, 4264355552);
      y = u(y, g, m, f, _[e + 6], 15, 2734768916);
      f = u(f, y, g, m, _[e + 13], 21, 1309151649);
      m = u(m, f, y, g, _[e + 4], 6, 4149444226);
      g = u(g, m, f, y, _[e + 11], 10, 3174756917);
      y = u(y, g, m, f, _[e + 2], 15, 718787259);
      f = u(f, y, g, m, _[e + 9], 21, 3951481745);
      m = o(m, i);
      f = o(f, n);
      y = o(y, a);
      g = o(g, r);
    }
    return (h(m) + h(f) + h(y) + h(g)).toLowerCase();
  }(t);
};