var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10BulletBase = require("BulletBase");
var $10HybridPlantBase = require("HybridPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HybridPlant10006 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.useUltimateSkill = function () {
    if (this._atkTarget && this._atkTarget.isValid) {
      var t = $10BattleDataProxy.battleDataProxy.getBulletPathPoints(this._atkTarget.position);
      for (var e = 0; e < 3; ++e) {
        var o = t[e];
        var i = cc.instantiate(this.mUltimateSkillPb);
        $10BattleDataProxy.battleDataProxy.bulletView.addChild(i, 1e3);
        i.position = o.position;
        i.getComponent($10BulletBase.default).atkRate = this._hybridPlantData.damage1;
        i.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
        i.getComponent($10BulletBase.default).initBullet(this.mEquipId, this._atkTarget, this._level, this._atkCount);
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10HybridPlantBase.default);
exports.default = def_HybridPlant10006;