var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Platform4399 = exports.EditInputParams = undefined;
var $10GameUIManager = require("GameUIManager");
var $10OtherDataProxy = require("OtherDataProxy");
var $10AudioManager = require("AudioManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var exp_EditInputParams = function () {
  this.defaultText = null;
  this.keyboardStateCllback = null;
  this.textChangeCllback = null;
  this.textCompleteCllback = null;
  this.keyboardDeleteCallback = null;
  this.maxLength = 1e3;
  this.inputType = "text";
};
exports.EditInputParams = exp_EditInputParams;
var exp_Platform4399 = function () {
  function _ctor() {
    this.versionStr = "1.0.1";
    this.versionCode = 101;
    this.adUintId = {};
    console.log("4399");
  }
  var e;
  e = _ctor;
  Object.defineProperty(_ctor, "Inst", {
    get: function () {
      return this.inst || (this.inst = new this());
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.getChannelId = function () {
    return 0;
  };
  _ctor.prototype.login = function (t) {
    h5api.login(function (e) {
      t && t(e.uId, e.userName);
    });
  };
  _ctor.prototype.getUserInfo = function (t) {
    t && t();
  };
  _ctor.prototype.getPlatform = function () {
    return cc.sys.os;
  };
  _ctor.prototype.authorize = function () {};
  _ctor.prototype.setKeepScreenOn = function () {};
  _ctor.prototype.requestSubscribeMessage = function () {};
  _ctor.prototype.createGameClubButton = function () {};
  _ctor.prototype.hideGameClubButton = function () {};
  _ctor.prototype.showToast = function (t) {
    $10GameUIManager.gameUIMgr.showTips(t);
  };
  _ctor.prototype.showLoading = function (t) {
    $10GameUIManager.gameUIMgr.showTips(t);
  };
  _ctor.prototype.hideLoading = function () {};
  _ctor.prototype.shareAppMessage = function () {};
  _ctor.prototype.startVibrate = function (t) {
    undefined === t && (t = false);
  };
  _ctor.prototype.review = function () {};
  _ctor.initSDK = function (t) {
    this._ohayooInitCallback = t;
  };
  _ctor.initSDKResult = function () {
    this._ohayooInitCallback && this._ohayooInitCallback();
  };
  _ctor.showAgeTips = function () {};
  _ctor.showPrivacyPolicy = function () {};
  _ctor.prototype.preloadAds = function () {};
  _ctor.prototype.showBanner = function () {};
  _ctor.prototype.hideBanner = function () {};
  _ctor.prototype.showInterstitial = function () {
    h5api.playInterstitialAd();
  };
  _ctor.prototype.setClipboardData = function () {};
  _ctor.prototype.restartMiniProgramSync = function () {};
  _ctor.prototype.showVideoAds = function (t) {
    e._eventId = t.eventId;
    e.isRequestVideo = true;
    e._successCallback = t.success;
    e._failCallback = t.fail;
    e._errorCallback = t.error;
    h5api.playAd(function (t) {
      console.log("代码:" + t.code + ",消息:" + t.message);
      if (1e4 === t.code) {
        console.log("开始播放");
        $10AudioManager.AudioManager.instance.isOpenBackgroundAudio && cc.audioEngine.pauseAll();
        cc.game.pause();
      } else if (10001 === t.code) {
        console.log("播放结束");
        e.appVideoCompleted();
      } else {
        console.log("广告异常");
        e.appVideoError();
      }
    });
  };
  _ctor.appVideoCompleted = function () {
    var t = this;
    cc.game.resume();
    console.log("=====广告回调成功");
    this.isRequestVideo = false;
    setTimeout(function () {
      $10OtherDataProxy.otherDataProxy.addCondition($10OtherDataProxy.ConditionKey.LOOKAD);
      t._successCallback && t._successCallback();
      t._successCallback = null;
      t._errorCallback = null;
      $10AudioManager.AudioManager.instance.isOpenBackgroundAudio && cc.audioEngine.resumeAll();
    }, 10);
  };
  _ctor.appVideoClose = function () {
    var t = this;
    cc.game.resume();
    console.log("=====广告未看完");
    this.isRequestVideo = false;
    setTimeout(function () {
      t._failCallback && t._failCallback();
      t._failCallback = null;
      t._errorCallback = null;
      $10AudioManager.AudioManager.instance.isOpenBackgroundAudio && cc.audioEngine.resumeAll();
    }, 10);
  };
  _ctor.appVideoError = function () {
    cc.game.resume();
    console.log("=====广告回调失败");
    this.isRequestVideo = false;
    this._errorCallback && this._errorCallback();
    this._errorCallback = null;
    this._successCallback = null;
    this._failCallback = null;
    $10AudioManager.AudioManager.instance.isOpenBackgroundAudio && cc.audioEngine.resumeAll();
  };
  _ctor.resultFeedError = function () {};
  _ctor.resultSplash = function () {};
  _ctor.prototype.uploadEvent = function () {};
  _ctor.exitGame = function () {
    cc.game.end();
  };
  _ctor.ohayooSdkInitFail = function (t) {
    console.log(" ------------ errorMsg:", t);
    this.mInitOhayooSdkCallback && this.mInitOhayooSdkCallback(t);
    this.mInitOhayooSdkCallback = null;
  };
  _ctor.loginComplete = function (t, e, o) {
    console.log(" ------------ 登录回调回来:", "nikeName:" + t + "---openId:" + e + "---avatar:" + o);
    this.mLoginComplete(t, e, o);
    this.mLoginComplete = null;
  };
  _ctor.prototype.addShortcut = function () {};
  _ctor.prototype.umaTrackEvent = function () {};
  _ctor.inst = null;
  _ctor._ohayooInitCallback = null;
  _ctor._successCallback = null;
  _ctor._failCallback = null;
  _ctor._errorCallback = null;
  _ctor.isAntiAddictionOK = false;
  _ctor.mInitOhayooSdkCallback = null;
  _ctor.mLoginComplete = null;
  _ctor.isRequestVideo = false;
  _ctor._eventId = "";
  return e = cc__decorate([ccp_ccclass], _ctor);
}();
exports.Platform4399 = exp_Platform4399;
window.Platform4399 = exp_Platform4399;