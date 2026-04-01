Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10TimeUtil = require("TimeUtil");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var def_RedDotMgr = function () {
  function _ctor() {
    this.mShopRed = null;
    this.mBattleRed = null;
    this.mPlantRed = null;
    this.mHybridRed = null;
    this.mBaseRed = null;
    this.mWeatherRed = null;
    this.mUnlockPlantDatas = [];
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == this._instance && (this._instance = new _ctor());
      return this._instance;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.initRedState = function () {
    var t = $10DataManager.DataManager.instance.eData.dataplant;
    var e = $10UserDataProxy.userDataProxy.userData.passChapter;
    for (var o in t) {
      var n = t[o];
      1 == n.use && n.stageID < e + 1 && this.mUnlockPlantDatas.push(n);
    }
    this.updateRedDotState([$10HomeEnum.HOME_REDDOT.BASERED, $10HomeEnum.HOME_REDDOT.BATTLERED, $10HomeEnum.HOME_REDDOT.HYBRIDRED, $10HomeEnum.HOME_REDDOT.PLANTRED, $10HomeEnum.HOME_REDDOT.SHOPRED]);
    $10EventManager.EventManager.instance.on($10HomeEnum.EHomeEvent.UPDATE_HOME_REDDOT, this.updateRedDotState, this);
  };
  _ctor.prototype.updateRedDotState = function (t) {
    for (var e = 0; e < t.length; ++e) {
      var o = t[e];
      if (o == $10HomeEnum.HOME_REDDOT.SHOPRED) {
        this.mShopRed.active = this.getShopRedIsShow();
      } else if (o == $10HomeEnum.HOME_REDDOT.BATTLERED) {
        this.mBattleRed.active = this.getBattleRedIsShow();
        if (1 == $10UserDataProxy.userDataProxy.userData.gameModel) {
          this.mWeatherRed.active = this.getWeatherModelRedIsShow();
        } else {
          this.mWeatherRed.active = this.getBattleRedIsShow();
        }
      } else if (o == $10HomeEnum.HOME_REDDOT.PLANTRED) {
        this.mPlantRed.active = this.getPlantRedIsShow();
      } else if (o == $10HomeEnum.HOME_REDDOT.HYBRIDRED) {
        this.mHybridRed.active = this.getHybridRedIsShow();
      } else {
        o == $10HomeEnum.HOME_REDDOT.BASERED && (this.mBaseRed.active = this.getBaseRedIsShow());
      }
    }
  };
  _ctor.prototype.getBattleRedIsShow = function () {
    var t = $10UserDataProxy.userDataProxy.userData.passChapter;
    for (var e = 1; e <= t; ++e) {
      var o = $10DataManager.DataManager.instance.eData.datastagereward[e];
      if (o) {
        for (var i = 1; i < 4; i++) {
          if (this.getBattleBoxRedIsShow(o, i)) {
            return true;
          }
        }
      }
    }
    var n = [];
    var a = $10DataManager.DataManager.instance.eData.datastagereward;
    for (var c in a) {
      "" != a[c].roundReward && n.push(a[c]);
    }
    if ($10UserDataProxy.userDataProxy.userData.roundReward) {
      for (i = 0; i < n.length; ++i) {
        var l = n[i];
        if (!($10UserDataProxy.userDataProxy.userData.passChapter >= l.id)) {
          break;
        }
        if (!$10UserDataProxy.userDataProxy.userData.roundReward[l.round]) {
          return true;
        }
      }
    }
    return false;
  };
  _ctor.prototype.getBattleBoxRedIsShow = function (t, e) {
    $10UserDataProxy.userDataProxy.userData.rewardBox || ($10UserDataProxy.userDataProxy.userData.rewardBox = []);
    var o = 2;
    if ($10UserDataProxy.userDataProxy.userData.passChapter >= t.id) {
      $10UserDataProxy.userDataProxy.userData.rewardBox[t.id] && $10UserDataProxy.userDataProxy.userData.rewardBox[t.id][e] && (o = 3);
    } else if ($10UserDataProxy.userDataProxy.userData.passChapter + 1 == t.id) {
      if (Number(t.boxWave.split("|")[e - 1]) > $10UserDataProxy.userDataProxy.userData.passWave) {
        o = 1;
      } else if ($10UserDataProxy.userDataProxy.userData.rewardBox[$10UserDataProxy.userDataProxy.userData.passChapter + 1] && $10UserDataProxy.userDataProxy.userData.rewardBox[$10UserDataProxy.userDataProxy.userData.passChapter + 1][e]) {
        o = 3;
      } else {
        3 == e && (o = $10UserDataProxy.userDataProxy.userData.passChapter >= t.id ? 2 : 1);
      }
    } else {
      o = 1;
    }
    return 2 == o;
  };
  _ctor.prototype.getShopRedIsShow = function () {
    var t = $10UserDataProxy.userDataProxy.userData.boxData;
    if (!t || 0 == t.cdTime) {
      return true;
    }
    var e = $10UserDataProxy.userDataProxy.userData.dailyData;
    if (!e || 0 == e.freeNum) {
      return true;
    }
    var o = $10UserDataProxy.userDataProxy.userData.goldData;
    return !o || 0 == o.mfNum;
  };
  _ctor.prototype.getPlantRedIsShow = function () {
    for (var t = 0; t < this.mUnlockPlantDatas.length; ++t) {
      var e = this.mUnlockPlantDatas[t];
      var o = $10UserDataProxy.userDataProxy.getPlantData(e.id).lv;
      var i = $10UserDataProxy.userDataProxy.getPropDatas(e.needItem);
      var n = Number(e.needNum.split("|")[o - 1]);
      if (!(n < 0) && i >= n) {
        return true;
      }
    }
    return false;
  };
  _ctor.prototype.getHybridRedIsShow = function () {
    if (!this.getHybridIsUnlock()) {
      return false;
    }
    var t = $10DataManager.DataManager.instance.eData.datapara[79].num.split("_");
    if (Number(t[1]) <= $10UserDataProxy.userDataProxy.userData.manure && $10UserDataProxy.userDataProxy.userData.hybridData.time <= 0) {
      return true;
    }
    var e = $10UserDataProxy.userDataProxy.userData.hybridData.time;
    return !!(e && e - $10TimeUtil.TimeUtil.getDate().getTime() <= 0) || this.getHybridPlantRedIsShow();
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
  _ctor.prototype.getHybridPlantRedIsShow = function () {
    for (var t = 0; t < $10UserDataProxy.userDataProxy.userData.hybridPlantDatas.length; ++t) {
      var e = $10UserDataProxy.userDataProxy.userData.hybridPlantDatas[t];
      var o = e.lv;
      var i = $10DataManager.DataManager.instance.eData.dataplant[e.plantId];
      if ($10UserDataProxy.userDataProxy.getNewProp(i.needItem) >= Number(i.needNum.split("|")[o - 1])) {
        return true;
      }
    }
    return $10UserDataProxy.userDataProxy.userData.hybridPlantDatas.length > 0 && (!$10UserDataProxy.userDataProxy.userData.wearHybridPlantId || 0 == $10UserDataProxy.userDataProxy.userData.wearHybridPlantId);
  };
  _ctor.prototype.getBaseRedIsShow = function () {
    return false;
  };
  _ctor.prototype.getWeatherModelRedIsShow = function () {
    for (var t = 1; t <= $10UserDataProxy.userDataProxy.userData.passWeatherChapter; ++t) {
      if ($10DataManager.DataManager.instance.eData.data_weather[t] && !$10UserDataProxy.userDataProxy.userData.weatherRewardBox[t]) {
        return true;
      }
    }
    return false;
  };
  _ctor.prototype.getBattleLeftBtnRedIsShow = function (t) {
    if (1 == $10UserDataProxy.userDataProxy.userData.gameModel) {
      for (var e = 1; e < t; ++e) {
        if (i = $10DataManager.DataManager.instance.eData.datastagereward[e]) {
          for (var o = 1; o < 4; ++o) {
            if (this.getBattleBoxRedIsShow(i, o)) {
              return true;
            }
          }
        }
      }
    } else {
      for (e = 1; e < t; ++e) {
        var i;
        if ((i = $10DataManager.DataManager.instance.eData.data_weather[e]) && !$10UserDataProxy.userDataProxy.userData.weatherRewardBox[e]) {
          return true;
        }
      }
    }
    return false;
  };
  _ctor.prototype.getBattleRightBtnRedIsShow = function (t) {
    if (1 == $10UserDataProxy.userDataProxy.userData.gameModel) {
      var e = $10UserDataProxy.userDataProxy.userData.passChapter;
      for (var o = t + 1; o <= e; ++o) {
        if (n = $10DataManager.DataManager.instance.eData.datastagereward[o]) {
          for (var i = 1; i < 4; ++i) {
            if (this.getBattleBoxRedIsShow(n, i)) {
              return true;
            }
          }
        }
      }
    } else {
      e = $10UserDataProxy.userDataProxy.userData.passWeatherChapter;
      for (o = t + 1; o <= e; ++o) {
        var n;
        if ((n = $10DataManager.DataManager.instance.eData.data_weather[o]) && !$10UserDataProxy.userDataProxy.userData.weatherRewardBox[o]) {
          return true;
        }
      }
    }
    return false;
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.default = def_RedDotMgr;