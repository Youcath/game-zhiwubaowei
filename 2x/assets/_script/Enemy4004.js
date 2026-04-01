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
var $10EquipmentItem = require("EquipmentItem");
var $10EnemyBase = require("EnemyBase");
var $10EnemyCrucifix = require("EnemyCrucifix");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_Enemy4004 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mCrucifix = null;
    e._isChangeState = false;
    e._reviveNum = 0;
    e._isHaveCrucifix = true;
    e._isCheckMagnet = false;
    e._checkMagnetTime = 0;
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
    this.mAnimSp.setAnimation(0, "move_xi", false);
    this._isCheckMagnet = false;
  };
  _ctor.prototype.onLoad = function () {
    var t = this;
    this._reviveNum = 2;
    this.mIsSpAni && this.mAnimSp.setCompleteListener(function (e) {
      var o;
      var i = e.animation ? e.animation.name : "";
      if ("die" == i) {
        if (2 == t._reviveNum) {
          t.mAnimSp.setAnimation(0, "fuhuozhong1", false);
        } else {
          1 == t._reviveNum && t.mAnimSp.setAnimation(0, "fuhuozhong2", false);
        }
        t._reviveNum--;
      } else if (i.indexOf("atk") >= 0) {
        t.playMove();
      } else if ("fuhuo_die" == i || "meiwuqi_die" == i) {
        t.node.destroy();
        t.node.removeFromParent();
      } else if ("fuhuozhong2" == i) {
        t.mAnimSp.setAnimation(0, "fuhuo2", false);
      } else if ("fuhuo2" == i || "fuhuo1" == i) {
        if ("fuhuo2" == i) {
          t._isHaveCrucifix = false;
          var n = $10BattleDataProxy.battleDataProxy.priestZombie.indexOf(t.node);
          n >= 0 && $10BattleDataProxy.battleDataProxy.priestZombie.splice(n, 1);
        }
        t._isChangeState = false;
        t._nowHp = t._maxHp;
        t.updateHp();
        t.playMove();
      } else if ("fuhuozhong1" == i) {
        t.mAnimSp.setAnimation(0, "fuhuo1", false);
      } else if ("move_xi" == i) {
        t._isAtkFinish = false;
        t._amimState = $10GameEnum.RoleState.Breath;
        t.mAnimSp.setAnimation(0, "xizou", false);
        t._isHaveCrucifix = false;
        t.mCrucifix.active = true;
        null === (o = t.mCrucifix.getComponent($10EnemyCrucifix.default)) || undefined === o || o.attractCrucifix(t.node);
      } else if ("xizou" == i) {
        t._isAtkFinish = true, t.playMove();
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
  _ctor.prototype.removeRushEffect = function () {
    t.prototype.removeRushEffect.call(this);
    $10BattleDataProxy.battleDataProxy.priestZombie.push(this.node);
    this._isCheckMagnet = true;
  };
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemy4004", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.beAttack = function (e, o, i, n) {
    return !!this._isChangeState || t.prototype.beAttack.call(this, e, o, i, n);
  };
  _ctor.prototype.getIsCanChoose = function () {
    return !this._isChangeState;
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
      if (!this._isHaveCrucifix && this._reviveNum > 0) {
        t = "meiwuqi_atk";
      } else {
        this._reviveNum < 1 && (t = "fuhuo_atk");
      }
      this.mAnimSp.setAnimation(0, t, false);
    }
  };
  _ctor.prototype.playDie = function (e, o) {
    undefined === e && (e = true);
    undefined === o && (o = false);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      (this._isHaveCrucifix || this._reviveNum > 0) && (o = false);
      console.log("有没有十字架：", this._isHaveCrucifix);
      if (!this._isHaveCrucifix || o) {
        t.prototype.playDie.call(this, e, o);
      } else {
        this._isChangeState = true, this._hpProgress.active = false, this.mAnimSp.setAnimation(0, "die", false);
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
    var t = $10BattleDataProxy.battleDataProxy.priestZombie.indexOf(this.node);
    t >= 0 && $10BattleDataProxy.battleDataProxy.priestZombie.splice(t, 1);
  };
  _ctor.prototype.getMoveSpd = function (e, o) {
    var i = t.prototype.getMoveSpd.call(this, e, o);
    0 == this._reviveNum && (i *= 2);
    return i;
  };
  _ctor.prototype.update = function (e) {
    var o;
    var i;
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead && !this._isChangeState && (t.prototype.update.call(this, e), this._isChangeState || this._target || this._canAtk && this.playAtk(), this._isCheckMagnet && (this._checkMagnetTime += e, this._checkMagnetTime >= 1))) {
      this._checkMagnetTime = 0;
      var n = null === (o = $10BattleDataProxy.battleDataProxy.equipRoot) || undefined === o ? undefined : o.children;
      var a = null == n ? undefined : n.findIndex(function (t) {
        var e;
        return 101 == (null === (e = t.getComponent($10EquipmentItem.default)) || undefined === e ? undefined : e.equipId);
      });
      if (a >= 0) {
        var r = n[a];
        if (!r || !r.isValid) {
          return;
        }
        (null === (i = r.getComponent($10EquipmentItem.default)) || undefined === i ? undefined : i.isPurchased) && this.playAttract();
      }
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mCrucifix", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10EnemyBase.default);
exports.default = def_Enemy4004;