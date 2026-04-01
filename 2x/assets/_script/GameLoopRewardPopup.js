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
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10GameUIManager = require("GameUIManager");
var $10RedDotMgr = require("RedDotMgr");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GameLoopRewardPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mLoopTips = null;
    e.mMyList = null;
    e._datastagereward = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    var t = $10DataManager.DataManager.instance.eData.datastagereward;
    for (var e in t) {
      "" != t[e].roundReward && this._datastagereward.push(t[e]);
    }
    this.mLoopTips.string = "当前：第" + $10UserDataProxy.userDataProxy.userData.loopNum + "轮";
    $10UserDataProxy.userDataProxy.userData.roundReward || ($10UserDataProxy.userDataProxy.userData.roundReward = {});
  };
  _ctor.prototype.onShow = function () {
    this.mMyList.numItems = this._datastagereward.length;
  };
  _ctor.prototype.onUpdateItem = function (t, e) {
    var o = this._datastagereward[e];
    t.getChildByName("countLab").getComponent(cc.Label).string = "第\n" + o.round + "\n轮";
    var i = t.getChildByName("BtnReceive");
    var n = t.getChildByName("already");
    var a = t.getChildByName("bg2");
    var r = t.getChildByName("titleBg2");
    if ($10UserDataProxy.userDataProxy.userData.passChapter >= o.id) {
      if ($10UserDataProxy.userDataProxy.userData.roundReward[o.round]) {
        i.active = false;
        n.active = true;
        a.active = true;
        r.active = true;
      } else {
        i.active = true;
        n.active = false;
        a.active = false;
        r.active = false;
        $10Util.default.addButtonListener(i, "GameLoopRewardPopup", "onItemReceive", this.node, {
          datastagereward: o,
          item: t,
          idx: e
        });
      }
    } else {
      i.active = false;
      n.active = false;
      a.active = true;
      r.active = true;
    }
    var s = o.roundReward.split("|");
    var l = t.getChildByName("layout");
    var m = function (t) {
      var e = s[t].split("_");
      var o = $10DataManager.DataManager.instance.eData.dataitem[Number(e[0])];
      if (!o) {
        return "continue";
      }
      var i = l.children[t];
      i || ((i = cc.instantiate(l.children[0])).parent = l);
      var n = i.getChildByName("itemBg").getComponent(cc.Sprite);
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/public/item_bg" + o.qulity,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        n.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      var a = i.getChildByName("itemImg").getComponent(cc.Sprite);
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/item/" + o.icon,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        a.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      i.getChildByName("itemNum").getComponent(cc.Label).string = "x" + e[1];
    };
    var f = 0;
    for (var y = s.length; f < y; f++) {
      m(f);
    }
  };
  _ctor.prototype.onItemReceive = function (t, e) {
    if ($10UserDataProxy.userDataProxy.userData.roundReward[e.datastagereward.round]) {
      $10GameUIManager.gameUIMgr.showTips("奖励已领取！");
    } else {
      $10UserDataProxy.userDataProxy.userData.roundReward[e.datastagereward.round] = 1;
      $10UserDataProxy.userDataProxy.saveData();
      var o = [];
      var i = e.datastagereward.roundReward.split("|");
      var n = 0;
      for (var a = i.length; n < a; n++) {
        var r = i[n].split("_");
        2 == r.length && o.push({
          id: Number(r[0]),
          num: Number(r[1])
        });
      }
      $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
        list: o,
        type: 1
      });
      this.onUpdateItem(e.item, e.idx);
      $10EventManager.EventManager.instance.emit($10UserDataProxy.EUserDataEvent.UPDATE_LOOP_REWARD_RED);
      $10RedDotMgr.default.instance.updateRedDotState([$10HomeEnum.HOME_REDDOT.BATTLERED]);
    }
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mLoopTips", undefined);
  cc__decorate([ccp_property($10List.default)], _ctor.prototype, "mMyList", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_GameLoopRewardPopup;