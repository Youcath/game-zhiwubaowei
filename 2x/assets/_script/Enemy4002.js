var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_Enemy4002 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._isCloaking = false;
    e._isChangeState = false;
    e._stateCd = 5;
    e._isDye = false;
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
      var o = e.animation ? e.animation.name : "";
      if (o.indexOf("die") >= 0) {
        t.node.destroy();
        t.node.removeFromParent();
      } else if (o.indexOf("atk") >= 0) {
        t.playMove();
      } else if ("move_xianxing" == o) {
        if (!t._isDye) {
          t._isCloaking = false, t._isChangeState = false, t.playMove();
        }
      } else {
        "move_yinshen" == o && (t._isDye || (t._isCloaking = true, t._isChangeState = false, t.playMove()));
      }
    });
    this.mAnimSp.setEventListener(function () {
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyAtk", $10HomeEnum.Bundles.RES);
      $10BattleDataProxy.battleDataProxy.updateHouseHp({
        isCirt: false,
        num: -t._atkNum
      });
    });
  };
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemy4002", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.getIsCanChoose = function (t) {
    return 104 == t || !this._isCloaking;
  };
  _ctor.prototype.beAttack = function (e, o, i, n) {
    if (this._isCloaking) {
      if (104 != o) {
        return false;
      }
      this._isDye = true;
      this._isCloaking = false;
      this.playMove();
    }
    if (104 == o) {
      this._isDye = true;
      this._isCloaking = false;
      this.playMove();
    }
    return t.prototype.beAttack.call(this, e, o, i, n);
  };
  _ctor.prototype.moveToHouse = function () {
    this.playAtk();
  };
  _ctor.prototype.getMoveSpd = function (e, o) {
    var i = t.prototype.getMoveSpd.call(this, e, o);
    this._isCloaking && (i *= 1.5);
    return i;
  };
  _ctor.prototype.playAtk = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._atkSpd = this.monsterCfg.atkSpeed;
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
  _ctor.prototype.playDieAnim = function () {
    this.mAnimSp.paused = false;
    if (this._isDye) {
      this.mAnimSp.setAnimation(0, "die_ranse", false);
    } else {
      this.mAnimSp.setAnimation(0, "die", false);
    }
  };
  _ctor.prototype.update = function (e) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._isChangeState || t.prototype.update.call(this, e);
      this._isSpdAdd || this._amimState != $10GameEnum.RoleState.Attack && (this._isDye || (this._stateCd -= e, this._stateCd <= 0 && (this._stateCd = 5, this._isChangeState = true, this._isCloaking ? this.playShow() : this.playHide())), this._isChangeState || this._target || this._canAtk && this.playAtk());
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10EnemyBase.default);
exports.default = def_Enemy4002;