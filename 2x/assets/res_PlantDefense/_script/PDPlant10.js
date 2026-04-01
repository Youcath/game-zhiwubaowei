var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10Util = require("Util");
var $10PDBulletBase = require("PDBulletBase");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDPlantBase = require("PDPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDPlant10 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSuperBulletPb = null;
    e._atkHurt = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead) {
      this._atkInverval >= 0 && (this._atkInverval -= t);
      if (this._atkInverval <= 0) {
        this.attack(), $10PlantDefenseDataProxy.plantDefenseDataProxy.getIsSuperPlant(this.roleId) ? this._ptAtkTotal >= 5 && (this.attackSkill(), this._ptAtkTotal = 0) : this._ptAtkTotal = 0, this._atkInverval = this.getSpeedAtk();
      }
    }
  };
  _ctor.prototype.attackSkill = function () {
    this._atkHurt = this.atk;
    var t = this.col + 1;
    var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.filter(function (e) {
      return e.getComponent($10PDEnemyBase.default).pathIdx == t && "PDEnemy4008" != e.name && e.y < $10PlantDefenseDataProxy.PDPlantEnum.MAX_ATK_DISTANCE;
    });
    if (0 !== e.length) {
      var n = $10Util.default.nodeParentChangeLocalPos(this.node, $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer);
      var o = e.reduce(function (t, e) {
        if (t.position.sub(n).mag() < e.position.sub(n).mag()) {
          return t;
        } else {
          return e;
        }
      });
      var i = cc.instantiate(this.mSuperBulletPb);
      $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer.addChild(i, 1e3);
      i.setPosition(o.position);
      var a = i.getComponent($10PDBulletBase.default);
      if (a) {
        a.atkRate = 1;
        a.initBullet(this._roleId, o, this._atkHurt, false);
        i.angle = 0;
      } else {
        i.destroy();
      }
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSuperBulletPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDPlantBase.default);
exports.default = def_PDPlant10;