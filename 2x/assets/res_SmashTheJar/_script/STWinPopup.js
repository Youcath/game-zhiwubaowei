var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10PopupBase = require("PopupBase");
var $10SceneManager = require("SceneManager");
var $10AdsMgr = require("AdsMgr");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var $10ResUtil = require("ResUtil");
var $10AnimationMgr = require("AnimationMgr");
var $10STJDataProxy = require("STJDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_STWinPopup = function (t) {
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
    if ($10STJDataProxy.sTJDataProxy.STJData.stageLoseNum[$10STJDataProxy.sTJDataProxy.selectStageId]) {
      $10STJDataProxy.sTJDataProxy.STJData.stageLoseNum[$10STJDataProxy.sTJDataProxy.selectStageId] = 0;
      $10STJDataProxy.sTJDataProxy.saveData();
    }
    var o = $10STJDataProxy.sTJDataProxy.selectStageId + 1;
    if ($10STJDataProxy.sTJDataProxy.STJData.unlockLevels.indexOf(o) < 0) {
      $10STJDataProxy.sTJDataProxy.STJData.unlockLevels.push(o);
      $10STJDataProxy.sTJDataProxy.saveData();
    }
    var i = [];
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/win", "Res");
    var n = Math.floor(1e3 * Math.random()) % 3 + 1;
    var a = $10DataManager.DataManager.instance.eData.datasettlement[1]["des" + n].split("|");
    this.mTips1.string = a[0];
    this.mTips2.string = a[1];
    var s = $10DataManager.DataManager.instance.eData.datapara[1905];
    if (s) {
      var c = s.num.split("|");
      for (var l = 0; l < c.length; l++) {
        var m = c[l].split("_");
        var y = {};
        y.id = m[0];
        y.num = m[1];
        i.push(y);
      }
    }
    i = $10UserDataProxy.userDataProxy.checkBoxRetrunAwards(i);
    this._reawards = i;
    i.length;
    var g = function (t) {
      var e = $10DataManager.DataManager.instance.eData.dataitem[i[t].id];
      var o = v.mItemLayout.children[t];
      o || ((o = cc.instantiate(v.mItemLayout.children[0])).parent = v.mItemLayout);
      o.active = true;
      var n = o.getChildByName("itemBg").getComponent(cc.Sprite);
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/public/item_bg" + e.qulity,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        n.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      var a = o.getChildByName("itemImg").getComponent(cc.Sprite);
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/item/" + e.icon,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        a.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      o.getChildByName("itemNum").getComponent(cc.Label).string = "x" + i[t].num;
    };
    var v = this;
    l = 0;
    for (var _ = i.length; l < _; l++) {
      g(l);
    }
  };
  _ctor.prototype.toHome = function (t) {
    var e = this;
    this._isCanClick = false;
    var o = this.node.getChildByName("layout");
    var i = 0;
    $10STJDataProxy.sTJDataProxy.STJData.btnStartTime = new Date().getTime();
    $10STJDataProxy.sTJDataProxy.saveData();
    var n = this._reawards.length;
    var a = n > 0 ? 2 : 0;
    var r = function (a) {
      var r = o.children[a];
      if (!r.active) {
        return "continue";
      }
      var c = s._reawards[i];
      c.num = t ? 2 * c.num : c.num;
      s.scheduleOnce(function () {
        if (c) {
          r.active = false;
          $10AnimationMgr.default.instance.showAwardAni(c, e.node, r, 0, cc.v3(-250, c.id > 6 ? -850 : 850));
          $10UserDataProxy.userDataProxy.addProp(c.id, c.num, i + 1 == n);
        }
      }, .1 * i);
      i++;
    };
    var s = this;
    for (var l = 0; l < o.children.length; ++l) {
      r(l);
    }
    this.scheduleOnce(function () {
      $10SceneManager.SceneManager.instance.runScene("Home", "");
      e.removeUI();
    }, .1 * i + a);
  };
  _ctor.prototype.onClickBtnClose = function () {
    this._isCanClick && this.toHome(false);
  };
  _ctor.prototype.onClickBtnDouble = function () {
    var t = this;
    this._isCanClick && $10AdsMgr.default.showVideoAds({
      id: 1,
      eventId: "st_double_reward",
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
exports.default = def_STWinPopup;