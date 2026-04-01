var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDEnemyBoss = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._skillInfo = null;
    e._skillCd = 0;
    e._isFirstUseSkill = true;
    e._isUseSkill = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initEnemy = function (e) {
    t.prototype.initEnemy.call(this, e);
    this.initBossSkill();
  };
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.mAnimSp.setCompleteListener(function (e) {
      var n = e.animation ? e.animation.name : "";
      if (n.indexOf("die") >= 0) {
        t.playDie();
      } else {
        n.indexOf("atk") >= 0 && t.playStand();
      }
    });
    this.mAnimSp.setEventListener(function () {
      t.openFire();
    });
  };
  _ctor.prototype.playDie = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead) {
      this._amimState = $10GameEnum.RoleState.Dead;
      if (this.node && this.node.isValid) {
        this.node.destroy(), this.node.removeFromParent();
      }
    }
  };
  _ctor.prototype.initBossSkill = function () {
    this.node.height = this.getBossHeight();
  };
  _ctor.prototype.getBossHeight = function () {
    if (2001 == this.monsterCfg.id) {
      return 118;
    } else {
      if (2002 == this.monsterCfg.id) {
        return 87;
      } else {
        if (2003 == this.monsterCfg.id) {
          return 104;
        } else {
          if (2004 == this.monsterCfg.id) {
            return 114;
          } else {
            if (2005 == this.monsterCfg.id) {
              return 85;
            } else {
              if (2006 == this.monsterCfg.id) {
                return 86;
              } else {
                if (2007 == this.monsterCfg.id) {
                  return 94;
                } else {
                  if (2008 == this.monsterCfg.id) {
                    return 86;
                  } else {
                    if (2009 == this.monsterCfg.id) {
                      return 119;
                    } else {
                      return 100;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  _ctor.prototype.update = function (e) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead && (t.prototype.update.call(this, e), !(this._iceTime > 0 || this._dizzinessTime > 0 || this._isBeTemptation) && this._skillInfo)) {
      this._skillCd += e;
      var n = this._skillInfo.cd;
      this._isFirstUseSkill && (n /= 2);
      if (this._skillCd >= n) {
        this._isFirstUseSkill = false;
        this._skillCd = 0;
        this.useSkill();
      }
    }
  };
  _ctor.prototype.useSkill = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Attack;
      this._isAtkFinish = false;
      var t = "atk";
      this._atkAnimFrameNums.length > 1 && (t = "atk" + (Math.floor(1e3 * Math.random()) % this._atkAnimFrameNums.length + 1));
      this.mAnimSp.setAnimation(0, t, false);
      this._isUseSkill = true;
    }
  };
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
  };
  _ctor.prototype.playMove = function (t) {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      this._isAtkFinish = true;
      this.mAnimSp.setAnimation(0, "move", true);
      this.mAnimSp.timeScale = 10 == t ? 2 : 1;
    }
  };
  _ctor.prototype.playDieAnim = function () {
    this.mAnimSp.paused = false;
    this.mAnimSp.setAnimation(0, "die", false);
  };
  _ctor.prototype.playAtk = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Attack;
      this._isStartAtk = true;
      var t = "atk";
      this._atkAnimFrameNums.length > 1 && (t = "atk" + (Math.floor(1e3 * Math.random()) % this._atkAnimFrameNums.length + 1));
      this.mAnimSp.setAnimation(0, t, false);
    }
  };
  _ctor.prototype.playStand = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      this._isAtkFinish = true;
      this.mAnimSp.setAnimation(0, "move", true);
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDEnemyBase.default);
exports.default = def_PDEnemyBoss;