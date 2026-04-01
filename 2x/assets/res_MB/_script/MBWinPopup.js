var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AnimationMgr = require("AnimationMgr");
var $10AudioManager = require("AudioManager");
var $10ResUtil = require("ResUtil");
var $10PopupBase = require("PopupBase");
var $10SceneManager = require("SceneManager");
var $10AdsMgr = require("AdsMgr");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10MBGameDataProxy = require("MBGameDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MBWinPopup = function (t) {
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
    $10MBGameDataProxy.mbGameDataProxy.btnStartTime = new Date().getTime();
    var n = [];
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/win", "res_MB");
    var i = Math.floor(1e3 * Math.random()) % 3 + 1;
    var o = $10DataManager.DataManager.instance.eData.datasettlement[1]["des" + i].split("|");
    this.mTips1.string = o[0];
    this.mTips2.string = o[1];
    this._reawards = n;
    var a = $10DataManager.DataManager.instance.eData.datapara[1804].num.split("|");
    var r = 0;
    for (var p = a.length; r < p; r++) {
      var l = a[r].split("_");
      n.push({
        id: parseInt(l[0]),
        num: parseInt(l[1])
      });
    }
    n.length;
    var u = function (t) {
      var e = $10DataManager.DataManager.instance.eData.dataitem[n[t].id];
      var i = m.mItemLayout.children[t];
      i || ((i = cc.instantiate(m.mItemLayout.children[0])).parent = m.mItemLayout);
      i.active = true;
      var o = i.getChildByName("itemBg").getComponent(cc.Sprite);
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/public/item_bg" + e.qulity,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        o.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      var a = i.getChildByName("itemImg").getComponent(cc.Sprite);
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/item/" + e.icon,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        a.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      i.getChildByName("itemNum").getComponent(cc.Label).string = "x" + n[t].num;
    };
    var m = this;
    r = 0;
    for (p = n.length; r < p; r++) {
      u(r);
    }
    $10MBGameDataProxy.mbGameDataProxy.win();
  };
  _ctor.prototype.toHome = function () {
    var t = this;
    this._isCanClick = false;
    var e = this.node.getChildByName("layout");
    var n = 0;
    var i = this._reawards.length;
    var o = i > 0 ? 2 : 0;
    var a = function (o) {
      var a = e.children[o];
      if (!a.active) {
        return "continue";
      }
      var c = s._reawards[n];
      s.scheduleOnce(function () {
        if (c) {
          a.active = false;
          $10AnimationMgr.default.instance.showAwardAni(c, t.node, a, 0, cc.v3(-250, c.id > 6 ? -850 : 850));
          $10UserDataProxy.userDataProxy.addProp(c.id, c.num, n + 1 == i);
        }
      }, .1 * n);
      n++;
    };
    var s = this;
    for (var c = 0; c < e.children.length; ++c) {
      a(c);
    }
    this.scheduleOnce(function () {
      $10SceneManager.SceneManager.instance.runScene("Home", "");
      t.removeUI();
    }, .1 * n + o);
  };
  _ctor.prototype.resetGame = function () {
    var t = this;
    this._isCanClick = false;
    var e = this.node.getChildByName("layout");
    var n = 0;
    var i = this._reawards.length;
    var o = i > 0 ? 2 : 0;
    var a = function (o) {
      var a = e.children[o];
      if (!a.active) {
        return "continue";
      }
      var c = s._reawards[n];
      s.scheduleOnce(function () {
        if (c) {
          a.active = false;
          $10AnimationMgr.default.instance.showAwardAni(c, t.node, a, 0, cc.v3(-250, c.id > 6 ? -850 : 850));
          $10UserDataProxy.userDataProxy.addProp(c.id, c.num, n + 1 == i);
        }
      }, .1 * n);
      n++;
    };
    var s = this;
    for (var c = 0; c < e.children.length; ++c) {
      a(c);
    }
    this.scheduleOnce(function () {
      $10SceneManager.SceneManager.instance.runScene("mb", "");
      t.removeUI();
    }, .1 * n + o);
  };
  _ctor.prototype.onClickBtnClose = function () {
    this._isCanClick && this.toHome();
  };
  _ctor.prototype.onClickBtnRestart = function () {
    var t = this;
    this._isCanClick && $10AdsMgr.default.showVideoAds({
      id: 1,
      eventId: "mb_game_enter",
      success: function () {
        t.resetGame();
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
exports.default = def_MBWinPopup;