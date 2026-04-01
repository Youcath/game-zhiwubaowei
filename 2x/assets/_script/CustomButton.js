var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomButton = undefined;
var $10AudioManager = require("AudioManager");
var $10ComponentBase = require("ComponentBase");
var $10EventManager = require("EventManager");
var $10AppProxy = require("AppProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_menu = cc__decorator.menu;
var ccp_requireComponent = cc__decorator.requireComponent;
var exp_CustomButton = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.btnAudio = true;
    e.lastEvent = true;
    e.clip = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
    this.node.on("click", this.onClick, this);
  };
  _ctor.prototype.onClick = function () {
    if (this.btnAudio) {
      if (null != this.clip) {
        $10AudioManager.AudioManager.instance.playEffect(this.clip);
      } else {
        $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.AUDIO_CLICK);
      }
    }
  };
  cc__decorate([ccp_property()], _ctor.prototype, "btnAudio", undefined);
  cc__decorate([ccp_property()], _ctor.prototype, "lastEvent", undefined);
  cc__decorate([ccp_property({
    type: cc.AudioClip,
    tooltip: "点击音效",
    visible: function () {
      return this.btnAudio;
    }
  })], _ctor.prototype, "clip", undefined);
  return cc__decorate([ccp_ccclass, ccp_menu("自定义组件/按钮"), ccp_requireComponent(cc.Button)], _ctor);
}($10ComponentBase.ComponentBase);
exports.CustomButton = exp_CustomButton;