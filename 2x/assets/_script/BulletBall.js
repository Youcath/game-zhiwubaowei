var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10SkillDataMgr = require("SkillDataMgr");
var $10ComboBase = require("ComboBase");
var $10BallCollisionEffect = require("BallCollisionEffect");
var $10EquipmentItem = require("EquipmentItem");
var $10MapBlockItem = require("MapBlockItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletBall = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mRigidBody = null;
    e.mCollisionEffectPb = null;
    e.mFrenzySp = null;
    e.mTuowei = null;
    e._moveSpd = 200;
    e._velocity = cc.v2(1, 1);
    e._bulletIdx = 0;
    e._collisionEnter = [];
    e._isCanCollision = true;
    e._colliderWallCount = 0;
    e._colliderBlockCount = 0;
    e._topColliderPos = null;
    e._topColliderBlockPos = null;
    e._linearDirections = [cc.v2(1, 1), cc.v2(-1, -1), cc.v2(1, -1), cc.v2(-1, 1)];
    e._collisionPlantNum = 0;
    e._lastVelocitys = [];
    e._maxCollisionNum = 0;
    e._baseTargetSpeed = 0;
    e._lastPos = null;
    e._lastAngle = 0;
    e._collisionNum = 0;
    e._checkTime = 0;
    e._isCheck = false;
    e._isBlackHole = false;
    e._isCanActiveFrenzy = true;
    e._addSpdTime = 0;
    e._isEndFrenzy = true;
    e._collisionEffectTime = 0;
    e._collisionNodes = [];
    e._collisionWater = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletBall = function (t) {
    this._bulletIdx = t;
    this._maxCollisionNum = Number($10DataManager.DataManager.instance.eData.datapara[66].num);
    this.mRigidBody.linearVelocity = this.getLinearVelocity();
    this._baseTargetSpeed = this.mRigidBody.linearVelocity.lengthSqr();
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.SELECT_SKILL, this.selectSkill, this);
  };
  _ctor.prototype.initCollisionPlantNum = function () {
    this._collisionPlantNum = 0;
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.SELECT_SKILL, this.selectSkill, this);
  };
  _ctor.prototype.selectSkill = function (t) {
    if (9001 == t || 9002 == t || 9003 == t) {
      var e = $10DataManager.DataManager.instance.eData.dataskill[t];
      var o = this.mRigidBody.linearVelocity.clone();
      var i = e.attribute.split("_").map(Number);
      var n = cc.v2(o.x * (1 + i[1]), o.y * (1 + i[1]));
      this._baseTargetSpeed = this.getLinearVelocity().lengthSqr();
      this.mRigidBody.linearVelocity = n;
    }
  };
  _ctor.prototype.update = function () {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      if (!this._isBlackHole) {
        this.resume();
        var t = this.mRigidBody.linearVelocity;
        0 == t.x && 0 == t.y && this.setLinearVelocity();
      }
    } else {
      this.pause();
    }
  };
  _ctor.prototype.getLinearVelocity = function (t) {
    var e = $10SkillDataMgr.default.instance.getSkillProperty(39, 0);
    var o = this._linearDirections[this._bulletIdx];
    if (t) {
      o = this.mRigidBody.linearVelocity.clone().normalizeSelf();
    } else {
      (o = this._linearDirections[this._bulletIdx]) || (o = this._linearDirections[0]);
    }
    var i = this._addSpdTime > 0 ? 1 : 0;
    var n = 1;
    this._addSpdTime <= 0 && (n = this._collisionWater.length > 0 ? .3 : 1);
    return cc.v2($10GameEnum.EGameEnum.BALL_SPEED * (1 + e + i) * o.x * n, $10GameEnum.EGameEnum.BALL_SPEED * (1 + e + i) * o.y * n);
  };
  _ctor.prototype.clearCollisionPlantNum = function () {
    this._collisionPlantNum = 0;
    this._isCanActiveFrenzy = true;
    if (!this._isEndFrenzy) {
      this._isEndFrenzy = this._addSpdTime <= 0;
      this._isEndFrenzy && this.initAddSpdTime();
    }
  };
  _ctor.prototype.onBeginContact = function (t, e, o) {
    var i;
    var n;
    var a;
    var s = o.node;
    var c = o.node.name;
    var l = t.getWorldManifold().points;
    if (-1 != c.indexOf("MapBlockItem")) {
      null === (i = s.getComponent($10MapBlockItem.default)) || undefined === i || i.ballCollisionEnter(l[0]);
      t.disabled = false;
      this.clearCollisionPlantNum();
      this._colliderBlockCount++;
      if (this._colliderBlockCount >= 6) {
        this._colliderBlockCount = 0;
        Math.floor(this._topColliderBlockPos.x) != Math.floor(this.node.x) && Math.floor(this._topColliderBlockPos.y) != Math.floor(this.node.y) || this.setLinearVelocity();
      }
      return void (this._topColliderBlockPos = this.node.position);
    }
    var p = false;
    if (-1 != c.indexOf("wall")) {
      p = true;
    } else {
      if (!(this._collisionNodes.indexOf(s) < 0)) {
        return void ((this._addSpdTime > 0 || !this._isEndFrenzy) && (t.disabled = true));
      }
      this._collisionNodes.push(s);
    }
    if (this._addSpdTime > 0) {
      null === (n = s.getComponent($10EquipmentItem.default)) || undefined === n || n.frenzyCollisionEnter();
    } else {
      null === (a = s.getComponent($10EquipmentItem.default)) || undefined === a || a.ballCollisionEnterEx();
    }
    if (this._isBlackHole) {
      t.disabled = true;
    } else {
      if (p) {
        this._colliderBlockCount = 0;
        this._colliderWallCount++;
        if (this._colliderWallCount >= 4) {
          this._colliderWallCount = 0, Math.floor(this._topColliderPos.x) != Math.floor(this.node.x) && Math.floor(this._topColliderPos.y) != Math.floor(this.node.y) || this.setLinearVelocity();
        }
        t.disabled = false;
        this.clearCollisionPlantNum();
      } else {
        this._colliderBlockCount = 0;
        this._colliderWallCount = 0;
        if (this._addSpdTime <= 0 && this._isEndFrenzy) {
          this._collisionPlantNum++;
        } else {
          this._collisionPlantNum = 0;
        }
        this._isCanActiveFrenzy && this._addSpdTime <= 0 && this.addComboEffect(cc.v3(l[0]));
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/ballHit", $10HomeEnum.Bundles.RES);
        (this._collisionPlantNum >= this._maxCollisionNum || this._addSpdTime > 0 || !this._isEndFrenzy) && (t.disabled = true);
      }
      this._topColliderPos = this.node.position;
      if (this._collisionEffectTime <= 0) {
        this._collisionEffectTime = .2;
        var d = this.node.parent.convertToNodeSpaceAR(cc.v3(l[0]));
        var m = $10NodePoolManager.default.instance.getNode(this.mCollisionEffectPb);
        this.node.parent.addChild(m);
        m.position = d;
        m.getComponent($10BallCollisionEffect.default).play();
      }
    }
  };
  _ctor.prototype.onEndContact = function (t, e, o) {
    var i = o.node;
    var n = this._collisionNodes.indexOf(i);
    n >= 0 && this._collisionNodes.splice(n, 1);
  };
  _ctor.prototype.lateUpdate = function (t) {
    if (($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) && !this._isBlackHole) {
      this._addSpdTime > 0 && (this._addSpdTime -= t);
      if (this._collisionEffectTime > 0) {
        this._collisionEffectTime -= t;
        this._collisionEffectTime < 0 && (this._collisionEffectTime = 0);
      }
      var e = this.mRigidBody.linearVelocity;
      var o = e.lengthSqr();
      if (Math.abs(o - this._baseTargetSpeed) > .1) {
        var i = e.clone().normalize().multiplyScalar(Math.sqrt(this._baseTargetSpeed));
        this.mRigidBody.linearVelocity = i;
      }
      var n = this.setAngle();
      if (this.getIsCheck(n)) {
        this._isCheck = true;
      } else {
        this._isCheck = false;
        this._checkTime = 0;
      }
      if (this._isCheck) {
        this._checkTime += t;
        if (this._checkTime >= .3) {
          this._isCheck = false, this._checkTime = 0, this.setLinearVelocity();
        }
      }
    }
  };
  _ctor.prototype.initAddSpdTime = function () {
    this._addSpdTime = 0;
    this.mFrenzySp.active = false;
    this.mTuowei.active = false;
    this.setLinearVelocity();
  };
  _ctor.prototype.getIsCheck = function (t) {
    var e = Math.abs(t % 360);
    return e <= 2.5 || e >= 87.5 && e <= 92.5 || e >= 177.5 && e <= 182.5 || e >= 267.5 && e <= 272.5;
  };
  _ctor.prototype.setAngle = function () {
    var t = this.node.position;
    if (this._lastPos) {
      var e = -1e4;
      if (t != this._lastPos) {
        var o = t.sub(this._lastPos);
        var i = cc.v2(o);
        var n = cc.v2(1, 0);
        var a = i.magSqr();
        var r = n.magSqr();
        if (0 == a || 0 == r) {
          return;
        }
        var s = i.signAngle(n);
        e = Math.floor(cc.misc.radiansToDegrees(s));
        this._lastPos = t;
      }
      return e;
    }
    this._lastPos = t;
  };
  _ctor.prototype.setLinearVelocity = function (t) {
    this.mRigidBody.linearVelocity = this.getLinearVelocity(t);
    this._baseTargetSpeed = this.getLinearVelocity().lengthSqr();
  };
  _ctor.prototype.pause = function () {
    this.mRigidBody.type != cc.RigidBodyType.Static && (this.mRigidBody.type = cc.RigidBodyType.Static);
  };
  _ctor.prototype.resume = function () {
    this._isBlackHole || this.mRigidBody.type != cc.RigidBodyType.Dynamic && (this.mRigidBody.type = cc.RigidBodyType.Dynamic);
  };
  _ctor.prototype.blackHole = function (t) {
    var e = this;
    if (!(this._addSpdTime > 0) && this._isEndFrenzy) {
      this._isBlackHole = true;
      this.pause();
      var o = $10Util.default.convertToTargetNodeSpace(t, this.node);
      cc.Tween.stopAllByTarget(this.node);
      cc.tween(this.node).to(.5, {
        scale: 0,
        position: o
      }).call(function () {
        e.node.destroy();
        e.node.removeFromParent();
      }).start();
      $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.RESUME_BALL);
    }
  };
  _ctor.prototype.addComboEffect = function (t) {
    var e = this;
    if ($10BattleDataProxy.battleDataProxy.isStartFight) {
      var o = this.node.parent;
      var i = o.convertToNodeSpaceAR(t.clone());
      var n = "prefabs/effect/ComboNormal";
      if (this._collisionPlantNum >= this._maxCollisionNum) {
        n = "prefabs/effect/Combo50";
        this._isCanActiveFrenzy = false;
        this._addSpdTime = $10GameEnum.EGameEnum.FRENZY_TIME;
        this.mFrenzySp.active = true;
        this.mTuowei.active = true;
        this._isEndFrenzy = false;
        this.setLinearVelocity();
      } else if ([10, 20, 30, 40].indexOf(this._collisionPlantNum) < 0) {
        return;
      }
      $10ResUtil.ResUtil.loadAsset({
        path: n,
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        var n = cc.instantiate(t);
        o.addChild(n);
        n.position = i;
        n.getComponent($10ComboBase.default).play(e._collisionPlantNum);
      }).catch(function (t) {
        console.log("error:", t);
      });
    }
  };
  _ctor.prototype.pushCollisionWater = function (t) {
    if (this._collisionWater.indexOf(t) < 0) {
      var e = this._collisionWater.length;
      this._collisionWater.push(t);
      e <= 0 && this.setLinearVelocity(true);
    }
  };
  _ctor.prototype.removeCollisionWater = function (t) {
    var e = this._collisionWater.indexOf(t);
    if (e >= 0) {
      this._collisionWater.splice(e, 1);
      this._collisionWater.length <= 0 && this.setLinearVelocity(true);
    }
  };
  cc__decorate([ccp_property(cc.RigidBody)], _ctor.prototype, "mRigidBody", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mCollisionEffectPb", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mFrenzySp", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mTuowei", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BulletBall;