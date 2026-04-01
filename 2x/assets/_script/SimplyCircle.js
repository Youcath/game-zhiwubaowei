Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyVec2 = require("SimplyVec2");
var def_SimplyCircle = function () {
  function _ctor(t, e, o) {
    this.x = 0;
    this.y = 0;
    this.radius = 0;
    this.x = t;
    this.y = e;
    this.radius = o;
  }
  Object.defineProperty(_ctor.prototype, "center", {
    get: function () {
      return new $10SimplyVec2.default(this.x, this.y);
    },
    enumerable: false,
    configurable: true
  });
  return _ctor;
}();
exports.default = def_SimplyCircle;