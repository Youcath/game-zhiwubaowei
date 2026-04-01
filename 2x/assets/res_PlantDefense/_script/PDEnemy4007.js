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
var $10PDPlantBase = require("PDPlantBase");
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDEnemy4007 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._isIgnite = false;
    e._isPlayAtk = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.playMove = function (t) {
    undefined === t && (t = 5);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      if (this._isIgnite) {
        this.mAnimSp.setAnimation(0, "move_yinran", false);
      } else {
        this.mAnimSp.setAnimation(0, "move", true);
      }
      this.mAnimSp.timeScale = t / 5;
    }
  };
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.mIsSpAni && this.mAnimSp.setCompleteListener(function (e) {
      var n = e.animation ? e.animation.name : "";
      if ("die" == n || "die2" == n) {
        $10PlantDefenseDataProxy.plantDefenseDataProxy.removeEnemyNode(t.node);
        if (t.node && t.node.isValid) {
          t.node.destroy();
          t.node.removeFromParent();
        }
      } else if ("move_yinran" == n) {
        t.mAnimSp.setAnimation(0, "boom1", false);
      } else if ("boom1" == n || "boom2" == n) {
        var o = $10PlantDefenseDataProxy.plantDefenseDataProxy.soldiers.slice();
        for (var i = 0; i < o.length; ++i) {
          var a = o[i];
          a && a.isValid && a != t.node && $10MathUtil.MathUtil.distance(a.position, t.node.position) <= 150 && a.getComponent($10PDPlantBase.default).beAttack(Math.ceil(t._atkNum));
        }
        $10PlantDefenseDataProxy.plantDefenseDataProxy.removeEnemyNode(t.node);
        t.node.destroy();
        t.node.removeFromParent();
      } else if ("atk" == n) {
        t.openFire();
        t.mAnimSp.setAnimation(0, "boom2", false);
      }
    });
    this.mAnimSp.setEventListener(function () {});
  };
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemy4007", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.beAttack = function (e, n, o, i) {
    var a = t.prototype.beAttack.call(this, e, n, o, i);
    if (!(a || 103 != n || this._isIgnite)) {
      this._isIgnite = true;
      this.playMove();
    }
    return a;
  };
  _ctor.prototype.getIsCanChoose = function () {
    return true;
  };
  _ctor.prototype.moveToHouse = function () {
    this.playAtk();
  };
  _ctor.prototype.playAtk = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._atkSpd = this.monsterCfg.atkspeed;
      this._amimState = $10GameEnum.RoleState.Attack;
      this._canAtk = false;
      this._isStartAtk = true;
      this._isPlayAtk = true;
      this.mAnimSp.setAnimation(0, "atk", false);
    }
  };
  _ctor.prototype.playDie = function (e, n) {
    undefined === e && (e = true);
    undefined === n && (n = false);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      if (n) {
        t.prototype.playDie.call(this, e, n);
      } else {
        this._amimState = $10GameEnum.RoleState.Dead;
        this.mAnimSp.paused = false;
        this._hpProgress && (this._hpProgress.active = false);
        if (this._isPlayAtk) {
          this.mAnimSp.setAnimation(0, "die2", false);
        } else {
          this.mAnimSp.setAnimation(0, "die", false);
        }
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDEnemyBase.default);
exports.default = def_PDEnemy4007;