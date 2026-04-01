var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__values = __values;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10CommonUtil = require("CommonUtil");
var $10ResUtil = require("ResUtil");
var $10PopupManager = require("PopupManager");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10Util = require("Util");
var $10PDSumPlant = require("PDSumPlant");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDBottomLayerCtl = require("PDBottomLayerCtl");
var $10PDCameraCtl = require("PDCameraCtl");
var $10PDGameMgr = require("PDGameMgr");
var $10PDPlantBase = require("PDPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDBattleView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mMonsterShow = null;
    e.mGameCamera = null;
    e.testNode = null;
    e.waveLabel = null;
    e.stageEnemyList = [];
    e.gameTime = 0;
    e.currentWave = 1;
    e.nextWaveTime = 0;
    e.currentWaveEnemies = [];
    e.enemySpawnedCount = new Map();
    e.nextSpawnTime = new Map();
    e.currentWaveSpawned = false;
    e.waveEnemiesMap = new Map();
    e.activeEnemyIndices = [];
    e.allEnemiesSpawned = false;
    e._sumTimer = 10;
    e._sumTimeInter = 1;
    e._sumNum = 0;
    e._sunParams = [];
    e.maxWave = 0;
    e._checkOverTime = 5;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      this.gameTime += t;
      this.updateAudioFilter(t);
      this.updateSunGeneration(t);
      if (this.allEnemiesSpawned) {
        this._checkOverTime -= t;
        return void (this._checkOverTime <= 0 && (this.checkGameEnd(), this._checkOverTime = 5));
      }
      if (!this.allEnemiesSpawned) {
        this.updateCurrentWaveEnemySpawn();
        this.checkNextWave();
        !this.allEnemiesSpawned && this.isAllEnemiesSpawned() && (this.allEnemiesSpawned = true);
      }
    }
  };
  _ctor.prototype.updateAudioFilter = function (t) {
    var e = $10BattleDataProxy.battleDataProxy.audioFilterInfo;
    for (var n in e) {
      e[n].time -= t;
    }
  };
  _ctor.prototype.updateSunGeneration = function (t) {
    this._sumTimeInter > 0 && (this._sumTimeInter -= t);
    if (this._sumTimeInter <= 0) {
      this.creatorSum();
      this._sumTimeInter = this._sumTimer;
    }
  };
  _ctor.prototype.checkNextWave = function () {
    this.currentWaveSpawned && this.gameTime >= this.nextWaveTime && this.startNextWave();
  };
  _ctor.prototype.updateWaveLabel = function () {
    var t = this.currentWave;
    t < 1 && (t = 1);
    this.waveLabel.string = "波次" + t + "/" + this.maxWave;
  };
  _ctor.prototype.startNextWave = function () {
    this.currentWave++;
    this.currentWaveEnemies = this.waveEnemiesMap.get(this.currentWave) || [];
    if (0 !== this.currentWaveEnemies.length) {
      this.updateWaveLabel();
      this.currentWaveSpawned = false;
      this.enemySpawnedCount.clear();
      this.nextSpawnTime.clear();
      this.activeEnemyIndices = [];
      for (var t = 0; t < this.currentWaveEnemies.length; t++) {
        this.activeEnemyIndices.push(t);
      }
      this.currentWave == this.maxWave && this.showBossTips();
      this.gameTime = 0;
      this.nextWaveTime = this.gameTime + Number($10DataManager.DataManager.instance.eData.datapara[115].num);
      console.log("开始第" + this.currentWave + "波，敌人数量：" + this.currentWaveEnemies.length);
    } else {
      this.allEnemiesSpawned = true;
    }
  };
  _ctor.prototype.showBossTips = function () {
    var t = cc.find("Canvas/Game/bossTips");
    t.active = true;
    t.scale = 1;
    cc.Tween.stopAllByTarget(t);
    $10PDGameMgr.default.Inst.playAudioBGM("jslx");
    var e = cc.tween(t).to(.3, {
      scale: 1.3
    }).to(.3, {
      scale: 1
    });
    cc.tween(t).repeat(3, e).call(function () {
      t.active = false;
      $10PDGameMgr.default.Inst.playAudioBGM("boss");
    }).start();
  };
  _ctor.prototype.updateCurrentWaveEnemySpawn = function () {
    if (!this.currentWaveSpawned && 0 !== this.activeEnemyIndices.length) {
      for (var t = this.activeEnemyIndices.length - 1; t >= 0; t--) {
        var e = this.activeEnemyIndices[t];
        var n = this.currentWaveEnemies[e];
        var o = n.id;
        var i = this.enemySpawnedCount.get(o) || 0;
        if (i >= n.num) {
          this.activeEnemyIndices.splice(t, 1);
        } else {
          var a = this.nextSpawnTime.get(o);
          if (undefined === a) {
            a = n.startTime;
            this.nextSpawnTime.set(o, a);
          }
          if (this.gameTime >= a) {
            this.createEnemy(n);
            i++;
            this.enemySpawnedCount.set(o, i);
            if (i < n.num) {
              var r = this.gameTime + n.time;
              this.nextSpawnTime.set(o, r);
            } else {
              this.nextSpawnTime.delete(o);
              this.activeEnemyIndices.splice(t, 1);
            }
          }
        }
      }
      this.currentWaveSpawned = 0 === this.activeEnemyIndices.length;
    }
  };
  _ctor.prototype.isAllEnemiesSpawned = function () {
    return this.currentWave > this.maxWave && this.currentWaveSpawned;
  };
  _ctor.prototype.onDestroy = function () {
    this.removeEvent();
  };
  _ctor.prototype.removeEvent = function () {
    $10EventManager.EventManager.instance.off($10PlantDefenseDataProxy.PDDataEvent.CHECK_GAME_END, this.checkGameEnd, this);
    $10EventManager.EventManager.instance.off($10PlantDefenseDataProxy.PDDataEvent.GAME_OVER, this.gameOver, this);
    $10EventManager.EventManager.instance.off($10PlantDefenseDataProxy.PDDataEvent.SWITCH_SUPER_WEAPON, this.switchSuperWeapon, this);
  };
  _ctor.prototype.initEvent = function () {
    $10EventManager.EventManager.instance.on($10PlantDefenseDataProxy.PDDataEvent.CHECK_GAME_END, this.checkGameEnd, this);
    $10EventManager.EventManager.instance.on($10PlantDefenseDataProxy.PDDataEvent.GAME_OVER, this.gameOver, this);
    $10EventManager.EventManager.instance.on($10PlantDefenseDataProxy.PDDataEvent.SWITCH_SUPER_WEAPON, this.switchSuperWeapon, this);
  };
  _ctor.prototype.switchSuperWeapon = function (t, e) {
    e && $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.PlantDefense,
      path: "prefabs/CWjihuozhiwu",
      type: cc.Prefab
    }).then(function (t) {
      var e = cc.instantiate(t);
      e.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.effectLayer;
      e.setPosition(cc.v3(0, 0));
      var n = e.getComponent(sp.Skeleton);
      n.setAnimation(0, "jihuo", false);
      n.setCompleteListener(null);
      n.setCompleteListener(function () {
        e.destroy();
        e.removeFromParent();
      });
    }).catch(function (t) {
      $10CommonUtil.CommonUtil.print(t);
    });
    this.scheduleOnce(function () {
      $10PlantDefenseDataProxy.plantDefenseDataProxy.soldiers.filter(function (e) {
        return e.getComponent($10PDPlantBase.default).roleId == t;
      }).forEach(function (t) {
        t.getComponent($10PDPlantBase.default).setSuperPlantIcon();
      });
    }, 1);
  };
  _ctor.prototype.checkGameEnd = function () {
    this.allEnemiesSpawned && 0 == $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.length && this.gameOver(true);
  };
  _ctor.prototype.gameOver = function (t) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState === $10GameEnum.GameState.PLAYING) {
      $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState = $10GameEnum.GameState.OVER;
      if (t) {
        this.scheduleOnce(function () {
          $10PopupManager.PopupManager.instance.show({
            bundleName: $10HomeEnum.Bundles.PlantDefense,
            path: "prefabs/popups/PDWinPopup",
            keep: true
          });
        }, .5);
      } else {
        this.scheduleOnce(function () {
          $10PopupManager.PopupManager.instance.show({
            bundleName: $10HomeEnum.Bundles.PlantDefense,
            path: "prefabs/popups/PDLosePopup",
            keep: true
          });
        }, .5);
      }
    }
  };
  _ctor.prototype.start = function () {
    var t = this;
    this.initEvent();
    var e = cc.find("Canvas/GameUI");
    var n = cc.find("Canvas/Game/BottomLayer");
    e.active = false;
    n.y = -1e3;
    this.scheduleOnce(function () {
      t.mGameCamera.getComponent($10PDCameraCtl.default).onMainEnter(function () {
        t.mMonsterShow.destroy();
        t.mMonsterShow.removeFromParent();
        e.active = true;
        cc.tween(n).to(.5, {
          y: -690
        }).start();
        t.gameStart();
        n.getComponent($10PDBottomLayerCtl.default).initPlants();
      });
    }, 2);
    $10PDGameMgr.default.Inst.playAudioBGM("normal");
  };
  _ctor.prototype.gameStart = function () {
    $10PlantDefenseDataProxy.plantDefenseDataProxy.resetData();
    $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView = this.node;
    $10PlantDefenseDataProxy.plantDefenseDataProxy.effectLayer = cc.find("Canvas/Game/EffectLayer");
    $10PlantDefenseDataProxy.plantDefenseDataProxy.mapLayer = cc.find("Canvas/Game/mapView/MapLayer");
    $10PlantDefenseDataProxy.plantDefenseDataProxy.topLayer = cc.find("Canvas/Game/TopLayer");
    $10PlantDefenseDataProxy.plantDefenseDataProxy.pathView = cc.find("Canvas/Game/PathView");
    $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer = cc.find("Canvas/Game/BulletLayer");
    $10PlantDefenseDataProxy.plantDefenseDataProxy.summerLayer = cc.find("Canvas/Game/SummerLayer");
    $10PlantDefenseDataProxy.plantDefenseDataProxy.iceView = cc.find("Canvas/Game/IceView");
    this.initGrid();
    this.gameTime = 0;
    this.currentWave = 1;
    this.nextWaveTime = 0;
    this.currentWaveEnemies = [];
    this.activeEnemyIndices = [];
    this.enemySpawnedCount.clear();
    this.nextSpawnTime.clear();
    this.currentWaveSpawned = false;
    this.allEnemiesSpawned = false;
    this.waveEnemiesMap.clear();
    this.preprocessStageData();
    this.cacheSunParams();
    $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState = $10GameEnum.GameState.PLAYING;
    this.scheduleOnce(function () {
      var t = Number($10DataManager.DataManager.instance.eData.datapara[107].num);
      $10PlantDefenseDataProxy.plantDefenseDataProxy.addSunshine(t);
    }, 1);
    this.updateWaveLabel();
  };
  _ctor.prototype.preprocessStageData = function () {
    var t;
    var e;
    this.stageEnemyList = [];
    var n = $10DataManager.DataManager.instance.eData.data_zombiestage;
    for (var o in n) {
      n[o].stage == $10PlantDefenseDataProxy.plantDefenseDataProxy.selectStageId && this.stageEnemyList.push(n[o]);
    }
    this.stageEnemyList.sort(function (t, e) {
      return t.wave - e.wave;
    });
    this.maxWave = this.stageEnemyList.length > 0 ? this.stageEnemyList[this.stageEnemyList.length - 1].wave : 0;
    try {
      var i = cc__values(this.stageEnemyList);
      for (var a = i.next(); !a.done; a = i.next()) {
        var s = a.value;
        this.waveEnemiesMap.has(s.wave) || this.waveEnemiesMap.set(s.wave, []);
        this.waveEnemiesMap.get(s.wave).push(s);
      }
    } catch (c) {
      t = {
        error: c
      };
    } finally {
      try {
        a && !a.done && (e = i.return) && e.call(i);
      } finally {
        if (t) {
          throw t.error;
        }
      }
    }
    this.currentWaveEnemies = this.waveEnemiesMap.get(this.currentWave) || [];
    this.activeEnemyIndices = [];
    for (var l = 0; l < this.currentWaveEnemies.length; l++) {
      this.activeEnemyIndices.push(l);
    }
    console.log("关卡" + $10PlantDefenseDataProxy.plantDefenseDataProxy.selectStageId + "共有" + this.maxWave + "波敌人");
  };
  _ctor.prototype.cacheSunParams = function () {
    var t = $10DataManager.DataManager.instance.eData.datapara[105].num.split("|");
    this._sunParams = [Number(t[0]), Number(t[1])];
    this._sumTimer = this._sunParams[0];
    this._sumNum = this._sunParams[1];
    this._sumTimeInter = this._sumTimer;
  };
  _ctor.prototype.initGrid = function () {
    var t = -($10PDGameMgr.default.Inst.cols - 1) * $10PDGameMgr.default.Inst.gridWidth / 2;
    var e = ($10PDGameMgr.default.Inst.rows - 1) * $10PDGameMgr.default.Inst.gridHeight / 2 + 20;
    $10PDGameMgr.default.Inst.grids = [];
    for (var n = 0; n < $10PDGameMgr.default.Inst.rows; n++) {
      for (var o = 0; o < $10PDGameMgr.default.Inst.cols; o++) {
        var i = t + o * $10PDGameMgr.default.Inst.gridWidth;
        var a = e - n * $10PDGameMgr.default.Inst.gridHeight;
        var r = {
          id: n * $10PDGameMgr.default.Inst.cols + o,
          row: n,
          col: o,
          x: i,
          y: a,
          node: null
        };
        $10PDGameMgr.default.Inst.grids.push(r);
      }
    }
  };
  _ctor.prototype.createEnemy = function (t) {
    var e = this;
    var n = $10DataManager.DataManager.instance.eData.data_zombiemonster[t.armyId];
    this.getEnemyPrefab(n, function (n) {
      if (n) {
        var o = cc.instantiate(n);
        e.node.addChild(o);
        o.getComponent($10PDEnemyBase.default).initEnemy(t);
        $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.push(o);
      }
    });
  };
  _ctor.prototype.getEnemyPrefab = function (t, e) {
    if (2 == t.type) {
      $10ResUtil.ResUtil.loadAsset({
        path: "prefabs/monsters/PDEnemyBoss" + t.id,
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.PlantDefense
      }).then(function (t) {
        e && e(t);
      }).catch(function (t) {
        console.log("error:", t);
      });
    } else if (4 == t.type || 3 == t.type) {
      $10ResUtil.ResUtil.loadAsset({
        path: "prefabs/monsters/PDEnemy" + t.id,
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.PlantDefense
      }).then(function (t) {
        e && e(t);
      }).catch(function (t) {
        console.log("error:", t);
      });
    } else {
      $10ResUtil.ResUtil.loadAsset({
        path: "prefabs/monsters/PDEnemyNormal",
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.PlantDefense
      }).then(function (t) {
        e && e(t);
      }).catch(function (t) {
        console.log("error:", t);
      });
    }
  };
  _ctor.prototype.creatorSum = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/bullet/PDSunBullet",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.PlantDefense
    }).then(function (e) {
      var n = cc.instantiate(e);
      n.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.summerLayer;
      n.getComponent($10PDSumPlant.default).init(t._sumNum);
      t.createSunDropAnimation(n);
    });
  };
  _ctor.prototype.createSunDropAnimation = function (t) {
    var e = this;
    var n = 700 * Math.random() - 350;
    var o = -1 * $10Util.default.getRandomNum(0, 350);
    t.setPosition(n, 800);
    t.setScale(1, 1);
    t.angle = 0;
    t.opacity = 255;
    var i = 800 - o;
    var a = 1 * Math.sqrt(i / 150);
    cc.tween(t).parallel(cc.tween().to(a, {
      y: o
    }), cc.tween().by(a, {
      angle: 288
    })).call(function () {
      e.createLandingEffect(t, n, o);
    }).start();
  };
  _ctor.prototype.createLandingEffect = function () {};
  _ctor.prototype.onSunDropComplete = function (t) {
    this.addSunGlowEffect(t);
    var e = function () {
      cc.tween(t).to(1.5, {
        scaleX: 1.03,
        scaleY: 1.03
      }, {
        easing: "sineInOut"
      }).to(1.5, {
        scaleX: 1,
        scaleY: 1
      }, {
        easing: "sineInOut"
      }).call(e).start();
    };
    e();
  };
  _ctor.prototype.addSunGlowEffect = function (t) {
    var e = function () {
      cc.tween(t).to(.8, {
        opacity: 220
      }, {
        easing: "sineInOut"
      }).to(.8, {
        opacity: 255
      }, {
        easing: "sineInOut"
      }).call(e).start();
    };
    e();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mMonsterShow", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mGameCamera", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "testNode", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "waveLabel", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDBattleView;