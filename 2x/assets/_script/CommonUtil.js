Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommonUtil = undefined;
var exp_CommonUtil = function () {
  function _ctor() {}
  _ctor.print = function (t, e) {
    if (yzll.gameConfig.debug) {
      if (this.isEmpty(e)) {
        console.log(t);
      } else {
        console.log(t, e);
      }
    }
  };
  _ctor.zeroVal = function (t, e) {
    this.isEmpty(e[t]) && (e[t] = 0);
  };
  _ctor.isEmpty = function (t) {
    return null == t || "undefined" === t || "" === t;
  };
  _ctor.isObjEmpty = function (t) {
    return Object.keys(t).length <= 0;
  };
  return _ctor;
}();
exports.CommonUtil = exp_CommonUtil;