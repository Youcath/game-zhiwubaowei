var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10GameEnum = require("GameEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10GameUIManager = require("GameUIManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BattleBaseInfoView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSunshineNum = null;
    e.mTips = null;
    e.mWaveProgressBar = null;
    e.mExpProgressBar = null;
    e.mWaveBlock = null;
    e.mWaveLab = null;
    e.mVideoCardNum = null;
    e.mBossTips = null;
    e.mFinishTips = null;
    e._endlessMaxLv = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBattleBaseInfoView = function () {
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.UPDATE_SUNSHINE, this.updateSunshine, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.UPDATE_EXP, this.updateExp, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.SHOW_BOSS_TIPS, this.showBossTips, this);
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.UPDATE_VIDEO_CARD, this.updateVideoCardNum, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.REMOVE_ENEMY, this.removeEnemy, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.GM_SET_ENDLESS_WAVE, this.passWave, this);
    $10BattleDataProxy.battleDataProxy.sunshineRoot = this.mSunshineNum.node.parent;
    this._endlessMaxLv = Number($10DataManager.DataManager.instance.eData.datapara[1002].num);
    this.updateSunshine();
    this.updateVideoCardNum();
    this.setTipsIsShow(true);
    this.seBattleUiIsShow(false);
    this.passWave();
    this.updateExp(0);
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.UPDATE_SUNSHINE, this.updateSunshine, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.UPDATE_EXP, this.updateExp, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.SHOW_BOSS_TIPS, this.showBossTips, this);
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.UPDATE_VIDEO_CARD, this.updateVideoCardNum, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.REMOVE_ENEMY, this.removeEnemy, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.GM_SET_ENDLESS_WAVE, this.passWave, this);
  };
  _ctor.prototype.removeEnemy = function () {
    $10BattleDataProxy.battleDataProxy.waveResidueNum--;
    this.mWaveProgressBar.fillRange = 1 - $10BattleDataProxy.battleDataProxy.waveResidueNum / $10BattleDataProxy.battleDataProxy.waveEnemyNum;
    var t = -this.mWaveBlock.parent.width / 2 + this.mWaveBlock.parent.width * this.mWaveProgressBar.fillRange;
    this.mWaveBlock.position = cc.v3(t, 0);
  };
  _ctor.prototype.showBossTips = function () {
    var t = this;
    this.mBossTips.active = true;
    this.mBossTips.scale = 1;
    cc.Tween.stopAllByTarget(this.mBossTips);
    var e = cc.tween(this.mBossTips).to(.3, {
      scale: 1.3
    }).to(.3, {
      scale: 1
    });
    cc.tween(this.mBossTips).repeat(3, e).call(function () {
      t.mBossTips.active = false;
    }).start();
  };
  _ctor.prototype.passWave = function () {
    if ($10BattleDataProxy.battleDataProxy.isEndless) {
      this.mWaveLab.string = "波次：" + $10BattleDataProxy.battleDataProxy.endlessCurWave;
    } else if ($10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE) {
      var t = $10UserDataProxy.userDataProxy.userData.curWeatherWave;
      this.mWaveLab.string = "波次：" + t + "/20";
    } else {
      var e = $10UserDataProxy.userDataProxy.userData.curChapter;
      var o = $10BattleDataProxy.battleDataProxy.getStageRewardCfg(e);
      t = $10UserDataProxy.userDataProxy.userData.curWave;
      var i = Number(o.wave);
      this.mWaveLab.string = "波次：" + t + "/" + i;
    }
  };
  _ctor.prototype.updateVideoCardNum = function () {
    this.mVideoCardNum.string = "" + $10UserDataProxy.userDataProxy.getProp(4);
  };
  _ctor.prototype.updateSunshine = function () {
    this.mSunshineNum.string = "" + $10BattleDataProxy.battleDataProxy.sunshineNum;
  };
  _ctor.prototype.onTestSunshine = function () {
    if (yzll.gameConfig.gameTestBtn) {
      var t = $10BattleDataProxy.battleDataProxy.sunshineNum;
      t += 100;
      $10BattleDataProxy.battleDataProxy.sunshineNum = t;
    }
  };
  _ctor.prototype.setTipsIsShow = function (t) {
    this.mTips.active = t;
    if (t) {
      if ($10BattleDataProxy.battleDataProxy.isEndless) {
        this.mFinishTips.string = "已完成：" + ($10BattleDataProxy.battleDataProxy.endlessCurWave - 1);
      } else if ($10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE) {
        var e = $10UserDataProxy.userDataProxy.userData.curWeatherWave;
        this.mFinishTips.string = "已完成：" + (e - 1) + "/20";
      } else {
        var o = $10UserDataProxy.userDataProxy.userData.curChapter;
        var i = $10BattleDataProxy.battleDataProxy.getStageRewardCfg(o);
        var n = Number(i.wave);
        this.mFinishTips.string = "已完成：" + ($10UserDataProxy.userDataProxy.userData.curWave - 1) + "/" + n;
      }
    }
  };
  _ctor.prototype.seBattleUiIsShow = function (t) {
    this.mWaveProgressBar.node.parent.active = t;
    if ($10BattleDataProxy.battleDataProxy.isEndless) {
      this.mExpProgressBar.node.parent.active = false;
    } else {
      this.mExpProgressBar.node.parent.active = t;
    }
  };
  _ctor.prototype.updateExp = function (t) {
    var e = $10BattleDataProxy.battleDataProxy.battleData.expLevel;
    if (!$10BattleDataProxy.battleDataProxy.isEndless) {
      var o = $10BattleDataProxy.battleDataProxy.battleData.expNum;
      o += t;
      $10BattleDataProxy.battleDataProxy.battleData.expNum = o;
      var i = $10DataManager.DataManager.instance.eData.datalevel[e];
      if (i) {
        var n = i.exp;
        if ($10BattleDataProxy.battleDataProxy.battleData.expNum >= n) {
          $10BattleDataProxy.battleDataProxy.battleData.expNum -= n;
          $10BattleDataProxy.battleDataProxy.battleData.expLevel++;
          var a = $10DataManager.DataManager.instance.eData.datalevel[$10BattleDataProxy.battleDataProxy.battleData.expLevel];
          if (!a) {
            console.log("满级了");
            return void (this.mExpProgressBar.fillRange = 1);
          }
          n = a.exp;
          var r = $10BattleDataProxy.battleDataProxy.getSkillList();
          if (r && r.length > 0) {
            $10GameUIManager.gameUIMgr.showSelectSkillPopup();
            $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.PAUSE;
          } else {
            console.log("没技能了，不弹窗");
          }
        }
        this.mExpProgressBar.fillRange = $10BattleDataProxy.battleDataProxy.battleData.expNum / n;
      } else {
        this.mExpProgressBar.fillRange = 1;
      }
    }
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mSunshineNum", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mTips", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mWaveProgressBar", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mExpProgressBar", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mWaveBlock", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mWaveLab", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mVideoCardNum", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBossTips", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mFinishTips", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BattleBaseInfoView;