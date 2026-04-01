var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyCircleCollider = require("SimplyCircleCollider");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDBulletBase = require("PDBulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDSuperBulletPlant5 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._atkEnemyNodes = [];
    e._atkEnemyIDs = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, n, o, i, a) {
    t.prototype.initBullet.call(this, e, n, o, i, a);
    this._isPenetrate = true;
  };
  _ctor.prototype.getIsCanAtk = function (t) {
    return -1 == this._atkEnemyIDs.indexOf(t.uuid);
  };
  _ctor.prototype.update = function (t) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.READY) {
      var e = this._moveSpd * (t / 0.016666666666666666);
      var n = this._direction.mul(e);
      this.node.position = this.node.position.add(n);
      var o = cc.winSize;
      if (this.node.x > o.width || this.node.x < -o.width || this.node.y > o.height || this.node.y < -o.height) {
        this.node.destroy();
        return void this.node.removeFromParent();
      }
      this._colliderTime -= t;
      if (this._colliderTime <= 0) {
        this._colliderTime = $10GameEnum.EGameEnum.CHECK_COLLIDER_TIME;
        this.monsterColliderCheck(true);
      }
    }
  };
  _ctor.prototype.monsterColliderCheck = function (t) {
    var e = this.node.getComponent($10SimplyCircleCollider.default);
    var n = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
    for (var o = 0; o < n.length; ++o) {
      var i = n[o];
      if (e && i && i.isValid && "PDEnemy4008" != i.name && this.getIsCanAtk(i)) {
        var a = i.getChildByName("collision").getComponent($10SimplyRectCollider.default);
        if (a && $10SimplyCollisionDetector.default.isCollisionRectToCircle(a.rect, e.circle) && (this.moveArrive(i), this._atkEnemyIDs.push(i.uuid), !t)) {
          break;
        }
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDBulletBase.default);
exports.default = def_PDSuperBulletPlant5;