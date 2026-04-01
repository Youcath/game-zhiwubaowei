Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Agent = undefined;
var $10Common = require("Common");
var exp_Agent = function () {
  function _ctor() {
    this.agentNeighbors_ = [];
    this.obstaclNeighbors_ = [];
    this.orcaLines_ = [];
    this.position_ = new $10Common.Vector2(0, 0);
    this.prefVelocity_ = new $10Common.Vector2(0, 0);
    this.velocity_ = new $10Common.Vector2(0, 0);
    this.id = 0;
    this.maxNeighbors_ = 0;
    this.maxSpeed_ = 0;
    this._neighborDist = 0;
    this.radius_ = 0;
    this.timeHorizon = 0;
    this.timeHorizonObst = 0;
    this.newVelocity_ = new $10Common.Vector2(0, 0);
    this.mass = 1;
  }
  Object.defineProperty(_ctor.prototype, "neighborDist", {
    get: function () {
      return this._neighborDist;
    },
    set: function (t) {
      this._neighborDist = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.computeNeighbors = function (t) {
    this.obstaclNeighbors_.length = 0;
    var e = Math.pow(this.timeHorizonObst * this.maxSpeed_ + this.radius_, 2);
    t.kdTree.computeObstacleNeighbors(this, e);
    this.agentNeighbors_.length = 0;
    if (this.maxNeighbors_ > 0) {
      e = Math.pow(this.neighborDist, 2);
      e = t.kdTree.computeAgentNeighbors(this, e);
    }
  };
  _ctor.prototype.computeNewVelocity = function (t) {
    this.orcaLines_.length = 0;
    var e = this.orcaLines_;
    var o = 1 / this.timeHorizonObst;
    for (var n = 0; n < this.obstaclNeighbors_.length; ++n) {
      var a = this.obstaclNeighbors_[n].value;
      var r = a.next;
      var s = a.point.minus(this.position_);
      var c = r.point.minus(this.position_);
      var l = false;
      for (var u = 0; u < e.length; ++u) {
        if ($10Common.RVOMath.det(s.scale(o).minus(e[u].point), e[u].direction) - o * this.radius_ >= -$10Common.RVOMath.RVO_EPSILON && $10Common.RVOMath.det(c.scale(o).minus(e[u].point), e[u].direction) - o * this.radius_ >= -$10Common.RVOMath.RVO_EPSILON) {
          l = true;
          break;
        }
      }
      if (!l) {
        var p = $10Common.RVOMath.absSq(s);
        var h = $10Common.RVOMath.absSq(c);
        var d = $10Common.RVOMath.sqr(this.radius_);
        var m = r.point.minus(a.point);
        var f = s.scale(-1).multiply(m) / $10Common.RVOMath.absSq(m);
        var y = $10Common.RVOMath.absSq(s.scale(-1).minus(m.scale(f)));
        var g = new $10Common.Line();
        if (f < 0 && p <= d) {
          if (a.convex) {
            g.point = new $10Common.Vector2(0, 0);
            g.direction = $10Common.RVOMath.normalize(new $10Common.Vector2(-s.y, s.x));
            e.push(g);
          }
        } else if (f > 1 && h <= d) {
          if (r.convex && $10Common.RVOMath.det(c, r.direction) >= 0) {
            g.point = new $10Common.Vector2(0, 0);
            g.direction = $10Common.RVOMath.normalize(new $10Common.Vector2(-c.y, c.x));
            e.push(g);
          }
        } else if (f >= 0 && f <= 1 && y <= d) {
          g.point = new $10Common.Vector2(0, 0);
          g.direction = a.direction.scale(-1);
          e.push(g);
        } else {
          var _ = undefined;
          var v = undefined;
          if (f < 0 && y <= d) {
            if (!a.convex) {
              continue;
            }
            r = a;
            var b = Math.sqrt(p - d);
            _ = new $10Common.Vector2(s.x * b - s.y * this.radius_, s.x * this.radius_ + s.y * b).scale(1 / p);
            v = new $10Common.Vector2(s.x * b + s.y * this.radius_, -s.x * this.radius_ + s.y * b).scale(1 / p);
          } else if (f > 1 && y <= d) {
            if (!r.convex) {
              continue;
            }
            a = r;
            var P = Math.sqrt(h - d);
            _ = new $10Common.Vector2(c.x * P - c.y * this.radius_, c.x * this.radius_ + c.y * P).scale(1 / h);
            v = new $10Common.Vector2(c.x * P + c.y * this.radius_, -c.x * this.radius_ + c.y * P).scale(1 / h);
          } else {
            if (a.convex) {
              b = Math.sqrt(p - d);
              _ = new $10Common.Vector2(s.x * b - s.y * this.radius_, s.x * this.radius_ + s.y * b).scale(1 / p);
            } else {
              _ = a.direction.scale(-1);
            }
            if (r.convex) {
              P = Math.sqrt(h - d);
              v = new $10Common.Vector2(c.x * P + c.y * this.radius_, -c.x * this.radius_ + c.y * P).scale(1 / h);
            } else {
              v = a.direction;
            }
          }
          var D = a.previous;
          var S = false;
          var E = false;
          if (a.convex && $10Common.RVOMath.det(_, D.direction.scale(-1)) >= 0) {
            _ = D.direction.scale(-1);
            S = true;
          }
          if (r.convex && $10Common.RVOMath.det(v, r.direction) <= 0) {
            v = r.direction;
            E = true;
          }
          var C = a.point.minus(this.position_).scale(o);
          var B = r.point.minus(this.position_).scale(o);
          var x = B.minus(C);
          var M = a == r ? .5 : this.velocity_.minus(C).multiply(x) / $10Common.RVOMath.absSq(x);
          var w = this.velocity_.minus(C).multiply(_);
          var A = this.velocity_.minus(B).multiply(v);
          if (M < 0 && w < 0 || a == r && w < 0 && A < 0) {
            var R = $10Common.RVOMath.normalize(this.velocity_.minus(C));
            g.direction = new $10Common.Vector2(R.y, -R.x);
            g.point = C.plus(R.scale(this.radius_ * o));
            e.push(g);
          } else if (M > 1 && A < 0) {
            R = $10Common.RVOMath.normalize(this.velocity_.minus(B));
            g.direction = new $10Common.Vector2(R.y, -R.x);
            g.point = B.plus(R.scale(this.radius_ * o));
            e.push(g);
          } else {
            var O = M < 0 || M > 1 || a == r ? Infinity : $10Common.RVOMath.absSq(this.velocity_.minus(x.scale(M).plus(C)));
            var N = w < 0 ? Infinity : $10Common.RVOMath.absSq(this.velocity_.minus(_.scale(w).plus(C)));
            var I = A < 0 ? Infinity : $10Common.RVOMath.absSq(this.velocity_.minus(v.scale(A).plus(B)));
            if (O <= N && O <= I) {
              g.direction = a.direction.scale(-1);
              var T = new $10Common.Vector2(-g.direction.y, g.direction.x);
              g.point = T.scale(this.radius_ * o).plus(C);
              e.push(g);
            } else if (N <= I) {
              if (S) {
                continue;
              }
              g.direction = _;
              T = new $10Common.Vector2(-g.direction.y, g.direction.x);
              g.point = T.scale(this.radius_ * o).plus(C);
              e.push(g);
            } else if (!E) {
              g.direction = v.scale(-1);
              T = new $10Common.Vector2(-g.direction.y, g.direction.x);
              g.point = T.scale(this.radius_ * o).plus(B);
              e.push(g);
            }
          }
        }
      }
    }
    var k = e.length;
    var U = 1 / this.timeHorizon;
    for (n = 0; n < this.agentNeighbors_.length; ++n) {
      var L = this.agentNeighbors_[n].value;
      var j = L.position_.minus(this.position_);
      var F = L.mass / (this.mass + L.mass);
      var G = this.mass / (this.mass + L.mass);
      var H = F >= .5 ? this.velocity_.minus(this.velocity_.scale(F)).scale(2) : this.prefVelocity_.plus(this.velocity_.minus(this.prefVelocity_).scale(2 * F));
      var V = G >= .5 ? L.velocity_.scale(2).scale(1 - G) : L.prefVelocity_.plus(L.velocity_.minus(L.prefVelocity_).scale(2 * G));
      var W = H.minus(V);
      var q = $10Common.RVOMath.absSq(j);
      var z = this.radius_ + L.radius_;
      var Y = $10Common.RVOMath.sqr(z);
      var K = void (g = new $10Common.Line());
      if (q > Y) {
        var J = W.minus(j.scale(U));
        var X = $10Common.RVOMath.absSq(J);
        var Z = J.multiply(j);
        if (Z < 0 && $10Common.RVOMath.sqr(Z) > Y * X) {
          var Q = Math.sqrt(X);
          R = J.scale(1 / Q);
          g.direction = new $10Common.Vector2(R.y, -R.x);
          K = R.scale(z * U - Q);
        } else {
          var $ = Math.sqrt(q - Y);
          if ($10Common.RVOMath.det(j, J) > 0) {
            T = new $10Common.Vector2(j.x * $ - j.y * z, j.x * z + j.y * $);
            g.direction = T.scale(1 / q);
          } else {
            T = new $10Common.Vector2(j.x * $ + j.y * z, -j.x * z + j.y * $);
            g.direction = T.scale(-1 / q);
          }
          var tt = W.multiply(g.direction);
          K = g.direction.scale(tt).minus(W);
        }
      } else {
        var et = 1 / t;
        J = W.minus(j.scale(et));
        Q = $10Common.RVOMath.abs(J);
        R = J.scale(1 / Q);
        g.direction = new $10Common.Vector2(R.y, -R.x);
        K = R.scale(z * et - Q);
      }
      g.point = H.plus(K.scale(F));
      e.push(g);
    }
    var ot = this.linearProgram2(e, this.maxSpeed_, this.prefVelocity_, false, this.newVelocity_);
    ot < e.length && this.linearProgram3(e, k, ot, this.maxSpeed_, this.newVelocity_);
  };
  _ctor.prototype.insertAgentNeighbor = function (t, e) {
    if (this != t) {
      var o = $10Common.RVOMath.absSq(this.position_.minus(t.position_));
      if (o < e) {
        this.agentNeighbors_.length < this.maxNeighbors_ && this.agentNeighbors_.push(new $10Common.KeyValuePair(o, t));
        for (var n = this.agentNeighbors_.length - 1; 0 != n && o < this.agentNeighbors_[n - 1].key;) {
          this.agentNeighbors_[n] = this.agentNeighbors_[n - 1];
          --n;
        }
        this.agentNeighbors_[n] = new $10Common.KeyValuePair(o, t);
        this.agentNeighbors_.length == this.maxNeighbors_ && (e = this.agentNeighbors_[this.agentNeighbors_.length - 1].key);
      }
    }
    return e;
  };
  _ctor.prototype.insertObstacleNeighbor = function (t, e) {
    var o = t.next;
    var n = $10Common.RVOMath.distSqPointLineSegment(t.point, o.point, this.position_);
    if (n < e) {
      this.obstaclNeighbors_.push(new $10Common.KeyValuePair(n, t));
      for (var a = this.obstaclNeighbors_.length - 1; 0 != a && n < this.obstaclNeighbors_[a - 1].key;) {
        this.obstaclNeighbors_[a] = this.obstaclNeighbors_[a - 1];
        --a;
      }
      this.obstaclNeighbors_[a] = new $10Common.KeyValuePair(n, t);
    }
  };
  _ctor.prototype.update = function (t) {
    this.velocity_.copy(this.newVelocity_);
    this.position_.copy(this.position_.plus(this.velocity_.scale(t)));
  };
  _ctor.prototype.linearProgram1 = function (t, e, o, n, a, r) {
    var s = t[e].point.multiply(t[e].direction);
    var c = $10Common.RVOMath.sqr(s) + $10Common.RVOMath.sqr(o) - $10Common.RVOMath.absSq(t[e].point);
    if (c < 0) {
      return false;
    }
    var l = Math.sqrt(c);
    var u = -s - l;
    var p = -s + l;
    for (var h = 0; h < e; ++h) {
      var d = $10Common.RVOMath.det(t[e].direction, t[h].direction);
      var m = $10Common.RVOMath.det(t[h].direction, t[e].point.minus(t[h].point));
      if (Math.abs(d) <= $10Common.RVOMath.RVO_EPSILON) {
        if (m < 0) {
          return false;
        }
      } else {
        var f = m / d;
        if (d >= 0) {
          p = Math.min(p, f);
        } else {
          u = Math.max(u, f);
        }
        if (u > p) {
          return false;
        }
      }
    }
    if (a) {
      if (n.multiply(t[e].direction) > 0) {
        r.copy(t[e].point.plus(t[e].direction.scale(p)));
      } else {
        r.copy(t[e].point.plus(t[e].direction.scale(u)));
      }
    } else if ((f = t[e].direction.multiply(n.minus(t[e].point))) < u) {
      r.copy(t[e].point.plus(t[e].direction.scale(u)));
    } else if (f > p) {
      r.copy(t[e].point.plus(t[e].direction.scale(p)));
    } else {
      r.copy(t[e].point.plus(t[e].direction.scale(f)));
    }
    return true;
  };
  _ctor.prototype.linearProgram2 = function (t, e, o, n, a) {
    if (n) {
      a.copy(o.scale(e));
    } else if ($10Common.RVOMath.absSq(o) > $10Common.RVOMath.sqr(e)) {
      a.copy($10Common.RVOMath.normalize(o).scale(e));
    } else {
      a.copy(o);
    }
    for (var r = 0; r < t.length; ++r) {
      if ($10Common.RVOMath.det(t[r].direction, t[r].point.minus(a)) > 0) {
        var s = a.clone();
        if (!this.linearProgram1(t, r, e, o, n, a)) {
          a.copy(s);
          return r;
        }
      }
    }
    return t.length;
  };
  _ctor.prototype.linearProgram3 = function (t, e, o, n, a) {
    var r = 0;
    for (var s = o; s < t.length; ++s) {
      if ($10Common.RVOMath.det(t[s].direction, t[s].point.minus(a)) > r) {
        var c = [];
        for (var l = 0; l < e; ++l) {
          c.push(t[l]);
        }
        for (var u = e; u < s; ++u) {
          var p = new $10Common.Line();
          var h = $10Common.RVOMath.det(t[s].direction, t[u].direction);
          if (Math.abs(h) <= $10Common.RVOMath.RVO_EPSILON) {
            if (t[s].direction.multiply(t[u].direction) > 0) {
              continue;
            }
            p.point = t[s].point.plus(t[u].point).scale(.5);
          } else {
            p.point = t[s].point.plus(t[s].direction.scale($10Common.RVOMath.det(t[u].direction, t[s].point.minus(t[u].point)) / h));
          }
          p.direction = $10Common.RVOMath.normalize(t[u].direction.minus(t[s].direction));
          c.push(p);
        }
        var d = a.clone();
        this.linearProgram2(c, n, new $10Common.Vector2(-t[s].direction.y, t[s].direction.x), true, a) < c.length && a.copy(d);
        r = $10Common.RVOMath.det(t[s].direction, t[s].point.minus(a));
      }
    }
  };
  return _ctor;
}();
exports.Agent = exp_Agent;