var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10Bullet10009 = require("Bullet10009");
var $10BulletBase = require("BulletBase");
var $10HybridPlantBase = require("HybridPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HybridPlant10009 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.useUltimateSkill = function () {
    if (this._atkTarget && this._atkTarget.isValid) {
      var t = $10BattleDataProxy.battleDataProxy.getBulletPathPointsEx(this._atkTarget.position).slice();
      for (var e = 0; e < 5; ++e) {
        var o = t[e];
        var i = false;
        if (!o) {
          var n = Math.floor(100 * Math.random()) % t.length;
          o = t[n];
          i = true;
          t.splice(n, 1);
        }
        var a = cc.instantiate(this.mUltimateSkillPb);
        $10BattleDataProxy.battleDataProxy.bulletView.addChild(a);
        a.position = o.nearestPoint.position;
        a.getComponent($10BulletBase.default).atkRate = this._hybridPlantData.damage1;
        a.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
        a.getComponent($10BulletBase.default).initBullet(this.mEquipId, this._atkTarget, this._level, this._atkCount);
        a.getComponent($10Bullet10009.default).initOrientation(o.nearestIdx, e, i);
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10HybridPlantBase.default);
exports.default = def_HybridPlant10009;