var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDEnemyCrucifix = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.attractCrucifix = function (t) {
    var e = this;
    var n = $10PlantDefenseDataProxy.plantDefenseDataProxy.plantNode15;
    if (n && n.isValid) {
      var o = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
      var i = $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView.convertToNodeSpaceAR(o);
      this.node.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView;
      this.node.position = cc.v3(i);
      this.node.zIndex = 1e4;
      var a = n.convertToWorldSpaceAR(cc.v2(0, 0));
      var s = $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView.convertToNodeSpaceAR(a);
      var l = Math.floor(1e4 * Math.random()) % 360;
      cc.tween(this.node).to(.5, {
        position: cc.v3(s.addSelf(cc.v2(0, n.height / 2))),
        angle: 720 + l
      }).call(function () {
        var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.priestZombie.indexOf(t);
        e >= 0 && $10PlantDefenseDataProxy.plantDefenseDataProxy.priestZombie.splice(e, 1);
      }).delay(2).call(function () {
        if (e.node && e.node.isValid) {
          e.node.destroy();
          e.node.removeFromParent();
        }
      }).start();
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDEnemyCrucifix;