Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NumericData = undefined;
var $10Numeric = require("Numeric");
var exp_NumericData = function () {
  function _ctor() {
    this.propertyMap = new Map();
  }
  _ctor.prototype.init = function (t) {
    for (var e in t) {
      isNaN(e) || this.propertyMap.set(Number(e), new $10Numeric.default());
    }
  };
  _ctor.prototype.getNumeric = function (t) {
    if (this.propertyMap.has(t)) {
      return this.propertyMap.get(t);
    } else {
      return null;
    }
  };
  _ctor.prototype.clear = function () {
    this.propertyMap.forEach(function (t) {
      t.clear();
    });
    this.propertyMap.clear();
  };
  return _ctor;
}();
exports.NumericData = exp_NumericData;