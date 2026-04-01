var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameComponent = undefined;
var $10ComponentBase = require("ComponentBase");
var $10TimeUtil = require("TimeUtil");
var $10AppBase = require("AppBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var exp_GameComponent = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.debugArea = 200;
    e.multiTouchCount = 0;
    e.multiTouchTime = 0;
    e.clickRect = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
    cc.game.addPersistRootNode(this.node);
    $10AppBase.AppBase.onShow(this.onShow);
    $10AppBase.AppBase.onHide(this.onHide);
  };
  _ctor.prototype.start = function () {
    t.prototype.start.call(this);
    this.clickRect = cc.rect(0, cc.winSize.height - this.debugArea, cc.winSize.width, this.debugArea);
  };
  _ctor.prototype.onDestroy = function () {
    $10AppBase.AppBase.offShow(this.onShow);
    $10AppBase.AppBase.offHide(this.onHide);
    t.prototype.onDestroy.call(this);
  };
  _ctor.prototype.onShow = function () {};
  _ctor.prototype.onHide = function () {};
  _ctor.prototype.showDebugInfo = function () {
    var t = $10TimeUtil.TimeUtil.getTime();
    0 != this.multiTouchTime && t - this.multiTouchTime > 1e3 && (this.multiTouchCount = 0);
    this.multiTouchTime = t;
    this.multiTouchCount++;
    this.multiTouchCount < 10 || (this.multiTouchCount = 0);
  };
  cc__decorate([ccp_property()], _ctor.prototype, "debugArea", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComponentBase.ComponentBase);
exports.GameComponent = exp_GameComponent;