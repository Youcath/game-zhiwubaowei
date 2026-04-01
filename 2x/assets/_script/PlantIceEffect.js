var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PlantIceEffect = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mIceSpr = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initPlantIceEffect = function (t) {
    var e = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/boxIce/" + t.frame,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (o) {
      e.mIceSpr.spriteFrame = o;
      e.mIceSpr.node.scaleX = t.scaleX;
      e.mIceSpr.node.scaleY = t.scaleY;
      e.mIceSpr.node.angle = t.angle;
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.updateState = function (t) {
    this.mIceSpr.node.opacity = 100 * t + 155;
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mIceSpr", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PlantIceEffect;