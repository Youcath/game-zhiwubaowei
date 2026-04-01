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
var def_Bullet10011_2 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mImg = null;
    e._synthesisLv = 0;
    e._collisionEnemyNodes = [];
    e._checkColliderTime = 0;
    e._atkRate = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (t, e, o) {
    var i = this;
    this._synthesisLv = e;
    this._atkRate = o;
    cc.tween(this.node).to(2, {
      position: t
    }).call(function () {
      i.node.destroy();
      i.node.removeFromParent();
    }).start();
    var n = cc.tween(this.mImg).by(2, {
      angle: 5760
    });
    cc.tween(this.mImg).repeatForever(n).start();
  };
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      this.node.resumeAllActions();
      this._checkColliderTime += t;
      if (this._checkColliderTime >= .2) {
        this._checkColliderTime = 0, this.monsterColliderCheck();
      }
    } else {
      this.node.pauseAllActions();
    }
  };
  _ctor.prototype.monsterColliderCheck = function () {
    if ($10BattleDataProxy.battleDataProxy.getIsCheckCollision(this.node)) {
      var t = this.node.getComponent($10SimplyCircleCollider.default);
      var e = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      for (var o = 0; o < e.length; ++o) {
        var i = e[o];
        if (t && i && i.isValid) {
          var n;
          var a = i.getChildByName("collision").getComponent($10SimplyRectCollider.default);
          if (a) {
            if ($10SimplyCollisionDetector.default.isCollisionRectToCircle(a.rect, t.circle)) {
              if ((n = this._collisionEnemyNodes.indexOf(i)) < 0) {
                var l = i.getComponent($10EnemyBase.default).monsterCfg;
                var h = $10BattleDataProxy.battleDataProxy.getBulletHarm(l.type, 10011, this._synthesisLv, 1, 1, this._atkRate, 1);
                i.getComponent($10EnemyBase.default).beAttack(h, 10011) || this._collisionEnemyNodes.push(i);
              }
            } else {
              (n = this._collisionEnemyNodes.indexOf(i)) >= 0 && this._collisionEnemyNodes.splice(n, 1);
            }
          }
        }
      }
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mImg", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_Bullet10011_2;