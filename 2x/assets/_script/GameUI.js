var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__values = __values;
var cc__read = __read;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.COL_MAX = exports.ROW_MAX = undefined;
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10PopupManager = require("PopupManager");
var $10AdsMgr = require("AdsMgr");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10GameUIManager = require("GameUIManager");
var $10AnimationMgr = require("AnimationMgr");
var $10SkillDataMgr = require("SkillDataMgr");
var $10BattleBaseInfoView = require("BattleBaseInfoView");
var $10BattleView = require("BattleView");
var $10BuildBase = require("BuildBase");
var $10BulletBall = require("BulletBall");
var $10ActiveSuperPlant = require("ActiveSuperPlant");
var $10EquipmentItem = require("EquipmentItem");
var $10FrenzyBar = require("FrenzyBar");
var $10MapBlockItem = require("MapBlockItem");
var $10MapGridItem = require("MapGridItem");
var $10SelectLayout = require("SelectLayout");
var $10CourseView = require("CourseView");
var $10SuperPlantMapItem = require("SuperPlantMapItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
exports.ROW_MAX = 11;
exports.COL_MAX = 6;
var def_GameUI = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mGridsLayout = null;
    e.mSelectLayout = null;
    e.mEquipmentNode = null;
    e.mBtnGetGrid = null;
    e.mBtnRefreshVideo = null;
    e.mBtnRefresh = null;
    e.mBtnLayout = null;
    e.mBulletBallPb = null;
    e.mBallView = null;
    e.mBattleBaseInfoView = null;
    e.mBattleView = null;
    e.mPathView = null;
    e.mBuildBase = null;
    e.mBtnRecycle = null;
    e.mPathPointView = null;
    e.mSuperPlantView = null;
    e.mChapterBg = null;
    e.mPathWallView = null;
    e.mMapBlockItemPb = null;
    e.mBlockLayout = null;
    e.mFrenzyBar = null;
    e.mZbTips = null;
    e.mBulletView = null;
    e._mapGridsData = [];
    e._gridsMap = new Map();
    e._selectEquipment = null;
    e._rowColInfo = null;
    e._lightGird = [];
    e._moveResult = null;
    e._freeRefreshCnt = 0;
    e._touchTime = 0;
    e._dealCoursMsg = false;
    e.mEquipBubbleIds = [];
    e.mComposeLinkDatas = [];
    e._isCanClick = true;
    e.mBuyBallPrice = [];
    e.mVideoSunshineNum = 0;
    e._selectEquipData = null;
    e._superPlantMapItem = null;
    e._isActiveSuperPlant = false;
    e._resumeBall = [];
    e._fightEquipData = null;
    e._isCanClickItem = true;
    e._pauseGameState = 0;
    e._blockTypes = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    for (var e = 0; e < this._resumeBall.length; ++e) {
      this._resumeBall[e] += t;
      if (this._resumeBall[e] >= 3) {
        this._resumeBall.splice(e--, 1);
        this.addBulletBall();
      }
    }
  };
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.node.on(cc.Node.EventType.TOUCH_START, this.touchBegin, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnded, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnded, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.PASS_WAVE, this.passWave, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.UPDATE_SUNSHINE, this.updateSunshine, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.RESURGENCE, this.resurgence, this);
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.UPDATE_VIDEO_CARD, this.updateVideoCardNum, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.SELECT_SUPER_PLANT, this.selectSuperPlant, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.GM_ADD_FIXEDPLANT, this.addFixedPlant, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.GM_ADD_BALL, this.addBulletBall, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.RESUME_BALL, this.resumeBall, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.CLEAN_BOSS_BALL, this.cleanBossBall, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.UPDATE_SUPER_PLANT_NUM, this.updateSuperPlantNum, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.MAP_BLOCK_DESTROY, this.mapBlockDestroy, this);
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.COURSE_OPEN, this.onCourseNotify, this);
    var e = $10BattleDataProxy.battleDataProxy.getStageRewardCfg().monsterList.replace("stage", "");
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/chapter/pic_bg_" + e,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      t.mChapterBg.spriteFrame = e;
    }).catch(function (t) {
      console.log("error:", t);
    });
    this.mBuyBallPrice = $10DataManager.DataManager.instance.eData.datapara[62].num.split("|").map(Number);
    this.mVideoSunshineNum = Number($10DataManager.DataManager.instance.eData.datapara[65].num);
    this.mBtnGetGrid.getChildByName("time").getComponent(cc.Label).string = "X" + this.mVideoSunshineNum;
    this.mBtnRecycle.active = false;
    this.updateVideoCardNum();
    this.mZbTips.active = ($10BattleDataProxy.battleDataProxy.isEndless || $10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE) && (yzll.gameConfig.isZB || yzll.gameConfig.debug);
    this.mZbTips.active && $10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE && (this.mZbTips.getComponent(cc.Label).string = "游戏主页=>通过第三章解锁>挑战模式");
    this.setWeatherBgSprite();
  };
  _ctor.prototype.onEnable = function () {};
  _ctor.prototype.setWeatherBgSprite = function () {
    var t = "";
    var e = "";
    var o = "";
    var i = "";
    var n = "";
    var a = "";
    var r = "";
    var s = this.node.getChildByName("root");
    var c = s.getChildByName("WallView").getChildByName("wall_right").getChildByName("fence");
    var l = s.getChildByName("WallView").getChildByName("wall_left").getChildByName("fence");
    var u = s.getChildByName("WallView").getChildByName("wall_bottom").getChildByName("fence");
    var p = s.getChildByName("topFence");
    if ($10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE) {
      if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.SandWind) {
        t = "textures/weatherBg/pic_ditu_da_tianqi4";
        e = "textures/weatherBg/pic_ditu_tianqi4";
        o = "textures/weather/pic_zhalan_qian_tianqi4";
        i = "textures/weather/pic_zhalan_zuo_tianqi4";
        n = "textures/weather/pic_zhalan_you_tianqi4";
        a = "textures/weatherBg/pic_BGzhezhao4";
      } else if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.IceAndSnow) {
        t = "textures/weatherBg/pic_ditu_da_tianqi5";
        e = "textures/weatherBg/pic_ditu_tianqi5";
        o = "textures/weather/pic_zhalan_qian_tianqi5";
        i = "textures/weather/pic_zhalan_zuo_tianqi5";
        n = "textures/weather/pic_zhalan_zuo_tianqi5";
        a = "textures/weatherBg/pic_BGzhezhao";
      } else {
        $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.HeavyFog && (a = "textures/weatherBg/pic_wuqi_shangxia");
      }
      if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.THUNDER) {
        r = "textures/weather/pic_tianqi1_zhezhao";
      } else if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.HeavyRain) {
        r = "textures/weather/pic_tianqi2_zhezhao";
      } else {
        $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.HeavyFog && (r = "textures/weather/pic_tianqi6_zhezhao");
      }
      var h = s.getChildByName("bg");
      var d = s.getChildByName("equipBg");
      "" != t && this.setSpriteFrame([h], t);
      "" != e && this.setSpriteFrame([d], e);
      if ("" != r) {
        var f = s.getChildByName("nightView").getChildByName("weatherMask");
        this.setSpriteFrame([f], r);
      }
      "" != o && this.setSpriteFrame([u, p], o);
      "" != i && this.setSpriteFrame([l], i);
      "" != n && this.setSpriteFrame([c], n);
      if ("" != a) {
        var y = null;
        y = $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.IceAndSnow || $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.HeavyFog ? s.getChildByName("BGzhezhao") : s.getChildByName("chapterBg").getChildByName("BGzhezhao");
        var g = this.node.getChildByName("BattleBaseInfoView").getChildByName("BGzhezhao");
        y.active = true;
        g.active = $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.IceAndSnow || $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.HeavyFog;
        this.setSpriteFrame([y, g], a);
        if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.IceAndSnow) {
          y.y = cc.winSize.height / 2 - 282;
        } else {
          $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.HeavyFog && (y.y = cc.winSize.height / 2 - 73.5);
        }
        g.y = -cc.winSize.height / 2;
      }
    }
  };
  _ctor.prototype.setSpriteFrame = function (t, e) {
    "" != e && $10ResUtil.ResUtil.loadAsset({
      path: e,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      for (var o = 0; o < t.length; ++o) {
        t[o].getComponent(cc.Sprite).spriteFrame = e;
      }
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.getIsCanShowEquipBubble = function (t) {
    for (var e = 0; e < this.mEquipBubbleIds.length; ++e) {
      if (this.mEquipBubbleIds[e] == t) {
        return false;
      }
    }
    return true;
  };
  _ctor.prototype.mapBlockDestroy = function (t) {
    var e = this._gridsMap.get(t);
    e && (e.getComponent($10MapGridItem.default).bValid = true);
  };
  _ctor.prototype.onDestroy = function () {
    this.node.off(cc.Node.EventType.TOUCH_START, this.touchBegin, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnded, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnded, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.PASS_WAVE, this.passWave, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.UPDATE_SUNSHINE, this.updateSunshine, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.RESURGENCE, this.resurgence, this);
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.UPDATE_VIDEO_CARD, this.updateVideoCardNum, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.SELECT_SUPER_PLANT, this.selectSuperPlant, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.GM_ADD_FIXEDPLANT, this.addFixedPlant, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.GM_ADD_BALL, this.addBulletBall, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.RESUME_BALL, this.resumeBall, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.CLEAN_BOSS_BALL, this.cleanBossBall, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.UPDATE_SUPER_PLANT_NUM, this.updateSuperPlantNum, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.MAP_BLOCK_DESTROY, this.mapBlockDestroy, this);
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.COURSE_OPEN, this.onCourseNotify, this);
  };
  _ctor.prototype.resumeBall = function () {
    this._resumeBall.push(0);
  };
  _ctor.prototype.updateVideoCardNum = function () {
    var t = this.mBtnGetGrid.getChildByName("videoIcon");
    $10BattleDataProxy.battleDataProxy.setVideoCardIcon(t, 3, 1.2);
  };
  _ctor.prototype.updateSunshine = function () {
    var t = $10BattleDataProxy.battleDataProxy.getPlantRefreshPrice();
    255 == this.mBtnRefresh.opacity && (this.mBtnRefresh.getComponent(cc.Button).interactable = $10BattleDataProxy.battleDataProxy.sunshineNum >= t);
    var e = $10BattleDataProxy.battleDataProxy.bulletBalls.length;
    var o = this.mBuyBallPrice[e - 1];
    this.mBtnRefreshVideo.getChildByName("desc").getComponent(cc.Label).string = "" + o;
    this.mBtnRefresh.getChildByName("num").getComponent(cc.Label).string = "" + t;
    this.setBtnSpriteMaterial();
    var i = this.mSelectLayout.children;
    for (var n = 0; n < i.length; ++n) {
      i[n].getComponent($10EquipmentItem.default).updatesunshineNum();
    }
  };
  _ctor.prototype.selectSuperPlant = function (t) {
    var e = this;
    this.mSuperPlantView.active = true;
    var o = this.mSuperPlantView.getChildByName("plantIcon");
    var i = this.mSuperPlantView.getChildByName("time");
    var n = $10BattleDataProxy.battleDataProxy.battleData.superPlantId;
    var a = $10DataManager.DataManager.instance.eData.datasuperplant[n];
    a || (a = $10DataManager.DataManager.instance.eData.datasuperplant[1]);
    var r = $10BattleDataProxy.battleDataProxy.getSuperPlantNum();
    i.getComponent(cc.Label).string = r + "/" + a.superNum;
    $10BattleDataProxy.battleDataProxy.topSuperId = n;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/superBigImg/pic_CWplant" + n,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      o.getComponent(cc.Sprite).spriteFrame = t;
    }).catch(function (t) {
      console.log("error:", t);
    });
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/superMapItem/SuperPlantMapItem" + n,
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      e._superPlantMapItem = cc.instantiate(t);
      e.mSuperPlantView.addChild(e._superPlantMapItem);
      e._superPlantMapItem.getComponent($10SuperPlantMapItem.default).init();
    }).catch(function (t) {
      console.log("error:", t);
    });
    $10UserDataProxy.userDataProxy.userData.gameCourseData.curId <= 1 && this.onCourseNotify(1);
    var s = $10BattleDataProxy.battleDataProxy.battleData.ballNum;
    this.addBulletBall(s);
    this.updateSunshine();
    $10BattleDataProxy.battleDataProxy.isEndless && $10GameUIManager.gameUIMgr.showSelectSkillPopup();
    if (t) {
      this.startFight();
    } else {
      this.initCarAnim();
    }
  };
  _ctor.prototype.updateSuperPlantNum = function () {
    var t = this;
    var e = $10BattleDataProxy.battleDataProxy.battleData.superPlantId;
    var o = $10DataManager.DataManager.instance.eData.datasuperplant[e];
    if (o) {
      var i = $10BattleDataProxy.battleDataProxy.getSuperPlantNum();
      var n = this.mSuperPlantView.getChildByName("rotateBg");
      var a = this.mSuperPlantView.getChildByName("plantIcon");
      this.mSuperPlantView.getChildByName("time").getComponent(cc.Label).string = i + "/" + o.superNum;
      var r = this.mSuperPlantView.getChildByName("notBg");
      var s = this.mSuperPlantView.getChildByName("notRotateBg");
      if (this._superPlantMapItem && this._superPlantMapItem.isValid) {
        var c = this._superPlantMapItem.getComponent($10SuperPlantMapItem.default).updateSuperPlantNum(i);
        if (c != this._isActiveSuperPlant) {
          this._isActiveSuperPlant = c;
          $10BattleDataProxy.battleDataProxy.isActiveSuperPlant = this._isActiveSuperPlant;
          if (this._isActiveSuperPlant) {
            r.active = false;
            s.active = false;
            $10Util.default.setSpriteNormalMaterial(a.getComponent(cc.Sprite));
            var u = cc.tween(n).by(.3, {
              angle: 90
            });
            cc.tween(n).repeatForever(u).start();
          } else {
            r.active = true;
            s.active = true;
            $10Util.default.setSpriteGrayMaterial(a.getComponent(cc.Sprite));
            n.angle = 0;
            cc.Tween.stopAllByTarget(n);
          }
          this._isActiveSuperPlant && $10BattleDataProxy.battleDataProxy.superPlantNum != i && $10ResUtil.ResUtil.loadAsset({
            bundleName: $10HomeEnum.Bundles.GAME,
            path: "prefabs/item/ActiveSuperPlant",
            type: cc.Prefab
          }).then(function (e) {
            if (t.node && t.node.isValid) {
              var o = cc.instantiate(e);
              t.node.addChild(o);
              o && o.isValid && o.getComponent($10ActiveSuperPlant.default).play();
            }
          });
          $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.UPDATE_SUPER_STATE);
        }
        $10BattleDataProxy.battleDataProxy.superPlantNum = i;
      } else {
        var h = $10DataManager.DataManager.instance.eData.datasuperplant[e];
        if (h) {
          var d = h.superNum <= i;
          this._isActiveSuperPlant = d;
          $10BattleDataProxy.battleDataProxy.isActiveSuperPlant = this._isActiveSuperPlant;
          d && $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.UPDATE_SUPER_STATE);
        }
      }
    }
  };
  _ctor.prototype.initUI = function () {
    var t = this;
    $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.READY;
    var e = this.node.getChildByName("top");
    $10BattleDataProxy.battleDataProxy.mTopUI = e;
    $10BattleDataProxy.battleDataProxy.numberView = this.node.getChildByName("root").getChildByName("numberView");
    $10BattleDataProxy.battleDataProxy.top1 = this.node.getChildByName("root").getChildByName("top");
    $10BattleDataProxy.battleDataProxy.blackHoleView = this.node.getChildByName("root").getChildByName("blackHoleView");
    $10BattleDataProxy.battleDataProxy.battleView = this.mBattleView;
    $10BattleDataProxy.battleDataProxy.house = this.mBuildBase;
    $10BattleDataProxy.battleDataProxy.equipRoot = this.mEquipmentNode;
    $10BattleDataProxy.battleDataProxy.pathPointView = this.mPathPointView;
    $10BattleDataProxy.battleDataProxy.gameUI = this.node;
    $10BattleDataProxy.battleDataProxy.iceView = this.node.getChildByName("root").getChildByName("iceView");
    $10BattleDataProxy.battleDataProxy.excludeCollisionView = this.node.getChildByName("root").getChildByName("excludeCollisionView");
    $10BattleDataProxy.battleDataProxy.waterView = this.node.getChildByName("root").getChildByName("wateView");
    $10BattleDataProxy.battleDataProxy.bulletView = this.mBulletView;
    this.mBattleBaseInfoView.getComponent($10BattleBaseInfoView.default).setTipsIsShow(true);
    e.getChildByName("BtnTest").active = yzll.gameConfig.gameTestBtn;
    this.mBattleView.getComponent($10BattleView.default).initBattleView();
    var o = [];
    if ($10BattleDataProxy.battleDataProxy.isEndless) {
      for (var i = 1; i < 7; ++i) {
        o.push(this.mPathView.getChildByName("routeEndless" + i));
      }
    } else {
      for (i = 1; i < 4; ++i) {
        o.push(this.mPathView.getChildByName("route" + i));
      }
    }
    $10BattleDataProxy.battleDataProxy.setEnemyMovePaths(o);
    var n = this.node.getChildByName("root").getChildByName("WallView");
    n.active = true;
    this.mSuperPlantView.active = false;
    var a = n.children;
    var r = function (t) {
      var e = a[t];
      var o = e.position.clone();
      s.scheduleOnce(function () {
        e.position = o;
      });
      console.log("childre:" + e.position);
    };
    var s = this;
    for (i = 0; i < a.length; ++i) {
      r(i);
    }
    this.scheduleOnce(function () {
      var e = $10BattleDataProxy.battleDataProxy.loadBattlePlantData();
      var o = null;
      var i = false;
      var n = null;
      var a = false;
      if (e && "" != e) {
        var r = JSON.parse(e);
        o = r.equipData;
        i = r.isBuyFixedPlant;
        n = r.mapBlockData;
        $10BattleDataProxy.battleDataProxy.battleData = r.battleData;
        for (var s = 0; s < $10BattleDataProxy.battleDataProxy.battleData.ownSkillList.length; ++s) {
          var c = $10BattleDataProxy.battleDataProxy.battleData.ownSkillList[s];
          $10SkillDataMgr.default.instance.pushSkillInfo(c.id);
        }
        a = true;
      } else if ($10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE) {
        $10BattleDataProxy.battleDataProxy.battleData.battleChapter = $10UserDataProxy.userDataProxy.userData.cursWeatherChapter;
      } else {
        $10BattleDataProxy.battleDataProxy.battleData.battleChapter = $10UserDataProxy.userDataProxy.userData.curChapter;
      }
      t.mBattleBaseInfoView.getComponent($10BattleBaseInfoView.default).initBattleBaseInfoView();
      t.mBuildBase.getComponent($10BuildBase.default).initBuildBase();
      t.loadBattlePlantData(o);
      t.addFixedPlant(null, i, function () {
        if (a) {
          t.selectSuperPlant(a);
        } else {
          $10BattleDataProxy.battleDataProxy.loadSuperFrameDatas(function () {
            $10GameUIManager.gameUIMgr.showRandomSuperPlantPopup();
          });
        }
      });
      var l = $10UserDataProxy.userDataProxy.userData.curChapter;
      var u = $10BattleDataProxy.battleDataProxy.getStageRewardCfg(l);
      t.addMapBlockItems(u, n);
      t.addWeatherEffect();
    });
    $10BattleDataProxy.battleDataProxy.pathWalls = [];
    for (i = 0; i < this.mPathWallView.childrenCount; ++i) {
      $10BattleDataProxy.battleDataProxy.pathWalls.push(this.mPathWallView.children[i]);
    }
    this.initMapGridsData();
    this.refreshSilverCoin();
  };
  _ctor.prototype.addMapBlockItems = function (t, e) {
    var o = t.plantPosition.split("|");
    var i = 0;
    this.mBlockLayout.removeAllChildren();
    $10BattleDataProxy.battleDataProxy.blockLayout = this.mBlockLayout;
    if (e) {
      var n = function (o) {
        var n = Math.floor(o / 8);
        var r = o % 8;
        var s = n - 1 + "-" + (r - 1);
        var c = e.findIndex(function (t) {
          return t.holdGrid == s;
        });
        var l = e[c];
        if (!l) {
          var u = a._gridsMap.get(s);
          if (u) {
            u.getComponent($10MapGridItem.default).belongTo = null;
            u.getComponent($10MapGridItem.default).bValid = true;
          }
          return "continue";
        }
        var p = l.stoneHp;
        var h = l.blockType;
        a.createMapBlockItemData(t, s, n, r, 720, h, p);
        i++;
      };
      var a = this;
      for (var r = 0; r < 104; ++r) {
        n(r);
      }
      $10BattleDataProxy.battleDataProxy.mapBlockNum = i;
    } else {
      this._blockTypes = [];
      var s = this.initBlockBoxRowCol();
      for (r = 0; r < 104; ++r) {
        var c = Math.floor(r / 8);
        var l = r % 8;
        var u = false;
        0 != l && 0 != c && 7 != l && 12 != c || (u = true);
        if (u || 0 == $10GameEnum.OrginMapGridsData[c - 1][l - 1]) {
          var p = c - 1 + "-" + (l - 1);
          if (!this.getIsFixedPlantGird(o, p)) {
            var h = 0;
            if (s.indexOf(p) >= 0 && this._blockTypes.length > 0) {
              var d = Math.floor(1e3 * Math.random()) % this._blockTypes.length;
              h = this._blockTypes[d];
              this._blockTypes.splice(d, 1);
            }
            this.createMapBlockItemData(t, p, c, l, 720, h);
            i++;
          }
        }
      }
      $10BattleDataProxy.battleDataProxy.mapBlockNum = i;
    }
  };
  _ctor.prototype.initBlockBoxRowCol = function () {
    return [];
  };
  _ctor.prototype.createMapBlockItemData = function (t, e, o, i, n, a, r) {
    var s = t.stoneHp;
    var c = t.stoneSun;
    if (2 == $10UserDataProxy.userDataProxy.userData.gameModel) {
      var l = $10UserDataProxy.userDataProxy.userData.cursWeatherChapter;
      c = $10DataManager.DataManager.instance.eData.data_weather[l].gold;
    }
    $10BattleDataProxy.battleDataProxy.isEndless && (c = Number($10DataManager.DataManager.instance.eData.datapara[1004].num));
    r || (r = s);
    var u = cc.instantiate(this.mMapBlockItemPb);
    this.mBlockLayout.addChild(u);
    u.getComponent($10MapBlockItem.default).initMapBlockItem(r, s, c, a);
    u.getComponent($10MapBlockItem.default).holdGrid = e;
    var p = -this.mBlockLayout.width / 2 + u.width * i + u.width / 2;
    var h = n - u.height * o + u.height / 2;
    u.position = cc.v3(p, h);
  };
  _ctor.prototype.getIsFixedPlantGird = function (t, e) {
    return !$10BattleDataProxy.battleDataProxy.isEndless && $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.NONE && t.length > 0 && t.indexOf(e) >= 0;
  };
  _ctor.prototype.loadBattlePlantData = function (t) {
    var e = this;
    if (!t) {
      var i = $10BattleDataProxy.battleDataProxy.loadBattlePlantData();
      t = i && "" != i ? JSON.parse(i + "") : [];
    }
    console.log("equipLayoutData:", t);
    for (var n = 0; n < exports.ROW_MAX * exports.COL_MAX; ++n) {
      var a = Math.floor(n / exports.COL_MAX) + "-" + n % exports.COL_MAX;
      var r = this._gridsMap.get(a);
      r && (r.getComponent($10MapGridItem.default).belongTo = null);
    }
    var s;
    var c = this.mEquipmentNode.children;
    var l = function (t) {
      var o = c[t];
      if (o.getComponent($10EquipmentItem.default).mIsFixedPlant) {
        o.getComponent($10EquipmentItem.default).holdGrids.forEach(function (t) {
          var i = e._gridsMap.get(t);
          i && (i.getComponent($10MapGridItem.default).belongTo = o);
        });
        s = t;
        return "continue";
      }
      o.destroy();
      o.removeFromParent();
      s = --t;
    };
    for (n = 0; n < c.length; ++n) {
      l(n);
      n = s;
    }
    var u = function (i) {
      var n = t[i];
      var a = $10GameEnum.EquipmentData["form" + n.dataFormIdx];
      var r = n.equipId;
      var s = "prefabItem/" + a.name;
      r && r >= 10001 && (s = "hybridPlant/Item" + r);
      $10ResUtil.ResUtil.loadAsset({
        path: s,
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        var i = cc.instantiate(t);
        e.mEquipmentNode.addChild(i);
        i.position = cc.v3(JSON.parse(n.pos));
        i.getComponent($10EquipmentItem.default).holdGrids = n.holdGrids;
        for (var a = 0; a < n.holdGrids.length; ++a) {
          var r = n.holdGrids[a].split("-").map(Number);
          e.mGridsLayout.children[r[0] * exports.COL_MAX + r[1]].getComponent($10MapGridItem.default).belongTo = i;
        }
        i.getComponent($10EquipmentItem.default).level = n.level;
        i.getComponent($10EquipmentItem.default).isPurchased = true;
        i.getComponent($10EquipmentItem.default).setCounterIsShow(true);
        i.getComponent($10EquipmentItem.default).equipId == $10BattleDataProxy.battleDataProxy.battleData.superPlantId && e.updateSuperPlantNum();
      }).catch(function (t) {
        console.log("error:", t);
      });
    };
    for (n = 0; n < t.length; ++n) {
      u(n);
    }
  };
  _ctor.prototype.initMapGridsData = function () {
    var t;
    this._mapGridsData = JSON.parse(JSON.stringify($10GameEnum.OrginMapGridsData));
    var e = this.mGridsLayout.children[0];
    for (var i = 0; i < e.children.length; ++i) {
      if ("Frame" == e.children[i].name) {
        e.children[i].children.forEach(function (t) {
          t.active = false;
        });
      } else {
        e.children[i].active = false;
      }
    }
    this.mGridsLayout.removeAllChildren();
    for (i = 0; i < exports.ROW_MAX * exports.COL_MAX; ++i) {
      var n = cc.instantiate(e);
      this.mGridsLayout.addChild(n);
      var a = Math.floor(i / exports.COL_MAX);
      var r = i % exports.COL_MAX;
      var s = a + "-" + r;
      n.getComponent($10MapGridItem.default).rowCol = s;
      n.getComponent($10MapGridItem.default).bValid = (null === (t = this._mapGridsData[a]) || undefined === t ? undefined : t[r]) > 0;
      this._gridsMap.set(s, this.mGridsLayout.children[i]);
    }
    for (i = 0; i < exports.ROW_MAX * exports.COL_MAX; ++i) {
      (n = this.mGridsLayout.children[i]).getComponent($10MapGridItem.default).checkBorderShow(this._mapGridsData);
    }
    $10BattleDataProxy.battleDataProxy.gridsMap = this._gridsMap;
  };
  _ctor.prototype.addFixedPlant = function (t, e, i) {
    var n = this;
    undefined === e && (e = false);
    if (t) {
      this.mEquipmentNode.removeAllChildren();
      this.updateSuperPlantNum();
      this._superPlantMapItem.getComponent($10SuperPlantMapItem.default).init();
      for (var a = 0; a < exports.ROW_MAX * exports.COL_MAX; ++a) {
        var r = this.mGridsLayout.children[a];
        r.getComponent($10MapGridItem.default).bValid = true;
        r.getComponent($10MapGridItem.default).belongTo = null;
      }
    } else {
      t = $10UserDataProxy.userDataProxy.userData.curChapter;
    }
    var s = $10BattleDataProxy.battleDataProxy.getStageRewardCfg(t);
    if ($10BattleDataProxy.battleDataProxy.isEndless || $10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE) {
      i && i();
    } else {
      var c = s.plant;
      if ("" != c) {
        var l = c.split("|").map(Number);
        var u = s.plantPosition.split("|");
        $10BattleDataProxy.battleDataProxy.fixedPlantAtkRate = l[1];
        var h = l[0];
        $10ResUtil.ResUtil.loadAsset({
          path: "fixedPlant/Item" + h,
          type: cc.Prefab,
          bundleName: $10HomeEnum.Bundles.GAME
        }).then(function (t) {
          var a = cc.instantiate(t);
          n.mEquipmentNode.addChild(a, 1);
          var r = $10GameEnum.EquipmentData["form" + a.getComponent($10EquipmentItem.default).dataFormIdx].center;
          var s = n._gridsMap.get(u[0]);
          var c = s.getComponent($10MapGridItem.default).gridSize;
          var l = s.position;
          var p = cc.v3(l.x + r[0] * c - 4, l.y - r[1] * c);
          a.position = p;
          a.getComponent($10EquipmentItem.default).holdGrids = u;
          for (var h = 0; h < u.length; ++h) {
            var d = u[h].split("-").map(Number);
            n.mGridsLayout.children[d[0] * exports.COL_MAX + d[1]].getComponent($10MapGridItem.default).belongTo = a;
          }
          a.getComponent($10EquipmentItem.default).level = 1;
          a.getComponent($10EquipmentItem.default).isPurchased = e;
          i && i();
        }).catch(function (t) {
          console.log("error:", t);
        });
      } else {
        i && i();
      }
    }
  };
  _ctor.prototype.initCarAnim = function () {
    this.mSelectLayout.getComponent($10SelectLayout.default).initData(this._gridsMap);
    this.mSelectLayout.active = true;
    this._dealCoursMsg = true;
  };
  _ctor.prototype.touchBegin = function (t) {
    var e = this;
    if (this._isCanClick && this._isCanClickItem) {
      this._selectEquipment = null;
      var o = t.getLocation();
      this._rowColInfo = null;
      this.setMapGridsBgStatus($10GameEnum.GridBgStatus.NONE);
      this._lightGird = [];
      this._touchTime = new Date().getTime();
      var i = $10BattleDataProxy.battleDataProxy.gameCamera;
      o.addSelf(cc.v2(i.position));
      var n = this.findSelectEquipment(o);
      if (n) {
        if (n.getComponent($10EquipmentItem.default).mIsFixedPlant) {
          if (n.getComponent($10EquipmentItem.default).isPurchased) {
            return void (this._selectEquipment = null);
          } else {
            return $10UserDataProxy.userDataProxy.getProp(4) > 0 ? ($10UserDataProxy.userDataProxy.addProp(4, -1), n.getComponent($10EquipmentItem.default).isPurchased = true, $10BattleDataProxy.battleDataProxy.isStartFight && this.saveBattlePlantData()) : (this.pauseGame(), $10AdsMgr.default.showVideoAds({
              id: 1,
              eventId: "unlock_fixedPlant_ad",
              success: function () {
                n.getComponent($10EquipmentItem.default).isPurchased = true;
                e.resumeGame();
                $10BattleDataProxy.battleDataProxy.isStartFight && e.saveBattlePlantData();
              },
              fail: function () {
                e.resumeGame();
              },
              error: function (t) {
                e.resumeGame();
                cc.log(t);
              }
            }, true)), void (this._selectEquipment = null);
          }
        }
        cc.Tween.stopAllByTarget(n);
        this._isCanClickItem = false;
        n.getComponent($10EquipmentItem.default).bAnim = true;
        n.getComponent($10EquipmentItem.default).setIsCollider(false);
        n.getComponent($10EquipmentItem.default).setCounterIsShow(false);
      }
      this._selectEquipment || (this._selectEquipment = n);
      this.setComposeLink();
      if (this._selectEquipment) {
        this._selectEquipment.setSiblingIndex(999);
        var a = this.mSelectLayout.convertToNodeSpaceAR(o);
        this._selectEquipment.position = cc.v3(a.x, a.y);
        this.mSelectLayout.getComponent($10SelectLayout.default).confirmItemsPos(true, this._selectEquipment);
        this.dealSelectEquipMove(o);
        this._selectEquipment.getComponent($10EquipmentItem.default).setPriceLabIsShow(false);
        if (!$10BattleDataProxy.battleDataProxy.isStartFight) {
          var r = n.getComponent($10EquipmentItem.default);
          var s = r.equipId;
          var c = r.level;
          for (var l = 0; l < this.mEquipmentNode.children.length; ++l) {
            var u = this.mEquipmentNode.children[l].getComponent($10EquipmentItem.default);
            if (!u.getComponent($10EquipmentItem.default).mIsFixedPlant && u.level < this.getComposeMaxLevel(u.equipId) && u.equipId == s && u.level == c) {
              var p = u.getComponent($10EquipmentItem.default).root.getChildByName("itemIcon");
              var h = cc.tween(p).by(.1, {
                angle: -10
              }).by(.1, {
                angle: 10
              }).by(.1, {
                angle: 10
              }).by(.1, {
                angle: -10
              }).delay(.5);
              cc.tween(p).repeatForever(h).start();
              break;
            }
          }
        }
      }
    }
  };
  _ctor.prototype.setComposeLink = function () {
    for (var t = 0; t < this.mComposeLinkDatas.length; ++t) {
      var e = this.mComposeLinkDatas[t];
      var o = e.itemLink;
      var i = $10Util.default.convertToTargetNodeSpace(this._selectEquipment, o);
      o.position = i;
      var n = $10Util.default.convertToTargetNodeSpace(e.equipItem, o);
      var a = $10MathUtil.MathUtil.getDoublPointRadian(i, n);
      var r = $10MathUtil.MathUtil.getAngle(a);
      o.angle = r + 90;
      var s = $10MathUtil.MathUtil.distance(n, i);
      o.scaleY = s / 500;
    }
  };
  _ctor.prototype.getComposeMaxLevel = function (t) {
    if (($10UserDataProxy.userDataProxy.getPlantData(t).lv || 0) >= this.getSuperUnlockLevel(t)) {
      return 5;
    } else {
      return 4;
    }
  };
  _ctor.prototype.getSuperUnlockLevel = function (t) {
    var e = $10DataManager.DataManager.instance.eData.dataplant[t].skillId.split("|").map(Number);
    for (var o = 0; o < e.length; ++o) {
      if (e[o] % 1e4 == 5) {
        return o + 1;
      }
    }
    return 5;
  };
  _ctor.prototype.getIsHaveGrids = function (t, e) {
    for (var o = 0; o < t.length; ++o) {
      if (t[o].mapGridKey == e.mapGridKey) {
        return true;
      }
    }
    return false;
  };
  _ctor.prototype.updateAllDisGrids = function (t, e) {
    for (var o = 0; o < e.length; ++o) {
      var i = e[o];
      this.getIsHaveGrids(t, i) || t.push(i);
    }
    return t;
  };
  _ctor.prototype.dealSelectEquipMove = function (t) {
    var e;
    var o = this.findRowCol(t);
    var i = this._selectEquipment.getComponent($10EquipmentItem.default).grids;
    var n = [];
    for (var a = 0; a < i.length; ++a) {
      var r = i[a];
      var s = this.getcheckGridIsBeLinked(o, r);
      n = this.updateAllDisGrids(n, s);
    }
    e = this._selectEquipment.getComponent($10EquipmentItem.default).checkGridIsBeLinked(n, this._gridsMap);
    this._moveResult = e;
    if (e) {
      this.setMapGridsBgStatus($10GameEnum.GridBgStatus.NONE, e);
      this._lightGird = [];
      for (a = 0; a < e.length; ++a) {
        var c = this._gridsMap.get(e[a]);
        if (c) {
          var l = c.getComponent($10MapGridItem.default).bValid ? $10GameEnum.GridBgStatus.CHECK_EMPTY : $10GameEnum.GridBgStatus.CHECK_HOLD;
          c.getComponent($10MapGridItem.default).setBgStatus(l);
          this._lightGird.push(c);
        }
      }
    } else {
      this.setMapGridsBgStatus($10GameEnum.GridBgStatus.NONE, []);
    }
  };
  _ctor.prototype.touchMoved = function (t) {
    if (this._isCanClick && this._selectEquipment && this._selectEquipment.isValid) {
      var e = t.getLocation();
      var o = $10BattleDataProxy.battleDataProxy.gameCamera;
      e.addSelf(cc.v2(o.position));
      var i = this.mSelectLayout.convertToNodeSpaceAR(e.clone());
      this._selectEquipment.position = cc.v3(i.x, i.y);
      this.dealSelectEquipMove(e);
      this.setComposeLink();
    }
  };
  _ctor.prototype.getcheckGridIsBeLinked = function (t, e) {
    var o = [];
    for (var i = t.row - 1; i <= t.row + 1; ++i) {
      for (var n = t.col - 1; n <= t.col + 1; ++n) {
        var a = i + "-" + n;
        var r = this._gridsMap.get(a);
        if (r && r.getComponent($10MapGridItem.default).isValid) {
          var s = e.getBoundingBoxToWorld();
          var c = r.getBoundingBoxToWorld();
          if (c.intersects(s)) {
            var l = new cc.Rect();
            c.intersection(l, s);
            var u = l.width * l.height;
            o.push({
              node: r,
              area: u,
              mapGridKey: a
            });
          }
        }
      }
    }
    return o;
  };
  _ctor.prototype.touchEnded = function (t) {
    var e = this;
    if (this._isCanClick) {
      for (var o = 0; o < this.mComposeLinkDatas.length; ++o) {
        var i = this.mComposeLinkDatas[o].itemLink;
        $10NodePoolManager.default.instance.putNode(i);
      }
      this.mComposeLinkDatas.length = 0;
      if (this._selectEquipment) {
        var n = t.getLocation();
        var a = $10BattleDataProxy.battleDataProxy.gameCamera;
        n.addSelf(cc.v2(a.position));
        var r = this.findRowCol(n);
        new Date().getTime() - this._touchTime < 130 && this._selectEquipment.getComponent($10EquipmentItem.default).equipId;
        var s = this._selectEquipment.getComponent($10EquipmentItem.default).isPurchased;
        if (s) {
          var c = this.mBtnRecycle.parent.convertToNodeSpaceAR(n.clone());
          if (this.mBtnRecycle.getBoundingBox().contains(c) && this.mBtnRecycle.active) {
            var u = this._selectEquipment.getComponent($10EquipmentItem.default).equipId;
            var p = this._selectEquipment.getComponent($10EquipmentItem.default).level;
            var d = $10BattleDataProxy.battleDataProxy.getRecyclePlantPrice(u, p);
            var f = $10BattleDataProxy.battleDataProxy.sunshineNum;
            f += d;
            $10BattleDataProxy.battleDataProxy.sunshineNum = f;
            this._selectEquipment.destroy();
            this._selectEquipment.removeFromParent();
            this._selectEquipment = null;
            $10AnimationMgr.default.instance.showAwardAni({
              id: 8,
              num: d
            }, this.node, this.mBtnRecycle);
            this.mBtnRecycle.active = false;
            this.updateSuperPlantNum();
            this.initEquipmentNode();
            return void (this._isCanClickItem = true);
          }
        }
        this.mBtnRecycle.active = false;
        var y = false;
        if (-1 != r.row && -1 != r.col) {
          var P = !!this._moveResult;
          if (P) {
            for (o = 0; o < this._moveResult.length; ++o) {
              var S = this._moveResult[o];
              if (!this._gridsMap.get(S).getComponent($10MapGridItem.default).bValid) {
                P = false;
                break;
              }
            }
          }
          if (this._moveResult && P) {
            var E = function () {
              var t = false;
              var o = C._moveResult.toString();
              var i = C._selectEquipment.getComponent($10EquipmentItem.default).level;
              var n = C._selectEquipment.getComponent($10EquipmentItem.default).dataFormIdx;
              var a = function (a) {
                var r = C.mEquipmentNode.children[a];
                if (r.getComponent($10EquipmentItem.default).mIsFixedPlant) {
                  return "continue";
                }
                if ($10BattleDataProxy.battleDataProxy.isStartFight) {
                  return "continue";
                }
                var s = r.getComponent($10EquipmentItem.default).holdGrids;
                var c = r.getComponent($10EquipmentItem.default).level;
                var l = r.getComponent($10EquipmentItem.default).dataFormIdx;
                if (c < C.getComposeMaxLevel(r.getComponent($10EquipmentItem.default).mEquipId) && s.toString() == o && c == i && l == n) {
                  var u = C._selectEquipment;
                  t = true;
                  C.getIsCanPlacePlant(true, function (t) {
                    if (t) {
                      var o = $10Util.default.convertToTargetNodeSpace(r, e.node);
                      ++r.getComponent($10EquipmentItem.default).level;
                      u.removeFromParent();
                      e.setEffectEquipUpgrade(cc.v3(o), e.node);
                      r.getComponent($10EquipmentItem.default).checkIsActive();
                      e.mSelectLayout.getComponent($10SelectLayout.default).orderItems();
                      e.mSelectLayout.getComponent($10SelectLayout.default).confirmItemsPos(true);
                      y = true;
                      r.getComponent($10EquipmentItem.default).holdGrids.forEach(function (t) {
                        e._gridsMap.get(t).getChildByName("Course").active = false;
                      });
                      e.updateSuperPlantNum();
                    }
                    u.getComponent($10EquipmentItem.default).bAnim = false;
                    e.placePlantResult(y, u.getComponent($10EquipmentItem.default).isPurchased);
                  });
                  return "break";
                }
              };
              for (var r = 0; r < C.mEquipmentNode.children.length && "break" !== a(r); ++r) {
                ;
              }
              if (t) {
                return "break";
              }
              var c = false;
              var u = [];
              C._moveResult.forEach(function (t) {
                var o = e._gridsMap.get(t);
                var i = o.getComponent($10MapGridItem.default).belongTo;
                o.getComponent($10MapGridItem.default).isBlackHole && (c = true);
                i && !u.includes(i) && u.push(i);
              });
              if (c) {
                console.log("这个地方有黑洞");
                C.placePlantResult(y, s);
                return "break";
              }
              if (u.length > 0) {
                console.log("这个地方有东西:");
                C.placePlantResult(y, s);
                return "break";
              }
              var p = C._selectEquipment;
              var d = C._moveResult.slice();
              var f = p.getComponent($10EquipmentItem.default).isPurchased;
              C.getIsCanPlacePlant(false, function (t) {
                var o;
                if (t) {
                  p.getComponent($10EquipmentItem.default).holdGrids = d.slice();
                  p.getComponent($10EquipmentItem.default).checkIsActive();
                  p.getComponent($10EquipmentItem.default).setCounterIsShow(true);
                  d.forEach(function (t) {
                    e._gridsMap.get(t).getComponent($10MapGridItem.default).belongTo = p;
                  });
                  var i = $10GameEnum.EquipmentData["form" + p.getComponent($10EquipmentItem.default).dataFormIdx].center;
                  var n = e._gridsMap.get(d[0]);
                  var a = n.getComponent($10MapGridItem.default).gridSize;
                  var r = n.position;
                  var s = cc.v3(r.x + i[0] * a - 4, r.y - i[1] * a);
                  p.parent = e.mEquipmentNode;
                  p.position = s;
                  e.mSelectLayout.getComponent($10SelectLayout.default).orderItems();
                  e.mSelectLayout.getComponent($10SelectLayout.default).confirmItemsPos(true);
                  y = true;
                  e.updateSuperPlantNum();
                  p.getComponent($10EquipmentItem.default).equipId != $10BattleDataProxy.battleDataProxy.battleData.superPlantId || f || (e.mSelectLayout.getComponent($10SelectLayout.default).superRefreshNum = 0);
                  if (e.mSelectLayout.childrenCount <= 0) {
                    if (1 == $10UserDataProxy.userDataProxy.userData.gameCourseData.curId) {
                      $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.LOSE_COURSE_VIEW);
                      $10UserDataProxy.userDataProxy.completeCourse(2);
                    }
                  } else if (1 == $10UserDataProxy.userDataProxy.userData.gameCourseData.curId) {
                    var c = $10PopupManager.PopupManager.instance.getPopup("CoursePopup");
                    if (c && c.isValid) {
                      var u = [e._gridsMap.get("5-1"), e._gridsMap.get("5-2"), e._gridsMap.get("5-3")];
                      var g = null;
                      for (var b = 0; b < u.length; ++b) {
                        var P = u[b];
                        if (P && P.isValid && !P.getComponent($10MapGridItem.default).belongTo) {
                          g = P;
                          break;
                        }
                      }
                      g && (null === (o = c.getComponent($10CourseView.default)) || undefined === o || o.updateMoveTargetNode(e.mSelectLayout.children[0], g));
                    }
                  }
                }
                e.placePlantResult(y, p.getComponent($10EquipmentItem.default).isPurchased);
                p.getComponent($10EquipmentItem.default).bAnim = false;
              });
            };
            var C = this;
            do {
              if ("break" === E()) {
                break;
              }
            } while (0);
          } else {
            this.placePlantResult(y, s);
          }
        } else {
          this.placePlantResult(y, s);
        }
      }
    }
  };
  _ctor.prototype.placePlantResult = function (t, e) {
    this.initEquipmentNode();
    if (t) {
      this._isCanClickItem = true;
      this._selectEquipment && this._selectEquipment.isValid && (this._selectEquipment.getComponent($10EquipmentItem.default).bAnim = false);
    } else if (e) {
      this.placeFailBack();
    } else {
      this.mSelectLayout.getComponent($10SelectLayout.default).orderItems();
      this.mSelectLayout.getComponent($10SelectLayout.default).confirmItemsPos(true);
      this._selectEquipment && this._selectEquipment.isValid && (this._selectEquipment.getComponent($10EquipmentItem.default).bAnim = false);
      this._isCanClickItem = true;
    }
    this._selectEquipment = null;
    this._moveResult = null;
    this._rowColInfo = null;
    this.setMapGridsBgStatus($10GameEnum.GridBgStatus.NONE);
    this._lightGird = [];
  };
  _ctor.prototype.initEquipmentNode = function () {
    for (var t = 0; t < this.mEquipmentNode.children.length; ++t) {
      var e = this.mEquipmentNode.children[t].getChildByName("root").getChildByName("itemIcon");
      cc.Tween.stopAllByTarget(e);
      e.angle = 0;
    }
  };
  _ctor.prototype.placeFailBack = function () {
    var t = this;
    if (this._selectEquipData) {
      var e = this._selectEquipment.convertToWorldSpaceAR(cc.v3());
      var o = this.mEquipmentNode.convertToNodeSpaceAR(e);
      this._selectEquipment.parent = this.mEquipmentNode;
      this._selectEquipment.position = o;
      var i = this._selectEquipment;
      cc.Tween.stopAllByTarget(i);
      cc.tween(i).to(.1, {
        position: this._selectEquipData.pos
      }).call(function () {
        i.scale = 1;
        i.getComponent($10EquipmentItem.default).bAnim = false;
        i.getComponent($10EquipmentItem.default).checkIsActive();
        i.getComponent($10EquipmentItem.default).setCounterIsShow(true);
        t._isCanClickItem = true;
      }).start();
      var n = this._selectEquipData.holdGrids;
      for (var a = 0; a < n.length; ++a) {
        var r = n[a];
        var s = this._gridsMap.get(r);
        if (!s) {
          return;
        }
        s.getComponent($10MapGridItem.default).belongTo = i;
      }
    } else {
      this._selectEquipment && this._selectEquipment.isValid && (this._selectEquipment.getComponent($10EquipmentItem.default).bAnim = false);
      this.mSelectLayout.getComponent($10SelectLayout.default).orderItems();
      this.mSelectLayout.getComponent($10SelectLayout.default).confirmItemsPos(true);
      this._isCanClickItem = true;
    }
  };
  _ctor.prototype.getIsCanPlacePlant = function (t, e) {
    var o = this;
    if (t) {
      var i = this._selectEquipment.getComponent($10EquipmentItem.default).equipId;
      if ($10UserDataProxy.userDataProxy.userData.gameCourseData.curId <= 3 && !$10BattleDataProxy.battleDataProxy.isActiveSuperPlant && i == $10BattleDataProxy.battleDataProxy.battleData.superPlantId) {
        $10GameUIManager.gameUIMgr.showTips("请先合成超级植物!");
        return void (e && e(false));
      }
    }
    if (!t && this._selectEquipment.getComponent($10EquipmentItem.default).mIsHybridPlant) {
      var n = false;
      var a = this.mEquipmentNode.children;
      for (var r = 0; r < a.length; ++r) {
        if (a[r].getComponent($10EquipmentItem.default).mIsHybridPlant) {
          n = true;
          break;
        }
      }
      if (n) {
        $10GameUIManager.gameUIMgr.showTips("只能上阵一个杂交植物!");
        return void (e && e(false));
      }
    }
    if (this._selectEquipment.getComponent($10EquipmentItem.default).isPurchased) {
      e && e(true);
    } else if (this._selectEquipment.getComponent($10EquipmentItem.default).isBeWindUp) {
      e && e(false);
    } else if (this._selectEquipment.getComponent($10EquipmentItem.default).adFlag) {
      if ($10UserDataProxy.userDataProxy.getProp(4) > 0) {
        $10UserDataProxy.userDataProxy.addProp(4, -1);
        this._selectEquipment.getComponent($10EquipmentItem.default).isPurchased = true;
        e && e(true);
      } else {
        var s = this._selectEquipment;
        this.pauseGame();
        $10AdsMgr.default.showVideoAds({
          id: 1,
          eventId: "purchased_plant_ad",
          success: function () {
            o.resumeGame();
            s.getComponent($10EquipmentItem.default).isPurchased = true;
            e && e(true);
          },
          fail: function () {
            o.resumeGame();
            e && e(false);
          },
          error: function () {
            o.resumeGame();
            e && e(false);
          }
        }, true);
      }
    } else {
      var c = this._selectEquipment.getComponent($10EquipmentItem.default).purchasePlant();
      if (!c) {
        $10GameUIManager.gameUIMgr.showTips("阳光不足");
        this.showVideoSunshinePopup();
      }
      e && e(c);
    }
  };
  _ctor.prototype.setSelectEquipData = function (t) {
    if (t.getComponent($10EquipmentItem.default).isPurchased) {
      if (t.getComponent($10EquipmentItem.default).mIsFixedPlant) {
        return;
      }
      var e = $10UserDataProxy.userDataProxy.userData.gameCourseData.curId;
      this.mBtnRecycle.active = !(e <= 3 || $10BattleDataProxy.battleDataProxy.isStartFight);
      var o = this.mBtnRecycle.getChildByName("layout").getChildByName("priceNum");
      var i = t.getComponent($10EquipmentItem.default).equipId;
      var n = t.getComponent($10EquipmentItem.default).level;
      var a = $10BattleDataProxy.battleDataProxy.getRecyclePlantPrice(i, n);
      o.getComponent(cc.Label).string = "x" + a;
      var r = t.getComponent($10EquipmentItem.default).holdGrids;
      this._selectEquipData = {
        pos: t.position.clone(),
        holdGrids: r
      };
    }
  };
  _ctor.prototype.findSelectEquipment = function (t) {
    var e = this;
    for (var o = 0; o < this.mSelectLayout.children.length; ++o) {
      if ((i = this.mSelectLayout.children[o]).getBoundingBoxToWorld().contains(t) && i.getComponent($10EquipmentItem.default).canClick) {
        return i;
      }
    }
    for (o = 0; o < this.mEquipmentNode.children.length; ++o) {
      var i;
      if ((i = this.mEquipmentNode.children[o]).getComponent($10EquipmentItem.default).isTakeEffect && !i.getComponent($10EquipmentItem.default).isBeWindUp && i.getBoundingBoxToWorld().contains(t) && i.getComponent($10EquipmentItem.default).canClick) {
        if (i.getComponent($10EquipmentItem.default).isIce) {
          return i.getComponent($10EquipmentItem.default).iceBreaker(), null;
        } else {
          return i.getComponent($10EquipmentItem.default).equipItemClick(), this.setSelectEquipData(i), i.getComponent($10EquipmentItem.default).mIsFixedPlant ? i : (i.parent = this.mSelectLayout, i.getComponent($10EquipmentItem.default).holdGrids.forEach(function (t) {
            e._gridsMap.get(t).getComponent($10MapGridItem.default).belongTo = null;
          }), i);
        }
      }
    }
    return null;
  };
  _ctor.prototype.findRowCol = function (t) {
    var e = -1;
    var i = -1;
    var n = this.mGridsLayout.convertToNodeSpaceAR(t);
    var a = this.mGridsLayout.width;
    var r = this.mGridsLayout.height;
    if (!new cc.Rect(this.mGridsLayout.x - a / 2 - this.mGridsLayout.x, 0, a, r).contains(n)) {
      return {
        row: e,
        col: i
      };
    }
    var s = 999;
    for (var c = 0; c < exports.ROW_MAX; ++c) {
      var l = this.mGridsLayout.children[c * exports.COL_MAX];
      if ((p = cc.v3(0, n.y).subtract(cc.v3(0, l.y)).len()) < s) {
        e = c;
        s = p;
      }
    }
    s = 999;
    for (var u = 0; u < exports.COL_MAX; ++u) {
      var p;
      l = this.mGridsLayout.children[u];
      if ((p = cc.v3(n.x, 0).subtract(cc.v3(l.x, 0)).len()) < s) {
        i = u;
        s = p;
      }
    }
    return {
      row: e,
      col: i
    };
  };
  _ctor.prototype.setMapGridsStatus = function (t, e) {
    var o;
    var i;
    try {
      var n = cc__values(this._gridsMap);
      for (var a = n.next(); !a.done; a = n.next()) {
        var c = cc__read(a.value, 2);
        c[0];
        var l = c[1];
        if (e) {
          l.getComponent($10MapGridItem.default).setGridStatus(t);
        } else {
          l.getComponent($10MapGridItem.default).bValid || l.getComponent($10MapGridItem.default).setGridStatus(t);
        }
      }
    } catch (u) {
      o = {
        error: u
      };
    } finally {
      try {
        a && !a.done && (i = n.return) && i.call(n);
      } finally {
        if (o) {
          throw o.error;
        }
      }
    }
  };
  _ctor.prototype.setMapGridsBgStatus = function (t, e) {
    this._lightGird.forEach(function (o) {
      e && e.includes(o.getComponent($10MapGridItem.default).rowCol) || o.getComponent($10MapGridItem.default).setBgStatus(t);
    });
  };
  _ctor.prototype.showVideoSunshinePopup = function () {
    var t = this;
    $10BattleDataProxy.battleDataProxy.isEndless && $10BattleDataProxy.battleDataProxy.endlessVideoSunNum <= 0 || $10GameUIManager.gameUIMgr.showVideoSunshinePopup(function () {
      t.addSunshineNum();
    });
  };
  _ctor.prototype.updateEndlessVideoSunNum = function () {
    if ($10BattleDataProxy.battleDataProxy.isEndless) {
      var t = $10BattleDataProxy.battleDataProxy.endlessVideoSunNum;
      t--;
      $10BattleDataProxy.battleDataProxy.endlessVideoSunNum = t;
      $10BattleDataProxy.battleDataProxy.endlessVideoSunNum <= 0 && (this.mBtnGetGrid.active = false);
    }
  };
  _ctor.prototype.addSunshineNum = function () {
    var t = this;
    if (!($10BattleDataProxy.battleDataProxy.isEndless && $10BattleDataProxy.battleDataProxy.endlessVideoSunNum <= 0)) {
      if ($10UserDataProxy.userDataProxy.getProp(4) > 0) {
        $10UserDataProxy.userDataProxy.addProp(4, -1);
        var e = $10BattleDataProxy.battleDataProxy.sunshineNum;
        e += this.mVideoSunshineNum;
        $10BattleDataProxy.battleDataProxy.sunshineNum = e;
        this.updateEndlessVideoSunNum();
      } else {
        this.pauseGame();
        $10AdsMgr.default.showVideoAds({
          id: 1,
          eventId: "add_sunshine_ad",
          success: function () {
            t.resumeGame();
            t.addSunshineNumEx(t.mVideoSunshineNum, t.mBtnGetGrid);
            t.updateEndlessVideoSunNum();
          },
          fail: function () {
            t.resumeGame();
          },
          error: function (e) {
            t.resumeGame();
            cc.log(e);
          }
        }, true);
      }
    }
  };
  _ctor.prototype.btnCallback = function (t, e) {
    var o = this;
    if (this._isCanClick) {
      this._isCanClick = false;
      this.scheduleOnce(function () {
        o._isCanClick = true;
      }, .5);
      switch (e) {
        case "btn_refresh":
          var i = $10BattleDataProxy.battleDataProxy.getPlantRefreshPrice();
          if ((n = $10BattleDataProxy.battleDataProxy.sunshineNum) < i) {
            $10GameUIManager.gameUIMgr.showTips("阳光不足");
            return void this.showVideoSunshinePopup();
          }
          n -= i;
          $10BattleDataProxy.battleDataProxy.sunshineNum = n;
          this.mSelectLayout.getComponent($10SelectLayout.default).refreshSeletItems(this._gridsMap, false, true);
          break;
        case "btn_refresh_video":
          var n;
          var a = $10BattleDataProxy.battleDataProxy.battleData.ballNum;
          var r = this.mBuyBallPrice[a - 1];
          r || (r = 300);
          if ((n = $10BattleDataProxy.battleDataProxy.sunshineNum) < r) {
            $10GameUIManager.gameUIMgr.showTips("阳光不足");
            return void this.showVideoSunshinePopup();
          }
          n -= r;
          a++;
          $10BattleDataProxy.battleDataProxy.battleData.ballNum = a;
          this.addBulletBall();
          $10BattleDataProxy.battleDataProxy.sunshineNum = n;
          $10BattleDataProxy.battleDataProxy.saveData();
          break;
        case "btn_start_fight":
          var s = this.mEquipmentNode.childrenCount;
          1 == this.mEquipmentNode.childrenCount && this.mEquipmentNode.children[0].getComponent($10EquipmentItem.default).mIsFixedPlant && s--;
          if (s <= 0) {
            return void $10GameUIManager.gameUIMgr.showTips("请至少上阵一种植物！");
          }
          if ($10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE) {
            $10BattleDataProxy.battleDataProxy.battleData.battleWave = $10UserDataProxy.userDataProxy.userData.curWeatherWave;
          } else {
            $10BattleDataProxy.battleDataProxy.battleData.battleWave = $10UserDataProxy.userDataProxy.userData.curWave;
          }
          this.saveBattlePlantData();
          var u = 0;
          if ($10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE) {
            u = 20;
          } else {
            var p = $10UserDataProxy.userDataProxy.userData.curChapter;
            var d = $10BattleDataProxy.battleDataProxy.getStageRewardCfg(p);
            u = Number(d.wave);
          }
          if (u <= $10UserDataProxy.userDataProxy.userData.curWave) {
            $10AudioManager.AudioManager.instance.playEffectPath("sounds/startEnd", $10HomeEnum.Bundles.RES);
          } else {
            $10AudioManager.AudioManager.instance.playEffectPath("sounds/startBattle", $10HomeEnum.Bundles.RES);
          }
          this._dealCoursMsg = false;
          this._isCanClick = false;
          this.startFight();
          $10BattleDataProxy.battleDataProxy.pushFirstPlayChapter();
          if (2 == $10UserDataProxy.userDataProxy.userData.gameCourseData.curId) {
            $10UserDataProxy.userDataProxy.completeCourse(3);
            $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.LOSE_COURSE_VIEW);
          }
          break;
        case "btn_get_grid":
          this.addSunshineNum();
          break;
        case "BtnSet":
          $10GameUIManager.gameUIMgr.showGameSettingPopup(true);
          break;
        case "BtnTest":
          $10PopupManager.PopupManager.instance.show({
            bundleName: $10HomeEnum.Bundles.GAME,
            path: "uis/root/TestNode",
            keep: true
          });
          break;
        case "BtnSuperPlant":
          $10GameUIManager.gameUIMgr.showSuperPlantMapPopup();
      }
    }
  };
  _ctor.prototype.addBulletBall = function (t) {
    undefined === t && (t = 1);
    var e = [];
    for (var i = 0; i < exports.ROW_MAX * exports.COL_MAX; ++i) {
      var n = Math.floor(i / exports.COL_MAX) + "-" + i % exports.COL_MAX;
      var a = this._gridsMap.get(n);
      if (a) {
        var r = a.getComponent($10MapGridItem.default).belongTo;
        var s = a.getComponent($10MapGridItem.default).bValid;
        !r && s && e.push(a);
      }
    }
    for (i = 0; i < t; ++i) {
      var c = cc.instantiate(this.mBulletBallPb);
      this.mBallView.addChild(c);
      var l = cc.v3(-141, -218, 0);
      if (e.length > 0) {
        var u = Math.floor(100 * Math.random()) % e.length;
        var p = e[u];
        l = $10Util.default.convertToTargetNodeSpace(p, c);
        e.splice(u, 1);
      }
      c.position = l;
      c.getComponent($10BulletBall.default).initBulletBall(i);
      $10BattleDataProxy.battleDataProxy.bulletBalls.push(c);
    }
    var h = Number($10DataManager.DataManager.instance.eData.datapara[61].num);
    $10BattleDataProxy.battleDataProxy.battleData.ballNum >= h && (this.mBtnRefreshVideo.active = false);
  };
  _ctor.prototype.startFight = function () {
    var t = this;
    var e = $10BattleDataProxy.battleDataProxy.gameCamera;
    e.y = 0;
    $10BattleDataProxy.battleDataProxy.isStartFight = true;
    this.mSuperPlantView.active = false;
    cc.tween(e).by(.5, {
      position: cc.v3(0, 196)
    }).call(function () {
      t.mBattleView.getComponent($10BattleView.default).startFight();
      t._isCanClick = true;
    }).start();
    cc.Tween.stopAllByTarget(this.mSelectLayout);
    cc.tween(this.mSelectLayout).by(.5, {
      position: cc.v3(0, -196)
    }).call(function () {
      t.mBattleBaseInfoView.getComponent($10BattleBaseInfoView.default).seBattleUiIsShow(true);
      t.mSelectLayout.removeAllChildren();
    }).start();
    cc.Tween.stopAllByTarget(this.mBtnLayout.parent);
    cc.tween(this.mBtnLayout.parent).by(.5, {
      position: cc.v3(0, -196)
    }).call(function () {
      t.mBtnLayout.parent.active = false;
    }).start();
    this.mBattleBaseInfoView.getComponent($10BattleBaseInfoView.default).setTipsIsShow(false);
    for (var o = 0; o < $10BattleDataProxy.battleDataProxy.bulletBalls.length; ++o) {
      $10BattleDataProxy.battleDataProxy.bulletBalls[o].getComponent($10BulletBall.default).initCollisionPlantNum();
    }
  };
  _ctor.prototype.refreshSilverCoin = function () {};
  _ctor.prototype.setEffectEquipUpgrade = function () {};
  _ctor.prototype.setBottomBtnsValid = function (t) {
    this.mBtnLayout.children.forEach(function (e) {
      e.opacity = t ? 255 : 150;
      e.getComponent(cc.Button).interactable = t;
    });
    this.setBtnSpriteMaterial();
  };
  _ctor.prototype.setBtnSpriteMaterial = function () {
    var t = this.mBtnRefresh.children;
    var e = !this.mBtnRefresh.getComponent(cc.Button).interactable;
    for (var o = 0; o < t.length; ++o) {
      var i = t[o];
      if ("icon" == i.name) {
        if (e) {
          $10Util.default.setSpriteGrayMaterial(i.getComponent(cc.Sprite));
        } else {
          $10Util.default.setSpriteNormalMaterial(i.getComponent(cc.Sprite));
        }
      } else if ("num" == i.name) {
        i.color = e ? cc.color(75, 75, 75) : cc.color("#FFFFFF");
      } else {
        i.color = e ? cc.color(75, 75, 75) : cc.color("#6F3318");
      }
    }
  };
  _ctor.prototype.passWave = function (t) {
    var e = this;
    this._isCanClick = false;
    var o = $10BattleDataProxy.battleDataProxy.gameCamera;
    cc.tween(o).to(.5, {
      position: cc.v3(0, 0)
    }).call(function () {
      e._isCanClick = true;
    }).start();
    if (this._selectEquipment && this._selectEquipment.isValid) {
      this.placeFailBack();
      this._selectEquipment = null;
    }
    for (var i = 0; i < $10BattleDataProxy.battleDataProxy.bulletBalls.length; ++i) {
      $10BattleDataProxy.battleDataProxy.bulletBalls[i].getComponent($10BulletBall.default).initAddSpdTime();
    }
    this.mFrenzyBar.getComponent($10FrenzyBar.default).initFrenzyBar();
    this.mSelectLayout.getComponent($10SelectLayout.default).refreshNum = 1;
    $10BattleDataProxy.battleDataProxy.isStartFight = false;
    cc.Tween.stopAllByTarget(this.mSelectLayout);
    this.mSelectLayout.active = true;
    cc.tween(this.mSelectLayout).by(.5, {
      position: cc.v3(0, 196)
    }).call(function () {
      $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.READY;
      e.mSelectLayout.getComponent($10SelectLayout.default).refreshSeletItems(e._gridsMap);
      e.mBattleBaseInfoView.getComponent($10BattleBaseInfoView.default).setTipsIsShow(true);
      for (var o = 0; o < e.mEquipmentNode.children.length; ++o) {
        e.mEquipmentNode.children[o].getComponent($10EquipmentItem.default).passWave();
        e.mEquipmentNode.children[o].getComponent($10EquipmentItem.default).bAnim = false;
        e.mEquipmentNode.children[o].getComponent($10EquipmentItem.default).isTakeEffect = true;
      }
      e._isCanClickItem = true;
      e.mSuperPlantView.active = true;
      var i = $10BattleDataProxy.battleDataProxy.getSuperPlantNum();
      if (t) {
        e.updateSuperPlantNum();
      } else {
        e._superPlantMapItem.getComponent($10SuperPlantMapItem.default).initSuperPlantNum(i);
      }
      $10BattleDataProxy.battleDataProxy.battleView.getComponent($10BattleView.default).initEnemyDatas();
      $10BattleDataProxy.battleDataProxy.battleView.getComponent($10BattleView.default).preLoadEnemyAni();
      if ($10BattleDataProxy.battleDataProxy.isEndless) {
        var n = $10BattleDataProxy.battleDataProxy.endlessCurWave;
        1 != n && n % 5 == 1 && $10GameUIManager.gameUIMgr.showSelectSkillPopup();
      }
    }).start();
    this.mBattleBaseInfoView.getComponent($10BattleBaseInfoView.default).seBattleUiIsShow(false);
    this.mBattleBaseInfoView.getComponent($10BattleBaseInfoView.default).passWave();
    $10BattleDataProxy.battleDataProxy.bossSkillBall.forEach(function (t) {
      t.destroy();
      t.removeFromParent();
    });
    $10BattleDataProxy.battleDataProxy.blackHoleNodes.forEach(function (t) {
      t.destroy();
      t.removeFromParent();
    });
    $10BattleDataProxy.battleDataProxy.blackHoleNodes = [];
    $10BattleDataProxy.battleDataProxy.bossSkillBall = [];
    $10BattleDataProxy.battleDataProxy.enemyAirship = [];
    this.setMapGridsBgStatus($10GameEnum.GridBgStatus.NONE);
    this.mBtnLayout.parent.active = true;
    cc.Tween.stopAllByTarget(this.mBtnLayout.parent);
    cc.tween(this.mBtnLayout.parent).by(.5, {
      position: cc.v3(0, 196)
    }).start();
  };
  _ctor.prototype.cleanBossBall = function () {
    if ($10BattleDataProxy.battleDataProxy.bossSkillBall.length <= 0) {
      for (var t = 0; t < this.mEquipmentNode.children.length; ++t) {
        this.mEquipmentNode.children[t].getComponent($10EquipmentItem.default).cleanBossBall();
      }
    }
    this._selectEquipment && this._selectEquipment.isValid && this._selectEquipment.getComponent($10EquipmentItem.default).cleanBossBall();
  };
  _ctor.prototype.resurgence = function () {
    if (this._fightEquipData) {
      if (this._selectEquipment && this._selectEquipment.isValid) {
        this._selectEquipment.destroy(), this._selectEquipment.removeFromParent(), this._selectEquipment = null;
      }
      this.loadBattlePlantData(this._fightEquipData);
      this.addSunshineNumEx(45);
    }
    this.passWave(true);
  };
  _ctor.prototype.addSunshineNumEx = function (t, e) {
    var o = $10BattleDataProxy.battleDataProxy.sunshineNum;
    o += t;
    $10BattleDataProxy.battleDataProxy.sunshineNum = o;
    var i = this.node.getChildByName("top");
    var n = $10BattleDataProxy.battleDataProxy.sunshineRoot;
    var a = i.convertToNodeSpaceAR(n.parent.convertToWorldSpaceAR(n.position));
    var r = $10BattleDataProxy.battleDataProxy.gameCamera;
    $10AnimationMgr.default.instance.showAwardAni({
      id: 8,
      num: 30
    }, i, e, 0, a.addSelf(r.position));
  };
  _ctor.prototype.onCourseNotify = function (t) {
    if (!(t > 3)) {
      if (t < 3) {
        this.setBottomBtnsValid(false);
      } else {
        this.setBottomBtnsValid(true);
      }
      var e = {
        courseId: 0,
        isGame: true
      };
      e.courseId = t;
      switch (t) {
        case 2:
          e.targetNode1 = this.mSelectLayout.children[0];
          e.targetNode2 = this._gridsMap.get("5-2");
          break;
        case 3:
          e.targetNode = this.mBtnRefresh.parent.getChildByName("BtnFight");
          break;
        case 11:
          if ($10BattleDataProxy.battleDataProxy.isStartFight) {
            return;
          }
      }
      $10UserDataProxy.userDataProxy.showCourse(e);
    }
  };
  _ctor.prototype.pauseGame = function () {
    this._pauseGameState = $10BattleDataProxy.battleDataProxy.gameState;
    $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.PAUSE;
  };
  _ctor.prototype.resumeGame = function () {
    $10BattleDataProxy.battleDataProxy.gameState = this._pauseGameState;
  };
  _ctor.prototype.saveBattlePlantData = function () {
    var t = false;
    var e = [];
    for (var o = 0; o < this.mEquipmentNode.children.length; ++o) {
      var i = this.mEquipmentNode.children[o].getComponent($10EquipmentItem.default);
      if (i.mIsFixedPlant) {
        t = i.getComponent($10EquipmentItem.default).isPurchased;
      } else {
        var n = {
          idx: o,
          equipId: i.equipId,
          dataFormIdx: i.dataFormIdx,
          holdGrids: i.holdGrids,
          level: i.level,
          pos: JSON.stringify(i.node.position)
        };
        e.push(n);
        this.mEquipmentNode.children[o].getComponent($10EquipmentItem.default).setTriggerBarFillRange(false);
      }
    }
    var a = [];
    for (o = 0; o < this.mBlockLayout.children.length; ++o) {
      var r = this.mBlockLayout.children[o];
      if (r && r.isValid) {
        var s = r.getComponent($10MapBlockItem.default);
        if (s) {
          var c = s.holdGrid;
          var l = s.stoneHp;
          var u = s.blockType;
          a.push({
            holdGrid: c,
            stoneHp: l,
            blockType: u
          });
        }
      }
    }
    var p = {};
    p.equipData = e;
    if ($10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE) {
      p.curChapter = $10UserDataProxy.userDataProxy.userData.cursWeatherChapter;
      p.curWave = $10UserDataProxy.userDataProxy.userData.curWeatherWave;
    } else {
      p.curChapter = $10UserDataProxy.userDataProxy.userData.curChapter;
      p.curWave = $10UserDataProxy.userDataProxy.userData.curWave;
    }
    p.mapBlockData = a;
    p.isBuyFixedPlant = t;
    p.battleData = $10BattleDataProxy.battleDataProxy.battleData;
    $10BattleDataProxy.battleDataProxy.saveBattlePlantData(JSON.stringify(p));
    this._fightEquipData = e;
  };
  _ctor.prototype.addWeatherEffect = function () {
    var t = this;
    var e = "";
    if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.THUNDER) {
      e = "prefabs/weather/WeatherThunder";
    } else if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.HeavyRain) {
      e = "prefabs/weather/WeatherRain";
    } else if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.Night) {
      e = "prefabs/weather/WeatherNight";
    } else if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.SandWind) {
      e = "prefabs/weather/WeatherSandWind";
    } else if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.IceAndSnow) {
      e = "prefabs/weather/WeatherSnow";
    } else {
      $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.HeavyFog && (e = "prefabs/weather/WeatherHeavyFog");
    }
    "" != e && $10ResUtil.ResUtil.loadAsset({
      path: e,
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      var o = $10NodePoolManager.default.instance.getNode(e);
      if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.Night) {
        t.node.getChildByName("root").getChildByName("nightView").addChild(o);
      } else if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.HeavyFog) {
        t.node.getChildByName("root").getChildByName("top").addChild(o);
      } else {
        t.node.getChildByName("BattleBaseInfoView").getChildByName("topView").addChild(o, 10);
      }
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mGridsLayout", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mSelectLayout", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mEquipmentNode", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnGetGrid", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnRefreshVideo", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnRefresh", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnLayout", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletBallPb", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBallView", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBattleBaseInfoView", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBattleView", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mPathView", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBuildBase", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnRecycle", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mPathPointView", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mSuperPlantView", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mChapterBg", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mPathWallView", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mMapBlockItemPb", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBlockLayout", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mFrenzyBar", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mZbTips", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBulletView", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_GameUI;