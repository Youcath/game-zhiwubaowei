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
var $10PDEnemyCrucifix = require("PDEnemyCrucifix");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDEnemy4004 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mCrucifix = null;
    e._isChangeState = false;
    e._reviveNum = 0;
    e._isHaveCrucifix = true;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.playMove = function (t) {
    undefined === t && (t = 5);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      if (!this._isHaveCrucifix && this._reviveNum > 0) {
        this.mAnimSp.setAnimation(0, "meiwuqi_move", true);
      } else if (this._reviveNum >= 1) {
        this.mAnimSp.setAnimation(0, "move", true);
      } else {
        this.mAnimSp.setAnimation(0, "fuhuo_move", true);
      }
      this.mAnimSp.timeScale = t / 5;
    }
  };
  _ctor.prototype.playAttract = function () {
    this._isHaveCrucifix && this.mAnimSp.setAnimation(0, "move_xi", false);
  };
  _ctor.prototype.onLoad = function () {
    var t = this;
    this._reviveNum = 2;
    this.mIsSpAni && this.mAnimSp.setCompleteListener(function (e) {
      var n;
      var o = e.animation ? e.animation.name : "";
      if ("die" == o) {
        if (2 == t._reviveNum) {
          t.mAnimSp.setAnimation(0, "fuhuozhong1", false);
        } else if (1 == t._reviveNum) {
          t.mAnimSp.setAnimation(0, "fuhuozhong2", false);
        } else if (t.node && t.node.isValid) {
          t.node.destroy(), t.node.removeFromParent();
        }
        t._reviveNum--;
      } else if (o.indexOf("atk") >= 0) {
        t.openFire();
        t.playMove();
      } else if ("fuhuo_die" == o || "meiwuqi_die" == o) {
        if (t.node && t.node.isValid) {
          t.node.destroy();
          t.node.removeFromParent();
        }
      } else if ("fuhuozhong2" == o) {
        t.mAnimSp.setAnimation(0, "fuhuo2", false);
      } else if ("fuhuo2" == o || "fuhuo1" == o) {
        if ("fuhuo2" == o) {
          t._isHaveCrucifix = false;
          var i = $10PlantDefenseDataProxy.plantDefenseDataProxy.priestZombie.indexOf(t.node);
          i >= 0 && $10PlantDefenseDataProxy.plantDefenseDataProxy.priestZombie.splice(i, 1);
        }
        t._isChangeState = false;
        t._nowHp = t._maxHp;
        t.updateHp();
        t.playMove();
      } else if ("fuhuozhong1" == o) {
        t.mAnimSp.setAnimation(0, "fuhuo1", false);
      } else if ("move_xi" == o) {
        t._isAtkFinish = false;
        t._amimState = $10GameEnum.RoleState.Breath;
        t.mAnimSp.setAnimation(0, "xizou", false);
        t._isHaveCrucifix = false;
        if (t.mCrucifix && t.mCrucifix.isValid) {
          t.mCrucifix.active = true, null === (n = t.mCrucifix.getComponent($10PDEnemyCrucifix.default)) || undefined === n || n.attractCrucifix(t.node);
        }
      } else if ("xizou" == o) {
        t._isAtkFinish = true, t.playMove();
      }
    });
    this.mAnimSp.setEventListener(function () {
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyAtk", $10HomeEnum.Bundles.RES);
    });
  };
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemy4004", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.beAttack = function (e, n, o, i) {
    return !!this._isChangeState || t.prototype.beAttack.call(this, e, n, o, i);
  };
  _ctor.prototype.getIsCanChoose = function () {
    return !this._isChangeState;
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
      if (!this._isHaveCrucifix && this._reviveNum > 0) {
        t = "meiwuqi_atk";
      } else {
        this._reviveNum < 1 && (t = "fuhuo_atk");
      }
      this.mAnimSp.setAnimation(0, t, false);
    }
  };
  _ctor.prototype.playDie = function (e, n) {
    var o = this;
    undefined === e && (e = true);
    undefined === n && (n = false);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      (this._isHaveCrucifix || this._reviveNum > 0) && (n = false);
      console.log("有没有十字架：", this._isHaveCrucifix);
      if (!this._isHaveCrucifix || n) {
        t.prototype.playDie.call(this, e, n);
      } else {
        this._isChangeState = true, setTimeout(function () {
          o._isChangeState = false;
        }, 5e3), this._hpProgress && (this._hpProgress.active = false), this.mAnimSp.setAnimation(0, "die", false);
      }
    }
  };
  _ctor.prototype.playDieAnim = function () {
    this.mAnimSp.paused = false;
    if (!this._isHaveCrucifix && this._reviveNum > 0) {
      this.mAnimSp.setAnimation(0, "meiwuqi_die", false);
    } else {
      this.mAnimSp.setAnimation(0, "fuhuo_die", false);
    }
    var t = $10PlantDefenseDataProxy.plantDefenseDataProxy.priestZombie.indexOf(this.node);
    t >= 0 && $10PlantDefenseDataProxy.plantDefenseDataProxy.priestZombie.splice(t, 1);
  };
  _ctor.prototype.getMoveSpd = function (e, n) {
    var o = t.prototype.getMoveSpd.call(this, e, n);
    0 == this._reviveNum && (o *= 2);
    return o;
  };
  _ctor.prototype.update = function (e) {
    $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead && (this._isChangeState || t.prototype.update.call(this, e));
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mCrucifix", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDEnemyBase.default);
exports.default = def_PDEnemy4004;