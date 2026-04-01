var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDPlantStandAni = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.horizontalSwayAmount = .08;
    e.verticalSwayAmount = .03;
    e.swaySpeed = 1;
    e.randomDelay = true;
    e.originalScaleX = 1;
    e.originalScaleY = 1;
    e.timeOffset = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    this.originalScaleX = this.node.scaleX;
    this.originalScaleY = this.node.scaleY;
    this.node.anchorX = .5;
    this.node.anchorY = 0;
    this.randomDelay && (this.timeOffset = Math.random() * Math.PI * 2);
  };
  _ctor.prototype.start = function () {
    this.startSwayAnimation();
  };
  _ctor.prototype.startSwayAnimation = function () {
    var t = this;
    cc.tween(this.node).repeatForever(cc.tween().call(function () {
      var e = .001 * cc.director.getTotalTime() * t.swaySpeed + t.timeOffset;
      var n = Math.sin(e) * t.horizontalSwayAmount;
      var o = t.originalScaleX + n;
      var i = Math.sin(1.5 * e) * t.verticalSwayAmount;
      var a = t.originalScaleY + i;
      t.node.scaleX = o;
      t.node.scaleY = a;
    }).delay(.016)).start();
  };
  _ctor.prototype.stopSway = function () {
    this.node.stopAllActions();
    this.node.scaleX = this.originalScaleX;
    this.node.scaleY = this.originalScaleY;
  };
  _ctor.prototype.resumeSway = function () {
    this.node.stopAllActions();
    this.startSwayAnimation();
  };
  _ctor.prototype.setSwayParams = function (t, e, n) {
    this.horizontalSwayAmount = t;
    this.verticalSwayAmount = e;
    this.swaySpeed = n;
    this.resumeSway();
  };
  cc__decorate([ccp_property({
    displayName: "随机延迟",
    tooltip: "是否添加随机延迟，让多个植物不同步摆动"
  })], _ctor.prototype, "randomDelay", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDPlantStandAni;