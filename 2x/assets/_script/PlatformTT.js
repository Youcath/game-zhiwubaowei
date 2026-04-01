Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlatformTT = undefined;
var $10GameUIManager = require("GameUIManager");
var $10GameEnum = require("GameEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10OtherDataProxy = require("OtherDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10CommonUtil = require("CommonUtil");
var $10AppProxy = require("AppProxy");
var $10SceneManager = require("SceneManager");
var exp_PlatformTT = function () {
  function _ctor() {
    var t = this;
    this.versionStr = "1.2.3";
    this.versionCode = 123;
    this.systemInfo = null;
    this.launchInfo = null;
    this.shareTitle = "[有人@我]加班，加班，我要加班！";
    this.shareImageUrl = null;
    this.recorder = null;
    this.recorderVideoPath = null;
    this.recorderStopCallback = null;
    this.recorderErrorMsg = null;
    this.isStopRecorder = false;
    this.adUintId = {
      Video: {
        1: "5gb9cl65md9eggfb65",
        2: "5gb9cl65md9eggfb65"
      },
      Banner: {
        1: "4552986c79mi702kcm"
      },
      Interstitial: {
        1: "adunit-c7d874d483204568"
      }
    };
    this.shareTime = 0;
    this.shareSuccess = null;
    this.shareFail = null;
    this.shareComplete = null;
    this.bannerCache = {};
    this.interstitial = null;
    this.ttVideoAd = null;
    this.ttVideoObj = null;
    this._adsId = 1;
    $10CommonUtil.CommonUtil.print("运行环境：tt");
    this.systemInfo = tt.getSystemInfoSync();
    this.launchInfo = tt.getLaunchOptionsSync();
    this.showShareMenu({});
    this.checkUpdate();
    cc.game.on(cc.game.EVENT_HIDE, this.shareResult, this);
    var e = $10DataManager.DataManager.instance.getTTchannelId();
    if (0 == e) {
      $10DataManager.DataManager.instance.setTTchannelId(this.launchInfo.scene);
    } else {
      $10DataManager.DataManager.instance.mTTchannelId = e;
    }
    if ("021036" == this.launchInfo.scene && "homepage" === this.launchInfo.launch_from && "sidebar_card" === this.launchInfo.location) {
      console.log("玩家是从侧边栏进入的");
      $10DataManager.DataManager.isSidebarCardInGameForTT = true;
    }
    tt.onShow(function (e) {
      $10CommonUtil.CommonUtil.print("game_on_show callback = ", e);
      "021036" === e.scene && "homepage" === e.launch_from && "sidebar_card" === e.location && ($10DataManager.DataManager.isSidebarCardInGameForTT = true);
      $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.GAME_SHOW);
      var o = $10DataManager.DataManager.instance.getTTchannelId();
      if (0 == o) {
        $10DataManager.DataManager.instance.setTTchannelId(t.launchInfo.scene);
      } else {
        $10DataManager.DataManager.instance.mTTchannelId = o;
      }
    });
    tt.onHide(function () {
      $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.GAME_HIDE);
    });
  }
  Object.defineProperty(_ctor, "Inst", {
    get: function () {
      return this.inst || (this.inst = new this());
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.getPlatform = function () {
    return "tt";
  };
  _ctor.prototype.restartMiniProgramSync = function () {
    try {
      tt.restartMiniProgramSync();
    } catch (t) {
      console.log("restartMiniProgramSync调用失败", t);
    }
  };
  _ctor.prototype.getRandomNum = function (t, e, o) {
    undefined === o && (o = true);
    var i = e - t;
    var n = Math.random() * i + t;
    o && (n = Math.round(n));
    return n;
  };
  _ctor.prototype.showToast = function (t, e, o) {
    tt.showToast({
      title: t,
      icon: e,
      duration: o ? 1500 : 500
    });
  };
  _ctor.prototype.showLoading = function (t) {
    tt.showLoading({
      title: t
    });
  };
  _ctor.prototype.hideLoading = function () {
    tt.hideLoading();
  };
  _ctor.prototype.getChannelId = function () {
    return 3;
  };
  _ctor.prototype.login = function (t) {
    console.log("开始调用头条login获取code");
    var e = new Date().getTime();
    tt.login({
      success: function (o) {
        var i = new Date().getTime();
        console.log("获取code完成，总耗时" + (i - e) + "毫秒");
        t && t(true, o);
      },
      fail: function () {
        $10CommonUtil.CommonUtil.print("tt.login fail");
        t && t(false, null);
      }
    });
  };
  _ctor.prototype.authorize = function (t) {
    tt.getSetting({
      success: function (e) {
        if (e.authSetting[t.scope]) {
          console.log("已经授权过了");
          tt.getUserInfo({
            withCredentials: false,
            lang: "zh_CN",
            success: function (e) {
              console.log("获取到了用户信息");
              t.success && t.success(e);
            },
            fail: function () {
              console.log("获取用户信息失败");
              t.fail && t.fail(null);
            }
          });
        } else {
          console.log("没授权过，开始请求授权");
          tt.authorize({
            scope: t.scope,
            success: function () {
              tt.getUserInfo({
                withCredentials: false,
                lang: "zh_CN",
                success: function (e) {
                  console.log("获取到了用户信息");
                  t.success && t.success(e);
                },
                fail: function () {
                  console.log("获取用户信息失败");
                  t.fail && t.fail(null);
                }
              });
            },
            fail: function () {
              t.fail && t.fail(null);
            }
          });
        }
      },
      fail: function () {
        $10CommonUtil.CommonUtil.print("tt.getSetting fail");
        t.fail && t.fail(null);
      }
    });
  };
  _ctor.prototype.getUserInfo = function (t) {
    tt.login({
      success: function (e) {
        $10CommonUtil.CommonUtil.print("登录成功:", e);
        tt.getUserInfo({
          success: function (e) {
            $10CommonUtil.CommonUtil.print("getUserInfo 调用成功", e.userInfo);
            t && t({
              nickName: e.userInfo.nickName,
              avatarUrl: e.userInfo.avatarUrl
            });
          },
          fail: function (e) {
            $10CommonUtil.CommonUtil.print("getUserInfo 调用失败", e.errMsg);
            t && t();
          }
        });
      },
      fail: function (e) {
        $10CommonUtil.CommonUtil.print("登录失败", e.errMsg);
        t && t();
      }
    });
  };
  _ctor.prototype.shareAppMessage = function (t) {
    t || (t = {
      title: null,
      imageUrl: null,
      query: null,
      camera: null,
      success: null,
      fail: null,
      complete: null
    });
    this.shareTime = Date.now();
    this.shareSuccess = null == t ? undefined : t.success;
    this.shareFail = null == t ? undefined : t.fail;
    this.shareComplete = null == t ? undefined : t.complete;
    t.title = (null == t ? undefined : t.title) || (null == this ? undefined : this.shareTitle);
    if (null == t ? undefined : t.camera) {
      t.imageUrl = this.getImageUrlByCamera(t.camera);
    } else if (null == t ? undefined : t.imageUrl) {
      t.imageUrl = t.imageUrl;
    } else {
      t.imageUrl = this.getImageUrlFromCanvasCenter();
    }
    var e = ["[有人@我]你知道钓鱼的乐趣是什么吗？", "[有人@我]好兄弟，一起来钓鱼啊？", "[有人@我]我又刷新了世界钓鱼记录，来看看你在第几名"];
    tt.shareAppMessage({
      channel: "invite",
      title: e[this.getRandomNum(0, e.length - 1)],
      imageUrl: null,
      query: t.query,
      success: function (e) {
        $10CommonUtil.CommonUtil.print("分享成功" + JSON.stringify(e));
        t.success && t.success();
      },
      fail: function () {
        $10CommonUtil.CommonUtil.print("分享失败");
        t.fail && t.fail();
      }
    });
  };
  _ctor.prototype.shareResult = function () {
    if (Date.now() - this.shareTime > 3500) {
      this.shareSuccess && this.shareSuccess();
    } else {
      this.shareFail && this.shareFail();
    }
    this.shareComplete && this.shareComplete();
    this.shareTime = 0;
    this.shareSuccess = null;
    this.shareFail = null;
    this.shareComplete = null;
  };
  _ctor.prototype.getImageUrlFromCanvasCenter = function () {
    var t;
    var e;
    var o;
    var i;
    var n = cc.game.canvas.getContext("2d") || cc.game.canvas.getContext("webgl", {
      preserveDrawingBuffer: true
    });
    if (cc.winSize.width > cc.winSize.height) {
      o = (i = n.drawingBufferHeight) / 4 * 5;
    } else {
      i = (o = n.drawingBufferWidth) / 5 * 4;
    }
    t = (n.drawingBufferWidth - o) / 2;
    e = (n.drawingBufferHeight - i) / 2;
    return n.canvas.toTempFilePathSync({
      x: t,
      y: e,
      width: o,
      height: i,
      destWidth: 500,
      destHeight: 400
    });
  };
  _ctor.prototype.getImageUrlByCamera = function (t) {
    var e = new cc.RenderTexture();
    var o = cc.game._renderContext;
    e.initWithSize(500, 400, o.STENCIL_INDEX8);
    t.targetTexture = e;
    t.render(null);
    var i = e.readPixels();
    var n = document.createElement("canvas");
    var a = n.getContext("2d");
    var r = n.width = e.width;
    var s = n.height = e.height;
    n.width = e.width;
    n.height = e.height;
    var c = 4 * r;
    for (var l = 0; l < s; l++) {
      var u = s - 1 - l;
      var p = a.createImageData(r, 1);
      var h = u * r * 4;
      for (var d = 0; d < c; d++) {
        p.data[d] = i[h + d];
      }
      a.putImageData(p, 0, l);
    }
    return n.toTempFilePathSync();
  };
  _ctor.prototype.showShareMenu = function () {
    tt.showShareMenu({
      showShareItems: ["qq", "qzone", "wechatFriends", "wechatMoment"],
      withShareTicket: true
    });
    tt.onShareAppMessage(function () {
      var t = Math.round(2 * Math.random());
      return {
        title: ["[有人@我]僵尸来了，快上车！", "[有人@我]我被僵尸吃掉了~", "[有人@我]带好装备，出发！"][t],
        imageUrl: cc.url.raw("resources/share/" + ["share_img_1", "share_img_2", "share_img_3"][t] + ".png"),
        query: ""
      };
    });
  };
  _ctor.prototype.preloadAds = function () {};
  _ctor.prototype.addBanner = function (t) {
    var e = this;
    var o = t.id;
    var i = t.posNode;
    var n = t.width;
    var a = t.sCnt;
    var r = t.preload;
    var s = this.adUintId.Banner[o];
    n = cc.misc.clampf(n, 300, this.systemInfo.screenHeight);
    a = t.sCnt || 3;
    this.hideAllBanner();
    var c = function (t) {
      t.style.top = i ? e.systemInfo.screenHeight * (1 - i.getBoundingBoxToWorld().yMin / cc.winSize.height) : e.systemInfo.screenHeight - Math.ceil(t.style.realHeight) - 2;
    };
    if (!this.bannerCache[s] || this.bannerCache[s].sCnt <= 0) {
      this.bannerCache[s] && this.bannerCache[s].banner.destroy();
      var l = (this.systemInfo.screenWidth - n) / 2;
      var u = tt.createBannerAd({
        adUnitId: s,
        style: {
          left: l,
          top: this.systemInfo.screenHeight,
          width: n
        }
      });
      u.onError(function (t) {
        $10CommonUtil.CommonUtil.print(t);
      });
      u.onResize(function () {
        c(u);
      });
      this.bannerCache[s] = {
        banner: u,
        sCnt: a
      };
    } else {
      c(this.bannerCache[s].banner);
    }
    if (!r) {
      this.bannerCache[s].banner.show();
      this.bannerCache[s].sCnt -= 1;
    }
  };
  _ctor.prototype.showBanner = function () {};
  _ctor.prototype.hideBanner = function () {};
  _ctor.prototype.hideAllBanner = function () {
    for (var t in this.bannerCache) {
      this.bannerCache[t].banner.hide();
    }
  };
  _ctor.prototype.showInterstitial = function () {
    this.addInterstitial(1);
  };
  _ctor.prototype.addInterstitial = function (t) {
    var e = this;
    var o = this.adUintId.Interstitial[t];
    if (this.compareVersion("2.6.0")) {
      this.interstitial || (this.interstitial = tt.createInterstitialAd({
        adUnitId: o
      }));
      this.interstitial.load().then(function () {
        e.interstitial.show();
      }).catch(function (t) {
        console.error(t);
      });
    }
  };
  _ctor.prototype.hideInterstitial = function () {
    this.interstitial && this.interstitial.destroy();
  };
  _ctor.prototype.setClipboardData = function (t) {
    tt.setClipboardData({
      data: t,
      success: function () {
        $10GameUIManager.gameUIMgr.showTips("复制成功~");
      },
      fail: function () {
        $10GameUIManager.gameUIMgr.showTips("复制失败~");
      }
    });
  };
  _ctor.prototype.showVideoAds = function (t) {
    var e = this;
    if (yzll.gameConfig.isTest || yzll.gameConfig.isGM) {
      t.success && t.success();
      this.umaTrackEvent("video", {
        userA: t.eventId
      });
      return void this.umaTrackEvent("pay", {
        userA: this.ttVideoObj.eventId + "_" + $10UserDataProxy.userDataProxy.userData.curChapter
      });
    }
    this.ttVideoObj = t;
    var o = this.adUintId.Video[this._adsId];
    o || (o = this.adUintId.Video[1]);
    if (0 === o.length) {
      $10GameUIManager.gameUIMgr.showTips("广告加载失败!");
      return void (this.ttVideoObj.error && this.ttVideoObj.error());
    }
    if (!this.ttVideoAd) {
      this.ttVideoAd = tt.createRewardedVideoAd({
        adUnitId: o
      });
      this.ttVideoAd.offClose();
      this.ttVideoAd.offError();
      this.ttVideoAd.onClose(function (t) {
        $10SceneManager.SceneManager.instance.hideLoading();
        setTimeout(function () {
          if (t.isEnded) {
            $10GameUIManager.gameUIMgr.showTips("视频播放完毕!");
            e.umaTrackEvent("video", {
              userA: e.ttVideoObj.eventId
            });
            e.umaTrackEvent("pay", {
              userA: e.ttVideoObj.eventId + "_" + $10UserDataProxy.userDataProxy.userData.curChapter
            });
            $10OtherDataProxy.otherDataProxy.addCondition($10OtherDataProxy.ConditionKey.LOOKAD);
            e.ttVideoObj && e.ttVideoObj.success && e.ttVideoObj.success();
          } else {
            $10GameUIManager.gameUIMgr.showTips("视频未播放完毕!");
            e.ttVideoObj.fail && e.ttVideoObj.fail();
          }
          $10AudioManager.AudioManager.instance.resumeBgm();
        }, 10);
        e._adsId++;
        e._adsId > 2 && (e._adsId = 1);
      }, 10);
      this.ttVideoAd.onError(function (t) {
        $10SceneManager.SceneManager.instance.hideLoading();
        $10CommonUtil.CommonUtil.print(t);
        e.ttVideoObj.error && e.ttVideoObj.error();
        e._adsId++;
        e._adsId > 2 && (e._adsId = 1);
        $10GameUIManager.gameUIMgr.showTips("广告加载失败!");
      });
    }
    if (this.ttVideoAd) {
      $10SceneManager.SceneManager.instance.showLoading();
      this.ttVideoAd.load().then(function () {
        e.ttVideoAd.show().then(function () {
          $10AudioManager.AudioManager.instance.pauseBgm();
          $10CommonUtil.CommonUtil.print("视频广告显示成功");
          $10SceneManager.SceneManager.instance.hideLoading();
          Date.now();
        }).catch(function () {
          $10GameUIManager.gameUIMgr.showTips("广告加载失败!");
          e.ttVideoObj.error && e.ttVideoObj.error();
          $10SceneManager.SceneManager.instance.hideLoading();
        });
      }).catch(function () {
        $10GameUIManager.gameUIMgr.showTips("广告加载失败!");
        e.ttVideoObj.error && e.ttVideoObj.error();
        $10SceneManager.SceneManager.instance.hideLoading();
      });
    } else {
      $10GameUIManager.gameUIMgr.showTips("广告加载失败!");
      this.ttVideoObj.error && this.ttVideoObj.error();
    }
    setTimeout(function () {
      $10SceneManager.SceneManager.instance.hideLoading();
    }, 2e3);
  };
  _ctor.prototype.compareVersion = function (t) {
    var e = this.systemInfo.SDKVersion;
    var o = /\d+.\d+.\d+/;
    if (!o.test(t) || !o.test(e)) {
      console.warn("SDKVersion取值异常");
      return false;
    }
    var i = e.split(".");
    var n = t.split(".");
    for (var a = 0; a < 3; a++) {
      var r = parseInt(i[a]);
      var s = parseInt(n[a]);
      if (r > s) {
        return true;
      }
      if (r < s) {
        return false;
      }
    }
    return true;
  };
  _ctor.prototype.checkUpdate = function () {
    var t = tt.getUpdateManager();
    t.onUpdateReady(function () {
      tt.showModal({
        title: "更新提示",
        content: "新版本已准备好，是否重启应用？",
        success: function (e) {
          e.confirm && t.applyUpdate();
        }
      });
    });
  };
  _ctor.prototype.review = function () {};
  _ctor.prototype.startVibrate = function (t) {
    undefined === t && (t = false);
    t && tt.vibrateLong({
      success: function () {},
      fail: function () {}
    });
    !t && tt.vibrateShort({
      success: function () {},
      fail: function () {}
    });
  };
  _ctor.prototype.uploadEvent = function () {};
  _ctor.prototype.recorderStart = function (t, e) {
    var o = this;
    if (!this.recorder) {
      tt && tt.getGameRecorderManager() && (this.recorder = tt.getGameRecorderManager());
      if (!this.recorder) {
        return;
      }
      $10CommonUtil.CommonUtil.print("开始录制");
      this.recorder.onStart(function (t) {
        $10CommonUtil.CommonUtil.print("录屏开始");
        o.isStopRecorder = false;
        o.recorderVideoPath = "";
        e && e(true, t);
      });
      this.recorder.onPause(function () {
        $10CommonUtil.CommonUtil.print("录屏暂停");
      });
      this.recorder.onResume(function () {
        $10CommonUtil.CommonUtil.print("录屏恢复");
      });
      this.recorder.onStop(function (t) {
        o.isStopRecorder = true;
        $10CommonUtil.CommonUtil.print("录屏停止，文件保存在：", t.videoPath);
        o.recorderVideoPath = t.videoPath;
        $10CommonUtil.CommonUtil.print("录屏停止，this.recorderStopCallback：", o.recorderStopCallback);
        o.recorderStopCallback && o.recorderStopCallback(true);
      });
      this.recorder.onError(function (t) {
        $10CommonUtil.CommonUtil.print("录屏失败，errMsg：" + t);
        o.recorderErrorMsg = t;
        o.recorderStopCallback && o.recorderStopCallback(false);
      });
    }
    this.recorder.start({
      duration: t
    });
  };
  _ctor.prototype.recordPause = function () {
    this.recorder && this.recorder.pause();
  };
  _ctor.prototype.recordResume = function () {
    this.recorder && this.recorder.resume();
  };
  _ctor.prototype.recordStop = function (t) {
    undefined === t && (t = null);
    $10CommonUtil.CommonUtil.print("停止录制：", !this.recorder + "" + this.isStopRecorder);
    if (this.recorder) {
      if (this.isStopRecorder) {
        t && t();
      } else {
        this.recorderStopCallback = t;
        this.isStopRecorder = true;
        $10CommonUtil.CommonUtil.print("调停止录制接口");
        this.recorder.stop();
      }
    }
  };
  _ctor.prototype.recorderShare = function (t) {
    if (!this.recorder) {
      $10CommonUtil.CommonUtil.print("分享录屏失败1");
      return void (t && t(false, "录屏失败，请稍后再试"));
    }
    if ("" == this.recorderVideoPath) {
      $10CommonUtil.CommonUtil.print("分享录屏失败2");
      return void (t && t(false, this.recorderErrorMsg));
    }
    var e = this.recorderVideoPath;
    tt.shareAppMessage({
      channel: "video",
      extra: {
        videoPath: e,
        videoTopics: ["进我鱼塘", "进我鱼塘小游戏"]
      },
      success: function (e) {
        $10CommonUtil.CommonUtil.print("分享成功：", e);
        $10AudioManager.AudioManager.instance.resumeBgm();
        setTimeout(function () {
          t && t(true, e);
        }, 10);
      },
      fail: function (e) {
        $10CommonUtil.CommonUtil.print("分享失败：", e);
        $10AudioManager.AudioManager.instance.resumeBgm();
        setTimeout(function () {
          t && t(false, e);
        }, 10);
      }
    });
  };
  _ctor.prototype.checkFollowState = function (t) {
    tt.checkFollowState({
      success: function (e) {
        $10CommonUtil.CommonUtil.print(e.result);
        t && t(e.result);
      }
    });
  };
  _ctor.prototype.followOfficialAccount = function (t) {
    tt.followOfficialAccount({
      success: function (e) {
        if (0 === e.errCode) {
          $10CommonUtil.CommonUtil.print("关注成功");
          t && t(true);
        } else {
          $10CommonUtil.CommonUtil.print(e.errMsg);
          t && t(false);
        }
      }
    });
  };
  _ctor.prototype.checkGroupInfo = function (t) {
    var e = false;
    try {
      var o = tt.getSystemInfoSync();
      $10CommonUtil.CommonUtil.print("手机型号为 " + o.model);
      e = "Douyin" == o.appName || "douyin_lite" == o.appName;
    } catch (i) {
      $10CommonUtil.CommonUtil.print("获取系统信息失败");
      t && t(false);
    }
    t && t(e);
  };
  _ctor.prototype.joinGroup = function (t, e) {
    $10CommonUtil.CommonUtil.print("加入群id:", t);
    tt.joinGroup({
      groupid: t,
      success: function (t) {
        $10CommonUtil.CommonUtil.print(t);
        e && e(true);
      },
      fail: function (t) {
        $10CommonUtil.CommonUtil.print(t);
        e && e(false);
      }
    });
  };
  _ctor.prototype.checkFollowAwemeState = function (t) {
    var e = false;
    try {
      var o = tt.getSystemInfoSync();
      $10CommonUtil.CommonUtil.print("手机型号为 " + o.model);
      e = "Douyin" == o.appName || "douyin_lite" == o.appName;
    } catch (i) {
      $10CommonUtil.CommonUtil.print("获取系统信息失败");
      t && t(false);
    }
    if (e) {
      t && t(true);
    } else {
      t && t(false);
    }
  };
  _ctor.prototype.openAwemeUserProfile = function (t) {
    tt.openAwemeUserProfile({
      success: function (e) {
        $10CommonUtil.CommonUtil.print("调用成功", e);
        t && t(true);
      },
      fail: function (e) {
        $10CommonUtil.CommonUtil.print("调用失败", e);
        t && t(false);
      }
    });
  };
  _ctor.prototype.requestSubscribeMessage = function (t, e) {
    tt.requestSubscribeMessage({
      tmplIds: t,
      success: function (t) {
        e && e(true, t);
      },
      fail: function (t) {
        e && e(false, t);
      }
    });
  };
  _ctor.prototype.createGameClubButton = function () {};
  _ctor.prototype.hideGameClubButton = function () {};
  _ctor.prototype.umaTrackEvent = function (t, e) {
    if ((!$10BattleDataProxy.battleDataProxy.isEndless && $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.NONE || "video" == t || "pay" == t || "time" == t) && yzll.gameConfig.bUseUma) {
      $10CommonUtil.CommonUtil.print("友盟 trackEvent::", t);
      var o = e.userA;
      var i = this.versionStr;
      $10UserDataProxy.userDataProxy.userData.versionStr && "" != $10UserDataProxy.userDataProxy.userData.versionStr && (i = $10UserDataProxy.userDataProxy.userData.versionStr);
      o && (o = i + "_" + o);
      console.log("友盟上传数据:", o);
      var s = {};
      if ("a" == $10DataManager.DataManager.instance.userVersion) {
        t && sfdata.SfTrackData.instance.trackEvent(t, "userA", o);
        s.userA = o;
      } else if ("b" == $10DataManager.DataManager.instance.userVersion) {
        t && sfdata.SfTrackData.instance.trackEvent(t, "userB", o);
        s.userB = o;
      } else {
        t && sfdata.SfTrackData.instance.trackEvent(t, "userD", o);
        s.userD = o;
      }
      t && tt.uma.trackEvent(t, s);
    }
  };
  _ctor.prototype.addShortcut = function () {
    tt.addShortcut({
      success: function () {
        $10GameUIManager.gameUIMgr.showTips("添加桌面成功!");
      },
      fail: function (t) {
        console.log("添加桌面失败:", t);
        $10GameUIManager.gameUIMgr.showTips("添加桌面失败!");
      }
    });
  };
  _ctor.inst = null;
  return _ctor;
}();
exports.PlatformTT = exp_PlatformTT;