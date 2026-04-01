var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10SuperBulletPlant15 = require("SuperBulletPlant15");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PlantEquip15 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSuperBulletPlantPb = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.ballCollisionEnter = function () {
    if (this.getCollisionIsValid()) {
      t.prototype.ballCollisionEnter.call(this);
      if (this.addSuperTriggerCounter()) {
        if (!this._atkTargets[0] || !this._atkTargets[0].isValid) {
          return;
        }
        var e = cc.instantiate(this.mSuperBulletPlantPb);
        $10BattleDataProxy.battleDataProxy.bulletView.addChild(e, 1e3);
        var o = $10Util.default.convertToTargetNodeSpace(this.mFireNode, e);
        var i = $10MathUtil.MathUtil.getDoublPointRadian(o, this._atkTargets[0].position.clone());
        var n = Math.floor(cc.misc.radiansToDegrees(i + Math.PI));
        e.position = o;
        e.angle = n + 180;
        e.getComponent($10SuperBulletPlant15.default).initBulletFire(this.level);
      } else {
        this.addTriggerCounter() && this.openFire();
      }
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSuperBulletPlantPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10EquipmentItem.default);
exports.default = def_PlantEquip15;