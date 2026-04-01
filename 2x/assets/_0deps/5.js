// _process
var o,
    i,
    n = module.exports = {};
  function a() {
    throw new Error("setTimeout has not been defined");
  }
  function r() {
    throw new Error("clearTimeout has not been defined");
  }
  function s(t) {
    if (o === setTimeout) return setTimeout(t, 0);
    if ((o === a || !o) && setTimeout) return o = setTimeout, setTimeout(t, 0);
    try {
      return o(t, 0);
    } catch (e) {
      try {
        return o.call(null, t, 0);
      } catch (e) {
        return o.call(this, t, 0);
      }
    }
  }
  function c(t) {
    if (i === clearTimeout) return clearTimeout(t);
    if ((i === r || !i) && clearTimeout) return i = clearTimeout, clearTimeout(t);
    try {
      return i(t);
    } catch (e) {
      try {
        return i.call(null, t);
      } catch (e) {
        return i.call(this, t);
      }
    }
  }
  (function () {
    try {
      o = "function" == typeof setTimeout ? setTimeout : a;
    } catch (t) {
      o = a;
    }
    try {
      i = "function" == typeof clearTimeout ? clearTimeout : r;
    } catch (t) {
      i = r;
    }
  })();
  var l,
    u = [],
    p = !1,
    h = -1;
  function d() {
    p && l && (p = !1, l.length ? u = l.concat(u) : h = -1, u.length && m());
  }
  function m() {
    if (!p) {
      var t = s(d);
      p = !0;
      for (var e = u.length; e;) {
        for (l = u, u = []; ++h < e;) l && l[h].run();
        h = -1, e = u.length;
      }
      l = null, p = !1, c(t);
    }
  }
  function f(t, e) {
    this.fun = t, this.array = e;
  }
  function y() {}
  n.nextTick = function (t) {
    var e = new Array(arguments.length - 1);
    if (arguments.length > 1) for (var o = 1; o < arguments.length; o++) e[o - 1] = arguments[o];
    u.push(new f(t, e)), 1 !== u.length || p || s(m);
  }, f.prototype.run = function () {
    this.fun.apply(null, this.array);
  }, n.title = "browser", n.browser = !0, n.env = {}, n.argv = [], n.version = "", n.versions = {}, n.on = y, n.addListener = y, n.once = y, n.off = y, n.removeListener = y, n.removeAllListeners = y, n.emit = y, n.prependListener = y, n.prependOnceListener = y, n.listeners = function () {
    return [];
  }, n.binding = function () {
    throw new Error("process.binding is not supported");
  }, n.cwd = function () {
    return "/";
  }, n.chdir = function () {
    throw new Error("process.chdir is not supported");
  }, n.umask = function () {
    return 0;
  };