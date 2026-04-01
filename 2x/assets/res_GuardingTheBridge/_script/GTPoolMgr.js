Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GTPoolMgr = undefined;
var exp_GTPoolMgr = function () {
  function _ctor() {
    this.prefabs = new Map();
    this.pools = new Map();
  }
  Object.defineProperty(_ctor, "Inst", {
    get: function () {
      return this.inst || (this.inst = new this());
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.initPool = function (t, e, o) {
    undefined === o && (o = 10);
    if (!this.pools.has(t)) {
      var i = new cc.NodePool();
      this.prefabs.set(t, cc.instantiate(e));
      this.pools.set(t, i);
      for (var a = 0; a < o; a++) {
        this.pools.get(t).put(cc.instantiate(e));
      }
    }
  };
  _ctor.prototype.get = function (t) {
    if (this.pools.has(t)) {
      var e = this.pools.get(t);
      if (e.size() > 0) {
        return e.get();
      } else {
        return cc.instantiate(this.prefabs.get(t));
      }
    }
    return null;
  };
  _ctor.prototype.put = function (t, e) {
    if (this.pools.has(t)) {
      var o = this.pools.get(t);
      if (e instanceof Array) {
        e.forEach(function (t) {
          o.put(t);
        });
      } else {
        o.put(e);
      }
    }
  };
  _ctor.prototype.realseName = function (t) {
    this.pools.has(t) && this.pools.get(t).clear();
  };
  _ctor.prototype.realse = function () {
    this.pools.forEach(function (t) {
      t.clear();
    });
    this.prefabs.clear();
    this.pools.clear();
  };
  _ctor.inst = null;
  return _ctor;
}();
exports.GTPoolMgr = exp_GTPoolMgr;