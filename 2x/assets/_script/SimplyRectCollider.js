var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyRect = require("SimplyRect");
var $10BaseSimplyCollider = require("BaseSimplyCollider");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var ccp_menu = cc__decorator.menu;
var def_SimplyRectCollider = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "rect", {
    get: function () {
      var t = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
      var e = this.node.angle * Math.PI / 180;
      var o = this.node.scaleX;
      var i = this.node.scaleY;
      var n = this.node.width * o;
      var a = this.node.height * i;
      var s = t.clone().add(cc.v2((.5 - this.node.anchorX) * n, (.5 - this.node.anchorY) * a));
      t = t.clone().addSelf(s.sub(t).rotate(e));
      return new $10SimplyRect.default(t.x, t.y, n, a, this.node.angle);
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.drawCollider = function () {
    var t = this.rect;
    this.graphics.clear();
    this.graphics.rect((this.node.anchorX - 1) * t.width, -this.node.anchorY * t.height, t.width, t.height);
    this.graphics.stroke();
  };
  return cc__decorate([ccp_ccclass, ccp_menu("SimplyCollider/SimplyRectCollider")], _ctor);
}($10BaseSimplyCollider.default);
exports.default = def_SimplyRectCollider;