Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RVOMath = exports.KeyValuePair = exports.Line = exports.Obstacle = exports.Vector2 = undefined;
var exp_Vector2 = function () {
  function _ctor(t, e) {
    this.x = 0;
    this.y = 0;
    this.x = t;
    this.y = e;
  }
  _ctor.prototype.plus = function (e) {
    return new _ctor(this.x + e.x, this.y + e.y);
  };
  _ctor.prototype.minus = function (e) {
    return new _ctor(this.x - e.x, this.y - e.y);
  };
  _ctor.prototype.multiply = function (t) {
    return this.x * t.x + this.y * t.y;
  };
  _ctor.prototype.scale = function (e) {
    return new _ctor(this.x * e, this.y * e);
  };
  _ctor.prototype.copy = function (t) {
    this.x = t.x;
    this.y = t.y;
    return this;
  };
  _ctor.prototype.clone = function () {
    return new _ctor(this.x, this.y);
  };
  _ctor.prototype.substract = function (t, e) {
    t.x -= e.x;
    t.y -= e.y;
    return t;
  };
  _ctor.prototype.lengthSqr = function () {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2);
  };
  return _ctor;
}();
exports.Vector2 = exp_Vector2;
exports.Obstacle = function () {};
exports.Line = function () {};
exports.KeyValuePair = function (t, e) {
  this.key = t;
  this.value = e;
};
var exp_RVOMath = function () {
  function t() {}
  t.absSq = function (t) {
    return t.multiply(t);
  };
  t.normalize = function (e) {
    return e.scale(1 / t.abs(e));
  };
  t.distSqPointLineSegment = function (e, o, i) {
    var n = i.minus(e);
    var a = o.minus(e);
    var r = n.multiply(a) / t.absSq(a);
    if (r < 0) {
      return t.absSq(n);
    } else {
      if (r > 1) {
        return t.absSq(i.minus(o));
      } else {
        return t.absSq(i.minus(e.plus(a.scale(r))));
      }
    }
  };
  t.sqr = function (t) {
    return t * t;
  };
  t.det = function (t, e) {
    return t.x * e.y - t.y * e.x;
  };
  t.abs = function (e) {
    return Math.sqrt(t.absSq(e));
  };
  t.leftOf = function (e, o, i) {
    return t.det(e.minus(i), o.minus(e));
  };
  t.RVO_EPSILON = 0;
  return t;
}();
exports.RVOMath = exp_RVOMath;