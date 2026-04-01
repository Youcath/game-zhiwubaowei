var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BulletBase = require("BulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_BulletPlant = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, o, i, n, a, r) {
    t.prototype.initBullet.call(this, e, o, i, n, a, r);
    this.setBulletSpriteFrame(r);
  };
  _ctor.prototype.moveArrive = function (e) {
    this.addBulletHit(e);
    t.prototype.moveArrive.call(this, e);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_BulletPlant;