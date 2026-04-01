var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_EnemyCrucifix = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.attractCrucifix = function (t) {
    var e = this;
    var o = $10BattleDataProxy.battleDataProxy.equipRoot.children;
    var i = o.findIndex(function (t) {
      var e;
      return 101 == (null === (e = t.getComponent($10EquipmentItem.default)) || undefined === e ? undefined : e.equipId);
    });
    if (i >= 0) {
      var n = o[i];
      if (!n || !n.isValid) {
        return;
      }
      var a = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
      var c = $10BattleDataProxy.battleDataProxy.battleView.convertToNodeSpaceAR(a);
      this.node.parent = $10BattleDataProxy.battleDataProxy.battleView;
      this.node.position = cc.v3(c);
      this.node.zIndex = 1e4;
      var l = n.convertToWorldSpaceAR(cc.v2(0, 0));
      var u = $10BattleDataProxy.battleDataProxy.battleView.convertToNodeSpaceAR(l);
      var p = Math.floor(1e4 * Math.random()) % 360;
      cc.tween(this.node).to(.5, {
        position: cc.v3(u.addSelf(cc.v2(0, n.height / 2))),
        angle: 720 + p
      }).call(function () {
        var e = $10BattleDataProxy.battleDataProxy.priestZombie.indexOf(t);
        e >= 0 && $10BattleDataProxy.battleDataProxy.priestZombie.splice(e, 1);
      }).delay(2).call(function () {
        e.node.destroy();
        e.node.removeFromParent();
      }).start();
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_EnemyCrucifix;