var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BgFit = exports.ZSFullFitType = undefined;
var r;
var $10ComponentBase = require("ComponentBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_menu = cc__decorator.menu;
(function (t) {
  t[t.ALL = 0] = "ALL";
  t[t.WIDTH = 1] = "WIDTH";
  t[t.HEIGHT = 2] = "HEIGHT";
})(r = exports.ZSFullFitType || (exports.ZSFullFitType = {}));
var exp_BgFit = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.fitType = r.ALL;
    e.fit = true;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    var t = cc.winSize;
    var e = 1;
    var o = 1;
    r.WIDTH !== this.fitType && r.ALL !== this.fitType || (e = t.width / this.node.width);
    r.HEIGHT !== this.fitType && r.ALL !== this.fitType || (o = t.height / this.node.height);
    if (this.fit) {
      this.node.scale = Math.max(e, o);
    } else {
      this.node.scaleX = e;
      this.node.scaleY = o;
    }
  };
  cc__decorate([ccp_property({
    type: cc.Enum(r),
    tooltip: "适配模式"
  })], _ctor.prototype, "fitType", undefined);
  cc__decorate([ccp_property({
    tooltip: "是否等比缩放"
  })], _ctor.prototype, "fit", undefined);
  return cc__decorate([ccp_ccclass, ccp_menu("自定义组件/背景适配")], _ctor);
}($10ComponentBase.ComponentBase);
exports.BgFit = exp_BgFit;