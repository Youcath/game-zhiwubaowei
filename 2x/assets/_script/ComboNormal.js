var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ComboBase = require("ComboBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_ComboNormal = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mComboLab = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.play = function (t) {
    var e = this;
    this.mComboLab.string = "" + t;
    this.node.scale = 2;
    cc.tween(this.node).to(.15, {
      scale: .9
    }).delay(.5).call(function () {
      e.node.destroy();
      e.node.removeFromParent();
    }).start();
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mComboLab", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComboBase.default);
exports.default = def_ComboNormal;