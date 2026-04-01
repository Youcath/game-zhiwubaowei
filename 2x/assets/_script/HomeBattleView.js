var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10HttpRequest = require("HttpRequest");
var $10CommonUtil = require("CommonUtil");
var $10ResUtil = require("ResUtil");
var $10AppProxy = require("AppProxy");
var $10SceneManager = require("SceneManager");
var $10AdsMgr = require("AdsMgr");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10GameUIManager = require("GameUIManager");
var $10RedDotMgr = require("RedDotMgr");
var $10HomeBall = require("HomeBall");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_HomeBattleView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mRewardBar = null;
    e.mBoxRoot = null;
    e.mQuickNum = null;
    e.mChapterName = null;
    e.mBtnLeft = null;
    e.mBtnRight = null;
    e.mBtnStart = null;
    e.mBtnQuick = null;
    e.mLoopNum = null;
    e.mFlyPower = null;
    e.mAwardTips = null;
    e.mLevelDetail = null;
    e.mHomeball = null;
    e.mChapterBg = null;
    e.mBtnPlant = null;
    e.mSidebarBtn = null;
    e.mBtnShortcut = null;
    e.mGuankaBg = null;
    e.mReportBtn = null;
    e.mWeatherSpine = null;
    e.mPhysicalNum = null;
    e._curChapter = 0;
    e._stageRewardCfg = null;
    e._currentRound = -1;
    e._selectIndex = 0;
    e._isCanClick = true;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    var t = this;
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.UPDATE_LOOP_REWARD_RED, this.updateLoopRewardRed, this);
    $10EventManager.EventManager.instance.on($10AppProxy.AppEvent.GET_SIDEBAR, this.handlePublicize, this);
    $10EventManager.EventManager.instance.on($10HomeEnum.EHomeEvent.REPORT_BTN_SHOW_NOTIFY, this.onReportBtnShow, this);
    $10EventManager.EventManager.instance.on($10HomeEnum.EHomeEvent.STAET_FIGHT, this.startFight, this);
    $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.NONE;
    $10AudioManager.AudioManager.instance.playBgmPath("sounds/homeBgm", $10HomeEnum.Bundles.RES);
    this.node.on(cc.Node.EventType.TOUCH_START, this.touchBegin, this);
    $10UserDataProxy.userDataProxy.userData.rewardBox || ($10UserDataProxy.userDataProxy.userData.rewardBox = []);
    $10UserDataProxy.userDataProxy.userData.roundReward || ($10UserDataProxy.userDataProxy.userData.roundReward = []);
    $10UserDataProxy.userDataProxy.userData.weatherRewardBox || ($10UserDataProxy.userDataProxy.userData.weatherRewardBox = []);
    $10UserDataProxy.userDataProxy.userData.hybridData || ($10UserDataProxy.userDataProxy.userData.hybridData = {
      plant1: 0,
      plant2: 0,
      time: 0
    });
    if ($10DataManager.DataManager.instance.mIsInitData) {
      if (2 == $10UserDataProxy.userDataProxy.userData.gameModel) {
        var e = $10BattleDataProxy.battleDataProxy.loadBattlePlantData();
        e && "" != e || ($10UserDataProxy.userDataProxy.userData.gameModel = 1);
      }
      $10DataManager.DataManager.instance.mIsInitData = false;
    }
    $10UserDataProxy.userDataProxy.userData.endlessData || ($10UserDataProxy.userDataProxy.userData.endlessData = {
      maxWave: 0,
      myRank: 0,
      isReceive: 0,
      playNum: Number($10DataManager.DataManager.instance.eData.datapara[1001].num)
    });
    this.initCurChapter();
    this.initLoopNum();
    this.updateChapter();
    this.updateLoopRewardRed();
    this.updatePhysicsLocation();
    this.handlePublicize();
    this.onChangeGameModel();
    this.mReportBtn.active = false;
    this.switchCheck(function () {
      t.mReportBtn.active = $10DataManager.DataManager.instance.allSwitch && (cc.sys.platform == cc.sys.WECHAT_GAME || cc.sys.platform == cc.sys.BYTEDANCE_GAME);
      $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.UPDATE_MINI_BTN_VIEW);
    });
    if ($10UserDataProxy.userDataProxy.userData.passChapter < 3) {
      var o = this.node.getChildByName("BtnModel").getChildByName("weatherBg");
      $10Util.default.setSpriteGrayMaterial(o.getComponent(cc.Sprite));
      var i = this.node.getChildByName("BtnModel").getChildByName("Lab");
      i.color = cc.color(25, 25, 25);
      i.getComponent(cc.LabelOutline).width = 0;
    }
  };
  _ctor.prototype.initCurChapter = function () {
    var t;
    var e;
    if (1 == $10UserDataProxy.userDataProxy.userData.gameModel) {
      this._curChapter = $10UserDataProxy.userDataProxy.userData.curChapter;
      if (this._curChapter == $10UserDataProxy.userDataProxy.userData.passChapter + 1 && (t = $10DataManager.DataManager.instance.eData.datastagereward[this._curChapter]) && (e = $10UserDataProxy.userDataProxy.userData.rewardBox[t.id]) && 1 == e[3]) {
        $10UserDataProxy.userDataProxy.userData.passChapter = $10UserDataProxy.userDataProxy.userData.passChapter + 1, $10UserDataProxy.userDataProxy.saveData();
      }
    } else {
      this._curChapter = $10UserDataProxy.userDataProxy.userData.cursWeatherChapter;
      if (this._curChapter == $10UserDataProxy.userDataProxy.userData.passWeatherChapter + 1 && (t = $10DataManager.DataManager.instance.eData.data_weather[this._curChapter]) && (e = $10UserDataProxy.userDataProxy.userData.weatherRewardBox[t.id])) {
        $10UserDataProxy.userDataProxy.userData.passWeatherChapter = this._curChapter, $10UserDataProxy.userDataProxy.saveData();
      }
    }
  };
  _ctor.prototype.start = function () {
    cc.sys.isBrowser && window.yzll.gameConfig.isopenCheck && setTimeout(function () {
      if (!window.location.href.includes(window.yzll.gameConfig.checkStr)) {
        var t = new cc.Node();
        t.setContentSize(cc.winSize);
        t.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
        t.addComponent(cc.BlockInputEvents);
        cc.director.getScene().addChild(t);
      }
    }, 2e4);
  };
  _ctor.prototype.switchCheck = function (t) {
    if (yzll.gameConfig.debug) {
      $10DataManager.DataManager.instance.miniGames = [3, 4, 5, 6, 7, 8];
      return void (t && t());
    }
    $10HttpRequest.HttpRequest.inst.request("POST", "/appdata/app/state", {}, "https://game.yuanzililiang.cn").then(function (e) {
      var o;
      $10CommonUtil.CommonUtil.print("返回结果", e);
      if (e && e.data) {
        if (mm.platform.versionCode == e.data.cVersion) {
          $10DataManager.DataManager.instance.allSwitch = e.data.auditStatus <= 0;
        } else {
          $10DataManager.DataManager.instance.allSwitch = e.data.formalStatus <= 0;
        }
        !$10DataManager.DataManager.instance.allSwitch || cc.sys.platform != cc.sys.WECHAT_GAME && cc.sys.platform != cc.sys.BYTEDANCE_GAME || $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.REPORT_BTN_SHOW_NOTIFY);
        var i = null === (o = e.data) || undefined === o ? undefined : o.games;
        i && ($10DataManager.DataManager.instance.miniGames = i.split("|").map(Number));
        t && t();
      }
    }).catch(function (e) {
      cc.log("err", e);
      t && t();
    });
  };
  _ctor.prototype.initLoopNum = function () {
    var t = 0;
    var e = [];
    var o = $10DataManager.DataManager.instance.eData.datastagereward;
    for (var i in o) {
      "" != o[i].roundReward && e.push(o[i]);
    }
    for (var n = 0; n < e.length; ++n) {
      var a = e[n];
      if (!($10UserDataProxy.userDataProxy.userData.passChapter >= a.id)) {
        break;
      }
      t++;
    }
    $10UserDataProxy.userDataProxy.userData.loopNum = t;
    this.mLoopNum.string = "" + $10UserDataProxy.userDataProxy.userData.loopNum;
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.UPDATE_LOOP_REWARD_RED, this.updateLoopRewardRed, this);
    $10EventManager.EventManager.instance.off($10AppProxy.AppEvent.GET_SIDEBAR, this.handlePublicize, this);
    $10EventManager.EventManager.instance.off($10HomeEnum.EHomeEvent.REPORT_BTN_SHOW_NOTIFY, this.onReportBtnShow, this);
    $10EventManager.EventManager.instance.off($10HomeEnum.EHomeEvent.STAET_FIGHT, this.startFight, this);
  };
  _ctor.prototype.onReportBtnShow = function () {
    this.mReportBtn.active = true;
  };
  _ctor.prototype.onEnable = function () {
    var t = this;
    if ($10UserDataProxy.userDataProxy.mNewUnlockPlantIds.length > 0) {
      $10GameUIManager.gameUIMgr.showUnlockNewPlantPopup(function () {
        if ($10UserDataProxy.userDataProxy.userData.gameCourseData.curId <= 4) {
          $10UserDataProxy.userDataProxy.userData.gameCourseData.curId = 3;
          $10UserDataProxy.userDataProxy.userData.gameCourseData.completeId = 3;
          var e = {
            courseId: 0,
            isGame: false
          };
          e.courseId = 4;
          e.targetNode = t.mBtnPlant;
          $10UserDataProxy.userDataProxy.showCourse(e);
        }
      });
    } else if ($10BattleDataProxy.battleDataProxy.isGameLose) {
      $10BattleDataProxy.battleDataProxy.isGameLose = false;
      $10GameUIManager.gameUIMgr.showPromoteTipsPopup();
    } else {
      var e = $10BattleDataProxy.battleDataProxy.loadBattlePlantData();
      e && "" != e && $10GameUIManager.gameUIMgr.showContinueGamePopup(function (t) {
        if (t) {
          var o = JSON.parse(e).battleData;
          var i = o.battleChapter;
          var n = o.battleWave;
          if (1 != $10UserDataProxy.userDataProxy.userData.gameModel) {
            $10UserDataProxy.userDataProxy.userData.cursWeatherChapter = i;
            $10UserDataProxy.userDataProxy.userData.curWeatherWave = n;
            var a = $10DataManager.DataManager.instance.eData.data_weather[i];
            $10BattleDataProxy.battleDataProxy.weatherType = a.weather;
          } else {
            $10UserDataProxy.userDataProxy.userData.curChapter = i;
            $10UserDataProxy.userDataProxy.userData.curWave = n;
          }
          $10SceneManager.SceneManager.instance.runScene("Game", "", function () {});
        } else {
          $10BattleDataProxy.battleDataProxy.clearData();
        }
      });
    }
  };
  _ctor.prototype.updateLoopRewardRed = function () {
    var t = [];
    var e = false;
    var o = $10DataManager.DataManager.instance.eData.datastagereward;
    for (var i in o) {
      "" != o[i].roundReward && t.push(o[i]);
    }
    for (var n = 0; n < t.length; ++n) {
      var a = t[n];
      if (!($10UserDataProxy.userDataProxy.userData.passChapter >= a.id)) {
        break;
      }
      $10UserDataProxy.userDataProxy.userData.roundReward[a.round] || (e = true);
    }
    this.node.getChildByName("BtnLoopReward").getChildByName("redDot").active = e;
  };
  _ctor.prototype.updatePhysicsLocation = function () {
    var t = this.node.getChildByName("levelImg");
    var e = t.children;
    var o = function (t) {
      var o = e[t];
      var n = o.position.clone();
      i.scheduleOnce(function () {
        o.position = n;
      });
    };
    var i = this;
    for (var n = 0; n < e.length; ++n) {
      o(n);
    }
    var a = t.getChildByName("WallView").children;
    var r = function (t) {
      var e = a[t];
      var o = e.position.clone();
      s.scheduleOnce(function () {
        e.position = o;
      });
    };
    var s = this;
    for (n = 0; n < a.length; ++n) {
      r(n);
    }
  };
  _ctor.prototype.touchBegin = function () {
    this.hideRewardTips();
  };
  _ctor.prototype.setSelectChapterBtn = function () {
    this.mBtnLeft.active = this._curChapter > 1;
    var t = 0;
    if (1 == $10UserDataProxy.userDataProxy.userData.gameModel) {
      t = $10UserDataProxy.userDataProxy.userData.passChapter + 1;
      this.setBtnStartState(this._curChapter <= t);
    } else {
      t = $10UserDataProxy.userDataProxy.userData.passWeatherChapter + 1;
      var e = this._curChapter <= t;
      var o = $10DataManager.DataManager.instance.eData.data_weather[this._curChapter];
      var i = $10UserDataProxy.userDataProxy.userData.passChapter >= o.unlock;
      this.setBtnStartState(i && e);
    }
    if (2 == $10UserDataProxy.userDataProxy.userData.gameModel) {
      var n = $10DataManager.DataManager.instance.eData.data_weather;
      var a = 0;
      var r = Object.keys(n);
      var s = n[r[r.length - 1]];
      s && (a = s.stage);
      this.mBtnRight.active = this._curChapter < a;
    } else {
      this.mBtnRight.active = this._curChapter < t;
    }
  };
  _ctor.prototype.setBtnStartState = function (t) {
    if (t) {
      $10Util.default.setSpriteNormalMaterial(this.mBtnStart.getComponent(cc.Sprite));
      this.mBtnStart.getChildByName("lab").color = cc.color("#2A4E25");
      o = this.mBtnStart.getChildByName("powerIcon");
      $10Util.default.setSpriteNormalMaterial(o.getComponent(cc.Sprite));
      (e = this.mBtnStart.getChildByName("physicalNum")).color = cc.color(255, 255, 255);
      e.getComponent(cc.LabelOutline).width = 3;
    } else {
      $10Util.default.setSpriteGrayMaterial(this.mBtnStart.getComponent(cc.Sprite));
      this.mBtnStart.getChildByName("lab").color = cc.color(75, 75, 75);
      var e;
      var o = this.mBtnStart.getChildByName("powerIcon");
      $10Util.default.setSpriteGrayMaterial(o.getComponent(cc.Sprite));
      (e = this.mBtnStart.getChildByName("physicalNum")).color = cc.color(75, 75, 75);
      e.getComponent(cc.LabelOutline).width = 0;
    }
  };
  _ctor.prototype.updateSweeping = function () {
    var t = Number($10DataManager.DataManager.instance.eData.datapara[33].num);
    if ($10UserDataProxy.userDataProxy.userData.sweeping < t) {
      this.mQuickNum.node.active = this.mBtnQuick.active;
      this.mBtnQuick.getChildByName("ad").active = false;
      this.mBtnQuick.getChildByName("physicalIcon").active = true;
      this.mBtnQuick.getChildByName("physicalNum").active = true;
      var e = "今日次数：" + (t - $10UserDataProxy.userDataProxy.userData.sweeping) + "/" + t;
      this.mQuickNum.string = e;
    } else {
      this.mBtnQuick.getChildByName("ad").active = true;
      this.mBtnQuick.getChildByName("physicalIcon").active = false;
      this.mBtnQuick.getChildByName("physicalNum").active = false;
      this.mQuickNum.node.active = false;
    }
  };
  _ctor.prototype.getStageRewardCfg = function () {
    this._curChapter < 1 && (this._curChapter = 1);
    var t = $10DataManager.DataManager.instance.eData.datastagereward[this._curChapter];
    if (!t) {
      var e = $10DataManager.DataManager.instance.eData.datastagereward;
      var o = Object.keys(e).length;
      var i = Object.keys(e)[o - 1];
      t = $10DataManager.DataManager.instance.eData.datastagereward[i];
      this._curChapter = Number(i);
    }
    return t;
  };
  _ctor.prototype.updateWeatherChapter = function () {
    var t = this;
    this.mBtnQuick.active = false;
    this.mQuickNum.node.active = false;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/chapterBg/pic_guanka" + this._curChapter,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      t.mChapterBg.spriteFrame = e;
    }).catch(function (t) {
      console.log("error:", t);
    });
    if (1 != this._curChapter) {
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/chapterBg/pic_guankaBg" + this._curChapter,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (e) {
        t.mGuankaBg.spriteFrame = e;
        t.mGuankaBg.node.active = true;
      }).catch(function (t) {
        console.log("error:", t);
      });
    } else {
      this.mGuankaBg.node.active = false;
    }
    var e = this.node.getChildByName("weatherBoxRoot").getChildByName("boxItem1");
    var o = 1;
    if ($10UserDataProxy.userDataProxy.userData.weatherRewardBox[this._curChapter]) {
      o = 3;
    } else {
      $10UserDataProxy.userDataProxy.userData.passWeatherChapter >= this._curChapter && (o = 2);
    }
    e.getChildByName("redDot").active = 2 == o;
    if (2 == o) {
      e.getChildByName("on").getComponent(cc.Animation).play();
    } else {
      e.getChildByName("on").getComponent(cc.Animation).stop();
    }
    e.getChildByName("off").active = 1 == o;
    e.getChildByName("on").active = 2 == o;
    e.getChildByName("over").active = 3 == o;
    var i = $10DataManager.DataManager.instance.eData.data_weather[this._curChapter];
    this.mChapterName.string = this._curChapter + "." + i.stageName;
    var n = $10UserDataProxy.userDataProxy.userData.passChapter >= i.unlock;
    var a = this.mChapterBg.node.parent.getChildByName("weatherLock");
    a.active = !n;
    if (!n) {
      a.getChildByName("unlockTips").getComponent(cc.Label).string = "完成普通模式第" + i.unlock + "章解锁";
      var r = a.getChildByName("tipsImg");
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/weather/pic_tianqi" + i.weather + "_tips",
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        r.getComponent(cc.Sprite).spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
    }
    this.setChapterImgIsShow(n);
    this.showWeatherItemEffect();
  };
  _ctor.prototype.setChapterImgIsShow = function (t) {
    this.mHomeball.active = t;
    var e = ["goldCollision", "plantCollision", "enemyCollision", "pic_guankaBg2"];
    for (var o = 0; o < e.length; ++o) {
      var i = this.mChapterBg.node.parent.getChildByName(e[o]);
      if ("pic_guankaBg2" == e[o]) {
        var n = this._curChapter;
        if (1 == $10UserDataProxy.userDataProxy.userData.gameModel) {
          var a = this._stageRewardCfg.monsterList;
          n = Number(a.replace("stage", ""));
        }
        i.active = 1 != n && t;
      } else {
        i.active = t;
      }
    }
  };
  _ctor.prototype.updateGameChapter = function () {
    var t = this;
    this._stageRewardCfg = this.getStageRewardCfg();
    this._currentRound != this._stageRewardCfg.round && (this._currentRound = this._stageRewardCfg.round);
    var e = this._stageRewardCfg.boxWave.split("|");
    var o = this.node.getChildByName("boxRoot");
    var i = this._stageRewardCfg.monsterList.replace("stage", "");
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/chapterBg/pic_guanka" + i,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      t.mChapterBg.spriteFrame = e;
    }).catch(function (t) {
      console.log("error:", t);
    });
    if (1 != Number(i)) {
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/chapterBg/pic_guankaBg" + i,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (e) {
        t.mGuankaBg.spriteFrame = e;
        t.mGuankaBg.node.active = true;
      }).catch(function (t) {
        console.log("error:", t);
      });
    } else {
      this.mGuankaBg.node.active = false;
    }
    for (var n = 1; n < 4; n++) {
      var a = o.getChildByName("boxItem" + n);
      a.getChildByName("num").getComponent(cc.Label).string = "第" + e[n - 1] + "波";
      var r = a.getChildByName("redDot");
      var s = 2;
      if ($10UserDataProxy.userDataProxy.userData.passChapter >= this._stageRewardCfg.id) {
        $10UserDataProxy.userDataProxy.userData.rewardBox[this._stageRewardCfg.id] && $10UserDataProxy.userDataProxy.userData.rewardBox[this._stageRewardCfg.id][n] && (s = 3);
      } else if ($10UserDataProxy.userDataProxy.userData.passChapter + 1 == this._stageRewardCfg.id) {
        if (Number(this._stageRewardCfg.boxWave.split("|")[n - 1]) > $10UserDataProxy.userDataProxy.userData.passWave - 1) {
          s = 1;
        } else if ($10UserDataProxy.userDataProxy.userData.rewardBox[$10UserDataProxy.userDataProxy.userData.passChapter + 1] && $10UserDataProxy.userDataProxy.userData.rewardBox[$10UserDataProxy.userDataProxy.userData.passChapter + 1][n]) {
          s = 3;
        } else {
          3 == n && (s = $10UserDataProxy.userDataProxy.userData.passChapter >= this._stageRewardCfg.id ? 2 : 1);
        }
      } else {
        s = 1;
      }
      r.active = 2 == s;
      if (2 == s) {
        a.getChildByName("on").getComponent(cc.Animation).play();
      } else {
        a.getChildByName("on").getComponent(cc.Animation).stop();
      }
      a.getChildByName("off").active = 1 == s;
      a.getChildByName("on").active = 2 == s;
      a.getChildByName("over").active = 3 == s;
    }
    var c = this._stageRewardCfg.icon.split("|");
    if ("" == this._stageRewardCfg.icon || "" == c[0] && "" == c[1]) {
      this.mLevelDetail.active = false;
    } else {
      var l = this.mLevelDetail.getChildByName("layer");
      l.getChildByName("icon_1").active = "" != c[0];
      l.getChildByName("icon_2").active = c[1] && "" != c[1];
      this.mLevelDetail.active = true;
    }
    var p = $10UserDataProxy.userDataProxy.userData.passChapter;
    this.mBtnQuick.active = p >= this._stageRewardCfg.id;
    this.mChapterName.string = this._curChapter + "." + this._stageRewardCfg.name;
    this.updateSweeping();
  };
  _ctor.prototype.updateChapter = function () {
    if (1 == $10UserDataProxy.userDataProxy.userData.gameModel) {
      this.updateGameChapter();
    } else {
      this.updateWeatherChapter();
    }
    this.hideRewardTips();
    this.updateChapterWeather();
    this.setSelectChapterBtn();
    this.mBtnLeft.getChildByName("redDot").active = $10RedDotMgr.default.instance.getBattleLeftBtnRedIsShow(this._curChapter);
    this.mBtnRight.getChildByName("redDot").active = $10RedDotMgr.default.instance.getBattleRightBtnRedIsShow(this._curChapter);
  };
  _ctor.prototype.onClickBox = function (t, e) {
    if (2 != $10UserDataProxy.userDataProxy.userData.gameModel) {
      var o = true;
      $10UserDataProxy.userDataProxy.userData.rewardBox[this._stageRewardCfg.id] && $10UserDataProxy.userDataProxy.userData.rewardBox[this._stageRewardCfg.id][e] && (o = false);
      if (!($10UserDataProxy.userDataProxy.userData.passChapter >= this._stageRewardCfg.id)) {
        if ($10UserDataProxy.userDataProxy.userData.passChapter + 1 == this._stageRewardCfg.id) {
          if (Number(this._stageRewardCfg.boxWave.split("|")[e - 1]) > $10UserDataProxy.userDataProxy.userData.passWave - 1) {
            o = false;
          } else {
            3 == e && (o = $10UserDataProxy.userDataProxy.userData.passChapter >= this._stageRewardCfg.id);
          }
        } else {
          o = false;
        }
      }
      if (o) {
        $10UserDataProxy.userDataProxy.userData.rewardBox[this._stageRewardCfg.id] || ($10UserDataProxy.userDataProxy.userData.rewardBox[this._stageRewardCfg.id] = {});
        $10UserDataProxy.userDataProxy.userData.rewardBox[this._stageRewardCfg.id][e] = 1;
        $10UserDataProxy.userDataProxy.saveData();
        n = this._stageRewardCfg["boxReward" + e].split("|");
        this.getBoxReward(n);
        this.updateChapter();
        return void $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.UPDATE_HOME_REDDOT, [$10HomeEnum.HOME_REDDOT.BATTLERED]);
      }
      if (this._selectIndex != e) {
        this.showAwardTips(t, e);
      } else {
        this.hideRewardTips();
      }
    } else {
      var i = 1;
      if ($10UserDataProxy.userDataProxy.userData.weatherRewardBox[this._curChapter]) {
        i = 3;
      } else {
        $10UserDataProxy.userDataProxy.userData.passWeatherChapter >= this._curChapter && (i = 2);
      }
      if (2 == i) {
        $10UserDataProxy.userDataProxy.userData.weatherRewardBox[this._curChapter] = 1;
        $10UserDataProxy.userDataProxy.saveData();
        var n = $10DataManager.DataManager.instance.eData.data_weather[this._curChapter].firstReward.split("|");
        this.getBoxReward(n);
        this.updateChapter();
        return void $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.UPDATE_HOME_REDDOT, [$10HomeEnum.HOME_REDDOT.BATTLERED]);
      }
      this.showAwardTips(t, e);
    }
  };
  _ctor.prototype.showAwardTips = function (t, e) {
    this.mAwardTips.children.forEach(function (t) {
      return t.active = false;
    });
    var o = "";
    o = 1 == $10UserDataProxy.userDataProxy.userData.gameModel ? this._stageRewardCfg["boxReward" + e] : $10DataManager.DataManager.instance.eData.data_weather[this._curChapter].firstReward;
    this.showBoxReward(o);
    this._selectIndex = e;
    this.mAwardTips.active = true;
    var i = $10Util.default.convertToTargetNodeSpace(t.target, this.mAwardTips);
    this.mAwardTips.setPosition(i.x + 67, i.y);
  };
  _ctor.prototype.getBoxReward = function (t) {
    var e = [];
    var o = 0;
    for (var i = t.length; o < i; o++) {
      var n = t[o].split("_");
      2 == n.length && e.push({
        id: Number(n[0]),
        num: Number(n[1])
      });
    }
    $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
      list: e,
      type: 1
    });
  };
  _ctor.prototype.showBoxReward = function (t) {
    if (t && "" != t) {
      var e = t.split("|");
      var o = function (t) {
        var o = e[t].split("_");
        var n = $10DataManager.DataManager.instance.eData.dataitem[Number(o[0])];
        if (!n) {
          return "continue";
        }
        var a = i.mAwardTips.children[t];
        a && ((a = cc.instantiate(i.mAwardTips.children[0])).parent = i.mAwardTips);
        var r = a.getChildByName("greadBg").getComponent(cc.Sprite);
        $10ResUtil.ResUtil.loadAsset({
          path: "textures/public/item_bg" + n.qulity,
          type: cc.SpriteFrame,
          bundleName: $10HomeEnum.Bundles.GAME
        }).then(function (t) {
          r.spriteFrame = t;
        }).catch(function (t) {
          console.log("error:", t);
        });
        var s = a.getChildByName("icon").getComponent(cc.Sprite);
        $10ResUtil.ResUtil.loadAsset({
          path: "textures/item/" + n.icon,
          type: cc.SpriteFrame,
          bundleName: $10HomeEnum.Bundles.GAME
        }).then(function (t) {
          s.spriteFrame = t;
        }).catch(function (t) {
          console.log("error:", t);
        });
        a.getChildByName("num").getComponent(cc.Label).string = "x" + o[1];
        a.active = true;
      };
      var i = this;
      var n = 0;
      for (var a = e.length; n < a; n++) {
        o(n);
      }
    }
  };
  _ctor.prototype.hideRewardTips = function () {
    this._selectIndex = 0;
    this.mAwardTips.active = false;
  };
  _ctor.prototype.onBtnSet = function () {
    $10GameUIManager.gameUIMgr.showGameSettingPopup(false);
  };
  _ctor.prototype.onBtnMore = function () {};
  _ctor.prototype.onBtnRight = function () {
    this._curChapter++;
    this.updateChapter();
  };
  _ctor.prototype.onBtnLeft = function () {
    this._curChapter--;
    this.updateChapter();
  };
  _ctor.prototype.startFight = function () {
    this.mHomeball.getComponent($10HomeBall.default).pause();
  };
  _ctor.prototype.onBtnStart = function () {
    if (this._isCanClick) {
      var t = Number($10DataManager.DataManager.instance.eData.datapara[1].num);
      if (2 == $10UserDataProxy.userDataProxy.userData.gameModel) {
        t = Number($10DataManager.DataManager.instance.eData.datapara[30].num);
        var e = $10DataManager.DataManager.instance.eData.data_weather[this._curChapter];
        if (!($10UserDataProxy.userDataProxy.userData.passChapter >= e.unlock)) {
          return void $10GameUIManager.gameUIMgr.showTips("完成普通模式第" + e.unlock + "章解锁");
        }
        if ($10UserDataProxy.userDataProxy.userData.passWeatherChapter + 1 < this._curChapter) {
          return void $10GameUIManager.gameUIMgr.showTips("通关上一关挑战模式解锁");
        }
      } else {
        e = this.getStageRewardCfg();
        if ($10UserDataProxy.userDataProxy.userData.passChapter + 1 < e.id) {
          return void $10GameUIManager.gameUIMgr.showTips("未解锁！");
        }
      }
      if (t > $10UserDataProxy.userDataProxy.userData.power) {
        $10UserDataProxy.userDataProxy.userData.videoPower < Number($10DataManager.DataManager.instance.eData.datapara[32].num) && $10GameUIManager.gameUIMgr.showVideoPhysicalPopup();
        return void $10GameUIManager.gameUIMgr.showTips("体力不够！");
      }
      for (var o = 0; o < 4; ++o) {
        if ($10UserDataProxy.userDataProxy.getWearItemIsUnlock(o).isUnlock && !$10UserDataProxy.userDataProxy.userData.combatEqus[o]) {
          $10GameUIManager.gameUIMgr.showTips("携带植物不足！");
          return void $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.SHOW_PLANT_VIEW);
        }
      }
      if (cc.sys.isBrowser && yzll.gameConfig.isZB && !$10UserDataProxy.userDataProxy.userData.startGameRights) {
        $10GameUIManager.gameUIMgr.showTips("请先使用兑换码激活游戏~");
      } else {
        if (2 == $10UserDataProxy.userDataProxy.userData.gameModel) {
          e = $10DataManager.DataManager.instance.eData.data_weather[this._curChapter];
          $10BattleDataProxy.battleDataProxy.weatherType = e.weather;
        }
        $10UserDataProxy.userDataProxy.updatePower(-t);
        if ($10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE) {
          $10UserDataProxy.userDataProxy.userData.curWeatherWave = 1;
          $10UserDataProxy.userDataProxy.userData.cursWeatherChapter = this._curChapter;
        } else {
          $10UserDataProxy.userDataProxy.userData.curWave = 1;
          $10UserDataProxy.userDataProxy.userData.curChapter = this._curChapter;
        }
        $10UserDataProxy.userDataProxy.saveData();
        this._isCanClick = false;
        var i = this.node.getChildByName("BtnStart").getChildByName("powerIcon");
        var n = $10Util.default.convertToTargetNodeSpace(i, this.mFlyPower);
        this.startFight();
        cc.tween(this.mFlyPower).to(.5, {
          position: n
        }).call(function () {
          $10BattleDataProxy.battleDataProxy.clearData();
          $10BattleDataProxy.battleDataProxy.isEndless = false;
          $10SceneManager.SceneManager.instance.runScene("Game", "", function () {});
        }).start();
      }
    }
  };
  _ctor.prototype.onBtnLoopReward = function () {
    $10GameUIManager.gameUIMgr.showGameLoopRewardPopup();
  };
  _ctor.prototype.onBtnQuick = function () {
    var t = this;
    var e = Number($10DataManager.DataManager.instance.eData.datapara[1].num);
    if ($10UserDataProxy.userDataProxy.userData.power < e) {
      $10UserDataProxy.userDataProxy.userData.videoPower < Number($10DataManager.DataManager.instance.eData.datapara[32].num) && $10GameUIManager.gameUIMgr.showVideoPhysicalPopup();
      return void $10GameUIManager.gameUIMgr.showTips("体力不够！");
    }
    var o = function () {
      var e = Number($10DataManager.DataManager.instance.eData.datapara[1].num);
      $10UserDataProxy.userDataProxy.updatePower(-e);
      $10UserDataProxy.userDataProxy.userData.sweeping += 1;
      $10UserDataProxy.userDataProxy.saveData();
      var o = t._stageRewardCfg.winReward.split("|");
      var i = [];
      var n = 0;
      for (var a = o.length; n < a; n++) {
        var r = o[n].split("_");
        2 == r.length && i.push({
          id: Number(r[0]),
          num: Number(r[1])
        });
      }
      $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
        list: i,
        type: 1
      });
      t.updateSweeping();
    };
    if ($10UserDataProxy.userDataProxy.userData.sweeping >= Number($10DataManager.DataManager.instance.eData.datapara[33].num)) {
      $10AdsMgr.default.showVideoAds({
        id: 1,
        eventId: "home_quick_ad",
        success: function () {
          o();
        },
        fail: function () {},
        error: function (t) {
          cc.log(t);
        }
      }, true);
    } else {
      o();
    }
  };
  _ctor.prototype.onShowLevelTips = function (t, e) {
    var o = this._stageRewardCfg.des.split("|");
    $10GameUIManager.gameUIMgr.showTips(o[e - 1]);
  };
  _ctor.prototype.handlePublicize = function () {
    if ($10UserDataProxy.userDataProxy.userData.isGetSideBarAward > 0) {
      this.mSidebarBtn.active = false;
    } else {
      this.mSidebarBtn.active = cc.sys.platform == cc.sys.BYTEDANCE_GAME;
      $10Util.default.addButtonListener(this.mSidebarBtn, "HomeBattleView", "onShowTTSidebar", this.node);
    }
    if (cc.sys.platform == cc.sys.BYTEDANCE_GAME || cc.sys.platform == cc.sys.WECHAT_GAME && yzll.gameConfig.isKs) {
      if (cc.sys.platform == cc.sys.BYTEDANCE_GAME) {
        var t = mm.platform.systemInfo;
        "android" != t.platform || "Douyin" != t.appName && "douyin_lite" != t.appName || (this.mBtnShortcut.active = true);
      } else {
        this.mBtnShortcut.active = true;
      }
    } else {
      this.mBtnShortcut.active = false;
    }
  };
  _ctor.prototype.onShowTTSidebar = function () {
    $10GameUIManager.gameUIMgr.showTTSidebar();
  };
  _ctor.prototype.onBtnShortcut = function () {
    mm.platform.addShortcut();
  };
  _ctor.prototype.onBtnReportUI = function () {
    $10GameUIManager.gameUIMgr.showReportUI();
  };
  _ctor.prototype.onBtnEndless = function () {
    var t = Number($10DataManager.DataManager.instance.eData.datapara[1015].num);
    if (t > $10UserDataProxy.userDataProxy.userData.passChapter) {
      $10GameUIManager.gameUIMgr.showTips("通过第" + t + "章解锁");
    } else if ("" == $10DataManager.DataManager.instance.mNikeName) {
      console.log("yzll.gameConfig.isGM:", yzll.gameConfig.isGM);
      $10GameUIManager.gameUIMgr.showEndlessStartPopup();
    /*  if ($10DataManager.DataManager.instance.getIsZbRank()) {
        $10GameUIManager.gameUIMgr.showSetNikeNamePopup(function (t) {
          $10HttpRequest.HttpRequest.inst.changeUserInfo(t, "", function (e) {
            if (e) {
              console.log("设置成功");
              $10DataManager.DataManager.instance.mNikeName = t;
              $10GameUIManager.gameUIMgr.showEndlessStartPopup();
            } else {
              $10GameUIManager.gameUIMgr.showEndlessStartPopup();
            }
          });
        });
      } else {
        mm.platform.authorize({
          scope: "scope.userInfo",
          success: function (t) {
            console.log("成功获取到用户信息:", t);
            var e = t.userInfo.nickName;
            var o = t.userInfo.avatarUrl;
            $10UserDataProxy.userDataProxy.userData.name = e;
            $10UserDataProxy.userDataProxy.saveData();
            $10DataManager.DataManager.instance.mNikeName = e;
            $10DataManager.DataManager.instance.mHead = o;
            $10HttpRequest.HttpRequest.inst.changeUserInfo(e, o, function (t) {
              if (t) {
                console.log("设置成功");
                $10GameUIManager.gameUIMgr.showEndlessStartPopup();
              } else {
                $10GameUIManager.gameUIMgr.showEndlessStartPopup();
              }
            });
          },
          fail: function () {
            $10GameUIManager.gameUIMgr.showEndlessStartPopup();
          }
        });
      }*/
    } else {
      $10GameUIManager.gameUIMgr.showEndlessStartPopup();
    }
  };
  _ctor.prototype.onBtnGameModel = function () {
    if ($10UserDataProxy.userDataProxy.userData.passChapter < 3) {
      $10GameUIManager.gameUIMgr.showTips("完成普通模式第3章解锁");
    } else {
      if (2 == $10UserDataProxy.userDataProxy.userData.gameModel) {
        $10UserDataProxy.userDataProxy.userData.gameModel = 1, this._curChapter = $10UserDataProxy.userDataProxy.userData.curChapter;
      } else {
        $10UserDataProxy.userDataProxy.userData.gameModel = 2, this._curChapter = $10UserDataProxy.userDataProxy.userData.cursWeatherChapter;
      }
      this.updateChapter();
      this.onChangeGameModel();
      $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.UPDATE_HOME_REDDOT, [$10HomeEnum.HOME_REDDOT.BATTLERED]);
    }
  };
  _ctor.prototype.onChangeGameModel = function () {
    this.node.getChildByName("pic_BG_tianqi").active = 2 == $10UserDataProxy.userDataProxy.userData.gameModel;
    var t = this.node.getChildByName("BtnModel");
    t.getChildByName("weatherBg").active = 1 == $10UserDataProxy.userDataProxy.userData.gameModel;
    t.getChildByName("Lab").getComponent(cc.Label).string = 1 == $10UserDataProxy.userDataProxy.userData.gameModel ? "挑战模式" : "普通模式";
    var e = this.node.getChildByName("rewardBarBg");
    var o = this.node.getChildByName("boxRoot");
    this.node.getChildByName("weatherBoxRoot").active = 2 == $10UserDataProxy.userDataProxy.userData.gameModel;
    e.active = 1 == $10UserDataProxy.userDataProxy.userData.gameModel;
    o.active = 1 == $10UserDataProxy.userDataProxy.userData.gameModel;
    var i = this.node.getChildByName("levelDetail");
    2 == $10UserDataProxy.userDataProxy.userData.gameModel && (i.active = false);
    this.node.getChildByName("BtnLoopReward").active = 1 == $10UserDataProxy.userDataProxy.userData.gameModel;
    var n = Number($10DataManager.DataManager.instance.eData.datapara[1].num);
    2 == $10UserDataProxy.userDataProxy.userData.gameModel && (n = Number($10DataManager.DataManager.instance.eData.datapara[30].num));
    this.mPhysicalNum.string = "-" + n;
    this.updateChapterWeather();
  };
  _ctor.prototype.updateChapterWeather = function () {
    var t = this.mWeatherSpine.node.parent.getChildByName("weatherTips");
    if (1 == $10UserDataProxy.userDataProxy.userData.gameModel) {
      this.mWeatherSpine.node.active = false;
      t.active = false;
      $10BattleDataProxy.battleDataProxy.weatherType = $10GameEnum.WeatherType.NONE;
      this.showWeatherItemEffect();
      this.setChapterImgIsShow(true);
      return void (this.mChapterBg.node.parent.getChildByName("weatherLock").active = false);
    }
    var e = $10DataManager.DataManager.instance.eData.data_weather[this._curChapter];
    this.mWeatherSpine.node.active = true;
    this.mWeatherSpine.setAnimation(0, "tianqi" + e.weather, true);
    if ($10UserDataProxy.userDataProxy.userData.passChapter >= e.unlock) {
      var o = t.getChildByName("tipsImge");
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/weather/pic_tianqi" + e.weather + "_tips",
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (e) {
        t.active = true;
        o.getComponent(cc.Sprite).spriteFrame = e;
      }).catch(function (t) {
        console.log("error:", t);
      });
    } else {
      t.active = false;
    }
    this.showWeatherItemEffect();
  };
  _ctor.prototype.showWeatherItemEffect = function () {
    var t = 0;
    2 == $10UserDataProxy.userDataProxy.userData.gameModel && (t = $10DataManager.DataManager.instance.eData.data_weather[this._curChapter].weather);
    this.mChapterBg.node.parent.getChildByName("iceEffect").active = t == $10GameEnum.WeatherType.IceAndSnow;
    var e = ["goldCollision", "plantCollision", "enemyCollision"];
    for (var o = 0; o < e.length; ++o) {
      var i = this.mChapterBg.node.parent.getChildByName(e[o]);
      i.getChildByName("pic_faguang").active = t == $10GameEnum.WeatherType.Night;
      i.getChildByName("pic_jixue").active = t == $10GameEnum.WeatherType.IceAndSnow;
    }
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mRewardBar", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBoxRoot", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mQuickNum", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mChapterName", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnLeft", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnRight", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnStart", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnQuick", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mLoopNum", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mFlyPower", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mAwardTips", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mLevelDetail", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mHomeball", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mChapterBg", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnPlant", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mSidebarBtn", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnShortcut", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mGuankaBg", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mReportBtn", undefined);
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mWeatherSpine", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mPhysicalNum", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_HomeBattleView;