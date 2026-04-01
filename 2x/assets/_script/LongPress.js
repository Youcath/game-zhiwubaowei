var i;
var n;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TriggerWay = exports.LONG_PRESS = undefined;
exports.LONG_PRESS = "longpress";
(function (t) {
  t[t.Immediately = 1] = "Immediately";
  t[t.AfterLoosing = 2] = "AfterLoosing";
  t[t.Duration = 3] = "Duration";
})(n = exports.TriggerWay || (exports.TriggerWay = {}));
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_menu = cc__decorator.menu;
var def_LongPress = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.triggerTime = 2;
    e.trggerDelayTime = .05;
    e.trggerWay = n.Immediately;
    e.longPressEvents = [];
    e.hasAccomplished = false;
    e._isComplateLongPress = false;
    e.durationTime = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onEnable = function () {
    this._isComplateLongPress = false;
    this.registerNodeEvent();
    this.unscheduleAllCallbacks();
  };
  _ctor.prototype.onDisable = function () {
    this._isComplateLongPress = false;
    this.unregisterNodeEvent();
    this.unscheduleAllCallbacks();
  };
  _ctor.prototype.registerNodeEvent = function () {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
  };
  _ctor.prototype.unregisterNodeEvent = function () {
    this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
  };
  _ctor.prototype.onTouchStart = function () {
    this.durationTime = 0;
    this.hasAccomplished = false;
    this._isComplateLongPress = false;
    this.scheduleOnce(this.onPressAccomplished.bind(this), this.triggerTime);
  };
  _ctor.prototype.onTouchEnd = function () {
    if (this.hasAccomplished) {
      this.hasAccomplished = false;
      this.trigger();
    }
    this._isComplateLongPress = false;
    this.unscheduleAllCallbacks();
  };
  _ctor.prototype.onTouchCancel = function () {
    if (this.hasAccomplished) {
      this.hasAccomplished = false;
      this.trigger();
    }
    this._isComplateLongPress = false;
    this.unscheduleAllCallbacks();
  };
  _ctor.prototype.update = function (t) {
    if (this._isComplateLongPress && this.trggerWay == n.Duration) {
      this.durationTime -= t;
      if (this.durationTime <= 0) {
        this.trigger(), this.durationTime = this.trggerDelayTime;
      }
    }
  };
  _ctor.prototype.onPressAccomplished = function () {
    if (this.trggerWay === n.Immediately) {
      this.trigger();
    } else {
      this.trggerWay === n.AfterLoosing && (this.hasAccomplished = true);
    }
    this._isComplateLongPress = true;
  };
  _ctor.prototype.trigger = function () {
    cc.Component.EventHandler.emitEvents(this.longPressEvents, this);
    this.node.emit(exports.LONG_PRESS, this);
  };
  _ctor.prototype.isComplateLongPress = function () {
    return this._isComplateLongPress;
  };
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "triggerTime", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "trggerDelayTime", undefined);
  cc__decorate([ccp_property({
    type: cc.Enum(n),
    // tooltip: false
  })], _ctor.prototype, "trggerWay", undefined);
  cc__decorate([ccp_property({
    type: cc.Component.EventHandler,
    // tooltip: false
  })], _ctor.prototype, "longPressEvents", undefined);
  return cc__decorate([ccp_ccclass, ccp_menu("Utils/Components/LongPress")], _ctor);
}(cc.Component);
exports.default = def_LongPress;