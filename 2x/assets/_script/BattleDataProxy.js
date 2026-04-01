var i;
var cc__extends = __extends;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.battleDataProxy = exports.BattleData = exports.EBattleEvent = exports.BlockSize = exports.TreeSize = undefined;
var a;
var $10GameUIManager = require("GameUIManager");
var $10AnimationMgr = require("AnimationMgr");
var $10SkillDataMgr = require("SkillDataMgr");
var $10ProxyBase = require("ProxyBase");
var $10EventManager = require("EventManager");
var $10HttpRequest = require("HttpRequest");
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10SqlUtil = require("SqlUtil");
var $10FlyItemAnimCtrl2 = require("FlyItemAnimCtrl2");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
exports.TreeSize = 100;
exports.BlockSize = 512;
(function (t) {
  t.SELECT_SKILL = "SELECT_SKILL";
  t.REMOVE_ENEMY = "REMOVE_ENEMY";
  t.PASS_WAVE = "PASS_WAVE";
  t.UPDATE_SUNSHINE = "UPDATE_SUNSHINE";
  t.UPDATE_EXP = "UPDATE_EXP";
  t.UPDATE_HOUSE_HP = "UPDATE_HOUSE_HP";
  t.RESURGENCE = "RESURGENCE";
  t.GM_ADD_EQUIP = "GM_ADD_EQUIP";
  t.SHOW_BOSS_TIPS = "SHOW_BOSS_TIPS";
  t.GM_ADD_ENEMY = "GM_ADD_ENEMY";
  t.SELECT_SUPER_PLANT = "SELECT_SUPER_PLANT";
  t.UPDATE_SUPER_STATE = "UPDATE_SUPER_STATE";
  t.GM_ADD_FIXEDPLANT = "GM_ADD_FIXEDPLANT";
  t.GM_ADD_BALL = "GM_ADD_BALL";
  t.RESUME_BALL = "RESUME_BALL";
  t.CLEAN_BOSS_BALL = "CLEAN_BOSS_BALL";
  t.UPDATE_SUPER_PLANT_NUM = "UPDATE_SUPER_PLANT_NUM";
  t.MAP_BLOCK_DESTROY = "MAP_BLOCK_DESTROY";
  t.LOSE_COURSE_VIEW = "LOSE_COURSE_VIEW";
  t.ACTIVE_FRENZY = "ACTIVE_FRENZY";
  t.SELECT_SKILL_FINISH = "SELECT_SKILL_FINISH";
  t.GM_SET_ENDLESS_WAVE = "GM_SET_ENDLESS_WAVE";
})(a = exports.EBattleEvent || (exports.EBattleEvent = {}));
var exp_BattleData = function () {
  this.ownSkillList = [];
  this.houseHp = 0;
  this.houseMaxHp = 0;
  this.sunshineNum = 0;
  this.expNum = 0;
  this.expLevel = 1;
  this.refreshNum = 0;
  this.getAllNum = 0;
  this.reviveNum = 0;
  this.ballNum = 1;
  this.superPlantId = 0;
  this.battleChapter = 0;
  this.battleWave = 0;
};
exports.BattleData = exp_BattleData;
var def_BattleDataProxy = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.uiCamera = null;
    e.gameCamera = null;
    e.battleView = null;
    e.pathPointView = null;
    e.blackHoleView = null;
    e.blockLayout = null;
    e.excludeCollisionView = null;
    e.iceView = null;
    e.waterView = null;
    e.mTopUI = null;
    e.numberView = null;
    e.equipRoot = null;
    e.top1 = null;
    e.gameUI = null;
    e.blackHoleNodes = [];
    e.audioFilterInfo = {};
    e._gameState = $10GameEnum.GameState.NONE;
    e._gameSpeed = 1;
    e.mapTree = {};
    e.enemyMovePaths = [];
    e.enemyNodes = [];
    e.stageInfo = null;
    e.weatherStageInfo = null;
    e.pathRatios = [];
    e.bulletBalls = [];
    e.house = null;
    e.houseBaseHp = 0;
    e.baseSunshine = 0;
    e.plantRefreshPrice = 0;
    e.plantPriceRate = [];
    e.recyclePriceRate = [];
    e.isStartFight = false;
    e.isDad = false;
    e.sunshineRoot = null;
    e.waveEnemyNum = 0;
    e.waveResidueNum = 0;
    e.isActiveSuperPlant = false;
    e.superPlantNum = 0;
    e.pathWalls = [];
    e.fixedPlantAtkRate = 0;
    e.nutWalNodes = [];
    e.gridsMap = new Map();
    e.wateringCart = null;
    e.bossSkillBall = [];
    e.enemyDetailsIds = [];
    e.bossSkillCourseIds = [];
    e.mapBlockNum = 0;
    e.testBlock = false;
    e.isGameLose = false;
    e.firstPlayChapter = [];
    e.successLv = [];
    e.isActiveFrenzy = false;
    e.superFrameDatas = [];
    e.topSuperId = 0;
    e.soundWaveTime = 0;
    e.isEndless = false;
    e.endlessCurWave = 1;
    e.endlessVideoSunNum = 0;
    e.endlessSelectSkillNum = 0;
    e.endlessIsDad = false;
    e.enemyAirship = [];
    e.airshipSoldier = [];
    e.priestZombie = [];
    e.enemyPathIce = [];
    e.weatherType = $10GameEnum.WeatherType.NONE;
    e.weatherHeavyFog = null;
    e.bulletView = null;
    e.boxRewardTypes = [];
    e.hybridStarPropertys = [];
    e.hybridPlantPropertys = [];
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "battleData", {
    get: function () {
      return this._data;
    },
    set: function (t) {
      this._data = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "gameSpeed", {
    get: function () {
      return this._gameSpeed;
    },
    set: function (t) {
      this._gameSpeed = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "gameState", {
    get: function () {
      return this._gameState;
    },
    set: function (t) {
      this._gameState = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "sunshineNum", {
    get: function () {
      return this.battleData.sunshineNum;
    },
    set: function (t) {
      this.battleData.sunshineNum = t;
      $10EventManager.EventManager.instance.emit(a.UPDATE_SUNSHINE);
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.resetData = function () {
    this._data = new exp_BattleData();
    $10SqlUtil.SqlUtil.setLocalUserData("BattleData", "");
    $10SqlUtil.SqlUtil.setLocalUserData("BattlePlantData", "");
  };
  _ctor.prototype.loadSuperFrameDatas = function (t) {
    var e = this;
    this.superFrameDatas.length = 0;
    var o = $10UserDataProxy.userDataProxy.userData.combatEqus;
    var i = 0;
    var n = function (n) {
      var a = o[n];
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/superBigImg/pic_CWplant" + a,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (n) {
        e.superFrameDatas.push({
          frame: n,
          plantId: a
        });
        ++i >= o.length && t && t();
      }).catch(function (t) {
        console.log("error:", t);
      });
    };
    for (var a = 0; a < o.length; ++a) {
      n(a);
    }
  };
  _ctor.prototype.getBulletPathPoints = function (t) {
    var e = null;
    var o = this.pathPointView.children;
    var i = 1e4;
    var n = 0;
    var a = [];
    for (var r = 0; r < o.length; ++r) {
      var s = o[r];
      var c = $10MathUtil.MathUtil.distance(s.position, t);
      if (c < i) {
        n = r;
        i = c;
        e = s;
      }
    }
    a.push(e);
    if (0 == n) {
      a.push(o[1]);
      a.push(o[2]);
    } else if (n >= o.length - 1) {
      a.push(o[o.length - 2]);
      a.push(o[o.length - 3]);
    } else {
      a.push(o[n - 1]);
      a.push(o[n + 1]);
    }
    return a;
  };
  _ctor.prototype.getBulletPathPointsEx = function (t) {
    var e = this.pathPointView.children;
    var o = 1e4;
    var i = 0;
    var n = [];
    for (var a = 0; a < e.length; ++a) {
      var r = e[a];
      var s = $10MathUtil.MathUtil.distance(r.position, t);
      if (s < o) {
        i = a;
        o = s;
      }
    }
    n.push({
      nearestPoint: e[i],
      nearestIdx: i
    });
    if (i <= 1) {
      n.push({
        nearestPoint: e[1 + i],
        nearestIdx: i
      });
      n.push({
        nearestPoint: e[2 + i],
        nearestIdx: i
      });
    } else {
      n.push({
        nearestPoint: e[i - 1],
        nearestIdx: i
      });
      n.push({
        nearestPoint: e[i - 2],
        nearestIdx: i
      });
    }
    return n;
  };
  _ctor.prototype.getEnemyPathPoint = function (t) {
    var e = null;
    var o = this.pathPointView.children;
    var i = 1e4;
    var n = 0;
    for (var a = 0; a < o.length; ++a) {
      var r = o[a];
      var s = $10MathUtil.MathUtil.distance(r.position, t);
      if (s < i) {
        n = a;
        i = s;
        e = r;
      }
    }
    return {
      nearestPoint: e,
      nearestIdx: n
    };
  };
  _ctor.prototype.setEnemyMovePaths = function (t) {
    exports.battleDataProxy.enemyMovePaths = [];
    for (var e = 0; e < t.length; ++e) {
      exports.battleDataProxy.enemyMovePaths[e] = t[e].children;
    }
    this.pathRatios.length = 0;
    var i = this.getPathDis(2);
    for (e = 0; e < exports.battleDataProxy.enemyMovePaths.length; ++e) {
      var n = i / this.getPathDis(e);
      this.pathRatios.push(n);
    }
  };
  _ctor.prototype.getPathDis = function (t) {
    var e = 0;
    var i = exports.battleDataProxy.enemyMovePaths[t][0].position;
    for (var n = 1; n < exports.battleDataProxy.enemyMovePaths[t].length; ++n) {
      var a = exports.battleDataProxy.enemyMovePaths[t][n];
      e += $10MathUtil.MathUtil.distance(i, a.position);
    }
    return e;
  };
  _ctor.prototype.removeEnemyNode = function (t) {
    for (var e = 0; e < this.enemyNodes.length; ++e) {
      if (this.enemyNodes[e] == t) {
        this.enemyNodes.splice(e, 1);
        break;
      }
    }
    $10EventManager.EventManager.instance.emit(a.REMOVE_ENEMY, t);
  };
  _ctor.prototype.getEnemyMovePaths = function (t) {
    undefined === t && (t = 1);
    var e = 1;
    1 == t && (e = this.enemyNodes.length % 3);
    return {
      movePath: this.enemyMovePaths[e],
      idx: e
    };
  };
  _ctor.prototype.getEndlessEnemyMovePaths = function (t, e) {
    undefined === e && (e = 1);
    var o = 1;
    1 == e && (o = this.enemyNodes.length % 3);
    t || (o += 3);
    return {
      movePath: this.enemyMovePaths[o],
      idx: o
    };
  };
  _ctor.prototype.getPathPos = function (t, e) {
    return exports.battleDataProxy.enemyMovePaths[t][e].position;
  };
  _ctor.prototype.getPlantAtkTargets = function (t, e, o, i, n) {
    var a;
    var r = this;
    if (o) {
      return [this.house];
    }
    if (this.enemyNodes.length <= 0) {
      return [];
    }
    if (107 == e && this.enemyAirship.length > 0) {
      return this.enemyAirship;
    }
    if (this.airshipSoldier.length > 0) {
      var s = [];
      for (var c = 0; c < this.airshipSoldier.length; ++c) {
        var l = this.airshipSoldier[c];
        if (l && l.isValid) {
          (null === (a = l.getComponent("EnemyBase")) || undefined === a ? undefined : a.getIsCanChoose(e)) && s.push(l);
        } else {
          this.airshipSoldier.splice(c--, 1);
        }
      }
      if (s.length > 0) {
        return s;
      }
    }
    var u = [];
    if (n) {
      for (c = 0; c < this.enemyNodes.length; ++c) {
        (p = this.enemyNodes[c]) && p.isValid && p.getComponent("EnemyBase").isTop == i && u.push(p);
      }
    } else {
      for (c = 0; c < this.enemyNodes.length; ++c) {
        var p;
        (p = this.enemyNodes[c]) && p.isValid && u.push(p);
      }
    }
    u.sort(function (t, e) {
      var o;
      var i;
      var n;
      var a;
      var s = null === (o = t.getComponent("EnemyBase")) || undefined === o ? undefined : o.moveDis;
      var c = null === (i = t.getComponent("EnemyBase")) || undefined === i ? undefined : i.pathIdx;
      var l = null === (n = e.getComponent("EnemyBase")) || undefined === n ? undefined : n.moveDis;
      var u = null === (a = e.getComponent("EnemyBase")) || undefined === a ? undefined : a.pathIdx;
      var p = s * r.pathRatios[c];
      return l * r.pathRatios[u] - p;
    });
    var h = [];
    for (c = 0; c < u.length; ++c) {
      var d = u[c];
      if (!d || !d.isValid) {
        break;
      }
      var m = null == d ? undefined : d.parent;
      if (m && m.isValid && !(d.x > d.parent.width / 2 - 50) && d.getComponent("EnemyBase").getIsCanChoose(e) && (d.getComponent("EnemyBase").moveDis > 70 && h.push(d), h.length >= t)) {
        break;
      }
    }
    this.wateringCart && h.indexOf(this.wateringCart) < 0 && h.unshift(this.wateringCart);
    return h;
  };
  _ctor.prototype.getEnemyById = function (t) {
    var e = this.enemyNodes.findIndex(function (e) {
      return e.getComponent("EnemyBase").monsterCfg.id == t;
    });
    if (e < 0) {
      return null;
    } else {
      return this.enemyNodes[e];
    }
  };
  _ctor.prototype.initData = function () {};
  _ctor.prototype.saveData = function () {};
  _ctor.prototype.loadBattleData = function () {
    return $10SqlUtil.SqlUtil.getLocalUserData("BattleData", "");
  };
  _ctor.prototype.saveBattlePlantData = function (t) {
    this.isEndless || $10SqlUtil.SqlUtil.setLocalUserData("BattlePlantData", t);
  };
  _ctor.prototype.loadBattlePlantData = function () {
    return $10SqlUtil.SqlUtil.getLocalUserData("BattlePlantData", "") + "";
  };
  _ctor.prototype.saveEnemyDetailsIds = function () {
    $10SqlUtil.SqlUtil.setLocalUserData("EnemyDetailsIds", JSON.stringify(this.enemyDetailsIds));
  };
  _ctor.prototype.loadEnemyDetailsIds = function () {
    var t = $10SqlUtil.SqlUtil.getLocalUserData("EnemyDetailsIds", "");
    "" != t && (this.enemyDetailsIds = JSON.parse(t + ""));
  };
  _ctor.prototype.saveBossSkillCourseIds = function () {
    $10SqlUtil.SqlUtil.setLocalUserData("bossSkillCourseIds", JSON.stringify(this.bossSkillCourseIds));
  };
  _ctor.prototype.loadBossSkillCourseIds = function () {
    var t = $10SqlUtil.SqlUtil.getLocalUserData("bossSkillCourseIds", "");
    "" != t && (this.bossSkillCourseIds = JSON.parse(t + ""));
  };
  _ctor.prototype.saveFirstPlayChapter = function () {
    $10SqlUtil.SqlUtil.setLocalUserData("FirstPlayChapter", JSON.stringify(this.firstPlayChapter));
  };
  _ctor.prototype.loadFirstPlayChapter = function () {
    var t = $10SqlUtil.SqlUtil.getLocalUserData("FirstPlayChapter", "");
    "" != t && (this.firstPlayChapter = JSON.parse(t + ""));
  };
  _ctor.prototype.pushFirstPlayChapter = function () {
    var t = $10UserDataProxy.userDataProxy.userData.curChapter;
    var e = $10UserDataProxy.userDataProxy.userData.curWave;
    var o = t + "_" + e;
    if (this.firstPlayChapter.indexOf(o) < 0) {
      this.firstPlayChapter.push(o);
      mm.platform.umaTrackEvent("lv", {
        userA: "start_lv_" + t + "_" + e
      });
      this.saveFirstPlayChapter();
    }
  };
  _ctor.prototype.loadSuccessLv = function () {
    var t = $10SqlUtil.SqlUtil.getLocalUserData("SuccessLv", "");
    "" != t && (this.successLv = JSON.parse(t + ""));
  };
  _ctor.prototype.pushSuccessLv = function () {
    var t = $10UserDataProxy.userDataProxy.userData.curChapter;
    var e = $10UserDataProxy.userDataProxy.userData.curWave;
    var o = t + "_" + e;
    if (this.successLv.indexOf(o) < 0) {
      this.successLv.push(o);
      mm.platform.umaTrackEvent("lv", {
        userA: "success_lv_" + t + "_" + e
      });
      $10SqlUtil.SqlUtil.setLocalUserData("SuccessLv", JSON.stringify(this.successLv));
    }
  };
  _ctor.prototype.enterGame = function () {
    this.bulletBalls = [];
    if (this.isEndless) {
      this.baseSunshine = Number($10DataManager.DataManager.instance.eData.datapara[1016].num);
    } else {
      this.baseSunshine = Number($10DataManager.DataManager.instance.eData.datapara[42].num);
    }
    this.plantRefreshPrice = Number($10DataManager.DataManager.instance.eData.datapara[26].num);
    this.plantPriceRate = $10DataManager.DataManager.instance.eData.datapara[64].num.split("|").map(Number);
    this.recyclePriceRate = $10DataManager.DataManager.instance.eData.datapara[63].num.split("|").map(Number);
    this.initBasePropertys();
    this.houseBaseHp = this.getHouseBaseHp();
    this.loadEnemyDetailsIds();
    this.loadBossSkillCourseIds();
    this.loadFirstPlayChapter();
    this.loadSuccessLv();
    this.battleData.houseHp = this.battleData.houseMaxHp = this.houseBaseHp;
    $10SkillDataMgr.default.instance.removeSkillInfo();
    this.battleData.ownSkillList = [];
    this.sunshineNum = this.baseSunshine;
    this.battleData.expNum = 0;
    this.battleData.expLevel = 1;
    this.battleData.refreshNum = 0;
    this.battleData.getAllNum = 0;
    this.battleData.reviveNum = 0;
    this.battleData.ballNum = 1;
  };
  _ctor.prototype.initBasePropertys = function () {
    var t = $10UserDataProxy.userDataProxy.getHybridAllStar();
    var e = $10DataManager.DataManager.instance.eData.data_hybridizationstarmaster;
    var o = function (o) {
      var n = e[o];
      if (t >= n.star) {
        var a = n.att.split("_").map(Number);
        var r = i.hybridStarPropertys.findIndex(function (t) {
          return t.id == a[0];
        });
        if (r < 0) {
          i.hybridStarPropertys.push({
            id: a[0],
            num: a[1]
          });
        } else {
          i.hybridStarPropertys[r].num += a[1];
        }
      }
    };
    var i = this;
    for (var n in e) {
      o(n);
    }
    this.hybridPlantPropertys = [];
    if ($10UserDataProxy.userDataProxy.userData.wearHybridPlantId && 0 != $10UserDataProxy.userDataProxy.userData.wearHybridPlantId) {
      var a = $10UserDataProxy.userDataProxy.userData.hybridPlantDatas.findIndex(function (t) {
        return t.plantId == $10UserDataProxy.userDataProxy.userData.wearHybridPlantId;
      });
      if (a < 0) {
        return void console.log("杂交植物佩戴有问题");
      }
      var r = $10UserDataProxy.userDataProxy.userData.hybridPlantDatas[a].lv;
      var s = $10DataManager.DataManager.instance.eData.data_hybridizationskill[$10UserDataProxy.userDataProxy.userData.wearHybridPlantId];
      var c = s.unlockLv.split("|").map(Number);
      var l = s.passiveSkill.split("|");
      var u = function (t) {
        if (r >= c[t]) {
          var e = l[t].split("_").map(Number);
          var o = p.hybridPlantPropertys.findIndex(function (t) {
            return t.id == e[0];
          });
          if (o < 0) {
            p.hybridPlantPropertys.push({
              id: e[0],
              num: e[1]
            });
          } else {
            p.hybridPlantPropertys[o].num += e[1];
          }
        }
      };
      var p = this;
      for (var h = 0; h < l.length; ++h) {
        u(h);
      }
    }
  };
  _ctor.prototype.getHouseBaseHp = function () {
    var t = Number($10DataManager.DataManager.instance.eData.datapara[31].num);
    var e = 0;
    for (var o = 0; o < this.hybridStarPropertys.length; ++o) {
      var i = this.hybridStarPropertys[o];
      if (3 == i.id) {
        e += i.num;
      } else {
        4 == i.id && (e += Math.floor(t * i.num));
      }
    }
    return t + e;
  };
  _ctor.prototype.clearData = function () {
    this.battleData.ownSkillList = [];
    this.battleData.houseHp = 0;
    this.battleData.houseMaxHp = 0;
    this.battleData.sunshineNum = 0;
    this.battleData.expNum = 0;
    this.battleData.expLevel = 1;
    this.battleData.refreshNum = 0;
    this.battleData.getAllNum = 0;
    this.battleData.reviveNum = 0;
    this.battleData.ballNum = 1;
    this.battleData.battleChapter = 0;
    this.battleData.battleWave = 0;
    this.enemyNodes = [];
    this.equipRoot = null;
    this.battleData.superPlantId = 0;
    this.isActiveSuperPlant = false;
    this.superPlantNum = 0;
    this.isStartFight = false;
    this.fixedPlantAtkRate = 0;
    this.nutWalNodes.length = 0;
    this.wateringCart = null;
    this.bossSkillBall = [];
    this.blackHoleNodes = [];
    this.mapBlockNum = 0;
    this.testBlock = false;
    this.isActiveFrenzy = false;
    this.soundWaveTime = 0;
    this.endlessCurWave = 1;
    $10SkillDataMgr.default.instance.removeSkillInfo();
    this.endlessVideoSunNum = Number($10DataManager.DataManager.instance.eData.datapara[1007].num);
    this.endlessSelectSkillNum = 3;
    this.enemyAirship = [];
    this.airshipSoldier = [];
    this.priestZombie = [];
    this.enemyPathIce = [];
    this.boxRewardTypes = [];
    this.hybridStarPropertys = [];
    this.hybridPlantPropertys = [];
    exports.battleDataProxy.saveBattlePlantData("");
    exports.battleDataProxy.saveData("");
  };
  _ctor.prototype.setVideoCardIcon = function (t, e, o) {
    undefined === e && (e = 1);
    undefined === o && (o = 1);
    var i = $10UserDataProxy.userDataProxy.getProp(4);
    var n = o;
    var a = "";
    if (i > 0) {
      a = "textures/item/icon_4";
      n = .5 * o;
    } else {
      a = "textures/public/pic_AD_" + e;
    }
    $10ResUtil.ResUtil.loadAsset({
      path: a,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      if (t && t.isValid) {
        t.getComponent(cc.Sprite).spriteFrame = e;
        t.scale = n;
      }
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.getPlantRefreshPrice = function () {
    return this.plantRefreshPrice;
  };
  _ctor.prototype.getPlantPrice = function (t, e) {
    e >= this.plantPriceRate.length && (e = this.plantPriceRate.length - 1);
    var o = $10DataManager.DataManager.instance.eData.dataplant[t].cost;
    return Math.floor(o * this.plantPriceRate[e - 1]);
  };
  _ctor.prototype.getRecyclePlantPrice = function (t, e) {
    var o = $10DataManager.DataManager.instance.eData.dataplant[t].cost;
    return Math.floor(o * this.recyclePriceRate[e - 1]);
  };
  _ctor.prototype.getWaveSunshineNum = function (t) {
    var e = 0;
    if (this.isEndless) {
      e = Number($10DataManager.DataManager.instance.eData.datapara[1003].num);
    } else if (this.weatherType != $10GameEnum.WeatherType.NONE) {
      var o = $10UserDataProxy.userDataProxy.userData.cursWeatherChapter;
      e = $10DataManager.DataManager.instance.eData.data_weather[o].waveGold;
    } else {
      e = this.getStageRewardCfg().stone.split("|").map(Number)[t - 1];
    }
    return $10SkillDataMgr.default.instance.getSkillProperty(48, 0) + e;
  };
  _ctor.prototype.updateHouseHp = function (t) {
    if (!(this.battleData.houseHp <= 0 || this.isDad || this.endlessIsDad || t.num < 0 && (this.enemyNodes.length <= 0 || !this.isStartFight))) {
      t.num = Math.floor(t.num);
      isNaN(t.num) && (t.num = 1);
      this.battleData.houseHp += t.num;
      if (t.num < 0) {
        this.battleData.houseHp < 0 && (this.battleData.houseHp = 0);
      } else {
        this.battleData.houseHp > this.battleData.houseMaxHp && (this.battleData.houseHp = this.battleData.houseMaxHp);
      }
      isNaN(this.battleData.houseHp) && (this.battleData.houseHp = 10);
      var e = $10UserDataProxy.userDataProxy.userData.curChapter;
      1 == e && this.battleData.houseHp <= 10 && (this.battleData.houseHp = 0);
      if (this.battleData.houseHp <= 0) {
        exports.battleDataProxy.gameState = $10GameEnum.GameState.OVER;
        if (exports.battleDataProxy.isEndless) {
          return void $10GameUIManager.gameUIMgr.showEndlessOverPopup();
        }
        var i = $10UserDataProxy.userDataProxy.userData.curWave;
        mm.platform.umaTrackEvent("lv", {
          userA: "fail_lv_" + e + "_" + i
        });
        if (this.battleData.reviveNum <= 2) {
          console.log("弹复活界面");
          this.battleData.reviveNum++;
          $10GameUIManager.gameUIMgr.showGameRevivePopup();
        } else {
          console.log("弹失败结算界面");
          $10GameUIManager.gameUIMgr.showGameLosePopup();
        }
      }
      $10EventManager.EventManager.instance.emit(a.UPDATE_HOUSE_HP, t.num);
    }
  };
  _ctor.prototype.insertMap = function () {
    return "";
  };
  _ctor.prototype.getMapItemByKey = function () {};
  _ctor.prototype.removeMapItem = function () {};
  _ctor.prototype.getGameSpd = function () {
    return cc.director.getScheduler().getTimeScale();
  };
  _ctor.prototype.getSkillAttribute = function (t) {
    return $10DataManager.DataManager.instance.eData.dataskill[t].attribute.split("_").map(Number);
  };
  _ctor.prototype.selectSkill = function (t, e) {
    var i = this._data.ownSkillList.findIndex(function (e) {
      return e.id == t;
    });
    if (-1 == i) {
      var n = {
        id: t,
        count: 1
      };
      this._data.ownSkillList.push(n);
    } else {
      this._data.ownSkillList[i].count++;
    }
    if (6001 == t) {
      var r = this.getSkillAttribute(t);
      var l = this.sunshineNum;
      l += r[1];
      this.sunshineNum = l;
      if (e) {
        var p = exports.battleDataProxy.sunshineRoot;
        var h = this.battleView.convertToNodeSpaceAR(p.parent.convertToWorldSpaceAR(p.position));
        var d = exports.battleDataProxy.gameCamera;
        $10AnimationMgr.default.instance.showAwardAni({
          id: 8,
          num: r[1]
        }, this.battleView, e, 0, h.addSelf(d.position));
      }
    } else if (1001 == t || 1002 == t) {
      r = this.getSkillAttribute(t);
      var m = this.battleData.houseMaxHp;
      var f = Math.floor(m * r[1]);
      this.battleData.houseMaxHp = m + f;
      this.updateHouseHp({
        isCirt: false,
        num: f
      });
    } else if (4001 == t) {
      r = this.getSkillAttribute(t);
      m = this.battleData.houseMaxHp;
      f = Math.floor(m * r[1]);
      this.updateHouseHp({
        isCirt: false,
        num: f
      });
    }
    $10SkillDataMgr.default.instance.pushSkillInfo(t);
    $10EventManager.EventManager.instance.emit(a.SELECT_SKILL, t);
    this.saveData();
  };
  _ctor.prototype.flyMoneyIcon = function (t, e, o) {
    var i = "textures/public/icon_zuanshi";
    if (t == $10FlyItemAnimCtrl2.E_ItemIDType.Star) {
      i = "textures/public/icon_xingyaoshi";
    } else {
      t == $10FlyItemAnimCtrl2.E_ItemIDType.GOLD && (i = "textures/public/icon_jingbi");
    }
    var n = {
      itemId: t,
      itemNum: e,
      startWorldPos: o.convertToWorldSpaceAR(cc.v2(0, 0)),
      onComplete: null,
      iconPath: i,
      iconScale: .9
    };
    $10EventManager.EventManager.instance.emit($10FlyItemAnimCtrl2.EFlyItemAnimEvent.FLY_ITEM_ANIM, n);
  };
  _ctor.prototype.checkHasSkill = function (t) {
    var e = this._data.ownSkillList.find(function (e) {
      return e.id == t;
    });
    var o = $10DataManager.DataManager.instance.eData.dataskill[(null == e ? undefined : e.id) || 0];
    if (o) {
      return {
        skillData: o,
        count: e.count
      };
    } else {
      return null;
    }
  };
  _ctor.prototype.getEachEquipCountInfo = function () {
    var t;
    var e;
    var o = {};
    for (var i = 0; i < (null === (e = null === (t = this.equipRoot) || undefined === t ? undefined : t.children) || undefined === e ? undefined : e.length); ++i) {
      var n = this.equipRoot.children[i];
      var a = n.getComponent("EquipmentItem").equipId;
      o[a] || (o[a] = []);
      var r = {
        level: n.getComponent("EquipmentItem").level
      };
      o[a].push(r);
    }
    return o;
  };
  _ctor.prototype.getBulletHarm = function (t, e, o, i, n, a, r, s) {
    var l;
    var u;
    var p = this.getPlantAtk(e, o);
    if (this.weatherType == $10GameEnum.WeatherType.Night) {
      if (3 == e || 10 == e) {
        if (10 == e) {
          this.getIsSuperPlant(10) && (p *= 1.5);
        } else {
          p *= 1.5;
        }
      } else {
        p *= .5;
      }
    }
    s && (p *= $10SkillDataMgr.default.instance.getSkillProperty(14, e));
    var h = $10SkillDataMgr.default.instance.getSkillProperty(10, e);
    var d = 5;
    var m = (null === (l = this.checkHasSkill(30001)) || undefined === l ? undefined : l.skillData) || null;
    m && (d = m.maxNum + 1);
    (null === (u = this.checkHasSkill(30004)) || undefined === u ? undefined : u.skillData) && (d = m.maxNum + 1);
    n > d && (n = d);
    p *= 1 + h * (n - 1);
    var f = this.getIsCrit(e, i);
    f && (p *= this.getCritMultiple(e));
    1 != t && (p *= 1 + this.getHitBossHarm(e));
    p *= a;
    p *= r;
    return {
      isCrit: f,
      num: Math.ceil(p)
    };
  };
  _ctor.prototype.getFixedPlantBulletHarm = function (t, e, o) {
    2 == e && (t *= 1 + this.getHitBossHarm(0));
    t *= o;
    return {
      isCrit: false,
      num: Math.ceil(t)
    };
  };
  _ctor.prototype.getPlantAtk = function (t, e, o) {
    var i = $10DataManager.DataManager.instance.eData.dataplant[t];
    if (!o) {
      if (t >= 10001) {
        var n = $10UserDataProxy.userDataProxy.userData.hybridPlantDatas.findIndex(function (e) {
          return e.plantId == t;
        });
        o = n >= 0 ? $10UserDataProxy.userDataProxy.userData.hybridPlantDatas[n].lv : 1;
      } else {
        o = $10UserDataProxy.userDataProxy.getPlantData(t).lv;
      }
    }
    var a = i.atack.split("|").map(Number)[o - 1];
    if (!a) {
      return 0;
    }
    var r = i.growup.split("|").map(Number)[e - 1];
    var s = $10SkillDataMgr.default.instance.getSkillProperty(2, t);
    s += this.getPlantShiftAttack();
    for (var l = 0; l < this.hybridStarPropertys.length; ++l) {
      var u = this.hybridStarPropertys[l];
      if (1 == u.id) {
        a += u.num;
      } else {
        2 == u.id && (s += u.num);
      }
    }
    if ($10UserDataProxy.userDataProxy.userData.wearHybridPlantId == t) {
      for (l = 0; l < this.hybridPlantPropertys.length; ++l) {
        var p = this.hybridPlantPropertys[l];
        if (1 == p.id) {
          a += p.num;
        } else {
          2 == p.id && (s += p.num);
        }
      }
    }
    var h = a * (1 + s) * r;
    return Math.floor(h);
  };
  _ctor.prototype.getPlantShiftAttack = function () {
    if (!this.equipRoot || !this.equipRoot.isValid) {
      return 0;
    }
    var t = this.equipRoot.childrenCount;
    return $10SkillDataMgr.default.instance.getSkillProperty(42, 0) * t;
  };
  _ctor.prototype.getCatapultNumber = function (t) {
    return $10SkillDataMgr.default.instance.getSkillProperty(20, t);
  };
  _ctor.prototype.getAtkTargetNum = function (t) {
    return 1 + $10SkillDataMgr.default.instance.getSkillProperty(21, t);
  };
  _ctor.prototype.getBulletNum = function (t, e) {
    var o = 99999999999;
    var i = this.checkHasSkill(50001);
    if (i && i.skillData.equipId == e) {
      o = i.skillData.needTime;
      var n = this.checkHasSkill(50004);
      n && (o = n.skillData.needTime);
    }
    if (t % o == 0) {
      if (i) {
        return 1 + i.skillData.attribute.split("_").map(Number)[1];
      } else {
        return 1 + $10SkillDataMgr.default.instance.getSkillProperty(22, e);
      }
    } else {
      return 1;
    }
  };
  _ctor.prototype.getFireNum = function (t) {
    return 1 + $10SkillDataMgr.default.instance.getSkillProperty(18, t);
  };
  _ctor.prototype.getCritProb = function (t) {
    var e = 0;
    var o = $10SkillDataMgr.default.instance.getSkillProperty(11, t);
    for (var i = 0; i < this.hybridStarPropertys.length; ++i) {
      var n = this.hybridStarPropertys[i];
      11 == n.id && (e += n.num);
    }
    if ($10UserDataProxy.userDataProxy.userData.wearHybridPlantId == t) {
      for (i = 0; i < this.hybridPlantPropertys.length; ++i) {
        var a = this.hybridPlantPropertys[i];
        11 == a.id && (e += a.num);
      }
    }
    return e + o;
  };
  _ctor.prototype.getCritMultiple = function (t) {
    var e = 2;
    var o = $10SkillDataMgr.default.instance.getSkillProperty(12, t);
    for (var i = 0; i < this.hybridStarPropertys.length; ++i) {
      var n = this.hybridStarPropertys[i];
      12 == n.id && (e += n.num);
    }
    if ($10UserDataProxy.userDataProxy.userData.wearHybridPlantId == t) {
      for (i = 0; i < this.hybridPlantPropertys.length; ++i) {
        var a = this.hybridPlantPropertys[i];
        12 == a.id && (e += a.num);
      }
    }
    return e + o;
  };
  _ctor.prototype.getIsCrit = function (t, e) {
    var o = this.getCertainlyCritNum(t);
    if (o > 0 && e % (o + 1) == 0) {
      return true;
    }
    var i = this.getCritProb(t);
    return Math.floor(1e3 * Math.random()) % 100 < 100 * i;
  };
  _ctor.prototype.getCertainlyCritNum = function (t) {
    var e = -1;
    if (12 == t) {
      var o = this.checkHasSkill(120001);
      var i = this.checkHasSkill(120002);
      o && (e = $10DataManager.DataManager.instance.eData.dataskill[120001].needTime);
      i && (e -= $10DataManager.DataManager.instance.eData.dataskill[120002].needTime);
    }
    return e;
  };
  _ctor.prototype.getHitBossHarm = function (t) {
    return 0 + $10SkillDataMgr.default.instance.getSkillProperty(36, t);
  };
  _ctor.prototype.getIsSuperPlant = function (t) {
    return !!this.isActiveSuperPlant && t == this.battleData.superPlantId;
  };
  _ctor.prototype.getSuperPlantNum = function () {
    var t;
    if (!this.equipRoot) {
      return 0;
    }
    var e = 0;
    for (var i = 0; i < (null === (t = this.equipRoot.children) || undefined === t ? undefined : t.length); ++i) {
      this.equipRoot.children[i].getComponent("EquipmentItem").getComponent("EquipmentItem").mEquipId == exports.battleDataProxy.battleData.superPlantId && e++;
    }
    return e;
  };
  _ctor.prototype.getSkillList = function () {
    var t = [];
    if ($10UserDataProxy.userDataProxy.userData.gameCourseData.curId <= 3 && 1 == $10UserDataProxy.userDataProxy.userData.curChapter && 1 == $10UserDataProxy.userDataProxy.userData.curWave) {
      t.push($10DataManager.DataManager.instance.eData.dataskill[4001]);
      t.push($10DataManager.DataManager.instance.eData.dataskill[5001]);
      t.push($10DataManager.DataManager.instance.eData.dataskill[30001]);
      return t;
    }
    var e = $10DataManager.DataManager.instance.eData.dataskill;
    for (var i in e) {
      if ((a = e[i]).id % 1e4 != 5 && 1 == a.use) {
        if (a.equipId) {
          $10UserDataProxy.userDataProxy.combatEqus.indexOf(a.equipId) > -1 && $10UserDataProxy.userDataProxy.getPlantData(a.equipId).lv >= a.equipLevel && a.Weight > 0 && t.push(a);
        } else {
          t.push(a);
        }
      }
    }
    for (var n = t.length - 1; n >= 0; n--) {
      (a = t[n]).frontSkill && (exports.battleDataProxy.checkHasSkill(a.frontSkill) || t.splice(n, 1));
    }
    for (n = t.length - 1; n >= 0; n--) {
      var a;
      (a = t[n]).repeat || exports.battleDataProxy.checkHasSkill(a.id) && t.splice(n, 1);
    }
    return t;
  };
  _ctor.prototype.getIsCheckCollision = function (t) {
    return !(this.excludeCollisionView && this.excludeCollisionView.isValid && (!t || !t.isValid || this.excludeCollisionView.getBoundingBox().contains(t.getPosition())));
  };
  _ctor.prototype.uploadEndlessResult = function (t) {
    var e = "endless";
    $10DataManager.DataManager.instance.getIsZbRank() && (e = "endlessZB");
    var i = $10UserDataProxy.userDataProxy.userData.endlessData.maxWave;
    this.endlessCurWave > i && ($10UserDataProxy.userDataProxy.userData.endlessData.maxWave = i);
    var n = {
      key: e,
      sort: 0,
      value: exports.battleDataProxy.endlessCurWave
    };
    var a = JSON.stringify({
      params: $10HttpRequest.HttpRequest.inst.encryptStr(JSON.stringify(n))
    });
    $10HttpRequest.HttpRequest.inst.request("POST", "/rank/update", a).then(function (e) {
      console.log("上传成绩成功:", e);
      t && t(true);
    }).catch(function (e) {
      console.error("上传成绩失败：", e);
      t && t(false);
    });
  };
  _ctor.prototype.getEndlessRankDatas = function (t) {
    var e = "endless";
    $10DataManager.DataManager.instance.getIsZbRank() && (e = "endlessZB");
    var o = {
      key: e
    };
    var i = JSON.stringify({
      params: $10HttpRequest.HttpRequest.inst.encryptStr(JSON.stringify(o))
    });
    $10HttpRequest.HttpRequest.inst.request("POST", "/rank/list", i).then(function (e) {
      t && t(e);
      if (200 == e.code) {
        console.log("res:", e);
        var o = e.data.myRank;
        o && ($10UserDataProxy.userDataProxy.userData.endlessData.myRank = o.rank);
      }
    }).catch(function (t) {
      console.error("获取排行榜失败：", t);
    });
  };
  _ctor.prototype.getStageRewardCfg = function (t) {
    t || (t = $10UserDataProxy.userDataProxy.userData.curChapter);
    t < 1 && (t = 1);
    var e = $10DataManager.DataManager.instance.eData.datastagereward[t];
    if (!e) {
      var o = $10DataManager.DataManager.instance.eData.datastagereward;
      var i = Object.keys(o).length;
      var n = Object.keys(o)[i - 1];
      e = $10DataManager.DataManager.instance.eData.datastagereward[n];
    }
    return e;
  };
  _ctor.prototype.showBlockBoxRewardPopup = function () {
    var t = this;
    var e = 0;
    this.boxRewardTypes.length > 0 && (e = this.boxRewardTypes[0]);
    if (0 != e) {
      $10GameUIManager.gameUIMgr.showBlockBoxRewardPopup(e, function () {
        t.showBlockBoxRewardPopup();
      });
      this.boxRewardTypes.splice(0, 1);
    }
  };
  return _ctor;
}($10ProxyBase.ProxyBase);
exports.default = def_BattleDataProxy;
exports.battleDataProxy = new def_BattleDataProxy(exp_BattleData);