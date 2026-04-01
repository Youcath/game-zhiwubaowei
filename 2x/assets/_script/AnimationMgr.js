var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10PopupManager = require("PopupManager");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10ItemAni = require("ItemAni");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_AnimationMgr = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._flyItemPb = null;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      return this._instance || (this._instance = new this());
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.showAwardAni = function (t, e, o, i, n) {
    var a;
    var p = this;
    var d = null;
    d = e || $10PopupManager.PopupManager.instance.getPopupNode();
    a = o ? d.convertToNodeSpaceAR(o.parent.convertToWorldSpaceAR(o.position)) : cc.v3(0, 0);
    var m = $10DataManager.DataManager.instance.eData.dataitem[t.id];
    n || (n = this.getEndPos(m, d));
    if (n) {
      var f = t.num;
      var y = 20;
      8 == t.id && (y = 30);
      this.getItemIconPrefab(function () {
        var e = function (e) {
          if (e >= y) {
            return "break";
          }
          var o = $10NodePoolManager.default.instance.getNode(p._flyItemPb);
          if (o) {
            o.scale = 8 == t.id ? 1 : .8;
            var s = o.getChildByName("itemIcon");
            $10ResUtil.ResUtil.loadAsset({
              path: "textures/item/" + m.icon,
              type: cc.SpriteFrame,
              bundleName: $10HomeEnum.Bundles.GAME
            }).then(function (t) {
              s.getComponent(cc.Sprite).spriteFrame = t;
            }).catch(function (t) {
              console.log("error:", t);
            });
            o.parent = d;
            o.getComponent($10ItemAni.default).init(t, a, n, i, 0 == e);
            o.active = true;
            o.zIndex = 1e3;
          } else {
            cc.error("对象池没获取到");
          }
        };
        for (var o = 0; o < f && "break" !== e(o); o++) {
          ;
        }
      });
    }
  };
  _ctor.prototype.getItemIconPrefab = function (t) {
    var e = this;
    if (this._flyItemPb) {
      t && t();
    } else {
      $10ResUtil.ResUtil.loadAsset({
        path: "prefabs/homeItem/FlyItem",
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (o) {
        e._flyItemPb = o;
        e._flyItemPb.addRef();
        t && t();
      }).catch(function (t) {
        console.log("error:", t);
      });
    }
  };
  _ctor.prototype.getEndPos = function (t, e) {
    var o = null;
    if (1 == t.id) {
      o = cc.find("Canvas/topUI/goldRoot");
    } else if (2 == t.id) {
      o = cc.find("Canvas/topUI/diamondRoot");
    } else if (4 == t.id || 6 == t.id || 7 == t.id) {
      o = cc.find("Canvas/downUI/BtnShop");
    } else if (3 == t.id) {
      o = cc.find("Canvas/topUI/physicalRoot");
    } else if (9 == t.id) {
      o = cc.find("Canvas/topUI/manureRoot");
    } else if (2 == t.type) {
      o = cc.find("Canvas/downUI/BtnPlant");
    } else {
      5 == t.type || 5 == t.id || 8 == t.id && (o = $10BattleDataProxy.battleDataProxy.sunshineRoot);
    }
    if (t.id >= 2001) {
      return cc.v3(-106, 602);
    } else {
      if (o) {
        return e.convertToNodeSpaceAR(o.parent.convertToWorldSpaceAR(o.position));
      } else {
        return null;
      }
    }
  };
  _ctor.prototype.usePowerAni = function (t) {
    var e = this;
    undefined === t && (t = 1);
    var o = cc.find("Canvas");
    this.getItemIconPrefab(function () {
      var i = $10NodePoolManager.default.instance.getNode(e._flyItemPb);
      var n = i.getChildByName("itemIcon");
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/item/icon_3",
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        n.getComponent(cc.Sprite).spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      var a;
      var s = cc.find("Canvas/TopLayer/physicalBox");
      var l = o.convertToNodeSpaceAR(s.parent.convertToWorldSpaceAR(s.position));
      a = 1 == t ? cc.find("Canvas/UILayer/HomeView/battleStarBtn") : cc.find("Canvas/UILayer/HomeView/saodanBox");
      var p = o.convertToNodeSpaceAR(a.parent.convertToWorldSpaceAR(a.position));
      i.scale = 1.2;
      i.parent = o;
      i.setPosition(l);
      i.active = true;
      i.zIndex = 1e3;
      i.getComponent($10ItemAni.default).init2(p, .5);
    });
  };
  _ctor.prototype.getCardAni = function () {};
  _ctor._instance = null;
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_AnimationMgr;