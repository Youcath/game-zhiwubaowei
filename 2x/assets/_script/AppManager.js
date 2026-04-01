Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppManager = undefined;
var $10AppProxy = require("AppProxy");
var $10TimeUtil = require("TimeUtil");
var $10EventManager = require("EventManager");
var exp_AppManager = function () {
  function _ctor() {
    this._endTime = 0;
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == _ctor._instance && (_ctor._instance = new _ctor());
      return _ctor._instance;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.checkEndTime = function () {
    var t = $10TimeUtil.TimeUtil.getTime();
    0 === this._endTime && (this._endTime = $10TimeUtil.TimeUtil.getDayEndTime(t));
    if (t > this._endTime) {
      this._endTime = $10TimeUtil.TimeUtil.getDayEndTime(t);
      $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.DAY_UPDATE);
    }
    setTimeout(this.checkEndTime.bind(this), 6e4);
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.AppManager = exp_AppManager;