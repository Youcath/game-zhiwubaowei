var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var ccp_menu = cc__decorator.menu;
var def_UniformScale = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    this.node.scale = cc.view.getVisibleSize().width / this.node.width;
  };
  return cc__decorate([ccp_ccclass, ccp_menu("自定义组件/等比适配")], _ctor);
}(cc.Component);
exports.default = def_UniformScale;