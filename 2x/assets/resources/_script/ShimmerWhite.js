var r;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_menu = cc__decorator.menu;
var def_ShimmerWhite = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.duration = 0;
    e.median = 0;
    e.time = 0;
    e.material = null;
    e.spAnim = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    this.time = 0;
    this.median = this.duration / 2;
    if (this.node.getComponent(cc.Sprite)) {
      this.material = this.node.getComponent(cc.Sprite).getMaterial(0);
    } else {
      this.spAnim = this.node.getComponent(sp.Skeleton);
      this.material = this.spAnim.getMaterial(0);
    }
    this.material.setProperty("u_rate", 1);
  };
  _ctor.prototype.onEnable = function () {
    this.time = 0;
    this.material.setProperty("u_rate", 1);
  };
  _ctor.prototype.onDisable = function () {
    this.time = 0;
    this.material.setProperty("u_rate", 1);
  };
  _ctor.prototype.show = function (t) {
    undefined === t && (t = this.duration);
    this.duration = t;
    this.time = this.duration;
    this.material.setProperty("u_rate", 1);
  };
  _ctor.prototype.showColor = function (t, e) {
    undefined === e && (e = this.duration);
    if (0 == this.time) {
      this.duration = e;
      this.time = this.duration;
      this.material.setProperty("u_rate", 1);
      this.material.setProperty("u_color", cc.color(t));
    }
  };
  _ctor.prototype.update = function (t) {
    if (this.time > 0) {
      this.time -= t;
      this.time < 0 && (this.time = 0);
      var e = 1 - this.time / this.duration;
      this.material.setProperty("u_rate", e);
      this.spAnim && this.spAnim._updateMaterial();
    }
  };
  cc__decorate([ccp_property(cc.Integer)], _ctor.prototype, "duration", undefined);
  return cc__decorate([ccp_ccclass, ccp_menu("Shader/ShimmerWhite")], _ctor);
}(cc.Component);
exports.default = def_ShimmerWhite;