var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_TouchBlocker = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.target = null;
    e.isBlockAll = false;
    e.isPassAll = false;
    e.clickEvent = null;
    e.clickEventCaller = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    this.registerEvent();
  };
  _ctor.prototype.start = function () {
    this.reset();
  };
  _ctor.prototype.onDestroy = function () {
    this.unregisterEvent();
  };
  _ctor.prototype.registerEvent = function () {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchEvent, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchEvent, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEvent, this);
  };
  _ctor.prototype.unregisterEvent = function () {
    this.node.targetOff(this);
  };
  _ctor.prototype.reset = function () {
    this.setSwallowTouches(false);
  };
  _ctor.prototype.onTouchEvent = function (t) {
    var e = this;
    if (e.isPassAll) {
      e.target && e.target.activeInHierarchy && e.target.getBoundingBoxToWorld().contains(t.getLocation()) && t.type == cc.Node.EventType.TOUCH_END && e.clickEvent && e.clickEvent.call(e.clickEventCaller);
    } else {
      if (e.isBlockAll) {
        if (null == this.target && t.type == cc.Node.EventType.TOUCH_END) {
          return void (e.clickEvent && e.clickEvent.call(e.clickEventCaller));
        } else {
          return void t.stopPropagationImmediate();
        }
      }
      if (e.target && e.target.activeInHierarchy) {
        if (e.target.getBoundingBoxToWorld().contains(t.getLocation())) {
          t.type == cc.Node.EventType.TOUCH_END && e.clickEvent && e.clickEvent.call(e.clickEventCaller);
        } else {
          t.stopPropagationImmediate();
        }
      } else {
        this.node.active = false;
      }
    }
  };
  _ctor.prototype.blockAll = function () {
    this.isBlockAll = true;
    this.isPassAll = false;
  };
  _ctor.prototype.passAll = function () {
    this.isPassAll = true;
    this.isBlockAll = false;
  };
  _ctor.prototype.setTarget = function (t) {
    this.target = t;
    this.isBlockAll = false;
    this.isPassAll = false;
  };
  _ctor.prototype.setSwallowTouches = function (t) {
    var e = this.node;
    e._touchListener && e._touchListener.setSwallowTouches(t);
  };
  _ctor.prototype.setClickTargetEvent = function (t, e) {
    this.clickEvent = t;
    this.clickEventCaller = e;
  };
  cc__decorate([ccp_property({
    type: cc.Node,
    // tooltip: false
  })], _ctor.prototype, "target", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_TouchBlocker;