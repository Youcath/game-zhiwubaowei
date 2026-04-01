var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyCircleCollider = require("SimplyCircleCollider");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletPlantSplit13 = function (t) {
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
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletPlantSplit = function (t, e, o, i) {
    var n = this;
    this._plantId = t;
    this._isRage = i;
    this._synthesisLv = e;
    this._baseAtkNode = o;
    this.mSplitSpine.setCompleteListener(function (t) {
      t.animation && t.animation.name;
      n.node.destroy();
      n.node.removeFromParent();
    });
    this.mSplitSpine.setAnimation(0, "skill2", false);
    cc.tween(this.mCollision).to(.5, {
      scale: 2
    }).start();
  };
  _ctor.prototype.moveArrive = function (t) {
    if (t && t.isValid && t && t.isValid) {
      var e = t.getComponent($10EnemyBase.default).monsterCfg;
      var o = $10BattleDataProxy.battleDataProxy.getBulletHarm(e.type, this._plantId, this._synthesisLv, 1, 1, 1, 1, true);
      this._isRage && (o.num *= 1.5);
      t.getComponent($10EnemyBase.default).beAttack(o, this._plantId, true);
    }
  };
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      this.mSplitSpine.paused = false;
      if ($10BattleDataProxy.battleDataProxy.getIsCheckCollision(this.node) && (this._colliderTime -= t, this._colliderTime <= 0)) {
        this._colliderTime = $10GameEnum.EGameEnum.CHECK_COLLIDER_TIME;
        var e = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
        var o = this.mCollision.getComponent($10SimplyCircleCollider.default);
        for (var i = 0; i < e.length; ++i) {
          var n = e[i];
          if (n && n.isValid && n != this._baseAtkNode) {
            var a = n.getChildByName("collision").getComponent($10SimplyRectCollider.default);
            if (a && $10SimplyCollisionDetector.default.isCollisionRectToCircle(a.rect, o.circle) && this._collisionNodes.indexOf(n) < 0) {
              this._collisionNodes.push(n);
              this.moveArrive(n);
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
exports.default = def_BulletPlantSplit13;