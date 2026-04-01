var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gameUIMgr = exports.GameUIManager = undefined;
var $10AppBase = require("AppBase");
var $10ComponentBase = require("ComponentBase");
var $10ResUtil = require("ResUtil");
var $10PopupManager = require("PopupManager");
var $10HomeEnum = require("HomeEnum");
var $10Tips = require("Tips");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var exp_GameUIManager = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    exports.gameUIMgr = this;
    t.prototype.onLoad.call(this);
  };
  _ctor.prototype.showDeclaration = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "uis/main/CopyrightPopup",
      keep: true
    });
  };
  _ctor.prototype.showPublicTips = function (t, e, o, i, n) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "uis/main/PublicTipsPopup",
      keep: true,
      params: {
        okCallBack: t,
        des: e,
        isVideo: o,
        cancelCallBack: i,
        btnDes: n
      }
    });
  };
  _ctor.prototype.showTips = function (t) {
    var e = $10AppBase.topNode.getChildByName("Tips");
    if (e) {
      var o = e.getComponent($10Tips.default);
      if (o) {
        return void o.pushTips(t);
      }
    }
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.RES,
      path: "uis/popup/Tips",
      type: cc.Prefab,
      success: function (e) {
        e.addRef();
        var o = cc.instantiate(e);
        $10AppBase.topNode.addChild(o);
        var i = o.getComponent($10Tips.default);
        i && i.pushTips(t);
      }
    });
  };
  _ctor.prototype.showReceiveReward = function (t) {
    undefined === t && (t = null);
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.RES,
      path: "uis/popup/ReceiveAwardPopup",
      keep: true,
      params: {
        onOpenComplete: t
      }
    });
  };
  _ctor.prototype.showBuyPower = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "uis/main/VitBuyPopup",
      keep: true
    });
  };
  _ctor.prototype.showBuyGold = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "uis/main/GoldBuyPopup",
      keep: true
    });
  };
  _ctor.prototype.showTTSidebarPopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: "res_TTSidebar",
      path: "prefab/TTSidebarPopup",
      keep: true
    });
  };
  _ctor.prototype.showSelectSkillPopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/SelectSkillPopup",
      keep: true
    });
  };
  _ctor.prototype.showGameRevivePopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/GameRevivePopup",
      keep: true
    });
  };
  _ctor.prototype.showGameWinPopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/GameWinPopup",
      keep: true
    });
  };
  _ctor.prototype.showGameLosePopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/GameLosePopup",
      keep: true
    });
  };
  _ctor.prototype.showGameSettingPopup = function (t) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/GameSettingPopup",
      keep: true,
      params: {
        isGame: t
      }
    });
  };
  _ctor.prototype.showGameLoopRewardPopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/GameLoopRewardPopup",
      keep: true
    });
  };
  _ctor.prototype.showPlantEquipDetailsPopup = function (t, e, o, i) {
    undefined === i && (i = true);
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/PlantEquipDetailsPopup",
      keep: true,
      params: {
        plantData: t,
        isWear: e,
        isShowWear: i,
        idx: o
      }
    });
  };
  _ctor.prototype.showHybridPlantDetailsPopup = function (t, e, o) {
    undefined === o && (o = true);
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/HybridPlantDetailsPopup",
      keep: true,
      params: {
        isWear: e,
        hybridPlantData: t,
        isShowWear: o
      }
    });
  };
  _ctor.prototype.showCongratsGettingPopup = function (t, e, o) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/CongratsGettingPopup",
      keep: true,
      params: {
        args: t,
        title: e,
        isGray: o
      }
    });
  };
  _ctor.prototype.showEquipmentFragmentsPopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/EquipmentFragmentsPopup",
      keep: true
    });
  };
  _ctor.prototype.showUnlockNewPlantPopup = function (t) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/UnlockNewPlantPopup",
      keep: true,
      params: {
        closeFunc: t
      }
    });
  };
  _ctor.prototype.showSuperPlantMapPopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/SuperPlantMapPopup",
      keep: true
    });
  };
  _ctor.prototype.showVideoPhysicalPopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/VideoPhysicalPopup",
      keep: true
    });
  };
  _ctor.prototype.showSelectSuperPlantPopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/SelectSuperPlantPopup",
      keep: true
    });
  };
  _ctor.prototype.showEnemyDetailsPopup = function (t) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/EnemyDetailsPopup",
      keep: true,
      params: {
        enemyId: t
      }
    });
  };
  _ctor.prototype.showVideoDiamondPopup = function (t) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/VideoDiamondPopup",
      keep: true,
      params: {
        closeFunc: t
      }
    });
  };
  _ctor.prototype.showCoursePopup = function (t) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/CoursePopup",
      keep: true,
      params: {
        args: t
      }
    });
  };
  _ctor.prototype.showTortWarningPopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/TortWarningPopup",
      keep: true
    });
  };
  _ctor.prototype.showTTSidebar = function () {
    console.log("打开侧边栏");
    $10PopupManager.PopupManager.instance.show({
      bundleName: "res_TTSidebar",
      path: "prefab/TTSidebarPopup",
      keep: true,
      params: {}
    });
  };
  _ctor.prototype.showPromoteTipsPopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/PromoteTipsPopup",
      keep: true
    });
  };
  _ctor.prototype.showRandomSuperPlantPopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/RandomSuperPlantPopup",
      keep: true
    });
  };
  _ctor.prototype.showVideoSunshinePopup = function (t) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/VideoSunshinePopup",
      keep: true,
      params: {
        closeFunc: t
      }
    });
  };
  _ctor.prototype.showEndlessStartPopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/EndlessStartPopup",
      keep: true
    });
  };
  _ctor.prototype.showEndlessRewardPopup = function (t) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/EndlessRewardPopup",
      keep: true,
      params: {
        myRank: t
      }
    });
  };
  _ctor.prototype.showSetNikeNamePopup = function (t) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/SetNikeNamePopup",
      keep: true,
      params: {
        closeFunc: t
      }
    });
  };
  _ctor.prototype.showEndlessOverPopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/EndlessOverPopup",
      keep: true
    });
  };
  _ctor.prototype.showContinueGamePopup = function (t) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/ContinueGamePopup",
      keep: true,
      params: {
        callBack: t
      }
    });
  };
  _ctor.prototype.showMessagePopup = function (t, e, o, i, n, a, r, s) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/MessagePopup",
      keep: true,
      params: {
        title: t,
        tips: e,
        isVideo: o,
        isGameVideo: i,
        closeLab: n,
        sltLab: a,
        hideClose: r,
        callBack: s
      }
    });
  };
  _ctor.prototype.showBlockBoxRewardPopup = function (t, e) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/BlockBoxRewardPopup",
      keep: true,
      params: {
        type: t,
        callBack: e
      }
    });
  };
  _ctor.prototype.showHybridStarPopup = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/HybridStarPopup",
      keep: true
    });
  };
  _ctor.prototype.showUnlockHybridPlantPopup = function (t, e) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/UnlockHybridPlantPopup",
      keep: true,
      params: {
        plantId: t,
        callback: e
      }
    });
  };
  _ctor.prototype.showVideoManurePopup = function (t) {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/popup/VideoManurePopup",
      keep: true,
      params: {
        closeFunc: t
      }
    });
  };
  _ctor.prototype.showReportUI = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: "res_Report",
      path: "UIReport",
      keep: true
    });
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComponentBase.ComponentBase);
exports.GameUIManager = exp_GameUIManager;