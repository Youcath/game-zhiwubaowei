Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AudioManager = exports.EAudioEvent = undefined;
var i;
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10BasicsProxy = require("BasicsProxy");
(function (t) {
  t.BATTLE_EFFECT_SWITCH_CHANGE = "BATTLE_EFFECT_SWITCH_CHANGE";
  t.EFFECT_AUDIO_SWITCH_CHANGE = "EFFECT_AUDIO_SWITCH_CHANGE";
  t.BACKGROUND_AUDIO_SWITCH_CHANGE = "BACKGROUND_AUDIO_SWITCH_CHANGE";
})(i = exports.EAudioEvent || (exports.EAudioEvent = {}));
var exp_AudioManager = function () {
  function _ctor() {
    this._bgmPath = "";
    this._bgmId = -1;
    this._clips = Object.create(null);
    this._loading = [];
    this._isOpenEffectAudio = true;
    this._isOpenBackgroundAudio = true;
    this._isOpenBattleEffect = true;
    this._bgmId = -1;
    cc.audioEngine.setEffectsVolume($10BasicsProxy.basicsProxy.effectVolume);
    cc.audioEngine.setMusicVolume($10BasicsProxy.basicsProxy.bgmVolume);
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == _ctor._instance && (_ctor._instance = new _ctor());
      return _ctor._instance;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isOpenBattleEffect", {
    get: function () {
      return this._isOpenBattleEffect;
    },
    set: function (t) {
      if (this._isOpenBattleEffect !== t) {
        this._isOpenBattleEffect = t;
        $10EventManager.EventManager.instance.emit(i.BATTLE_EFFECT_SWITCH_CHANGE);
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isOpenEffectAudio", {
    get: function () {
      return this._isOpenEffectAudio;
    },
    set: function (t) {
      if (this._isOpenEffectAudio !== t) {
        this._isOpenEffectAudio = t;
        $10EventManager.EventManager.instance.emit(i.EFFECT_AUDIO_SWITCH_CHANGE);
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isOpenBackgroundAudio", {
    get: function () {
      return this._isOpenBackgroundAudio;
    },
    set: function (t) {
      if (this._isOpenBackgroundAudio !== t) {
        this._isOpenBackgroundAudio = t;
        if (t) {
          if ($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PAUSE) {
            this.playBgmPath("sounds/homeBgm", $10HomeEnum.Bundles.RES, true);
          } else {
            this.playBgmPath("sounds/battleBGM", $10HomeEnum.Bundles.RES, true);
          }
        } else {
          this.stopBgm();
        }
        $10EventManager.EventManager.instance.emit(i.BACKGROUND_AUDIO_SWITCH_CHANGE);
      }
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.setBgmVolume = function (t) {
    $10BasicsProxy.basicsProxy.bgmVolume = t;
    cc.audioEngine.setMusicVolume($10BasicsProxy.basicsProxy.bgmVolume);
    if (0 === t) {
      this.pauseBgm();
    } else {
      this.isBgmPlaying() || this.resumeBgm();
    }
  };
  _ctor.prototype.playBgm = function (t, e) {
    undefined === e && (e = true);
    if (this._isOpenBackgroundAudio) {
      -1 !== this._bgmId && this.stopBgm();
      this._bgmId = cc.audioEngine.playMusic(t, e);
    }
  };
  _ctor.prototype.playBgmPath = function (t, e, o) {
    var i = this;
    undefined === e && (e = undefined);
    undefined === o && (o = true);
    var n = (e || "") + t;
    if (this._bgmPath != n) {
      this._bgmPath = n;
      this._loading.push(n);
      $10ResUtil.ResUtil.loadAsset({
        bundleName: e,
        path: t,
        type: cc.AudioClip,
        success: function (t) {
          var e = i._loading.indexOf(n);
          if (-1 !== e) {
            i._loading.splice(e, 1);
            i.playBgm(t, o);
          }
        }
      });
    }
  };
  _ctor.prototype.isBgmPlaying = function () {
    return cc.audioEngine.isMusicPlaying();
  };
  _ctor.prototype.resumeBgm = function () {
    this._isOpenBackgroundAudio && cc.audioEngine.resumeMusic();
  };
  _ctor.prototype.pauseBgm = function () {
    this._isOpenBackgroundAudio && cc.audioEngine.pauseMusic();
  };
  _ctor.prototype.stopBgm = function () {
    cc.audioEngine.stopMusic();
    this._bgmId = -1;
  };
  _ctor.prototype.setEffectVolume = function (t) {
    $10BasicsProxy.basicsProxy.effectVolume = t;
    cc.audioEngine.setEffectsVolume($10BasicsProxy.basicsProxy.effectVolume);
    0 === t && this.stopAllEffect();
  };
  _ctor.prototype.playEffect = function (t, e, o) {
    undefined === e && (e = false);
    undefined === o && (o = "");
    if (this._isOpenEffectAudio) {
      if (0 === $10BasicsProxy.basicsProxy.effectVolume) {
        return -1;
      }
      var i = cc.audioEngine.playEffect(t, e);
      this._clips[t.name + o] = i;
      return i;
    }
  };
  _ctor.prototype.playBattleEffect = function (t, e, o, i, n) {
    undefined === e && (e = $10HomeEnum.Bundles.RES);
    undefined === o && (o = false);
    undefined === i && (i = false);
    undefined === n && (n = "");
    this._isOpenBattleEffect && this.playEffectPath(t, e, o, i, n);
  };
  _ctor.prototype.playEffectPath = function (t, e, o, i, n) {
    var s = this;
    undefined === e && (e = $10HomeEnum.Bundles.RES);
    undefined === o && (o = false);
    undefined === i && (i = false);
    undefined === n && (n = "");
    if ("sounds/click" != t && "sounds/pop" != t) {
      if ($10BattleDataProxy.battleDataProxy.audioFilterInfo[t]) {
        if ($10BattleDataProxy.battleDataProxy.audioFilterInfo[t].time > 0) {
          return;
        }
      } else {
        $10BattleDataProxy.battleDataProxy.audioFilterInfo[t] = {
          time: 0
        };
      }
      $10BattleDataProxy.battleDataProxy.audioFilterInfo[t].time = .2;
    }
    var l = (e || "") + t;
    this._loading.push(l);
    $10ResUtil.ResUtil.loadAsset({
      path: t,
      bundleName: e,
      type: cc.AudioClip,
      success: function (t) {
        o && t.addRef();
        var e = s._loading.indexOf(l);
        if (-1 !== e) {
          s._loading.splice(e, 1);
          var a = s.playEffect(t, i, n);
          o && cc.audioEngine.setFinishCallback(a, function () {
            t.decRef();
          });
        } else {
          o && t.decRef();
        }
      }
    });
  };
  _ctor.prototype.playCourseSound = function (t, e, o) {
    var i = this;
    undefined === e && (e = $10HomeEnum.Bundles.RES);
    $10ResUtil.ResUtil.loadAsset({
      path: t,
      bundleName: e,
      type: cc.AudioClip,
      success: function (t) {
        var e = i.playEffect(t, false);
        o && o(e);
      }
    });
  };
  _ctor.prototype.pauseEffect = function (t, e) {
    undefined === e && (e = "");
    var o = this._clips[t + e];
    o && cc.audioEngine.pauseEffect(o);
  };
  _ctor.prototype.resumeEffect = function (t, e) {
    undefined === e && (e = "");
    var o = this._clips[t + e];
    o && cc.audioEngine.resumeEffect(o);
  };
  _ctor.prototype.stopEffect = function (t, e) {
    undefined === e && (e = "");
    var o = this._clips[t + e];
    if (o) {
      cc.audioEngine.stopEffect(o);
      delete this._clips[t + e];
    }
  };
  _ctor.prototype.stopAllEffect = function () {
    for (var t in this._clips) {
      if ("draw" != t) {
        var e = this._clips[t];
        if (e) {
          cc.audioEngine.stopEffect(e);
          delete this._clips[t];
        }
      }
    }
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.AudioManager = exp_AudioManager;