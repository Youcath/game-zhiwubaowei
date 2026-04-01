var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDEnemy4003 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._isOnHorse = true;
    e._isChangeState = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.playMove = function (t) {
    undefined === t && (t = 5);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      if (this._isOnHorse) {
        this.mAnimSp.setAnimation(0, "move_tiaotiao", true);
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
      if (n.indexOf("die") >= 0) {
        if (t.node && t.node.isValid) {
          t.node.destroy(), t.node.removeFromParent();
        }
      } else if (n.indexOf("atk") >= 0) {
        t.openFire();
        t.playMove();
      } else if ("hit" == n) {
        t._isOnHorse = false, t._isChangeState = false, t.playMove();
      }
    });
    this.mAnimSp.setEventListener(function () {
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyAtk", $10HomeEnum.Bundles.RES);
    });
  };
  _ctor.prototype.beAttack = function (e, n, o, i) {
    this._isOnHorse && 105 == n && (this._isChangeState || (this._isChangeState = true, this.playVehiclesDestroy()));
    return t.prototype.beAttack.call(this, e, n, o, i);
  };
  _ctor.prototype.playVehiclesDestroy = function () {
    this.mAnimSp.setAnimation(0, "hit", false);
  };
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemy4003", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.getMoveSpd = function (e, n) {
    var o = t.prototype.getMoveSpd.call(this, e, n);
    this._isOnHorse || (o *= .25);
    return o;
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
      var t = "atk";
      this._isOnHorse && (t = "atk_tiaotiao");
      this.mAnimSp.setAnimation(0, t, false);
      "PDPlant_13" == this._target.name && this._isOnHorse && this.playVehiclesDestroy();
    }
  };
  _ctor.prototype.updateHpProgressPos = function () {
    if (this._isOnHorse) {
      if (!this._hpProgress) {
        return;
      }
      this._hpProgress.position = this.node.position.clone().add(cc.v3(0, this.node.height * this.node.scale + 50));
    } else {
      t.prototype.updateHpProgressPos.call(this);
    }
  };
  _ctor.prototype.update = function (e) {
    if (!this._isChangeState) {
      t.prototype.update.call(this, e);
      this._isChangeState || this._target || this._canAtk && this.playAtk();
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDEnemyBase.default);
exports.default = def_PDEnemy4003;