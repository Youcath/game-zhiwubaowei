Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KdTree = undefined;
var $10Common = require("Common");
var $10Simulator = require("Simulator");
var a = function () {
  function t(t, e) {
    this.a = t;
    this.b = e;
  }
  t.prototype.lessThan = function (t) {
    return this.a < t.a || !(t.a < this.a) && this.b < t.b;
  };
  t.prototype.lessEqualThan = function (t) {
    return this.a == t.a && this.b == t.b || this.lessThan(t);
  };
  t.prototype.bigThan = function (t) {
    return !this.lessEqualThan(t);
  };
  t.prototype.bigEqualThan = function (t) {
    return !this.lessThan(t);
  };
  return t;
}();
var r = function () {};
var s = function () {};
var exp_KdTree = function () {
  function _ctor() {
    this.MAX_LEAF_SIZE = 10;
    this.agents = null;
    this.agentTree = [];
    this.obstacleTree = null;
  }
  _ctor.prototype.buildAgentTree = function (t) {
    if (!this.agents || this.agents.length != t) {
      this.agents = new Array(t);
      for (var e = 0; e < this.agents.length; e++) {
        this.agents[e] = $10Simulator.Simulator.instance.getAgent(e);
      }
      this.agentTree = new Array(2 * this.agents.length);
      for (e = 0; e < this.agentTree.length; e++) {
        this.agentTree[e] = new r();
      }
    }
    0 != this.agents.length && this.buildAgentTreeRecursive(0, this.agents.length, 0);
  };
  _ctor.prototype.buildObstacleTree = function () {
    this.obstacleTree = new s();
    var t = new Array($10Simulator.Simulator.instance.obstacles.length);
    for (var e = 0; e < t.length; e++) {
      t[e] = $10Simulator.Simulator.instance.obstacles[e];
    }
    this.obstacleTree = this.buildObstacleTreeRecursive(t);
  };
  _ctor.prototype.computeAgentNeighbors = function (t, e) {
    return this.queryAgentTreeRecursive(t, e, 0);
  };
  _ctor.prototype.computeObstacleNeighbors = function (t, e) {
    this.queryObstacleTreeRecursive(t, e, this.obstacleTree);
  };
  _ctor.prototype.queryVisibility = function (t, e, o) {
    return this.queryVisibilityRecursive(t, e, o, this.obstacleTree);
  };
  _ctor.prototype.buildAgentTreeRecursive = function (t, e, o) {
    this.agentTree[o].begin = t;
    this.agentTree[o].end = e;
    this.agentTree[o].minX = this.agentTree[o].maxX = this.agents[t].position_.x;
    this.agentTree[o].minY = this.agentTree[o].maxY = this.agents[t].position_.y;
    for (var i = t + 1; i < e; ++i) {
      this.agentTree[o].maxX = Math.max(this.agentTree[o].maxX, this.agents[i].position_.x);
      this.agentTree[o].minX = Math.min(this.agentTree[o].minX, this.agents[i].position_.x);
      this.agentTree[o].maxY = Math.max(this.agentTree[o].maxY, this.agents[i].position_.y);
      this.agentTree[o].minY = Math.min(this.agentTree[o].minY, this.agents[i].position_.y);
    }
    if (e - t > this.MAX_LEAF_SIZE) {
      var n = this.agentTree[o].maxX - this.agentTree[o].minX > this.agentTree[o].maxY - this.agentTree[o].minY;
      var a = .5 * (n ? this.agentTree[o].maxX + this.agentTree[o].minX : this.agentTree[o].maxY + this.agentTree[o].minY);
      var r = t;
      for (var s = e; r < s;) {
        for (; r < s && (n ? this.agents[r].position_.x : this.agents[r].position_.y) < a;) {
          ++r;
        }
        for (; s > r && (n ? this.agents[s - 1].position_.x : this.agents[s - 1].position_.y) >= a;) {
          --s;
        }
        if (r < s) {
          var c = this.agents[r];
          this.agents[r] = this.agents[s - 1];
          this.agents[s - 1] = c;
          ++r;
          --s;
        }
      }
      var l = r - t;
      if (0 == l) {
        ++l;
        ++r;
        ++s;
      }
      this.agentTree[o].left = o + 1;
      this.agentTree[o].right = o + 2 * l;
      this.buildAgentTreeRecursive(t, r, this.agentTree[o].left);
      this.buildAgentTreeRecursive(r, e, this.agentTree[o].right);
    }
  };
  _ctor.prototype.buildObstacleTreeRecursive = function (t) {
    if (0 == t.length) {
      return null;
    }
    var e = new s();
    var o = 0;
    var r = t.length;
    var c = r;
    for (var l = 0; l < t.length; ++l) {
      var u = 0;
      var p = 0;
      var h = (E = t[l]).next;
      for (var d = 0; d < t.length; d++) {
        if (l != d) {
          var m = (x = t[d]).next;
          var f = $10Common.RVOMath.leftOf(E.point, h.point, x.point);
          var y = $10Common.RVOMath.leftOf(E.point, h.point, m.point);
          if (f >= -$10Common.RVOMath.RVO_EPSILON && y >= -$10Common.RVOMath.RVO_EPSILON) {
            ++u;
          } else if (f <= $10Common.RVOMath.RVO_EPSILON && y <= $10Common.RVOMath.RVO_EPSILON) {
            ++p;
          } else {
            ++u;
            ++p;
          }
          var g = new a(Math.max(u, p), Math.min(u, p));
          var _ = new a(Math.max(r, c), Math.min(r, c));
          if (g.bigEqualThan(_)) {
            break;
          }
        }
      }
      var v = new a(Math.max(u, p), Math.min(u, p));
      var b = new a(Math.max(r, c), Math.min(r, c));
      if (v.lessThan(b)) {
        r = u;
        c = p;
        o = l;
      }
    }
    var P = [];
    for (var D = 0; D < r; ++D) {
      P.push(null);
    }
    var S = [];
    for (D = 0; D < c; ++D) {
      S.push(null);
    }
    var E;
    var C = 0;
    var B = 0;
    h = (E = t[l = o]).next;
    for (d = 0; d < t.length; ++d) {
      if (l != d) {
        var x;
        m = (x = t[d]).next;
        f = $10Common.RVOMath.leftOf(E.point, h.point, x.point);
        y = $10Common.RVOMath.leftOf(E.point, h.point, m.point);
        if (f >= -$10Common.RVOMath.RVO_EPSILON && y >= -$10Common.RVOMath.RVO_EPSILON) {
          P[C++] = t[d];
        } else if (f <= $10Common.RVOMath.RVO_EPSILON && y <= $10Common.RVOMath.RVO_EPSILON) {
          S[B++] = t[d];
        } else {
          var M = $10Common.RVOMath.det(h.point.minus(E.point), x.point.minus(E.point)) / $10Common.RVOMath.det(h.point.minus(E.point), x.point.minus(m.point));
          var w = x.point.plus(m.point.minus(x.point).scale(M));
          var A = new $10Common.Obstacle();
          A.point = w;
          A.previous = x;
          A.next = m;
          A.convex = true;
          A.direction = x.direction;
          A.id = $10Simulator.Simulator.instance.obstacles.length;
          $10Simulator.Simulator.instance.obstacles.push(A);
          x.next = A;
          m.previous = A;
          if (f > 0) {
            P[C++] = x;
            S[B++] = A;
          } else {
            S[B++] = x;
            P[C++] = A;
          }
        }
      }
    }
    e.obstacle = E;
    e.left = this.buildObstacleTreeRecursive(P);
    e.right = this.buildObstacleTreeRecursive(S);
    return e;
  };
  _ctor.prototype.queryAgentTreeRecursive = function (t, e, o) {
    if (this.agentTree[o].end - this.agentTree[o].begin <= this.MAX_LEAF_SIZE) {
      for (var n = this.agentTree[o].begin; n < this.agentTree[o].end; ++n) {
        e = t.insertAgentNeighbor(this.agents[n], e);
      }
    } else {
      var a = $10Common.RVOMath.sqr(Math.max(0, this.agentTree[this.agentTree[o].left].minX - t.position_.x)) + $10Common.RVOMath.sqr(Math.max(0, t.position_.x - this.agentTree[this.agentTree[o].left].maxX)) + $10Common.RVOMath.sqr(Math.max(0, this.agentTree[this.agentTree[o].left].minY - t.position_.y)) + $10Common.RVOMath.sqr(Math.max(0, t.position_.y - this.agentTree[this.agentTree[o].left].maxY));
      var r = $10Common.RVOMath.sqr(Math.max(0, this.agentTree[this.agentTree[o].right].minX - t.position_.x)) + $10Common.RVOMath.sqr(Math.max(0, t.position_.x - this.agentTree[this.agentTree[o].right].maxX)) + $10Common.RVOMath.sqr(Math.max(0, this.agentTree[this.agentTree[o].right].minY - t.position_.y)) + $10Common.RVOMath.sqr(Math.max(0, t.position_.y - this.agentTree[this.agentTree[o].right].maxY));
      if (a < r) {
        a < e && r < (e = this.queryAgentTreeRecursive(t, e, this.agentTree[o].left)) && (e = this.queryAgentTreeRecursive(t, e, this.agentTree[o].right));
      } else {
        r < e && a < (e = this.queryAgentTreeRecursive(t, e, this.agentTree[o].right)) && (e = this.queryAgentTreeRecursive(t, e, this.agentTree[o].left));
      }
    }
    return e;
  };
  _ctor.prototype.queryObstacleTreeRecursive = function (t, e, o) {
    if (null == o) {
      return e;
    }
    var n = o.obstacle;
    var a = n.next;
    var r = $10Common.RVOMath.leftOf(n.point, a.point, t.position_);
    e = this.queryObstacleTreeRecursive(t, e, r >= 0 ? o.left : o.right);
    if ($10Common.RVOMath.sqr(r) / $10Common.RVOMath.absSq(a.point.minus(n.point)) < e) {
      r < 0 && t.insertObstacleNeighbor(o.obstacle, e);
      this.queryObstacleTreeRecursive(t, e, r >= 0 ? o.right : o.left);
    }
    return e;
  };
  _ctor.prototype.queryVisibilityRecursive = function (t, e, o, n) {
    if (null == n) {
      return true;
    }
    var a = n.obstacle;
    var r = a.next;
    var s = $10Common.RVOMath.leftOf(a.point, r.point, t);
    var c = $10Common.RVOMath.leftOf(a.point, r.point, e);
    var l = 1 / $10Common.RVOMath.absSq(r.point.minus(a.point));
    if (s >= 0 && c >= 0) {
      return this.queryVisibilityRecursive(t, e, o, n.left) && ($10Common.RVOMath.sqr(s) * l >= $10Common.RVOMath.sqr(o) && $10Common.RVOMath.sqr(c) * l >= $10Common.RVOMath.sqr(o) || this.queryVisibilityRecursive(t, e, o, n.right));
    }
    if (s <= 0 && c <= 0) {
      return this.queryVisibilityRecursive(t, e, o, n.right) && ($10Common.RVOMath.sqr(s) * l >= $10Common.RVOMath.sqr(o) && $10Common.RVOMath.sqr(c) * l >= $10Common.RVOMath.sqr(o) || this.queryVisibilityRecursive(t, e, o, n.left));
    }
    if (s >= 0 && c <= 0) {
      return this.queryVisibilityRecursive(t, e, o, n.left) && this.queryVisibilityRecursive(t, e, o, n.right);
    }
    var u = $10Common.RVOMath.leftOf(t, e, a.point);
    var p = $10Common.RVOMath.leftOf(t, e, r.point);
    var h = 1 / $10Common.RVOMath.absSq(e.minus(t));
    return u * p >= 0 && $10Common.RVOMath.sqr(u) * h > $10Common.RVOMath.sqr(o) && $10Common.RVOMath.sqr(p) * h > $10Common.RVOMath.sqr(o) && this.queryVisibilityRecursive(t, e, o, n.left) && this.queryVisibilityRecursive(t, e, o, n.right);
  };
  return _ctor;
}();
exports.KdTree = exp_KdTree;