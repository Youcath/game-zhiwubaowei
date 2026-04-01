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
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDEnemy4008 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSoldierPb = null;
    e._isDischarge = false;
    e._isDischargeFinish = false;
    e._soldierNodes = [];
    e._soldierIdx = 0;
    e._landingTime = 0;
    e._targetPos = cc.v3(-268, -300);
    e._soldierSpawnTimer = 0;
    e._soldierSpawnInterval = 3;
    e._creatorSoliderNum = 0;
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
      if ("die" == (e.animation ? e.animation.name : "") && t.node && t.node.isValid) {
        t.node.destroy();
        t.node.removeFromParent();
      }
    });
    var e = this.node.getChildByName("shadow");
    var n = cc.tween(e).to(.3, {
      scale: .9
    }).to(.3, {
      scale: 1
    });
    cc.tween(e).repeatForever(n).start();
    this._targetPos = cc.v3(this.node.x, -550);
    this._isDischargeFinish = false;
  };
  _ctor.prototype.addRushEffect = function () {};
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
    $10PlantDefenseDataProxy.plantDefenseDataProxy.enemyAirship.push(this.node);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemy4008", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.beAttack = function (e, n, o, i) {
    return t.prototype.beAttack.call(this, e, n, o, i);
  };
  _ctor.prototype.getIsCanChoose = function (t) {
    return 103 == t;
  };
  _ctor.prototype.playDie = function (t, e) {
    undefined === t && (t = true);
    undefined === e && (e = false);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Dead;
      this.removeHpProgress();
      this.mAnimSp.paused = false;
      this.mAnimSp.setAnimation(0, "die", false);
      $10PlantDefenseDataProxy.plantDefenseDataProxy.removeEnemyNode(this.node);
      var n = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemyAirship.indexOf(this.node);
      n >= 0 && $10PlantDefenseDataProxy.plantDefenseDataProxy.enemyAirship.splice(n, 1);
      if (this._soldierNodes.length > 0) {
        for (var o = 0; o < this._soldierNodes.length; ++o) {
          var i = this._soldierNodes[o];
          i.destroy();
          i.removeFromParent();
        }
        this._soldierNodes = [];
      }
    }
  };
  _ctor.prototype.playDieAnim = function () {};
  _ctor.prototype.move = function (t) {
    if (this.node && this.node.isValid) {
      if (this.node.y <= 125) {
        this._soldierSpawnTimer += t;
        if (this._soldierSpawnTimer >= this._soldierSpawnInterval) {
          this._soldierSpawnTimer = 0;
          var e = cc.instantiate(this.mSoldierPb);
          $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView.addChild(e);
          e.position = cc.v3(this.node.x, this.node.y);
          e.getComponent($10PDEnemyBase.default).initEnemy(this._stageData, true);
          $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.push(e);
          this._creatorSoliderNum++;
        }
        if (this._creatorSoliderNum >= 3) {
          this.playDie();
          return void console.log("删掉飞艇");
        }
      }
      if (!(this.node.y < 125)) {
        var n = this.getMoveSpd(this._isSpdAdd, t);
        var o = this.node.position.clone().sub(this._targetPos.clone()).normalize();
        this.node.y -= n * o.y;
        this.node.zIndex = -this.node.y;
      }
    }
  };
  _ctor.prototype.update = function (e) {
    t.prototype.update.call(this, e);
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSoldierPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDEnemyBase.default);
exports.default = def_PDEnemy4008;