var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var $10BulletBase = require("BulletBase");
var $10BulletSpikerocks = require("BulletSpikerocks");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletPlant12 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletSpikerocksPb = null;
    e._moveState = 0;
    e._upMovePos = null;
    e._atkNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if (($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) && this._upMovePos) {
      var e = null;
      if (!(e = 0 == this._moveState ? this._upMovePos : this._atkTarget && this._atkTarget.isValid ? this._atkTarget.position.clone() : this._atkPos)) {
        console.log("目标以经丢失");
        this.node.destroy();
        return void this.node.removeFromParent();
      }
      var o = this._upMovePos ? 1.5 : 2;
      var i = this._moveSpd * o * (t / 0.016666666666666666);
      var n = this.node.position.clone().sub(e.clone()).normalize();
      this.node.x -= i * n.x;
      this.node.y -= i * n.y;
      this.setAngle();
      if ($10MathUtil.MathUtil.distance(this.node.position, e) <= i) {
        if (0 == this._moveState) {
          this._moveState = 1;
          this._atkTarget && this._atkTarget.isValid && (this._atkPos.x = this._atkTarget.x);
          var a = this._atkPos;
          this.node.x = a.x;
          cc.Tween.stopAllByTarget(this.node);
          var r = $10MathUtil.MathUtil.distance(this._atkPos.clone(), cc.v3(this.node.x, cc.winSize.height / 2)) / (120 * this._moveSpd);
          var s = (300 + $10BattleDataProxy.battleDataProxy.gameCamera.y) / (120 * this._moveSpd);
          this.node.scale = 2;
          cc.tween(this.node).delay(s).to(r, {
            scale: 1
          }).start();
        } else {
          this.moveArrive();
        }
      }
    }
  };
  _ctor.prototype.initBullet = function () {};
  _ctor.prototype.initFixedPlantBullet = function (t, e) {
    if (!e || !e.isValid) {
      console.log("目标丢失，这次不算");
      this.node.destroy();
      return void this.node.removeFromParent();
    }
    this._plantId = 12;
    this._atkNum = t;
    this._atkTarget = e;
    this._atkPos = e.position.clone();
    this._moveNormalize = this.node.position.clone().sub(this._atkPos.clone()).normalize();
    this._moveState = 0;
    this._upMovePos = cc.v3(this.node.x, cc.winSize.height / 2 + 300 + $10BattleDataProxy.battleDataProxy.gameCamera.y);
    var o = $10MathUtil.MathUtil.distance(this._upMovePos.clone(), this.node.position) / (90 * this._moveSpd) * .6;
    cc.tween(this.node).to(o, {
      scale: 2
    }).start();
    this._isCheckCollision = false;
  };
  _ctor.prototype.moveArrive = function () {
    this.addBulletHit(null);
    $10EventManager.EventManager.instance.emit($10GameEnum.EGameEvent.SCREEN_SHAKE);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/plant12", $10HomeEnum.Bundles.RES);
    var t = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
    for (var e = 0; e < t.length; ++e) {
      if ((a = t[e]) && a.isValid && $10MathUtil.MathUtil.distance(a.position, this.node.position) <= 150) {
        var o = a.getComponent($10EnemyBase.default).monsterCfg;
        var i = $10BattleDataProxy.battleDataProxy.getFixedPlantBulletHarm(this._atkNum, o.type, 1);
        a.getComponent($10EnemyBase.default).beAttack(i, this._plantId, true);
      }
    }
    var n = $10BattleDataProxy.battleDataProxy.enemyAirship.slice();
    for (e = 0; e < n.length; ++e) {
      var a;
      if ((a = n[e]) && a.isValid && $10MathUtil.MathUtil.distance(a.position, this.node.position) <= 300) {
        o = a.getComponent($10EnemyBase.default).monsterCfg;
        i = $10BattleDataProxy.battleDataProxy.getFixedPlantBulletHarm(this._atkNum, o.type, 1);
        a.getComponent($10EnemyBase.default).beAttack(i, this._plantId, true);
      }
    }
    if ($10BattleDataProxy.battleDataProxy.getIsSuperPlant(this._plantId)) {
      var d = cc.instantiate(this.mBulletSpikerocksPb);
      $10BattleDataProxy.battleDataProxy.bulletView.addChild(d);
      d.position = this.node.position;
      d.getComponent($10BulletSpikerocks.default).initBulletSpikerocks(this._synthesisLv);
    }
    this.node.destroy();
    this.node.removeFromParent();
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletSpikerocksPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_BulletPlant12;