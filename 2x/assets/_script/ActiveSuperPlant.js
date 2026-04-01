var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10HomeEnum = require("HomeEnum");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_ActiveSuperPlant = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSpine = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.mSpine.setCompleteListener(function () {
      t.node.destroy();
      t.node.removeFromParent();
    });
  };
  _ctor.prototype.play = function () {
    this.mSpine.setAnimation(0, "jihuo", false);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/New_Fish", $10HomeEnum.Bundles.RES);
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_ActiveSuperPlant;