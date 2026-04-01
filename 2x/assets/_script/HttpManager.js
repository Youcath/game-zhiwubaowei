var i;
var cc__awaiter = __awaiter;
var cc__generator = __generator;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpManager = exports.NET_ERROR_CODE = undefined;
(function (t) {
  t[t.NONE = 0] = "NONE";
  t[t.TIME_OUT = 1] = "TIME_OUT";
  t[t.ERROR = 2] = "ERROR";
})(i = exports.NET_ERROR_CODE || (exports.NET_ERROR_CODE = {}));
var exp_HttpManager = function () {
  function _ctor() {
    this._account = "";
    this._serverInfo = null;
    this.timeOut = 5e3;
  }
  Object.defineProperty(_ctor.prototype, "account", {
    get: function () {
      return this._account;
    },
    set: function (t) {
      this._account = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == this._instance && (this._instance = new _ctor());
      return this._instance;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.getUrl = function () {
    return "";
  };
  _ctor.prototype.doHttpAsynGet = function (t) {
    var e = this;
    return new Promise(function (o, r) {
      return cc__awaiter(e, undefined, undefined, function () {
        var e;
        var n;
        return cc__generator(this, function () {
          (e = new XMLHttpRequest()).onreadystatechange = function () {
            var t = e;
            if (4 == t.readyState && t.status >= 200 && t.status < 400 && 200 == t.status) {
              var i = JSON.parse(t.response);
              o(i);
            }
          };
          e.ontimeout = function (t) {
            r({
              code: i.TIME_OUT,
              msg: t
            });
          };
          e.onerror = function (t) {
            r({
              code: i.ERROR,
              msg: t
            });
          };
          n = this.getUrl() + t;
          e.open("GET", n);
          e.setRequestHeader("X-TOKEN", this.account);
          e.send();
          return [2];
        });
      });
    });
  };
  _ctor.prototype.doHttpAsynPost = function (t, e, o) {
    var r = this;
    undefined === o && (o = "");
    return new Promise(function (s, c) {
      return cc__awaiter(r, undefined, undefined, function () {
        var n;
        var r;
        return cc__generator(this, function () {
          (n = new XMLHttpRequest()).onload = function () {
            if (200 == n.status) {
              var t = n.response;
              s(t);
            }
          };
          n.ontimeout = function (t) {
            c({
              code: i.TIME_OUT,
              msg: t
            });
          };
          n.onerror = function (t) {
            c({
              code: i.ERROR,
              msg: t
            });
          };
          r = t;
          n.open("POST", r);
          n.responseType = "json";
          n.setRequestHeader("Content-Type", "application/json");
          n.setRequestHeader("X-TOKEN", o);
          n.send(e);
          return [2];
        });
      });
    });
  };
  _ctor.prototype.doHttpAsynPostNotToken = function (t, e) {
    var o = this;
    return new Promise(function (r, s) {
      return cc__awaiter(o, undefined, undefined, function () {
        var o;
        var n;
        return cc__generator(this, function () {
          (o = new XMLHttpRequest()).onload = function () {
            if (200 == o.status) {
              var t = o.response;
              r(t);
            }
          };
          o.timeout = this.timeOut;
          o.ontimeout = function (t) {
            s({
              code: i.TIME_OUT,
              msg: t
            });
          };
          o.onerror = function (t) {
            s({
              code: i.ERROR,
              msg: t
            });
          };
          n = t;
          o.open("POST", n);
          o.responseType = "json";
          o.setRequestHeader("Content-Type", "application/json");
          o.send(e);
          return [2];
        });
      });
    });
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.HttpManager = exp_HttpManager;