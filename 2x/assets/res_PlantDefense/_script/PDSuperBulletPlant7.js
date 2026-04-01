var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyCircleCollider = require("SimplyCircleCollider");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDBulletBase = require("PDBulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDSuperBulletPlant7 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, n, o, i, a) {
    t.prototype.initBullet.call(this, e, n, o, i, a);
  };
  _ctor.prototype.monsterColliderCheck = function () {
    var t = this.node.getComponent($10SimplyCircleCollider.default);
    var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
    for (var n = 0; n < e.length; ++n) {
      var o = e[n];
      if (t && o && o.isValid && ("PDEnemy4008" != o.name || 20 == this._plantId)) {
        var i = o.getChildByName("collision").getComponent($10SimplyRectCollider.default);
        i && $10SimplyCollisionDetector.default.isCollisionRectToCircle(i.rect, t.circle) && this.moveArrive(o);
      }
    }
  };
  _ctor.prototype.moveArrive = function (t) {
    t || (t = this._atkTarget);
    if (t && t.isValid) {
      var e = {
        num: this._atkCount,
        isCrit: false
      };
      t.getComponent($10PDEnemyBase.default).beAttack(e, this._plantId, false);
      t.getComponent($10PDEnemyBase.default).isBeTemptation = true;
    }
    if (this.setDapTargetNode()) {
      this._isCheckCollision = false;
      this._isMoveNormalize = false;
    } else if (!this._isPenetrate) {
      this.node.destroy(), this.node.removeFromParent();
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDBulletBase.default);
exports.default = def_PDSuperBulletPlant7;