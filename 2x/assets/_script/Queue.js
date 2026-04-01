Object.defineProperty(exports, "__esModule", {
  value: true
});
var def_Queue = function () {
  function _ctor() {
    this.count = 0;
    this.lowestCount = 0;
    this.itemMap = null;
    this.count = 0;
    this.lowestCount = 0;
    this.itemMap = new Map();
  }
  _ctor.prototype.enqueue = function (t) {
    this.itemMap.set(this.count, t);
    this.count++;
  };
  _ctor.prototype.dequeue = function () {
    if (!this.isEmpty()) {
      var t = this.itemMap.get(this.lowestCount);
      this.itemMap.delete(this.lowestCount);
      this.lowestCount++;
      return t;
    }
  };
  _ctor.prototype.peek = function () {
    if (!this.isEmpty()) {
      return this.itemMap.get(this.lowestCount);
    }
  };
  _ctor.prototype.isEmpty = function () {
    return 0 === this.itemMap.size;
  };
  _ctor.prototype.size = function () {
    return this.itemMap.size;
  };
  _ctor.prototype.clear = function () {
    this.itemMap.clear();
    this.count = 0;
    this.lowestCount = 0;
  };
  _ctor.prototype.toString = function () {
    if (this.isEmpty()) {
      return "";
    }
    var t = "" + this.itemMap.get(this.lowestCount);
    for (var e = this.lowestCount + 1; e < this.count; e++) {
      t = t + "," + this.itemMap.get(e);
    }
    return t;
  };
  return _ctor;
}();
exports.default = def_Queue;