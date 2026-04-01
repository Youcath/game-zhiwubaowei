var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_LayoutAdaptive = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.start = function () {
    var t = this.node.getComponent(cc.Layout);
    var e = this.node.getComponent(cc.Widget);
    var o = this.node.width;
    t.resizeMode = cc.Layout.ResizeMode.NONE;
    e.updateAlignment();
    var i = this.node.width - o;
    var n = this.node.childrenCount;
    t.spacingX += i / (n - 1);
    e.enabled = false;
    t.resizeMode = cc.Layout.ResizeMode.CONTAINER;
    t.updateLayout();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_LayoutAdaptive;