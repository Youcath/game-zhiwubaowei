Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyVec2 = require("SimplyVec2");
var def_SimplyCollisionDetector = function () {
  function _ctor() {}
  _ctor.isCollisionCircleToCircle = function (t, e) {
    return $10SimplyVec2.default.squaredDistance(t.center, e.center) <= (t.radius + e.radius) * (t.radius + e.radius);
  };
  _ctor.isCollisionRectToCircle = function (t, e) {
    var o = t.center;
    var n = t.a3;
    var a = t.rotation;
    var r = e.radius;
    var s = e.center;
    if (a % 360 != 0) {
      var c = s.sub(o);
      s = o.add(c.rotate(-1 * t.radian));
    }
    var l = n.sub(o);
    var u = new $10SimplyVec2.default(Math.abs(s.x - o.x), Math.abs(s.y - o.y));
    return new $10SimplyVec2.default(Math.max(u.x - l.x, 0), Math.max(u.y - l.y, 0)).lengthSqr() <= r * r;
  };
  _ctor.isCollisionRectToRect = function (e, o) {
    if (e.rotation % 360 != 0 || o.rotation % 360 != 0) {
      return _ctor.isCollisionOBBRectToRect(e, o);
    } else {
      return _ctor.isCollisionAABBRectToRect(e, o);
    }
  };
  _ctor.isCollisionAABBRectToRect = function (t, e) {
    return t.intersects(e);
  };
  _ctor.isCollisionOBBRectToRect = function (e, o) {
    var i = e.rAxisX;
    var n = e.rAxisY;
    var a = o.rAxisX;
    var r = o.rAxisY;
    return !!(_ctor.rectCross(e, o, i) && _ctor.rectCross(e, o, n) && _ctor.rectCross(e, o, a) && _ctor.rectCross(e, o, r));
  };
  _ctor.rectCross = function (t, e, o) {
    var n = t.rVertexs.map(function (t) {
      return $10SimplyVec2.default.dot(t, o);
    }).sort(function (t, e) {
      return t - e;
    });
    var a = e.rVertexs.map(function (t) {
      return $10SimplyVec2.default.dot(t, o);
    }).sort(function (t, e) {
      return t - e;
    });
    var r = n[0];
    var s = n[n.length - 1];
    var c = a[0];
    var l = a[a.length - 1];
    return s >= c && l >= r;
  };
  _ctor.isCollisionPointToCircle = function (t, e) {
    return $10SimplyVec2.default.distance(t, e.center) <= e.radius;
  };
  _ctor.isCollisionPointToRect = function (t, e) {
    var o = e.center;
    if (e.rotation % 360 != 0) {
      var i = t.sub(o);
      t = o.add(i.rotate(-1 * e.radian));
    }
    return e.contains(t);
  };
  return _ctor;
}();
exports.default = def_SimplyCollisionDetector;