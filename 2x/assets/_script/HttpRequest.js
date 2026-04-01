var cc__awaiter = __awaiter;
var cc__generator = __generator;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpRequest = undefined;
var $10DataManager = require("DataManager");
var exp_HttpRequest = function () {
  function _ctor() {
    this.ddd = "yuanzililiang";
  }
  Object.defineProperty(_ctor, "inst", {
    get: function () {
      this._inst || (this._inst = new _ctor());
      return this._inst;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.request = function (t, e, o, r, s) {
    undefined === s && (s = null);
    return cc__awaiter(this, undefined, undefined, function () {
      return cc__generator(this, function () {
        r || (r = cc.sys.isBrowser ? "https://minigame.yuanzililiang.cn/pinball/zombie" : cc.sys.platform == cc.sys.WECHAT_GAME ? "https://minigame.yuanzililiang.cn/pinball/zombie" : (cc.sys.platform, cc.sys.BYTEDANCE_GAME, "https://minigame.yuanzililiang.cn/pinball/zombie"));
        return [2, new Promise(function (i, n) {
          var c = new XMLHttpRequest();
          c.timeout = 5e3;
          c.ontimeout = function () {
            n("timeout");
          };
          c.onabort = function () {
            n("user abort");
          };
          c.onerror = function () {
            n("network error");
          };
          c.onreadystatechange = function () {
            if (4 == c.readyState && c.status >= 200 && c.status <= 400) {
              var t = c.response;
              i(t);
              t.code;
            }
          };
          c.responseType = "json";
          var l = r + e;
          if ("GET" == t) {
            c.open("GET", l, true);
            c.send();
          } else if ("POST" == t) {
            c.open("POST", l, true), c.setRequestHeader("Content-Type", "application/json"), c.setRequestHeader("Access-Control-Allow-Origin", "*"), c.setRequestHeader("APPID", "396331179514995"), $10DataManager.DataManager.token && c.setRequestHeader("X-TOKEN", $10DataManager.DataManager.token), s && c.setRequestHeader(s.key, s.value), c.send(o);
          }
        })];
      });
    });
  };
  _ctor.prototype.encryptStr = function (t, e) {
    undefined === e && (e = null);
    if (null == t) {
      return "";
    }
    try {
      var o = CryptoJS.enc.Utf8.parse(t);
      e = CryptoJS.MD5(e || this.ddd);
      return CryptoJS.AES.encrypt(o, e, {
        iv: e,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Iso10126
      }).toString();
    } catch (i) {
      console.log("encryptStr error::", i);
    }
    return "";
  };
  _ctor.prototype.decryptStr = function (t, e) {
    undefined === e && (e = null);
    if (null == t) {
      return "";
    }
    try {
      e = CryptoJS.MD5(e || this.ddd);
      return CryptoJS.AES.decrypt(t, e, {
        iv: e,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Iso10126
      }).toString(CryptoJS.enc.Utf8);
    } catch (o) {
      cc.log(o);
    }
    return "";
  };
  _ctor.prototype.changeUserInfo = function (e, o, i) {
    var n = {
      nickname: e,
      head: o
    };
    var a = JSON.stringify({
      params: _ctor.inst.encryptStr(JSON.stringify(n))
    });
    this.request("POST", "/player/updateNickname", a).then(function (t) {
      if (200 == t.code) {
        console.log("changeUserInfo:", t);
        i && i(true);
      } else {
        console.error("更新玩家信息失败:", t);
        i && i(false);
      }
    }).catch(function (t) {
      console.error("更新玩家信息失败", t);
      i && i(false);
    });
  };
  _ctor._inst = null;
  return _ctor;
}();
exports.HttpRequest = exp_HttpRequest;