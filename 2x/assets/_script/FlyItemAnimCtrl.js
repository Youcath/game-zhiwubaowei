var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EFlyItemAnimEvent = undefined;
var r;
var $10HomeEnum = require("HomeEnum");
var $10NodePoolManager = require("NodePoolManager");
var $10Util = require("Util");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
(function (t) {
  t.FLY_ITEM_ANIM = "EFlyItemAnimEvent.fly_item_anim";
})(r = exports.EFlyItemAnimEvent || (exports.EFlyItemAnimEvent = {}));
var def_FlyItemAnimCtrl = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.pFlyItem = null;
    e._layerMap = null;
    e._targetWorldPosMap = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    $10EventManager.EventManager.instance.on(r.FLY_ITEM_ANIM, this.flyItemAnim, this);
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off(r.FLY_ITEM_ANIM, this.flyItemAnim, this);
  };
  _ctor.prototype.init = function (t, e) {
    this._layerMap = t;
    this._targetWorldPosMap = e;
  };
  _ctor.prototype.flyItemAnim = function (t) {
    if (this.node.activeInHierarchy) {
      var e = this._layerMap.get(t.layerType);
      if (e && this._targetWorldPosMap.get(t.itemId)) {
        var o = [];
        var i = function () {
          var i = $10NodePoolManager.default.instance.getNode(n.pFlyItem);
          e.addChild(i, t.isTop ? cc.macro.MAX_ZINDEX : undefined);
          $10ResUtil.ResUtil.loadAsset({
            bundleName: $10HomeEnum.Bundles.GAME,
            path: "",
            type: cc.SpriteFrame
          }).then(function (t) {
            i.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = t;
          }).catch(function () {});
          i.setPosition($10Util.default.nodeLocalPos(e, t.startWorldPos));
          o.push(i);
        };
        var n = this;
        for (var a = 0; a < t.itemNum; ++a) {
          i();
        }
      }
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "pFlyItem", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_FlyItemAnimCtrl;