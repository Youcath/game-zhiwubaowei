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
var $10SuperBullet6 = require("SuperBullet6");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PlantEquip6 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSuperBulletPb = null;
    e.mSuperBulletPbEx = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.ballCollisionEnter = function () {
    if (this.getCollisionIsValid()) {
      t.prototype.ballCollisionEnter.call(this);
      if (this.addSuperTriggerCounter()) {
        var e = $10BattleDataProxy.battleDataProxy.getBulletPathPointsEx(this._atkTarget.position);
        for (var o = 0; o < 3; ++o) {
          var i = e[o];
          if (i) {
            var n = cc.instantiate(this.mSuperBulletPbEx);
            $10BattleDataProxy.battleDataProxy.bulletView.addChild(n, 1e3);
            n.position = i.nearestPoint.position;
            n.getComponent($10SuperBullet6.default).initBullet(this._level, this._superPlantData.damage1);
          }
        }
      } else {
        this.addTriggerCounter() && this.openFire();
      }
    }
  };
  _ctor.prototype.lightningStroke = function () {};
  _ctor.prototype.openFire = function () {
    if (this._atkTarget && this._atkTarget.isValid) {
      var t = this._atkTarget.x;
      var e = this._atkTarget.y + this._atkTarget.height;
      var o = null;
      o = $10BattleDataProxy.battleDataProxy.isActiveSuperPlant && 6 == $10BattleDataProxy.battleDataProxy.battleData.superPlantId ? cc.instantiate(this.mSuperBulletPb) : cc.instantiate(this.mBulletPb);
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
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSuperBulletPb", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSuperBulletPbEx", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10EquipmentItem.default);
exports.default = def_PlantEquip6;