var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var $10BulletBase = require("BulletBase");
var $10BulletPlantSplit13 = require("BulletPlantSplit13");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletPlant13 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletSplitPb = null;
    e._isBigSkill = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (t, e, o, i, n) {
    var a = this;
    this._plantId = t;
    this._atkTarget = e;
    this._synthesisLv = o;
    this._atkCount = i;
    this._isRage = n;
    this.mSpAni.setCompleteListener(function (t) {
      t.animation && t.animation.name;
      a.node.destroy();
      a.node.removeFromParent();
    });
    this.mSpAni.setEventListener(function () {
      if (!a._isBigSkill) {
        if (a.getIsChangeAtkTarget()) {
          a.setNextAtkTarget(100);
          e = a._atkTarget;
        }
        a.moveArrive(e);
        return void a.addBulletSplit();
      }
      var t = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      var o = a.node.getComponent($10SimplyRectCollider.default);
      for (var i = 0; i < t.length; ++i) {
        var n = t[i];
        if (n && n.isValid) {
          var c = n.getChildByName("collision").getComponent($10SimplyRectCollider.default);
          c && $10SimplyCollisionDetector.default.isCollisionRectToRect(c.rect, o.rect) && a.moveArrive(n);
        }
      }
    });
  };
  _ctor.prototype.play = function (t) {
    this._isBigSkill = t;
    if (this._isBigSkill) {
      this.mSpAni.setAnimation(0, "skill", false);
    } else {
      this.mSpAni.setAnimation(0, "atk", false);
    }
  };
  _ctor.prototype.moveArrive = function (t) {
    if (t && t.isValid) {
      var e = t.getComponent($10EnemyBase.default).monsterCfg;
      var o = $10BattleDataProxy.battleDataProxy.getBulletHarm(e.type, this._plantId, this._synthesisLv, this._atkCount, this._oneAtkTargetNum, this._atkRate, this._superRate);
      this._isRage && (o.num *= 1.5);
      t.getComponent($10EnemyBase.default).beAttack(o, this._plantId, true);
    }
  };
  _ctor.prototype.addBulletSplit = function () {
    if ($10BattleDataProxy.battleDataProxy.checkHasSkill(130001)) {
      var t = cc.instantiate(this.mBulletSplitPb);
      this.node.parent.addChild(t, 0);
      t.position = this.node.position;
      t.getComponent($10BulletPlantSplit13.default).initBulletPlantSplit(this._plantId, this._synthesisLv, this._atkTarget, this._isRage);
    }
  };
  _ctor.prototype.update = function () {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      this.mSpAni.paused = false;
    } else {
      this.mSpAni.paused = true;
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletSplitPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_BulletPlant13;