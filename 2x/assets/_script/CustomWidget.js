var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomWidget = undefined;
var $10AppBase = require("AppBase");
var $10ComponentBase = require("ComponentBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_menu = cc__decorator.menu;
var ccp_requireComponent = cc__decorator.requireComponent;
var exp_CustomWidget = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.bar = false;
    e.customMargin = false;
    e.margin = 0;
    e.delay = false;
    e.delayTime = 1;
    e._borderMargin = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
    var e = cc.view.getFrameSize();
    var o = this.node.getComponent(cc.Widget);
    var i = e.height / e.width;
    this._borderMargin = i > 1 ? o.top : o.left;
    if (this.bar && (i > 2 || i < .5)) {
      var n = $10AppBase.AppBase.getSystemInfoSync();
      var a = n.safeArea;
      var s = n.statusBarHeight;
      0 === s && a && (s = a.top || a.left);
      var c;
      var l = cc.winSize;
      c = i > 1 ? s / e.height * l.height : s / e.width * l.width;
      if (this.customMargin) {
        this._borderMargin = this.margin + c;
      } else {
        this._borderMargin += c;
      }
      this.setWidget();
    } else {
      this.bar = false;
    }
  };
  _ctor.prototype.onEnable = function () {
    t.prototype.onEnable.call(this);
    if (this.bar) {
      if (this.delay) {
        this.scheduleOnce(this.setWidget, this.delayTime);
      } else {
        this.setWidget();
      }
    }
  };
  _ctor.prototype.setWidget = function () {
    var t = this.node.getComponent(cc.Widget);
    var e = cc.view.getFrameSize();
    if (e.height / e.width > 1) {
      t.top = this._borderMargin;
    } else {
      t.left = this._borderMargin;
    }
    t.updateAlignment();
  };
  cc__decorate([ccp_property({
    tooltip: "是否开启刘海屏适配"
  })], _ctor.prototype, "bar", undefined);
  cc__decorate([ccp_property({
    tooltip: "自定义顶边距"
  })], _ctor.prototype, "customMargin", undefined);
  cc__decorate([ccp_property({
    tooltip: "自定义定边距的距离",
    visible: function () {
      return this.customMargin;
    }
  })], _ctor.prototype, "margin", undefined);
  cc__decorate([ccp_property({
    tooltip: "是否延迟适配"
  })], _ctor.prototype, "delay", undefined);
  cc__decorate([ccp_property({
    type: cc.Float,
    tooltip: "延迟适配的时间",
    visible: function () {
      return this.delay;
    }
  })], _ctor.prototype, "delayTime", undefined);
  return cc__decorate([ccp_ccclass, ccp_requireComponent(cc.Widget), ccp_menu("自定义组件/widget")], _ctor);
}($10ComponentBase.ComponentBase);
exports.CustomWidget = exp_CustomWidget;