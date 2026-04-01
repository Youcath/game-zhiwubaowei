var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10ResUtil = require("ResUtil");
var $10PopupBase = require("PopupBase");
var $10SceneManager = require("SceneManager");
var $10AdsMgr = require("AdsMgr");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10AnimationMgr = require("AnimationMgr");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GameLosePopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mTips1 = null;
    e.mTips2 = null;
    e.mItemLayout = null;
    e._isCanClick = true;
    e._reawards = [];
    e._double = 1;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (e) {
    t.prototype.init.call(this, e);
    $10AudioManager.AudioManager.instance.stopBgm();
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/lose", $10HomeEnum.Bundles.RES);
    if ($10BattleDataProxy.battleDataProxy.isEndless) {
      this.endlessOver();
    } else if ($10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE) {
      this.weatherOver();
    } else {
      this.chapterOver();
    }
    this.updateVideoCardNum();
    $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.OVER;
    var o = Math.floor(1e3 * Math.random()) % 3 + 1;
    this.mTips2.string = $10DataManager.DataManager.instance.eData.datasettlement[2]["des" + o];
    $10BattleDataProxy.battleDataProxy.isGameLose = true;
    $10BattleDataProxy.battleDataProxy.clearData();
  };
  _ctor.prototype.weatherOver = function () {
    var t = $10UserDataProxy.userDataProxy.userData.cursWeatherChapter;
    var e = $10DataManager.DataManager.instance.eData.data_weather[t];
    if (e) {
      var o = [];
      var i = 0;
      var n = $10UserDataProxy.userDataProxy.userData.curWeatherWave / 20;
      var a = e.reward.split("|");
      var r = function (t) {
        var e = a[t].split("_");
        if ((i = Math.floor(n * Number(e[1]))) > 0) {
          var r = o.findIndex(function (t) {
            return t.id == Number(e[0]);
          });
          if (r >= 0) {
            o[r].num += i;
          } else {
            o.push({
              id: Number(e[0]),
              num: i
            });
          }
        }
      };
      var s = 0;
      for (var c = a.length; s < c; s++) {
        r(s);
      }
      this.setRewardItems(o);
      this._reawards = o;
    }
  };
  _ctor.prototype.endlessOver = function () {
    var t = $10DataManager.DataManager.instance.eData.datapara[1005].num;
    var e = $10DataManager.DataManager.instance.eData.datapara[1006].num;
    var o = Math.ceil($10BattleDataProxy.battleDataProxy.endlessCurWave / 5);
    var i = [];
    var n = 0;
    var a = t.split("|");
    var r = e.split("|");
    var s = 0;
    for (var c = a.length; s < c; s++) {
      var l = a[s].split("_");
      (n = Math.floor(1 * Number(l[1]))) > 0 && i.push({
        id: Number(l[0]),
        num: n
      });
    }
    var u = function (t) {
      var e = r[t].split("_");
      if ((n = Math.floor(1 * Number(e[1])) * o) > 0) {
        var a = i.findIndex(function (t) {
          return t.id == Number(e[0]);
        });
        if (a >= 0) {
          i[a].num += n;
        } else {
          i.push({
            id: Number(e[0]),
            num: n
          });
        }
      }
    };
    s = 0;
    for (c = r.length; s < c; s++) {
      u(s);
    }
    this.setRewardItems(i);
    this._reawards = i;
    if ($10UserDataProxy.userDataProxy.userData.endlessData.maxWave < $10BattleDataProxy.battleDataProxy.endlessCurWave) {
      $10UserDataProxy.userDataProxy.userData.endlessData.maxWave = $10BattleDataProxy.battleDataProxy.endlessCurWave;
      $10UserDataProxy.userDataProxy.saveData();
    }
    $10BattleDataProxy.battleDataProxy.uploadEndlessResult(function () {
      $10BattleDataProxy.battleDataProxy.getEndlessRankDatas(function () {});
    });
  };
  _ctor.prototype.chapterOver = function () {
    var t = $10BattleDataProxy.battleDataProxy.getStageRewardCfg();
    var e = t.winReward.split("|");
    var o = [];
    var i = 0;
    var n = $10UserDataProxy.userDataProxy.userData.curWave / Number(t.wave);
    n > 1 && (n = 1);
    var a = 0;
    for (var r = e.length; a < r; a++) {
      var s = e[a].split("_");
      (i = Math.floor(n * Number(s[1]))) > 0 && o.push({
        id: Number(s[0]),
        num: i
      });
    }
    o = $10UserDataProxy.userDataProxy.checkBoxRetrunAwards(o);
    this.setRewardItems(o);
    this._reawards = o;
  };
  _ctor.prototype.setRewardItems = function (t) {
    t = $10UserDataProxy.userDataProxy.checkBoxRetrunAwards(t);
    var e = function (e) {
      var i = $10DataManager.DataManager.instance.eData.dataitem[t[e].id];
      var n = o.mItemLayout.children[e];
      n || ((n = cc.instantiate(o.mItemLayout.children[0])).parent = o.mItemLayout);
      n.active = true;
      var a = n.getChildByName("itemBg").getComponent(cc.Sprite);
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/public/item_bg" + i.qulity,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        a.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      var r = n.getChildByName("itemImg").getComponent(cc.Sprite);
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/item/" + i.icon,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        r.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      n.getChildByName("itemNum").getComponent(cc.Label).string = "x" + t[e].num;
    };
    var o = this;
    var i = 0;
    for (var n = t.length; i < n; i++) {
      e(i);
    }
  };
  _ctor.prototype.updateVideoCardNum = function () {
    var t = this.node.getChildByName("BtnDouble").getChildByName("pic_AD_green");
    $10BattleDataProxy.battleDataProxy.setVideoCardIcon(t, 2, 1.5);
  };
  _ctor.prototype.onBtnReceive = function () {
    if (this._isCanClick) {
      this._double = 1;
      this.toHome();
    }
  };
  _ctor.prototype.onBtnDouble = function () {
    var t = this;
    if (this._isCanClick) {
      if ($10UserDataProxy.userDataProxy.getProp(4) > 0) {
        $10UserDataProxy.userDataProxy.addProp(4, -1);
        this._double = 2;
        return void this.toHome();
      }
      $10AdsMgr.default.showVideoAds({
        id: 1,
        eventId: "game_lose_double_ad",
        success: function () {
          t._double = 2;
          t.toHome();
        },
        fail: function (t) {
          return console.log(t);
        },
        error: function (t) {
          return console.log(t);
        }
      }, true);
    }
  };
  _ctor.prototype.toHome = function () {
    var t = this;
    this._isCanClick = false;
    var e = this.node.getChildByName("layout");
    var o = 0;
    var i = this._reawards.length;
    var n = i > 0 ? 2 : 0;
    var a = function (n) {
      var a = e.children[n];
      if (!a.active) {
        return "continue";
      }
      var s = r._reawards[o];
      r.scheduleOnce(function () {
        if (s) {
          a.active = false;
          $10AnimationMgr.default.instance.showAwardAni(s, t.node, a, 0, cc.v3(-250, s.id > 6 ? -850 : 850));
          $10UserDataProxy.userDataProxy.addProp(s.id, s.num * t._double, o + 1 == i);
        }
      }, .1 * o);
      o++;
    };
    var r = this;
    for (var s = 0; s < e.children.length; ++s) {
      a(s);
    }
    this.scheduleOnce(function () {
      $10SceneManager.SceneManager.instance.runScene("Home", "");
      t.removeUI();
    }, .1 * o + n);
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mTips1", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mTips2", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mItemLayout", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_GameLosePopup;