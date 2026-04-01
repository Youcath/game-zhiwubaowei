var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BossBall = require("BossBall");
var $10BossSkillBase = require("BossSkillBase");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_EnemyBoss = function (t) {
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
      var o = e.animation ? e.animation.name : "";
      if (o.indexOf("die") >= 0) {
        t.node.destroy();
        t.node.removeFromParent();
      } else {
        o.indexOf("atk") >= 0 && t.playStand();
      }
    });
    this.mAnimSp.setEventListener(function () {
      if (t._isUseSkill) {
        t._isUseSkill = false;
        var e = 1;
        4 == t._skillInfo.id && (e = t._skillInfo.num);
        for (var o = 0; o < e; ++o) {
          t.addSkillNode();
        }
      } else {
        t.openFire();
      }
    });
  };
  _ctor.prototype.initBossSkill = function () {
    var t = this.monsterCfg.bossSkillId;
    t && (this._skillInfo = $10DataManager.DataManager.instance.eData.data_bossskill[t]);
    console.log("Boss的atk:", this._atkNum);
    console.log("Boss的Hp:", this._maxHp);
  };
  _ctor.prototype.initEndlessEnemy = function (e, o) {
    t.prototype.initEndlessEnemy.call(this, e, o);
    this.initBossSkill();
  };
  _ctor.prototype.update = function (e) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead && (t.prototype.update.call(this, e), !(this._iceTime > 0 || this._dizzinessTime > 0 || this._isBeTemptation) && this._skillInfo)) {
      this._skillCd += e;
      var o = this._skillInfo.cd;
      this._isFirstUseSkill && (o /= 2);
      if (this._skillCd >= o) {
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
      3003 == this._monsterCfg.id && (t = "atk" + (Math.floor(1e3 * Math.random()) % this._atkAnimFrameNums.length + 1));
      this.mAnimSp.setAnimation(0, t, false);
      this._isUseSkill = true;
    }
  };
  _ctor.prototype.addSkillNode = function () {
    var t = this;
    if (this._amimState != $10GameEnum.RoleState.Dead) {
      if (6 != this.monsterCfg.bossSkillId) {
        $10ResUtil.ResUtil.loadAsset({
          bundleName: $10HomeEnum.Bundles.GAME,
          path: "prefabs/bossSkill/BossSkill" + this._skillInfo.id,
          type: cc.Prefab
        }).then(function (e) {
          if (t.node && t.node.isValid) {
            if (5 == t.monsterCfg.bossSkillId) {
              var o = cc.instantiate(e);
              t.node.parent.addChild(o);
              o.getComponent($10EnemyBase.default).initEnemy(5001);
              $10BattleDataProxy.battleDataProxy.enemyNodes.push(o);
              $10BattleDataProxy.battleDataProxy.wateringCart = o;
            } else {
              var i = cc.instantiate(e);
              $10BattleDataProxy.battleDataProxy.battleView.addChild(i, t.node.zIndex - 1);
              if (2 == t.monsterCfg.bossSkillId) {
                var n = t.mAnimSp.node.getChildByName("fireNode");
                var a = $10Util.default.convertToTargetNodeSpace(n, i);
                i.position = a;
                i.zIndex = 1e3;
              } else {
                i.position = t.node.position;
              }
              i.getComponent($10BossSkillBase.default).play();
            }
          }
        });
      } else {
        $10ResUtil.ResUtil.loadAsset({
          bundleName: $10HomeEnum.Bundles.GAME,
          path: "prefabs/bossSkill/BossBall",
          type: cc.Prefab
        }).then(function (e) {
          if (t.node && t.node.isValid) {
            var o = cc.instantiate(e);
            $10BattleDataProxy.battleDataProxy.battleView.addChild(o);
            var i = t.mAnimSp.node.getChildByName("fireNode");
            var n = $10Util.default.convertToTargetNodeSpace(i, o);
            o.position = n;
            o.getComponent($10BossBall.default).initBossBall();
          }
        });
      }
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
      3003 == this._monsterCfg.id && (t = "atk" + (Math.floor(1e3 * Math.random()) % this._atkAnimFrameNums.length + 1));
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
}($10EnemyBase.default);
exports.default = def_EnemyBoss;