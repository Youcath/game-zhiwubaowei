var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SceneBase = require("SceneBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GuardingtherBridge = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mZbTips = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
    this.mZbTips.active = yzll.gameConfig.isZB || yzll.gameConfig.debug;
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mZbTips", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10SceneBase.SceneBase);
exports.default = def_GuardingtherBridge;