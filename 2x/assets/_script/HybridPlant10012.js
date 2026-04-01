var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10Bullet10012 = require("Bullet10012");
var $10HybridPlantBase = require("HybridPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HybridPlant10012 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.useUltimateSkill = function () {
    if (this._atkTarget && this._atkTarget.isValid) {
      var t = $10BattleDataProxy.battleDataProxy.getEnemyPathPoint(this._atkTarget.position);
      var e = cc.instantiate(this.mUltimateSkillPb);
      $10BattleDataProxy.battleDataProxy.bulletView.addChild(e, 1e3);
      var o = $10Util.default.convertToTargetNodeSpace(this.node, e);
      e.position = o;
      var i = e.getChildByName("collimation");
      var n = $10Util.default.convertToTargetNodeSpace(t.nearestPoint, i);
      e.getComponent($10Bullet10012.default).initBullet(n, this._level);
      e.getComponent($10Bullet10012.default).atkRate = this._hybridPlantData.damage1;
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10HybridPlantBase.default);
exports.default = def_HybridPlant10012;