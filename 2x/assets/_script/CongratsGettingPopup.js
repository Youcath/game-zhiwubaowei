var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10PopupBase = require("PopupBase");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10AnimationMgr = require("AnimationMgr");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_CongratsGettingPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._awardsList = [];
    e._contant = null;
    e._data = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    var e = this;
    this._data = t.args;
    var o = t.title;
    var i = t.isGray;
    var n = this.node.getChildByName("pic_huode_title_di");
    var a = n.getChildByName("New Label");
    if (i) {
      $10Util.default.setSpriteGrayMaterial(n.getComponent(cc.Sprite));
      a.color = cc.color(125, 125, 125);
    }
    o && (a.getComponent(cc.Label).string = o);
    this.scheduleOnce(function () {
      e.initView();
    });
  };
  _ctor.prototype.initView = function () {
    var t = this;
    this.node.getChildByName("getBtn").active = false;
    var e = this.node.getChildByName("contant");
    var o = this.node.getChildByName("aniLayer");
    this._awardsList = $10UserDataProxy.userDataProxy.checkBoxRetrunAwards(this._data.list);
    var i = this._data.type;
    var n = cc.v3(0, 0);
    if (this._awardsList.length > 4) {
      n.x = -260;
      n.y = 300;
    } else {
      n.x = 82.5 - 82.5 * this._awardsList.length;
    }
    var a = 0;
    if (1 != i) {
      this.node.getChildByName("pic_huode_title_di").active = false;
      a = 1;
      var s = this.node.getChildByName("shop_summon").getComponent(sp.Skeleton);
      s.node.active = true;
      s.setSkin("baoxiang" + (i - 1));
      this.scheduleOnce(function () {
        s.clearTracks();
        s.setAnimation(0, "open", false);
        s.setCompleteListener(function (i) {
          i.animation && i.animation.name;
          t.node.getChildByName("pic_huode_title_di").active = true;
          s.node.active = false;
          var a = function (i) {
            var a = cc.instantiate(t.node.getChildByName("shop_summon_card"));
            a.parent = o;
            var r = cc.v3(n.x + i % 4 * 168, n.y - (210 * Math.floor(i / 4) - 25));
            a.setPosition(r);
            a.active = true;
            a.getComponent(sp.Skeleton).setAnimation(0, "Knapsack_1", false);
            a.getComponent(sp.Skeleton).setCompleteListener(function () {
              e.children[i].active = true;
            });
          };
          var r = 0;
          for (var c = t._awardsList.length; r < c; r++) {
            a(r);
          }
        });
      });
    }
    e.active = true;
    e.children.forEach(function (t) {
      return t.active = false;
    });
    this._contant = e;
    this.scheduleOnce(function () {
      var o = function (o, a) {
        t.scheduleOnce(function () {
          var s = $10DataManager.DataManager.instance.eData.dataitem[t._awardsList[o].id];
          if (s) {
            var p = e.children[o];
            p || ((p = cc.instantiate(e.children[0])).parent = e);
            var h = p.getChildByName("qimg").getComponent(cc.Sprite);
            $10ResUtil.ResUtil.loadAsset({
              path: "textures/public/item_bg" + s.qulity,
              type: cc.SpriteFrame,
              bundleName: $10HomeEnum.Bundles.GAME
            }).then(function (t) {
              h.spriteFrame = t;
            }).catch(function (t) {
              console.log("error:", t);
            });
            var d = p.getChildByName("icon").getComponent(cc.Sprite);
            $10ResUtil.ResUtil.loadAsset({
              path: "textures/item/" + s.icon,
              type: cc.SpriteFrame,
              bundleName: $10HomeEnum.Bundles.GAME
            }).then(function (t) {
              d.spriteFrame = t;
            }).catch(function (t) {
              console.log("error:", t);
            });
            p.getChildByName("numLabel").getComponent(cc.Label).string = "x" + t._awardsList[o].num;
            p.getChildByName("nameLabel").getComponent(cc.Label).string = s.name;
            p.active = 1 == i;
            t._awardsList[o].noSave || $10UserDataProxy.userDataProxy.addProp(t._awardsList[o].id, t._awardsList[o].num, o + 1 == a);
            var m = cc.v3(n.x + o % 4 * 168, n.y - 210 * Math.floor(o / 4));
            p.setPosition(m);
          } else {
            cc.error("无此道具id", t._awardsList[o].id);
          }
        });
      };
      var a = 0;
      for (var s = t._awardsList.length; a < s; a++) {
        o(a, s);
      }
    }, 2 * a);
    this.scheduleOnce(function () {
      if (t._awardsList.length > 1) {
        t.node.getChildByName("getBtn").active = true;
      } else {
        t.scheduleOnce(function () {
          t.onGetAwardList();
        }, .5);
      }
    }, 4 * a);
  };
  _ctor.prototype.onGetAwardList = function () {
    var t = this;
    this.node.getChildByName("getBtn").active = false;
    var e = 0;
    this._contant.getComponent(cc.Layout).enabled = false;
    this._contant.children.forEach(function (o) {
      var i = t._awardsList[e];
      t.scheduleOnce(function () {
        if (i) {
          o.active = false;
          $10AnimationMgr.default.instance.showAwardAni(i, null, o);
        }
      }, .1 * e);
      e++;
    });
    this.scheduleOnce(function () {
      t.removeUI();
    }, .1 * e + .3);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_CongratsGettingPopup;