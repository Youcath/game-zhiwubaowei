var i;
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
var $10BattleDataProxy = require("BattleDataProxy");
var $10SkillDataMgr = require("SkillDataMgr");
var $10EnemyBase = require("EnemyBase");
var $10BulletHit = require("BulletHit");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mIsSpAni = false;
    e.mImg = null;
    e.mBulletHitPb = null;
    e.mSpAni = null;
    e._atkTarget = null;
    e._atkPos = null;
    e._plantId = 0;
    e._synthesisLv = 0;
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
    e._isUltimateSkill = false;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "isUltimateSkill", {
    set: function (t) {
      this._isUltimateSkill = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      this.setNextAtkTarget();
      var e = this.getMoveSpd(t);
      var o = null;
      if (!(o = this._atkTarget && this._atkTarget.isValid ? this._atkTarget.position.clone().addSelf(cc.v3(0, this._atkTarget.height / 2)) : this._atkPos)) {
        console.log("目标以经丢失");
        return void $10NodePoolManager.default.instance.putNode(this.node);
      }
      var i = $10MathUtil.MathUtil.distance(this.node.position, o);
      var n = null;
      if (i <= e || this._isMoveNormalize) {
        this._isMoveNormalize = true;
        n = this._moveNormalize;
      } else {
        n = this.node.position.clone().sub(o.clone()).normalize();
      }
      this.node.x -= e * n.x;
      this.node.y -= e * n.y;
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
        i <= e && this.moveArrive();
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
      if (this.getIsChangeAtkTarget()) {
        var e = $10BattleDataProxy.battleDataProxy.getPlantAtkTargets(5, this._plantId, false, this._isTop, true);
        for (var o = 0; o < e.length; ++o) {
          var i = e[o];
          if (i && i.isValid && !i.getComponent($10EnemyBase.default).getIsDie()) {
            if (0 == t) {
              this._atkTarget = i;
              this._atkPos = this._atkTarget.position.clone();
              break;
            }
            var n = this._atkTarget && this._atkTarget.isValid ? this._atkTarget : this.node;
            if ($10MathUtil.MathUtil.distance(n.position, i.position) <= t) {
              this._atkTarget = i;
              this._atkPos = this._atkTarget.position.clone();
              break;
            }
          }
        }
      }
    } else {
      this._atkTarget = null;
    }
  };
  _ctor.prototype.getIsChangeAtkTarget = function () {
    return !this._atkTarget || !this._atkTarget.isValid || !!this._atkTarget.getComponent($10EnemyBase.default).getIsDie();
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
  _ctor.prototype.initBullet = function (t, e, o, i, n) {
    var a;
    var r;
    if (!e || !e.isValid) {
      $10NodePoolManager.default.instance.putNode(this.node);
      return void console.log("目标丢失，无效射击");
    }
    this.mImg && (this.mImg.node.angle = 0);
    this._isRage = n;
    this._atkTarget = e;
    this._isTop = null === (a = this._atkTarget.getComponent($10EnemyBase.default)) || undefined === a ? undefined : a.isTop;
    this._isNeedAtkTarget = true;
    this._atkPos = e.position.clone();
    this._atkCount = i;
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
    this._synthesisLv = o;
    this._plantId = t;
    this._catapultNumber = $10BattleDataProxy.battleDataProxy.getCatapultNumber(t);
    cc.Tween.stopAllByTarget(this.node);
    this.getIsScale();
    if ((10009 == this._plantId || 10011 == this._plantId) && this.mImg) {
      cc.Tween.stopAllByTarget(this.mImg.node);
      var s = cc.tween(this.mImg.node).by(.3, {
        angle: 180
      });
      cc.tween(this.mImg.node).repeatForever(s).start();
    }
    null === (r = this.getComponent($10MotionTrail.default)) || undefined === r || r.initMotionTrail();
  };
  _ctor.prototype.setDapTargetNode = function () {
    if (this._catapultNumber <= 0) {
      return false;
    }
    if (!this.node || !this.node.isValid || !this.node.parent) {
      return false;
    }
    var t = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
    for (var e = 0; e < t.length; ++e) {
      var o = t[e];
      if (o != this._atkTarget && o && o.isValid) {
        var i = $10MathUtil.MathUtil.distance(this.node.position, o.position);
        if (i <= 500 && i > 100) {
          this._atkTarget = o;
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
    if (t && t.isValid && t.getComponent($10EnemyBase.default)) {
      var e = t.getComponent($10EnemyBase.default).monsterCfg;
      var o = $10BattleDataProxy.battleDataProxy.getBulletHarm(e.type, this._plantId, this._synthesisLv, this._atkCount, this._oneAtkTargetNum, this._atkRate, this._superRate);
      var i = 0;
      var n = 0;
      if (7 == this._plantId) {
        var a = 0;
        var r = $10BattleDataProxy.battleDataProxy.checkHasSkill(70001);
        r && (a = 100 * r.skillData.probability);
        var s = $10BattleDataProxy.battleDataProxy.checkHasSkill(70004);
        s && (a = 100 * s.skillData.probability);
        var c = false;
        Math.floor(1e3 * Math.random()) % 100 < a && (c = true);
        if (c && (l = $10SkillDataMgr.default.instance.getSkillProperty(13, this._plantId)) > 0) {
          o.num *= l;
          if (r) {
            i = r.skillData.time, n = .2;
          }
        }
      } else if (14 == this._plantId) {
        var l;
        1 == this._idx && (l = $10SkillDataMgr.default.instance.getSkillProperty(13, this._plantId)) > 0 && (o.num *= l);
      }
      t.getComponent($10EnemyBase.default).beAttack(o, this._plantId, false, true);
      t.getComponent($10EnemyBase.default).speedCut(i, n);
    }
    if (this.setDapTargetNode()) {
      this._isCheckCollision = false;
      this._isMoveNormalize = false;
    } else {
      this._isPenetrate || $10NodePoolManager.default.instance.putNode(this.node);
    }
  };
  _ctor.prototype.setAngle = function () {
    var t = this.node.position;
    if (this.mLastPos) {
      var e = -1e4;
      if (t != this.mLastPos) {
        var o = t.sub(this.mLastPos);
        var i = cc.v2(o);
        var n = cc.v2(1, 0);
        var a = i.magSqr();
        var r = n.magSqr();
        if (0 == a || 0 == r) {
          return;
        }
        var s = i.signAngle(n);
        var c = Math.floor(cc.misc.radiansToDegrees(s));
        e = c;
        c = -c;
        this.node.angle = c;
        this.mLastPos = t;
      }
      return e;
    }
    this.mLastPos = t;
  };
  _ctor.prototype.addBulletHit = function (t) {
    var e;
    if (this.mBulletHitPb) {
      var o = $10NodePoolManager.default.instance.getNode(this.mBulletHitPb);
      $10BattleDataProxy.battleDataProxy.bulletView.addChild(o, this.node.zIndex);
      var i = null;
      var n = t;
      if (t && t.isValid) {
        var a = t.scale;
        i = t.position.addSelf(cc.v3(0, t.height * a * .7));
      } else if (this._atkTarget && this._atkTarget.isValid) {
        a = this._atkTarget.scale;
        i = this._atkTarget.position.addSelf(cc.v3(0, this._atkTarget.height * a * .7));
        n = this._atkTarget;
      } else {
        i = this.node.position;
      }
      n && n.isValid && (null === (e = n.getComponent($10EnemyBase.default)) || undefined === e || e.updateHitEffectNodes(o, this._plantId));
      o.position = i;
      o.getComponent($10BulletHit.default).mTargetNode = n;
      o.getComponent($10BulletHit.default).isUltimateSkill = this._isUltimateSkill;
      o.getComponent($10BulletHit.default).initBulletHit(this._plantId, this._synthesisLv, this._isRage);
      return o;
    }
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
    if ($10BattleDataProxy.battleDataProxy.getIsCheckCollision(this.node)) {
      var e = this.node.getComponent($10SimplyCircleCollider.default);
      var o = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      for (var i = 0; i < o.length; ++i) {
        var n = o[i];
        if (e && n && n.isValid && !this.getIsHaveCollisionNode(n)) {
          var a = n.getChildByName("collision").getComponent($10SimplyRectCollider.default);
          if (a && $10SimplyCollisionDetector.default.isCollisionRectToCircle(a.rect, e.circle) && (this.moveArrive(n), !t)) {
            break;
          }
        }
      }
    }
  };
  _ctor.prototype.getIsHaveCollisionNode = function (t) {
    return this._collisionNodes.includes(t);
  };
  _ctor.prototype.getBulletImgPath = function () {
    if (this._plantId >= 10001) {
      return "CWzidan" + this._plantId;
    } else {
      if ($10BattleDataProxy.battleDataProxy.getIsSuperPlant(this._plantId) || this._isRage) {
        return "CWzidan" + this._plantId;
      } else {
        return "zidan" + this._plantId;
      }
    }
  };
  _ctor.prototype.setBulletSpriteFrame = function (t) {
    var e = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/bulletHit/BulletHit",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (o) {
      e.mImg.spriteFrame = t ? o.getSpriteFrame(t) : o.getSpriteFrame(e.getBulletImgPath());
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
exports.default = def_BulletBase;