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
var def_PDEnemy4002 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._isCloaking = false;
    e._isChangeState = false;
    e._stateCd = 5;
    e._isDye = false;
    e._cannelHide = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.playMove = function (t) {
    undefined === t && (t = 5);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      if (this._isDye) {
        this.mAnimSp.setAnimation(0, "move_ranse", true);
      } else if (this._isCloaking) {
        this.mAnimSp.setAnimation(0, "move_xuhua", true);
      } else {
        this.mAnimSp.setAnimation(0, "move_shiti", true);
      }
      this.mAnimSp.timeScale = t / 5;
    }
  };
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.mIsSpAni && this.mAnimSp.setCompleteListener(function (e) {
      var n = e.animation ? e.animation.name : "";
      if (n.indexOf("die") >= 0) {
        if (t.node && t.node.isValid) {
          t.node.destroy(), t.node.removeFromParent();
        }
      } else if (n.indexOf("atk") >= 0) {
        t.openFire();
        t.playMove();
      } else if ("move_xianxing" == n) {
        if (!t._isDye) {
          t._isCloaking = false, t._isChangeState = false, t.playMove();
        }
      } else {
        "move_yinshen" == n && (t._isDye || (t._isCloaking = true, t._isChangeState = false, t.playMove()));
      }
    });
    this.mAnimSp.setEventListener(function () {
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyAtk", $10HomeEnum.Bundles.RES);
    });
  };
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemy4002", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.getIsCanChoose = function () {
    return !this._isCloaking;
  };
  _ctor.prototype.beAttack = function (e, n, o, i) {
    return (!this._isCloaking || 18 == n) && t.prototype.beAttack.call(this, e, n, o, i);
  };
  _ctor.prototype.moveToHouse = function () {
    this.playAtk();
  };
  _ctor.prototype.getMoveSpd = function (e, n) {
    var o = t.prototype.getMoveSpd.call(this, e, n);
    this._isCloaking && (o *= 1.5);
    return o;
  };
  _ctor.prototype.playAtk = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._atkSpd = this.monsterCfg.atkspeed;
      this._amimState = $10GameEnum.RoleState.Attack;
      this._canAtk = false;
      this._isStartAtk = true;
      var t = "atk";
      if (this._isDye) {
        t = "atk_ranse";
      } else {
        this._isCloaking && (t = "atk_yinshen");
      }
      this.mAnimSp.setAnimation(0, t, false);
    }
  };
  _ctor.prototype.playShow = function () {
    this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady && this.mAnimSp.setAnimation(0, "move_xianxing", false);
  };
  _ctor.prototype.playHide = function () {
    this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady && this.mAnimSp.setAnimation(0, "move_yinshen", false);
  };
  _ctor.prototype.cannelHide = function () {
    this._cannelHide = true;
  };
  _ctor.prototype.playDieAnim = function () {
    this.mAnimSp.paused = false;
    if (this._isDye) {
      this.mAnimSp.setAnimation(0, "die_ranse", false);
    } else {
      this.mAnimSp.setAnimation(0, "die", false);
    }
  };
  _ctor.prototype.update = function (e) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._isChangeState || t.prototype.update.call(this, e);
      this._isSpdAdd || this._amimState != $10GameEnum.RoleState.Attack && (this._cannelHide || this._isDye || (this._stateCd -= e, this._stateCd <= 0 && (this._stateCd = 5, this._isChangeState = true, this._isCloaking ? this.playShow() : this.playHide())));
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDEnemyBase.default);
exports.default = def_PDEnemy4002;