Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerManager = undefined;
var exp_WorkerManager = function () {
  function _ctor() {
    this._worker = null;
    this._tasks = {};
    this._msgId = 0;
    this._createWorker();
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == _ctor._instance && (_ctor._instance = new _ctor());
      return _ctor._instance;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isSupport", {
    get: function () {
      return null != this._worker;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype._createWorker = function () {
    var t = this;
    null != this._worker && this._worker.terminate();
    this._worker = yzll.createWorker("workers/index.js", {
      useExperimentalWorker: true
    });
    if (null != this._worker) {
      this._worker.onProcessKilled && this._worker.onProcessKilled(function () {
        t._createWorker();
      });
      this._worker.onMessage(function (e) {
        var o;
        var i;
        var n = e.msgId;
        var a = e.data;
        null === (i = (o = t._tasks)[n]) || undefined === i || i.call(o, null, a);
      });
    }
  };
  _ctor.prototype.postMessage = function (t, e) {
    var o = this;
    if (null == this._worker) {
      if (null == e) {
        return Promise.reject({
          errCode: -1,
          errMsg: "不支持的平台"
        });
      } else {
        return void (null == e || e({
          errCode: -1,
          errMsg: "不支持的平台"
        }));
      }
    }
    if (t.type) {
      var i = t.type + "_" + this._msgId;
      this._msgId++;
      if (null == e) {
        return new Promise(function (e, n) {
          o._tasks[i] = function (t, o) {
            if (t) {
              n(t);
            } else {
              e(o);
            }
          };
          t.msgId = i;
          o._worker.postMessage(t);
        });
      }
      this._tasks[i] = e;
      t.msgId = i;
      this._worker.postMessage(t);
    } else {
      console.error("请先定义type字段");
    }
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.WorkerManager = exp_WorkerManager;