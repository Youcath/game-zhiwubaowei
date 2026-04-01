Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlockInputManager = undefined;
var $10AppBase = require("AppBase");
var exp_BlockInputManager = function () {
  function _ctor() {
    this.blockInputInit = false;
    this._blockInputNode = null;
    this._popupBlockInputNum = 0;
    this._netBlockInputNum = 0;
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == this._instance && (this._instance = new _ctor());
      return this._instance;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "popupBlockInputNum", {
    get: function () {
      return this._popupBlockInputNum;
    },
    set: function (t) {
      this._popupBlockInputNum = t;
      null != this._blockInputNode && (this._blockInputNode.active = this._popupBlockInputNum + this._netBlockInputNum > 0);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "netBlockInputNum", {
    get: function () {
      return this._netBlockInputNum;
    },
    set: function (t) {
      var e = this;
      this._netBlockInputNum = t;
      if (null != this._blockInputNode) {
        if (this._popupBlockInputNum + this._netBlockInputNum === 0) {
          setTimeout(function () {
            e._popupBlockInputNum + e._netBlockInputNum === 0 && (e._blockInputNode.active = false);
          }, 100);
        } else {
          this._blockInputNode.active = true;
        }
      }
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.init = function () {
    if (!this.blockInputInit) {
      var t = this._blockInputNode = new cc.Node("BlockInputNode");
      t.width = $10AppBase.rootNode.width;
      t.height = $10AppBase.rootNode.height;
      t.addComponent(cc.BlockInputEvents);
      t.parent = $10AppBase.rootNode;
      t.zIndex = 9;
      t.active = false;
      this.blockInputInit = true;
    }
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.BlockInputManager = exp_BlockInputManager;