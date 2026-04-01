var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomToggle = undefined;
(function () {
  if (cc.Toggle) {
    var t = cc.Toggle.prototype._updateCheckMark;
    cc.Toggle.prototype._updateCheckMark = function () {
      var e;
      t.call(this);
      var o = null === (e = this.node) || undefined === e ? undefined : e.getComponent("CustomToggle");
      o && o.updateCheckMark(this);
    };
  }
})();
var $10ComponentBase = require("ComponentBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_menu = cc__decorator.menu;
var ccp_requireComponent = cc__decorator.requireComponent;
var exp_CustomToggle = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.unCheckMark = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.updateCheckMark = function (t) {
    this.unCheckMark && (this.unCheckMark.active = !t.isChecked);
  };
  cc__decorate([ccp_property({
    type: cc.Node
  })], _ctor.prototype, "unCheckMark", undefined);
  return cc__decorate([ccp_ccclass, ccp_requireComponent(cc.Toggle), ccp_menu("自定义组件/Toggle")], _ctor);
}($10ComponentBase.ComponentBase);
exports.CustomToggle = exp_CustomToggle;