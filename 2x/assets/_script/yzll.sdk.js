function o() {
  o = function () {
    return t;
  };
  var t = {};
  var e = Object.prototype;
  var i = e.hasOwnProperty;
  var n = "function" == typeof Symbol ? Symbol : {};
  var a = n.iterator || "@@iterator";
  var r = n.asyncIterator || "@@asyncIterator";
  var s = n.toStringTag || "@@toStringTag";
  function c(t, e, o) {
    Object.defineProperty(t, e, {
      value: o,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return t[e];
  }
  try {
    c({}, "");
  } catch (x) {
    c = function (t, e, o) {
      return t[e] = o;
    };
  }
  function l(t, e, o, i) {
    var n = e && e.prototype instanceof h ? e : h;
    var a = Object.create(n.prototype);
    var r = new E(i || []);
    a._invoke = function (t, e, o) {
      var i = "suspendedStart";
      return function (n, a) {
        if ("executing" === i) {
          throw new Error("Generator is already running");
        }
        if ("completed" === i) {
          if ("throw" === n) {
            throw a;
          }
          return {
            value: undefined,
            done: true
          };
        }
        o.method = n;
        for (o.arg = a;;) {
          var r = o.delegate;
          if (r) {
            var s = P(r, o);
            if (s) {
              if (s === p) {
                continue;
              }
              return s;
            }
          }
          if ("next" === o.method) {
            o.sent = o._sent = o.arg;
          } else if ("throw" === o.method) {
            if ("suspendedStart" === i) {
              throw i = "completed", o.arg;
            }
            o.dispatchException(o.arg);
          } else {
            "return" === o.method && o.abrupt("return", o.arg);
          }
          i = "executing";
          var c = u(t, e, o);
          if ("normal" === c.type) {
            i = o.done ? "completed" : "suspendedYield";
            if (c.arg === p) {
              continue;
            }
            return {
              value: c.arg,
              done: o.done
            };
          }
          if ("throw" === c.type) {
            i = "completed";
            o.method = "throw";
            o.arg = c.arg;
          }
        }
      };
    }(t, o, r);
    return a;
  }
  function u(t, e, o) {
    try {
      return {
        type: "normal",
        arg: t.call(e, o)
      };
    } catch (x) {
      return {
        type: "throw",
        arg: x
      };
    }
  }
  t.wrap = l;
  var p = {};
  function h() {}
  function d() {}
  function m() {}
  var f = {};
  c(f, a, function () {
    return this;
  });
  var y = Object.getPrototypeOf;
  var g = y && y(y(C([])));
  g && g !== e && i.call(g, a) && (f = g);
  var _ = m.prototype = h.prototype = Object.create(f);
  function v(t) {
    ["next", "throw", "return"].forEach(function (e) {
      c(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function b(t, e) {
    function o(n, a, r, s) {
      var c = u(t[n], t, a);
      if ("throw" !== c.type) {
        var l = c.arg;
        var p = l.value;
        if (p && "object" == typeof p && i.call(p, "__await")) {
          return e.resolve(p.__await).then(function (t) {
            o("next", t, r, s);
          }, function (t) {
            o("throw", t, r, s);
          });
        } else {
          return e.resolve(p).then(function (t) {
            l.value = t;
            r(l);
          }, function (t) {
            return o("throw", t, r, s);
          });
        }
      }
      s(c.arg);
    }
    var n;
    this._invoke = function (t, i) {
      function a() {
        return new e(function (e, n) {
          o(t, i, e, n);
        });
      }
      return n = n ? n.then(a, a) : a();
    };
  }
  function P(t, e) {
    var o = t.iterator[e.method];
    if (undefined === o) {
      e.delegate = null;
      if ("throw" === e.method) {
        if (t.iterator.return && (e.method = "return", e.arg = undefined, P(t, e), "throw" === e.method)) {
          return p;
        }
        e.method = "throw";
        e.arg = new TypeError("The iterator does not provide a 'throw' method");
      }
      return p;
    }
    var i = u(o, t.iterator, e.arg);
    if ("throw" === i.type) {
      e.method = "throw";
      e.arg = i.arg;
      e.delegate = null;
      return p;
    }
    var n = i.arg;
    if (n) {
      if (n.done) {
        return e[t.resultName] = n.value, e.next = t.nextLoc, "return" !== e.method && (e.method = "next", e.arg = undefined), e.delegate = null, p;
      } else {
        return n;
      }
    } else {
      return e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, p;
    }
  }
  function D(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]);
    if (2 in t) {
      e.finallyLoc = t[2];
      e.afterLoc = t[3];
    }
    this.tryEntries.push(e);
  }
  function S(t) {
    var e = t.completion || {};
    e.type = "normal";
    delete e.arg;
    t.completion = e;
  }
  function E(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }];
    t.forEach(D, this);
    this.reset(true);
  }
  function C(t) {
    if (t) {
      var e = t[a];
      if (e) {
        return e.call(t);
      }
      if ("function" == typeof t.next) {
        return t;
      }
      if (!isNaN(t.length)) {
        var o = -1;
        var n = function e() {
          for (; ++o < t.length;) {
            if (i.call(t, o)) {
              e.value = t[o];
              e.done = false;
              return e;
            }
          }
          e.value = undefined;
          e.done = true;
          return e;
        };
        return n.next = n;
      }
    }
    return {
      next: B
    };
  }
  function B() {
    return {
      value: undefined,
      done: true
    };
  }
  d.prototype = m;
  c(_, "constructor", m);
  c(m, "constructor", d);
  d.displayName = c(m, s, "GeneratorFunction");
  t.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === d || "GeneratorFunction" === (e.displayName || e.name));
  };
  t.mark = function (t) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(t, m);
    } else {
      t.__proto__ = m;
      c(t, s, "GeneratorFunction");
    }
    t.prototype = Object.create(_);
    return t;
  };
  t.awrap = function (t) {
    return {
      __await: t
    };
  };
  v(b.prototype);
  c(b.prototype, r, function () {
    return this;
  });
  t.AsyncIterator = b;
  t.async = function (e, o, i, n, a) {
    undefined === a && (a = Promise);
    var r = new b(l(e, o, i, n), a);
    if (t.isGeneratorFunction(o)) {
      return r;
    } else {
      return r.next().then(function (t) {
        if (t.done) {
          return t.value;
        } else {
          return r.next();
        }
      });
    }
  };
  v(_);
  c(_, s, "Generator");
  c(_, a, function () {
    return this;
  });
  c(_, "toString", function () {
    return "[object Generator]";
  });
  t.keys = function (t) {
    var e = [];
    for (var o in t) {
      e.push(o);
    }
    e.reverse();
    return function o() {
      for (; e.length;) {
        var i = e.pop();
        if (i in t) {
          o.value = i;
          o.done = false;
          return o;
        }
      }
      o.done = true;
      return o;
    };
  };
  t.values = C;
  E.prototype = {
    constructor: E,
    reset: function (t) {
      this.prev = 0;
      this.next = 0;
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(S);
      if (!t) {
        for (var e in this) {
          "t" === e.charAt(0) && i.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = undefined);
        }
      }
    },
    stop: function () {
      this.done = true;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) {
        throw t.arg;
      }
      return this.rval;
    },
    dispatchException: function (t) {
      if (this.done) {
        throw t;
      }
      var e = this;
      function o(o, i) {
        r.type = "throw";
        r.arg = t;
        e.next = o;
        if (i) {
          e.method = "next";
          e.arg = undefined;
        }
        return !!i;
      }
      for (var n = this.tryEntries.length - 1; n >= 0; --n) {
        var a = this.tryEntries[n];
        var r = a.completion;
        if ("root" === a.tryLoc) {
          return o("end");
        }
        if (a.tryLoc <= this.prev) {
          var s = i.call(a, "catchLoc");
          var c = i.call(a, "finallyLoc");
          if (s && c) {
            if (this.prev < a.catchLoc) {
              return o(a.catchLoc, true);
            }
            if (this.prev < a.finallyLoc) {
              return o(a.finallyLoc);
            }
          } else if (s) {
            if (this.prev < a.catchLoc) {
              return o(a.catchLoc, true);
            }
          } else {
            if (!c) {
              throw new Error("try statement without catch or finally");
            }
            if (this.prev < a.finallyLoc) {
              return o(a.finallyLoc);
            }
          }
        }
      }
    },
    abrupt: function (t, e) {
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var n = this.tryEntries[o];
        if (n.tryLoc <= this.prev && i.call(n, "finallyLoc") && this.prev < n.finallyLoc) {
          var a = n;
          break;
        }
      }
      a && ("break" === t || "continue" === t) && a.tryLoc <= e && e <= a.finallyLoc && (a = null);
      var r = a ? a.completion : {};
      r.type = t;
      r.arg = e;
      if (a) {
        return this.method = "next", this.next = a.finallyLoc, p;
      } else {
        return this.complete(r);
      }
    },
    complete: function (t, e) {
      if ("throw" === t.type) {
        throw t.arg;
      }
      if ("break" === t.type || "continue" === t.type) {
        this.next = t.arg;
      } else if ("return" === t.type) {
        this.rval = this.arg = t.arg;
        this.method = "return";
        this.next = "end";
      } else {
        "normal" === t.type && e && (this.next = e);
      }
      return p;
    },
    finish: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var o = this.tryEntries[e];
        if (o.finallyLoc === t) {
          this.complete(o.completion, o.afterLoc);
          S(o);
          return p;
        }
      }
    },
    catch: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var o = this.tryEntries[e];
        if (o.tryLoc === t) {
          var i = o.completion;
          if ("throw" === i.type) {
            var n = i.arg;
            S(o);
          }
          return n;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (t, e, o) {
      this.delegate = {
        iterator: C(t),
        resultName: e,
        nextLoc: o
      };
      "next" === this.method && (this.arg = undefined);
      return p;
    }
  };
  return t;
}
function i(t, e, o, i, n, a, r) {
  try {
    var s = t[a](r);
    var c = s.value;
  } catch (l) {
    return void o(l);
  }
  if (s.done) {
    e(c);
  } else {
    Promise.resolve(c).then(i, n);
  }
}
function n(t) {
  return function () {
    var e = this;
    var o = arguments;
    return new Promise(function (n, a) {
      var r = t.apply(e, o);
      function s(t) {
        i(r, n, a, s, c, "next", t);
      }
      function c(t) {
        i(r, n, a, s, c, "throw", t);
      }
      s(undefined);
    });
  };
}
var a;
var r;
var s = {
  appid: "392922417987585"
};
window.CryptoJS1 = window.CryptoJS1 || function (t) {
  var e = {};
  var o = e.lib = {};
  var i = function () {};
  var n = o.Base = {
    extend: function (t) {
      i.prototype = this;
      var e = new i();
      t && e.mixIn(t);
      e.hasOwnProperty("init") || (e.init = function () {
        e.$super.init.apply(this, arguments);
      });
      e.init.prototype = e;
      e.$super = this;
      return e;
    },
    create: function () {
      var t = this.extend();
      t.init.apply(t, arguments);
      return t;
    },
    init: function () {},
    mixIn: function (t) {
      for (var e in t) {
        t.hasOwnProperty(e) && (this[e] = t[e]);
      }
      t.hasOwnProperty("toString") && (this.toString = t.toString);
    },
    clone: function () {
      return this.init.prototype.extend(this);
    }
  };
  var a = o.WordArray = n.extend({
    init: function (t, e) {
      t = this.words = t || [];
      this.sigBytes = null != e ? e : 4 * t.length;
    },
    toString: function (t) {
      return (t || s).stringify(this);
    },
    concat: function (t) {
      var e = this.words;
      var o = t.words;
      var i = this.sigBytes;
      t = t.sigBytes;
      this.clamp();
      if (i % 4) {
        for (var n = 0; n < t; n++) {
          e[i + n >>> 2] |= (o[n >>> 2] >>> 24 - n % 4 * 8 & 255) << 24 - (i + n) % 4 * 8;
        }
      } else if (65535 < o.length) {
        for (n = 0; n < t; n += 4) {
          e[i + n >>> 2] = o[n >>> 2];
        }
      } else {
        e.push.apply(e, o);
      }
      this.sigBytes += t;
      return this;
    },
    clamp: function () {
      var e = this.words;
      var o = this.sigBytes;
      e[o >>> 2] &= 4294967295 << 32 - o % 4 * 8;
      e.length = t.ceil(o / 4);
    },
    clone: function () {
      var t = n.clone.call(this);
      t.words = this.words.slice(0);
      return t;
    },
    random: function (e) {
      var o = [];
      for (var i = 0; i < e; i += 4) {
        o.push(4294967296 * t.random() | 0);
      }
      return new a.init(o, e);
    }
  });
  var r = e.enc = {};
  var s = r.Hex = {
    stringify: function (t) {
      var e = t.words;
      t = t.sigBytes;
      var o = [];
      for (var i = 0; i < t; i++) {
        var n = e[i >>> 2] >>> 24 - i % 4 * 8 & 255;
        o.push((n >>> 4).toString(16));
        o.push((15 & n).toString(16));
      }
      return o.join("");
    },
    parse: function (t) {
      var e = t.length;
      var o = [];
      for (var i = 0; i < e; i += 2) {
        o[i >>> 3] |= parseInt(t.substr(i, 2), 16) << 24 - i % 8 * 4;
      }
      return new a.init(o, e / 2);
    }
  };
  var c = r.Latin1 = {
    stringify: function (t) {
      var e = t.words;
      t = t.sigBytes;
      var o = [];
      for (var i = 0; i < t; i++) {
        o.push(String.fromCharCode(e[i >>> 2] >>> 24 - i % 4 * 8 & 255));
      }
      return o.join("");
    },
    parse: function (t) {
      var e = t.length;
      var o = [];
      for (var i = 0; i < e; i++) {
        o[i >>> 2] |= (255 & t.charCodeAt(i)) << 24 - i % 4 * 8;
      }
      return new a.init(o, e);
    }
  };
  var l = r.Utf8 = {
    stringify: function (t) {
      try {
        return decodeURIComponent(escape(c.stringify(t)));
      } catch (e) {
        throw Error("Malformed UTF-8 data");
      }
    },
    parse: function (t) {
      return c.parse(unescape(encodeURIComponent(t)));
    }
  };
  var u = o.BufferedBlockAlgorithm = n.extend({
    reset: function () {
      this._data = new a.init();
      this._nDataBytes = 0;
    },
    _append: function (t) {
      "string" == typeof t && (t = l.parse(t));
      this._data.concat(t);
      this._nDataBytes += t.sigBytes;
    },
    _process: function (e) {
      var o = this._data;
      var i = o.words;
      var n = o.sigBytes;
      var r = this.blockSize;
      var s = n / (4 * r);
      e = (s = e ? t.ceil(s) : t.max((0 | s) - this._minBufferSize, 0)) * r;
      n = t.min(4 * e, n);
      if (e) {
        for (var c = 0; c < e; c += r) {
          this._doProcessBlock(i, c);
        }
        c = i.splice(0, e);
        o.sigBytes -= n;
      }
      return new a.init(c, n);
    },
    clone: function () {
      var t = n.clone.call(this);
      t._data = this._data.clone();
      return t;
    },
    _minBufferSize: 0
  });
  o.Hasher = u.extend({
    cfg: n.extend(),
    init: function (t) {
      this.cfg = this.cfg.extend(t);
      this.reset();
    },
    reset: function () {
      u.reset.call(this);
      this._doReset();
    },
    update: function (t) {
      this._append(t);
      this._process();
      return this;
    },
    finalize: function (t) {
      t && this._append(t);
      return this._doFinalize();
    },
    blockSize: 16,
    _createHelper: function (t) {
      return function (e, o) {
        return new t.init(o).finalize(e);
      };
    },
    _createHmacHelper: function (t) {
      return function (e, o) {
        return new p.HMAC.init(t, o).finalize(e);
      };
    }
  });
  var p = e.algo = {};
  return e;
}(Math);
a = CryptoJS1;
r = a.lib.WordArray;
a.enc.Base64 = {
  stringify: function (t) {
    var e = t.words;
    var o = t.sigBytes;
    var i = this._map;
    t.clamp();
    t = [];
    for (var n = 0; n < o; n += 3) {
      var a = (e[n >>> 2] >>> 24 - n % 4 * 8 & 255) << 16 | (e[n + 1 >>> 2] >>> 24 - (n + 1) % 4 * 8 & 255) << 8 | e[n + 2 >>> 2] >>> 24 - (n + 2) % 4 * 8 & 255;
      for (var r = 0; 4 > r && n + .75 * r < o; r++) {
        t.push(i.charAt(a >>> 6 * (3 - r) & 63));
      }
    }
    if (e = i.charAt(64)) {
      for (; t.length % 4;) {
        t.push(e);
      }
    }
    return t.join("");
  },
  parse: function (t) {
    var e = t.length;
    var o = this._map;
    (i = o.charAt(64)) && -1 != (i = t.indexOf(i)) && (e = i);
    var i = [];
    var n = 0;
    for (var a = 0; a < e; a++) {
      if (a % 4) {
        var s = o.indexOf(t.charAt(a - 1)) << a % 4 * 2;
        var c = o.indexOf(t.charAt(a)) >>> 6 - a % 4 * 2;
        i[n >>> 2] |= (s | c) << 24 - n % 4 * 8;
        n++;
      }
    }
    return r.create(i, n);
  },
  _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
};
(function (t) {
  function e(t, e, o, i, n, a, r) {
    return ((t = t + (e & o | ~e & i) + n + r) << a | t >>> 32 - a) + e;
  }
  function o(t, e, o, i, n, a, r) {
    return ((t = t + (e & i | o & ~i) + n + r) << a | t >>> 32 - a) + e;
  }
  function i(t, e, o, i, n, a, r) {
    return ((t = t + (e ^ o ^ i) + n + r) << a | t >>> 32 - a) + e;
  }
  function n(t, e, o, i, n, a, r) {
    return ((t = t + (o ^ (e | ~i)) + n + r) << a | t >>> 32 - a) + e;
  }
  var a = CryptoJS1;
  var r = (c = a.lib).WordArray;
  var s = c.Hasher;
  var c = a.algo;
  var l = [];
  for (var u = 0; 64 > u; u++) {
    l[u] = 4294967296 * t.abs(t.sin(u + 1)) | 0;
  }
  c = c.MD5 = s.extend({
    _doReset: function () {
      this._hash = new r.init([1732584193, 4023233417, 2562383102, 271733878]);
    },
    _doProcessBlock: function (t, a) {
      for (var r = 0; 16 > r; r++) {
        var s = t[c = a + r];
        t[c] = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8);
      }
      r = this._hash.words;
      var c = t[a + 0];
      s = t[a + 1];
      var u = t[a + 2];
      var p = t[a + 3];
      var h = t[a + 4];
      var d = t[a + 5];
      var m = t[a + 6];
      var f = t[a + 7];
      var y = t[a + 8];
      var g = t[a + 9];
      var _ = t[a + 10];
      var v = t[a + 11];
      var b = t[a + 12];
      var P = t[a + 13];
      var D = t[a + 14];
      var S = t[a + 15];
      var E = e(E = r[0], x = r[1], B = r[2], C = r[3], c, 7, l[0]);
      var C = e(C, E, x, B, s, 12, l[1]);
      var B = e(B, C, E, x, u, 17, l[2]);
      var x = e(x, B, C, E, p, 22, l[3]);
      E = e(E, x, B, C, h, 7, l[4]);
      C = e(C, E, x, B, d, 12, l[5]);
      B = e(B, C, E, x, m, 17, l[6]);
      x = e(x, B, C, E, f, 22, l[7]);
      E = e(E, x, B, C, y, 7, l[8]);
      C = e(C, E, x, B, g, 12, l[9]);
      B = e(B, C, E, x, _, 17, l[10]);
      x = e(x, B, C, E, v, 22, l[11]);
      E = e(E, x, B, C, b, 7, l[12]);
      C = e(C, E, x, B, P, 12, l[13]);
      B = e(B, C, E, x, D, 17, l[14]);
      E = o(E, x = e(x, B, C, E, S, 22, l[15]), B, C, s, 5, l[16]);
      C = o(C, E, x, B, m, 9, l[17]);
      B = o(B, C, E, x, v, 14, l[18]);
      x = o(x, B, C, E, c, 20, l[19]);
      E = o(E, x, B, C, d, 5, l[20]);
      C = o(C, E, x, B, _, 9, l[21]);
      B = o(B, C, E, x, S, 14, l[22]);
      x = o(x, B, C, E, h, 20, l[23]);
      E = o(E, x, B, C, g, 5, l[24]);
      C = o(C, E, x, B, D, 9, l[25]);
      B = o(B, C, E, x, p, 14, l[26]);
      x = o(x, B, C, E, y, 20, l[27]);
      E = o(E, x, B, C, P, 5, l[28]);
      C = o(C, E, x, B, u, 9, l[29]);
      B = o(B, C, E, x, f, 14, l[30]);
      E = i(E, x = o(x, B, C, E, b, 20, l[31]), B, C, d, 4, l[32]);
      C = i(C, E, x, B, y, 11, l[33]);
      B = i(B, C, E, x, v, 16, l[34]);
      x = i(x, B, C, E, D, 23, l[35]);
      E = i(E, x, B, C, s, 4, l[36]);
      C = i(C, E, x, B, h, 11, l[37]);
      B = i(B, C, E, x, f, 16, l[38]);
      x = i(x, B, C, E, _, 23, l[39]);
      E = i(E, x, B, C, P, 4, l[40]);
      C = i(C, E, x, B, c, 11, l[41]);
      B = i(B, C, E, x, p, 16, l[42]);
      x = i(x, B, C, E, m, 23, l[43]);
      E = i(E, x, B, C, g, 4, l[44]);
      C = i(C, E, x, B, b, 11, l[45]);
      B = i(B, C, E, x, S, 16, l[46]);
      E = n(E, x = i(x, B, C, E, u, 23, l[47]), B, C, c, 6, l[48]);
      C = n(C, E, x, B, f, 10, l[49]);
      B = n(B, C, E, x, D, 15, l[50]);
      x = n(x, B, C, E, d, 21, l[51]);
      E = n(E, x, B, C, b, 6, l[52]);
      C = n(C, E, x, B, p, 10, l[53]);
      B = n(B, C, E, x, _, 15, l[54]);
      x = n(x, B, C, E, s, 21, l[55]);
      E = n(E, x, B, C, y, 6, l[56]);
      C = n(C, E, x, B, S, 10, l[57]);
      B = n(B, C, E, x, m, 15, l[58]);
      x = n(x, B, C, E, P, 21, l[59]);
      E = n(E, x, B, C, h, 6, l[60]);
      C = n(C, E, x, B, v, 10, l[61]);
      B = n(B, C, E, x, u, 15, l[62]);
      x = n(x, B, C, E, g, 21, l[63]);
      r[0] = r[0] + E | 0;
      r[1] = r[1] + x | 0;
      r[2] = r[2] + B | 0;
      r[3] = r[3] + C | 0;
    },
    _doFinalize: function () {
      var e = this._data;
      var o = e.words;
      var i = 8 * this._nDataBytes;
      var n = 8 * e.sigBytes;
      o[n >>> 5] |= 128 << 24 - n % 32;
      var a = t.floor(i / 4294967296);
      o[15 + (n + 64 >>> 9 << 4)] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8);
      o[14 + (n + 64 >>> 9 << 4)] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);
      e.sigBytes = 4 * (o.length + 1);
      this._process();
      o = (e = this._hash).words;
      for (i = 0; 4 > i; i++) {
        n = o[i];
        o[i] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8);
      }
      return e;
    },
    clone: function () {
      var t = s.clone.call(this);
      t._hash = this._hash.clone();
      return t;
    }
  });
  a.MD5 = s._createHelper(c);
  a.HmacMD5 = s._createHmacHelper(c);
})(Math);
(function () {
  var t;
  var e = CryptoJS1;
  var o = (t = e.lib).Base;
  var i = t.WordArray;
  var n = (t = e.algo).EvpKDF = o.extend({
    cfg: o.extend({
      keySize: 4,
      hasher: t.MD5,
      iterations: 1
    }),
    init: function (t) {
      this.cfg = this.cfg.extend(t);
    },
    compute: function (t, e) {
      var o = (s = this.cfg).hasher.create();
      var n = i.create();
      var a = n.words;
      var r = s.keySize;
      for (var s = s.iterations; a.length < r;) {
        c && o.update(c);
        var c = o.update(t).finalize(e);
        o.reset();
        for (var l = 1; l < s; l++) {
          c = o.finalize(c);
          o.reset();
        }
        n.concat(c);
      }
      n.sigBytes = 4 * r;
      return n;
    }
  });
  e.EvpKDF = function (t, e, o) {
    return n.create(o).compute(t, e);
  };
})();
CryptoJS1.lib.Cipher || function () {
  var t = (h = CryptoJS1).lib;
  var e = t.Base;
  var o = t.WordArray;
  var i = t.BufferedBlockAlgorithm;
  var n = h.enc.Base64;
  var a = h.algo.EvpKDF;
  var r = t.Cipher = i.extend({
    cfg: e.extend(),
    createEncryptor: function (t, e) {
      return this.create(this._ENC_XFORM_MODE, t, e);
    },
    createDecryptor: function (t, e) {
      return this.create(this._DEC_XFORM_MODE, t, e);
    },
    init: function (t, e, o) {
      this.cfg = this.cfg.extend(o);
      this._xformMode = t;
      this._key = e;
      this.reset();
    },
    reset: function () {
      i.reset.call(this);
      this._doReset();
    },
    process: function (t) {
      this._append(t);
      return this._process();
    },
    finalize: function (t) {
      t && this._append(t);
      return this._doFinalize();
    },
    keySize: 4,
    ivSize: 4,
    _ENC_XFORM_MODE: 1,
    _DEC_XFORM_MODE: 2,
    _createHelper: function (t) {
      return {
        encrypt: function (e, o, i) {
          return ("string" == typeof o ? d : p).encrypt(t, e, o, i);
        },
        decrypt: function (e, o, i) {
          return ("string" == typeof o ? d : p).decrypt(t, e, o, i);
        }
      };
    }
  });
  t.StreamCipher = r.extend({
    _doFinalize: function () {
      return this._process(true);
    },
    blockSize: 1
  });
  var s = h.mode = {};
  var c = function (t, e, o) {
    var i = this._iv;
    if (i) {
      this._iv = undefined;
    } else {
      i = this._prevBlock;
    }
    for (var n = 0; n < o; n++) {
      t[e + n] ^= i[n];
    }
  };
  var l = (t.BlockCipherMode = e.extend({
    createEncryptor: function (t, e) {
      return this.Encryptor.create(t, e);
    },
    createDecryptor: function (t, e) {
      return this.Decryptor.create(t, e);
    },
    init: function (t, e) {
      this._cipher = t;
      this._iv = e;
    }
  })).extend();
  l.Encryptor = l.extend({
    processBlock: function (t, e) {
      var o = this._cipher;
      var i = o.blockSize;
      c.call(this, t, e, i);
      o.encryptBlock(t, e);
      this._prevBlock = t.slice(e, e + i);
    }
  });
  l.Decryptor = l.extend({
    processBlock: function (t, e) {
      var o = this._cipher;
      var i = o.blockSize;
      var n = t.slice(e, e + i);
      o.decryptBlock(t, e);
      c.call(this, t, e, i);
      this._prevBlock = n;
    }
  });
  s = s.CBC = l;
  l = (h.pad = {}).Pkcs7 = {
    pad: function (t, e) {
      var i;
      var n = (i = (i = 4 * e) - t.sigBytes % i) << 24 | i << 16 | i << 8 | i;
      var a = [];
      for (var r = 0; r < i; r += 4) {
        a.push(n);
      }
      i = o.create(a, i);
      t.concat(i);
    },
    unpad: function (t) {
      t.sigBytes -= 255 & t.words[t.sigBytes - 1 >>> 2];
    }
  };
  t.BlockCipher = r.extend({
    cfg: r.cfg.extend({
      mode: s,
      padding: l
    }),
    reset: function () {
      r.reset.call(this);
      var t = (e = this.cfg).iv;
      var e = e.mode;
      if (this._xformMode == this._ENC_XFORM_MODE) {
        var o = e.createEncryptor;
      } else {
        o = e.createDecryptor;
        this._minBufferSize = 1;
      }
      this._mode = o.call(e, this, t && t.words);
    },
    _doProcessBlock: function (t, e) {
      this._mode.processBlock(t, e);
    },
    _doFinalize: function () {
      var t = this.cfg.padding;
      if (this._xformMode == this._ENC_XFORM_MODE) {
        t.pad(this._data, this.blockSize);
        var e = this._process(true);
      } else {
        e = this._process(true);
        t.unpad(e);
      }
      return e;
    },
    blockSize: 4
  });
  var u = t.CipherParams = e.extend({
    init: function (t) {
      this.mixIn(t);
    },
    toString: function (t) {
      return (t || this.formatter).stringify(this);
    }
  });
  s = (h.format = {}).OpenSSL = {
    stringify: function (t) {
      var e = t.ciphertext;
      return ((t = t.salt) ? o.create([1398893684, 1701076831]).concat(t).concat(e) : e).toString(n);
    },
    parse: function (t) {
      var e = (t = n.parse(t)).words;
      if (1398893684 == e[0] && 1701076831 == e[1]) {
        var i = o.create(e.slice(2, 4));
        e.splice(0, 4);
        t.sigBytes -= 16;
      }
      return u.create({
        ciphertext: t,
        salt: i
      });
    }
  };
  var p = t.SerializableCipher = e.extend({
    cfg: e.extend({
      format: s
    }),
    encrypt: function (t, e, o, i) {
      i = this.cfg.extend(i);
      var n = t.createEncryptor(o, i);
      e = n.finalize(e);
      n = n.cfg;
      return u.create({
        ciphertext: e,
        key: o,
        iv: n.iv,
        algorithm: t,
        mode: n.mode,
        padding: n.padding,
        blockSize: t.blockSize,
        formatter: i.format
      });
    },
    decrypt: function (t, e, o, i) {
      i = this.cfg.extend(i);
      e = this._parse(e, i.format);
      return t.createDecryptor(o, i).finalize(e.ciphertext);
    },
    _parse: function (t, e) {
      if ("string" == typeof t) {
        return e.parse(t, this);
      } else {
        return t;
      }
    }
  });
  var h = (h.kdf = {}).OpenSSL = {
    execute: function (t, e, i, n) {
      n || (n = o.random(8));
      t = a.create({
        keySize: e + i
      }).compute(t, n);
      i = o.create(t.words.slice(e), 4 * i);
      t.sigBytes = 4 * e;
      return u.create({
        key: t,
        iv: i,
        salt: n
      });
    }
  };
  var d = t.PasswordBasedCipher = p.extend({
    cfg: p.cfg.extend({
      kdf: h
    }),
    encrypt: function (t, e, o, i) {
      o = (i = this.cfg.extend(i)).kdf.execute(o, t.keySize, t.ivSize);
      i.iv = o.iv;
      (t = p.encrypt.call(this, t, e, o.key, i)).mixIn(o);
      return t;
    },
    decrypt: function (t, e, o, i) {
      i = this.cfg.extend(i);
      e = this._parse(e, i.format);
      o = i.kdf.execute(o, t.keySize, t.ivSize, e.salt);
      i.iv = o.iv;
      return p.decrypt.call(this, t, e, o.key, i);
    }
  });
}();
(function () {
  var t = CryptoJS1;
  var e = t.lib.BlockCipher;
  var o = t.algo;
  var i = [];
  var n = [];
  var a = [];
  var r = [];
  var s = [];
  var c = [];
  var l = [];
  var u = [];
  var p = [];
  var h = [];
  var d = [];
  for (var m = 0; 256 > m; m++) {
    d[m] = 128 > m ? m << 1 : m << 1 ^ 283;
  }
  var f = 0;
  var y = 0;
  for (m = 0; 256 > m; m++) {
    var g = (g = y ^ y << 1 ^ y << 2 ^ y << 3 ^ y << 4) >>> 8 ^ 255 & g ^ 99;
    i[f] = g;
    n[g] = f;
    var _ = d[f];
    var v = d[_];
    var b = d[v];
    var P = 257 * d[g] ^ 16843008 * g;
    a[f] = P << 24 | P >>> 8;
    r[f] = P << 16 | P >>> 16;
    s[f] = P << 8 | P >>> 24;
    c[f] = P;
    P = 16843009 * b ^ 65537 * v ^ 257 * _ ^ 16843008 * f;
    l[g] = P << 24 | P >>> 8;
    u[g] = P << 16 | P >>> 16;
    p[g] = P << 8 | P >>> 24;
    h[g] = P;
    if (f) {
      f = _ ^ d[d[d[b ^ _]]];
      y ^= d[d[y]];
    } else {
      f = y = 1;
    }
  }
  var D = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
  o = o.AES = e.extend({
    _doReset: function () {
      var t = (o = this._key).words;
      var e = o.sigBytes / 4;
      var o = 4 * ((this._nRounds = e + 6) + 1);
      var n = this._keySchedule = [];
      for (var a = 0; a < o; a++) {
        if (a < e) {
          n[a] = t[a];
        } else {
          var r = n[a - 1];
          if (a % e) {
            6 < e && 4 == a % e && (r = i[r >>> 24] << 24 | i[r >>> 16 & 255] << 16 | i[r >>> 8 & 255] << 8 | i[255 & r]);
          } else {
            r = i[(r = r << 8 | r >>> 24) >>> 24] << 24 | i[r >>> 16 & 255] << 16 | i[r >>> 8 & 255] << 8 | i[255 & r];
            r ^= D[a / e | 0] << 24;
          }
          n[a] = n[a - e] ^ r;
        }
      }
      t = this._invKeySchedule = [];
      for (e = 0; e < o; e++) {
        a = o - e;
        r = e % 4 ? n[a] : n[a - 4];
        t[e] = 4 > e || 4 >= a ? r : l[i[r >>> 24]] ^ u[i[r >>> 16 & 255]] ^ p[i[r >>> 8 & 255]] ^ h[i[255 & r]];
      }
    },
    encryptBlock: function (t, e) {
      this._doCryptBlock(t, e, this._keySchedule, a, r, s, c, i);
    },
    decryptBlock: function (t, e) {
      var o = t[e + 1];
      t[e + 1] = t[e + 3];
      t[e + 3] = o;
      this._doCryptBlock(t, e, this._invKeySchedule, l, u, p, h, n);
      o = t[e + 1];
      t[e + 1] = t[e + 3];
      t[e + 3] = o;
    },
    _doCryptBlock: function (t, e, o, i, n, a, r, s) {
      var c = this._nRounds;
      var l = t[e] ^ o[0];
      var u = t[e + 1] ^ o[1];
      var p = t[e + 2] ^ o[2];
      var h = t[e + 3] ^ o[3];
      var d = 4;
      for (var m = 1; m < c; m++) {
        var f = i[l >>> 24] ^ n[u >>> 16 & 255] ^ a[p >>> 8 & 255] ^ r[255 & h] ^ o[d++];
        var y = i[u >>> 24] ^ n[p >>> 16 & 255] ^ a[h >>> 8 & 255] ^ r[255 & l] ^ o[d++];
        var g = i[p >>> 24] ^ n[h >>> 16 & 255] ^ a[l >>> 8 & 255] ^ r[255 & u] ^ o[d++];
        h = i[h >>> 24] ^ n[l >>> 16 & 255] ^ a[u >>> 8 & 255] ^ r[255 & p] ^ o[d++];
        l = f;
        u = y;
        p = g;
      }
      f = (s[l >>> 24] << 24 | s[u >>> 16 & 255] << 16 | s[p >>> 8 & 255] << 8 | s[255 & h]) ^ o[d++];
      y = (s[u >>> 24] << 24 | s[p >>> 16 & 255] << 16 | s[h >>> 8 & 255] << 8 | s[255 & l]) ^ o[d++];
      g = (s[p >>> 24] << 24 | s[h >>> 16 & 255] << 16 | s[l >>> 8 & 255] << 8 | s[255 & u]) ^ o[d++];
      h = (s[h >>> 24] << 24 | s[l >>> 16 & 255] << 16 | s[u >>> 8 & 255] << 8 | s[255 & p]) ^ o[d++];
      t[e] = f;
      t[e + 1] = y;
      t[e + 2] = g;
      t[e + 3] = h;
    },
    keySize: 8
  });
  t.AES = e._createHelper(o);
})();
window.CryptoJS1.pad.Iso10126 = {
  pad: function (t, e) {
    var o = (o = 4 * e) - t.sigBytes % o;
    t.concat(CryptoJS1.lib.WordArray.random(o - 1)).concat(CryptoJS1.lib.WordArray.create([o << 24], 1));
  },
  unpad: function (t) {
    t.sigBytes -= 255 & t.words[t.sigBytes - 1 >>> 2];
  }
};
(function (t) {
  var e;
  (function (t) {
    t[t.Local = 0] = "Local";
    t[t.Async = 1] = "Async";
    t[t.Sync = 2] = "Sync";
  })(e = e || (e = {}));
  var i = function () {
    function t() {}
    t.rotateLeft = function (t, e) {
      return t << e | t >>> 32 - e;
    };
    t.addUnsigned = function (t, e) {
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
    t.F = function (t, e, o) {
      return t & e | ~t & o;
    };
    t.G = function (t, e, o) {
      return t & o | e & ~o;
    };
    t.H = function (t, e, o) {
      return t ^ e ^ o;
    };
    t.I = function (t, e, o) {
      return e ^ (t | ~o);
    };
    t.FF = function (t, e, o, i, n, a, r) {
      t = this.addUnsigned(t, this.addUnsigned(this.addUnsigned(this.F(e, o, i), n), r));
      return this.addUnsigned(this.rotateLeft(t, a), e);
    };
    t.GG = function (t, e, o, i, n, a, r) {
      t = this.addUnsigned(t, this.addUnsigned(this.addUnsigned(this.G(e, o, i), n), r));
      return this.addUnsigned(this.rotateLeft(t, a), e);
    };
    t.HH = function (t, e, o, i, n, a, r) {
      t = this.addUnsigned(t, this.addUnsigned(this.addUnsigned(this.H(e, o, i), n), r));
      return this.addUnsigned(this.rotateLeft(t, a), e);
    };
    t.II = function (t, e, o, i, n, a, r) {
      t = this.addUnsigned(t, this.addUnsigned(this.addUnsigned(this.I(e, o, i), n), r));
      return this.addUnsigned(this.rotateLeft(t, a), e);
    };
    t.convertToWordArray = function (t) {
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
    t.wordToHex = function (t) {
      var e;
      var o = "";
      var i = "";
      for (e = 0; e <= 3; e++) {
        o += (i = "0" + (t >>> 8 * e & 255).toString(16)).substr(i.length - 2, 2);
      }
      return o;
    };
    t.uTF8Encode = function (t) {
      t = t.replace(/\x0d\x0a/g, "\n");
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
    t.md5 = function (t) {
      var e;
      var o;
      var i;
      var n;
      var a;
      var r;
      var s;
      var c;
      var l;
      var u = Array();
      t = this.uTF8Encode(t);
      u = this.convertToWordArray(t);
      r = 1732584193;
      s = 4023233417;
      c = 2562383102;
      l = 271733878;
      for (e = 0; e < u.length; e += 16) {
        o = r;
        i = s;
        n = c;
        a = l;
        r = this.FF(r, s, c, l, u[e + 0], 7, 3614090360);
        l = this.FF(l, r, s, c, u[e + 1], 12, 3905402710);
        c = this.FF(c, l, r, s, u[e + 2], 17, 606105819);
        s = this.FF(s, c, l, r, u[e + 3], 22, 3250441966);
        r = this.FF(r, s, c, l, u[e + 4], 7, 4118548399);
        l = this.FF(l, r, s, c, u[e + 5], 12, 1200080426);
        c = this.FF(c, l, r, s, u[e + 6], 17, 2821735955);
        s = this.FF(s, c, l, r, u[e + 7], 22, 4249261313);
        r = this.FF(r, s, c, l, u[e + 8], 7, 1770035416);
        l = this.FF(l, r, s, c, u[e + 9], 12, 2336552879);
        c = this.FF(c, l, r, s, u[e + 10], 17, 4294925233);
        s = this.FF(s, c, l, r, u[e + 11], 22, 2304563134);
        r = this.FF(r, s, c, l, u[e + 12], 7, 1804603682);
        l = this.FF(l, r, s, c, u[e + 13], 12, 4254626195);
        c = this.FF(c, l, r, s, u[e + 14], 17, 2792965006);
        s = this.FF(s, c, l, r, u[e + 15], 22, 1236535329);
        r = this.GG(r, s, c, l, u[e + 1], 5, 4129170786);
        l = this.GG(l, r, s, c, u[e + 6], 9, 3225465664);
        c = this.GG(c, l, r, s, u[e + 11], 14, 643717713);
        s = this.GG(s, c, l, r, u[e + 0], 20, 3921069994);
        r = this.GG(r, s, c, l, u[e + 5], 5, 3593408605);
        l = this.GG(l, r, s, c, u[e + 10], 9, 38016083);
        c = this.GG(c, l, r, s, u[e + 15], 14, 3634488961);
        s = this.GG(s, c, l, r, u[e + 4], 20, 3889429448);
        r = this.GG(r, s, c, l, u[e + 9], 5, 568446438);
        l = this.GG(l, r, s, c, u[e + 14], 9, 3275163606);
        c = this.GG(c, l, r, s, u[e + 3], 14, 4107603335);
        s = this.GG(s, c, l, r, u[e + 8], 20, 1163531501);
        r = this.GG(r, s, c, l, u[e + 13], 5, 2850285829);
        l = this.GG(l, r, s, c, u[e + 2], 9, 4243563512);
        c = this.GG(c, l, r, s, u[e + 7], 14, 1735328473);
        s = this.GG(s, c, l, r, u[e + 12], 20, 2368359562);
        r = this.HH(r, s, c, l, u[e + 5], 4, 4294588738);
        l = this.HH(l, r, s, c, u[e + 8], 11, 2272392833);
        c = this.HH(c, l, r, s, u[e + 11], 16, 1839030562);
        s = this.HH(s, c, l, r, u[e + 14], 23, 4259657740);
        r = this.HH(r, s, c, l, u[e + 1], 4, 2763975236);
        l = this.HH(l, r, s, c, u[e + 4], 11, 1272893353);
        c = this.HH(c, l, r, s, u[e + 7], 16, 4139469664);
        s = this.HH(s, c, l, r, u[e + 10], 23, 3200236656);
        r = this.HH(r, s, c, l, u[e + 13], 4, 681279174);
        l = this.HH(l, r, s, c, u[e + 0], 11, 3936430074);
        c = this.HH(c, l, r, s, u[e + 3], 16, 3572445317);
        s = this.HH(s, c, l, r, u[e + 6], 23, 76029189);
        r = this.HH(r, s, c, l, u[e + 9], 4, 3654602809);
        l = this.HH(l, r, s, c, u[e + 12], 11, 3873151461);
        c = this.HH(c, l, r, s, u[e + 15], 16, 530742520);
        s = this.HH(s, c, l, r, u[e + 2], 23, 3299628645);
        r = this.II(r, s, c, l, u[e + 0], 6, 4096336452);
        l = this.II(l, r, s, c, u[e + 7], 10, 1126891415);
        c = this.II(c, l, r, s, u[e + 14], 15, 2878612391);
        s = this.II(s, c, l, r, u[e + 5], 21, 4237533241);
        r = this.II(r, s, c, l, u[e + 12], 6, 1700485571);
        l = this.II(l, r, s, c, u[e + 3], 10, 2399980690);
        c = this.II(c, l, r, s, u[e + 10], 15, 4293915773);
        s = this.II(s, c, l, r, u[e + 1], 21, 2240044497);
        r = this.II(r, s, c, l, u[e + 8], 6, 1873313359);
        l = this.II(l, r, s, c, u[e + 15], 10, 4264355552);
        c = this.II(c, l, r, s, u[e + 6], 15, 2734768916);
        s = this.II(s, c, l, r, u[e + 13], 21, 1309151649);
        r = this.II(r, s, c, l, u[e + 4], 6, 4149444226);
        l = this.II(l, r, s, c, u[e + 11], 10, 3174756917);
        c = this.II(c, l, r, s, u[e + 2], 15, 718787259);
        s = this.II(s, c, l, r, u[e + 9], 21, 3951481745);
        r = this.addUnsigned(r, o);
        s = this.addUnsigned(s, i);
        c = this.addUnsigned(c, n);
        l = this.addUnsigned(l, a);
      }
      return (this.wordToHex(r) + this.wordToHex(s) + this.wordToHex(c) + this.wordToHex(l)).toLowerCase();
    };
    return t;
  }();
  var a = function () {
    function t() {}
    t.encrypt = function (e) {
      var o = CryptoJS1.MD5(t.authorizationSecret);
      var i = CryptoJS1.enc.Utf8.parse(e);
      var n = CryptoJS1.AES.encrypt(i, o, {
        iv: o,
        mode: CryptoJS1.mode.CBC,
        padding: CryptoJS1.pad.Iso10126
      });
      var a = {
        params: n = n.toString()
      };
      return JSON.stringify(a);
    };
    t.init = function () {
      var e = n(o().mark(function e(i) {
        var n;
        var a;
        return o().wrap(function (e) {
          for (;;) {
            switch (e.prev = e.next) {
              case 0:
                if (window.tt) {
                  e.next = 2;
                  break;
                }
                return e.abrupt("return");
              case 2:
                i && (s.appid = i);
                console.log("登陆获取用户信息~~~~~~~~~~~~~~~~~~~~~");
                n = {
                  user_id: 1,
                  user_type: 1,
                  update_time: Date.now(),
                  is_new: 0,
                  is_shielded: 0
                };
                if (!window.tt) {
                  e.next = 14;
                  break;
                }
                e.next = 8;
                return t.getLoginParams();
              case 8:
                a = e.sent;
                console.error(a);
                e.next = 12;
                return t.login(a).then(function (t) {
                  t.user_id && (n = t);
                });
              case 12:
                e.next = 16;
                break;
              case 14:
                e.next = 16;
                return t.login({
                  uid: "1"
                }).then(function (t) {
                  t.user_id && (n = t);
                }).catch(function (t) {
                  return t;
                });
              case 16:
                t.loginInfo = n;
                console.log("network.loginInfo", t.loginInfo);
                yzll_sdk.yzll_dyzt.initDyzt();
              case 19:
              case "end":
                return e.stop();
            }
          }
        }, e);
      }));
      return function (t) {
        return e.apply(this, arguments);
      };
    }();
    t.getUrl = function (e) {
      if (null == t.httpsApi[e]) {
        return console.log("非法网络接口： " + e, "Network"), null;
      } else {
        return t.host + "/" + t.httpsApi[e];
      }
    };
    t.obj2arg = function (t) {
      var e = [];
      for (var o in t) {
        e.push(o + "=" + t[o]);
      }
      return e.join("&");
    };
    t.post = function () {
      var e = n(o().mark(function e(i, n, a, r, s) {
        var c = this;
        return o().wrap(function (e) {
          for (;;) {
            switch (e.prev = e.next) {
              case 0:
                null == s && (s = 3);
                return e.abrupt("return", new yzll_sdk.Coop(function (e, o) {
                  var l;
                  var u = new XMLHttpRequest();
                  var p = false;
                  var h = false;
                  u.timeout = a || 1e4;
                  yzll_sdk.yzll_utils.sleep(u.timeout).then(function () {
                    if (!h) {
                      p = true;
                      if (s > 0) {
                        return console.log("重复请求：" + i), c.post(i, n, a, r, --s).then(e).catch(o);
                      } else {
                        return console.log("请求超时：" + i), o();
                      }
                    }
                  }).catch(function (t) {
                    return t;
                  });
                  u.onreadystatechange = function () {
                    if (4 == u.readyState && !p) {
                      h = true;
                      var t = u.responseText;
                      if (u.status >= 200 && u.status < 400) {
                        var l = {};
                        try {
                          l = JSON.parse(t);
                        } catch (d) {
                          console.log("请求解析失败： ", d);
                          return o(d);
                        }
                        console.log("请求成功：" + i, "Network", t);
                        return e(l.data);
                      }
                      if (s > 0) {
                        return console.log("重复请求：" + i, t), c.post(i, n, a, r, --s).then(e).catch(o);
                      } else {
                        return console.log("请求失败：" + i, t), o(t);
                      }
                    }
                  };
                  u.ontimeout = function (t) {
                    if (!h && !p) {
                      h = true;
                      p = true;
                      if (s > 0) {
                        return console.log("重复请求：" + i, t), c.post(i, n, a, r, --s).then(e).catch(o);
                      } else {
                        return console.log("请求超时： " + i, t), o(t);
                      }
                    }
                  };
                  u.open("POST", i, true);
                  u.setRequestHeader("Content-Type", "application/json");
                  "" != t.authorizationToken && u.setRequestHeader("X-TOKEN", t.authorizationToken);
                  if (!r) {
                    var d = JSON.stringify(n);
                    l = "" != t.authorizationSecret ? t.encrypt(d) : d;
                  }
                  u.send(l);
                  console.log("通讯请求：" + i, "Network", n);
                }));
              case 2:
              case "end":
                return e.stop();
            }
          }
        }, e);
      }));
      return function (t, o, i, n, a) {
        return e.apply(this, arguments);
      };
    }();
    t.request = function (o, i, n) {
      return new yzll_sdk.Coop(function (a, r) {
        var s = t.getUrl(o);
        if (s && (null == n || n == e.Sync)) {
          return t.post(s, i).then(function (e) {
            switch (o) {
              case "login":
                t.authorizationToken = e.token;
                t.authorizationSecret = e.appKey;
            }
            a(e);
          }).catch(function (t) {
            r(t);
          });
        }
      });
    };
    t.authorization = function () {
      var e = n(o().mark(function e() {
        var i;
        return o().wrap(function (e) {
          for (;;) {
            switch (e.prev = e.next) {
              case 0:
                (i = {}).appId = s.appid;
                return e.abrupt("return", t.request("auth", i));
              case 3:
              case "end":
                return e.stop();
            }
          }
        }, e);
      }));
      return function () {
        return e.apply(this, arguments);
      };
    }();
    t.login = function () {
      var e = n(o().mark(function e(i) {
        var n;
        return o().wrap(function (e) {
          for (;;) {
            switch (e.prev = e.next) {
              case 0:
                null == i && (i = {});
                i.appId = s.appid;
                n = "";
                window.tt && (n = window.tt.getLaunchOptionsSync().scene.toString());
                i.scene = n;
                console.log("登录参数：", "Network", i);
                return e.abrupt("return", t.request("login", i, null));
              case 7:
              case "end":
                return e.stop();
            }
          }
        }, e);
      }));
      return function (t) {
        return e.apply(this, arguments);
      };
    }();
    t.video = function () {
      var e = {
        event_type: "game_addiction",
        properties: {},
        others: {
          uvid: "1",
          video_id: "default",
          video_name: "默认视频",
          video_type: 3,
          ecpm: 0,
          timestamp: new Date().getTime()
        }
      };
      return t.request("dyReport", e, null);
    };
    t.dyReport = function (e) {
      var o = {
        clickId: e.clickid,
        event_type: e.type,
        properties: {},
        others: {
          channel: e.channel,
          creative_id: e.creativeid,
          advertiser_id: e.advertiser_id,
          ad_id: e.adid,
          request_id: e.request_id,
          group_id: e.group_id,
          ecpm: e.ecpm,
          os: e.os
        }
      };
      return t.request("dyReport", o, null);
    };
    t.ztReport = function (e) {
      var o = {
        event_type: "game_addiction",
        properties: {},
        others: {
          uvid: "1",
          video_id: "default",
          video_name: "默认视频",
          video_type: 1,
          os: e,
          ecpm: 0
        }
      };
      return t.request("dyReport", o, null);
    };
    t.getLoginParams = function () {
      var t = n(o().mark(function t() {
        return o().wrap(function (t) {
          for (;;) {
            switch (t.prev = t.next) {
              case 0:
                return t.abrupt("return", new Promise(function (t) {
                  tt.login({
                    force: false,
                    success: function (e) {
                      if (e.code || e.anonymousCode) {
                        t({
                          code: e.code,
                          anonymous_code: e.anonymousCode
                        });
                      } else {
                        t({
                          uid: 1
                        });
                      }
                    },
                    fail: function () {
                      t({
                        uid: 1
                      });
                    },
                    complete: function () {}
                  });
                }));
              case 1:
              case "end":
                return t.stop();
            }
          }
        }, t);
      }));
      return function () {
        return t.apply(this, arguments);
      };
    }();
    t.update = function () {
      var e = n(o().mark(function e(i, n) {
        var a;
        return o().wrap(function (e) {
          for (;;) {
            switch (e.prev = e.next) {
              case 0:
                a = {
                  appid: s.appid,
                  uid: t.loginInfo.user_id,
                  key: i,
                  data: n
                };
                return e.abrupt("return", t.request("update", a, null));
              case 2:
              case "end":
                return e.stop();
            }
          }
        }, e);
      }));
      return function (t, o) {
        return e.apply(this, arguments);
      };
    }();
    return t;
  }();
  a.loginInfo = null;
  a.ready = false;
  a.domainIdx = -1;
  a.city = null;
  a.timestamp = null;
  a.defaultData = {};
  a.authorizationToken = "";
  a.authorizationSecret = "";
  a.host = "https://toufang.iyingyao.com";
  a.httpsApi = {
    login: "appdata/douyin/login",
    dyReport: "appdata/ocean/report"
  };
  t.NetworkMode = e;
  t.MD5 = i;
  t.network = a;
})(window.yzll_sdk = window.yzll_sdk || {});
window.yzll_sdk = window.yzll_sdk || {};
(function (t) {
  function e(t, e, o) {
    var i = new Promise(t);
    if (e) {
      if (o) {
        var n = false;
        i.then(function (t) {
          if (!n) {
            n = true;
            e(t);
          }
        }).catch(function (t) {
          console.error("coop error", t);
          if (!n) {
            n = true;
            o(t);
          }
        });
      } else {
        i.then(e).catch(function (t) {
          console.error("promise rejected", t);
        });
      }
    } else if (o) {
      i.catch(function (t) {
        console.error("coop error", t);
        o(t);
      });
    } else {
      i.catch(function (t) {
        console.error("promise rejected", t);
      });
    }
    return i;
  }
  var o = function () {
    function t() {}
    t.sleep = function (t) {
      return new e(function (e) {
        setTimeout(function () {
          e();
        }, t);
      });
    };
    t.randByte = function () {
      return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
    };
    return t;
  }();
  t.yzll_utils = o;
  t.Coop = e;
})(window.yzll_sdk = window.yzll_sdk || {});
window.yzll_sdk = window.yzll_sdk || {};
(function (t) {
  var e = function () {
    function t() {}
    t.initDyzt = function () {
      if (window.tt) {
        var e = window.tt.getLaunchOptionsSync().query;
        if (e) {
          var o = e.channel;
          o || (o = "");
          var i = {
            channel: o,
            query: e
          };
          var n = JSON.stringify(i);
          yzll_sdk.network.update("channelData", n);
        }
        t.dyReport(t.event_type.active);
      }
    };
    t.dyReport = function (e) {
      if (window.tt) {
        var o = window.tt.getLaunchOptionsSync().query;
        console.error("query", o);
        var i = o && o.clickid;
        if (i || (console.error("没有获取到click_id"), i = "", e != t.event_type.active)) {
          var n = o && o.channel;
          console.error("渠道" + n);
          if (!n) {
            n = "";
            e != t.event_type.active && (n = yzll_sdk.network.loginInfo.channel);
          }
          var a = o && o.creativeid;
          console.error("创意id" + a);
          a || (a = "");
          var r = o && o.advertiser_id;
          console.error("广告主id" + r);
          r || (r = "");
          var s = o && o.adid;
          console.error("1.0计划id" + s);
          s || (s = "");
          var c = o && o.request_id;
          console.error("请求request_id" + c);
          c || (c = "");
          var l = o && o.projectid;
          console.error("请求projectid" + l);
          l || (l = "");
          if ("" == s) {
            s = o && o.promotionid;
            console.error("请求2.0promotionid" + s);
            s || (s = "");
          }
          var u = "2";
          if (window.Laya) {
            window.Laya.Browser.onIOS && (u = "1");
          } else {
            cc.sys.os == cc.sys.OS_IOS && (u = "1");
          }
          var p = {
            channel: n,
            clickid: i,
            creativeid: a,
            advertiser_id: r,
            adid: s,
            request_id: c,
            group_id: l,
            type: e,
            ecpm: 0,
            os: u
          };
          yzll_sdk.network.dyReport(p).then(function () {});
        }
      }
    };
    t.reportNextDayOpen = function () {
      var e = yzll_sdk.network.loginInfo.add_time;
      var o = yzll_sdk.network.loginInfo.update_time;
      e && o && t.checkTime(e, o) && t.dyReport(t.event_type.next_day_open);
    };
    t.checkTime = function (t, e) {
      var o = new Date(1e3 * t);
      var i = o.getFullYear() + "-";
      var n = (o.getMonth() + 1 < 10 ? "0" + (o.getMonth() + 1) : o.getMonth() + 1) + "-";
      var a = o.getDate() + " ";
      var r = new Date(i + n + a + "23:59:59");
      var s = r.getTime() / 1e3;
      var c = r.getTime() / 1e3 + 86400;
      return e > s && e <= c;
    };
    t.checkVideoReport = function (t) {
      if (window.tt) {
        var e = "2";
        if (window.Laya) {
          window.Laya.Browser.onIOS && (e = "1");
        } else {
          cc.sys.os == cc.sys.OS_IOS && (e = "1");
        }
        yzll_sdk.network.ztReport(e).then(function () {
          t && yzll_sdk.network.video();
        });
      }
    };
    return t;
  }();
  e.event_type = {
    active: "active",
    game_addiction: "game_addiction",
    next_day_open: "next_day_open"
  };
  t.yzll_dyzt = e;
})(window.yzll_sdk = window.yzll_sdk || {});
window.yzll_sdk = window.yzll_sdk || {};