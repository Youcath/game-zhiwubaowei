var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PopupBase = require("PopupBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_UIReport = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.root = null;
    e.btnClose = null;
    e.btnPublicity = null;
    e.btnDataloss = null;
    e.btnGameStuck = null;
    e.btnunableAD = null;
    e.btnRender = null;
    e.tips = null;
    e.editBox = null;
    e.Rendernum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.start = function () {
    this.initEvent();
  };
  _ctor.prototype.initEvent = function () {
    var t = this;
    this.btnClose.on(cc.Node.EventType.TOUCH_END, function () {
      t.removeUI();
    }, this);
    this.btnPublicity.on(cc.Node.EventType.TOUCH_END, function () {
      t.btnPublicity.children[0].active = !t.btnPublicity.children[0].active;
      t.Radio(1);
      t.canRender();
    }, this);
    this.btnDataloss.on(cc.Node.EventType.TOUCH_END, function () {
      t.btnDataloss.children[0].active = !t.btnDataloss.children[0].active;
      t.Radio(2);
      t.canRender();
    }, this);
    this.btnGameStuck.on(cc.Node.EventType.TOUCH_END, function () {
      t.btnGameStuck.children[0].active = !t.btnGameStuck.children[0].active;
      t.Radio(3);
      t.canRender();
    }, this);
    this.btnunableAD.on(cc.Node.EventType.TOUCH_END, function () {
      t.btnunableAD.children[0].active = !t.btnunableAD.children[0].active;
      t.Radio(4);
      t.canRender();
    }, this);
    this.btnRender.on(cc.Node.EventType.TOUCH_END, function () {
      t.Render();
    }, this);
  };
  _ctor.prototype.canRender = function () {
    if (this.btnPublicity.children[0].active || this.btnDataloss.children[0].active || this.btnGameStuck.children[0].active || this.btnunableAD.children[0].active) {
      this.btnRender.active = true;
    } else {
      this.btnRender.active = false;
    }
  };
  _ctor.prototype.Radio = function (t) {
    for (var e = 1; e < 5; e++) {
      e != t && (this.root.children[e].children[0].active = false);
    }
  };
  _ctor.prototype.Render = function () {
    for (var t = 1; t < 5; t++) {
      if (this.root.children[t].children[0].active) {
        this.root.children[t].children[0].active = false;
        this.btnRender.active = false;
      }
    }
    this.tips.active = true;
    cc.tween(this.tips).to(1, {
      y: 143.079
    }).start();
    this.scheduleOnce(this.removeUI, 1);
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "root", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "btnClose", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "btnPublicity", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "btnDataloss", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "btnGameStuck", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "btnunableAD", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "btnRender", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "tips", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "editBox", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_UIReport;