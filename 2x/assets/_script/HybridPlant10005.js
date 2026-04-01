var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletBase = require("BulletBase");
var $10BulletPlant6 = require("BulletPlant6");
var $10HybridPlantBase = require("HybridPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HybridPlant10005 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.useUltimateSkill = function () {
    if (this._atkTarget && this._atkTarget.isValid) {
      var t = $10BattleDataProxy.battleDataProxy.getEnemyPathPoint(this._atkTarget.position).nearestPoint;
      var e = cc.instantiate(this.mUltimateSkillPb);
      $10BattleDataProxy.battleDataProxy.bulletView.addChild(e, -1e3);
      e.position = t.position;
      e.getComponent($10BulletBase.default).atkRate = this._hybridPlantData.damage1;
      e.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
      e.getComponent($10BulletBase.default).initBullet(this.mEquipId, this._atkTarget, this._level, this._atkCount);
    }
  };
  _ctor.prototype.openFire = function () {
    if (this._atkTarget && this._atkTarget.isValid) {
      var t = this._atkTarget.x;
      var e = this._atkTarget.y + this._atkTarget.height;
      var o = cc.instantiate(this.mBulletPb);
      $10BattleDataProxy.battleDataProxy.bulletView.addChild(o, 1e3);
      var i = $10Util.default.convertToTargetNodeSpace(this.node, o);
      o.position = i;
      o.getComponent($10BulletBase.default).atkRate = this.getAtkRate();
      o.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
      o.getComponent($10BulletBase.default).initBullet(this.mEquipId, this._atkTarget, this._level, this._atkCount);
      o.getComponent($10BulletBase.default).setAtkPos(cc.v3(t, e));
      o.getComponent($10BulletPlant6.default).startMove(this._atkTarget);
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10HybridPlantBase.default);
exports.default = def_HybridPlant10005;