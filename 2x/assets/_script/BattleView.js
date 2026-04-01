var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10Common = require("Common");
var $10Simulator = require("Simulator");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10GameUIManager = require("GameUIManager");
var $10AnimationMgr = require("AnimationMgr");
var $10Enemy4005 = require("Enemy4005");
var $10Enemy4006 = require("Enemy4006");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BattleView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mEnemyNormalPb = null;
    e.mEnemyBossPb = null;
    e._frameDt = 0;
    e._createEnemyTimes = [];
    e._enemyDatas = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    for (var e in $10BattleDataProxy.battleDataProxy.audioFilterInfo) {
      $10BattleDataProxy.battleDataProxy.audioFilterInfo[e].time -= t;
    }
    $10BattleDataProxy.battleDataProxy.soundWaveTime > 0 && ($10BattleDataProxy.battleDataProxy.soundWaveTime -= t);
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      this._frameDt += t;
      for (var o = 0; o < this._enemyDatas.length; ++o) {
        var i = this._enemyDatas[o];
        if (!(this._frameDt < i.startTime || i.createNum >= i.maxNum)) {
          var n = this._createEnemyTimes[o];
          n += t;
          if (i.createTime <= n) {
            n -= i.createTime;
            i.createNum++;
            if ($10BattleDataProxy.battleDataProxy.isEndless) {
              this.createEndlessEnemy(i.stageInfo);
            } else {
              this.createEnemy(i.enemyId, i.weatherData);
            }
          }
          this._createEnemyTimes[o] = n;
        }
      }
    }
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.REMOVE_ENEMY, this.removeEnemy, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.GM_ADD_ENEMY, this.createEnemy, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.GM_SET_ENDLESS_WAVE, this.initEnemyDatas, this);
  };
  _ctor.prototype.initBattleView = function () {
    $10Simulator.Simulator.instance.clear();
    $10Simulator.Simulator.instance.setAgentDefaults(100, 5, 1, .1, 0, 9999999, new $10Common.Vector2(0, 0));
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.REMOVE_ENEMY, this.removeEnemy, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.GM_ADD_ENEMY, this.createEnemy, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.GM_SET_ENDLESS_WAVE, this.initEnemyDatas, this);
    this.initEnemyDatas();
    this.preLoadEnemyAni();
  };
  _ctor.prototype.preLoadEnemyAni = function () {
    var t = [];
    for (var e = 0; e < this._enemyDatas.length; ++e) {
      var o = this._enemyDatas[e];
      t.indexOf(o.enemyId) < 0 && t.push(o.enemyId);
    }
    for (e = 0; e < t.length; ++e) {
      var i = t[e];
      var n = $10DataManager.DataManager.instance.eData.datamonster[i];
      1 == n.type && $10ResUtil.ResUtil.loadAsset({
        bundleName: "Game",
        path: "textures/monster/" + n.modeName,
        type: cc.SpriteAtlas
      });
    }
  };
  _ctor.prototype.initChapterEnemy = function () {
    var t = $10UserDataProxy.userDataProxy.userData.curChapter;
    var e = $10UserDataProxy.userDataProxy.userData.curWave;
    var o = $10BattleDataProxy.battleDataProxy.getStageRewardCfg(t).monsterList;
    var i = o.replace("stage", "");
    for (var n in $10DataManager.DataManager.instance.eData.datastage) {
      var a = $10DataManager.DataManager.instance.eData.datastage[n];
      if (a.stage == Number(i) && a.wave == e) {
        $10BattleDataProxy.battleDataProxy.stageInfo = a;
        break;
      }
    }
    var r = $10DataManager.DataManager.instance.eData["data" + o];
    this._frameDt = 0;
    this._enemyDatas.length = 0;
    this._createEnemyTimes.length = 0;
    var s = 0;
    for (var n in r) {
      var c = r[n];
      if (c.wave == e) {
        var l = c.startTime;
        var u = c.armyId;
        var p = c.num;
        var h = c.time;
        0 == l && (h = .5 * Math.random());
        var y = {
          enemyId: u,
          maxNum: p,
          createTime: h,
          createNum: 0,
          startTime: l
        };
        this._enemyDatas.push(y);
        this._createEnemyTimes.push(0);
        s += p;
      }
    }
    $10BattleDataProxy.battleDataProxy.waveEnemyNum = s;
    $10BattleDataProxy.battleDataProxy.waveResidueNum = s;
  };
  _ctor.prototype.initEndlessEnemy = function () {
    this._frameDt = 0;
    this._enemyDatas.length = 0;
    this._createEnemyTimes.length = 0;
    var t = $10DataManager.DataManager.instance.eData.dataendlessstage;
    var e = 0;
    console.log("battleDataProxy.endlessCurWave:", $10BattleDataProxy.battleDataProxy.endlessCurWave);
    for (var o in t) {
      var i = t[o];
      if (i.wave == $10BattleDataProxy.battleDataProxy.endlessCurWave) {
        var n = i.startTime;
        var a = i.armyId;
        var r = i.num;
        var s = i.time;
        0 == n && (s = .5 * Math.random());
        var c = {
          enemyId: a,
          maxNum: r,
          createTime: s,
          createNum: 0,
          startTime: n,
          stageInfo: i
        };
        this._enemyDatas.push(c);
        this._createEnemyTimes.push(0);
        if (3 == i.seat) {
          e += 2 * r;
        } else {
          e += r;
        }
      }
    }
    $10BattleDataProxy.battleDataProxy.waveEnemyNum = e;
    $10BattleDataProxy.battleDataProxy.waveResidueNum = e;
  };
  _ctor.prototype.initWeatherEnemy = function () {
    var t = $10UserDataProxy.userDataProxy.userData.cursWeatherChapter;
    var e = $10UserDataProxy.userDataProxy.userData.curWeatherWave;
    var o = $10DataManager.DataManager.instance.eData.data_weather[t];
    if (o) {
      $10BattleDataProxy.battleDataProxy.weatherStageInfo = o;
      this._frameDt = 0;
      this._enemyDatas.length = 0;
      this._createEnemyTimes.length = 0;
      var i = $10DataManager.DataManager.instance.eData.data_weatherdata;
      var n = 0;
      for (var a in i) {
        var r = i[a];
        if (r.stageId == t && r.wave == e) {
          var s = r.startTime;
          var c = r.armyId;
          var l = r.num;
          var u = r.time;
          0 == s && (u = .5 * Math.random());
          var p = {
            enemyId: c,
            maxNum: l,
            createTime: u,
            createNum: 0,
            startTime: s,
            weatherData: r
          };
          this._enemyDatas.push(p);
          this._createEnemyTimes.push(0);
          n += l;
        }
      }
      $10BattleDataProxy.battleDataProxy.waveEnemyNum = n;
      $10BattleDataProxy.battleDataProxy.waveResidueNum = n;
    } else {
      console.log("关卡信息读取失败");
    }
  };
  _ctor.prototype.initEnemyDatas = function () {
    if ($10BattleDataProxy.battleDataProxy.isEndless) {
      this.initEndlessEnemy();
    } else if ($10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE) {
      this.initWeatherEnemy();
    } else {
      this.initChapterEnemy();
    }
  };
  _ctor.prototype.startFight = function () {
    $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.PLAYING;
    var t = $10UserDataProxy.userDataProxy.userData.curWave;
    if ($10BattleDataProxy.battleDataProxy.isEndless) {
      t = $10BattleDataProxy.battleDataProxy.endlessCurWave;
    } else {
      $10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE && (t = $10UserDataProxy.userDataProxy.userData.curWeatherWave);
    }
    t % 5 == 0 && $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.SHOW_BOSS_TIPS);
    $10BattleDataProxy.battleDataProxy.removeEnemyNode(null);
  };
  _ctor.prototype.getIsPassWave = function () {
    if ($10BattleDataProxy.battleDataProxy.enemyNodes.length <= 5) {
      for (var t = 0; t < $10BattleDataProxy.battleDataProxy.enemyNodes.length; ++t) {
        var e = $10BattleDataProxy.battleDataProxy.enemyNodes[t];
        e && e.isValid || $10BattleDataProxy.battleDataProxy.enemyNodes.splice(t--, 1);
      }
    }
    if ($10BattleDataProxy.battleDataProxy.enemyNodes.length <= 0) {
      for (t = 0; t < this._enemyDatas.length; ++t) {
        var o = this._enemyDatas[t];
        if (o.createNum < o.maxNum) {
          console.log("怪物还没刷完");
          return false;
        }
      }
      return true;
    }
    return false;
  };
  _ctor.prototype.removeEnemy = function (t) {
    if (this.getIsPassWave()) {
      if ($10BattleDataProxy.battleDataProxy.isEndless) {
        var e = $10BattleDataProxy.battleDataProxy.endlessCurWave;
        e++;
        $10BattleDataProxy.battleDataProxy.endlessCurWave = e;
        var o = Object.keys($10DataManager.DataManager.instance.eData.dataendlessstage);
        return void (e >= $10DataManager.DataManager.instance.eData.dataendlessstage[o[o.length - 1]].wave ? (console.log("过关了"), this.scheduleOnce(function () {
          $10GameUIManager.gameUIMgr.showEndlessOverPopup();
        }, 1)) : this.addPassSunshineNum(t, e));
      }
      if ($10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE) {
        var i = $10UserDataProxy.userDataProxy.userData.curWeatherWave;
        i++;
        $10UserDataProxy.userDataProxy.userData.curWeatherWave = i;
        return void (20 < i ? (console.log("过关了"), this.scheduleOnce(function () {
          $10GameUIManager.gameUIMgr.showGameWinPopup();
        }, 1)) : this.addPassSunshineNum(t, i));
      }
      var n = $10UserDataProxy.userDataProxy.userData.curChapter;
      var a = $10BattleDataProxy.battleDataProxy.getStageRewardCfg(n);
      var r = $10UserDataProxy.userDataProxy.userData.curWave;
      $10BattleDataProxy.battleDataProxy.pushSuccessLv();
      r++;
      $10UserDataProxy.userDataProxy.userData.curWave = r;
      if (r > $10UserDataProxy.userDataProxy.userData.passWave) {
        $10UserDataProxy.userDataProxy.userData.passWave = r;
        $10UserDataProxy.userDataProxy.saveData();
      }
      if (Number(a.wave) < r) {
        console.log("过关了");
        this.scheduleOnce(function () {
          $10GameUIManager.gameUIMgr.showGameWinPopup();
        }, 1);
      } else {
        this.addPassSunshineNum(t, r);
      }
    }
  };
  _ctor.prototype.addPassSunshineNum = function (t, e) {
    $10BattleDataProxy.battleDataProxy.isStartFight = false;
    var o = $10BattleDataProxy.battleDataProxy.getWaveSunshineNum(e);
    var i = $10BattleDataProxy.battleDataProxy.sunshineNum;
    i += o;
    $10BattleDataProxy.battleDataProxy.sunshineNum = i;
    this.scheduleOnce(function () {
      $10AudioManager.AudioManager.instance.playBattleEffect("sounds/getSunshine", $10HomeEnum.Bundles.RES);
    }, .5);
    var n = $10BattleDataProxy.battleDataProxy.sunshineRoot;
    var a = this.node.convertToNodeSpaceAR(n.parent.convertToWorldSpaceAR(n.position));
    var c = $10BattleDataProxy.battleDataProxy.gameCamera;
    $10AnimationMgr.default.instance.showAwardAni({
      id: 8,
      num: o
    }, this.node, t, 0, a.addSelf(c.position));
    this.scheduleOnce(function () {
      $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.PASS_WAVE);
    }, 2);
  };
  _ctor.prototype.createEnemy = function (t, e) {
    var o = this;
    var i = $10DataManager.DataManager.instance.eData.datamonster[t];
    this.getEnemyPrefab(i, function (i) {
      var n = cc.instantiate(i);
      o.node.addChild(n);
      n.getComponent($10EnemyBase.default).weatherData = e;
      n.getComponent($10EnemyBase.default).initEnemy(t);
      $10BattleDataProxy.battleDataProxy.enemyNodes.push(n);
      if (4005 == t) {
        for (var a = 0; a < 6; ++a) {
          o.createBoy(n, a, function (t) {
            n.getComponent($10Enemy4005.default).pushBoyNode(t);
          });
        }
      }
    });
    if ("" != i.des && $10BattleDataProxy.battleDataProxy.enemyDetailsIds.indexOf(t) < 0) {
      $10BattleDataProxy.battleDataProxy.enemyDetailsIds.push(t);
      $10BattleDataProxy.battleDataProxy.saveEnemyDetailsIds();
      $10GameUIManager.gameUIMgr.showEnemyDetailsPopup(t);
    }
  };
  _ctor.prototype.getEnemyPrefab = function (t, e) {
    if (2 == t.type) {
      $10ResUtil.ResUtil.loadAsset({
        path: "prefabs/monster/EnemyBoss" + t.id,
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        e && e(t);
      }).catch(function (t) {
        console.log("error:", t);
      });
    } else if (4 == t.type || 3 == t.type) {
      $10ResUtil.ResUtil.loadAsset({
        path: "prefabs/monster/Enemy" + t.id,
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        e && e(t);
      }).catch(function (t) {
        console.log("error:", t);
      });
    } else {
      e && e(this.mEnemyNormalPb);
    }
  };
  _ctor.prototype.createEndlessEnemy = function (t) {
    var e = this;
    var o = t.armyId;
    var i = $10DataManager.DataManager.instance.eData.datamonster[o];
    this.getEnemyPrefab(i, function (o) {
      var i = 3 == t.seat ? 2 : 1;
      var n = 1 == t.seat;
      for (var a = 0; a < i; ++a) {
        var r = cc.instantiate(o);
        e.node.addChild(r);
        n = 2 != t.seat && (1 == t.seat || 0 == a);
        r.getComponent($10EnemyBase.default).initEndlessEnemy(t, n);
        $10BattleDataProxy.battleDataProxy.enemyNodes.push(r);
      }
    });
  };
  _ctor.prototype.createBoy = function (t, e, o) {
    var i = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/monster/Enemy4006",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (n) {
      var a = cc.instantiate(n);
      i.node.addChild(a);
      a.getComponent($10EnemyBase.default).initEnemy(4006);
      $10BattleDataProxy.battleDataProxy.enemyNodes.push(a);
      a.getComponent($10Enemy4006.default).setFollowData(t, e);
      o && o(a);
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mEnemyNormalPb", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mEnemyBossPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BattleView;