var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10Bullet10011 = require("Bullet10011");
var $10HybridPlantBase = require("HybridPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HybridPlant10011 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.useUltimateSkill = function () {
    if (this._atkTarget && this._atkTarget.isValid) {
      var t = cc.instantiate(this.mUltimateSkillPb);
      $10BattleDataProxy.battleDataProxy.bulletView.addChild(t, 1e3);
      var e = $10Util.default.convertToTargetNodeSpace(this.node, t);
      t.position = e;
      t.getComponent($10Bullet10011.default).initBullet(this._atkTargets, this._level);
      t.getComponent($10Bullet10011.default).atkRate = this._hybridPlantData.damage1;
    }
  };
  _ctor.prototype.initAtkTargets = function () {
    this._atkTargets = $10BattleDataProxy.battleDataProxy.getPlantAtkTargets(5, this.mEquipId, this._isCharm);
    this._atkTarget = this._atkTargets[0];
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10HybridPlantBase.default);
exports.default = def_HybridPlant10011;