var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10SimplyCircleCollider = require("SimplyCircleCollider");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletGrape = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mImg = null;
    e._isStart = false;
    e._velocity = cc.v2(1, 1);
    e._moveSpd = 2.4 * $10GameEnum.EGameEnum.BALL_SPEED;
    e._colliderTime = 0;
    e._collisionWallNodes = [];
    e._collisionEnemyNodes = [];
    e._atkNum = 0;
    e._checkColliderTime = $10GameEnum.EGameEnum.CHECK_COLLIDER_TIME;
    e._plantId = 0;
    e._synthesisLv = 1;
    e._atkRate = 1;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "atkRate", {
    set: function (t) {
      this._atkRate = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.initBullet = function (t, e, o) {
    this._isStart = true;
    this._atkNum = t;
    this._plantId = o || 104;
    var i = e * this.randAngle();
    var n = $10MathUtil.MathUtil.getRadian(i);
    this._velocity.x = Math.cos(n);
    this._velocity.y = Math.sin(n);
    this._colliderTime = 4;
  };
  _ctor.prototype.randAngle = function () {
    var t = Math.floor(1e4 * Math.random()) % 360;
    if (t % 90 == 0) {
      return t + 25;
    } else {
      return t;
    }
  };
  _ctor.prototype.update = function (t) {
    this._isStart && ($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.READY || (this.pathWallColliderCheck(), this._checkColliderTime -= t, this._checkColliderTime <= 0 && (this._checkColliderTime = $10GameEnum.EGameEnum.CHECK_COLLIDER_TIME, this.monsterColliderCheck()), this.move(t), this.node.zIndex = -this.node.y, this.setAngle(), this._colliderTime -= t, this._colliderTime <= 0 && (this.node.destroy(), this.node.removeFromParent())));
  };
  _ctor.prototype.pathWallColliderCheck = function () {
    var t = this.node.getComponent($10SimplyCircleCollider.default);
    10010 == this._plantId && (t = this.node.getChildByName("collision").getComponent($10SimplyCircleCollider.default));
    var e = $10BattleDataProxy.battleDataProxy.pathWalls.slice();
    for (var o = 0; o < e.length; ++o) {
      var i = e[o];
      if (t) {
        var n;
        var a = i.getComponent($10SimplyRectCollider.default);
        if (a) {
          if ($10SimplyCollisionDetector.default.isCollisionRectToCircle(a.rect, t.circle)) {
            if ((n = this._collisionWallNodes.indexOf(i)) < 0) {
              this.onWallColliderLogic(i), this._collisionWallNodes.push(i);
            }
          } else {
            (n = this._collisionWallNodes.indexOf(i)) >= 0 && this._collisionWallNodes.splice(n, 1);
          }
        }
      }
    }
  };
  _ctor.prototype.onWallColliderLogic = function (t) {
    var e = this._velocity.clone();
    var o = null;
    switch (t.name) {
      case "left":
        o = cc.v2(1, 0);
        break;
      case "right":
        o = cc.v2(-1, 0);
        break;
      case "top":
        o = cc.v2(0, -1);
        break;
      case "bottom":
        o = cc.v2(0, 1);
    }
    if (o) {
      var i = e.dot(o);
      var n = e.sub(o.mul(2 * i));
      this._velocity = n;
    } else {
      o = this.node.getPosition().sub(t.getPosition()).normalize();
      var a = e.dot(o);
      var r = e.sub(o.mul(2 * a));
      this._velocity = r;
    }
  };
  _ctor.prototype.move = function (t) {
    if (this.node && this.node.isValid) {
      var e = this.node.position;
      var o = cc.v3(this._velocity.x * this._moveSpd, this._velocity.y * this._moveSpd);
      e = e.add(o.mul(t));
      this.node.setPosition(e);
    }
  };
  _ctor.prototype.monsterColliderCheck = function () {
    if ($10BattleDataProxy.battleDataProxy.getIsCheckCollision(this.node)) {
      var t = this.node.getComponent($10SimplyCircleCollider.default);
      var e = this.node.getComponent($10SimplyRectCollider.default);
      var o = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      for (var i = 0; i < o.length; ++i) {
        var n = o[i];
        if ((t || e) && n && n.isValid) {
          var a;
          var r = n.getChildByName("collision").getComponent($10SimplyRectCollider.default);
          if (r) {
            if (t ? $10SimplyCollisionDetector.default.isCollisionRectToCircle(r.rect, t.circle) : $10SimplyCollisionDetector.default.isCollisionRectToRect(r.rect, e.rect)) {
              if ((a = this._collisionEnemyNodes.indexOf(n)) < 0) {
                var u = {
                  isCrit: false,
                  num: Math.ceil(this._atkNum)
                };
                if (this._atkNum < 0) {
                  var d = n.getComponent($10EnemyBase.default).monsterCfg;
                  u = $10BattleDataProxy.battleDataProxy.getBulletHarm(d.type, this._plantId, this._synthesisLv, 1, 1, this._atkRate, 1);
                }
                n.getComponent($10EnemyBase.default).beAttack(u, this._plantId) || this._collisionEnemyNodes.push(n);
              }
            } else {
              (a = this._collisionEnemyNodes.indexOf(n)) >= 0 && this._collisionEnemyNodes.splice(a, 1);
            }
          }
        }
      }
    }
  };
  _ctor.prototype.setAngle = function () {};
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mImg", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BulletGrape;