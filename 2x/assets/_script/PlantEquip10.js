var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletBase = require("BulletBase");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PlantEquip10 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSuperBulletPb = null;
    e._checkSdTime = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (e) {
    t.prototype.update.call(this, e);
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      this._checkSdTime += e;
      this._checkSdTime;
    }
  };
  _ctor.prototype.ballCollisionEnter = function () {
    if (this.getCollisionIsValid() && this.getIsCanAtk()) {
      t.prototype.ballCollisionEnter.call(this);
      if (this.addSuperTriggerCounter()) {
        var e = cc.instantiate(this.mSuperBulletPb);
        $10BattleDataProxy.battleDataProxy.bulletView.addChild(e, 1e3);
        var o = $10Util.default.convertToTargetNodeSpace(this.node, e);
        e.position = o.clone().addSelf(cc.v3(0, -72));
        e.getComponent($10BulletBase.default).atkRate = this.getAtkRate();
        e.getComponent($10BulletBase.default).superRate = this._superPlantData.damage1;
        e.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
        e.getComponent($10BulletBase.default).initBullet(this.mEquipId, this._atkTarget, this._level, this._atkCount);
      } else {
        this.addTriggerCounter() && this.openFire();
      }
    }
  };
  _ctor.prototype.getIsCanAtk = function () {
    if ($10BattleDataProxy.battleDataProxy.getIsSuperPlant(10) && $10BattleDataProxy.battleDataProxy.isActiveSuperPlant) {
      return true;
    }
    if (10 == this.equipId && this._level < 5) {
      if (!this._isShukuchi) {
        return true;
      }
      if (!$10BattleDataProxy.battleDataProxy.checkHasSkill(100004)) {
        return false;
      }
    }
    return true;
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSuperBulletPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10EquipmentItem.default);
exports.default = def_PlantEquip10;