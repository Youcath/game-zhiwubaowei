var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10PopupBase = require("PopupBase");
var $10SceneManager = require("SceneManager");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10GameUIManager = require("GameUIManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_TestPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.propIdEditBox = null;
    e.propNumEditBox = null;
    e.levelEditBox = null;
    e.weatherlEditBox = null;
    e.mChapterEditBox = null;
    e.mWaveEditBox = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {};
  _ctor.prototype.onAddProp = function () {
    var t = Number(this.propIdEditBox.string);
    var e = Number(this.propNumEditBox.string);
    if (t && e) {
      $10UserDataProxy.userDataProxy.addProp(t, e);
      $10GameUIManager.gameUIMgr.showTips("添加成功！");
    } else {
      $10GameUIManager.gameUIMgr.showTips("参数错误！");
    }
  };
  _ctor.prototype.onSaveLevel = function () {
    if (cc.sys.isBrowser && yzll.gameConfig.isZB && !$10UserDataProxy.userDataProxy.userData.startGameRights) {
      $10GameUIManager.gameUIMgr.showTips("请先使用兑换码激活游戏~");
    } else {
      var t = Number(this.levelEditBox.string);
      var e = $10DataManager.DataManager.instance.eData.datastagereward;
      var o = 0;
      for (var i in e) {
        o = e[i].id;
      }
      if (t > 0 && t < o) {
        $10UserDataProxy.userDataProxy.userData.passChapter = t;
        $10UserDataProxy.userDataProxy.userData.curChapter = t + 1;
        $10UserDataProxy.userDataProxy.saveData();
        $10SceneManager.SceneManager.instance.runScene("Home", "", function () {});
      } else {
        $10GameUIManager.gameUIMgr.showTips("参数错误！");
      }
    }
  };
  _ctor.prototype.onRemoveUser = function () {
    $10UserDataProxy.userDataProxy.mIsChangeVersion = true;
    $10DataManager.DataManager.instance.cleanGameDataBase();
    this.removeUI();
  };
  _ctor.prototype.onChapterClick = function () {
    if ("" != this.mChapterEditBox.string) {
      if ("" != this.mWaveEditBox.string) {
        var t = Number(this.mChapterEditBox.string);
        if (1 == $10UserDataProxy.userDataProxy.userData.gameModel) {
          if (t > $10UserDataProxy.userDataProxy.userData.passChapter + 1) {
            return void $10GameUIManager.gameUIMgr.showTips("关卡还未解锁");
          }
          var e = $10DataManager.DataManager.instance.eData.datastagereward;
          var o = 0;
          for (var i in e) {
            o = e[i].id;
          }
          if (t > o || t <= 0) {
            return void $10GameUIManager.gameUIMgr.showTips("策划最大关卡只配置了" + o);
          }
        } else {
          if (t > $10UserDataProxy.userDataProxy.userData.passWeatherChapter + 1) {
            return void $10GameUIManager.gameUIMgr.showTips("关卡还未解锁");
          }
          if (t > 6 || t <= 0) {
            return void $10GameUIManager.gameUIMgr.showTips("策划最大关卡只配置了6");
          }
        }
        if (cc.sys.isBrowser && yzll.gameConfig.isZB && !$10UserDataProxy.userDataProxy.userData.startGameRights) {
          $10GameUIManager.gameUIMgr.showTips("请先使用兑换码激活游戏~");
        } else {
          var n = 20;
          if (1 == $10UserDataProxy.userDataProxy.userData.gameModel) {
            var a = $10DataManager.DataManager.instance.eData.datastagereward[t];
            n = Number(a.wave);
          }
          var r = Number(this.mWaveEditBox.string);
          if (r > n || r <= 0) {
            $10GameUIManager.gameUIMgr.showTips("输入的关卡最大波数只有" + n);
          } else {
            if (2 == $10UserDataProxy.userDataProxy.userData.gameModel) {
              $10UserDataProxy.userDataProxy.userData.cursWeatherChapter = t;
              $10UserDataProxy.userDataProxy.userData.curWeatherWave = r;
              var s = $10DataManager.DataManager.instance.eData.data_weather[t];
              $10BattleDataProxy.battleDataProxy.weatherType = s.weather;
            } else {
              $10UserDataProxy.userDataProxy.userData.curChapter = t;
              $10UserDataProxy.userDataProxy.userData.curWave = r;
            }
            $10SceneManager.SceneManager.instance.runScene("Game", "", function () {});
            this.removeUI();
          }
        }
      } else {
        $10GameUIManager.gameUIMgr.showTips("请输入关卡波数");
      }
    } else {
      $10GameUIManager.gameUIMgr.showTips("请输入关卡id");
    }
  };
  _ctor.prototype.onVersionA = function () {
    $10DataManager.DataManager.instance.userVersion = "a";
    $10DataManager.DataManager.instance.switchConfig();
    $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.CHANGE_CONFIG_NOTIFY);
  };
  _ctor.prototype.onVersionB = function () {
    $10DataManager.DataManager.instance.userVersion = "b";
    $10DataManager.DataManager.instance.switchConfig();
    $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.CHANGE_CONFIG_NOTIFY);
  };
  _ctor.prototype.onVersionD = function () {
    $10DataManager.DataManager.instance.userVersion = "d";
    $10DataManager.DataManager.instance.switchConfig();
    $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.CHANGE_CONFIG_NOTIFY);
  };
  _ctor.prototype.onBtnNextDay = function () {
    $10UserDataProxy.userDataProxy.newDataReset();
    this.removeUI();
  };
  _ctor.prototype.onBtnChapterWeather = function () {
    if (cc.sys.isBrowser && yzll.gameConfig.isZB && !$10UserDataProxy.userDataProxy.userData.startGameRights) {
      $10GameUIManager.gameUIMgr.showTips("请先使用兑换码激活游戏~");
    } else {
      var t = this.weatherlEditBox.string;
      if ("" != t) {
        var e = Number(t);
        var o = $10DataManager.DataManager.instance.eData.data_weather;
        var i = 0;
        for (var n in o) {
          i = o[n].id;
        }
        if (e > 0 && e < i) {
          $10UserDataProxy.userDataProxy.userData.passWeatherChapter = e;
          $10UserDataProxy.userDataProxy.userData.cursWeatherChapter = e + 1;
          $10UserDataProxy.userDataProxy.saveData();
          $10SceneManager.SceneManager.instance.runScene("Home", "", function () {});
        } else {
          $10GameUIManager.gameUIMgr.showTips("参数错误！");
        }
      } else {
        $10GameUIManager.gameUIMgr.showTips("请输入要通过的章节");
      }
    }
  };
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "propIdEditBox", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "propNumEditBox", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "levelEditBox", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "weatherlEditBox", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "mChapterEditBox", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "mWaveEditBox", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_TestPopup;