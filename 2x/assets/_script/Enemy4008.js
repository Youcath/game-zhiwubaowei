var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10SkillDataMgr = require("SkillDataMgr");
var $10Enemy4009 = require("Enemy4009");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_Enemy4008 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSoldierPb = null;
    e._isDischarge = false;
    e._isDischargeFinish = false;
    e._soldierNodes = [];
    e._soldierIdx = 0;
    e._landingTime = 0;
    e._targetPos = cc.v3(-268, -300);
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.playMove = function (t) {
    undefined === t && (t = 5);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      if (this._isDischarge) {
        this.mAnimSp.setAnimation(0, "move2", true);
      } else {
        this.mAnimSp.setAnimation(0, "move", true);
      }
      this.mAnimSp.timeScale = t / 5;
    }
  };
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.mIsSpAni && this.mAnimSp.setCompleteListener(function (e) {
      if ("die" == (e.animation ? e.animation.name : "")) {
        t.node.destroy();
        t.node.removeFromParent();
      }
    });
    var e = this.node.getChildByName("shadow");
    var o = cc.tween(e).to(.3, {
      scale: .9
    }).to(.3, {
      scale: 1
    });
    cc.tween(e).repeatForever(o).start();
  };
  _ctor.prototype.addRushEffect = function () {};
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
    $10BattleDataProxy.battleDataProxy.enemyAirship.push(this.node);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemy4008", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.beAttack = function (e, o, i, n) {
    return t.prototype.beAttack.call(this, e, o, i, n);
  };
  _ctor.prototype.getIsCanChoose = function (t) {
    return 103 == t;
  };
  _ctor.prototype.playDie = function (t, e) {
    undefined === t && (t = true);
    undefined === e && (e = false);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Dead;
      if (t) {
        var o = this._monsterCfg.exp;
        var i = $10SkillDataMgr.default.instance.getSkillProperty(37, 0);
        o = Math.floor(o * (1 + i));
        $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.UPDATE_EXP, o);
      }
      this.removeHpProgress();
      this.mAnimSp.paused = false;
      this.mAnimSp.setAnimation(0, "die", false);
      $10BattleDataProxy.battleDataProxy.removeEnemyNode(this.node);
      var n = $10BattleDataProxy.battleDataProxy.enemyAirship.indexOf(this.node);
      n >= 0 && $10BattleDataProxy.battleDataProxy.enemyAirship.splice(n, 1);
      if (this._soldierNodes.length > 0) {
        for (var a = 0; a < this._soldierNodes.length; ++a) {
          var r = this._soldierNodes[a];
          r.destroy();
          r.removeFromParent();
        }
        this._soldierNodes = [];
      }
    }
  };
  _ctor.prototype.playDieAnim = function () {};
  _ctor.prototype.move = function (t) {
    if (this.node && this.node.isValid) {
      var e = this.getMoveSpd(this._isSpdAdd, t);
      if (this._amimState != $10GameEnum.RoleState.Dead && this._amimState != $10GameEnum.RoleState.Attack && this._amimState != $10GameEnum.RoleState.BeBack) {
        if ($10MathUtil.MathUtil.distance(this._targetPos.clone(), this.node.position) <= e) {
          if (this._isDischargeFinish) {
            this.node.destroy();
            this.node.removeFromParent();
            return void console.log("删掉飞艇");
          }
          if (!this._isDischarge) {
            this.mAnimSp.setAnimation(0, "stand", true);
            for (var o = 0; o < 5; ++o) {
              var i = cc.instantiate(this.mSoldierPb);
              $10BattleDataProxy.battleDataProxy.battleView.addChild(i);
              this._soldierNodes.push(i);
              i.getComponent($10EnemyBase.default).initEnemy(4009);
              var n = $10Util.default.convertToTargetNodeSpace(this.node.getChildByName("enemy" + (o + 1)), this.node);
              i.position = n;
            }
            this._isDischarge = true;
          }
        } else {
          var a = this.node.position.clone().sub(this._targetPos.clone()).normalize();
          this.node.x -= e * a.x;
          this.node.y -= e * a.y;
          this.node.zIndex = -this.node.y;
        }
      }
    }
  };
  _ctor.prototype.update = function (e) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead && (t.prototype.update.call(this, e), !this._isDischargeFinish && this._soldierNodes.length > 0 && this._isDischarge && (this._landingTime -= e, this._landingTime <= 0))) {
      this._landingTime = .3;
      var o = this._soldierNodes[0];
      if (o && o.isValid) {
        o.getComponent($10Enemy4009.default).playLanding(this._soldierIdx);
        o.zIndex = this.node.zIndex + 1;
        this._soldierNodes.splice(0, 1);
        $10BattleDataProxy.battleDataProxy.airshipSoldier.push(o);
        $10BattleDataProxy.battleDataProxy.enemyNodes.push(o);
        var i = $10BattleDataProxy.battleDataProxy.waveEnemyNum;
        i++;
        $10BattleDataProxy.battleDataProxy.waveEnemyNum = i;
        this._soldierIdx++;
        if (this._soldierIdx >= 5) {
          this._isDischargeFinish = true;
          $10BattleDataProxy.battleDataProxy.removeEnemyNode(this.node);
          this._targetPos = cc.v3(this.node.x - cc.winSize.width / 2, this.node.y);
          var n = $10BattleDataProxy.battleDataProxy.enemyAirship.indexOf(this.node);
          n >= 0 && $10BattleDataProxy.battleDataProxy.enemyAirship.splice(n, 1);
        }
      }
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSoldierPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10EnemyBase.default);
exports.default = def_Enemy4008;