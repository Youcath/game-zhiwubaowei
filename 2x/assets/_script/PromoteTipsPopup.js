var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10PopupBase = require("PopupBase");
var $10GameEnum = require("GameEnum");
var $10RedDotMgr = require("RedDotMgr");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PromoteTipsPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mShopItem = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    this.mShopItem.active = $10RedDotMgr.default.instance.getPlantRedIsShow();
  };
  _ctor.prototype.onItemClick = function (t, e) {
    $10EventManager.EventManager.instance.emit($10GameEnum.EGameEvent.OPEN_HOME_VIEW, Number(e));
    this.removeUI();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mShopItem", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_PromoteTipsPopup;