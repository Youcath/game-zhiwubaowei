Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameUIManager = require("GameUIManager");
var $10CommonUtil = require("CommonUtil");
var $10Platform4399$$1 = require("Platform4399");
var $10PlatformApp$$1 = require("PlatformApp");
var $10PlatformKS = require("PlatformKS");
var $10PlatformQGame = require("PlatformQGame");
var $10PlatformTT = require("PlatformTT");
var $10PlatformWX = require("PlatformWX");
var p = function () {
  function t() {
    this.versionStr = "1.0.0";
    this.versionCode = 100;
    this.adUintId = {};
    console.log("Runtime：dev");
  }
  t.prototype.getChannelId = function () {
    return 0;
  };
  t.prototype.login = function (t) {
    t && t(false, null);
  };
  t.prototype.getUserInfo = function (t) {
    t && t();
  };
  t.prototype.getPlatform = function () {
    return "dev";
  };
  t.prototype.startVibrate = function () {};
  t.prototype.preloadAds = function () {};
  t.prototype.showBanner = function () {};
  t.prototype.hideBanner = function () {};
  t.prototype.showInterstitial = function () {};
  t.prototype.createGameClubButton = function () {};
  t.prototype.hideGameClubButton = function () {};
  t.prototype.umaTrackEvent = function (t, e) {
    if (yzll.gameConfig.bUseUma) {
      $10CommonUtil.CommonUtil.print("友盟 trackEvent id::", t);
      $10CommonUtil.CommonUtil.print("友盟 trackEvent data::", e);
    }
  };
  t.prototype.showVideoAds = function (t) {
    t.success && t.success();
  };
  t.prototype.uploadEvent = function () {};
  t.prototype.showToast = function (t, e, o, i) {
    undefined === i && (i = null);
  };
  t.prototype.showLoading = function (t) {
    $10GameUIManager.gameUIMgr.showTips(t);
  };
  t.prototype.hideLoading = function () {};
  t.prototype.shareAppMessage = function (t) {
    t.success && t.success();
  };
  t.prototype.requestSubscribeMessage = function (t, e) {
    e && e(false);
  };
  t.prototype.review = function () {};
  t.prototype.setClipboardData = function () {};
  t.prototype.restartMiniProgramSync = function () {};
  t.prototype.addShortcut = function () {};
  t.prototype.authorize = function () {};
  return t;
}();
window.mm = {};
cc.game.once(cc.game.EVENT_GAME_INITED, function () {
  mm.config = {
    env: 1
  };
  var t;
  var e = cc.view.getFrameSize();
  mm.orientation = e.width < e.height ? 1 : 2;
  mm.screen = Math.max(e.width, e.height) / Math.min(e.width, e.height) < 1.78 ? 1 : 2;
  mm.lang = ((t = cc.sys.localStorage.getItem("SysLanguage") || cc.sys.languageCode).includes("zh") && (t = "zh"), console.log("Lang:", t, " LanguageCode:", cc.sys.languageCode), t);
  mm.platform = yzll.gameConfig.is4399 ? new $10Platform4399$$1.Platform4399() : cc.sys.platform == cc.sys.WECHAT_GAME ? yzll.gameConfig.isKs ? new $10PlatformKS.PlatformKS() : new $10PlatformWX.PlatformWX() : cc.sys.platform == cc.sys.BYTEDANCE_GAME ? new $10PlatformTT.PlatformTT() : cc.sys.platform == cc.sys.ANDROID || cc.sys.os == cc.sys.OS_IOS ? new $10PlatformApp$$1.PlatformApp() : cc.sys.platform == cc.sys.OPPO_GAME || cc.sys.platform == cc.sys.VIVO_GAME ? new $10PlatformQGame.default() : new p();
});