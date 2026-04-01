Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataManager = undefined;
var $10HttpRequest = require("HttpRequest");
var $10CommonUtil = require("CommonUtil");
var $10ResUtil = require("ResUtil");
var $10SqlUtil = require("SqlUtil");
var $10StroageMgr = require("StroageMgr");
var $10TimeUtil = require("TimeUtil");
var $10PopupManager = require("PopupManager");
var $10SceneManager = require("SceneManager");
var $10EData = require("EData");
var $10GameSave = require("GameSave");
var $10Gutil = require("Gutil");
var $10HomeEnum = require("HomeEnum");
var $10ProxyManager = require("ProxyManager");
var $10RelicsDataProxy = require("RelicsDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10UserSetDataProxy = require("UserSetDataProxy");
var exp_DataManager = function () {
  function _ctor() {
    this._intervalId = null;
    this.mNikeName = "";
    this.mHead = "";
    this.userVersion = "a";
    this.bTestLv = false;
    this.isFirstInGame = false;
    this.bFirstInHome = true;
    this.allSwitch = false;
    this.isNewDay = false;
    this.canSaveData = false;
    this.mTTchannelId = null;
    this.mIsNewPlayer = true;
    this.mCreateTime = 0;
    this.mIsInitData = true;
    this.miniGames = [];
    this._isInit = false;
    this._edata = new $10EData.default();
    this._saveData = new $10GameSave.GameSave();
    this.FileName = "ch_bdkp_gameSave_1";
    this._sendData = {};
    this._isCanSend = true;
  }
  _ctor.prototype.isSubGameOpen = function (t) {
    return !(this.miniGames.length <= 0) && (this.miniGames.indexOf(t) >= 0 || undefined);
  };
  Object.defineProperty(_ctor.prototype, "eData", {
    get: function () {
      return this._edata;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == this._instance && (this._instance = new _ctor());
      return this._instance;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.log = function (t, e) {
    $10CommonUtil.CommonUtil.print("DataManager --> " + t + ":", e);
  };
  _ctor.prototype.error = function (t, e) {
    $10CommonUtil.CommonUtil.print("DataManager --> error!!! " + t + ":", e);
  };
  _ctor.prototype.init = function () {
    this._intervalId && this.clear();
    this._intervalId = setInterval(this.updateSecond.bind(this), 1e3);
  };
  _ctor.prototype.updateSecond = function () {
    $10UserSetDataProxy.userSetDataProxy.updateSecond();
  };
  _ctor.prototype.initConfig = function (t) {
    var e = this;
    if (this._isInit) {
      t && t();
    } else {
      this._isInit = true;
      $10ResUtil.ResUtil.loadBundle({
        bundleName: $10HomeEnum.Bundles.RES_JSON
      }).then(function (o) {
        o.load("json" + e.userVersion + "/EData", cc.TextAsset, function (o, i) {
          if (!o) {
            e._edata = JSON.parse(decodeURIComponent($10Gutil.Gutil.base64decode(i.text)));
            $10CommonUtil.CommonUtil.print("本地配置:", e._edata);
            t && t();
          }
        });
      }).catch(function (t) {
        $10CommonUtil.CommonUtil.print("加载配置错误", t);
      });
    }
  };
  _ctor.prototype.switchConfig = function () {
    var t = this;
    $10ResUtil.ResUtil.loadBundle({
      bundleName: $10HomeEnum.Bundles.RES_JSON
    }).then(function (e) {
      e.load("json" + t.userVersion + "/EData", cc.TextAsset, function (e, o) {
        if (!e) {
          t._edata = JSON.parse(decodeURIComponent($10Gutil.Gutil.base64decode(o.text)));
          $10CommonUtil.CommonUtil.print("本地配置:", t._edata);
        }
      });
    }).catch(function (t) {
      $10CommonUtil.CommonUtil.print("加载配置错误", t);
    });
  };
  _ctor.prototype.clear = function () {
    clearInterval(this._intervalId);
    this._intervalId = null;
  };
  _ctor.prototype.writeGameDataBase = function (t, e, o) {
    if (this.canSaveData) {
      this._saveData.customData[t] = e;
      this.saveGame();
      this.sendGameDataBase(t, e, false, o);
    }
  };
  _ctor.prototype.cleanGameDataBase = function () {
    $10SceneManager.SceneManager.instance.showLoading();
    var t = function () {
      if (cc.sys.platform == cc.sys.BYTEDANCE_GAME || cc.sys.platform == cc.sys.WECHAT_GAME) {
        mm.platform.restartMiniProgramSync();
      } else {
        $10SceneManager.SceneManager.instance.hideLoading();
        $10PopupManager.PopupManager.instance.removeAll($10PopupManager.PopupCacheMode.CACHE);
        cc.director.loadScene("Load");
      }
    };
    $10HttpRequest.HttpRequest.inst.request("POST", "/player/props/clear", {}).then(function (e) {
      $10CommonUtil.CommonUtil.print("player/props/clear 返回结果", e);
      if (200 == e.code) {
        $10RelicsDataProxy.relicsDataProxy.resetData();
        $10UserDataProxy.userDataProxy.resetData(t);
      }
    });
  };
  _ctor.prototype.readGameDataBase = function (t) {
    $10CommonUtil.CommonUtil.print("服务器数据::", t);
    this.canSaveData = true;
    var e = {};
    for (var o in t) {
      e[o] = JSON.parse(t[o]);
    }
    $10CommonUtil.CommonUtil.print("转成json::", e);
    var i = null;
    if (e && Object.keys(e).length > 0) {
      var a = cc.sys.localStorage.getItem(this.FileName, "");
      if (a && "" != a) {
        this._saveData = JSON.parse(a);
        this._saveData.customData.UserData && e.UserData && (i = this._saveData.customData.UserData.passChapter > e.UserData.passChapter ? this._saveData.customData : this._saveData.customData.UserData.passChapter >= e.UserData.passChapter ? this._saveData.customData : e);
      }
    }
    if (i) {
      Object.keys(i).forEach(function (t) {
        $10ProxyManager.ProxyManager.instance.readGameDataBase(t, i[t]);
      });
    } else if (e && Object.keys(e).length > 0) {
      Object.keys(e).forEach(function (t) {
        $10ProxyManager.ProxyManager.instance.readGameDataBase(t, e[t]);
      });
    } else {
      this.saveLocality();
    }
    var s = $10TimeUtil.TimeUtil.getTime();
    var l = Number($10SqlUtil.SqlUtil.getLocalUserData($10HomeEnum.SqlKey.TODAY_TIME, 0));
    if (!$10TimeUtil.TimeUtil.isSameDay(s, l)) {
      this.isNewDay = true;
      $10SqlUtil.SqlUtil.setLocalUserData($10HomeEnum.SqlKey.TODAY_TIME, s);
      $10RelicsDataProxy.relicsDataProxy.newDataReset();
      $10UserDataProxy.userDataProxy.newDataReset();
      this.setIsCanRefreshGoodSkill(true);
    }
  };
  _ctor.prototype.saveLocality = function () {
    var t = this;
    var e = cc.sys.localStorage.getItem(this.FileName, "");
    if (e && "" != e) {
      this._saveData = JSON.parse(e);
      $10CommonUtil.CommonUtil.print("本地数据", this._saveData.customData);
      Object.keys(this._saveData.customData).forEach(function (e) {
        $10ProxyManager.ProxyManager.instance.readGameDataBase(e, t._saveData.customData[e]);
      });
      $10CommonUtil.CommonUtil.print("保存本地数据::");
      $10UserDataProxy.userDataProxy.saveData();
    }
  };
  _ctor.prototype.saveGame = function () {
    var t = JSON.stringify(this._saveData);
    cc.sys.localStorage.setItem(this.FileName, t);
  };
  _ctor.prototype.getTTchannelId = function () {
    return $10SqlUtil.SqlUtil.getLocalUserData("TTchannelId", "0");
  };
  _ctor.prototype.setTTchannelId = function (t) {
    $10SqlUtil.SqlUtil.setLocalUserData("TTchannelId", t);
  };
  _ctor.prototype.getIsCanRefreshGoodSkill = function () {
    var t = $10SqlUtil.SqlUtil.getLocalUserData("CanRefreshGoodSkill", "true");
    return "true" == t || !t;
  };
  _ctor.prototype.setIsCanRefreshGoodSkill = function (t) {
    $10SqlUtil.SqlUtil.setLocalUserData("CanRefreshGoodSkill", String(t));
  };
  _ctor.prototype.platformLogin = function () {
    var t = this;
    if (cc.sys.platform == cc.sys.WECHAT_GAME || cc.sys.platform == cc.sys.BYTEDANCE_GAME) {
      mm.platform.login(function (e, o) {
        if (e) {
          t.loginGameServer(o.code);
          $10StroageMgr.StroageMgr.Inst.setValue({
            k: $10HomeEnum.StroageKey.GameCode,
            v: "default"
          }, o.code);
        } else {
          $10CommonUtil.CommonUtil.print("登录失败");
        }
      });
    } else {
      var e = $10StroageMgr.StroageMgr.Inst.getString({
        k: $10HomeEnum.StroageKey.GameCode,
        v: "default"
      });
      if ("default" == e) {
        e = Date.now().toString() + Math.floor(1e3 * Math.random());
        $10StroageMgr.StroageMgr.Inst.setValue({
          k: $10HomeEnum.StroageKey.GameCode,
          v: "default"
        }, e);
      }
      this.loginGameServer(e);
    }
  };
  _ctor.prototype.loginGameServer = function (e) {
    var o = 0;
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      o = 401;
    } else {
      cc.sys.platform == cc.sys.BYTEDANCE_GAME && (o = 501);
    }
    var a = {
      channel: o,
      openId: e,
      projectName: (yzll.gameConfig.debug, "")
    };
    var r = JSON.stringify({
      params: $10HttpRequest.HttpRequest.inst.encryptStr(JSON.stringify(a))
    });
    $10CommonUtil.CommonUtil.print("请求登陆：", a);
    $10CommonUtil.CommonUtil.print("请求登陆：", r);
    $10HttpRequest.HttpRequest.inst.request("POST", "/account/sdklogin", r).then(function (e) {
      $10CommonUtil.CommonUtil.print("登陆成功：", e);
      _ctor.token = e.data.token;
      _ctor.playerId = e.data.playerId;
    }).catch(function (t) {
      console.error("登陆失败：", t);
    });
  };
  _ctor.prototype.sendGameDataBase = function (e, o, a, r) {
    var s = this;
    if (_ctor.token) {
      e && (this._sendData[e] = o);
      if (this._isCanSend || a) {
        this._isCanSend = false;
        setTimeout(function () {
          s._isCanSend = true;
          Object.keys(s._sendData).length > 0 && s.sendGameDataBase();
        }, 1e3);
        $10CommonUtil.CommonUtil.print("sendGameDataBase", this._sendData);
        var c = JSON.stringify({
          params: $10HttpRequest.HttpRequest.inst.encryptStr(JSON.stringify(this._sendData))
        });
        this._sendData = {};
        $10HttpRequest.HttpRequest.inst.request("POST", "/player/updateProps", c).then(function () {
          r && r();
        }).catch(function () {});
      }
    } else {
      this.platformLogin();
    }
  };
  _ctor.prototype.initGameDataBase = function (e) {
    if (e) {
      _ctor.token = e.token;
      var o = e.props;
      this.readGameDataBase(o);
    } else {
      this.readGameDataBase();
    }
  };
  _ctor.prototype.getIsZbRank = function () {
    return !!$10UserDataProxy.userDataProxy.userData.startGameRights || !(!yzll.gameConfig.isZB && !yzll.gameConfig.isGM || cc.sys.platform == cc.sys.BYTEDANCE_GAME || cc.sys.platform == cc.sys.WECHAT_GAME);
  };
  _ctor.prototype.isOpenShake = function () {
    return $10UserSetDataProxy.userSetDataProxy.setData.isOpenShake;
  };
  _ctor._instance = null;
  _ctor.token = "";
  _ctor.playerId = "";
  _ctor.playerName = "";
  _ctor.isSidebarCardInGameForTT = false;
  return _ctor;
}();
exports.DataManager = exp_DataManager;