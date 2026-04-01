var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10Util = require("Util");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_WeatherIceEffect = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initWeatherIceEffect = function (t) {
    var e = $10Util.default.convertToTargetNodeSpace(t, this.node);
    this.node.position = e;
    var o = this.node.children[0];
    for (var i = 0; i < 5; ++i) {
      var n = cc.instantiate(o);
      n.active = true;
      this.node.addChild(n);
      var a = -this.node.width / 2 + Math.floor(100 * Math.random()) % this.node.width;
      var s = -this.node.height / 2 + Math.floor(100 * Math.random()) % this.node.height;
      n.position = cc.v3(a, s);
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_WeatherIceEffect;