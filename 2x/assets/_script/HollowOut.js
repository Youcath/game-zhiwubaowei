var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__awaiter = __awaiter;
var cc__generator = __generator;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HollowOutShape = undefined;
var c;
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_requireComponent = cc__decorator.requireComponent;
var ccp_executeInEditMode = cc__decorator.executeInEditMode;
var ccp_disallowMultiple = cc__decorator.disallowMultiple;
var ccp_executionOrder = cc__decorator.executionOrder;
(function (t) {
  t[t.Rect = 1] = "Rect";
  t[t.Circle = 2] = "Circle";
})(c = exports.HollowOutShape || (exports.HollowOutShape = {}));
var def_HollowOut = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._effect = null;
    e._shape = c.Rect;
    e._center = cc.v2();
    e._width = 300;
    e._height = 300;
    e._round = 1;
    e._radius = 200;
    e._feather = .5;
    e.sprite = null;
    e.material = null;
    e.tweenRes = null;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "effect", {
    get: function () {
      return this._effect;
    },
    set: function (t) {
      this._effect = t;
      this.init();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "shape", {
    get: function () {
      return this._shape;
    },
    set: function (t) {
      this._shape = t;
      this.updateProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "center", {
    get: function () {
      return this._center;
    },
    set: function (t) {
      this._center = t;
      this.updateProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "width", {
    get: function () {
      return this._width;
    },
    set: function (t) {
      this._width = t;
      this.updateProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "height", {
    get: function () {
      return this._height;
    },
    set: function (t) {
      this._height = t;
      this.updateProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "round", {
    get: function () {
      return this._round;
    },
    set: function (t) {
      this._round = t;
      this.updateProperties();
    },
    enumerable: false,
    configurable: true
  });
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
  Object.defineProperty(_ctor.prototype, "feather", {
    get: function () {
      return this._feather;
    },
    set: function (t) {
      this._feather = t;
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
    return cc__awaiter(this, undefined, undefined, function () {
      var t;
      return cc__generator(this, function () {
        if (this._effect) {
          return (t = this.sprite = this.node.getComponent(cc.Sprite)).spriteFrame && (t.spriteFrame.getTexture().packable = false), this.material = cc.Material.create(this._effect), t.setMaterial(0, this.material), this.updateProperties(), [2];
        } else {
          return [2];
        }
      });
    });
  };
  _ctor.prototype.updateProperties = function () {
    switch (this._shape) {
      case c.Rect:
        this.rect(this._center, this._width, this._height, this._round, this._feather);
        break;
      case c.Circle:
        this.circle(this._center, this._radius, this._feather);
    }
  };
  _ctor.prototype.rect = function (t, e, o, i, n) {
    this._shape = c.Rect;
    null != t && (this._center = t);
    null != e && (this._width = e);
    null != o && (this._height = o);
    if (null != i) {
      this._round = i >= 0 ? i : 0;
      var a = Math.min(this._width / 2, this._height / 2);
      this._round = this._round <= a ? this._round : a;
    }
    if (null != n) {
      this._feather = n >= 0 ? n : 0;
      this._feather = this._feather <= this._round ? this._feather : this._round;
    }
    var r = this.material;
    r.setProperty("size", this.getNodeSize());
    r.setProperty("center", this.getCenter(this._center));
    r.setProperty("width", this.getWidth(this._width));
    r.setProperty("height", this.getHeight(this._height));
    r.setProperty("round", this.getRound(this._round));
    r.setProperty("feather", this.getFeather(this._feather));
  };
  _ctor.prototype.circle = function (t, e, o) {
    this._shape = c.Circle;
    null != t && (this._center = t);
    null != e && (this._radius = e);
    null != o && (this._feather = o >= 0 ? o : 0);
    var i = this.material;
    i.setProperty("size", this.getNodeSize());
    i.setProperty("center", this.getCenter(this._center));
    i.setProperty("width", this.getWidth(2 * this._radius));
    i.setProperty("height", this.getHeight(2 * this._radius));
    i.setProperty("round", this.getRound(this._radius));
    i.setProperty("feather", this.getFeather(this._feather));
  };
  _ctor.prototype.rectTo = function (t, e, o, i, n, a) {
    var r = this;
    undefined === n && (n = 0);
    undefined === a && (a = 0);
    return new Promise(function (s) {
      r._shape = c.Rect;
      cc.Tween.stopAllByTarget(r);
      r.unscheduleAllCallbacks();
      r.tweenRes && r.tweenRes();
      r.tweenRes = s;
      n = Math.min(n, o / 2, i / 2);
      a = Math.min(a, n);
      cc.tween(r).to(t, {
        center: e,
        width: o,
        height: i,
        round: n,
        feather: a
      }).call(function () {
        r.scheduleOnce(function () {
          if (r.tweenRes) {
            r.tweenRes();
            r.tweenRes = null;
          }
        });
      }).start();
    });
  };
  _ctor.prototype.circleTo = function (t, e, o, i) {
    var n = this;
    undefined === i && (i = 0);
    return new Promise(function (a) {
      n._shape = c.Circle;
      cc.Tween.stopAllByTarget(n);
      n.unscheduleAllCallbacks();
      n.tweenRes && n.tweenRes();
      n.tweenRes = a;
      cc.tween(n).to(t, {
        center: e,
        radius: o,
        feather: i
      }).call(function () {
        n.scheduleOnce(function () {
          if (n.tweenRes) {
            n.tweenRes();
            n.tweenRes = null;
          }
        });
      }).start();
    });
  };
  _ctor.prototype.reset = function () {
    this.rect(cc.v2(), 0, 0, 0, 0);
  };
  _ctor.prototype.setNodeSize = function () {
    var t = this.node;
    var e = t.width;
    var o = t.height;
    this._radius = Math.sqrt(Math.pow(e, 2) + Math.pow(o, 2)) / 2;
    this.rect(t.getPosition(), e, o, 0, 0);
  };
  _ctor.prototype.getCenter = function (t) {
    var e = this.node;
    var o = e.width;
    var i = e.height;
    var n = (t.x + o / 2) / o;
    var a = (-t.y + i / 2) / i;
    return cc.v2(n, a);
  };
  _ctor.prototype.getNodeSize = function () {
    return cc.v2(this.node.width, this.node.height);
  };
  _ctor.prototype.getWidth = function (t) {
    return t / this.node.width;
  };
  _ctor.prototype.getHeight = function (t) {
    return t / this.node.width;
  };
  _ctor.prototype.getRound = function (t) {
    return t / this.node.width;
  };
  _ctor.prototype.getFeather = function (t) {
    return t / this.node.width;
  };
  cc__decorate([ccp_property], _ctor.prototype, "_effect", undefined);
  cc__decorate([ccp_property({
    type: cc.EffectAsset,
    // tooltip: false,
    readonly: true
  })], _ctor.prototype, "effect", null);
  cc__decorate([ccp_property], _ctor.prototype, "_shape", undefined);
  cc__decorate([ccp_property({
    type: cc.Enum(c),
    // tooltip: false
  })], _ctor.prototype, "shape", null);
  cc__decorate([ccp_property], _ctor.prototype, "_center", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "center", null);
  cc__decorate([ccp_property], _ctor.prototype, "_width", undefined);
  cc__decorate([ccp_property({
    // tooltip: false,
    visible: function () {
      return this._shape === c.Rect;
    }
  })], _ctor.prototype, "width", null);
  cc__decorate([ccp_property], _ctor.prototype, "_height", undefined);
  cc__decorate([ccp_property({
    // tooltip: false,
    visible: function () {
      return this._shape === c.Rect;
    }
  })], _ctor.prototype, "height", null);
  cc__decorate([ccp_property], _ctor.prototype, "_round", undefined);
  cc__decorate([ccp_property({
    // tooltip: false,
    visible: function () {
      return this._shape === c.Rect;
    }
  })], _ctor.prototype, "round", null);
  cc__decorate([ccp_property], _ctor.prototype, "_radius", undefined);
  cc__decorate([ccp_property({
    // tooltip: false,
    visible: function () {
      return this._shape === c.Circle;
    }
  })], _ctor.prototype, "radius", null);
  cc__decorate([ccp_property], _ctor.prototype, "_feather", undefined);
  cc__decorate([ccp_property({
    // tooltip: false,
    visible: function () {
      return this._shape === c.Circle || this.round > 0;
    }
  })], _ctor.prototype, "feather", null);
  return cc__decorate([ccp_ccclass, ccp_requireComponent(cc.Sprite), ccp_executeInEditMode, ccp_disallowMultiple, ccp_executionOrder(-10)], _ctor);
}(cc.Component);
exports.default = def_HollowOut;