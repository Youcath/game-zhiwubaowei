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
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDBulletPlantSplit13 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSplitSpine = null;
    e.mCollision = null;
    e._plantId = 0;
    e._moveSpd = 15;
    e._synthesisLv = 0;
    e._baseAtkNode = null;
    e._collisionNodes = [];
    e._colliderTime = 0;
    e._isRage = false;
    e._atkCount = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletPlantSplit = function (t, e, n, o) {
    var i = this;
    this._plantId = t;
    this._isRage = o;
    this._baseAtkNode = e;
    this._atkCount = n;
    this.mSplitSpine.setCompleteListener(function (t) {
      t.animation && t.animation.name;
      i.node.destroy();
      i.node.removeFromParent();
    });
    this.mSplitSpine.setAnimation(0, "skill2", false);
    cc.tween(this.mCollision).to(.5, {
      scale: 2
    }).start();
  };
  _ctor.prototype.moveArrive = function (t) {
    if (t && t.isValid && t && t.isValid) {
      var e = {
        num: 2 * this._atkCount,
        isCrit: false
      };
      t.getComponent($10PDEnemyBase.default).beAttack(e, this._plantId, true);
    }
  };
  _ctor.prototype.update = function (t) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      this.mSplitSpine.paused = false;
      this._colliderTime -= t;
      if (this._colliderTime <= 0) {
        this._colliderTime = $10GameEnum.EGameEnum.CHECK_COLLIDER_TIME;
        var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
        var n = this.mCollision.getComponent($10SimplyCircleCollider.default);
        for (var o = 0; o < e.length; ++o) {
          var i = e[o];
          if (i && i.isValid && i != this._baseAtkNode && "PDEnemy4008" != i.name) {
            var a = i.getChildByName("collision").getComponent($10SimplyRectCollider.default);
            if (a && $10SimplyCollisionDetector.default.isCollisionRectToCircle(a.rect, n.circle) && this._collisionNodes.indexOf(i) < 0) {
              this._collisionNodes.push(i);
              this.moveArrive(i);
            }
          }
        }
      }
    } else {
      this.mSplitSpine.paused = true;
    }
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSplitSpine", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mCollision", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDBulletPlantSplit13;