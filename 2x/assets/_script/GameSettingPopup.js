var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10HttpRequest = require("HttpRequest");
var $10CommonUtil = require("CommonUtil");
var $10PopupBase = require("PopupBase");
var $10PopupManager = require("PopupManager");
var $10SceneManager = require("SceneManager");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10UserSetDataProxy = require("UserSetDataProxy");
var $10GameUIManager = require("GameUIManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GameSettingPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.nEffectAudio = null;
    e.nMusicAudio = null;
    e.nShake = null;
    e.mVersions = null;
    e.mUID = null;
    e.mCodeBox = null;
    e.musicVolumeSlider = null;
    e.musicVolumePro = null;
    e.effectVolumeSlider = null;
    e.effectVolumePro = null;
    e.mMusicVolumeLab = null;
    e.mEffectVolumeLab = null;
    e.mShakeLab = null;
    e.mGameRoot = null;
    e.mHomeRoot = null;
    e.mTestBtn = null;
    e.mTitleClickNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
    $10EventManager.EventManager.instance.on($10HomeEnum.EHomeEvent.CHANGE_CONFIG_NOTIFY, this.onConfigChange, this);
    this.mTestBtn.active = yzll.gameConfig.mainTestBtn || yzll.gameConfig.isZB;
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      var e = this.mHomeRoot.getChildByName("BtncdKey");
      this.mHomeRoot.getChildByName("editBox").active = false;
      e.active = false;
      this.mUID.node.active = false;
    } else {
      this.mUID.string = "UUID:" + $10DataManager.DataManager.playerId + " 点击复制";
    }
    this.mVersions.string = "v" + mm.platform.versionStr + (yzll.gameConfig.debug ? $10DataManager.DataManager.instance.userVersion : "");
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10HomeEnum.EHomeEvent.CHANGE_CONFIG_NOTIFY, this.onConfigChange, this);
  };
  _ctor.prototype.onConfigChange = function () {
    this.mVersions.string = "v" + mm.platform.versionStr + (yzll.gameConfig.debug ? $10DataManager.DataManager.instance.userVersion : "");
  };
  _ctor.prototype.init = function (t) {
    $10BattleDataProxy.battleDataProxy.isStartFight && ($10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.PAUSE);
    this.mTitleClickNum = 0;
    this.mGameRoot.active = t.isGame;
    this.mHomeRoot.active = !t.isGame;
    $10EventManager.EventManager.instance.on($10AudioManager.EAudioEvent.BACKGROUND_AUDIO_SWITCH_CHANGE, this.updateView, this);
    $10EventManager.EventManager.instance.on($10AudioManager.EAudioEvent.EFFECT_AUDIO_SWITCH_CHANGE, this.updateView, this);
    this.updateView();
  };
  _ctor.prototype.onShow = function () {
    yzll.gameConfig.isGM && this.initBgSelContent();
  };
  _ctor.prototype.onDisable = function () {
    $10EventManager.EventManager.instance.off($10AudioManager.EAudioEvent.BACKGROUND_AUDIO_SWITCH_CHANGE, this.updateView, this);
    $10EventManager.EventManager.instance.off($10AudioManager.EAudioEvent.EFFECT_AUDIO_SWITCH_CHANGE, this.updateView, this);
    $10UserSetDataProxy.userSetDataProxy.saveData();
    t.prototype.onDisable.call(this);
  };
  _ctor.prototype.updateView = function () {
    this.musicVolumeSlider.progress = $10UserSetDataProxy.userSetDataProxy.setData.musicVolume;
    this.musicVolumePro.fillRange = $10UserSetDataProxy.userSetDataProxy.setData.musicVolume;
    this.effectVolumeSlider.progress = $10UserSetDataProxy.userSetDataProxy.setData.effectVolume;
    this.effectVolumePro.fillRange = $10UserSetDataProxy.userSetDataProxy.setData.effectVolume;
    var t = $10UserSetDataProxy.userSetDataProxy.setData.isOpenShake;
    this.nShake.getChildByName("Close").active = !t;
    this.nShake.getChildByName("Open").active = t;
    this.mShakeLab.string = t ? "开" : "关";
    this.mMusicVolumeLab.string = (100 * $10UserSetDataProxy.userSetDataProxy.setData.musicVolume).toFixed(0);
    this.mEffectVolumeLab.string = (100 * $10UserSetDataProxy.userSetDataProxy.setData.effectVolume).toFixed(0);
  };
  _ctor.prototype.onClickBtnEffectAudio = function () {};
  _ctor.prototype.onClickBtnMusicAudio = function () {};
  _ctor.prototype.onMusicVolumeSlider = function (t) {
    this.musicVolumeSlider.progress = t.progress;
    this.musicVolumePro.fillRange = t.progress;
    $10AudioManager.AudioManager.instance.setBgmVolume(t.progress);
    $10UserSetDataProxy.userSetDataProxy.setData.musicVolume = t.progress;
    this.mMusicVolumeLab.string = (100 * $10UserSetDataProxy.userSetDataProxy.setData.musicVolume).toFixed(0);
  };
  _ctor.prototype.onEffectVolumeSlider = function (t) {
    this.effectVolumeSlider.progress = t.progress;
    this.effectVolumePro.fillRange = t.progress;
    $10AudioManager.AudioManager.instance.setEffectVolume(t.progress);
    $10UserSetDataProxy.userSetDataProxy.setData.effectVolume = t.progress;
    this.mEffectVolumeLab.string = (100 * $10UserSetDataProxy.userSetDataProxy.setData.effectVolume).toFixed(0);
  };
  _ctor.prototype.onSlider1Changed = function () {};
  _ctor.prototype.onSlider2Changed = function () {};
  _ctor.prototype.onClickBtnShake = function () {
    $10UserSetDataProxy.userSetDataProxy.setVibrate(!$10UserSetDataProxy.userSetDataProxy.setData.isOpenShake);
    this.updateView();
  };
  _ctor.prototype.onClickBtnExit = function () {
    this.removeUI($10PopupManager.PopupCacheMode.ONCE, false);
    $10BattleDataProxy.battleDataProxy.clearData();
    if (1 == $10UserDataProxy.userDataProxy.userData.curChapter && $10UserDataProxy.userDataProxy.userData.gameCourseData.curId < 3) {
      $10UserDataProxy.userDataProxy.userData.gameCourseData.curId = 3;
      $10UserDataProxy.userDataProxy.userData.gameCourseData.completeId = 3;
      $10UserDataProxy.userDataProxy.saveData();
    }
    $10PopupManager.PopupManager.instance.remove("CoursePopup");
    $10SceneManager.SceneManager.instance.runScene("Home", "Game", function () {});
  };
  _ctor.prototype.onClickBtnClose = function () {
    this.removeUI($10PopupManager.PopupCacheMode.ONCE, false);
    if ($10BattleDataProxy.battleDataProxy.isStartFight) {
      $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.PLAYING;
    } else {
      $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.READY;
    }
  };
  _ctor.prototype.onBtncdKey = function () {};
  _ctor.prototype.initBgSelContent = function () {};
  _ctor.prototype.onBtnChangeMapFloor = function (t, e) {
    $10CommonUtil.CommonUtil.print("onBtnChangeMapFloor", e);
  };
  _ctor.prototype.onTitleClick = function () {
    this.mTitleClickNum++;
    if (this.mTitleClickNum >= 8) {
      this.mTitleClickNum = 0;
      $10GameUIManager.gameUIMgr.showTortWarningPopup();
    }
  };
  _ctor.prototype.copyToClipboard = function (t) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(t).then(function () {
        $10GameUIManager.gameUIMgr.showTips("复制成功~");
      }).catch(function () {
        $10GameUIManager.gameUIMgr.showTips("复制失败~");
      });
    } else {
      this.copyTextUsingExecCommand(t);
    }
  };
  _ctor.prototype.copyTextUsingExecCommand = function (t) {
    var e = document.createElement("textarea");
    e.value = t;
    document.body.appendChild(e);
    e.select();
    try {
      var o = document.execCommand("copy") ? "复制成功~" : "复制失败~";
      $10GameUIManager.gameUIMgr.showTips(o);
    } catch (i) {
      console.error("复制失败:", i);
    }
    document.body.removeChild(e);
  };
  _ctor.prototype.onBtnCopyUUID = function () {
    if (cc.sys.isBrowser) {
      this.copyToClipboard($10DataManager.DataManager.playerId);
    } else {
      mm.platform.setClipboardData($10DataManager.DataManager.playerId);
    }
  };
  _ctor.prototype.onBtnChange = function () {
    var t = {
      value: this.mCodeBox.string
    };
    var e = JSON.stringify({
      params: $10HttpRequest.HttpRequest.inst.encryptStr(JSON.stringify(t))
    });
    $10HttpRequest.HttpRequest.inst.request("POST", "/player/cdkey/gm", e).then(function (t) {
      if (200 == t.code) {
        if ("" != t.data) {
          var e = t.data.split("|");
          var o = [];
          var i = 0;
          for (var n = e.length; i < n; i++) {
            var a = e[i].split("_");
            o.push({
              id: Number(a[0]),
              num: Number(a[1])
            });
          }
          $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
            list: o,
            type: 1
          });
        } else {
          if (cc.sys.isBrowser) {
            $10GameUIManager.gameUIMgr.showTips("激活成功！");
          } else {
            $10GameUIManager.gameUIMgr.showTips("开启无广模式！");
          }
          $10UserDataProxy.userDataProxy.userData.startGameRights = true;
          $10UserDataProxy.userDataProxy.saveData();
          yzll.gameConfig.isGM = true;
        }
      } else {
        $10GameUIManager.gameUIMgr.showTips("无效兑换码");
      }
    }).catch(function () {
      $10GameUIManager.gameUIMgr.showTips("无效兑换码");
    });
  };
  _ctor.prototype.onBtnTest = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "uis/root/TestPopup",
      keep: true
    });
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nEffectAudio", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nMusicAudio", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nShake", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mVersions", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mUID", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "mCodeBox", undefined);
  cc__decorate([ccp_property(cc.Slider)], _ctor.prototype, "musicVolumeSlider", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "musicVolumePro", undefined);
  cc__decorate([ccp_property(cc.Slider)], _ctor.prototype, "effectVolumeSlider", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "effectVolumePro", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mMusicVolumeLab", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mEffectVolumeLab", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mShakeLab", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mGameRoot", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mHomeRoot", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mTestBtn", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_GameSettingPopup;