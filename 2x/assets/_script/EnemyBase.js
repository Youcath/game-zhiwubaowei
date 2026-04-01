var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10ComponentBase = require("ComponentBase");
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10AnimationCfgMgr = require("AnimationCfgMgr");
var $10AnimationCtrl = require("AnimationCtrl");
var $10ShimmerWhite = require("ShimmerWhite");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10SkillDataMgr = require("SkillDataMgr");
var $10EnemyBulletBase = require("EnemyBulletBase");
var $10DizzinessEffect = require("DizzinessEffect");
var $10IceEffect = require("IceEffect");
var $10RushEffect = require("RushEffect");
var $10WeatherHeavyFog = require("WeatherHeavyFog");
var $10EnemyBoomDie = require("EnemyBoomDie");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_EnemyBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBody = null;
    e.mIsSpAni = false;
    e.mAnimCtrl = null;
    e.mAnimSp = null;
    e.mIsShoot = true;
    e.mEnemyBulletPb = null;
    e._isAnimReady = false;
    e.mMonsterId = 0;
    e._target = null;
    e._amimState = $10GameEnum.RoleState.Default;
    e._monsterCfg = null;
    e._enemyPathIdx = 0;
    e._maxHp = 0;
    e._nowHp = 0;
    e._enemyMovePaths = [];
    e._pathIdx = 0;
    e._moveDis = 0;
    e._dizzinessTime = 0;
    e._speedCutTime = 0;
    e._speedCutNum = 0;
    e._isBeTemptation = false;
    e._temptationTime = 0;
    e._iceTime = 0;
    e._atkNum = 0;
    e._dizzinessEffect = null;
    e._iceEffect = null;
    e._iceSpeedCut = 0;
    e._beFireNum = 0;
    e._hpProgress = null;
    e._isSpdAdd = false;
    e._rushEffect = null;
    e._atkAnimFrameNums = [];
    e._canAtk = true;
    e._atkSpd = 0;
    e._simulationPos = null;
    e._simulationTarget = null;
    e._simulationPathIdx = 0;
    e._simulationIsSpdAdd = false;
    e._isStartAtk = false;
    e._isAtkFinish = true;
    e._survivalTime = 0;
    e._hurtItemNodes = [];
    e._hitEffectNodes = [];
    e._isTop = false;
    e._isFlaser = false;
    e._flaserTime = 0;
    e._weatherData = null;
    e._strikeToFly = false;
    e.mDamageNumberObjects = [];
    e._strikeToFlyPos = null;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "weatherData", {
    set: function (t) {
      this._weatherData = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isTop", {
    get: function () {
      return this._isTop;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.getIsAllowAstrictMove = function () {
    return 1 == this.monsterCfg.type && 4006 != this.monsterCfg.id && !this.getIsDie();
  };
  Object.defineProperty(_ctor.prototype, "isBeTemptation", {
    set: function (t) {
      if (this.getIsAllowAstrictMove()) {
        this._isBeTemptation = t;
        this._temptationTime = 1;
        this.setEnemyColor();
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isBeFire", {
    set: function (t) {
      if (2 != this.monsterCfg.type) {
        if (t) {
          this._beFireNum++;
        } else {
          this._beFireNum--;
        }
        this.setEnemyColor();
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isSpdAdd", {
    get: function () {
      return this._isSpdAdd;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "moveDis", {
    get: function () {
      return this._moveDis;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "pathIdx", {
    get: function () {
      return this._pathIdx;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "enemyPathIdx", {
    get: function () {
      return this._enemyPathIdx;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "monsterCfg", {
    get: function () {
      return this._monsterCfg;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead && this._amimState != $10GameEnum.RoleState.BeBack) {
      if (this._dizzinessTime > 0) {
        this._dizzinessTime -= t, this._dizzinessTime <= 0 && (this._dizzinessTime = 0, this._iceTime <= 0 && (this.mIsSpAni ? this.mAnimSp.paused = false : this.mAnimCtrl.getComponent(cc.Animation).resume(), this._dizzinessEffect && this._dizzinessEffect.isValid && (this._dizzinessEffect.destroy(), this._dizzinessEffect.removeFromParent(), this._dizzinessEffect = null)), this.setEnemyColor());
      }
      if (this._iceTime > 0) {
        this._iceTime -= t, this._iceTime <= 0 && (this._iceTime = 0, this._dizzinessTime <= 0 && (this.mIsSpAni ? this.mAnimSp.paused = false : this.mAnimCtrl.getComponent(cc.Animation).resume(), this._iceEffect && this._iceEffect.isValid && (this._iceEffect.destroy(), this._iceEffect.removeFromParent(), this._iceEffect = null), this.setEnemyColor()));
      }
      if (this._isBeTemptation) {
        this._temptationTime -= t, this._temptationTime < 0 && (this._temptationTime = 0, this._isBeTemptation = false, this.setEnemyColor());
      }
      if (this._speedCutTime > 0) {
        this._speedCutTime -= t, this._speedCutTime <= 0 && (this._speedCutTime = 0, this._speedCutNum = 0, this.setEnemyColor());
      }
      if (this._isFlaser) {
        this._flaserTime -= t, this._flaserTime <= 0 && (this._isFlaser = false, cc.Tween.stopAllByTarget(this.mAnimCtrl.node), cc.tween(this.mAnimCtrl.node).to(.5, {
          scaleY: 1
        }).start());
      }
      this._survivalTime += t;
      if (this._survivalTime >= 10 && 4008 != this._monsterCfg.id && (this.node.x > 390 || this.node.x < -390 || this.node.y < -cc.winSize.height / 2 || this.node.y > cc.winSize.height)) {
        this.playDie(false);
      } else {
        this._iceTime > 0 || this._dizzinessTime > 0 || this._isBeTemptation || this._strikeToFly || (this.getIsBeResist() ? (this._canAtk || (this._atkSpd -= t, this._atkSpd <= 0 && (this._canAtk = true)), this._isAnimReady && (this.move(t), this.moveByRvo(t)), this.updateHpProgressPos()) : this.beResist());
      }
    }
  };
  _ctor.prototype.playStand = function () {};
  _ctor.prototype.getIsBeResist = function () {
    for (var t = 0; t < $10BattleDataProxy.battleDataProxy.nutWalNodes.length; ++t) {
      var e = $10BattleDataProxy.battleDataProxy.nutWalNodes[t];
      if ($10MathUtil.MathUtil.distance(e.position, this.node.position) <= 100) {
        return false;
      }
    }
    return true;
  };
  _ctor.prototype.beResist = function () {};
  _ctor.prototype.getIsCanMove = function () {
    return true;
  };
  _ctor.prototype.onDestroy = function () {
    this.removeHpProgress();
  };
  _ctor.prototype.removeHpProgress = function () {
    if (this._hpProgress && this._hpProgress.isValid) {
      this._hpProgress.destroy();
      this._hpProgress.removeFromParent();
      this._hpProgress = null;
    }
  };
  _ctor.prototype.initEndlessEnemy = function (t, e) {
    this._strikeToFly = false;
    this.mMonsterId = t.armyId;
    this._isTop = e;
    this._monsterCfg = $10DataManager.DataManager.instance.eData.datamonster[this.mMonsterId];
    this._isSpdAdd = true;
    this._atkNum = Math.floor(t.atk * this._monsterCfg.atk);
    this._nowHp = this._maxHp = Math.floor(t.hp * this._monsterCfg.hp);
    this.loadAnimation();
    this.addRushEffect();
    var o = $10BattleDataProxy.battleDataProxy.getEndlessEnemyMovePaths(e, this._monsterCfg.type);
    this._enemyMovePaths = o.movePath;
    this._pathIdx = o.idx;
    this._atkAnimFrameNums = "0" == this._monsterCfg.atkFrame ? [] : this._monsterCfg.atkFrame.split("|").map(Number);
    this._enemyPathIdx = 1;
    this.node.position = this._enemyMovePaths[0].position;
    this.node.x = 475;
    this._target = this._enemyMovePaths[this._enemyPathIdx];
    this.addHpProgress();
    4008 != this._monsterCfg.id && (this.node.scale = this.getScale());
  };
  _ctor.prototype.initEnemy = function (t) {
    this._strikeToFly = false;
    this.mMonsterId = t;
    var e = this.mMonsterId;
    this._monsterCfg = $10DataManager.DataManager.instance.eData.datamonster[e];
    this._survivalTime = 0;
    var o = $10BattleDataProxy.battleDataProxy.getEnemyMovePaths(this._monsterCfg.type);
    this._enemyMovePaths = o.movePath;
    this._pathIdx = o.idx;
    this.node.position = this._enemyMovePaths[0].position;
    this.node.x = 475;
    this._isSpdAdd = true;
    this._enemyPathIdx = 1;
    this._target = this._enemyMovePaths[this._enemyPathIdx];
    if ($10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE) {
      this._nowHp = this._maxHp = Math.floor($10BattleDataProxy.battleDataProxy.weatherStageInfo.hpRate * this._weatherData.hp * this._monsterCfg.hp);
      this._atkNum = Math.floor($10BattleDataProxy.battleDataProxy.weatherStageInfo.atkRate * this._weatherData.atk * this._monsterCfg.atk);
    } else {
      this._nowHp = this._maxHp = Math.floor($10BattleDataProxy.battleDataProxy.stageInfo.hp * this._monsterCfg.hp);
      var i = $10BattleDataProxy.battleDataProxy.getStageRewardCfg().Attribute.split("|");
      for (var n = 0; n < i.length; ++n) {
        var a = i[n].split("_").map(Number);
        if (2 == a[0]) {
          this._atkNum = Math.floor(this._atkNum * (1 + a[1]));
        } else {
          4 == a[0] && (this._maxHp = Math.floor(this._maxHp * (1 + a[1])));
        }
      }
      this._nowHp = this._maxHp;
      this._atkNum = Math.floor($10BattleDataProxy.battleDataProxy.stageInfo.atk * this._monsterCfg.atk);
      1 == $10UserDataProxy.userDataProxy.userData.curChapter && (this._atkNum = 1);
    }
    this._atkAnimFrameNums = "0" == this._monsterCfg.atkFrame ? [] : this._monsterCfg.atkFrame.split("|").map(Number);
    this.loadAnimation();
    this.addRushEffect();
    this.addHpProgress();
    4008 != this._monsterCfg.id && (this.node.scale = this.getScale());
  };
  _ctor.prototype.addRushEffect = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/item/RushEffect",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      if (t.node && t.node.isValid) {
        t._rushEffect = cc.instantiate(e);
        t.node.addChild(t._rushEffect, 1);
        t._rushEffect.position = cc.v3(0, 0);
        t._rushEffect.getComponent($10RushEffect.default).play();
      }
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.loadAnimation = function () {
    var t = this;
    this.mAnimCtrl.loadAtlasAnimation($10AnimationCfgMgr.AnimationCfgMgr.instance.getAnimationCfg(this._monsterCfg), true).then(function () {
      if (t.node && t.node.isValid) {
        t._isAnimReady = true;
        4005 == t.monsterCfg.id && $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemy4005", $10HomeEnum.Bundles.RES);
        t.playMove(10);
      }
    });
  };
  _ctor.prototype.getScale = function () {
    if (2 == this.monsterCfg.type) {
      return 1.5 * this.node.scale;
    } else {
      if (3 == this.monsterCfg.type) {
        return 1.45;
      } else {
        return 1;
      }
    }
  };
  _ctor.prototype.addHpProgress = function () {
    var t = this;
    1 != this.monsterCfg.type && $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/item/HpProgress",
      type: cc.Prefab
    }).then(function (e) {
      if (t.node && t.node.isValid) {
        t._hpProgress = cc.instantiate(e);
        $10BattleDataProxy.battleDataProxy.top1.addChild(t._hpProgress);
        t.updateHpProgressPos();
        t.updateHp();
      }
    });
  };
  _ctor.prototype.updateHpProgressPos = function () {
    this._hpProgress && (this._hpProgress.position = this.node.position.clone().add(cc.v3(0, this.node.height * this.node.scaleY + 10)));
  };
  _ctor.prototype.updateHp = function () {
    if (this._hpProgress) {
      var t = this._nowHp / this._maxHp;
      this._hpProgress.active = t < 1;
      this._hpProgress.getChildByName("Bar").getComponent(cc.Sprite).fillRange = t;
    }
  };
  _ctor.prototype.getIsDie = function () {
    return this._amimState == $10GameEnum.RoleState.Dead;
  };
  _ctor.prototype.playMove = function (t) {
    undefined === t && (t = 5);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      this._isAtkFinish = true;
      this.mAnimCtrl.playAnim("move", true, null, null, t);
    }
  };
  _ctor.prototype.playDie = function (t, e) {
    var o = this;
    undefined === t && (t = true);
    undefined === e && (e = false);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Dead;
      if (this.mIsSpAni) {
        this.mAnimSp.node.scaleY = 1;
        cc.Tween.stopAllByTarget(this.mAnimSp.node);
        this.mAnimSp.node.color = cc.color(255, 255, 255);
      } else {
        this.mAnimCtrl.node.scaleY = 1;
        cc.Tween.stopAllByTarget(this.mAnimCtrl.node);
        this.mAnimCtrl.node.color = cc.color(255, 255, 255);
      }
      $10BattleDataProxy.battleDataProxy.removeEnemyNode(this.node);
      if (t) {
        var i = this._monsterCfg.exp;
        var n = $10SkillDataMgr.default.instance.getSkillProperty(37, 0);
        i = Math.floor(i * (1 + n));
        $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.UPDATE_EXP, i);
      }
      if (4009 == this._monsterCfg.id) {
        var a = $10BattleDataProxy.battleDataProxy.airshipSoldier.indexOf(this.node);
        a >= 0 && $10BattleDataProxy.battleDataProxy.airshipSoldier.splice(a, 1);
      }
      this.removeHpProgress();
      if (e) {
        $10ResUtil.ResUtil.loadAsset({
          path: "prefabs/monster/EnemyBoomDie",
          type: cc.Prefab,
          bundleName: $10HomeEnum.Bundles.GAME
        }).then(function (t) {
          if (o.node && o.node.isValid) {
            var e = cc.instantiate(t);
            o.node.parent.addChild(e, o.node.zIndex);
            e.position = o.node.position;
            e.scaleX = -1 * o.node.scaleX;
            e.scaleY = o.node.scaleY;
            e.getComponent($10EnemyBoomDie.default).initEnemyBoomDie();
            o.node.destroy();
            o.node.removeFromParent();
          }
        }).catch(function (t) {
          console.log("error:", t);
        });
      } else {
        this.playDieAnim();
      }
    }
  };
  _ctor.prototype.playDieAnim = function () {
    var t = this;
    if (this.mIsSpAni) {
      this.mAnimSp.paused = false;
      return void this.mAnimSp.setAnimation(0, "die", false);
    }
    this.mAnimCtrl.getComponent(cc.Animation).resume();
    this.mAnimCtrl.playAnim("die", false, function () {
      t.node.destroy();
      t.node.removeFromParent();
    }, null, 2);
  };
  _ctor.prototype.playAtk = function () {
    var t = this;
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Attack;
      this._isStartAtk = true;
      var e = "atk";
      var o = this._atkAnimFrameNums[0];
      if (this._atkAnimFrameNums.length > 1) {
        var i = Math.floor(1e3 * Math.random()) % this._atkAnimFrameNums.length;
        e = "atk" + i;
        o = this._atkAnimFrameNums[i];
      }
      this.mAnimCtrl.playAnim(e, false, function () {
        t.playMove();
      }, null, 5);
      this.scheduleOnce(function () {
        t.openFire();
      }, o / 2 * .01);
    }
  };
  _ctor.prototype.openFire = function () {
    if (!this.getIsDie()) {
      if (this.mIsShoot) {
        var t = cc.instantiate(this.mEnemyBulletPb);
        $10BattleDataProxy.battleDataProxy.battleView.addChild(t, 1e3);
        var e;
        e = this.mIsSpAni ? this.mAnimSp.node.getChildByName("fireNode") : this.mAnimCtrl.node.getChildByName("fireNode");
        var o = $10Util.default.convertToTargetNodeSpace(e, t);
        t.position = o;
        t.getComponent($10EnemyBulletBase.default).initBullet(this._monsterCfg, this._atkNum, this._target.position.clone());
      } else {
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyAtk", $10HomeEnum.Bundles.RES);
        $10BattleDataProxy.battleDataProxy.updateHouseHp({
          isCirt: false,
          num: -this._atkNum
        });
      }
    }
  };
  _ctor.prototype.getMoveSpd = function (t, e) {
    e || (e = 0.016666666666666666);
    var o = this._monsterCfg.speed / 120;
    var i = $10SkillDataMgr.default.instance.getSkillProperty(30, 0);
    (o *= 1 - this._speedCutNum - i - this._iceSpeedCut) < 0 && (o = 0);
    t && (o *= 5);
    if (4010 != this._monsterCfg.id && !t) {
      var n = $10BattleDataProxy.battleDataProxy.enemyPathIce;
      var a = false;
      for (var r = 0; r < n.length; ++r) {
        if (n[r].getBoundingBox().contains(this.node.getPosition())) {
          a = true;
          break;
        }
      }
      a && (o *= 1.5);
    }
    this._isFlaser && (o *= .5);
    return o * (e / 0.016666666666666666);
  };
  _ctor.prototype.move = function (t) {
    var e;
    var o;
    if (this._target && this._target.isValid) {
      if (this.node && this.node.isValid && this._isAtkFinish && this._amimState != $10GameEnum.RoleState.Dead && this._amimState != $10GameEnum.RoleState.Attack && this._amimState != $10GameEnum.RoleState.BeBack) {
        var i = $10MathUtil.MathUtil.distance(this._target.position, this.node.position);
        var n = 3;
        $10BattleDataProxy.battleDataProxy.isEndless && (n = 2);
        if (this._enemyPathIdx == n && (null === (e = this._atkAnimFrameNums) || undefined === e ? undefined : e.length) > 0 && i <= this.monsterCfg.range) {
          if (this._canAtk) {
            this._canAtk = false;
            this._atkSpd = this.monsterCfg.atkSpeed;
            this.playAtk();
          }
        } else {
          var a = this.getMoveSpd(this._isSpdAdd, t);
          var r = this.node.position.clone().sub(this._target.position.clone()).normalize();
          this.node.x -= a * r.x;
          this.node.y -= a * r.y;
          if (this.mIsSpAni) {
            var s = Math.abs(this.mAnimSp.node.scaleX);
            this.mAnimSp.node.scaleX = r.x <= 0 ? s : -s;
          } else {
            s = Math.abs(this.mAnimCtrl.node.scaleX);
            this.mAnimCtrl.node.scaleX = r.x <= 0 ? s : -s;
          }
          this.node.zIndex = -this.node.y;
          if (i <= a) {
            this._enemyPathIdx++;
            this._target = this._enemyMovePaths[this._enemyPathIdx];
            this._target || this.moveToHouse();
          }
          this._isSpdAdd && this.node.x <= (null === (o = this.node.parent) || undefined === o ? undefined : o.width) / 2 - 100 && this.removeRushEffect();
          this._moveDis += a;
        }
      }
    } else {
      this._target = null;
    }
  };
  _ctor.prototype.removeRushEffect = function () {
    this._isSpdAdd = false;
    if (this.mIsSpAni) {
      this.mAnimSp.timeScale = 1;
    } else {
      this.mAnimCtrl.setSpeed(5);
    }
    if (this._rushEffect && this._rushEffect.isValid) {
      this._rushEffect.destroy();
      this._rushEffect.removeFromParent();
      this._rushEffect = null;
    }
  };
  _ctor.prototype.moveToHouse = function () {
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyAtk", $10HomeEnum.Bundles.RES);
    $10BattleDataProxy.battleDataProxy.updateHouseHp({
      isCirt: false,
      num: -this._atkNum
    });
    this.playDie(false);
  };
  _ctor.prototype.moveByRvo = function () {};
  _ctor.prototype.getIsMiss = function (t) {
    var e;
    var o;
    if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.HeavyFog && 15 != t && 14 != t && 10005 != t && 10009 != t && 10011 != t && 10012 != t) {
      var i;
      var n = false;
      i = this.node.y >= 150 ? (null === (e = $10BattleDataProxy.battleDataProxy.weatherHeavyFog.getComponent($10WeatherHeavyFog.default)) || undefined === e ? undefined : e.mCheckTopHeavyFogs) || [] : (null === (o = $10BattleDataProxy.battleDataProxy.weatherHeavyFog.getComponent($10WeatherHeavyFog.default)) || undefined === o ? undefined : o.mCheckDownHeavyFogs) || [];
      var a = this.node.getChildByName("collision").getComponent($10SimplyRectCollider.default);
      for (var r = 0; r < i.length; ++r) {
        var s = i[r];
        var c = null == s ? undefined : s.getComponent($10SimplyRectCollider.default);
        if (c && $10SimplyCollisionDetector.default.isCollisionRectToRect(a.rect, c.rect)) {
          n = true;
          break;
        }
      }
      if (n && Math.floor(1e3 * Math.random()) % 100 < 50) {
        return true;
      }
    }
    return false;
  };
  _ctor.prototype.beAttack = function (t, e, o, i) {
    var n;
    var a;
    undefined === o && (o = false);
    undefined === i && (i = true);
    return !($10BattleDataProxy.battleDataProxy.battleData.houseHp <= 0 || this._monsterCfg && this._amimState != $10GameEnum.RoleState.Dead && (this.getIsMiss(e) ? (this.showMiss(), 1) : (4010 == this._monsterCfg.id && 102 == e && (t.num *= 5), this.subHp(t.num), i && this.showHurtLab(t.num, t.isCrit), this.updateHp(), $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyHit", $10HomeEnum.Bundles.RES), this._nowHp <= 0 ? (this.playDie(true, o), 0) : (this.mAnimCtrl && (null === (n = this.mAnimCtrl.getComponent($10ShimmerWhite.default)) || undefined === n || n.show()), this.mAnimSp && (null === (a = this.mAnimSp.getComponent($10ShimmerWhite.default)) || undefined === a || a.show()), 1))));
  };
  _ctor.prototype.subHp = function (t) {
    isNaN(t) && (t = 1);
    this._nowHp -= t;
    isNaN(this._nowHp) && (this._nowHp = 10);
    this._nowHp < 0 && (this._nowHp = 0);
  };
  _ctor.prototype.showHurtLab = function (t, e) {
    var o = this.node.position;
    o.y += this.mBody ? this.mBody.height + 30 : this.node.height + 30;
    $10Util.default.showHurt(Math.ceil(t), e ? $10Util.HurtType.CRIT : $10Util.HurtType.NORMAL, o, this, $10BattleDataProxy.battleDataProxy.numberView, this.node);
  };
  _ctor.prototype.showMiss = function () {
    var t = this.node.position;
    t.y += this.mBody ? this.mBody.height + 30 : this.node.height + 30;
    $10Util.default.showMiss(t, this, $10BattleDataProxy.battleDataProxy.numberView, this.node);
  };
  _ctor.prototype.dizziness = function (t) {
    var e = this;
    undefined === t && (t = 2);
    if (this.getIsAllowAstrictMove() && !this._isSpdAdd && (this._dizzinessTime = t, t > 0)) {
      if (this.mIsSpAni) {
        this.mAnimSp.paused = true;
      } else {
        this.mAnimCtrl.getComponent(cc.Animation).pause();
      }
      if (this._dizzinessEffect) {
        return;
      }
      $10ResUtil.ResUtil.loadAsset({
        path: "prefabs/item/DizzinessEffect",
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        e.node && e.node.isValid && (e._dizzinessEffect || (e._dizzinessEffect = cc.instantiate(t), e.node.addChild(e._dizzinessEffect, 1), e._dizzinessEffect.position = cc.v3(0, e.node.height), e._dizzinessEffect.getComponent($10DizzinessEffect.default).play()));
      }).catch(function (t) {
        console.log("error:", t);
      });
    }
  };
  _ctor.prototype.speedCut = function (t, e) {
    1 == this.monsterCfg.type && (t <= 0 || (this._speedCutTime = t, this._speedCutNum = e, this.setEnemyColor()));
  };
  _ctor.prototype.ice = function (t) {
    var e = this;
    undefined === t && (t = 3);
    if (this.getIsAllowAstrictMove() && !this._isSpdAdd && (this._iceTime = t, t > 0)) {
      if (this.mIsSpAni) {
        this.mAnimSp.paused = true;
      } else {
        this.mAnimCtrl.getComponent(cc.Animation).pause();
      }
      if (this._iceEffect) {
        return;
      }
      $10ResUtil.ResUtil.loadAsset({
        path: "prefabs/item/IceEffect",
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        e.node && e.node.isValid && (e._iceEffect || (e._iceEffect = cc.instantiate(t), e.node.addChild(e._iceEffect, 1), e._iceEffect.position = cc.v3(0, 0), e._iceEffect.getComponent($10IceEffect.default).play()));
      }).catch(function (t) {
        console.log("error:", t);
      });
    }
  };
  _ctor.prototype.iceSpeedCut = function () {
    if (1 == this.monsterCfg.type) {
      this._iceSpeedCut = .2;
      this.setEnemyColor();
    }
  };
  _ctor.prototype.pushDamageNumberObject = function (t) {
    if (this.mDamageNumberObjects) {
      this.damageNumberObjectActive();
      this.mDamageNumberObjects.push(t);
    }
  };
  _ctor.prototype.removeDamageNumberObject = function (t) {
    if (this.mDamageNumberObjects) {
      for (var e = 0; e < this.mDamageNumberObjects.length; ++e) {
        if (this.mDamageNumberObjects[e] == t) {
          this.mDamageNumberObjects.splice(e, 1);
          break;
        }
      }
    }
  };
  _ctor.prototype.damageNumberObjectActive = function () {
    if (this.mDamageNumberObjects) {
      for (var t = 0; t < this.mDamageNumberObjects.length; ++t) {
        var e = this.mDamageNumberObjects[t];
        var o = cc.moveBy(.1, cc.v2(0, 30));
        e && e.isValid && e.node.runAction(o);
      }
    }
  };
  _ctor.prototype.updateHurtItemNode = function (t) {
    this._hurtItemNodes.push(t);
    if (this._hurtItemNodes.length > 3) {
      var e = this._hurtItemNodes[0];
      if (e && e.isValid) {
        cc.Tween.stopAllByTarget(e);
        $10NodePoolManager.default.instance.putNode(e);
        this._hurtItemNodes.splice(0, 1);
      }
    }
  };
  _ctor.prototype.removeHurtItemNode = function (t) {
    for (var e = 0; e < this._hurtItemNodes.length; ++e) {
      if (t == this._hurtItemNodes[e]) {
        this._hurtItemNodes.splice(e, 1);
        break;
      }
    }
  };
  _ctor.prototype.updateHitEffectNodes = function (t, e) {
    var o = this._hitEffectNodes.findIndex(function (t) {
      return t.plantId == e;
    });
    if (o < 0) {
      this._hitEffectNodes.push({
        plantId: e,
        hitNodes: [t]
      });
    } else {
      this._hitEffectNodes[o].hitNodes.push(t);
      if (this._hitEffectNodes[o].hitNodes.length > 3) {
        var i = this._hitEffectNodes[o].hitNodes[0];
        if (i && i.isValid) {
          cc.Tween.stopAllByTarget(i);
          i.destroy();
          i.removeFromParent();
          this._hitEffectNodes[o].hitNodes.splice(0, 1);
        }
      }
    }
  };
  _ctor.prototype.removeHitEffectNode = function (t, e) {
    var o = this._hitEffectNodes.findIndex(function (t) {
      return t.plantId == e;
    });
    if (o >= 0) {
      var i = this._hitEffectNodes[o].hitNodes.indexOf(t);
      i >= 0 && this._hitEffectNodes[o].hitNodes.splice(i, 1);
    }
  };
  _ctor.prototype.setEnemyColor = function () {
    if (!this.getIsDie()) {
      var t = this.mIsSpAni ? this.mAnimSp : this.mAnimCtrl;
      if ((null == t ? undefined : t.node) && (null == t ? undefined : t.node.isValid)) {
        if (this._isBeTemptation) {
          t.node.color = cc.color("#FB35E7");
        } else if (this._iceSpeedCut > 0 || this._speedCutTime > 0) {
          t.node.color = cc.color("#469BFF");
        } else if (this._beFireNum > 0) {
          t.node.color = cc.color("#FF004C");
        } else {
          t.node.color = cc.color(255, 255, 255);
        }
      }
    }
  };
  _ctor.prototype.flaser = function () {
    this.getIsDie() || 1 == this.monsterCfg.type && (this._isFlaser = true, this.mIsSpAni ? (this.mAnimSp.node.scaleY = .2, cc.Tween.stopAllByTarget(this.mAnimSp.node), cc.tween(this.mAnimSp.node).to(.5, {
      scaleY: 1
    }).start()) : (this.mAnimCtrl.node.scaleY = .2, this._flaserTime = 1));
  };
  _ctor.prototype.getIsCanChoose = function () {
    return true;
  };
  _ctor.prototype.initSimulationData = function () {
    this._simulationPos = this.node.position;
    this._simulationTarget = this._target;
    this._simulationPathIdx = this._enemyPathIdx;
    this._simulationIsSpdAdd = this.isSpdAdd;
  };
  _ctor.prototype.getMovePosByTime = function (t) {
    if (this._strikeToFlyPos) {
      return this._strikeToFlyPos;
    }
    var e = Math.floor(30 * t);
    if (this._isStartAtk) {
      return cc.v3(this._simulationPos.x, this._simulationPos.y + this.node.height);
    }
    if (!this._simulationTarget) {
      return this.node.position;
    }
    for (var o = 0; o < e; ++o) {
      var i = 2 * this.getMoveSpd(this._simulationIsSpdAdd, 0.016666666666666666);
      var n = $10MathUtil.MathUtil.distance(this._simulationTarget.position, this._simulationPos);
      var a = this._simulationPos.clone().sub(this._simulationTarget.position.clone()).normalize();
      this._simulationPos.x -= i * a.x;
      this._simulationPos.y -= i * a.y;
      this._simulationIsSpdAdd && this._simulationPos.x <= this.node.parent.width / 2 - 100 && (this._simulationIsSpdAdd = false);
      if (n <= i && (this._simulationPathIdx++, this._simulationTarget = this._enemyMovePaths[this._simulationPathIdx], !this._simulationTarget)) {
        break;
      }
    }
    return cc.v3(this._simulationPos.x, this._simulationPos.y + this.node.height);
  };
  _ctor.prototype.strikeToFly = function () {
    var t = this;
    if (!this.getIsDie() && 1 == this.monsterCfg.type) {
      this._strikeToFly = true;
      var e = this.node.position.clone();
      var o = cc.v3(this.node.x, this.node.y + 300);
      cc.Tween.stopAllByTarget(this.node);
      this._strikeToFlyPos = this.node.position.clone();
      cc.tween(this.node).to(.75, {
        position: o
      }, {
        easing: "sineOut"
      }).to(.75, {
        position: e
      }, {
        easing: "sineIn"
      }).call(function () {
        t._strikeToFly = false;
        t._strikeToFlyPos = null;
      }).start();
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBody", undefined);
  cc__decorate([ccp_property()], _ctor.prototype, "mIsSpAni", undefined);
  cc__decorate([ccp_property({
    type: $10AnimationCtrl.default,
    tooltip: "是否展示Img",
    visible: function () {
      return !this.mIsSpAni;
    }
  })], _ctor.prototype, "mAnimCtrl", undefined);
  cc__decorate([ccp_property({
    type: sp.Skeleton,
    tooltip: "是否展示spine",
    visible: function () {
      return this.mIsSpAni;
    }
  })], _ctor.prototype, "mAnimSp", undefined);
  cc__decorate([ccp_property()], _ctor.prototype, "mIsShoot", undefined);
  cc__decorate([ccp_property({
    type: cc.Prefab,
    tooltip: "是否有子弹预制体",
    visible: function () {
      return this.mIsShoot;
    }
  })], _ctor.prototype, "mEnemyBulletPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComponentBase.ComponentBase);
exports.default = def_EnemyBase;