var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EquipmentItem = require("EquipmentItem");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PlantEquip1 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._continuousAtkMaxTime = 0;
    e._continuousAtkTime = 0;
    e._continuousAtkCd = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (e) {
    t.prototype.update.call(this, e);
    if (!($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.READY)) {
      if (this._continuousAtkMaxTime > 0) {
        this._continuousAtkCd += e;
        if (this._continuousAtkCd >= this._continuousAtkTime) {
          this._continuousAtkCd = 0, this.addBulletNode(this._atkTarget, null, true), this.setAtkTarget();
        }
        this._continuousAtkMaxTime -= e;
        if (this._continuousAtkMaxTime <= 0) {
          this._superIsAtkFinish = true, this._continuousAtkMaxTime = 0;
        }
      } else if (this._continuouFireNum > 0) {
        this._continuouFireTime += e, this._continuouFireTime >= .1 && (this._continuouFireNum--, this._continuouFireTime = 0, this.addBulletNode(this._atkTarget));
      }
    }
  };
  _ctor.prototype.setAtkTarget = function () {
    var t = false;
    if (this._atkTarget && this._atkTarget.isValid) {
      this._atkTarget.getComponent($10EnemyBase.default).getIsDie() && (t = true);
    } else {
      t = true;
    }
    if (t) {
      var e = $10BattleDataProxy.battleDataProxy.getPlantAtkTargets(1, this.mEquipId, this._isCharm);
      e.length > 0 && (this._atkTarget = e[0]);
    }
  };
  _ctor.prototype.frenzyCollisionEnter = function () {
    this._continuousAtkMaxTime = 0;
    this._continuouFireNum = 0;
    this._superIsAtkFinish = true;
    t.prototype.frenzyCollisionEnter.call(this);
  };
  _ctor.prototype.ballCollisionEnter = function () {
    if (this._superIsAtkFinish && !this._isIce) {
      t.prototype.ballCollisionEnter.call(this);
      if (this.addSuperTriggerCounter()) {
        this._continuouFireNum = 0, this._continuouFireTime = 0, this._superIsAtkFinish = false, this._continuousAtkMaxTime = Number(this._superPlantData.num) * this._superPlantData.CD, this._continuousAtkTime = this._superPlantData.CD, this._continuousAtkCd = 0;
      } else {
        this.addTriggerCounter() && this.openFire();
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10EquipmentItem.default);
exports.default = def_PlantEquip1;