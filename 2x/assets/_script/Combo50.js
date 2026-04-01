var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10ComboBase = require("ComboBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_Combo50 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.play = function () {
    var t = this;
    this.node.scale = 1;
    $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.ACTIVE_FRENZY);
    this.node.scale = 2.3;
    cc.tween(this.node).to(.15, {
      scale: 1.3
    }).delay(.5).call(function () {
      t.node.destroy();
      t.node.removeFromParent();
    }).start();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComboBase.default);
exports.default = def_Combo50;