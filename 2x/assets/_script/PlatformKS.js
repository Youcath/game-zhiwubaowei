Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlatformKS = undefined;
var $10GameUIManager = require("GameUIManager");
var $10AudioManager = require("AudioManager");
var $10CommonUtil = require("CommonUtil");
var $10SceneManager = require("SceneManager");
var exp_PlatformKS = function () {
  function _ctor() {
    this.versionStr = "1.0.1";
    this.versionCode = 101;
    this.mVideo = null;
    this.systemInfo = null;
    this.launchInfo = null;
    this.shareTitle = "[有人@我]加班，加班，我要加班！";
    this.shareImageUrl = null;
    this.adUintId = {
      Video: {
        1: "2300020179_01",
        2: "2300020179_01",
        3: "2300020179_01"
      },
      Banner: {
        1: "adunit-81db461af35a9730"
      },
      Interstitial: {
        1: "adunit-c7d874d483204568"
      }
    };
    this.gameClubButton = null;
    this.shareTime = 0;
    this.shareSuccess = null;
    this.shareFail = null;
    this.shareComplete = null;
    this.bannerCache = {};
    this.interstitial = null;
    this._adsId = 1;
    this.ttVideoObj = null;
    $10CommonUtil.CommonUtil.print("运行环境：ks");
    this.systemInfo = wx.getSystemInfoSync();
    this.launchInfo = wx.getLaunchOptionsSync();
    cc.game.on(cc.game.EVENT_SHOW, this.shareResult, this);
  }
  _ctor.prototype.getPlatform = function () {
    return "wx";
  };
  _ctor.compareVersion = function (t) {
    var e = wx.getSystemInfoSync().SDKVersion;
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
  _ctor.prototype.getRandomNum = function (t, e, o) {
    undefined === o && (o = true);
    var i = e - t;
    var n = Math.random() * i + t;
    o && (n = Math.round(n));
    return n;
  };
  _ctor.prototype.showToast = function (t, e, o) {
    wx.showToast({
      title: t,
      icon: e,
      duration: o ? 1500 : 500
    });
  };
  _ctor.prototype.showLoading = function (t) {
    wx.showLoading({
      title: t
    });
  };
  _ctor.prototype.hideLoading = function () {
    wx.hideLoading();
  };
  _ctor.prototype.getChannelId = function () {
    return 1;
  };
  _ctor.prototype.login = function (t) {
    wx.login({
      success: function (e) {
        t && t(true, e);
      },
      fail: function () {
        $10CommonUtil.CommonUtil.print("wx.login fail");
        t && t(false, null);
      }
    });
  };
  _ctor.prototype.authorize = function (t) {
    var e = this;
    wx.getSetting({
      success: function (o) {
        if (o.authSetting[t.scope]) {
          if ("scope.userInfo" != t.scope) {
            t.success && t.success();
          } else {
            wx.getUserInfo({
              withCredentials: true,
              lang: "zh_CN",
              success: function (e) {
                t.success && t.success(e);
              }
            });
          }
        } else if ("scope.userInfo" != t.scope) {
          wx.authorize({
            scope: t.scope,
            success: function () {
              t.success && t.success();
            },
            fail: function () {
              t.fail && t.fail();
            }
          });
        } else if (e.compareVersion("2.0.7")) {
          var i = wx.createUserInfoButton({
            withCredentials: true,
            type: "text",
            text: "",
            style: {
              left: 0,
              top: 0,
              width: cc.winSize.width,
              height: cc.winSize.height,
              backgroundColor: "#00000000",
              fontSize: 16,
              lineHeight: 20,
              color: "#000000",
              textAlign: "center",
              borderRadius: 0
            }
          });
          var n = true;
          i.onTap(function (e) {
            if (e.userInfo) {
              $10CommonUtil.CommonUtil.print("用户授权");
              i.destroy();
              if (n) {
                n = false, t.success && t.success(e);
              }
            } else {
              $10CommonUtil.CommonUtil.print("拒绝授权用户信息");
              i.destroy();
              t.fail && t.fail();
            }
          });
        } else {
          wx.showModal({
            title: "温馨提示",
            content: "当前微信版本过低，请升级到最新版微信后重试!"
          });
        }
      },
      fail: function () {
        $10CommonUtil.CommonUtil.print("wx.getSetting fail");
        t.fail && t.fail();
      }
    });
  };
  _ctor.prototype.createGameClubButton = function (t) {
    if (this.gameClubButton) {
      this.gameClubButton.show();
    } else {
      var e = cc.size(t.width + 10, t.height + 10);
      var o = cc.view.getFrameSize();
      var i = cc.director.getWinSize();
      var n = (.5 * i.width + t.x - .5 * e.width) / i.width * o.width;
      var a = (.5 * i.height - t.y - .5 * e.height) / i.height * o.height;
      var r = e.width / i.width * o.width;
      var s = e.height / i.height * o.height;
      this.gameClubButton = wx.createGameClubButton({
        type: "text",
        text: "  ",
        style: {
          left: n,
          top: a,
          width: r,
          height: s
        }
      });
    }
  };
  _ctor.prototype.hideGameClubButton = function () {
    this.gameClubButton && this.gameClubButton.hide();
  };
  _ctor.prototype.getUserInfo = function (t) {
    var e = this;
    wx.login({
      success: function (o) {
        $10CommonUtil.CommonUtil.print("登录成功:", o);
        e.authorize({
          scope: "scope.userInfo",
          success: function () {
            wx.getUserInfo({
              success: function (e) {
                $10CommonUtil.CommonUtil.print("getUserInfo 调用成功", e.userInfo);
                t && t(e.userInfo);
              },
              fail: function (e) {
                $10CommonUtil.CommonUtil.print("getUserInfo 调用失败", e.errMsg);
                t && t();
              }
            });
          },
          fail: function () {
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
    var e = ["[有人@我]僵尸来了，快上车！", "[有人@我]我被僵尸吃掉了~", "[有人@我]带好装备，出发！"];
    $10CommonUtil.CommonUtil.print("分享出去：", t.query);
    var o = this.getRandomNum(0, e.length - 1);
    wx.shareAppMessage({
      title: e[o],
      imageUrl: cc.url.raw("resources/share/" + ["share_img_1", "share_img_2", "share_img_3"][o] + ".png"),
      query: t.query
    });
  };
  _ctor.prototype.shareResult = function () {
    $10AudioManager.AudioManager.instance.resumeBgm();
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
    wx.showShareMenu({
      showShareItems: ["qq", "qzone", "wechatFriends", "wechatMoment"],
      withShareTicket: true
    });
    wx.onShareAppMessage(function () {
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
    var r = t.sCnt;
    var s = t.preload;
    var c = this.adUintId.Banner[o];
    n = cc.misc.clampf(n, 300, this.systemInfo.screenHeight);
    r = t.sCnt || 5;
    this.hideAllBanner();
    var l = function (t) {
      t.style.top = i ? e.systemInfo.screenHeight * (1 - i.getBoundingBoxToWorld().yMin / cc.winSize.height) : e.systemInfo.screenHeight - Math.ceil(t.style.realHeight) - 2;
    };
    if (!this.bannerCache[c] || this.bannerCache[c].sCnt <= 0) {
      this.bannerCache[c] && this.bannerCache[c].banner.destroy();
      var u = (this.systemInfo.screenWidth - n) / 2;
      var p = wx.createBannerAd({
        adUnitId: c,
        style: {
          left: u,
          top: this.systemInfo.screenHeight,
          width: n
        }
      });
      p.onError(function (t) {
        $10CommonUtil.CommonUtil.print(t);
      });
      p.onResize(function () {
        l(p);
      });
      this.bannerCache[c] = {
        banner: p,
        sCnt: r
      };
    } else {
      l(this.bannerCache[c].banner);
    }
    if (!s) {
      this.bannerCache[c].banner.show();
      this.bannerCache[c].sCnt -= 1;
    }
  };
  _ctor.prototype.showBanner = function () {
    this.addBanner({
      id: 1,
      width: 300
    });
  };
  _ctor.prototype.hideBanner = function () {
    this.hideAllBanner();
  };
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
      this.interstitial || (this.interstitial = wx.createInterstitialAd({
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
  _ctor.prototype.setClipboardData = function () {};
  _ctor.prototype.restartMiniProgramSync = function () {};
  _ctor.prototype.showVideoAds = function (t) {
    var e = this;
    if (yzll.gameConfig.isTest || yzll.gameConfig.isGM) {
      t.success && t.success();
      return void this.umaTrackEvent("video", {
        userA: t.eventId
      });
    }
    this._adsId = 1;
    this.ttVideoObj = t;
    var o = this.adUintId.Video[this._adsId];
    if (0 !== o.length) {
      if (!this.mVideo) {
        this.mVideo = wx.createRewardedVideoAd({
          adUnitId: o
        }), this.mVideo.onClose(function (o) {
          console.log("onClose::");
          console.log(JSON.stringify(o));
          $10SceneManager.SceneManager.instance.hideLoading();
          setTimeout(function () {
            if (o.isEnded) {
              $10GameUIManager.gameUIMgr.showTips("视频播放完毕!");
              e.umaTrackEvent("video", {
                userA: t.eventId
              });
              e.ttVideoObj.success && e.ttVideoObj.success();
            } else {
              $10GameUIManager.gameUIMgr.showTips("视频未播放完毕!");
              e.ttVideoObj.fail && e.ttVideoObj.fail();
            }
            $10AudioManager.AudioManager.instance.resumeBgm();
          }, 10);
          e._adsId++;
          e._adsId > 3 && (e._adsId = 1);
        }), this.mVideo.onError(function (t) {
          $10SceneManager.SceneManager.instance.hideLoading();
          console.log("onError::");
          console.log(JSON.stringify(t));
          $10CommonUtil.CommonUtil.print(JSON.stringify(t));
          e.ttVideoObj.error && e.ttVideoObj.error();
          e._adsId++;
          e._adsId > 3 && (e._adsId = 1);
        });
      }
      if (this.mVideo) {
        $10SceneManager.SceneManager.instance.showLoading(), this.mVideo.load().then(function () {
          e.mVideo.show().then(function () {
            $10SceneManager.SceneManager.instance.hideLoading();
            $10CommonUtil.CommonUtil.print("视频广告显示成功");
          });
        });
      }
    } else {
      this.ttVideoObj.error && this.ttVideoObj.error();
    }
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
    var t = wx.getUpdateManager();
    t.onUpdateReady(function () {
      wx.showModal({
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
    t && wx.vibrateLong({
      type: "medium",
      success: function () {},
      fail: function () {},
      complete: function () {}
    });
    !t && wx.vibrateShort({
      type: "medium",
      success: function () {},
      fail: function () {},
      complete: function () {}
    });
  };
  _ctor.prototype.uploadEvent = function () {};
  _ctor.prototype.requestSubscribeMessage = function (t, e) {
    wx.requestSubscribeMessage({
      tmplIds: t,
      success: function (t) {
        e && e(true, t);
      },
      fail: function (t) {
        e && e(false, t);
      }
    });
  };
  _ctor.prototype.umaTrackEvent = function (t, e) {
    yzll.gameConfig.bUseUma && t && wx.uma.trackEvent(t, e);
  };
  _ctor.prototype.addShortcut = function () {
    wx.checkShortcut({
      success: function (t) {
        if (t.installed) {
          $10GameUIManager.gameUIMgr.showTips("已添加桌面!");
        } else {
          wx.addShortcut({
            success: function () {
              $10GameUIManager.gameUIMgr.showTips("添加桌面成功!");
            },
            fail: function (t) {
              if (-10005 === t.code) {
                $10GameUIManager.gameUIMgr.showTips("暂不支持该功能!");
              } else {
                $10GameUIManager.gameUIMgr.showTips("添加桌面失败!");
              }
            }
          });
        }
      },
      fail: function (t) {
        if (-10005 === t.code) {
          $10GameUIManager.gameUIMgr.showTips("暂不支持该功能");
        } else {
          $10GameUIManager.gameUIMgr.showTips("检查快捷方式失败");
        }
      }
    });
  };
  return _ctor;
}();
exports.PlatformKS = exp_PlatformKS;