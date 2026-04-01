var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.E_ItemIDType = exports.EFlyItemAnimEvent = undefined;
var r;
var s;
var $10HomeEnum = require("HomeEnum");
var $10NodePoolManager = require("NodePoolManager");
var $10Util = require("Util");
var $10AudioManager = require("AudioManager");
var $10AppBase = require("AppBase");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10AnimUtils = require("AnimUtils");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
(function (t) {
  t.FLY_ITEM_ANIM = "EFlyItemAnimEvent.fly_item_anim";
})(r = exports.EFlyItemAnimEvent || (exports.EFlyItemAnimEvent = {}));
(function (t) {
  t[t.GOLD = 1] = "GOLD";
  t[t.DIAMOND = 2] = "DIAMOND";
  t[t.Star = 3] = "Star";
  t[t.EnergySone = 4] = "EnergySone";
})(s = exports.E_ItemIDType || (exports.E_ItemIDType = {}));
var def_FlyItemAnimCtrl2 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.pFlyItem = null;
    e.endNode1 = null;
    e.endNode2 = null;
    e.endNode3 = null;
    e.endNode4 = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    $10EventManager.EventManager.instance.on(r.FLY_ITEM_ANIM, this.flyItemAnim, this);
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off(r.FLY_ITEM_ANIM, this.flyItemAnim, this);
  };
  _ctor.prototype.getFlyTargetNode = function (t) {
    return this["endNode" + t];
  };
  _ctor.prototype.flyItemAnim = function (t) {
    var e;
    var o = this["endNode" + t.itemId];
    if (o) {
      e = o.convertToWorldSpaceAR(cc.v2(0, 0));
    } else {
      if (!t.endWorldPos) {
        return;
      }
      e = t.endWorldPos;
    }
    var i = $10Util.default.nodeLocalPos(this.node, cc.v3(t.startWorldPos));
    var n = $10Util.default.nodeLocalPos(this.node, e);
    t.itemNum > 20 && (t.itemNum = 20);
    var a = [];
    var r = function () {
      var e = $10NodePoolManager.default.instance.getNode(d.pFlyItem);
      $10AppBase.topNode.addChild(e);
      $10ResUtil.ResUtil.loadAsset({
        bundleName: $10HomeEnum.Bundles.GAME,
        path: t.iconPath,
        type: cc.SpriteFrame
      }).then(function (o) {
        e.getComponent(cc.Sprite).spriteFrame = o;
        e.scale = t.iconScale ? t.iconScale : 1;
      }).catch(function () {});
      e.setPosition($10Util.default.nodeLocalPos(d.node, cc.v3(t.startWorldPos)));
      a.push(e);
    };
    var d = this;
    for (var y = 0; y < t.itemNum; ++y) {
      r();
    }
    if (t.itemId == s.GOLD) {
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/coin_001", $10HomeEnum.Bundles.RES);
    } else {
      t.itemId != s.DIAMOND && t.itemId != s.Star || $10AudioManager.AudioManager.instance.playEffectPath("sounds/diamod_001", $10HomeEnum.Bundles.RES);
    }
    $10AnimUtils.AnimUtil.flyItemAnim(a, 35, i, n, 20, function () {
      a.forEach(function (t) {
        $10NodePoolManager.default.instance.putNode(t);
      });
      t.onComplete && t.onComplete();
    });
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "pFlyItem", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "endNode1", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "endNode2", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "endNode3", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "endNode4", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_FlyItemAnimCtrl2;