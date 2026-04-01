Object.defineProperty(exports, "__esModule", {
  value: true
});
var def_NodePoolManager = function () {
  function _ctor() {
    this.poolListMap = new Map();
    this.poolPrefabMap = new Map();
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == _ctor._instance && (_ctor._instance = new _ctor());
      return _ctor._instance;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.checkNodePoolVaild = function (t) {
    this.poolListMap.has(t) || this.poolListMap.set(t, new cc.NodePool(t));
  };
  _ctor.prototype.getNode = function (t) {
    this.checkNodePoolVaild(t.name);
    var e = null;
    var o = this.poolListMap.get(t.name);
    (e = o && o.size() > 0 ? o.get() : cc.instantiate(t)).active = true;
    return e;
  };
  _ctor.prototype.putNode = function (t, e, o) {
    undefined === o && (o = true);
    this.checkNodePoolVaild(t.name);
    o && (t.active = false);
    e && t.setPosition(-9999, -9999);
    this.poolListMap.get(t.name).put(t);
  };
  _ctor.prototype.clearNodePool = function (t) {
    if (this.poolListMap.has(t.name)) {
      this.poolListMap.get(t.name).clear();
      this.poolListMap.delete(t.name);
    }
  };
  _ctor.prototype.addPoolPrefab = function (t) {
    this.poolPrefabMap.set(t.name, t);
    t.addRef();
  };
  _ctor.prototype.getPoolPrefab = function (t) {
    if (this.poolPrefabMap.has(t)) {
      return this.poolPrefabMap.get(t);
    } else {
      return null;
    }
  };
  _ctor.prototype.removePoolPrefab = function (t) {
    this.poolPrefabMap.has(t) && this.poolPrefabMap.get(t).decRef();
    this.poolPrefabMap.delete(t);
  };
  _ctor.prototype.clearAllPoolPrefab = function () {
    this.poolPrefabMap.forEach(function (t) {
      t.decRef();
    });
    this.poolPrefabMap.clear();
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.default = def_NodePoolManager;