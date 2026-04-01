Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventManager = undefined;
var exp_EventManager = function () {
  function _ctor() {}
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == _ctor._instance && (_ctor._instance = new cc.EventTarget());
      return _ctor._instance;
    },
    enumerable: false,
    configurable: true
  });
  _ctor._instance = null;
  return _ctor;
}();
exports.EventManager = exp_EventManager;