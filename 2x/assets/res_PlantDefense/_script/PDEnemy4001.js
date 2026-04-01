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
var ccp_property = cc__decorator.property;
var def_PDEnemy4001 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mEarthSoilEffectPb = null;
    e._isMoveUp = false;
    e._isUnderground = true;
    e._isMove = false;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "isUnderground", {
    get: function () {
      return this._isUnderground;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    var t = this;
    if (this.mIsSpAni) {
      this.mAnimSp.setCompleteListener(function (e) {
        var n = e.animation ? e.animation.name : "";
        if (n.indexOf("die") >= 0) {
          if (t.node && t.node.isValid) {
            t.node.destroy(), t.node.removeFromParent();
          }
        } else if (n.indexOf("atk") >= 0) {
          t.openFire();
          t.playMove();
        } else if ("stop" == n) {
          t._isUnderground = false, t._isMove ? t.playMove() : t.playAtk();
        }
      });
      this.mAnimSp.setEventListener(function () {
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyAtk", $10HomeEnum.Bundles.RES);
      });
    }
  };
  _ctor.prototype.playMove = function (t) {
    undefined === t && (t = 5);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      if (this._isUnderground) {
        this.mAnimSp.setAnimation(0, "move_zuandi", true);
      } else {
        this.mAnimSp.setAnimation(0, "move", true);
      }
      this.mAnimSp.timeScale = t / 5;
    }
  };
  _ctor.prototype.addRushEffect = function () {};
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
  };
  _ctor.prototype.beAttack = function (e, n, o, i) {
    return !this._isUnderground && t.prototype.beAttack.call(this, e, n, o, i);
  };
  _ctor.prototype.getIsCanChoose = function (t) {
    return 13 == t || !this._isUnderground;
  };
  _ctor.prototype.moveToHouse = function () {
    this.playStop(false);
  };
  _ctor.prototype.playAtk = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._atkSpd = this.monsterCfg.atkspeed;
      this._amimState = $10GameEnum.RoleState.Attack;
      this._canAtk = false;
      this._isStartAtk = true;
      this.mAnimSp.setAnimation(0, "atk", false);
    }
  };
  _ctor.prototype.move = function (e) {
    t.prototype.move.call(this, e);
    this._isUnderground || this._target || this._canAtk && this.playAtk();
  };
  _ctor.prototype.getMoveSpd = function (e) {
    var n = t.prototype.getMoveSpd.call(this, e, 0.016666666666666666);
    this._isUnderground && (n *= 1.5);
    return n;
  };
  _ctor.prototype.beResist = function () {
    this.playStop(true);
  };
  _ctor.prototype.playStop = function (t) {
    if (!this._isMoveUp) {
      this._isMoveUp = true;
      this._isMove = t;
      this.mAnimSp.setAnimation(0, "stop", false);
    }
  };
  _ctor.prototype.playStand = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      this._isAtkFinish = true;
      this.mAnimSp.setAnimation(0, "move", true);
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mEarthSoilEffectPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDEnemyBase.default);
exports.default = def_PDEnemy4001;