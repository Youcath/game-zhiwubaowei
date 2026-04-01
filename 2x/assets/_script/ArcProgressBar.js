var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArcProgressBar = undefined;
var $10MathUtil = require("MathUtil");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_requireComponent = cc__decorator.requireComponent;
var ccp_executeInEditMode = cc__decorator.executeInEditMode;
cc__decorator.help;
cc__decorator.menu;
var exp_ArcProgressBar = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.graphics = null;
    e._radius = 100;
    e._clockwise = true;
    e._startAngle = 90;
    e._range = 180;
    e._lineWidth = 20;
    e._progress = .4;
    e._lineCap = cc.Graphics.LineCap.ROUND;
    e._backgroundColor = new cc.Color(255, 255, 255, 255);
    e._progressColor = new cc.Color(50, 101, 246, 255);
    e.curStartAngle = 0;
    e.curStartRadians = 0;
    e.curEndRadians = 0;
    e.curTween = null;
    e.curTweenRes = null;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "radius", {
    get: function () {
      return this._radius;
    },
    set: function (t) {
      this._radius = t;
      this.updateProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "clockwise", {
    get: function () {
      return this._clockwise;
    },
    set: function (t) {
      this._clockwise = t;
      this.updateProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "startAngle", {
    get: function () {
      return this._startAngle;
    },
    set: function (t) {
      this._startAngle = t;
      this.updateProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "range", {
    get: function () {
      return this._range;
    },
    set: function (t) {
      this._range = t;
      this.updateProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "lineWidth", {
    get: function () {
      return this._lineWidth;
    },
    set: function (t) {
      this._lineWidth = t;
      this.updateProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "progress", {
    get: function () {
      return this._progress;
    },
    set: function (t) {
      this.updateProgress(t);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "lineCap", {
    get: function () {
      return this._lineCap;
    },
    set: function (t) {
      this._lineCap = t;
      this.updateProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "backgroundColor", {
    get: function () {
      return this._backgroundColor;
    },
    set: function (t) {
      this._backgroundColor = t;
      this.updateProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "progressColor", {
    get: function () {
      return this._progressColor;
    },
    set: function (t) {
      this._progressColor = t;
      this.updateProperties();
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    this.init();
  };
  _ctor.prototype.resetInEditor = function () {
    this.init();
  };
  _ctor.prototype.init = function () {
    this.graphics || (this.graphics = this.getComponent(cc.Graphics));
    this.updateProperties();
  };
  _ctor.prototype.show = function () {
    var t = this;
    return new Promise(function (e) {
      var o = t.graphics.node;
      o.opacity = 0;
      o.active = true;
      cc.tween(o).to(.1, {
        opacity: 255
      }).call(e).start();
    });
  };
  _ctor.prototype.hide = function () {
    var t = this;
    return new Promise(function (e) {
      var o = t.graphics.node;
      cc.tween(o).to(.1, {
        opacity: 0
      }).set({
        active: false
      }).call(e).start();
    });
  };
  _ctor.prototype.updateProperties = function () {
    var t = this.graphics;
    t.lineWidth = this._lineWidth;
    t.lineCap = this._lineCap;
    this.curStartAngle = this._startAngle + 90;
    this.curStartRadians = $10MathUtil.MathUtil.angle2Radians(this.curStartAngle);
    var e = this.curStartAngle + (this._clockwise ? -this._range : this._range);
    this.curEndRadians = $10MathUtil.MathUtil.angle2Radians(e);
    this.updateProgress(this._progress);
  };
  _ctor.prototype.updateProgress = function (t) {
    if (t < 0) {
      t = 0;
    } else {
      t > 1 && (t = 1);
    }
    this._progress = t;
    var e = this.graphics;
    e.clear();
    e.strokeColor = this._backgroundColor;
    e.arc(0, 0, this._radius, this.curStartRadians, this.curEndRadians, !this._clockwise);
    e.stroke();
    var o = this._clockwise ? -this._range : this._range;
    var i = this.curStartAngle + o * t;
    var n = $10MathUtil.MathUtil.angle2Radians(i);
    e.strokeColor = this._progressColor;
    e.arc(0, 0, this._radius, this.curStartRadians, n, !this._clockwise);
    e.stroke();
  };
  _ctor.prototype.to = function (t, e) {
    var o = this;
    return new Promise(function (i) {
      o.stop();
      o.curTweenRes = i;
      o.curTween = cc.tween(o).to(t, {
        progress: e
      }).call(function () {
        o.curTween = null;
        o.curTweenRes = null;
      }).call(i).start();
    });
  };
  _ctor.prototype.stop = function () {
    if (this.curTween) {
      this.curTween.stop();
      this.curTween = null;
    }
    if (this.curTweenRes) {
      this.curTweenRes();
      this.curTweenRes = null;
    }
  };
  cc__decorate([ccp_property(cc.Graphics)], _ctor.prototype, "graphics", undefined);
  cc__decorate([ccp_property()], _ctor.prototype, "_radius", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "radius", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_clockwise", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "clockwise", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_startAngle", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "startAngle", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_range", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "range", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_lineWidth", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "lineWidth", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_progress", undefined);
  cc__decorate([ccp_property({
    range: [0, 1],
    step: .01,
    // tooltip: false
  })], _ctor.prototype, "progress", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_lineCap", undefined);
  cc__decorate([ccp_property({
    type: cc.Graphics.LineCap,
    // tooltip: false
  })], _ctor.prototype, "lineCap", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_backgroundColor", undefined);
  cc__decorate([ccp_property({
    type: cc.Color,
    // tooltip: false
  })], _ctor.prototype, "backgroundColor", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_progressColor", undefined);
  cc__decorate([ccp_property({
    type: cc.Color,
    // tooltip: false
  })], _ctor.prototype, "progressColor", null);
  return cc__decorate([ccp_ccclass, ccp_requireComponent(cc.Graphics), ccp_executeInEditMode], _ctor);
}(cc.Component);
exports.ArcProgressBar = exp_ArcProgressBar;