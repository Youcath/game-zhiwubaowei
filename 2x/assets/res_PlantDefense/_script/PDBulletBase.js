var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10SimplyCircleCollider = require("SimplyCircleCollider");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10MotionTrail = require("MotionTrail");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDBulletHit = require("PDBulletHit");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDBulletBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mIsSpAni = false;
    e.mImg = null;
    e.mBulletHitPb = null;
    e.mSpAni = null;
    e._atkTarget = null;
    e._atkPos = null;
    e._plantId = 0;
    e._moveSpd = 15;
    e._speed = 1e3;
    e.mLastPos = null;
    e._scaleEquips = [4, 7, 11];
    e._atkCount = 0;
    e._moveNormalize = null;
    e._collisionNodes = [];
    e._isMoveNormalize = false;
    e._catapultNumber = 0;
    e._catapultHurt = 0;
    e._isCheckCollision = false;
    e._oneAtkTargetNum = 1;
    e._atkRate = 1;
    e._isPenetrate = false;
    e._superRate = 1;
    e._isNeedAtkTarget = true;
    e._isPauseGame = false;
    e._idx = 0;
    e._colliderTime = $10GameEnum.EGameEnum.CHECK_COLLIDER_TIME;
    e._isRage = false;
    e._direction = cc.v3(0, 1, 0);
    e._isStarCatapult = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.READY) {
      if (this._isStarCatapult) {
        o = this.getMoveSpd(t);
        var e = null;
        if (!(e = this._atkTarget && this._atkTarget.isValid ? this._atkTarget.position.clone().addSelf(cc.v3(0, this._atkTarget.height / 2)) : this._atkPos)) {
          console.log("目标以经丢失");
          return void this.node.destroy();
        }
        var n = null;
        if ($10MathUtil.MathUtil.distance(this.node.position, e) <= o || this._isMoveNormalize) {
          this._isMoveNormalize = true;
          n = this._moveNormalize;
        } else {
          n = this.node.position.clone().sub(e.clone()).normalize();
        }
        if (n) {
          this.node.x -= o * n.x;
          this.node.y -= o * n.y;
        } else {
          this.node.destroy();
        }
      } else {
        this.setNextAtkTarget();
        var o = this.getMoveSpd(t);
        var i = this._direction.mul(o);
        this.node.position = this.node.position.add(i);
      }
      if (this.node.y > 1e3 || this.node.x > cc.winSize.width / 2 + 100 || this.node.x < -cc.winSize.width / 2 - 100) {
        this.node.destroy();
      } else {
        this._colliderTime -= t;
        if (this._colliderTime <= 0) {
          this._colliderTime = $10GameEnum.EGameEnum.CHECK_COLLIDER_TIME, this.monsterColliderCheck();
        }
      }
    }
  };
  _ctor.prototype.getMoveSpd = function (t) {
    var e = this._moveSpd;
    if (3 == this._plantId) {
      e = .7 * this._moveSpd;
    } else if (1 == this._plantId) {
      e = 1.2 * this._moveSpd;
    } else if (8 == this._plantId) {
      e = .9 * this._moveSpd;
    } else {
      13 == this._plantId && (e = .8 * this._moveSpd);
    }
    return e * (t / 0.016666666666666666);
  };
  _ctor.prototype.setNextAtkTarget = function (t) {
    undefined === t && (t = 0);
  };
  _ctor.prototype.getIsChangeAtkTarget = function () {
    return true;
  };
  Object.defineProperty(_ctor.prototype, "atkRate", {
    set: function (t) {
      this._atkRate = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "superRate", {
    set: function (t) {
      this._superRate = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.setOneAtkTargetNum = function (t) {
    this._oneAtkTargetNum = t;
  };
  _ctor.prototype.setAtkPos = function (t) {
    this._atkPos = t.clone();
    this._atkTarget = null;
    this._isNeedAtkTarget = false;
    this._moveNormalize = this.node.position.clone().sub(this._atkPos.clone()).normalize();
  };
  _ctor.prototype.setCatapultNumber = function (t) {
    this._catapultNumber = t;
  };
  _ctor.prototype.setCatapultHurt = function (t) {
    this._catapultHurt = t;
  };
  _ctor.prototype.initBullet = function (t, e, n, o, i) {
    var a;
    this._isRage = o;
    this._atkTarget = e;
    this._atkCount = n;
    this._direction = i || cc.v3(0, 1, 0);
    i || (this.node.angle = 90);
    this._isStarCatapult = false;
    this.node.scale = 8 == t ? 1.2 : 8 == t ? 1.5 : 1;
    this._plantId = this.getPlantId(t);
    this._catapultNumber = 0;
    null === (a = this.getComponent($10MotionTrail.default)) || undefined === a || a.initMotionTrail();
    if (e && (3 == t || 5 == t || 8 == t)) {
      var s = cc.winSize.height;
      e && e.isValid && (s = $10MathUtil.MathUtil.distance(e.position, this.node.position));
      var l = s / (1 * this._speed / 60) / 60;
      cc.tween(this.node).to(.7 * l, {
        scale: 2
      }).to(.3 * l, {
        scale: .9
      }).start();
      cc.tween(this.node).to(l, {
        angle: 360
      }).start();
    }
  };
  _ctor.prototype.getPlantId = function (t) {
    var e = t;
    switch (t) {
      case 2:
        e = 3;
        break;
      case 3:
        e = 4;
        break;
      case 4:
        e = 5;
        break;
      case 5:
        e = 7;
        break;
      case 6:
        e = 8;
        break;
      case 7:
        e = 10;
        break;
      case 8:
        e = 11;
        break;
      case 9:
        e = 13;
        break;
      case 10:
        e = 14;
        break;
      case 11:
        e = 15;
    }
    return e;
  };
  _ctor.prototype.setDapTargetNode = function () {
    if (this._catapultNumber <= 0) {
      return false;
    }
    if (!this.node || !this.node.isValid || !this.node.parent) {
      return false;
    }
    var t = this._atkTarget;
    this._atkTarget = null;
    var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
    for (var n = 0; n < e.length; ++n) {
      var o = e[n];
      if ((!t || o.uuid != t.uuid) && o && o.isValid && "PDEnemy4008" != o.name) {
        if ($10MathUtil.MathUtil.distance(this.node.position, o.position) <= 500) {
          this._atkTarget = o;
          this._atkPos = this._atkTarget.position;
          this._catapultNumber--;
          this._isMoveNormalize = false;
          return true;
        }
        if (!this._atkTarget || !this._atkTarget.isValid) {
          return false;
        }
      }
    }
    return e.length > 0 && (this._atkTarget = e[0], this._atkPos = this._atkTarget.position, this._catapultNumber--, this._isMoveNormalize = false, true);
  };
  _ctor.prototype.moveArrive = function (t) {
    t || (t = this._atkTarget);
    this._atkTarget = t;
    if (t && t.isValid) {
      var e;
      e = this._isStarCatapult ? {
        num: this._catapultHurt,
        isCrit: false
      } : {
        num: this._atkCount,
        isCrit: false
      };
      t.getComponent($10PDEnemyBase.default).beAttack(e, this._plantId, false);
      t.getComponent($10PDEnemyBase.default).speedCut(0, 0);
    }
    if (this.setDapTargetNode()) {
      this._isCheckCollision = false;
      this._isMoveNormalize = false;
      this._catapultNumber > 0 && (this._isStarCatapult = true);
    } else {
      this.node.destroy();
      this.node.removeFromParent();
    }
  };
  _ctor.prototype.setAngle = function () {
    var t = this.node.position;
    if (this.mLastPos) {
      var e = -1e4;
      if (t != this.mLastPos) {
        var n = t.sub(this.mLastPos);
        var o = cc.v2(n);
        var i = cc.v2(1, 0);
        var a = o.magSqr();
        var r = i.magSqr();
        if (0 == a || 0 == r) {
          return;
        }
        var s = o.signAngle(i);
        var l = Math.floor(cc.misc.radiansToDegrees(s));
        e = l;
        l = -l;
        this.node.angle = l;
        this.mLastPos = t;
      }
      return e;
    }
    this.mLastPos = t;
  };
  _ctor.prototype.addBulletHit = function (t) {
    var e;
    var n = cc.instantiate(this.mBulletHitPb);
    $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer.addChild(n, this.node.zIndex);
    var o = null;
    var i = t;
    if (t && t.isValid) {
      var a = t.scale;
      o = t.position.addSelf(cc.v3(0, t.height * a * .7));
    } else if (this._atkTarget && this._atkTarget.isValid) {
      a = this._atkTarget.scale;
      o = this._atkTarget.position.addSelf(cc.v3(0, this._atkTarget.height * a * .7));
      i = this._atkTarget;
    } else {
      o = this.node.position;
    }
    i && i.isValid && (null === (e = i.getComponent($10PDEnemyBase.default)) || undefined === e || e.updateHitEffectNodes(n, this._plantId));
    n.position = o;
    n.getComponent($10PDBulletHit.default).mTargetNode = i;
    n.getComponent($10PDBulletHit.default).initBulletHit(this._plantId, 0, this._isRage);
    return n;
  };
  _ctor.prototype.getIsScale = function () {
    for (var t = 0; t < this._scaleEquips.length; ++t) {
      if (this._plantId == this._scaleEquips[t]) {
        return true;
      }
    }
    return false;
  };
  _ctor.prototype.monsterColliderCheck = function (t) {
    var e = this.node.getComponent($10SimplyCircleCollider.default);
    var n = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
    for (var o = 0; o < n.length; ++o) {
      var i = n[o];
      if (e && i && i.isValid && ("PDEnemy4008" != i.name || 20 == this._plantId) && ("PDEnemy4002" != i.name || i.getComponent("PDEnemy4002").getIsCanChoose()) && ("PDEnemy4001" != i.name || !i.getComponent("PDEnemy4001").isUnderground)) {
        var a = i.getChildByName("collision").getComponent($10SimplyRectCollider.default);
        if (a && $10SimplyCollisionDetector.default.isCollisionRectToCircle(a.rect, e.circle) && (this.moveArrive(i), !t)) {
          break;
        }
      }
    }
  };
  _ctor.prototype.getBulletImgPath = function () {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.getIsSuperPlant(this._plantId)) {
      return "CWzidan" + this._plantId;
    } else {
      return "zidan" + this._plantId;
    }
  };
  _ctor.prototype.setBulletSpriteFrame = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/bulletHit/BulletHit",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      t.mImg.spriteFrame = e.getSpriteFrame(t.getBulletImgPath());
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  cc__decorate([ccp_property()], _ctor.prototype, "mIsSpAni", undefined);
  cc__decorate([ccp_property({
    type: cc.Sprite,
    tooltip: "是否展示Img",
    visible: function () {
      return !this.mIsSpAni;
    }
  })], _ctor.prototype, "mImg", undefined);
  cc__decorate([ccp_property({
    type: cc.Prefab,
    tooltip: "击中破碎动画预制体",
    visible: function () {
      return !this.mIsSpAni;
    }
  })], _ctor.prototype, "mBulletHitPb", undefined);
  cc__decorate([ccp_property({
    type: sp.Skeleton,
    tooltip: "是否展示spine动画",
    visible: function () {
      return this.mIsSpAni;
    }
  })], _ctor.prototype, "mSpAni", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDBulletBase;