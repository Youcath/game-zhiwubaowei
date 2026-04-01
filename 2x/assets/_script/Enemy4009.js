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
var def_Enemy4009 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._isLanding = false;
    e._targetPos = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.playMove = function (t) {
    undefined === t && (t = 5);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      this.mAnimSp.setAnimation(0, "move", true);
      this.mAnimSp.timeScale = t / 5;
    }
  };
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.mIsSpAni && this.mAnimSp.setCompleteListener(function (e) {
      var o = e.animation ? e.animation.name : "";
      if ("jiangluo" == o) {
        t.playMove();
        t._isLanding = true;
      } else if (o.indexOf("atk") >= 0) {
        t.playMove();
      } else if ("die" == o) {
        t.node.destroy(), t.node.removeFromParent();
      }
    });
    this.mAnimSp.setEventListener(function (e, o) {
      if ("atk" == o.data.name) {
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyAtk", $10HomeEnum.Bundles.RES);
        $10BattleDataProxy.battleDataProxy.updateHouseHp({
          isCirt: false,
          num: -t._atkNum
        });
      }
    });
  };
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
  };
  _ctor.prototype.beAttack = function (e, o, i, n) {
    return !!this._isLanding && t.prototype.beAttack.call(this, e, o, i, n);
  };
  _ctor.prototype.getIsCanChoose = function () {
    return this._isLanding;
  };
  _ctor.prototype.addRushEffect = function () {};
  _ctor.prototype.moveToHouse = function () {
    this.playAtk();
  };
  _ctor.prototype.playLanding = function () {
    var t = this;
    this._amimState = $10GameEnum.RoleState.Breath;
    this.mAnimSp.setAnimation(0, "jiangluo", false);
    var e = cc.v3(this.node.x, this.node.y - 140);
    cc.tween(this.node).to(0.3333333333333333, {
      position: e
    }).call(function () {
      t._targetPos = cc.v3($10BattleDataProxy.battleDataProxy.house.x - 100, t.node.y);
    }).start();
  };
  _ctor.prototype.playAtk = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._atkSpd = this.monsterCfg.atkSpeed;
      this._amimState = $10GameEnum.RoleState.Attack;
      this._isStartAtk = true;
      this._canAtk = false;
      this.mAnimSp.setAnimation(0, "atk", false);
    }
  };
  _ctor.prototype.playDieAnim = function () {
    this.mAnimSp.setAnimation(0, "die", false);
    var t = $10BattleDataProxy.battleDataProxy.airshipSoldier.indexOf(this.node);
    t >= 0 && $10BattleDataProxy.battleDataProxy.airshipSoldier.splice(t, 1);
  };
  _ctor.prototype.update = function (e) {
    $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead && t.prototype.update.call(this, e);
  };
  _ctor.prototype.move = function (t) {
    if (this.node && this.node.isValid && this._isLanding && this._targetPos) {
      var e = this.getMoveSpd(this._isSpdAdd, t);
      if (this._amimState != $10GameEnum.RoleState.Dead && this._amimState != $10GameEnum.RoleState.Attack && this._amimState != $10GameEnum.RoleState.BeBack) {
        if ($10MathUtil.MathUtil.distance(this._targetPos.clone(), this.node.position) <= e) {
          if (this._canAtk) {
            this._canAtk = false;
            this._atkSpd = this.monsterCfg.atkSpeed;
            this.mAnimSp.setAnimation(0, "atk", false);
          }
        } else {
          var o = this.node.position.clone().sub(this._targetPos.clone()).normalize();
          this.node.x -= e * o.x;
          this.node.y -= e * o.y;
          var i = Math.abs(this.mAnimSp.node.scale);
          this.mAnimSp.node.scaleX = o.x <= 0 ? i : -i;
          this.node.zIndex = -this.node.y;
        }
      }
    }
  };
  _ctor.prototype.getMovePosByTime = function (t) {
    var e = Math.floor(30 * t);
    if (this._isStartAtk) {
      return cc.v3(this._simulationPos.x, this._simulationPos.y + this.node.height);
    }
    if (!this._targetPos) {
      return this.node.position;
    }
    for (var o = 0; o < e; ++o) {
      var i = 2 * this.getMoveSpd(this._simulationIsSpdAdd, 0.016666666666666666);
      var n = $10MathUtil.MathUtil.distance(this._targetPos, this._simulationPos);
      var a = this.node.position.clone().sub(this._targetPos.clone()).normalize();
      this._simulationPos.x -= i * a.x;
      this._simulationPos.y -= i * a.y;
      if (n <= i) {
        break;
      }
    }
    return cc.v3(this._simulationPos.x, this._simulationPos.y + this.node.height);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10EnemyBase.default);
exports.default = def_Enemy4009;