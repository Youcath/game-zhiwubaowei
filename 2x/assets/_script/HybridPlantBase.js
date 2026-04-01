var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10DataManager = require("DataManager");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_HybridPlantBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mUltimateSkillPb = null;
    e._hybridPlantData = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.setTriggerBarFillRange = function () {};
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
    this._hybridPlantData = $10DataManager.DataManager.instance.eData.data_hybridizationskill[this.mEquipId];
  };
  _ctor.prototype.ballCollisionEnter = function () {
    if (this.getCollisionIsValid()) {
      t.prototype.ballCollisionEnter.call(this);
      if (this.addSuperTriggerCounter()) {
        this.useUltimateSkill();
      } else if (10003 == this.mEquipId || 10007 == this.mEquipId || 10010 == this.mEquipId) {
        this.plantOpenFire(this._atkTarget, false);
      } else {
        this.openFire();
      }
    }
  };
  _ctor.prototype.addFrenzyBullet = function () {
    if (10003 == this.mEquipId || 10007 == this.mEquipId || 10010 == this.mEquipId) {
      this.plantOpenFire(this._atkTarget, false);
    } else {
      this.openFire();
    }
  };
  _ctor.prototype.useUltimateSkill = function () {};
  _ctor.prototype.addSuperTriggerCounter = function () {
    var t = false;
    if (this._atkTargets.length > 0) {
      this._superTriggerCounter++;
      if (this._superTriggerCounter >= this._superTriggerNum) {
        this._superTriggerCounter = 0, t = true, this.addSuperPlantActive();
      }
      this._superTriggerNum > 1 && (this.mCounterBar.fillRange = this._superTriggerCounter / this._superTriggerNum);
    }
    return t;
  };
  _ctor.prototype.setCounterIsShow = function (t) {
    if (t && this.isPurchased) {
      this.mCounterBar.node.parent.active = this._superTriggerNum > 1;
      this._superTriggerNum > 1 && (this.mCounterBar.fillRange = this._superTriggerCounter / this._superTriggerNum);
    } else {
      this.mCounterBar.node.parent.active = false;
    }
  };
  _ctor.prototype.plantOpenFire = function () {};
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mUltimateSkillPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10EquipmentItem.default);
exports.default = def_HybridPlantBase;