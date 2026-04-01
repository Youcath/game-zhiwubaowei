Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10CommonUtil = require("CommonUtil");
var $10MyWScoket = require("MyWScoket");
require("base64").Base64;
var def_SocketEngine = function () {
  function _ctor(t) {
    this._socket = new $10MyWScoket.default(t);
    this._socket.setSocketSink(this);
    this._name = t;
  }
  _ctor.prototype.setSocketEngineSink = function (t) {
    this._socketEngineSink = t;
  };
  _ctor.prototype.connect = function (t, e) {
    this.initValue();
    return 0 === this._socket.connect("ws://" + t + ":" + e);
  };
  _ctor.prototype.connectUrl = function (t) {
    this.initValue();
    return 0 === this._socket.connect(t);
  };
  _ctor.prototype.disconnect = function () {
    this.initValue();
    this._socket.disconnect();
  };
  _ctor.prototype.send = function () {
    return !!this.isAlive() || ($10CommonUtil.CommonUtil.print("####### socket is not alive"), false);
  };
  _ctor.prototype.isAlive = function () {
    return this._socket.isOpen();
  };
  _ctor.prototype.initValue = function () {};
  _ctor.prototype.onopen = function () {
    this._socketEngineSink && this._socketEngineSink.onEventSocketOpen();
  };
  _ctor.prototype.onclose = function (t) {
    this._socketEngineSink && this._socketEngineSink.onEventSocketClose(t);
  };
  _ctor.prototype.onerror = function (t) {
    this._socketEngineSink && this._socketEngineSink.onEventSocketError(t);
  };
  _ctor.prototype.onmessage = function () {};
  return _ctor;
}();
exports.default = def_SocketEngine;