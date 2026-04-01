var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FragmentBase = undefined;
var $10ComponentBase = require("ComponentBase");
var $10EventManager = require("EventManager");
var $10AppProxy = require("AppProxy");
var $10SceneManager = require("SceneManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var exp_FragmentBase = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
  };
  _ctor.prototype.onEnable = function () {
    t.prototype.onEnable.call(this);
    $10SceneManager.SceneManager.instance.fragment = this.node;
    $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.FRAGMENT_CHANGED);
  };
  _ctor.prototype.onDisable = function () {
    $10SceneManager.SceneManager.instance.fragment == this.node && ($10SceneManager.SceneManager.instance.fragment = null);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComponentBase.ComponentBase);
exports.FragmentBase = exp_FragmentBase;