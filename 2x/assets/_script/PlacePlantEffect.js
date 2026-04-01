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
var def_PlacePlantEffect = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mPlaceSp = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.mPlaceSp.setCompleteListener(function () {
      $10NodePoolManager.default.instance.putNode(t.node);
    });
  };
  _ctor.prototype.play = function () {
    this.mPlaceSp.setAnimation(0, "bang", false);
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mPlaceSp", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PlacePlantEffect;