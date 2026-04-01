var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10List = require("List");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10PopupBase = require("PopupBase");
var $10SceneManager = require("SceneManager");
var $10AdsMgr = require("AdsMgr");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10GameUIManager = require("GameUIManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_EndlessStartPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mMaxWave = null;
    e.mMyList = null;
    e.mMyRankItem = null;
    e._listData = null;
    e._myRank = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    var t = this;
    $10EventManager.EventManager.instance.on($10HomeEnum.EHomeEvent.RECEIVE_ENDLESS_RWWARDS, this.onReceiveEndlessRewards, this);
    if (!$10UserDataProxy.userDataProxy.userData.endlessData) {
      $10UserDataProxy.userDataProxy.userData.endlessData.maxWave = 0;
      $10UserDataProxy.userDataProxy.userData.endlessData.isReceive = 0;
    }
    this.mMaxWave.string = $10UserDataProxy.userDataProxy.userData.endlessData.maxWave + "";
    var e = this.node.getChildByName("BtnBox").getChildByName("redDot");
    if ($10UserDataProxy.userDataProxy.mYesterdayRank > 0 && 1 != $10UserDataProxy.userDataProxy.userData.endlessData.isReceive) {
      e.active = true;
    } else {
      e.active = false;
    }
    this.node.getChildByName("BtnClose").y -= 20;
    $10BattleDataProxy.battleDataProxy.getEndlessRankDatas(function (e) {
      if (200 == e.code) {
        t._listData = e.data.list;
        t._listData && (t.mMyList.numItems = t._listData.length);
        var o = e.data.myRank;
        if (o) {
          t._myRank = o.rank;
          t.setRankItem(t.mMyRankItem, o);
        } else {
          t.setRankItem(t.mMyRankItem, {
            nickName: $10DataManager.DataManager.instance.mNikeName,
            head: $10DataManager.DataManager.instance.mHead,
            playerld: "",
            rank: -1,
            value: $10UserDataProxy.userDataProxy.userData.endlessData.maxWave
          });
        }
      } else {
        t.setRankItem(t.mMyRankItem, {
          nickName: $10DataManager.DataManager.instance.mNikeName,
          head: $10DataManager.DataManager.instance.mHead,
          playerld: "",
          rank: -1,
          value: $10UserDataProxy.userDataProxy.userData.endlessData.maxWave
        });
      }
    });
    var o = this.node.getChildByName("BtnStart");
    var i = o.getChildByName("videoIcon");
    var n = o.getChildByName("lab");
    console.log("userDataProxy.userData.endlessData:", $10UserDataProxy.userDataProxy.userData.endlessData);
    $10UserDataProxy.userDataProxy.userData.endlessData.playNum || 0 == $10UserDataProxy.userDataProxy.userData.endlessData.playNum || ($10UserDataProxy.userDataProxy.userData.endlessData.playNum = Number($10DataManager.DataManager.instance.eData.datapara[1001].num));
    if ($10UserDataProxy.userDataProxy.userData.endlessData.playNum > 0) {
      i.active = false;
    } else {
      i.active = true;
      n.x = 42;
    }
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10HomeEnum.EHomeEvent.RECEIVE_ENDLESS_RWWARDS, this.onReceiveEndlessRewards, this);
  };
  _ctor.prototype.onReceiveEndlessRewards = function () {
    this.node.getChildByName("BtnBox").getChildByName("redDot").active = false;
  };
  _ctor.prototype.onShow = function () {};
  _ctor.prototype.setRankItem = function (t, e) {
    t.active = true;
    var o = t.getChildByName("waveNum");
    var i = t.getChildByName("head");
    var n = t.getChildByName("nikeName");
    var a = t.getChildByName("rankNum");
    var r = t.getChildByName("greenBg");
    var s = t.getChildByName("yellowBg");
    if (s) {
      s.active = e.rank >= 1 && e.rank <= 3;
      r.active = !s.active;
    } else {
      r.active = true;
    }
    if (e.rank <= 0) {
      a.getComponent(cc.Label).string = "未上榜";
      a.scale = 1;
    } else {
      a.getComponent(cc.Label).string = e.rank + "";
    }
    for (var l = 0; l < 3; ++l) {
      t.getChildByName("pic_" + (l + 1)).active = e.rank == l + 1;
    }
    a.active = e.rank > 3 || e.rank <= 0;
    if (e.nickName && "" != e.nickName) {
      n.getComponent(cc.Label).string = e.nickName;
    } else {
      n.getComponent(cc.Label).string = "神秘玩家";
    }
    if (e.head && "" != e.head) {
      var u = true;
      cc.sys.platform == cc.sys.WECHAT_GAME && (u = e.head.indexOf("https://thirdwx.qlogo.cn") >= 0);
      u && $10ResUtil.ResUtil.loadRemote({
        url: e.head,
        option: {
          ext: ".png"
        }
      }).then(function (t) {
        (null == i ? undefined : i.isValid) && (i.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(t));
      }).catch(function () {});
    }
    o.getComponent(cc.Label).string = e.value + "";
  };
  _ctor.prototype.onUpdateItem = function (t, e) {
    var o = this._listData[e];
    this.setRankItem(t, o);
  };
  _ctor.prototype.onBtnBox = function () {
    $10GameUIManager.gameUIMgr.showEndlessRewardPopup(this._myRank);
  };
  _ctor.prototype.onBtnStart = function () {
    var t = this;
    for (var e = 0; e < 4; ++e) {
      if ($10UserDataProxy.userDataProxy.getWearItemIsUnlock(e).isUnlock && !$10UserDataProxy.userDataProxy.userData.combatEqus[e]) {
        return void $10GameUIManager.gameUIMgr.showTips("携带植物不足！");
      }
    }
    if (cc.sys.isBrowser && yzll.gameConfig.isZB && !$10UserDataProxy.userDataProxy.userData.startGameRights) {
      $10GameUIManager.gameUIMgr.showTips("请先使用兑换码激活游戏~");
    } else {
      var o = $10UserDataProxy.userDataProxy.userData.endlessData.playNum;
      if (o <= 0) {
        $10AdsMgr.default.showVideoAds({
          id: 1,
          eventId: "play_endless_ad",
          success: function () {
            t.goNextScene();
          },
          fail: function () {},
          error: function (t) {
            cc.log(t);
          }
        }, true);
      } else {
        o--;
        $10UserDataProxy.userDataProxy.userData.endlessData.playNum = o;
        $10UserDataProxy.userDataProxy.saveData();
        this.goNextScene();
      }
    }
  };
  _ctor.prototype.goNextScene = function () {
    $10BattleDataProxy.battleDataProxy.clearData();
    $10BattleDataProxy.battleDataProxy.isEndless = true;
    $10BattleDataProxy.battleDataProxy.weatherType = $10GameEnum.WeatherType.NONE;
    $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.STAET_FIGHT);
    $10SceneManager.SceneManager.instance.runScene("Game", "", function () {});
    this.removeUI();
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mMaxWave", undefined);
  cc__decorate([ccp_property($10List.default)], _ctor.prototype, "mMyList", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mMyRankItem", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_EndlessStartPopup;