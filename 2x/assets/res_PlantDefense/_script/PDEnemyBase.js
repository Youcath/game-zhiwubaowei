var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__values = __values;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10DizzinessEffect = require("DizzinessEffect");
var $10IceEffect = require("IceEffect");
var $10AudioManager = require("AudioManager");
var $10ComponentBase = require("ComponentBase");
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10AnimationCfgMgr = require("AnimationCfgMgr");
var $10AnimationCtrl = require("AnimationCtrl");
var $10ShimmerWhite = require("ShimmerWhite");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10NodePoolManager = require("NodePoolManager");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10Util = require("Util");
var $10PDGameMgr = require("PDGameMgr");
var $10PDPlantBase = require("PDPlantBase");
var $10PDEnemyBoomDie = require("PDEnemyBoomDie");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDEnemyBase = function (t) {
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
    e._endTarget = null;
    e._amimState = $10GameEnum.RoleState.Default;
    e._monsterCfg = null;
    e._enemyPathIdx = 0;
    e._maxHp = 0;
    e._nowHp = 0;
    e._pathIdx = 0;
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
    e._isStartAtk = false;
    e._isAtkFinish = true;
    e._survivalTime = 0;
    e._hurtItemNodes = [];
    e._hitEffectNodes = [];
    e._isFlaser = false;
    e._flaserTime = 0;
    e._stageData = null;
    e.mDamageNumberObjects = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.getIsAllowAstrictMove = function () {
    return 4006 != this.monsterCfg.id && !this.getIsDie();
  };
  Object.defineProperty(_ctor.prototype, "isBeTemptation", {
    set: function (t) {
      if (this.getIsAllowAstrictMove()) {
        this._isBeTemptation = t;
        this._temptationTime = 2;
        this.setEnemyColor();
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isBeFire", {
    set: function (t) {
      if (t) {
        this._beFireNum++;
      } else {
        this._beFireNum--;
      }
      this.setEnemyColor();
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
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead && this._amimState != $10GameEnum.RoleState.BeBack) {
      if (this._dizzinessTime > 0) {
        this._dizzinessTime -= t;
        if (this._dizzinessTime <= 0) {
          this._dizzinessTime = 0, this._iceTime <= 0 && (this.mIsSpAni ? this.mAnimSp.paused = false : this.mAnimCtrl.getComponent(cc.Animation).resume(), this._dizzinessEffect && this._dizzinessEffect.isValid && (this._dizzinessEffect.destroy(), this._dizzinessEffect.removeFromParent(), this._dizzinessEffect = null)), this.setEnemyColor();
        }
      }
      if (this._iceTime > 0) {
        this._iceTime -= t;
        if (this._iceTime <= 0) {
          this._iceTime = 0, this._dizzinessTime <= 0 && (this.mIsSpAni ? this.mAnimSp.paused = false : this.mAnimCtrl.getComponent(cc.Animation).resume(), this._iceEffect && this._iceEffect.isValid && (this._iceEffect.destroy(), this._iceEffect.removeFromParent(), this._iceEffect = null), this.setEnemyColor());
        }
      }
      if (this._isBeTemptation) {
        this._temptationTime -= t;
        if (this._temptationTime < 0) {
          this._temptationTime = 0, this._isBeTemptation = false, this.setEnemyColor();
        }
      }
      if (this._speedCutTime > 0) {
        this._speedCutTime -= t;
        if (this._speedCutTime <= 0) {
          this._speedCutTime = 0, this._speedCutNum = 0, this.setEnemyColor();
        }
      }
      if (this._isFlaser && (this._flaserTime -= t, this._flaserTime <= 0)) {
        this._isFlaser = false;
        cc.Tween.stopAllByTarget(this.mAnimCtrl.node);
        var e = this.mAnimCtrl.node.scaleX > 0 ? 1 : -1;
        cc.tween(this.mAnimCtrl.node).to(.1, {
          scaleX: 1.4 * e
        }).to(.2, {
          scaleX: 1 * e
        }).start();
      }
      if (!(this._iceTime > 0 || this._dizzinessTime > 0 || this._isBeTemptation)) {
        if (!this._canAtk) {
          this._atkSpd -= t, this._atkSpd <= 0 && (this._canAtk = true);
        }
        this._isAnimReady && this.move(t);
        this.updateHpProgressPos();
      }
    }
  };
  _ctor.prototype.playStand = function () {};
  _ctor.prototype.getIsCanMove = function () {
    return true;
  };
  _ctor.prototype.onDisable = function () {
    var t = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.indexOf(this.node);
    if (-1 != t) {
      $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.splice(t, 1);
      $10EventManager.EventManager.instance.emit($10PlantDefenseDataProxy.PDDataEvent.CHECK_GAME_END);
    }
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
  _ctor.prototype.initEnemy = function (t, e) {
    this._stageData = t;
    this.mMonsterId = t.armyId;
    e && (this.mMonsterId += 1);
    this._monsterCfg = $10DataManager.DataManager.instance.eData.data_zombiemonster[this.mMonsterId];
    this._pathIdx = t.line;
    this._atkNum = Math.floor(t.atk * this._monsterCfg.atk);
    this._nowHp = this._maxHp = Math.floor(t.hp * this._monsterCfg.hp);
    this.loadAnimation();
    this._atkAnimFrameNums = "0" == this._monsterCfg.atkFrame ? [] : this._monsterCfg.atkFrame.split("|").map(Number);
    e || (this.node.position = $10PlantDefenseDataProxy.plantDefenseDataProxy.pathView.getChildByName("startPoint" + this._pathIdx).position);
    this._endTarget = $10PlantDefenseDataProxy.plantDefenseDataProxy.pathView.getChildByName("endPoint" + this._pathIdx);
    this._target = this._endTarget;
    4008 != this._monsterCfg.id && (this.node.scale = this.getScale());
  };
  _ctor.prototype.loadAnimation = function () {
    var t = this;
    var e = $10DataManager.DataManager.instance.eData.datamonster[this.mMonsterId];
    this.mAnimCtrl.loadAtlasAnimation($10AnimationCfgMgr.AnimationCfgMgr.instance.getAnimationCfg(e), true).then(function () {
      if (t.node && t.node.isValid) {
        t._isAnimReady = true;
        4005 == t.monsterCfg.id && $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemy4005", $10HomeEnum.Bundles.RES);
        t.playMove();
      }
    });
  };
  _ctor.prototype.getScale = function () {
    if (2 == this.monsterCfg.type) {
      return 1.8;
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
        $10PlantDefenseDataProxy.plantDefenseDataProxy.topLayer.addChild(t._hpProgress);
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
    var n = this;
    undefined === t && (t = true);
    undefined === e && (e = false);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Dead;
      if (this.mIsSpAni) {
        var o = this.mAnimSp.node.scaleX > 0 ? 1 : -1;
        this.mAnimSp.node.scaleX = o;
        cc.Tween.stopAllByTarget(this.mAnimSp.node);
        this.mAnimSp.node.color = cc.color(255, 255, 255);
      } else {
        o = this.mAnimCtrl.node.scaleX > 0 ? 1 : -1;
        this.mAnimCtrl.node.scaleX = o;
        cc.Tween.stopAllByTarget(this.mAnimCtrl.node);
        this.mAnimCtrl.node.color = cc.color(255, 255, 255);
      }
      this.removeHpProgress();
      if (e) {
        $10ResUtil.ResUtil.loadAsset({
          path: "prefabs/monsters/PDEnemyBoomDie",
          type: cc.Prefab,
          bundleName: $10HomeEnum.Bundles.PlantDefense
        }).then(function (t) {
          if (n.node && n.node.isValid) {
            var e = cc.instantiate(t);
            n.node.parent.addChild(e, n.node.zIndex);
            e.position = n.node.position;
            e.scaleX = -1 * n.node.scaleX;
            e.scaleY = n.node.scaleY;
            e.getComponent($10PDEnemyBoomDie.default).initEnemyBoomDie();
            if (n.node && n.node.isValid) {
              n.node.destroy();
              n.node.removeFromParent();
            }
          }
        }).catch(function (t) {
          console.log("error:", t);
        });
      } else {
        this.playDieAnim();
      }
      setTimeout(function () {
        if (n.node && n.node.isValid) {
          n.node.destroy();
          n.node.removeFromParent();
        }
      }, 3e3);
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
      if (t.node && t.node.isValid) {
        t.node.destroy();
        t.node.removeFromParent();
      }
    }, null, 2);
  };
  _ctor.prototype.playAtk = function () {
    var t = this;
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Attack;
      this._isStartAtk = true;
      var e = "atk";
      var n = this._atkAnimFrameNums[0];
      if (this._atkAnimFrameNums.length > 1) {
        var o = Math.floor(1e3 * Math.random()) % this._atkAnimFrameNums.length;
        e = "atk" + o;
        n = this._atkAnimFrameNums[o];
        this.mAnimCtrl.playAnim(e, false, function () {
          t.playMove();
        }, null, 5);
      } else {
        this.playMove();
      }
      this.scheduleOnce(function () {
        t.openFire();
      }, n / 2 * .01);
    }
  };
  _ctor.prototype.openFire = function () {
    if (!this.getIsDie() && ($10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyAtk", $10HomeEnum.Bundles.RES), this._target && this._target !== this._endTarget)) {
      var t = this._target.getComponent($10PDPlantBase.default);
      if (t) {
        return void t.beAttack(this._atkNum);
      }
    }
  };
  _ctor.prototype.getMoveSpd = function (t, e) {
    e || (e = 0.016666666666666666);
    var n = this._monsterCfg.speed / 120;
    (n *= 1 - this._speedCutNum - 0 - this._iceSpeedCut) < 0 && (n = 0);
    t && (n *= 5);
    if (4010 != this._monsterCfg.id && !t) {
      var o = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemyPathIce;
      var i = false;
      for (var a = 0; a < o.length; ++a) {
        var r = o[a];
        if (r && r.isValid) {
          var s = r.getBoundingBox();
          if (s && s.contains(this.node.getPosition())) {
            i = true;
            break;
          }
        }
      }
      i && (n *= 1.5);
    }
    this._isFlaser && (n *= .5);
    return n * (e / 0.016666666666666666);
  };
  _ctor.prototype.move = function (t) {
    var e;
    var n;
    var o = this;
    this._target && this._target.isValid || (this._target = this._endTarget);
    if (this.node && this.node.isValid && this._isAtkFinish && this._amimState != $10GameEnum.RoleState.Dead && this._amimState != $10GameEnum.RoleState.Attack && this._amimState != $10GameEnum.RoleState.BeBack) {
      if (this._nowHp < 1) {
        cc.log("死亡没有移除怪物，异常处理");
        this.playDie();
      }
      var i = $10PlantDefenseDataProxy.plantDefenseDataProxy.soldiers.filter(function (t) {
        var e = t.getComponent($10PDPlantBase.default);
        return !!e && e.col + 1 === o._pathIdx;
      });
      if (i.length > 0) {
        var a = null;
        var s = 35;
        try {
          var l = cc__values(i);
          for (var c = l.next(); !c.done; c = l.next()) {
            var p = c.value;
            var h = $10MathUtil.MathUtil.distance(this.node.position, p.position);
            if (h < s) {
              s = h;
              a = p;
            }
          }
        } catch (D) {
          e = {
            error: D
          };
        } finally {
          try {
            c && !c.done && (n = l.return) && n.call(l);
          } finally {
            if (e) {
              throw e.error;
            }
          }
        }
        a && (this._target = a);
      } else {
        this._target = this._endTarget;
      }
      if (this._target && this._target !== this._endTarget) {
        if ($10MathUtil.MathUtil.distance(this._target.position, this.node.position) <= Math.max(this.monsterCfg.range, 80)) {
          return void (this._canAtk && (this._canAtk = false, this._atkSpd = this.monsterCfg.atkspeed, this.playAtk()));
        }
        var m = this.getMoveSpd(this._isSpdAdd, t);
        var f = this.node.position.clone().sub(this._target.position.clone()).normalize();
        this.node.x -= m * f.x;
        this.node.y -= m * f.y;
        if (this.mIsSpAni) {
          var y = Math.abs(this.mAnimSp.node.scaleX);
          this.mAnimSp.node.scaleX = f.x <= 0 ? y : -y;
        } else {
          y = Math.abs(this.mAnimCtrl.node.scaleX);
          this.mAnimCtrl.node.scaleX = f.x <= 0 ? y : -y;
        }
        this.node.zIndex = -(this.node.y + 35);
      } else if ($10MathUtil.MathUtil.distance(this._endTarget.position, this.node.position) <= 10) {
        $10EventManager.EventManager.instance.emit($10PlantDefenseDataProxy.PDDataEvent.GAME_OVER, false);
      } else {
        var P = this.getMoveSpd(this._isSpdAdd, t);
        var v = this.node.position.clone().sub(this._endTarget.position.clone()).normalize();
        this.node.x -= P * v.x;
        this.node.y -= P * v.y;
        if (this.mIsSpAni) {
          y = Math.abs(this.mAnimSp.node.scaleX);
          this.mAnimSp.node.scaleX = v.x <= 0 ? y : -y;
        } else {
          y = Math.abs(this.mAnimCtrl.node.scaleX);
          this.mAnimCtrl.node.scaleX = v.x <= 0 ? y : -y;
        }
        this.node.zIndex = -(this.node.y + 35);
      }
    }
  };
  _ctor.prototype.beAttack = function (t, e, n, o) {
    var i;
    var a;
    undefined === n && (n = false);
    undefined === o && (o = false);
    return !this._monsterCfg || this._amimState == $10GameEnum.RoleState.Dead || (this.subHp(t.num), o && this.showHurtLab(t.num, t.isCrit), this.updateHp(), $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyHit", $10HomeEnum.Bundles.RES), this._nowHp <= 0 ? (this.playDie(true, n), true) : (this.mAnimCtrl && (null === (i = this.mAnimCtrl.getComponent($10ShimmerWhite.default)) || undefined === i || i.show()), this.mAnimSp && (null === (a = this.mAnimSp.getComponent($10ShimmerWhite.default)) || undefined === a || a.show()), false));
  };
  _ctor.prototype.subHp = function (t) {
    isNaN(t) && (t = 1);
    this._nowHp -= t;
    isNaN(this._nowHp) && (this._nowHp = 10);
    this._nowHp < 0 && (this._nowHp = 0);
  };
  _ctor.prototype.showHurtLab = function (t, e) {
    var n = this.node.position;
    n.y += this.mBody ? this.mBody.height + 30 : this.node.height + 30;
    $10PDGameMgr.default.Inst.showHurt(Math.ceil(t), e ? $10Util.HurtType.CRIT : $10Util.HurtType.NORMAL, n, this, $10PlantDefenseDataProxy.plantDefenseDataProxy.effectLayer, this.node);
  };
  _ctor.prototype.showMiss = function () {};
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
    if (!(t <= 0)) {
      this._speedCutTime = t;
      this._speedCutNum = e;
      this.setEnemyColor();
    }
  };
  _ctor.prototype.beBack = function (t, e) {
    var n = this;
    undefined === t && (t = 50);
    undefined === e && (e = .5);
    if (this._amimState !== $10GameEnum.RoleState.BeBack && this._amimState !== $10GameEnum.RoleState.Dead) {
      this._amimState = $10GameEnum.RoleState.BeBack;
      var o = cc.v3(0, 1, 0);
      var i = this.node.position.add(o.mul(t));
      cc.tween(this.node).to(e, {
        position: i
      }).call(function () {
        n._amimState = $10GameEnum.RoleState.Move;
        n.playMove();
      }).start();
    }
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
        var n = cc.moveBy(.1, cc.v2(0, 30));
        e && e.isValid && e.node && e.node.runAction(n);
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
    var n = this._hitEffectNodes.findIndex(function (t) {
      return t.plantId == e;
    });
    if (n < 0) {
      this._hitEffectNodes.push({
        plantId: e,
        hitNodes: [t]
      });
    } else {
      this._hitEffectNodes[n].hitNodes.push(t);
      if (this._hitEffectNodes[n].hitNodes.length > 3) {
        var o = this._hitEffectNodes[n].hitNodes[0];
        if (o && o.isValid) {
          cc.Tween.stopAllByTarget(o);
          o.destroy();
          o.removeFromParent();
          this._hitEffectNodes[n].hitNodes.splice(0, 1);
        }
      }
    }
  };
  _ctor.prototype.removeHitEffectNode = function (t, e) {
    var n = this._hitEffectNodes.findIndex(function (t) {
      return t.plantId == e;
    });
    if (n >= 0) {
      var o = this._hitEffectNodes[n].hitNodes.indexOf(t);
      o >= 0 && this._hitEffectNodes[n].hitNodes.splice(o, 1);
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
    if (!this.getIsDie()) {
      this._isFlaser = true;
      if (this.mIsSpAni) {
        this.mAnimSp.node.scaleY = .2, cc.Tween.stopAllByTarget(this.mAnimSp.node), cc.tween(this.mAnimSp.node).to(.5, {
          scaleY: 1
        }).start();
      } else {
        this.mAnimCtrl.node.scaleX = .2, this._flaserTime = 1, cc.Tween.stopAllByTarget(this.mAnimCtrl.node);
      }
    }
  };
  _ctor.prototype.beLawnMowerAttack = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/plant9", $10HomeEnum.Bundles.RES);
      this.playDie();
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
exports.default = def_PDEnemyBase;