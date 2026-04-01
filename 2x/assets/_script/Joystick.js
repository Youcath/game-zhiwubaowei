var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JoystickEvent = undefined;
var r;
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EventManager = require("EventManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_menu = cc__decorator.menu;
(function (t) {
  t.TOUCH_BEGIN = "Joystic_TOUCH_BEGIN";
  t.TOUCH_MOVED = "Joystic_TOUCH_MOVED";
  t.TOUCH_ENDED = "Joystic_TOUCH_ENDED";
})(r = exports.JoystickEvent || (exports.JoystickEvent = {}));
var def_Joystick = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.nControlDot = null;
    e._radian = 0;
    e._vec2 = null;
    e._power = 0;
    e._isMovable = false;
    e._initPos = null;
    e.isTouchJoystick = false;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "radian", {
    get: function () {
      return this._radian;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "moveVec", {
    get: function () {
      return this._vec2;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "power", {
    get: function () {
      return this._power;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isMovable", {
    get: function () {
      return this._isMovable;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    var t;
    var e = this;
    e.node.parent.on(cc.Node.EventType.TOUCH_START, e.onTouchStart, e);
    e.node.parent.on(cc.Node.EventType.TOUCH_MOVE, e.onTouchMove, e);
    e.node.parent.on(cc.Node.EventType.TOUCH_END, e.onTouchEnd, e);
    e.node.parent.on(cc.Node.EventType.TOUCH_CANCEL, e.onTouchEnd, e);
    null === (t = e.node.getComponent(cc.Widget)) || undefined === t || t.updateAlignment();
    e._initPos = e.node.getPosition();
    this.node.active = false;
  };
  _ctor.prototype.onDestroy = function () {
    var t = this;
    t.node.parent.off(cc.Node.EventType.TOUCH_START, t.onTouchStart, t);
    t.node.parent.off(cc.Node.EventType.TOUCH_MOVE, t.onTouchMove, t);
    t.node.parent.off(cc.Node.EventType.TOUCH_END, t.onTouchEnd, t);
    t.node.parent.off(cc.Node.EventType.TOUCH_CANCEL, t.onTouchEnd, t);
  };
  _ctor.prototype.onTouchStart = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      var e = this;
      this.node.active = true;
      e.isTouchJoystick = true;
      var o = e.node.parent.convertToNodeSpaceAR(t.getLocation());
      e.setSafePos(o);
      var i = e.node.convertToNodeSpaceAR(t.getLocation());
      var n = i.len();
      var a = e.node.width / 2;
      e._radian = 0 == i.x && 0 == i.y ? 0 : cc.v2(1, 0).signAngle(i);
      var u = Math.cos(e._radian) * a;
      var p = Math.sin(e._radian) * a;
      this._vec2 = cc.v2(0, 0);
      e.nControlDot.setPosition(a > n ? i : cc.v2(u, p));
      this._power = Math.min(n, a) / a;
      e._isMovable = true;
      $10EventManager.EventManager.instance.emit(r.TOUCH_BEGIN, this._vec2);
    }
  };
  _ctor.prototype.onTouchMove = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      var e = this;
      var o = e.node.convertToNodeSpaceAR(t.getLocation());
      var i = o.len();
      var n = e.node.width / 2;
      e._radian = 0 == o.x && 0 == o.y ? 0 : cc.v2(1, 0).signAngle(o);
      var a = Math.cos(e._radian) * n;
      var r = Math.sin(e._radian) * n;
      this._vec2 = cc.v2(Math.cos(this._radian), Math.sin(this._radian));
      e.nControlDot.setPosition(n > i ? o : cc.v2(a, r));
      this._power = Math.min(i, n) / n;
    }
  };
  _ctor.prototype.onTouchEnd = function () {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      this.nControlDot.setPosition(cc.v2(0, 0));
      this._vec2 = cc.v2(0, 0);
      this._isMovable = false;
      this._power = 0;
      this.isTouchJoystick = false;
      this.node.active = false;
      $10EventManager.EventManager.instance.emit(r.TOUCH_ENDED, this._vec2);
    }
  };
  _ctor.prototype.setSafePos = function (t) {
    var e = this;
    var o = e.node.width / 2;
    var i = e.node.height / 2;
    var n = e.node.parent.width - o;
    var a = e.node.parent.height - i;
    if (t.x < o) {
      t.x = o;
    } else {
      t.x > n && (t.x = n);
    }
    if (t.y < i) {
      t.y = i;
    } else {
      t.y > a && (t.y = a);
    }
    e.node.setPosition(t);
  };
  _ctor.prototype.update = function (t) {
    this.updateKeyCode();
    this.isTouchJoystick && $10EventManager.EventManager.instance.emit(r.TOUCH_MOVED, this._vec2, t);
  };
  _ctor.prototype.updateKeyCode = function () {};
  _ctor.prototype.stopTouch = function () {
    var t = this;
    t.setSafePos(this._initPos);
    t.nControlDot.setPosition(cc.v2(0, 0));
    t._isMovable = false;
    t.isTouchJoystick = false;
    this._power = 1;
    t.node.pauseSystemEvents(true);
  };
  cc__decorate([ccp_property({
    type: cc.Node,
    tooltip: "摇杆控制点"
  })], _ctor.prototype, "nControlDot", undefined);
  return cc__decorate([ccp_ccclass, ccp_menu("Utils/Compoments/Joystick")], _ctor);
}(cc.Component);
exports.default = def_Joystick;