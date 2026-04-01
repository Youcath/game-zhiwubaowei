Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppBase = exports.topNode = exports.rootNode = undefined;
var $10GameEnum = require("GameEnum");
var $10EventManager = require("EventManager");
var a = {};
var exp_AppBase = function () {
  function _ctor() {}
  _ctor.getSystemInfoSync = function () {
    return a;
  };
  _ctor.init = function () {
    if (!this.appBaseInit) {
      var t = cc.view.getVisibleSize();
      exports.rootNode = new cc.Node("Root");
      exports.rootNode.width = t.width;
      exports.rootNode.height = t.height;
      exports.rootNode.x = t.width / 2;
      exports.rootNode.y = t.height / 2;
      cc.director.getScene().addChild(exports.rootNode);
      cc.game.addPersistRootNode(exports.rootNode);
      exports.topNode = new cc.Node("Top");
      exports.topNode.width = t.width;
      exports.topNode.height = t.height;
      exports.topNode.x = t.width / 2;
      exports.topNode.y = t.height / 2;
      cc.director.getScene().addChild(exports.topNode);
      cc.game.addPersistRootNode(exports.topNode);
      exports.topNode.on(cc.Node.EventType.TOUCH_START, function (t) {
        $10EventManager.EventManager.instance.emit($10GameEnum.EGameEvent.SCENE_TOUCH_START, t);
      }, exports.topNode);
      var e = exports.topNode;
      e._touchListener && e._touchListener.setSwallowTouches(false);
      this.appBaseInit = true;
    }
  };
  _ctor.getRoot = function () {
    if (null != exports.rootNode) {
      return Promise.resolve(exports.rootNode);
    } else {
      return new Promise(function (t) {
        var e = null;
        e = setInterval(function () {
          if (null != exports.rootNode) {
            e && clearInterval(e);
            t(exports.rootNode);
          }
        }, 100);
      });
    }
  };
  _ctor.appBaseInit = false;
  _ctor.onShow = function (t) {
    cc.game.on(cc.game.EVENT_SHOW, t);
  };
  _ctor.offShow = function (t) {
    cc.game.off(cc.game.EVENT_SHOW, t);
  };
  _ctor.onHide = function (t) {
    cc.game.on(cc.game.EVENT_HIDE, t);
  };
  _ctor.offHide = function (t) {
    cc.game.off(cc.game.EVENT_HIDE, t);
  };
  return _ctor;
}();
exports.AppBase = exp_AppBase;