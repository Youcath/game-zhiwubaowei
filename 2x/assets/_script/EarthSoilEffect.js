var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ComponentBase = require("ComponentBase");
var $10AnimationCtrl = require("AnimationCtrl");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_EarthSoilEffect = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mAnimCtrl = null;
    return e;
  }
  cc__extends(_ctor, t);
  cc__decorate([ccp_property({
    type: $10AnimationCtrl.default
  })], _ctor.prototype, "mAnimCtrl", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComponentBase.ComponentBase);
exports.default = def_EarthSoilEffect;