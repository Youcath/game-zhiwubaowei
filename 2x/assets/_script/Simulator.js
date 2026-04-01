Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Simulator = undefined;
var $10Agent = require("Agent");
var $10Common = require("Common");
var $10kdtree = require("kdtree");
var exp_Simulator = function () {
  function _ctor() {
    this.agentId = 0;
    this.agentIdLst = [];
    this.aid2agent = Object.create(null);
    this.obstacles = [];
    this.kdTree = new $10kdtree.KdTree();
    this.time = 0;
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      _ctor._inst || (_ctor._inst = new _ctor());
      return _ctor._inst;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.getAgent = function (t) {
    return this.aid2agent[this.agentIdLst[t]];
  };
  _ctor.prototype.getAgentByAid = function (t) {
    return this.aid2agent[t];
  };
  _ctor.prototype.getGlobalTime = function () {
    return this.time;
  };
  _ctor.prototype.getNumAgents = function () {
    return this.agentIdLst.length;
  };
  _ctor.prototype.getAgentAidByIdx = function (t) {
    return this.agentIdLst[t];
  };
  _ctor.prototype.setAgentPrefVelocity = function (t, e) {
    this.aid2agent[t].prefVelocity_.copy(e);
  };
  _ctor.prototype.getAgentPosition = function (t) {
    if (this.aid2agent[t]) {
      return this.aid2agent[t].position_;
    } else {
      return null;
    }
  };
  _ctor.prototype.getAgentPrefVelocity = function (t) {
    return this.aid2agent[t].prefVelocity_;
  };
  _ctor.prototype.getAgentVelocity = function (t) {
    return this.aid2agent[t].velocity_;
  };
  _ctor.prototype.getAgentRadius = function (t) {
    return this.aid2agent[t].radius_;
  };
  _ctor.prototype.getAgentOrcaLines = function (t) {
    return this.aid2agent[t].orcaLines_;
  };
  _ctor.prototype.addAgent = function (t, e, o, n, a) {
    undefined === e && (e = null);
    undefined === o && (o = null);
    undefined === n && (n = null);
    undefined === a && (a = null);
    if (!this.defaultAgent) {
      throw new Error("no default agent");
    }
    var r = new $10Agent.Agent();
    r.position_.copy(t);
    r.maxNeighbors_ = this.defaultAgent.maxNeighbors_;
    r.maxSpeed_ = o || this.defaultAgent.maxSpeed_;
    r.neighborDist = this.defaultAgent.neighborDist;
    r.radius_ = e || this.defaultAgent.radius_;
    r.timeHorizon = this.defaultAgent.timeHorizon;
    r.timeHorizonObst = this.defaultAgent.timeHorizonObst;
    r.velocity_.copy(n || this.defaultAgent.velocity_);
    r.id = this.agentId++;
    a && a >= 0 && (r.mass = a);
    this.aid2agent[r.id] = r;
    this.agentIdLst.push(r.id);
    return r.id;
  };
  _ctor.prototype.removeAgent = function (t) {
    if (this.hasAgent(t)) {
      var e = this.agentIdLst.indexOf(t);
      if (e >= 0) {
        this.agentIdLst[e] = this.agentIdLst[this.agentIdLst.length - 1];
        this.agentIdLst.length--;
      }
      delete this.aid2agent[t];
    }
  };
  _ctor.prototype.hasAgent = function (t) {
    return !!this.aid2agent[t];
  };
  _ctor.prototype.setAgentMass = function (t, e) {
    this.aid2agent[t].mass = e;
  };
  _ctor.prototype.getAgentMass = function (t) {
    return this.aid2agent[t].mass;
  };
  _ctor.prototype.setAgentRadius = function (t, e) {
    this.aid2agent[t].radius_ = e;
  };
  _ctor.prototype.setAgentDefaults = function (t, e, o, n, a, r, s) {
    this.defaultAgent || (this.defaultAgent = new $10Agent.Agent());
    this.defaultAgent.maxNeighbors_ = e;
    this.defaultAgent.maxSpeed_ = r;
    this.defaultAgent.neighborDist = t;
    this.defaultAgent.radius_ = a;
    this.defaultAgent.timeHorizon = o;
    this.defaultAgent.timeHorizonObst = n;
    this.defaultAgent.velocity_ = s;
  };
  _ctor.prototype.run = function (t) {
    this.kdTree.buildAgentTree(this.getNumAgents());
    var e = this.agentIdLst.length;
    for (var o = 0; o < e; o++) {
      this.aid2agent[this.agentIdLst[o]].computeNeighbors(this);
      this.aid2agent[this.agentIdLst[o]].computeNewVelocity(t);
    }
    for (o = 0; o < e; o++) {
      this.aid2agent[this.agentIdLst[o]].update(t);
    }
    this.time += t;
  };
  _ctor.prototype.addObstacle = function (t) {
    if (t.length < 2) {
      return -1;
    }
    var e = this.obstacles.length;
    for (var o = 0; o < t.length; ++o) {
      var i = new $10Common.Obstacle();
      i.point = t[o];
      if (0 != o) {
        i.previous = this.obstacles[this.obstacles.length - 1];
        i.previous.next = i;
      }
      if (o == t.length - 1) {
        i.next = this.obstacles[e];
        i.next.previous = i;
      }
      i.direction = $10Common.RVOMath.normalize(t[o == t.length - 1 ? 0 : o + 1].minus(t[o]));
      if (2 == t.length) {
        i.convex = true;
      } else {
        i.convex = $10Common.RVOMath.leftOf(t[0 == o ? t.length - 1 : o - 1], t[o], t[o == t.length - 1 ? 0 : o + 1]) >= 0;
      }
      i.id = this.obstacles.length;
      this.obstacles.push(i);
    }
    return e;
  };
  _ctor.prototype.processObstacles = function () {
    this.kdTree.buildObstacleTree();
  };
  _ctor.prototype.queryVisibility = function (t, e, o) {
    return this.kdTree.queryVisibility(t, e, o);
  };
  _ctor.prototype.getObstacles = function () {
    return this.obstacles;
  };
  _ctor.prototype.clear = function () {
    this.agentIdLst.length = 0;
    this.agentId = 0;
    this.aid2agent = Object.create(null);
    this.defaultAgent = null;
    this.kdTree = new $10kdtree.KdTree();
    this.obstacles.length = 0;
  };
  return _ctor;
}();
exports.Simulator = exp_Simulator;