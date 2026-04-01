var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SceneBase = undefined;
var $10ComponentBase = require("ComponentBase");
var $10EventManager = require("EventManager");
var $10SceneManager = require("SceneManager");
var $10AppProxy = require("AppProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var exp_SceneBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.bannerPosition = null;
    e.nativePosition = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
    $10SceneManager.SceneManager.instance.setCurScene(this);
    $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.SCENE_CHANGED);
    var e = cc.view.getDesignResolutionSize();
    var o = this.node.getComponent(cc.Canvas);
    if (cc.winSize.width / cc.winSize.height < e.width / e.height) {
      o.fitWidth = true;
      o.fitHeight = false;
    } else {
      o.fitWidth = false;
      o.fitHeight = true;
    }
  };
  _ctor.prototype.switchSceneUI = function (t) {
    undefined === t && (t = 0);
    var e = [];
    for (var o = 1; o < arguments.length; o++) {
      e[o - 1] = arguments[o];
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComponentBase.ComponentBase);
exports.SceneBase = exp_SceneBase;