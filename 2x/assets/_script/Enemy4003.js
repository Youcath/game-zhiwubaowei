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
var def_Enemy4003 = function (t) {
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
      var o = e.animation ? e.animation.name : "";
      if (o.indexOf("die") >= 0) {
        t.node.destroy();
        t.node.removeFromParent();
      } else if (o.indexOf("atk") >= 0) {
        t.playMove();
      } else if ("hit" == o) {
        t._isOnHorse = false, t._isChangeState = false, t.playMove();
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
  _ctor.prototype.beAttack = function (e, o, i, n) {
    this._isOnHorse && 105 == o && (this._isChangeState || (this._isChangeState = true, this.playVehiclesDestroy()));
    return t.prototype.beAttack.call(this, e, o, i, n);
  };
  _ctor.prototype.playVehiclesDestroy = function () {
    this.mAnimSp.setAnimation(0, "hit", false);
  };
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemy4003", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.getMoveSpd = function (e, o) {
    var i = t.prototype.getMoveSpd.call(this, e, o);
    this._isOnHorse || (i *= .25);
    return i;
  };
  _ctor.prototype.moveToHouse = function () {
    this.playAtk();
  };
  _ctor.prototype.playAtk = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._atkSpd = this.monsterCfg.atkSpeed;
      this._amimState = $10GameEnum.RoleState.Attack;
      this._canAtk = false;
      this._isStartAtk = true;
      var t = "atk";
      this._isOnHorse && (t = "atk_tiaotiao");
      this.mAnimSp.setAnimation(0, t, false);
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
}($10EnemyBase.default);
exports.default = def_Enemy4003;