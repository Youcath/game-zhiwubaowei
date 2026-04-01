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
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDPlantBase = require("PDPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDPlant1 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
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
    var e = this;
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead && (this._atkInverval >= 0 && (this._atkInverval -= t), this._atkInverval <= 0)) {
      if ($10PlantDefenseDataProxy.plantDefenseDataProxy.getIsSuperPlant(this.roleId)) {
        for (var n = 0; n < this._isSuperAtkNum; n++) {
          this.scheduleOnce(function () {
            e._atkHurt = Math.floor(e.atk * e._isSuperAtkPro);
            e.attack();
          }, .1 * n);
        }
      } else {
        this._atkHurt = this.atk;
        this.attack();
      }
      this._atkInverval = this.getSpeedAtk();
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
        e.getComponent($10PDBulletPlant.default).initBullet(t._roleId, null, t._atkHurt);
      });
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDPlantBase.default);
exports.default = def_PDPlant1;