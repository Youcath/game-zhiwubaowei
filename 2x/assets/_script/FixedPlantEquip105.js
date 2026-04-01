var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletPlant9 = require("BulletPlant9");
var $10FixedPlantEquipBase = require("FixedPlantEquipBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_FixedPlantEquip105 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.openFire = function () {
    var t = cc.instantiate(this.mBulletPb);
    $10BattleDataProxy.battleDataProxy.bulletView.addChild(t, 1e3);
    var e = $10Util.default.convertToTargetNodeSpace(this.mFireNode, t);
    t.position = e;
    var o = this.getFixedPlantAtkNum(this._fixedPlantData.atk, this._fixedPlantData.atkLevelup);
    t.getComponent($10BulletPlant9.default).initFixedPlantBullet(o);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10FixedPlantEquipBase.default);
exports.default = def_FixedPlantEquip105;