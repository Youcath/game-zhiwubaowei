var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10Util = require("Util");
var $10PDBulletPlant = require("PDBulletPlant");
var $10PDPlantBase = require("PDPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDPlant2 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
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
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/launch", $10HomeEnum.Bundles.PlantDefense);
      for (var e = 0; e < 18; e++) {
        var n = cc.instantiate(t.mbullet);
        $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer.addChild(n);
        n.active = true;
        var o = $10Util.default.nodeParentChangeLocalPos(t.node, $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer);
        var i = 20 * e;
        var a = cc.misc.degreesToRadians(i);
        n.position = o;
        var s = cc.v3(Math.sin(a), Math.cos(a), 0);
        n.getComponent($10PDBulletPlant.default).initBullet(t._roleId, null, t._atkHurt, false, s);
        n.angle = 90 - i;
      }
    });
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDPlantBase.default);
exports.default = def_PDPlant2;