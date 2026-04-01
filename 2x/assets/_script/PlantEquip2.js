var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletBase = require("BulletBase");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PlantEquip2 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSuperBulletPb = null;
    e._bulletNum = 0;
    e._atkCd = 0;
    e._bulletIdx = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (e) {
    t.prototype.update.call(this, e);
    if (this._bulletNum > 0) {
      this._atkCd += e;
      if (this._atkCd >= this._superPlantData.CD) {
        this._atkCd = 0, this._bulletNum--, this.addSuperBullet(), this._bulletNum <= 0 && (this._superIsAtkFinish = true);
      }
    }
  };
  _ctor.prototype.addSuperBullet = function () {
    this._atkTargets = $10BattleDataProxy.battleDataProxy.getPlantAtkTargets(5, this.mEquipId, this._isCharm);
    if (!(this._atkTargets.length <= 0)) {
      var t = this._atkTargets[this._bulletIdx];
      t || (t = this._atkTargets[0]);
      var e = cc.instantiate(this.mSuperBulletPb);
      $10BattleDataProxy.battleDataProxy.bulletView.addChild(e, 1e3);
      var o = $10Util.default.convertToTargetNodeSpace(this.mFireNode, e);
      e.position = o;
      e.getComponent($10BulletBase.default).atkRate = this.getAtkRate();
      e.getComponent($10BulletBase.default).superRate = this._superPlantData.damage1;
      e.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
      e.getComponent($10BulletBase.default).initBullet(this.mEquipId, t, this._level, this._atkCount);
      this._bulletIdx++;
    }
  };
  _ctor.prototype.ballCollisionEnter = function () {
    if (this.getCollisionIsValid()) {
      t.prototype.ballCollisionEnter.call(this);
      if (this.addSuperTriggerCounter()) {
        this._superIsAtkFinish = false, this._bulletIdx = 0, this._bulletNum = Number(this._superPlantData.num) - 1, this.addSuperBullet();
      } else {
        this.addTriggerCounter() && this.openFire();
      }
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSuperBulletPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10EquipmentItem.default);
exports.default = def_PlantEquip2;