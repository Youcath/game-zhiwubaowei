Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RobotJSON = undefined;
var exp_RobotJSON = function () {
  function _ctor() {
    this.mRobotInfos = [];
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == this._instance && (this._instance = new _ctor());
      return this._instance;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.loadJson = function () {};
  _ctor.prototype.getRobotInfos = function () {
    return this.mRobotInfos.slice();
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.RobotJSON = exp_RobotJSON;