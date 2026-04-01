Object.defineProperty(exports, "__esModule", {
  value: true
});
var def_SimplyVec2 = function () {
  function _ctor(t, e) {
    undefined === t && (t = 0);
    undefined === e && (e = 0);
    this.x = 0;
    this.y = 0;
    this.x = t;
    this.y = e;
  }
  _ctor.ccVec2To = function (e) {
    return new _ctor(e.x, e.y);
  };
  _ctor.dot = function (t, e) {
    return t.x * e.x + t.y * e.y;
  };
  _ctor.subtract = function (t, e, o) {
    t.x = e.x - o.x;
    t.y = e.y - o.y;
    return t;
  };
  _ctor.distance = function (t, e) {
    var o = e.x - t.x;
    var i = e.y - t.y;
    return Math.sqrt(o * o + i * i);
  };
  _ctor.squaredDistance = function (t, e) {
    var o = e.x - t.x;
    var i = e.y - t.y;
    return o * o + i * i;
  };
  _ctor.prototype.set = function (t, e) {
    this.x = t;
    this.y = e;
    return this;
  };
  _ctor.prototype.add = function (e, o) {
    (o = o || new _ctor()).x = this.x + e.x;
    o.y = this.y + e.y;
    return o;
  };
  _ctor.prototype.sub = function (e, o) {
    return _ctor.subtract(o || new _ctor(), this, e);
  };
  _ctor.prototype.lengthSqr = function () {
    return this.x * this.x + this.y * this.y;
  };
  _ctor.prototype.rotate = function (e, o) {
    (o = o || new _ctor()).x = this.x;
    o.y = this.y;
    return o.rotateSelf(e);
  };
  _ctor.prototype.rotateSelf = function (t) {
    var e = Math.sin(t);
    var o = Math.cos(t);
    var i = this.x;
    this.x = o * i - e * this.y;
    this.y = e * i + o * this.y;
    return this;
  };
  _ctor.prototype.clone = function () {
    return new _ctor(this.x, this.y);
  };
  return _ctor;
}();
exports.default = def_SimplyVec2;