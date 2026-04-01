var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10Util = require("Util");
var $10PDBulletPlant12 = require("PDBulletPlant12");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDPlantBase = require("PDPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDPlant20 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.attack = function () {
    var t = this;
    if (this._amimState != $10GameEnum.RoleState.Dead) {
      var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.filter(function (t) {
        return !t.getComponent($10PDEnemyBase.default).getIsDie() && t.y < $10PlantDefenseDataProxy.PDPlantEnum.MAX_ATK_DISTANCE;
      });
      e.length > 0 && this.palyAttackAni(function () {
        var n = cc.instantiate(t.mbullet);
        $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer.addChild(n);
        var o = $10Util.default.nodeParentChangeLocalPos(t.node, $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer);
        n.active = true;
        n.position = o;
        var i = e[$10Util.default.getRandomNum(0, e.length - 1)];
        var a = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.filter(function (t) {
          return "PDEnemy4008" == t.name;
        });
        a.length > 0 && (i = a[$10Util.default.getRandomNum(0, a.length - 1)]);
        n.getComponent($10PDBulletPlant12.default).initBullet(t._roleId, i, t.atk, true);
      });
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDPlantBase.default);
exports.default = def_PDPlant20;