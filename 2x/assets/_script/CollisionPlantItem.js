var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10Util = require("Util");
var $10BulletHit = require("BulletHit");
var $10HomeCollisionBase = require("HomeCollisionBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_CollisionPlantItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletPlant = null;
    e.mEnemyNode = null;
    e.mBulletHit = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onCollision = function () {
    var t = this;
    var e = cc.instantiate(this.mBulletPlant);
    this.node.parent.addChild(e);
    e.active = true;
    e.position = $10Util.default.convertToTargetNodeSpace(this.mBulletPlant, e);
    var o = $10Util.default.convertToTargetNodeSpace(this.mEnemyNode, e);
    cc.tween(e).to(.5, {
      position: o
    }).call(function () {
      t.addBulletHit(e.position.clone());
      e.destroy();
      e.removeFromParent();
    }).start();
  };
  _ctor.prototype.addBulletHit = function (t) {
    if (this.node && this.node.isValid) {
      var e = cc.instantiate(this.mBulletHit);
      this.node.parent.addChild(e, this.node.zIndex);
      e.position = t;
      e.getComponent($10BulletHit.default).initBulletHit(5, 1);
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBulletPlant", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mEnemyNode", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletHit", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10HomeCollisionBase.default);
exports.default = def_CollisionPlantItem;