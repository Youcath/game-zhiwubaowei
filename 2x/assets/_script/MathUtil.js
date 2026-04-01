var cc__read = __read;
var cc__spread = __spread;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MathUtil = exports.SortAlgorithm = exports.SortOrder = undefined;
var a;
var r;
var $10RandomUtil = require("RandomUtil");
(function (t) {
  t[t.ASC = 0] = "ASC";
  t[t.DESC = 1] = "DESC";
})(a = exports.SortOrder || (exports.SortOrder = {}));
(function (t) {
  t[t.SYSTEM = 0] = "SYSTEM";
  t[t.BUBBLE = 1] = "BUBBLE";
  t[t.DICHOTOMY = 2] = "DICHOTOMY";
  t[t.INSERTION = 3] = "INSERTION";
})(r = exports.SortAlgorithm || (exports.SortAlgorithm = {}));
var exp_MathUtil = function () {
  function _ctor() {}
  _ctor.GetCoinString = function (t, e) {
    var o = "";
    var i = t.split("-");
    var n = i.length;
    var a = (n = n > this.coinType.length ? this.coinType.length : n) - e;
    a = a < 0 ? 0 : a;
    var r = [];
    for (var s = n - 1; s >= a; s--) {
      r.push(this.coinType[s]);
    }
    for (s = 0; s < r.length; s++) {
      var c = Number(i[s]);
      0 != c && (o += c + r[s]);
    }
    return o + (o ? "" : "0");
  };
  _ctor.GetCoinStringDot = function (t, e, o) {
    undefined === o && (o = 1);
    var i = "";
    var n = t.split("-");
    var a = n.length;
    var r = (a = a > this.coinType.length ? this.coinType.length : a) - e;
    r = r < 0 ? 0 : r;
    var s = this.coinType[r];
    var c = Math.min(n.length, 2);
    for (var l = 0; l < c; l++) {
      var u = Number(n[l]);
      if ((0 != u || 0 !== l) && (0 === l && (i += u + (c > 1 ? "." : "")), 1 === l)) {
        var p = "";
        if (1 == o) {
          p = (u / 1e3).toString().match(/^-?\d+(?:\.\d{0,1})?/)[0];
        } else {
          (p = (u / 1e3).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]).length <= 1 && (p += "0");
        }
        var h = p;
        p.includes(".") && (h = p.split(".")[1]);
        i += h;
      }
    }
    if (i) {
      if (i.includes(".")) {
        var d = i.split(".");
        if (d[0].length >= 3) {
          i = i.substring(0, 3);
        } else {
          d[0].length + d[1].length > 3 && (i = d[0] + "." + d[1].substring(0, 3 - d[0].length));
        }
      }
      i += s;
    } else {
      i += "0";
    }
    return i;
  };
  _ctor.formatValue = function (t, e, o) {
    undefined === e && (e = 1);
    undefined === o && (o = 3);
    if (isNaN(t)) {
      return "0";
    }
    if ((t = Number(t)) < 1e4) {
      return this.formatNumber(t);
    }
    var i = 1;
    var n = t % 1e3;
    n < 1e3 && 0 != n && (i = 2);
    var a = (t = Math.floor(t)).toString();
    t >= 1e20 && (a = this.toNonExponential(t));
    var r = a.split("");
    var s = "";
    var c = 0;
    for (var l = r.length - 1; l >= 0; l--) {
      0 != c && c % o == 0 && (s = "-" + s);
      s = r[l] + s;
      c++;
    }
    if (t >= 1e4) {
      return this.GetCoinStringDot(s, e, i);
    } else {
      return t.toString();
    }
  };
  _ctor.toNonExponential = function (t) {
    t == Infinity && (t = 99e306);
    var e = t.toExponential().split("e");
    var o = 0;
    e[0].split(".").length > 1 && (o = e[0].split(".")[1].length);
    o && (e[0] = e[0].replace(".", ""));
    var i = Number(e[1].replace("+", ""));
    for (var n = o; n < i; n++) {
      e[0] += "0";
    }
    return e[0];
  };
  _ctor.sort = function (t, e, o, i) {
    undefined === e && (e = null);
    undefined === o && (o = a.ASC);
    undefined === i && (i = r.SYSTEM);
    if (t.length <= 1) {
      return t;
    }
    if (r.SYSTEM === i) {
      return t.sort(function (t, i) {
        var n = t && e ? t[e] : t || 0;
        var r = i && e ? i[e] : i || 0;
        if (a.ASC === o) {
          return n - r;
        } else {
          return r - n;
        }
      });
    }
    if (r.BUBBLE === i) {
      var s = b = t.length;
      for (var c = 0; c < b; c++) {
        var l = t[0] && e ? t[0][e] : t[0] || 0;
        var u = true;
        var p = s - 1;
        for (var h = 0; h < p; h++) {
          var d = t[h + 1] && e ? t[h + 1][e] : t[h + 1] || 0;
          if (a.ASC === o && l > d || a.DESC === o && l < d) {
            var m = t[h];
            t[h] = t[h + 1];
            t[h + 1] = m;
            u = false;
            s = h + 1;
          } else {
            l = d;
          }
        }
        if (u) {
          break;
        }
      }
      return t;
    }
    if (r.DICHOTOMY === i) {
      var f = t.length >> 1;
      var y = t[f] && e ? t[f][e] : t[f] || 0;
      var g = [];
      var _ = [];
      for (c = 0; c < t.length; c++) {
        if (c !== f) {
          var v = t[c] && e ? t[c][e] : t[c] || 0;
          if (v === y) {
            if (c < f) {
              g.push(t[c]);
            } else {
              _.push(t[c]);
            }
          } else if (a.ASC === o && v > y || a.DESC === o && v < y) {
            _.push(t[c]);
          } else {
            g.push(t[c]);
          }
        }
      }
      return cc__spread(this.sort(g, e, o, i), [t[f]], this.sort(_, e, o, i));
    }
    if (r.INSERTION === i) {
      var b = t.length;
      for (c = 1; c < b; c++) {
        l = t[c] && e ? t[c][e] : t[c] || 0;
        if (a.ASC === o) {
          s = 0;
          for (h = c - 1; h >= 0; h--) {
            if (l >= (d = t[h] && e ? t[h][e] : t[h] || 0)) {
              s = h + 1;
              break;
            }
          }
          m = t[c];
          for (var P = c; P > s; P--) {
            t[P] = t[P - 1];
          }
          t[s] = m;
        } else {
          s = c;
          for (h = 0; h < c; h++) {
            if (l < (d = t[h] && e ? t[h][e] : t[h] || 0)) {
              s = h;
              break;
            }
          }
          m = t[c];
          for (P = c; P > s; P--) {
            t[P] = t[P - 1];
          }
          t[s] = m;
        }
      }
      return t;
    }
    return t;
  };
  _ctor.toFixed = function (t, e) {
    return Number(t.toFixed(e));
  };
  _ctor.toFloor = function (t, e) {
    var o = Math.pow(10, e);
    return Math.floor(t * o) / o;
  };
  _ctor.toCeil = function (t, e) {
    var o = Math.pow(10, e);
    return Math.ceil(t * o) / o;
  };
  _ctor.formatNumber = function (t, e) {
    undefined === e && (e = 1);
    if (t) {
      if (t % 1 == 0) {
        return t.toFixed(0);
      } else {
        return t.toFixed(e);
      }
    } else {
      return "0";
    }
  };
  _ctor.getMinRotate = function (t) {
    if (t >= 360) {
      return t -= 360, this.getMinRotate(t);
    } else {
      if (t < 0) {
        return t += 360, this.getMinRotate(t);
      } else {
        return t;
      }
    }
  };
  _ctor.angle2Radians = function (t) {
    return Math.PI / 180 * t;
  };
  _ctor.radians2Angle = function (t) {
    return 180 / Math.PI * t;
  };
  _ctor.numToChinese = function (t) {
    if (!/^\d*(\.\d*)?$/.test(t)) {
      alert("Number is wrong!");
      return "Number is wrong!";
    }
    var e = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
    var o = new Array("", "十", "百", "千", "万", "亿", "点", "");
    var i = ("" + t).replace(/(^0*)/g, "").split(".");
    var n = 0;
    var a = "";
    for (var r = i[0].length - 1; r >= 0; r--) {
      switch (n) {
        case 0:
          a = o[7] + a;
          break;
        case 4:
          new RegExp("0{4}\\d{" + (i[0].length - r - 1) + "}$").test(i[0]) || (a = o[4] + a);
          break;
        case 8:
          a = o[5] + a;
          o[7] = o[5];
          n = 0;
      }
      n % 4 == 2 && 0 != Number(i[0].charAt(r + 2)) && 0 == Number(i[0].charAt(r + 1)) && (a = e[0] + a);
      0 != Number(i[0].charAt(r)) && (a = e[i[0].charAt(r)] + o[n % 4] + a);
      n++;
    }
    if (i.length > 1) {
      a += o[6];
      for (r = 0; r < i[1].length; r++) {
        a += e[i[1].charAt(r)];
      }
    }
    return a;
  };
  _ctor.lerp = function (t, e, o) {
    return t + (e - t) * o;
  };
  _ctor.slerp = function (e, o, i) {
    var n = _ctor.getMinRotate(e) * Math.PI / 180;
    var a = _ctor.getMinRotate(o) * Math.PI / 180;
    var r = Math.acos(Math.cos(n) * Math.cos(a) + Math.sin(n) * Math.sin(a));
    var s = Math.sin(r);
    return Math.sin((1 - i) * r) / s * e + Math.sin(i * r) / s * o;
  };
  _ctor.bezier = function (t, e, o, i, n) {
    var a = 1 - n;
    return a * (a * (t + (3 * e - t) * n) + 3 * o * n * n) + i * n * n * n;
  };
  _ctor.bezierTo = function (e, o, i, n, a, r, s) {
    undefined === s && (s = "");
    var c = i.x;
    var l = i.y;
    var u = n.x;
    var p = n.y;
    var h = Object.create(null);
    h.progress = function (e, o, i, n) {
      i.x = _ctor.bezier(e.x, c, u, o.x, n);
      i.y = _ctor.bezier(e.y, l, p, o.y, n);
      r && r(i, n);
      return i;
    };
    "" != s && (h.easing = s);
    return cc.tween(e).to(o, {
      position: a
    }, h);
  };
  _ctor.transProbByWeight = function (t, e) {
    return t / e.reduce(function (t, e) {
      return t + e;
    }, 0);
  };
  _ctor.objectWeightedRandom = function (t, e) {
    undefined === e && (e = "Weight");
    if (!t || 0 == t.length) {
      return -1;
    }
    if (1 == t.length) {
      return 0;
    }
    var o = 0;
    t.forEach(function (t) {
      o += t["" + e];
    });
    var i = $10RandomUtil.RandomUtil.randomInt(0, o);
    for (var n = 0; n < t.length; ++n) {
      if (i < t[n]["" + e]) {
        return n;
      }
      i -= t[n]["" + e];
    }
    return -1;
  };
  _ctor.weightedRandom = function (t) {
    if (!t || 0 == t.length) {
      return -1;
    }
    if (1 == t.length) {
      return 0;
    }
    var e = 0;
    t.forEach(function (t) {
      e += t;
    });
    var o = $10RandomUtil.RandomUtil.randomInt(0, e);
    for (var i = 0; i < t.length; ++i) {
      if (o < t[i]) {
        return i;
      }
      o -= t[i];
    }
    return -1;
  };
  _ctor.getRadian = function (t) {
    return 0.017453292222222222 * t;
  };
  _ctor.getAngle = function (t) {
    return Math.floor(cc.misc.radiansToDegrees(t));
  };
  _ctor.getDoublPointRadian = function (t, e) {
    var o = t.sub(e);
    var i = cc.v2(1, 0);
    return -cc.v2(o).signAngle(i);
  };
  _ctor.distance = function (t, e) {
    var o = t.x - e.x;
    var i = t.y - e.y;
    return Math.sqrt(o * o + i * i);
  };
  _ctor.getPerpendicularVector = function (t, e) {
    return cc.v2(-t.y, t.x).add(e);
  };
  _ctor.coinType = ["", "k", "m", "b", "t", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "ai", "aj", "ak", "al", "am", "an", "ao", "ap", "aq", "ar", "as", "at", "au", "av", "aw", "ax", "ay", "az"];
  return _ctor;
}();
exports.MathUtil = exp_MathUtil;