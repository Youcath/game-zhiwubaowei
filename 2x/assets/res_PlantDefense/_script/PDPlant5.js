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
var $10PDPlantBase = require("PDPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDPlant5 = function (t) {
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
        $10PlantDefenseDataProxy.plantDefenseDataProxy.getIsSuperPlant(this.roleId) && this._ptAtkTotal >= 5 ? (this.attackSkill(), this._ptAtkTotal = 0) : this.attack(), this._atkInverval = this.getSpeedAtk();
      }
    }
  };
  _ctor.prototype.attackSkill = function () {
    var t = this;
    this._atkHurt = Math.floor(.35 * this.atk);
    this.palyAttackAni(function () {
      for (var e = 0; e < 5; e++) {
        var n = 30 * e - 60;
        var o = n * Math.PI / 180;
        var i = cc.instantiate(t.mSuperBulletPb);
        $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer.addChild(i);
        i.active = true;
        var a = $10Util.default.nodeParentChangeLocalPos(t.node, $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer);
        i.position = a;
        var r = cc.v3(Math.sin(o), Math.cos(o), 0);
        i.getComponent($10PDBulletBase.default).initBullet(t._roleId, null, t._atkHurt, false, r);
        i.angle = n;
      }
    });
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSuperBulletPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDPlantBase.default);
exports.default = def_PDPlant5;