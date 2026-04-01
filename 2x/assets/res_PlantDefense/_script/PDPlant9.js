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
var $10PDBulletPlant13 = require("PDBulletPlant13");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDPlantBase = require("PDPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDPlant9 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSuperBulletPb = null;
    e._atkHurt = 0;
    e._isSuperAtkNum = 0;
    e._isSuperAtkPro = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBaseInfo = function (e, n) {
    t.prototype.initBaseInfo.call(this, e, n);
    var o = e.parm.split("|");
    this._isSuperAtkNum = Number(o[0]);
    this._isSuperAtkPro = Number(o[1]);
  };
  _ctor.prototype.update = function (t) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead) {
      this._atkInverval >= 0 && (this._atkInverval -= t);
      if (this._atkInverval <= 0) {
        $10PlantDefenseDataProxy.plantDefenseDataProxy.getIsSuperPlant(this.roleId) ? this._ptAtkTotal >= this._isSuperAtkNum ? (this.attackSkill(true), this._ptAtkTotal = 0) : this.attackSkill(false) : this.attack(), this._atkInverval = this.getSpeedAtk();
      }
    }
  };
  _ctor.prototype.attackSkill = function (t) {
    undefined === t && (t = false);
    this._atkHurt = this.atk;
    t && (this._atkHurt = this.atk * this._isSuperAtkPro);
    var e = this.col + 1;
    var n = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.filter(function (t) {
      var n = t.getComponent($10PDEnemyBase.default);
      return ("PDEnemy4001" != t.name || !t.getComponent("PDEnemy4001").isUnderground) && n.pathIdx == e && "PDEnemy4008" != t.name && t.y < $10PlantDefenseDataProxy.PDPlantEnum.MAX_ATK_DISTANCE;
    });
    if (0 !== n.length) {
      var o = $10Util.default.nodeParentChangeLocalPos(this.node, $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer);
      var i = n.reduce(function (t, e) {
        if (t.position.sub(o).mag() < e.position.sub(o).mag()) {
          return t;
        } else {
          return e;
        }
      });
      if (i) {
        t || (this._ptAtkTotal += 1);
        var a = cc.instantiate(this.mSuperBulletPb);
        $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer.addChild(a, 1e3);
        a.setPosition(i.position);
        var r = a.getComponent($10PDBulletBase.default);
        if (r) {
          r.atkRate = 1;
          r.initBullet(this._roleId, i, this._atkHurt, false);
          r.getComponent($10PDBulletPlant13.default).play(t);
          a.angle = 0;
        } else {
          a.destroy();
        }
      }
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSuperBulletPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDPlantBase.default);
exports.default = def_PDPlant9;