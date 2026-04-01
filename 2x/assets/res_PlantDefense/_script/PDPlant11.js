var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDSuperBulletPlant15 = require("PDSuperBulletPlant15");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDPlantBase = require("PDPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDPlant11 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSuperBulletPb = null;
    e._atkHurt = 0;
    e._isSuperAtkNum = 0;
    e._isSuperSpeedPro = 0;
    e._isSuperSpeedTime = 0;
    e._isSuperSpeedBack = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBaseInfo = function (e, n) {
    t.prototype.initBaseInfo.call(this, e, n);
    var o = e.parm.split("|");
    this._isSuperAtkNum = Number(o[0]);
    this._isSuperSpeedPro = Number(o[1]);
    this._isSuperSpeedTime = Number(o[2]);
    this._isSuperSpeedBack = Number(o[3]);
  };
  _ctor.prototype.update = function (t) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead) {
      this._atkInverval >= 0 && (this._atkInverval -= t);
      if (this._atkInverval <= 0) {
        this._atkHurt = this.atk, $10PlantDefenseDataProxy.plantDefenseDataProxy.getIsSuperPlant(this.roleId) ? this._ptAtkTotal >= this._isSuperAtkNum ? (this.attackSkill(), this._ptAtkTotal = 0) : this.attack() : (this.attack(), this._ptAtkTotal = 0), this._atkInverval = this.getSpeedAtk();
      }
    }
  };
  _ctor.prototype.attackSkill = function () {
    var t = this.col + 1;
    if (0 !== $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.filter(function (e) {
      var n = e.getComponent($10PDEnemyBase.default);
      return !("PDEnemy4002" == e.name && !e.getComponent("PDEnemy4002").getIsCanChoose()) && n.pathIdx == t && "PDEnemy4008" != e.name;
    }).length) {
      var e = cc.instantiate(this.mSuperBulletPb);
      $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer.addChild(e, 1e3);
      e.setPosition(this.node.position.x, this.node.position.y + 20);
      var n = e.getComponent($10PDSuperBulletPlant15.default);
      if (n) {
        n.initBulletFire(this._isSuperSpeedPro, this._isSuperSpeedTime, this._isSuperSpeedBack);
      } else {
        e.destroy();
      }
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSuperBulletPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDPlantBase.default);
exports.default = def_PDPlant11;