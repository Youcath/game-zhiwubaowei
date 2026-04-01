var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10Util = require("Util");
var $10BulletBase = require("BulletBase");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PlantEquip3 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.ballCollisionEnter = function () {
    if (this.getCollisionIsValid()) {
      t.prototype.ballCollisionEnter.call(this);
      if (this.addSuperTriggerCounter()) {
        var e = Number(this._superPlantData.num);
        var o = 360 / e;
        for (var i = 0; i < e; ++i) {
          var n = this.addBulletNode(this._atkTargets[0], this._superPlantData.damage, true);
          if (n) {
            var a = o * i;
            n.angle = a;
            var l = $10MathUtil.MathUtil.getRadian(a);
            var u = $10Util.default.convertToTargetNodeSpace(this.node, n);
            var p = u.x + cc.winSize.height * Math.cos(l);
            var h = u.y + cc.winSize.height * Math.sin(l);
            n.getComponent($10BulletBase.default).setAtkPos(cc.v3(p, h));
          }
        }
      } else {
        this.addTriggerCounter() && this.openFire();
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10EquipmentItem.default);
exports.default = def_PlantEquip3;