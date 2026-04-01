var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PopupBase = require("PopupBase");
var $10SceneManager = require("SceneManager");
var $10AdsMgr = require("AdsMgr");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var $10ResUtil = require("ResUtil");
var $10GuardingDataProxy = require("GuardingDataProxy");
var $10AnimationMgr = require("AnimationMgr");
var $10AudioManager = require("AudioManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GTLosePopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mTips1 = null;
    e.mTips2 = null;
    e.mItemLayout = null;
    e._reawards = [];
    e._isCanClick = true;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (e) {
    t.prototype.init.call(this, e);
    var o = [];
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/lose", "Res");
    var i = Math.floor(1e3 * Math.random()) % 3 + 1;
    var a = $10DataManager.DataManager.instance.eData.datasettlement[1]["des" + i].split("|");
    this.mTips1.string = a[0];
    this.mTips2.string = a[1];
    this._reawards = o;
    var n = $10DataManager.DataManager.instance.eData.data_bridgestage[$10GuardingDataProxy.guardingDataProxy.currStageId];
    if (n) {
      var r = n.reward.split("|");
      for (var s = 0; s < r.length; s++) {
        var c = r[s].split("_");
        var p = {};
        p.id = c[0];
        p.num = c[1];
        o.push(p);
      }
    }
    o.length;
    var m = function (t) {
      var e = $10DataManager.DataManager.instance.eData.dataitem[o[t].id];
      var i = f.mItemLayout.children[t];
      i || ((i = cc.instantiate(f.mItemLayout.children[0])).parent = f.mItemLayout);
      i.active = true;
      var a = i.getChildByName("itemBg").getComponent(cc.Sprite);
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/public/item_bg" + e.qulity,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        a.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      var n = i.getChildByName("itemImg").getComponent(cc.Sprite);
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/item/" + e.icon,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        n.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      i.getChildByName("itemNum").getComponent(cc.Label).string = "x" + o[t].num;
    };
    var f = this;
    s = 0;
    for (var y = o.length; s < y; s++) {
      m(s);
    }
  };
  _ctor.prototype.toHome = function (t) {
    var e = this;
    this._isCanClick = false;
    var o = this.node.getChildByName("layout");
    var i = 0;
    $10GuardingDataProxy.guardingDataProxy.GuardingData.btnStartTime = new Date().getTime();
    $10GuardingDataProxy.guardingDataProxy.saveData();
    var a = this._reawards.length;
    var n = a > 0 ? 2 : 0;
    var r = function (n) {
      var r = o.children[n];
      if (!r.active) {
        return "continue";
      }
      var s = c._reawards[i];
      s.num = t ? 2 * s.num : s.num;
      c.scheduleOnce(function () {
        if (s) {
          r.active = false;
          $10AnimationMgr.default.instance.showAwardAni(s, e.node, r, 0, cc.v3(-250, s.id > 6 ? -850 : 850));
          $10UserDataProxy.userDataProxy.addProp(s.id, s.num, i + 1 == a);
        }
      }, .1 * i);
      i++;
    };
    var c = this;
    for (var l = 0; l < o.children.length; ++l) {
      r(l);
    }
    this.scheduleOnce(function () {
      $10SceneManager.SceneManager.instance.runScene("Home", "");
      e.removeUI();
    }, .1 * i + n);
  };
  _ctor.prototype.onClickBtnClose = function () {
    this._isCanClick && this.toHome(false);
  };
  _ctor.prototype.onClickBtnDouble = function () {
    var t = this;
    this._isCanClick && $10AdsMgr.default.showVideoAds({
      id: 1,
      eventId: "gt_double_reward",
      success: function () {
        t.toHome(true);
      },
      fail: function (t) {
        return console.log(t);
      },
      error: function (t) {
        return console.log(t);
      }
    }, true);
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mTips1", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mTips2", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mItemLayout", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_GTLosePopup;