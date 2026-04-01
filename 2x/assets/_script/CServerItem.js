Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CServerItem = undefined;
var i;
var $10ProtocolGameServer = require("ProtocolGameServer");
var $10SocketEngine = require("SocketEngine");
var $10CommonUtil = require("CommonUtil");
var $10MakeParameters = require("MakeParameters");
var $10SceneManager = require("SceneManager");
var $10UserCenterManager = require("UserCenterManager");
var u = new Date();
(function (t) {
  t[t.ReconnectStatus_NULL = 0] = "ReconnectStatus_NULL";
  t[t.ReconnectStatus_DisConnect = 1] = "ReconnectStatus_DisConnect";
  t[t.ReconnectStatus_Connecting = 2] = "ReconnectStatus_Connecting";
})(i || (i = {}));
var exp_CServerItem = function () {
  function _ctor() {
    var e = this;
    this._isShowReconnMask = false;
    this._sendMsgInfoCache = [];
    this._name = "CServerItem";
    this._socketEngine = new $10SocketEngine.default(this._name);
    this._socketEngine.setSocketEngineSink(this);
    this._eInReconnect = i.ReconnectStatus_NULL;
    this._fHeatTickTime = 0;
    this._fReconnMaskTime = 0;
    this._fReconnTime = 0;
    this._reconnCount = 0;
    u = new Date();
    setInterval(function () {
      var o = new Date();
      if ("" != e._token) {
        _ctor.instance.upDataTime((o.getTime() - u.getTime()) / 1e3);
        u = o;
      } else {
        u = o;
      }
    }, 500);
    this._token = "";
    this._sessionId = "";
    this._uid = null;
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == this._instance && (this._instance = new _ctor());
      return this._instance;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "token", {
    get: function () {
      return this._token;
    },
    set: function (t) {
      this._token = t;
      $10CommonUtil.CommonUtil.print("token", t);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "sessionId", {
    get: function () {
      return this._sessionId;
    },
    set: function (t) {
      this._sessionId = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "uid", {
    get: function () {
      return this._uid;
    },
    set: function (t) {
      this._uid = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "newPlayer", {
    get: function () {
      return this._newPlayer;
    },
    set: function (t) {
      this._newPlayer = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "nickName", {
    get: function () {
      return this._nickName;
    },
    set: function (t) {
      this._nickName = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "head", {
    get: function () {
      return this._head;
    },
    set: function (t) {
      this._head = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "nameChangeNum", {
    get: function () {
      return this._nameChangeNum;
    },
    set: function (t) {
      this._nameChangeNum = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.upDataTime = function (e) {
    if (_ctor.instance && this._eInReconnect != i.ReconnectStatus_DisConnect) {
      if (this._eInReconnect === i.ReconnectStatus_NULL) {
        this._fReconnTime += e;
      } else {
        this._eInReconnect === i.ReconnectStatus_Connecting && (this._fHeatTickTime += e);
      }
      this._fHeatTickTime >= 10 && this.resetTick();
      if (this._fReconnMaskTime > 0) {
        this._fReconnMaskTime -= e, this._fReconnMaskTime < 0 && !this._isShowReconnMask && (this._isShowReconnMask = true, $10SceneManager.SceneManager.instance.showLoading("正在追回网络信号喵", 120, null, true));
      }
      if (this._fReconnTime >= 5) {
        this.resetReconn(), $10CommonUtil.CommonUtil.print("超时重连~"), this.connectServer(), this._reconnCount++, this._reconnCount >= 3 && (this._fReconnMaskTime = 0, this._socketEngine.disconnect(), this._isShowReconnMask = false, $10SceneManager.SceneManager.instance.hideLoading(null, true), this._eInReconnect = i.ReconnectStatus_DisConnect);
      }
    }
  };
  _ctor.prototype.resetTick = function () {
    this._eInReconnect = i.ReconnectStatus_NULL;
    this._fHeatTickTime = 0;
  };
  _ctor.prototype.heartTick = function () {
    this._eInReconnect = i.ReconnectStatus_Connecting;
    yzll.gameConfig.heartLog && $10CommonUtil.CommonUtil.print("收到心跳", 1);
    this.resetRecoonMask();
  };
  _ctor.prototype.resetReconn = function () {
    this._fReconnTime = 0;
  };
  _ctor.prototype.connectServer = function () {
    this.resetTick();
    return !!this._socketEngine.connectUrl($10UserCenterManager.UserCenterManager.instance.wsUrl);
  };
  _ctor.prototype.onMessageSend = function () {
    this._fReconnMaskTime = 2;
  };
  _ctor.prototype.resetRecoonMask = function () {
    if (this._isShowReconnMask) {
      this._isShowReconnMask = false;
      $10SceneManager.SceneManager.instance.hideLoading(null, true);
    }
    this._fReconnMaskTime = 0;
    this._reconnCount = 0;
  };
  _ctor.prototype.onEventSocketOpen = function () {
    if (this._eInReconnect != i.ReconnectStatus_DisConnect) {
      this._eInReconnect = i.ReconnectStatus_Connecting;
      $10CommonUtil.CommonUtil.print(this._name + "::onEventSocketOpen");
    }
  };
  _ctor.prototype.onEventSocketClose = function (t) {
    if (this._eInReconnect != i.ReconnectStatus_DisConnect) {
      this._eInReconnect = i.ReconnectStatus_NULL;
      $10SceneManager.SceneManager.instance.showLoading("正在追回网络信号喵", 120, null, true);
      this._isShowReconnMask = true;
      $10CommonUtil.CommonUtil.print(this._name + "::onEventSocketClose", t);
    }
  };
  _ctor.prototype.onEventSocketError = function (t) {
    $10CommonUtil.CommonUtil.print(this._name + "::onEventSocketError", JSON.stringify(t));
  };
  _ctor.prototype.sendSocketData = function (t, e, o) {
    undefined === o && (o = true);
    if (this._eInReconnect != i.ReconnectStatus_DisConnect) {
      var a = $10MakeParameters.default.make(t, e);
      o && $10CommonUtil.CommonUtil.print("发送协议::" + $10ProtocolGameServer.CMD_GameServer_Command[t] + "--" + t, "参数::" + JSON.stringify(e));
      this.send(t, a);
    }
  };
  _ctor.prototype.send = function () {
    this._eInReconnect != i.ReconnectStatus_DisConnect && this.resetTick();
  };
  _ctor.prototype.tickOffLine = function () {
    this.disconnect();
  };
  _ctor.prototype.disconnect = function () {
    this._socketEngine.disconnect();
    this._eInReconnect = i.ReconnectStatus_DisConnect;
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.CServerItem = exp_CServerItem;