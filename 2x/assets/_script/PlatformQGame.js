var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PlatformQGame = function () {
  function _ctor() {
    this.versionStr = "1.0.0";
    this.versionCode = 100;
    this.adUintId = {
      Video: {
        vivo: ["78b82a87fe3a47ff847a934fc668a41f"],
        oppo: ["1193597", "1193612"]
      },
      Banner: {
        vivo: "3b98818308914b3fb1bcbf554e10b16f",
        oppo: "119860"
      },
      Interstitial: {
        vivo: "625e4b9d373641c8a528decba67e1f08",
        oppo: "119862"
      },
      Custom: {
        vivo1: "",
        vivo2: "",
        oppo: "1060870"
      },
      Box: {
        vivo: "3b98818308914b3fb1bcbf554e10b16f",
        oppo: "1193590"
      }
    };
    this.shortVibrateTime = 0;
    this.longVibrateTime = 0;
    this.bannerAd = null;
    this.rewardedAd = null;
    this.interstitialAd = null;
    this.customAd = null;
    this.boxBannerAd = null;
    this.videoIdIndex = 0;
    this.ttVideoObj = null;
    this.preloadAds();
  }
  var e;
  e = _ctor;
  _ctor.prototype.getChannelId = function () {
    return 0;
  };
  _ctor.prototype.login = function (t) {
    switch (cc.sys.platform) {
      case cc.sys.OPPO_GAME:
        if (qg.getSystemInfoSync().platformVersionCode >= 1040) {
          qg.login({
            success: function (e) {
              var o = JSON.stringify(e.data);
              console.log("===oppo登陆成功：" + o);
              t && t(true, {
                code: e.data.token
              });
            },
            fail: function (e) {
              console.log("===oppo登陆失败：" + JSON.stringify(e));
              t && t(false, 0);
            }
          });
        } else {
          t && t(false, 0);
        }
        break;
      case cc.sys.VIVO_GAME:
        if (qg.getSystemInfoSync().platformVersionCode >= 1063) {
          qg.login().then(function (e) {
            var o = JSON.stringify(e.data);
            console.log("===vivo登陆成功：" + o);
            t && t(true, {
              code: e.data.token
            });
          }, function (e) {
            console.log("===vivo登陆失败：" + JSON.stringify(e));
            t && t(false, 0);
          });
        } else {
          t && t(false, 0);
        }
    }
  };
  _ctor.prototype.getUserInfo = function (t) {
    if (cc.sys.platform === cc.sys.OPPO_GAME) {
      t && t();
    } else if (cc.sys.platform === cc.sys.VIVO_GAME) {
      if (qg.getSystemInfoSync().platformVersionCode >= 1063) {
        qg.getUserInfo().then(function (e) {
          console.log("当前用户信息: ", e);
          if (e.data) {
            t && t({
              nickName: e.data.nickName
            });
          } else {
            t && t();
          }
        }, function (e) {
          console.log("获取用户信息失败", e);
          t && t();
        });
      } else {
        t && t();
      }
    }
  };
  _ctor.prototype.getPlatform = function () {
    return "qGame";
  };
  _ctor.prototype.requestSubscribeMessage = function (t, e) {
    e && e(false);
  };
  _ctor.prototype.createGameClubButton = function () {};
  _ctor.prototype.hideGameClubButton = function () {};
  _ctor.prototype.showToast = function (t, e, o) {
    if (cc.sys.platform === cc.sys.OPPO_GAME) {
      qg.showToast({
        title: t,
        icon: "none",
        duration: o ? 2e3 : 1e3
      });
    } else {
      cc.sys.platform === cc.sys.VIVO_GAME && qg.showToast({
        message: t,
        duration: o ? 1 : 0
      });
    }
  };
  _ctor.prototype.showLoading = function (t) {
    if (cc.sys.platform === cc.sys.OPPO_GAME) {
      qg.showLoading({
        title: t
      });
    } else {
      cc.sys.platform === cc.sys.VIVO_GAME && qg.showLoading({
        message: t
      });
    }
  };
  _ctor.prototype.hideLoading = function () {
    qg.hideLoading();
  };
  _ctor.prototype.review = function () {};
  _ctor.prototype.shareAppMessage = function () {};
  _ctor.prototype.startVibrate = function (t) {
    undefined === t && (t = false);
    if (t) {
      if ((this.longVibrateTime && new Date().getTime() - this.longVibrateTime) < 800) {
        return;
      }
      qg.vibrateLong && qg.vibrateLong();
      this.longVibrateTime = new Date().getTime();
    } else {
      if ((this.shortVibrateTime && new Date().getTime() - this.shortVibrateTime) < 60) {
        return;
      }
      qg.vibrateShort && qg.vibrateShort();
      this.shortVibrateTime = new Date().getTime();
    }
  };
  _ctor.prototype.preloadAds = function () {
    this.createVideoAd();
    this.createCustomAd();
    this.createBox();
  };
  _ctor.prototype.createBannerAd = function () {
    var t = this;
    if (qg.getSystemInfoSync().platformVersionCode >= 1031) {
      var o = null;
      if (cc.sys.platform === cc.sys.OPPO_GAME) {
        o = this.adUintId.Banner.oppo;
      } else {
        cc.sys.platform === cc.sys.VIVO_GAME && (o = this.adUintId.Banner.vivo);
      }
      this.bannerAd = qg.createBannerAd({
        posId: o,
        style: {}
      });
      this.bannerAd.onLoad(function () {
        console.log("=========Banner广告加载成功");
        e.isShowBanner && t.showBanner();
      });
      this.bannerAd.onError(function (e) {
        console.log("=======Banner广告加载失败:", e);
        3e4 == e.errCode && (t.bannerAd = qg.createBannerAd({
          posId: o,
          style: {}
        }));
      });
    }
  };
  _ctor.prototype.showBanner = function () {
    e.isShowBanner = true;
    switch (cc.sys.platform) {
      case cc.sys.OPPO_GAME:
      case cc.sys.VIVO_GAME:
        this.showBox();
    }
  };
  _ctor.prototype.hideBanner = function () {
    e.isShowBanner = false;
    switch (cc.sys.platform) {
      case cc.sys.OPPO_GAME:
      case cc.sys.VIVO_GAME:
        this.hideBox();
    }
  };
  _ctor.prototype.createInterstitialAd = function () {
    if (qg.getSystemInfoSync().platformVersionCode >= 1031) {
      var t = null;
      if (cc.sys.platform === cc.sys.OPPO_GAME) {
        t = this.adUintId.Interstitial.oppo;
      } else {
        cc.sys.platform === cc.sys.VIVO_GAME && (t = this.adUintId.Interstitial.vivo);
      }
      this.interstitialAd = qg.createInterstitialAd({
        posId: t
      });
    }
  };
  _ctor.prototype.showInterstitial = function () {
    this.interstitialAd && this.interstitialAd.show().then(function () {
      console.log("插屏广告展示完成");
    }).catch(function (t) {
      console.log("插屏广告展示失败", JSON.stringify(t));
    });
  };
  _ctor.prototype.createCustomAd = function () {
    var t = this;
    if (cc.sys.platform === cc.sys.OPPO_GAME) {
      if (qg.getSystemInfoSync().platformVersionCode < 1103) {
        return;
      }
      console.log("====screenWidth:", qg.getSystemInfoSync().screenWidth);
      var e = this.adUintId.Custom.oppo;
      this.customAd = qg.createCustomAd({
        adUnitId: e,
        style: {}
      });
      this.customAd.onLoad(function () {
        console.log("customAd广告加载成功");
      });
      this.customAd.onError(function (t) {
        console.log("customAd错误监听：", JSON.stringify(t));
      });
      this.customAd.onHide(function () {
        console.log("customAd广告隐藏");
        t.customAd.destroy();
        t.customAd = null;
        t.createCustomAd();
      });
    } else {
      cc.sys.platform;
      cc.sys.VIVO_GAME;
    }
  };
  _ctor.prototype.showCustomAd = function () {
    if (this.customAd) {
      this.customAd.show().then(function () {
        console.log("customAd show success");
      }).catch(function (t) {
        console.log("customAd show fail with:" + t.errCode + "," + t.errMsg);
      });
    } else {
      this.createCustomAd();
    }
  };
  _ctor.prototype.hideCustomAd = function () {
    this.customAd && this.customAd.hide();
  };
  _ctor.showPointCustomAd = function (t) {
    if (qg.createCustomAd) {
      var o = null;
      var i = null;
      var n = false;
      switch (cc.sys.platform) {
        case cc.sys.OPPO_GAME:
          switch (t) {
            case 1:
              o = "1193583";
              break;
            case 2:
              o = "1193592";
              break;
            case 2:
              o = "1193593";
          }
          (i = qg.createCustomAd({
            adUnitId: o,
            style: {
              top: qg.getSystemInfoSync().screenHeight / 4
            }
          })).onLoad(function () {
            console.log("customAd广告加载成功");
          });
          i.onError(function (t) {
            console.log("customAd错误监听：", JSON.stringify(t));
          });
          i.onHide(function () {
            console.log("customAd广告隐藏");
            n && mm.platform.showBanner();
          });
          i.show().then(function () {
            console.log("customAd show success");
            n && mm.platform.hideBanner();
          }).catch(function (t) {
            console.log("customAd show fail with:" + t.errCode + "," + t.errMsg);
          });
          break;
        case cc.sys.VIVO_GAME:
          switch (t) {
            case 1:
              o = "baf0fb8b1dd84fd0b376ba4b33667b6b";
              break;
            case 2:
              o = "bc39b1a50abc45f5ab2e6cfb7d896076";
              break;
            case 3:
              o = "af938dbb2ff94103b3f98fce8eaab8b3";
          }
          (i = qg.createCustomAd({
            posId: o,
            style: {
              top: qg.getSystemInfoSync().screenHeight / 4
            }
          })).onLoad(function () {
            console.log("原生模板广告加载成功");
          });
          i.onClose(function () {
            console.log("原生模板广告关闭");
            n && mm.platform.showBanner();
          });
          i.onError(function (t) {
            console.log("原生模板广告加载失败", t);
          });
          i.show().then(function () {
            console.log("原生模板广告展示完成");
            n = e.isShowBanner;
            if (n) {
              mm.platform.hideBanner();
            }
          }).catch(function (t) {
            console.log("原生模板广告展示失败", t);
          });
      }
    }
  };
  _ctor.prototype.createBox = function () {
    switch (cc.sys.platform) {
      case cc.sys.OPPO_GAME:
        if (qg.createGameBannerAd) {
          var t = this.adUintId.Box.oppo;
          this.boxBannerAd = qg.createGameBannerAd({
            adUnitId: t,
            style: {
              top: qg.getSystemInfoSync().screenHeight - 300,
              left: 0,
              orientation: "horizontal"
            }
          });
          this.boxBannerAd.onLoad(function () {
            console.log("盒子横幅广告加载成功");
          });
          this.boxBannerAd.onError(function (t) {
            console.log("盒子横幅广告加载失败", t);
          });
        } else {
          console.log("暂不支持互推盒子相关 API");
        }
        break;
      case cc.sys.VIVO_GAME:
        if (qg.createBoxBannerAd) {
          t = this.adUintId.Box.vivo;
          this.boxBannerAd = qg.createBoxBannerAd({
            posId: t
          });
          this.boxBannerAd.onLoad(function () {
            console.log("盒子横幅广告加载成功");
          });
          this.boxBannerAd.onError(function (t) {
            console.log("盒子横幅广告加载失败", t);
          });
        } else {
          console.log("暂不支持互推盒子相关 API");
        }
    }
  };
  _ctor.prototype.showBox = function () {
    var t = this;
    switch (cc.sys.platform) {
      case cc.sys.OPPO_GAME:
        if (qg.createGameBannerAd) {
          if (this.boxBannerAd) {
            this.boxBannerAd.show().then(function () {
              console.log("show success:", t.boxBannerAd);
            }).catch(function (t) {
              console.log("show fail with:" + t.errCode + "," + t.errMsg);
            });
          } else {
            this.createBox();
          }
        }
        break;
      case cc.sys.VIVO_GAME:
        if (qg.createBoxBannerAd) {
          if (this.boxBannerAd) {
            this.boxBannerAd.show().then(function () {
              console.log("show success");
            }).catch(function (t) {
              console.log("show fail with:" + t.errCode + "," + t.errMsg);
            });
          } else {
            this.createBox();
          }
        }
    }
  };
  _ctor.prototype.hideBox = function () {
    switch (cc.sys.platform) {
      case cc.sys.OPPO_GAME:
        qg.createGameBannerAd && this.boxBannerAd && this.boxBannerAd.hide().then(function () {
          console.log("hide success");
        }).catch(function (t) {
          console.log("hide fail with:" + t.errCode + "," + t.errMsg);
        });
        break;
      case cc.sys.VIVO_GAME:
        qg.createBoxBannerAd && this.boxBannerAd && this.boxBannerAd.hide().then(function () {
          console.log("hide success");
        }).catch(function (t) {
          console.log("hide fail with:" + t.errCode + "," + t.errMsg);
        });
    }
  };
  _ctor.prototype.createVideoAd = function () {
    if (qg.getSystemInfoSync().platformVersionCode >= 1041) {
      var t = null;
      var e = null;
      if (cc.sys.platform === cc.sys.OPPO_GAME) {
        e = (t = this.adUintId.Video.oppo)[this.videoIdIndex];
        console.log("=====视频广告ID:", t, e);
        this.rewardedAd = qg.createRewardedVideoAd({
          adUnitId: e
        });
        var o = this.rewardedAd.load();
        o && o.then(function () {
          console.log("=====视频广告加载成功");
        }).catch(function (t) {
          console.log("=====视频广告加载失败：", t);
        });
      } else if (cc.sys.platform === cc.sys.VIVO_GAME) {
        e = (t = this.adUintId.Video.vivo)[this.videoIdIndex];
        this.rewardedAd = qg.createRewardedVideoAd({
          posId: e
        });
      }
      this.videoIdIndex++;
      this.videoIdIndex >= t.length && (this.videoIdIndex = 0);
    }
  };
  _ctor.prototype.setClipboardData = function () {};
  _ctor.prototype.restartMiniProgramSync = function () {};
  _ctor.prototype.showVideoAds = function (t) {
    t.success && t.success();
  };
  _ctor.prototype.uploadEvent = function () {};
  _ctor.prototype.umaTrackEvent = function () {};
  _ctor.prototype.addShortcut = function () {};
  _ctor.prototype.authorize = function () {};
  _ctor.customAd1 = null;
  _ctor.customAd2 = null;
  _ctor.isShowBanner = false;
  return e = cc__decorate([ccp_ccclass], _ctor);
}();
exports.default = def_PlatformQGame;