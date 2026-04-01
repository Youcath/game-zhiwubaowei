var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10Bullet10010 = require("Bullet10010");
var $10BulletBase = require("BulletBase");
var $10BulletPlant11 = require("BulletPlant11");
var $10HybridPlantBase = require("HybridPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HybridPlant10010 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.useUltimateSkill = function () {
    if (this._atkTarget && this._atkTarget.isValid) {
      var t = $10BattleDataProxy.battleDataProxy.getBulletPathPoints(this._atkTarget.position);
      for (var e = 0; e < 5; ++e) {
        var o = t[e];
        o || (o = t[Math.floor(1e3 * Math.random()) % t.length]);
        var i = cc.instantiate(this.mUltimateSkillPb);
        $10BattleDataProxy.battleDataProxy.bulletView.addChild(i, 1e3);
        var n = $10Util.default.convertToTargetNodeSpace(this.node, i);
        i.position = n;
        i.getComponent($10Bullet10010.default).startMove(o, e, this._level);
        i.getComponent($10Bullet10010.default).atkRate = this._hybridPlantData.damage1;
      }
    }
  };
  _ctor.prototype.plantOpenFire = function (t) {
    if (t && t.isValid) {
      var e = t.x;
      var o = t.y + t.height;
      var i = cc.instantiate(this.mBulletPb);
      $10BattleDataProxy.battleDataProxy.bulletView.addChild(i, 1e3);
      var n = $10Util.default.convertToTargetNodeSpace(this.node, i);
      i.position = n;
      i.getComponent($10BulletBase.default).atkRate = this.getAtkRate();
      i.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
      i.getComponent($10BulletBase.default).initBullet(this.mEquipId, t, this._level, this._atkCount);
      i.getComponent($10BulletBase.default).setAtkPos(cc.v3(e, o));
      i.getComponent($10BulletPlant11.default).startMove(t);
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10HybridPlantBase.default);
exports.default = def_HybridPlant10010;