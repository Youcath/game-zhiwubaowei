var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_Enemy4007 = function (t) {
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
      var o = e.animation ? e.animation.name : "";
      if ("die" == o || "die2" == o) {
        $10BattleDataProxy.battleDataProxy.removeEnemyNode(t.node);
        t.node.destroy();
        t.node.removeFromParent();
      } else if ("move_yinran" == o) {
        t.mAnimSp.setAnimation(0, "boom1", false);
      } else if ("boom1" == o || "boom2" == o) {
        $10BattleDataProxy.battleDataProxy.removeEnemyNode(t.node);
        t.node.destroy();
        t.node.removeFromParent();
      } else {
        "atk" == o && t.mAnimSp.setAnimation(0, "boom2", false);
      }
    });
    this.mAnimSp.setEventListener(function () {
      if (t._isPlayAtk) {
        $10BattleDataProxy.battleDataProxy.updateHouseHp({
          isCirt: false,
          num: -t._atkNum
        });
      } else {
        var e = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
        for (var o = 0; o < e.length; ++o) {
          var i = e[o];
          if (i && i.isValid && i != t.node && $10MathUtil.MathUtil.distance(i.position, t.node.position) <= 150) {
            var n = {
              isCrit: false,
              num: Math.ceil(t._atkNum)
            };
            i.getComponent($10EnemyBase.default).beAttack(n, 0, true, true);
          }
        }
      }
    });
  };
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemy4007", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.beAttack = function (e, o, i, n) {
    var a = t.prototype.beAttack.call(this, e, o, i, n);
    if (!(a || 103 != o || this._isIgnite)) {
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
      this._atkSpd = this.monsterCfg.atkSpeed;
      this._amimState = $10GameEnum.RoleState.Attack;
      this._canAtk = false;
      this._isStartAtk = true;
      this._isPlayAtk = true;
      this.mAnimSp.setAnimation(0, "atk", false);
    }
  };
  _ctor.prototype.playDie = function (e, o) {
    undefined === e && (e = true);
    undefined === o && (o = false);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      if (o) {
        t.prototype.playDie.call(this, e, o);
      } else {
        this._amimState = $10GameEnum.RoleState.Dead;
        this.mAnimSp.paused = false;
        this._hpProgress.active = false;
        if (this._isPlayAtk) {
          this.mAnimSp.setAnimation(0, "die2", false);
        } else {
          this.mAnimSp.setAnimation(0, "die", false);
        }
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10EnemyBase.default);
exports.default = def_Enemy4007;