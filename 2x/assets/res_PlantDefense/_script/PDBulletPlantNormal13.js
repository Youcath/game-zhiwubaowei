var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PDBulletBase = require("PDBulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDBulletPlantNormal13 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, n, o) {
    t.prototype.initBullet.call(this, e, n, o);
    var i = cc.tween(this.node).by(.1, {
      angle: 90
    });
    cc.tween(this.node).repeatForever(i).start();
  };
  _ctor.prototype.moveArrive = function (e) {
    this.addBulletHit(e);
    t.prototype.moveArrive.call(this, e);
  };
  _ctor.prototype.addBulletSplit = function () {};
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDBulletBase.default);
exports.default = def_PDBulletPlantNormal13;