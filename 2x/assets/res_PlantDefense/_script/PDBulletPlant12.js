var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDBulletBase = require("PDBulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDBulletPlant12 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._moveState = 0;
    e._upMovePos = null;
    e._atkNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if (($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.READY) && this._upMovePos) {
      var e = null;
      if (!(e = 0 == this._moveState ? this._upMovePos : this._atkTarget && this._atkTarget.isValid ? this._atkTarget.position.clone() : this._atkPos)) {
        console.log("目标以经丢失");
        this.node.destroy();
        return void this.node.removeFromParent();
      }
      var n = this._upMovePos ? 1.5 : 2;
      var o = this._moveSpd * n * (t / 0.016666666666666666);
      var i = this.node.position.clone().sub(e.clone()).normalize();
      this.node.x -= o * i.x;
      this.node.y -= o * i.y;
      this.setAngle();
      if ($10MathUtil.MathUtil.distance(this.node.position, e) <= o) {
        if (0 == this._moveState) {
          this._moveState = 1;
          this._atkTarget && this._atkTarget.isValid && (this._atkPos.x = this._atkTarget.x);
          var a = this._atkPos;
          this.node.x = a.x;
          cc.Tween.stopAllByTarget(this.node);
          var r = $10MathUtil.MathUtil.distance(this._atkPos.clone(), cc.v3(this.node.x, cc.winSize.height / 2)) / (120 * this._moveSpd);
          var c = 300 / (120 * this._moveSpd);
          this.node.scale = 2;
          cc.tween(this.node).delay(c).to(r, {
            scale: 1
          }).start();
        } else {
          this.moveArrive();
        }
      }
    }
  };
  _ctor.prototype.initBullet = function (t, e, n) {
    this.initFixedPlantBullet(n, e);
  };
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
    this._upMovePos = cc.v3(this.node.x, cc.winSize.height / 2 + 300);
    var n = $10MathUtil.MathUtil.distance(this._upMovePos.clone(), this.node.position) / (90 * this._moveSpd) * .6;
    cc.tween(this.node).to(n, {
      scale: 2
    }).start();
    this._isCheckCollision = false;
  };
  _ctor.prototype.moveArrive = function () {
    this.addBulletHit(null);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/plant12", $10HomeEnum.Bundles.RES);
    var t = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
    for (var e = 0; e < t.length; ++e) {
      var n = t[e];
      if (n && n.isValid && $10MathUtil.MathUtil.distance(n.position, this.node.position) <= 150) {
        var o = {
          isCrit: false,
          num: this._atkNum
        };
        n.getComponent($10PDEnemyBase.default).beAttack(o, this._plantId, true);
      }
    }
    this.node.destroy();
    this.node.removeFromParent();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDBulletBase.default);
exports.default = def_PDBulletPlant12;