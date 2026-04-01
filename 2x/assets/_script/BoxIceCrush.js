var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10NodePoolManager = require("NodePoolManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BoxIceCrush = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mCrushSp = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBoxIceCrush = function () {
    var t = this;
    this.mCrushSp.setCompleteListener(function () {
      $10NodePoolManager.default.instance.putNode(t.node);
    });
    this.mCrushSp.setAnimation(0, "broken", false);
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mCrushSp", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BoxIceCrush;