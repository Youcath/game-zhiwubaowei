var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10GameEnum = require("GameEnum");
var $10DataManager = require("DataManager");
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10BallCollisionEffect = require("BallCollisionEffect");
var $10EquipmentItem = require("EquipmentItem");
var $10BossSkillBase = require("BossSkillBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BossSkill6 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mRigidBody = null;
    e.mCollisionEffectPb = null;
    e._baseTargetSpeed = 0;
    e._lastPos = null;
    e._isCheck = false;
    e._checkTime = 0;
    e._continueTime = 0;
    e._skillInfo = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.play = function () {};
  _ctor.prototype.initMoveNormalize = function (t) {
    this._skillInfo = $10DataManager.DataManager.instance.eData.data_bossskill[6];
    this.mRigidBody.linearVelocity = this.getLinearVelocity(t);
    this._baseTargetSpeed = this.mRigidBody.linearVelocity.lengthSqr();
  };
  _ctor.prototype.onBeginContact = function (t, e, o) {
    var i;
    null === (i = o.node.getComponent($10EquipmentItem.default)) || undefined === i || i.bossBallCollisionEnter();
    -1 != o.node.name.indexOf("wall") && (t.disabled = false);
    var n = t.getWorldManifold().points;
    var a = $10NodePoolManager.default.instance.getNode(this.mCollisionEffectPb);
    this.node.parent.addChild(a);
    var r = this.node.parent.convertToNodeSpaceAR(cc.v3(n[0]));
    a.position = r;
    a.getComponent($10BallCollisionEffect.default).play();
  };
  _ctor.prototype.lateUpdate = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      var e = this.mRigidBody.linearVelocity;
      var o = e.lengthSqr();
      if (Math.abs(o - this._baseTargetSpeed) > .1) {
        var i = e.clone().normalize().multiplyScalar(Math.sqrt(this._baseTargetSpeed));
        this.mRigidBody.linearVelocity = i;
        console.log("速度更新：" + i);
      }
      var n = this.setAngle();
      if (this.getIsCheck(n)) {
        this._isCheck = true;
      } else {
        this._isCheck = false;
        this._checkTime = 0;
      }
      if (this._isCheck) {
        this._checkTime += t;
        if (this._checkTime >= .3) {
          this._isCheck = false, this._checkTime = 0, console.log("垂直或者水平了，重新设置方向"), this.setLinearVelocity();
        }
      }
      this._continueTime += t;
      if (this._continueTime >= this._skillInfo.keepTime) {
        var a = $10BattleDataProxy.battleDataProxy.bossSkillBall.indexOf(this.node);
        a >= 0 && $10BattleDataProxy.battleDataProxy.bossSkillBall.splice(a, 1);
        $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.CLEAN_BOSS_BALL);
        this.node.destroy();
        this.node.removeFromParent();
      }
    }
  };
  _ctor.prototype.setLinearVelocity = function () {
    this.mRigidBody.linearVelocity = this.getLinearVelocity();
  };
  _ctor.prototype.getLinearVelocity = function (t) {
    t || (t = cc.v3(1, 1));
    return cc.v2($10GameEnum.EGameEnum.BOSS_BALL_SPEED * t.x, $10GameEnum.EGameEnum.BOSS_BALL_SPEED * t.y);
  };
  _ctor.prototype.getIsCheck = function (t) {
    var e = Math.abs(t % 360);
    return e <= 2.5 || e >= 87.5 && e <= 92.5 || e >= 177.5 && e <= 182.5 || e >= 267.5 && e <= 272.5;
  };
  _ctor.prototype.setAngle = function () {
    var t = this.node.position;
    if (this._lastPos) {
      var e = -1e4;
      if (t != this._lastPos) {
        var o = t.sub(this._lastPos);
        var i = cc.v2(o);
        var n = cc.v2(1, 0);
        var a = i.magSqr();
        var r = n.magSqr();
        if (0 == a || 0 == r) {
          return;
        }
        var s = i.signAngle(n);
        e = Math.floor(cc.misc.radiansToDegrees(s));
        this._lastPos = t;
      }
      return e;
    }
    this._lastPos = t;
  };
  cc__decorate([ccp_property(cc.RigidBody)], _ctor.prototype, "mRigidBody", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mCollisionEffectPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BossSkillBase.default);
exports.default = def_BossSkill6;