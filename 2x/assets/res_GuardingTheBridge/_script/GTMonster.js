var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10Simulator = require("Simulator");
var $10AnimationCfgMgr = require("AnimationCfgMgr");
var $10AnimationCtrl = require("AnimationCtrl");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10GuardingDataProxy = require("GuardingDataProxy");
var $10GTGameMgr = require("GTGameMgr");
var $10GTPlayerCtl = require("GTPlayerCtl");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GTMonster = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mColliderNode = null;
    e.mBody = null;
    e.mAnimCtrl = null;
    e._hp = 0;
    e._maxHp = 0;
    e._isDead = false;
    e._moveSpeed = cc.v3(0, 0);
    e._atkInverval = 1;
    e._endMaxY = 0;
    e._target = null;
    e._hpProgress = null;
    e._isBoss = false;
    e._amimState = $10GameEnum.RoleState.Default;
    e._placePos = null;
    e._agentHandleId = -1;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "agentHandleId", {
    get: function () {
      return this._agentHandleId;
    },
    set: function (t) {
      this._agentHandleId = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.update = function (t) {
    if ($10GuardingDataProxy.guardingDataProxy.gameState == $10GameEnum.GameState.PLAYING && !this._isDead && (this.agentHandleId < 0 && (this.node.position = this.node.position.add(this._moveSpeed.mul(t)), this.node.zIndex = -this.node.y), this.node.y < this._endMaxY || this.agentHandleId >= 0)) {
      this._atkInverval >= 0 && (this._atkInverval -= t);
      if (this.agentHandleId < 0) {
        this._target = $10GuardingDataProxy.guardingDataProxy.playerNode;
        var e = $10Simulator.Simulator.instance.addAgent(cc.v2(this.node.position), 10, 999999, null, 1);
        this.agentHandleId = e;
      }
      this.checkAtk();
      if (this._amimState == $10GameEnum.RoleState.Move) {
        this.move(t);
        this.moveByRvo(t);
      }
      if (this._amimState == $10GameEnum.RoleState.Attack) {
        if (!this._target || !this._target.isValid) {
          return void (this._amimState = $10GameEnum.RoleState.Move);
        }
        var o = cc.Vec2.len(this._target.position.clone().sub(this.node.position.clone()));
        if (Math.abs(o - 0) > 150) {
          this.playMoveAnim();
          return void (this._amimState = $10GameEnum.RoleState.Move);
        }
        this._atkInverval <= 0 && this.attack();
      }
    }
  };
  _ctor.prototype.playMoveAnim = function () {
    this.mAnimCtrl.playAnim("move", true, null, null, 3);
  };
  _ctor.prototype.playAtkAnim = function (t) {
    this.scheduleOnce(function () {
      t && t();
    }, .5);
  };
  _ctor.prototype.playIdleAnim = function () {
    this.mAnimCtrl.playAnim("move", true, null, null, 3);
  };
  _ctor.prototype.playDeadAnim = function (t) {
    this.mAnimCtrl.playAnim("die", false, function () {
      t && t();
    }, null, 5);
  };
  _ctor.prototype.setAnimScaleX = function (t) {
    var e = Math.abs(this.mAnimCtrl.node.scale);
    this.mAnimCtrl.node.scaleX = t ? e : -e;
  };
  _ctor.prototype.attack = function () {
    var t = this;
    if (this._amimState != $10GameEnum.RoleState.Dead) {
      return this.playAttack(function () {
        t._atkInverval = 1;
        t.breath();
        t._amimState = $10GameEnum.RoleState.Move;
      }, this._target);
    }
  };
  _ctor.prototype.playAttack = function (t, e) {
    var o = this;
    this._amimState != $10GameEnum.RoleState.Dead && this.playAtkAnim(function () {
      o.shoot(e);
      t && t();
    });
  };
  _ctor.prototype.breath = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead) {
      this.playIdleAnim();
      this._amimState = $10GameEnum.RoleState.Breath;
    }
  };
  _ctor.prototype.shoot = function () {
    this._target.getComponent($10GTPlayerCtl.default).beAttack(5);
  };
  _ctor.prototype.move = function () {
    if (!(this.agentHandleId < 0) && this._target && this._target.isValid && this._amimState != $10GameEnum.RoleState.Dead && this._amimState != $10GameEnum.RoleState.Attack) {
      var t = this.agentHandleId;
      var e = $10Simulator.Simulator.instance.getAgentByAid(t);
      if (!e) {
        console.error("RVO异常 agent::", e, t);
        return false;
      }
      var o = $10Simulator.Simulator.instance.getAgentPosition(t);
      if (!o) {
        console.error("RVO异常 agentPos::", o, t);
        return false;
      }
      this._placePos = null;
      var i = cc.Vec3.ZERO;
      i = this._target.position.clone();
      var a = null;
      a = cc.v2(i).subtract(cc.v2(o.x, o.y)).normalize();
      this.setAnimScaleX(a.x >= 0);
      $10Simulator.Simulator.instance.setAgentPrefVelocity(t, a.multiplyScalar(this.getMoveSpeed()));
      return true;
    }
  };
  _ctor.prototype.getMoveSpeed = function () {
    return Math.abs(this._moveSpeed.y);
  };
  _ctor.prototype.moveByRvo = function () {
    if (!(this.agentHandleId < 0) && this._target && this._amimState != $10GameEnum.RoleState.Dead && this._amimState != $10GameEnum.RoleState.Attack && this._amimState != $10GameEnum.RoleState.BeBack) {
      var t = $10Simulator.Simulator.instance.getAgentPosition(this.agentHandleId);
      if (!t || !t.x && 0 != t.x || !t.y && 0 != t.y) {
        if (t) {
          t.x = this.node.x;
          t.y = this.node.y;
        }
      } else {
        if (Math.abs(t.x - this.node.x) > 100) {
          t.x = this.node.x;
          return void (t.y = this.node.y);
        }
        if (this._placePos) {
          this.node.setPosition(this._placePos.x, this._placePos.y);
          t.x = this._placePos.x;
          t.y = this._placePos.y;
        } else {
          var e = cc.v3(t.x - this.node.x, t.y - this.node.y, 0);
          var o = this.node.position.clone().add(e);
          this.node.setPosition(o.x, o.y);
        }
        this.node.zIndex = -this.node.y;
      }
    }
  };
  _ctor.prototype.initEnemy = function (t) {
    var e = this;
    this._moveSpeed = cc.v3(0, -t.speed);
    this._hp = t.hp;
    this._maxHp = this._hp;
    this._isBoss = false;
    2005 == t.monsterId || 4005 == t.monsterId || t.monsterId;
    if (this.mAnimCtrl) {
      this.mAnimCtrl.loadAtlasAnimation($10AnimationCfgMgr.AnimationCfgMgr.instance.getAnimationCfg($10DataManager.DataManager.instance.eData.datamonster[t.monsterId]), true).then(function () {
        e.playMoveAnim();
        e._amimState = $10GameEnum.RoleState.Move;
        if (t.boss) {
          e.mBody.scale = 2;
          e.mColliderNode.getComponent("SimplyCircleCollider").radius = 100;
          e.addHpBar();
          e._isBoss = true;
        }
      });
    } else {
      this.playMoveAnim();
      this._amimState = $10GameEnum.RoleState.Move;
      if (t.boss) {
        this.mBody.scale = 2, this.mColliderNode.getComponent("SimplyCircleCollider").radius = 100, this.addHpBar(), this._isBoss = true;
      }
    }
  };
  _ctor.prototype.addHpBar = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.GuardingTheBridge,
      path: "prefabs/HpProgress",
      type: cc.Prefab
    }).then(function (e) {
      if (t.node && t.node.isValid) {
        var o = cc.instantiate(e);
        o.parent = t.node;
        o.position = cc.v3(0, t.mBody.height * t.mBody.scaleY + 30);
        o.active = true;
        t._hpProgress = o.getChildByName("Bar");
      }
    });
  };
  _ctor.prototype.checkAtk = function () {
    var t = cc.Vec2.len(this._target.position.clone().sub(this.node.position.clone()));
    return Math.abs(t - 0) <= 150 && (this._amimState = $10GameEnum.RoleState.Attack, true);
  };
  _ctor.prototype.beAttack = function (t, e) {
    t *= 1;
    this.subHp(t);
    e && this.showHurtLab(t);
    this._hpProgress && this._isBoss && (this._hpProgress.getComponent(cc.Sprite).fillRange = this._hp / this._maxHp);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/hit", $10HomeEnum.Bundles.RES);
    if (this._hp <= 0) {
      return this.dealDie(), true;
    } else {
      return this.hit(), false;
    }
  };
  _ctor.prototype.hit = function () {
    var t = this;
    this.mAnimCtrl.node.color = cc.Color.RED;
    this.scheduleOnce(function () {
      t.mAnimCtrl.node.color = cc.Color.WHITE;
    }, .2);
  };
  _ctor.prototype.dealDie = function () {
    var t = this;
    if (!this._isDead) {
      this._isDead = true;
      this.playDeadAnim(function () {
        var e = $10GuardingDataProxy.guardingDataProxy.monsters.indexOf(t.node);
        -1 != e && $10GuardingDataProxy.guardingDataProxy.monsters.splice(e, 1);
        t.node.destroy();
        t.node.removeFromParent();
        $10EventManager.EventManager.instance.emit($10GuardingDataProxy.GuardingDataEvent.KILL_MONSTER);
      });
    }
  };
  _ctor.prototype.subHp = function (t) {
    isNaN(t) && (t = 1);
    this._hp -= t;
    isNaN(this._hp) && (this._hp = 10);
    this._hp < 0 && (this._hp = 0);
  };
  _ctor.prototype.showHurtLab = function (t) {
    var e = this.node.position;
    e.y += this.mBody.height;
    $10GTGameMgr.default.instance.showHitNum(t, e);
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mColliderNode", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBody", undefined);
  cc__decorate([ccp_property({
    type: $10AnimationCtrl.default
  })], _ctor.prototype, "mAnimCtrl", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_GTMonster;