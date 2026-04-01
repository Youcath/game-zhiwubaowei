var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyCircle = require("SimplyCircle");
var $10BaseSimplyCollider = require("BaseSimplyCollider");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_menu = cc__decorator.menu;
var def_SimplyCircleCollider = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._canCollider = true;
    e.radius = 0;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "canCollider", {
    set: function (t) {
      this._canCollider = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "circle", {
    get: function () {
      var t = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
      return new $10SimplyCircle.default(t.x, t.y, this.radius * this.node.scale);
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.drawCollider = function () {
    this.graphics.clear();
    this.graphics.circle(0, 0, this.radius * this.node.scale);
    this.graphics.stroke();
  };
  cc__decorate([ccp_property({
    type: cc.Integer
  })], _ctor.prototype, "radius", undefined);
  return cc__decorate([ccp_ccclass, ccp_menu("SimplyCollider/SimplyCircleCollider")], _ctor);
}($10BaseSimplyCollider.default);
exports.default = def_SimplyCircleCollider;