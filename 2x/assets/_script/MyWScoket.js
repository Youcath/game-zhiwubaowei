Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10CommonUtil = require("CommonUtil");
var def_MyWScoket = function () {
  function _ctor(t) {
    this._name = t;
    this._isConn = false;
    this._client = null;
  }
  _ctor.prototype.conn = function (t) {
    var e = this;
    var o = null;
    if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
      var n = cc.url.raw("resources/cacert.pem");
      cc.loader.md5Pipe && (n = cc.loader.md5Pipe.transformURL(n));
      o = new WebSocket(t, null, n);
    } else {
      o = new WebSocket(t);
    }
    this._client = o;
    o.binaryType = "arraybuffer";
    o.onopen = function (t) {
      e._isConn = true;
      e._socketSink.onopen(t);
    };
    o.onmessage = function (t) {
      if (t && t.data && t.data instanceof ArrayBuffer) {
        e._socketSink.onmessage(t.data);
      } else {
        $10CommonUtil.CommonUtil.print("onmessage error", t);
      }
    };
    o.onclose = function (t) {
      $10CommonUtil.CommonUtil.print("====ws断开连接！ name = ", e._name);
      e._isConn = false;
      e._socketSink.onclose(t);
    };
    o.onerror = function (t) {
      $10CommonUtil.CommonUtil.print("====ws连接错误！ name = " + e._name, " code=" + t.errcode);
      e._isConn = false;
      e._socketSink.onerror(t);
    };
    o.ontimeout = function () {
      $10CommonUtil.CommonUtil.print("ws连接超时---ontimeout");
    };
  };
  _ctor.prototype.send = function (t) {
    try {
      this.isOpen() && this._client.send(t);
    } catch (e) {}
  };
  _ctor.prototype.connect = function (t) {
    this.disconnect();
    this.conn(t);
    return 0;
  };
  _ctor.prototype.disconnect = function () {
    this.isOpen() && this._client.close();
  };
  _ctor.prototype.isOpen = function () {
    return !!this._client && this._isConn;
  };
  _ctor.prototype.setSocketSink = function (t) {
    this._socketSink = t;
  };
  return _ctor;
}();
exports.default = def_MyWScoket;