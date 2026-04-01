var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_ViewGroupNesting = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.events = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchHandle, this, true);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchHandle, this, true);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchHandle, this, true);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchHandle, this, true);
  };
  _ctor.prototype.onTouchHandle = function (t) {
    if (!t.sham && !t.simulate && t.target !== this.node) {
      var e = new cc.Event.EventTouch(t.getTouches(), t.bubbles);
      e.type = t.type;
      e.touch = t.touch;
      e.sham = true;
      this.events.push(e);
    }
  };
  _ctor.prototype.update = function () {
    if (0 !== this.events.length) {
      for (var t = 0; t < this.events.length; t++) {
        this.node.dispatchEvent(this.events[t]);
      }
      this.events.length = 0;
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_ViewGroupNesting;