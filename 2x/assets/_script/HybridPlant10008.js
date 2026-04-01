var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10Bullet10008 = require("Bullet10008");
var $10HybridPlantBase = require("HybridPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HybridPlant10008 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.useUltimateSkill = function () {
    var t = cc.instantiate(this.mUltimateSkillPb);
    $10BattleDataProxy.battleDataProxy.bulletView.addChild(t, 1e3);
    var e = $10Util.default.convertToTargetNodeSpace(this.node, t);
    t.position = e;
    t.getComponent($10Bullet10008.default).initBullet(this._level);
    t.getComponent($10Bullet10008.default).atkRate = this._hybridPlantData.damage1;
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10HybridPlantBase.default);
exports.default = def_HybridPlant10008;