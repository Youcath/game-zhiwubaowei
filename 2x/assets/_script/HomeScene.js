var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10TimeUtil = require("TimeUtil");
var $10PopupManager = require("PopupManager");
var $10SceneBase = require("SceneBase");
var $10AdsMgr = require("AdsMgr");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10GameUIManager = require("GameUIManager");
var $10RedDotMgr = require("RedDotMgr");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_HomeScene = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mGoldNum = null;
    e.mDiamondNum = null;
    e.mPhysicalNum = null;
    e.mPowerTime = null;
    e.mNowBtn = null;
    e.mPlantView = null;
    e.mBattleView = null;
    e.mShopView = null;
    e.mHybridView = null;
    e.mGoldRoot = null;
    e.mDiamondRoot = null;
    e.mPhysicalRoot = null;
    e.mManureRoot = null;
    e.mManureNum = null;
    e._maxPower = 0;
    e._powerCd = 0;
    e._isCanClick = true;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.POWER_UPDATE, this.updatePhysical, this);
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.GOLD_UPDATE, this.updateGold, this);
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.DIAMOD_UPDATE, this.updateDiamond, this);
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.MANURE_UPDATE, this.updateManure, this);
    $10EventManager.EventManager.instance.on($10GameEnum.EGameEvent.OPEN_HOME_VIEW, this.onOpenHomeView, this);
    $10EventManager.EventManager.instance.on($10HomeEnum.EHomeEvent.SHOW_VIDEO_DIAMOMND_POPUP, this.showVideoDiamondPopup, this);
    $10EventManager.EventManager.instance.on($10HomeEnum.EHomeEvent.SHOW_PLANT_VIEW, this.showPlantView, this);
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.UPDATE_PLANT_LEVEL, this.onUpdatePlantLevel, this);
    this._maxPower = Number($10DataManager.DataManager.instance.eData.datapara[21].num);
    this._powerCd = 60 * Number($10DataManager.DataManager.instance.eData.datapara[22].num);
    if (0 == $10UserDataProxy.userDataProxy.userData.lastPowerTime && 0 == $10UserDataProxy.userDataProxy.userData.power) {
      $10UserDataProxy.userDataProxy.userData.power = this._maxPower;
      $10UserDataProxy.userDataProxy.saveData();
    }
    this.setPhysicalRootIsShow(1);
    this.initRedDot();
    this.updateGold();
    this.updateDiamond();
    this.updatePhysical();
    this.updateManure();
    this.onUpdatePlantLevel();
    this.mBattleView.active = true;
    $10PopupManager.PopupManager.instance.remove("SelectSkillPopup");
  };
  _ctor.prototype.initRedDot = function () {
    var t = this.node.getChildByName("downUI");
    var e = t.getChildByName("BtnShop").getChildByName("redDot");
    var o = t.getChildByName("BtnFight").getChildByName("redDot");
    var i = t.getChildByName("BtnPlant").getChildByName("redDot");
    var n = t.getChildByName("BtnHybrid").getChildByName("redDot");
    var a = t.getChildByName("BtnBase").getChildByName("redDot");
    var r = this.node.getChildByName("homeUI").getChildByName("BattleView").getChildByName("BtnModel").getChildByName("redDot");
    $10RedDotMgr.default.instance.mBattleRed = o;
    $10RedDotMgr.default.instance.mShopRed = e;
    $10RedDotMgr.default.instance.mPlantRed = i;
    $10RedDotMgr.default.instance.mHybridRed = n;
    $10RedDotMgr.default.instance.mBaseRed = a;
    $10RedDotMgr.default.instance.mWeatherRed = r;
    $10RedDotMgr.default.instance.initRedState();
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.POWER_UPDATE, this.updatePhysical, this);
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.GOLD_UPDATE, this.updateGold, this);
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.DIAMOD_UPDATE, this.updateDiamond, this);
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.MANURE_UPDATE, this.updateManure, this);
    $10EventManager.EventManager.instance.off($10GameEnum.EGameEvent.OPEN_HOME_VIEW, this.onOpenHomeView, this);
    $10EventManager.EventManager.instance.off($10HomeEnum.EHomeEvent.SHOW_VIDEO_DIAMOMND_POPUP, this.showVideoDiamondPopup, this);
    $10EventManager.EventManager.instance.off($10HomeEnum.EHomeEvent.SHOW_PLANT_VIEW, this.showPlantView, this);
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.UPDATE_PLANT_LEVEL, this.onUpdatePlantLevel, this);
  };
  _ctor.prototype.onUpdatePlantLevel = function () {
    var t = this.node.getChildByName("downUI").getChildByName("BtnHybrid").getChildByName("icon_zhandou");
    if (this.getHybridIsUnlock()) {
      $10Util.default.setSpriteNormalMaterial(t.getComponent(cc.Sprite));
      $10RedDotMgr.default.instance.updateRedDotState([$10HomeEnum.HOME_REDDOT.HYBRIDRED]);
    } else {
      $10Util.default.setSpriteGrayMaterial(t.getComponent(cc.Sprite));
    }
  };
  _ctor.prototype.onOpenHomeView = function (t) {
    var e = this.node.getChildByName("downUI");
    if (1 == t) {
      var o = {
        target: e.getChildByName("BtnPlant")
      };
      this.onBtnPlant(o);
    } else if (2 == t) {
      o = {
        target: e.getChildByName("BtnShop")
      };
      this.onBtnShop(o);
    }
  };
  _ctor.prototype.updateGold = function () {
    this.mGoldNum.string = $10MathUtil.MathUtil.formatValue($10UserDataProxy.userDataProxy.userData.gold);
  };
  _ctor.prototype.updateDiamond = function () {
    this.mDiamondNum.string = $10MathUtil.MathUtil.formatValue($10UserDataProxy.userDataProxy.userData.diamond);
  };
  _ctor.prototype.updateManure = function () {
    this.mManureNum.string = $10MathUtil.MathUtil.formatValue($10UserDataProxy.userDataProxy.userData.manure);
  };
  _ctor.prototype.updatePhysical = function () {
    this.mPhysicalNum.string = $10MathUtil.MathUtil.formatValue($10UserDataProxy.userDataProxy.userData.power);
    if ($10UserDataProxy.userDataProxy.userData.power < this._maxPower) {
      this.mPowerTime.node.active = true;
      if ($10UserDataProxy.userDataProxy.userData.lastPowerTime) {
        this.updatePowerCd($10UserDataProxy.userDataProxy.userData.lastPowerTime);
      } else {
        $10UserDataProxy.userDataProxy.userData.lastPowerTime = new Date().getTime(), $10UserDataProxy.userDataProxy.saveData(), this.updatePowerCd($10UserDataProxy.userDataProxy.userData.lastPowerTime);
      }
    } else {
      if ($10UserDataProxy.userDataProxy.userData.lastPowerTime > 0) {
        $10UserDataProxy.userDataProxy.userData.lastPowerTime = 0, $10UserDataProxy.userDataProxy.saveData(), this.unscheduleAllCallbacks();
      }
      this.mPowerTime.node.active = false;
    }
  };
  _ctor.prototype.updatePowerCd = function (t) {
    var e = this;
    var o = new Date().getTime();
    this.unscheduleAllCallbacks();
    var i = Math.floor((o - t) / 1e3);
    if (i >= this._powerCd) {
      var n = Math.floor(i / this._powerCd);
      if ($10UserDataProxy.userDataProxy.userData.power + n > this._maxPower) {
        $10UserDataProxy.userDataProxy.userData.power = this._maxPower;
        $10UserDataProxy.userDataProxy.userData.lastPowerTime = 0;
        this.mPowerTime.node.active = false;
        $10UserDataProxy.userDataProxy.saveData();
      } else {
        $10UserDataProxy.userDataProxy.userData.power += n;
        $10UserDataProxy.userDataProxy.userData.lastPowerTime = t + n * this._powerCd * 1e3;
        $10UserDataProxy.userDataProxy.saveData();
      }
      this.updatePhysical();
    } else {
      i = this._powerCd - i;
      this.mPowerTime.string = $10TimeUtil.TimeUtil.format_MMSS(1e3 * i);
      this.schedule(function () {
        i--;
        e.mPowerTime.string = $10TimeUtil.TimeUtil.format_MMSS(1e3 * i);
        if (i <= 0) {
          e.unscheduleAllCallbacks();
          e.updatePhysical();
        }
      }, 1);
    }
  };
  _ctor.prototype.showPlantView = function () {
    var t = this.node.getChildByName("downUI").getChildByName("BtnPlant");
    this.onBtnPlant({
      target: t
    });
  };
  _ctor.prototype.onBtnFight = function (t) {
    if (this._isCanClick) {
      if (cc.sys.isBrowser && yzll.gameConfig.isZB && !$10UserDataProxy.userDataProxy.userData.startGameRights) {
        $10GameUIManager.gameUIMgr.showTips("请先使用兑换码激活游戏~");
      } else {
        this.setPhysicalRootIsShow(1);
        this.setSelectIsShow(t);
        this.mBattleView.active = true;
        this.mPlantView && (this.mPlantView.active = false);
        this.mShopView && (this.mShopView.active = false);
        this.mHybridView && (this.mHybridView.active = false);
      }
    }
  };
  _ctor.prototype.onBtnShop = function (t) {
    var e = this;
    if (this._isCanClick) {
      if (cc.sys.isBrowser && yzll.gameConfig.isZB && !$10UserDataProxy.userDataProxy.userData.startGameRights) {
        $10GameUIManager.gameUIMgr.showTips("请先使用兑换码激活游戏~");
      } else {
        this.setPhysicalRootIsShow(2);
        this.setSelectIsShow(t);
        this.mBattleView.active = false;
        this.mPlantView && (this.mPlantView.active = false);
        if (this.mShopView) {
          this.mShopView.active = true;
        } else {
          this._isCanClick = false, $10ResUtil.ResUtil.loadAsset({
            path: "uis/homeView/ShopView",
            type: cc.Prefab,
            bundleName: $10HomeEnum.Bundles.GAME
          }).then(function (t) {
            e._isCanClick = true;
            e.mShopView = cc.instantiate(t);
            e.mBattleView.parent.addChild(e.mShopView, 3);
          }).catch(function (t) {
            console.log("error:", t);
          });
        }
        this.mHybridView && (this.mHybridView.active = false);
      }
    }
  };
  _ctor.prototype.onBtnPlant = function (t) {
    var e = this;
    if (this._isCanClick) {
      if (cc.sys.isBrowser && yzll.gameConfig.isZB && !$10UserDataProxy.userDataProxy.userData.startGameRights) {
        $10GameUIManager.gameUIMgr.showTips("请先使用兑换码激活游戏~");
      } else {
        this.setPhysicalRootIsShow(3);
        if (3 == $10UserDataProxy.userDataProxy.userData.gameCourseData.curId) {
          $10UserDataProxy.userDataProxy.completeCourse(4), $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.LOSE_COURSE_VIEW);
        }
        this.setSelectIsShow(t);
        this.mBattleView.active = false;
        if (this.mPlantView) {
          this.mPlantView.active = true;
        } else {
          this._isCanClick = false, $10ResUtil.ResUtil.loadAsset({
            path: "uis/homeView/PlantView",
            type: cc.Prefab,
            bundleName: $10HomeEnum.Bundles.GAME
          }).then(function (t) {
            e._isCanClick = true;
            e.mPlantView = cc.instantiate(t);
            e.mBattleView.parent.addChild(e.mPlantView, 3);
          }).catch(function (t) {
            console.log("error:", t);
          });
        }
        this.mShopView && (this.mShopView.active = false);
        this.mHybridView && (this.mHybridView.active = false);
      }
    }
  };
  _ctor.prototype.getHybridIsUnlock = function () {
    var t;
    var e = 0;
    var o = Number($10DataManager.DataManager.instance.eData.datapara[73].num);
    for (var i = 1; i <= 15; ++i) {
      if (((null === (t = $10UserDataProxy.userDataProxy.getPlantData(i)) || undefined === t ? undefined : t.lv) || 1) >= o && ++e >= 2) {
        return true;
      }
    }
    return false;
  };
  _ctor.prototype.onBtnHybrid = function (t) {
    var e = this;
    if (this._isCanClick) {
      if (cc.sys.isBrowser && yzll.gameConfig.isZB && !$10UserDataProxy.userDataProxy.userData.startGameRights) {
        $10GameUIManager.gameUIMgr.showTips("请先使用兑换码激活游戏~");
      } else if (this.getHybridIsUnlock()) {
        this.setPhysicalRootIsShow(4);
        this.setSelectIsShow(t);
        this.mBattleView.active = false;
        this.mPlantView && (this.mPlantView.active = false);
        this.mShopView && (this.mShopView.active = false);
        if (this.mHybridView) {
          this.mHybridView.active = true;
        } else {
          this._isCanClick = false;
          $10ResUtil.ResUtil.loadAsset({
            path: "uis/homeView/HybridView",
            type: cc.Prefab,
            bundleName: $10HomeEnum.Bundles.GAME
          }).then(function (t) {
            e._isCanClick = true;
            e.mHybridView = cc.instantiate(t);
            e.mBattleView.parent.addChild(e.mHybridView, 3);
          }).catch(function (t) {
            console.log("error:", t);
          });
        }
      } else {
        var o = Number($10DataManager.DataManager.instance.eData.datapara[73].num);
        $10GameUIManager.gameUIMgr.showTips("任意两个植物升级" + o + "级解锁");
      }
    }
  };
  _ctor.prototype.onBtnBase = function () {
    if (this._isCanClick) {
      if (cc.sys.isBrowser && yzll.gameConfig.isZB && !$10UserDataProxy.userDataProxy.userData.startGameRights) {
        $10GameUIManager.gameUIMgr.showTips("请先使用兑换码激活游戏~");
      } else {
        $10GameUIManager.gameUIMgr.showTips("尚未解锁!");
      }
    }
  };
  _ctor.prototype.setSelectIsShow = function (t) {
    var e = this.mNowBtn.getChildByName("selectBg");
    e.active = false;
    (e = t.target.getChildByName("selectBg")).active = true;
    this.mNowBtn = t.target;
  };
  _ctor.prototype.onCourseNotify = function () {};
  _ctor.prototype.setPhysicalRootIsShow = function (t) {
    this.mPhysicalRoot.active = 1 == t;
    this.mDiamondRoot.active = 1 != t && 4 != t;
    this.mManureRoot.active = 4 == t;
    this.mPowerTime.node.active = 1 == t && $10UserDataProxy.userDataProxy.userData.power < this._maxPower;
  };
  _ctor.prototype.update = function (t) {
    for (var e in $10BattleDataProxy.battleDataProxy.audioFilterInfo) {
      $10BattleDataProxy.battleDataProxy.audioFilterInfo[e].time -= t;
    }
  };
  _ctor.prototype.onDiamondRoot = function () {
    this.showVideoDiamondPopup();
  };
  _ctor.prototype.showVideoDiamondPopup = function () {
    var t = Number($10DataManager.DataManager.instance.eData.datapara[47].num);
    $10UserDataProxy.userDataProxy.userData.videoDiamondNum >= t || $10GameUIManager.gameUIMgr.showVideoDiamondPopup(function () {
      $10AdsMgr.default.showVideoAds({
        id: 1,
        eventId: "add_diamond_ad",
        success: function () {
          var t = Number($10DataManager.DataManager.instance.eData.datapara[46].num);
          var e = [];
          e.push({
            id: 2,
            num: t
          });
          $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
            list: e,
            type: 1
          });
          var o = $10UserDataProxy.userDataProxy.userData.videoDiamondNum;
          o++;
          $10UserDataProxy.userDataProxy.userData.videoDiamondNum = o;
          $10UserDataProxy.userDataProxy.saveData();
        },
        fail: function () {},
        error: function (t) {
          cc.log(t);
        }
      }, true);
    });
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mGoldNum", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mDiamondNum", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mPhysicalNum", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mPowerTime", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mNowBtn", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBattleView", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mGoldRoot", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mDiamondRoot", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mPhysicalRoot", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mManureRoot", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mManureNum", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10SceneBase.SceneBase);
exports.default = def_HomeScene;