var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10Util = require("Util");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_WeatherIceBroken = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBrokenSpine = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.show = function (t) {
    var e = this;
    if (t) {
      var o = $10Util.default.convertToTargetNodeSpace(t, this.node);
      this.node.position = o;
    }
    this.mBrokenSpine.setCompleteListener(function () {
      e.node.destroy();
      e.node.removeFromParent();
    });
    this.mBrokenSpine.setAnimation(0, "hit2", false);
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mBrokenSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_WeatherIceBroken;