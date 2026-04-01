// ieee754
exports.read = function (t, e, o, i, n) {
    var a,
      r,
      s = 8 * n - i - 1,
      c = (1 << s) - 1,
      l = c >> 1,
      u = -7,
      p = o ? n - 1 : 0,
      h = o ? -1 : 1,
      d = t[e + p];
    for (p += h, a = d & (1 << -u) - 1, d >>= -u, u += s; u > 0; a = 256 * a + t[e + p], p += h, u -= 8);
    for (r = a & (1 << -u) - 1, a >>= -u, u += i; u > 0; r = 256 * r + t[e + p], p += h, u -= 8);
    if (0 === a) a = 1 - l;else {
      if (a === c) return r ? NaN : Infinity * (d ? -1 : 1);
      r += Math.pow(2, i), a -= l;
    }
    return (d ? -1 : 1) * r * Math.pow(2, a - i);
  }, exports.write = function (t, e, o, i, n, a) {
    var r,
      s,
      c,
      l = 8 * a - n - 1,
      u = (1 << l) - 1,
      p = u >> 1,
      h = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
      d = i ? 0 : a - 1,
      m = i ? 1 : -1,
      f = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
    for (e = Math.abs(e), isNaN(e) || e === Infinity ? (s = isNaN(e) ? 1 : 0, r = u) : (r = Math.floor(Math.log(e) / Math.LN2), e * (c = Math.pow(2, -r)) < 1 && (r--, c *= 2), (e += r + p >= 1 ? h / c : h * Math.pow(2, 1 - p)) * c >= 2 && (r++, c /= 2), r + p >= u ? (s = 0, r = u) : r + p >= 1 ? (s = (e * c - 1) * Math.pow(2, n), r += p) : (s = e * Math.pow(2, p - 1) * Math.pow(2, n), r = 0)); n >= 8; t[o + d] = 255 & s, d += m, s /= 256, n -= 8);
    for (r = r << n | s, l += n; l > 0; t[o + d] = 255 & r, d += m, r /= 256, l -= 8);
    t[o + d - m] |= 128 * f;
  };