var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__awaiter = __awaiter;
var cc__generator = __generator;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadUIBase = undefined;
var $10ComponentBase = require("ComponentBase");
var $10EventManager = require("EventManager");
var $10AppProxy = require("AppProxy");
var $10ResUtil = require("ResUtil");
var $10AppBase = require("AppBase");
var $10StringUtil = require("StringUtil");
var $10SceneManager = require("SceneManager");
var $10HomeEnum = require("HomeEnum");
var $10StroageMgr = require("StroageMgr");
var $10HttpRequest = require("HttpRequest");
var $10CommonUtil = require("CommonUtil");
var $10DataManager = require("DataManager");
var $10RobotJSON = require("RobotJSON");
var $10UserDataProxy = require("UserDataProxy");
var $10SensitiveUtils = require("SensitiveUtils");
var $10TimeUtil = require("TimeUtil");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var exp_LoadUIBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.progressBar = null;
    e.progressLabel = null;
    e.progressBlock = null;
    e.nextSceneBundle = "";
    e.nextSceneName = "";
    e._isNet = false;
    e._maxProgress = 0;
    e._retryNum = 0;
    e._progress = 0;
    e._progressTag = false;
    e._msg = "";
    e._msgTag = false;
    e.bundles = [];
    e.dirs = [];
    e.configs = null;
    e._bundleLoading = false;
    e._jumpNext = false;
    e._resData = null;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "progress", {
    get: function () {
      return this._progress;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
  };
  _ctor.prototype.onDestroy = function () {
    t.prototype.onDestroy.call(this);
  };
  _ctor.prototype.start = function () {
    t.prototype.start.call(this);
    this.loadGame();
  };
  _ctor.prototype.loadGame = function () {
    this.preloadRes();
    this.loginServers();
  };
  _ctor.prototype.loginServers = function () {
    return cc__awaiter(this, undefined, undefined, function () {
      return cc__generator(this, function (t) {
        switch (t.label) {
          case 0:
            $10StringUtil.StringUtil.isEmpty(this.nextSceneBundle) && !$10StringUtil.StringUtil.isEmpty(this.nextSceneName) && cc.director.preloadScene(this.nextSceneName);
            if (cc.sys.platform == cc.sys.BYTEDANCE_GAME || yzll.gameConfig.isZB) {
              yzll.gameConfig.isGM = false;
              yzll.gameConfig.isTest = false;
            }
            this.setProgress("请求服务器...", 0, true);
            this._maxProgress = .4;
            this._isNet = true;
            return [4, this.loginDeal()];
          case 1:
            t.sent();
            return [4, this.platformLogin()];
          case 2:
            t.sent();
            return [4, this.gameConfig()];
          case 3:
            t.sent();
            return [4, this.getUserData()];
          case 4:
            t.sent();
            this.loginComplete();
            return [2];
        }
      });
    });
  };
  _ctor.prototype.platformLogin = function () {
    var t = this;
    return new Promise(function (e) {
      if (cc.sys.platform == cc.sys.WECHAT_GAME || cc.sys.platform == cc.sys.BYTEDANCE_GAME) {
        mm.platform.login(function (o, i) {
          if (o) {
            $10CommonUtil.CommonUtil.print("issuc::", i);
            t.loginGameServer(i.code, e);
            $10StroageMgr.StroageMgr.Inst.setValue({
              k: $10HomeEnum.StroageKey.GameCode,
              v: "default"
            }, i.code);
          } else {
            $10CommonUtil.CommonUtil.print("登录失败");
            e();
          }
        });
      } else {
        var o = $10StroageMgr.StroageMgr.Inst.getString({
          k: $10HomeEnum.StroageKey.GameCode,
          v: "default"
        });
        if ("default" == o) {
          o = Date.now().toString() + Math.floor(1e3 * Math.random());
          $10StroageMgr.StroageMgr.Inst.setValue({
            k: $10HomeEnum.StroageKey.GameCode,
            v: "default"
          }, o);
        }
        t.loginGameServer(o, e);
      }
    });
  };
  _ctor.prototype.loginGameServer = function (t, e) {
    var o = this;
    var i = 0;
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      i = 401;
    } else {
      cc.sys.platform == cc.sys.BYTEDANCE_GAME && (i = 501);
    }
    var n = {
      channel: i,
      openId: t,
      projectName: (yzll.gameConfig.debug, "")
    };
    var a = JSON.stringify({
      params: $10HttpRequest.HttpRequest.inst.encryptStr(JSON.stringify(n))
    });
    $10CommonUtil.CommonUtil.print("请求登陆：", n);
    $10CommonUtil.CommonUtil.print("请求登陆：", a);
    $10HttpRequest.HttpRequest.inst.request("POST", "/account/sdklogin", a).then(function (t) {
      $10CommonUtil.CommonUtil.print("登陆成功：", t);
      o._resData = t.data;
      $10DataManager.DataManager.playerId = t.data.playerId;
      var i = t.data.createTime;
      var n = t.data.ab;
      if (!$10UserDataProxy.userDataProxy.mIsChangeVersion) {
        $10DataManager.DataManager.instance.userVersion = (null == n ? undefined : n.key) || "a";
        (window.yzll.gameConfig.debug || window.yzll.gameConfig.isZB) && ($10DataManager.DataManager.instance.userVersion = "a");
      }
      o.setIsNewPlayer(i);
      var a = o._resData.nickName;
      var r = o._resData.head;
      a && ($10DataManager.DataManager.instance.mNikeName = a);
      r && ($10DataManager.DataManager.instance.mHead = r);
      if ($10DataManager.DataManager.instance.getIsZbRank()) {
        var s = t.data.endlessZBRank;
        s && ($10UserDataProxy.userDataProxy.mYesterdayRank = s);
      } else {
        var c = t.data.endlessRank;
        c && ($10UserDataProxy.userDataProxy.mYesterdayRank = c);
      }
      $10CommonUtil.CommonUtil.print("yesterdayRank", $10UserDataProxy.userDataProxy.mYesterdayRank);
      $10CommonUtil.CommonUtil.print("用户版本：", $10DataManager.DataManager.instance.userVersion);
      e();
    }).catch(function (t) {
      e();
      console.error("登陆失败：", t);
    });
  };
  _ctor.prototype.setIsNewPlayer = function (t) {
    $10DataManager.DataManager.instance.mCreateTime = t;
    var e = new Date();
    var o = $10TimeUtil.TimeUtil.getCalendarDaysBetweenTimestamps(t, e.getTime());
    $10DataManager.DataManager.instance.mIsNewPlayer = 0 == o;
    console.log("isNewPlayer:", $10DataManager.DataManager.instance.mIsNewPlayer);
  };
  _ctor.prototype.update = function (t) {
    var e;
    var o;
    var i;
    var n;
    var a;
    if (this._isNet && this._progress < this._maxProgress) {
      this._progress = Number((this._progress + t).toFixed(2));
      this._progressTag = true;
    }
    (null === (o = null === (e = this.progressBar) || undefined === e ? undefined : e.node) || undefined === o ? undefined : o.active) && this._progressTag && (this.progressBar.fillRange = this._progress);
    (null === (n = null === (i = this.progressLabel) || undefined === i ? undefined : i.node) || undefined === n ? undefined : n.active) && this._msgTag && (this.progressLabel.string = this._msg);
    (null === (a = this.progressBlock) || undefined === a ? undefined : a.active) && this._progressTag && (this.progressBlock.x = this.progressBar.fillRange * this.progressBar.node.width - this.progressBar.node.width / 2);
  };
  _ctor.prototype.loginDeal = function () {
    return cc__awaiter(this, undefined, Promise, function () {
      return cc__generator(this, function () {
        return [2, new Promise(function (t) {
          $10ResUtil.ResUtil.loadAsset({
            path: "uis/YZLLLoading",
            type: cc.Prefab,
            bundleName: $10HomeEnum.Bundles.RES
          }).then(function (e) {
            e.addRef();
            var o = cc.instantiate(e);
            o.active = false;
            $10AppBase.topNode.addChild(o);
            o.zIndex = cc.macro.MAX_ZINDEX;
            $10SceneManager.SceneManager.instance.setLoading(o);
            t();
          });
        })];
      });
    });
  };
  _ctor.prototype.gameConfig = function () {
    return cc__awaiter(this, undefined, undefined, function () {
      return cc__generator(this, function (t) {
        switch (t.label) {
          case 0:
            this.setProgress("读取配置中...", this._maxProgress);
            this._maxProgress = .8;
            $10RobotJSON.RobotJSON.instance.loadJson();
            $10SensitiveUtils.default.loadConfigCsv();
            return [4, this.gameConfigRes({})];
          case 1:
            t.sent();
            return [2];
        }
      });
    });
  };
  _ctor.prototype.getUserData = function () {
    return cc__awaiter(this, undefined, undefined, function () {
      return cc__generator(this, function (t) {
        switch (t.label) {
          case 0:
            this.setProgress("用户数据加载中...", this._maxProgress);
            this._maxProgress = .9;
            return [4, this.userDataRes(this._resData)];
          case 1:
            t.sent();
            this.loadRes();
            return [2];
        }
      });
    });
  };
  _ctor.prototype.loadRes = function () {
    this._jumpNext = true;
    this.loadBundle();
  };
  _ctor.prototype.preloadRes = function () {
    this.loadBundle();
  };
  _ctor.prototype.loadBundle = function () {
    return cc__awaiter(this, undefined, undefined, function () {
      var t;
      var e = this;
      return cc__generator(this, function (o) {
        switch (o.label) {
          case 0:
            if (0 !== this.bundles.length) {
              return [3, 3];
            } else {
              if (this._jumpNext) {
                return [4, this.resComplete()];
              } else {
                return [3, 2];
              }
            }
          case 1:
            o.sent();
            this.nextScene();
            o.label = 2;
          case 2:
            return [2];
          case 3:
            if (this._bundleLoading) {
              return [2];
            } else {
              return this._bundleLoading = true, t = this.bundles[0], $10ResUtil.ResUtil.loadBundle({
                bundleName: t
              }).then(function () {
                t === e.nextSceneBundle && cc.director.preloadScene(e.nextSceneName);
                for (var o = e.dirs.length - 1; o >= 0; o--) {
                  if (e.dirs[o].bundleName === t) {
                    $10ResUtil.ResUtil.preloadDir(e.dirs[o]);
                    e.dirs.splice(o, 1);
                  }
                }
                e.bundles.shift();
                e._bundleLoading = false;
                e.loadBundle();
              }).catch(function () {
                e._bundleLoading = false;
                e.loadBundle();
              }), [2];
            }
        }
      });
    });
  };
  _ctor.prototype.nextScene = function () {
    var t;
    var e = this;
    (null === (t = this.progressLabel) || undefined === t ? undefined : t.node) && (this.progressLabel.node.active = false);
    cc.director.getPhysicsManager().enabled = true;
    cc.director.getPhysicsManager().enabledAccumulator = true;
    cc.PhysicsManager.FIXED_TIME_STEP = .02;
    cc.PhysicsManager.VELOCITY_ITERATIONS = 8;
    cc.PhysicsManager.POSITION_ITERATIONS = 8;
    console.log("yzll.gameConfig.isZB:", yzll.gameConfig.isZB);
    if (yzll.gameConfig.isZB) {
      $10UserDataProxy.userDataProxy.userData.gameCourseData.curId = 99;
      $10UserDataProxy.userDataProxy.userData.gameCourseData.completeId = 99;
      $10UserDataProxy.userDataProxy.userData.gameCourseData.isComplete = true;
    }
    $10UserDataProxy.userDataProxy.userData.curChapter = $10UserDataProxy.userDataProxy.userData.passChapter + 1;
    $10UserDataProxy.userDataProxy.userData.curChapter < 1 && ($10UserDataProxy.userDataProxy.userData.curChapter = 1);
    var o = $10UserDataProxy.userDataProxy.userData.gameCourseData.curId;
    if ($10UserDataProxy.userDataProxy.userData.passChapter >= 1 && o < 3) {
      o = 99;
      $10UserDataProxy.userDataProxy.userData.gameCourseData.curId = 99;
      $10UserDataProxy.userDataProxy.userData.gameCourseData.completeId = 99;
      $10UserDataProxy.userDataProxy.userData.gameCourseData.isComplete = true;
    }
    if (o < 3) {
      var i = $10UserDataProxy.userDataProxy.userData.gameCourseData;
      i.curId = 0;
      i.completeId = 0;
      i.isComplete = false;
      $10UserDataProxy.userDataProxy.userData.curWave = 1;
      $10SceneManager.SceneManager.instance.runScene("Game", "", function () {
        $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.ENTER_GAME);
        e.loadComplete();
      });
    } else {
      $10SceneManager.SceneManager.instance.runScene(this.nextSceneName, "", function () {
        $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.ENTER_GAME);
        e.loadComplete();
      });
    }
  };
  _ctor.prototype.setProgress = function (t, e, o) {
    undefined === o && (o = false);
    if (null != this.progressLabel && null != t) {
      this._msg = t;
      this._msgTag = true;
    }
    if (o || e > this._progress) {
      this._progress = e;
      this._progressTag = true;
    }
  };
  _ctor.prototype.resComplete = function () {
    return Promise.resolve(true);
  };
  _ctor.prototype.loadComplete = function () {};
  cc__decorate([ccp_property({
    type: cc.Sprite
  })], _ctor.prototype, "progressBar", undefined);
  cc__decorate([ccp_property({
    type: cc.Label
  })], _ctor.prototype, "progressLabel", undefined);
  cc__decorate([ccp_property({
    type: cc.Node
  })], _ctor.prototype, "progressBlock", undefined);
  cc__decorate([ccp_property({
    tooltip: ""
  })], _ctor.prototype, "nextSceneBundle", undefined);
  cc__decorate([ccp_property({
    tooltip: ""
  })], _ctor.prototype, "nextSceneName", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComponentBase.ComponentBase);
exports.LoadUIBase = exp_LoadUIBase;