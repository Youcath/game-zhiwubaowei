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
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var $10BulletHit = require("BulletHit");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletPlantSplit = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mImg = null;
    e.mBulletHitPb = null;
    e._plantId = 0;
    e._moveNormalize = null;
    e._moveSpd = 15;
    e._synthesisLv = 0;
    e._baseAtkNode = null;
    e._colliderTime = $10GameEnum.EGameEnum.CHECK_COLLIDER_TIME;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletPlantSplit = function (t, e, o, i) {
    this._plantId = e;
    this._synthesisLv = o;
    this._baseAtkNode = i;
    var n = $10MathUtil.MathUtil.getRadian(t);
    var a = cc.v3(this.node.x + 100 * Math.cos(n), this.node.y + 100 * Math.sin(n));
    this._moveNormalize = this.node.position.clone().sub(a.clone()).normalize();
  };
  _ctor.prototype.update = function (t) {
    if (($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) && this._moveNormalize) {
      this.node.x -= this._moveSpd * this._moveNormalize.x;
      this.node.y -= this._moveSpd * this._moveNormalize.y;
      var e = cc.winSize;
      if (this.node.x > e.width || this.node.x < -e.width || this.node.y > e.height || this.node.y < -e.height) {
        $10NodePoolManager.default.instance.putNode(this.node);
      } else {
        this._colliderTime -= t;
        if (this._colliderTime <= 0) {
          this._colliderTime = $10GameEnum.EGameEnum.CHECK_COLLIDER_TIME, this.monsterColliderCheck();
        }
      }
    }
  };
  _ctor.prototype.monsterColliderCheck = function () {
    if ($10BattleDataProxy.battleDataProxy.getIsCheckCollision(this.node)) {
      var t = this.node.getComponent($10SimplyCircleCollider.default);
      var e = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      for (var o = 0; o < e.length; ++o) {
        var i = e[o];
        if (t && i && i.isValid && this._baseAtkNode != i) {
          var n = i.getChildByName("collision").getComponent($10SimplyRectCollider.default);
          if (n && $10SimplyCollisionDetector.default.isCollisionRectToCircle(n.rect, t.circle)) {
            this.moveArrive(i);
            break;
          }
        }
      }
    }
  };
  _ctor.prototype.moveArrive = function (t) {
    if (t && t.isValid) {
      if (t && t.isValid) {
        var e = t.getComponent($10EnemyBase.default).monsterCfg;
        var o = $10BattleDataProxy.battleDataProxy.getBulletHarm(e.type, this._plantId, this._synthesisLv, 1, 1, 1, 1, true);
        t.getComponent($10EnemyBase.default).beAttack(o, this._plantId);
      }
      $10NodePoolManager.default.instance.putNode(this.node);
    } else {
      $10NodePoolManager.default.instance.putNode(this.node);
    }
  };
  _ctor.prototype.addBulletHit = function (t) {
    var e = $10NodePoolManager.default.instance.getNode(this.mBulletHitPb);
    $10BattleDataProxy.battleDataProxy.bulletView.addChild(e, this.node.zIndex);
    var o = null;
    if (t && t.isValid) {
      var i = t.scale;
      o = t.position.addSelf(cc.v3(0, t.height * i * .7));
    } else {
      o = this.node.position;
    }
    e.position = o;
    e.getComponent($10BulletHit.default).initBulletHit(this._plantId, this._synthesisLv);
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mImg", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletHitPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BulletPlantSplit;