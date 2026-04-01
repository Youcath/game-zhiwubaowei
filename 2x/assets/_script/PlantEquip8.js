var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10BulletBase = require("BulletBase");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PlantEquip8 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.ballCollisionEnter = function () {
    if (this.getCollisionIsValid()) {
      t.prototype.ballCollisionEnter.call(this);
      if (this.addSuperTriggerCounter()) {
        var e = Number(this._superPlantData.num);
        var o = $10BattleDataProxy.battleDataProxy.getPlantAtkTargets(5, this.mEquipId, this._isCharm);
        for (var i = 0; i < e; ++i) {
          var n = o[i];
          if (n && n.isValid) {
            var a = this.addBulletNode(n, this._superPlantData.damage, true);
            a && a.getComponent($10BulletBase.default).setCatapultNumber(5);
          }
        }
      } else {
        this.addTriggerCounter() && this.openFire();
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10EquipmentItem.default);
exports.default = def_PlantEquip8;