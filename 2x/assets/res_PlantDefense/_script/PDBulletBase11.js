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
var $10NodePoolManager = require("NodePoolManager");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDBulletBase11 = function (t) {
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
    e.mLastPos = null;
    e._scaleEquips = [4, 7, 11];
    e._atkCount = 0;
    e._moveNormalize = null;
    e._collisionNodes = [];
    e._isMoveNormalize = false;
    e._catapultNumber = 0;
    e._isCheckCollision = false;
    e._oneAtkTargetNum = 1;
    e._atkRate = 1;
    e._isPenetrate = false;
    e._superRate = 1;
    e._isNeedAtkTarget = true;
    e._isPauseGame = false;
    e._idx = 0;
    e._colliderTime = $10GameEnum.EGameEnum.CHECK_COLLIDER_TIME;
    e._isTop = false;
    e._isRage = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.READY) {
      this.setNextAtkTarget();
      var e = this.getMoveSpd(t);
      var n = null;
      if (!(n = this._atkTarget && this._atkTarget.isValid ? this._atkTarget.position.clone().addSelf(cc.v3(0, this._atkTarget.height / 2)) : this._atkPos)) {
        cc.log("目标以经丢失");
        return void $10NodePoolManager.default.instance.putNode(this.node);
      }
      var o = $10MathUtil.MathUtil.distance(this.node.position, n);
      var i = null;
      if (o <= e || this._isMoveNormalize) {
        this._isMoveNormalize = true;
        i = this._moveNormalize;
      } else {
        i = this.node.position.clone().sub(n.clone()).normalize();
      }
      this.node.x -= e * i.x;
      this.node.y -= e * i.y;
      this.setAngle();
      var a = cc.winSize;
      if (this.node.x > a.width || this.node.x < -a.width || this.node.y > a.height || this.node.y < -a.height) {
        $10NodePoolManager.default.instance.putNode(this.node);
      } else if (this._isCheckCollision) {
        this._colliderTime -= t;
        if (this._colliderTime <= 0) {
          this._colliderTime = $10GameEnum.EGameEnum.CHECK_COLLIDER_TIME, this.monsterColliderCheck();
        }
      } else {
        o <= e && this.moveArrive();
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
    if (this._isNeedAtkTarget) {
      this.getIsChangeAtkTarget();
    } else {
      this._atkTarget = null;
    }
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
  _ctor.prototype.initBullet = function (t, e, n, o, i) {
    var a;
    if (!e || !e.isValid) {
      cc.log("目标丢失，无效射击");
      this.node.destroy();
      return void this.node.removeFromParent();
    }
    this._isRage = i;
    this._atkTarget = e;
    this._isNeedAtkTarget = true;
    this._atkPos = e.position.clone();
    this._atkCount = o;
    this.mLastPos = null;
    this._collisionNodes = [];
    this._atkTarget && this._atkTarget.isValid && (this._atkPos = this._atkPos.clone().addSelf(cc.v3(0, this._atkTarget.height / 2)));
    if ("BuildBase" == e.name || "BossSkill5" == e.name) {
      this._isCheckCollision = false;
    } else {
      this._isCheckCollision = true;
    }
    this._isMoveNormalize = false;
    this._moveNormalize = this.node.position.clone().sub(this._atkPos.clone()).normalize();
    this.node.scale = 8 == t ? 1.2 : 8 == t ? 1.5 : 1;
    this._plantId = t;
    this._catapultNumber = 1;
    null === (a = this.getComponent($10MotionTrail.default)) || undefined === a || a.initMotionTrail();
  };
  _ctor.prototype.setDapTargetNode = function () {
    if (this._catapultNumber <= 0) {
      return false;
    }
    if (!this.node || !this.node.isValid || !this.node.parent) {
      return false;
    }
    var t = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
    for (var e = 0; e < t.length; ++e) {
      var n = t[e];
      if (n != this._atkTarget && n && n.isValid && "PDEnemy4008" != n.name) {
        var o = $10MathUtil.MathUtil.distance(this.node.position, n.position);
        if (o <= 500 && o > 100) {
          this._atkTarget = n;
          this._atkPos = this._atkTarget.position;
          this._catapultNumber--;
          this._isMoveNormalize = false;
          return true;
        }
      }
    }
    return t.length > 0 && (this._atkTarget = t[0], this._atkPos = this._atkTarget.position, this._catapultNumber--, this._isMoveNormalize = false, true);
  };
  _ctor.prototype.moveArrive = function (t) {
    t || (t = this._atkTarget);
    if (t && t.isValid) {
      t.getComponent($10PDEnemyBase.default).beAttack({
        num: 10,
        isCrit: false
      }, this._plantId, false);
      t.getComponent($10PDEnemyBase.default).speedCut(0, 0);
    }
    if (this.setDapTargetNode()) {
      this._isCheckCollision = false;
      this._isMoveNormalize = false;
    } else if (!this._isPenetrate) {
      this.node.destroy(), this.node.removeFromParent();
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
      if (e && i && i.isValid && "PDEnemy4008" != i.name) {
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
exports.default = def_PDBulletBase11;