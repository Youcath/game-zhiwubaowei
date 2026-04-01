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
var $10PDBulletBase = require("PDBulletBase");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDPlantBase = require("PDPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDPlant6 = function (t) {
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
        this.attack(), this._atkInverval = this.getSpeedAtk();
      }
    }
  };
  _ctor.prototype.attack = function () {
    var t = this;
    if (this._amimState != $10GameEnum.RoleState.Dead) {
      var e = this.col + 1;
      $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.filter(function (t) {
        return t.getComponent($10PDEnemyBase.default).pathIdx == e && t.y < $10PlantDefenseDataProxy.PDPlantEnum.MAX_ATK_DISTANCE;
      }).length > 0 && this.palyAttackAni(function () {
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/launch", $10HomeEnum.Bundles.PlantDefense);
        var e = cc.instantiate(t.mbullet);
        $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer.addChild(e);
        e.active = true;
        var n = $10Util.default.nodeParentChangeLocalPos(t.node, $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer);
        n.y += 20;
        e.position = n;
        var o = e.getComponent($10PDBulletBase.default);
        if (o) {
          o.initBullet(t._roleId, null, t.atk);
          if ($10PlantDefenseDataProxy.plantDefenseDataProxy.getIsSuperPlant(t.roleId)) {
            o.setCatapultNumber(5);
            var i = Math.floor(.2 * t.atk);
            o.setCatapultHurt(i);
          }
        } else {
          e.destroy();
        }
      });
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDPlantBase.default);
exports.default = def_PDPlant6;