var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDEnemy4009 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._isLanding = false;
    e._targetPos = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.playMove = function (t) {
    undefined === t && (t = 5);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      this.mAnimSp.setAnimation(0, "move", true);
      this.mAnimSp.timeScale = t / 5;
    }
  };
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.mIsSpAni && this.mAnimSp.setCompleteListener(function (e) {
      var n = e.animation ? e.animation.name : "";
      if ("jiangluo" == n) {
        t.playMove();
        t._isLanding = true;
      } else if (n.indexOf("atk") >= 0) {
        t.openFire();
        t.playMove();
      } else if ("die" == n && t.node && t.node.isValid) {
        t.node.destroy(), t.node.removeFromParent();
      }
    });
    this.mAnimSp.setEventListener(function (t, e) {
      "atk" == e.data.name && $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyAtk", $10HomeEnum.Bundles.RES);
    });
  };
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
  };
  _ctor.prototype.getIsCanChoose = function () {
    return this._isLanding;
  };
  _ctor.prototype.addRushEffect = function () {};
  _ctor.prototype.playLanding = function () {
    this._amimState = $10GameEnum.RoleState.Breath;
    this.mAnimSp.setAnimation(0, "jiangluo", false);
    var t = cc.v3(this.node.x, this.node.y - 140);
    cc.tween(this.node).to(0.3333333333333333, {
      position: t
    }).call(function () {}).start();
  };
  _ctor.prototype.playAtk = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._atkSpd = this.monsterCfg.atkspeed;
      this._amimState = $10GameEnum.RoleState.Attack;
      this._isStartAtk = true;
      this._canAtk = false;
      this.mAnimSp.setAnimation(0, "atk", false);
    }
  };
  _ctor.prototype.playDieAnim = function () {
    this.mAnimSp.setAnimation(0, "die", false);
    var t = $10PlantDefenseDataProxy.plantDefenseDataProxy.airshipSoldier.indexOf(this.node);
    t >= 0 && $10PlantDefenseDataProxy.plantDefenseDataProxy.airshipSoldier.splice(t, 1);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDEnemyBase.default);
exports.default = def_PDEnemy4009;