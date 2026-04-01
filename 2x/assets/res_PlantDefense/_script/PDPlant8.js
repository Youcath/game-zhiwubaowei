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
var $10PDSuperBulletPlant11 = require("PDSuperBulletPlant11");
var $10PDEnemy4001 = require("PDEnemy4001");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDPlantBase = require("PDPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDPlant8 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSuperBulletPb = null;
    e._superTimer = 0;
    e._superAtkPro = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBaseInfo = function (e, n) {
    t.prototype.initBaseInfo.call(this, e, n);
    var o = e.parm.split("|");
    this._superAtkPro = Number(o[0]);
    this._superTimer = Number(o[1]);
  };
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
      var n = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.filter(function (t) {
        return ("PDEnemy4001" != t.name || !t.getComponent($10PDEnemy4001.default).isUnderground) && t.getComponent($10PDEnemyBase.default).pathIdx == e && t.y < $10PlantDefenseDataProxy.PDPlantEnum.MAX_ATK_DISTANCE && "PDEnemy4008" != t.name;
      });
      var o = null;
      n.length > 0 && (o = n.reduce(function (t, e) {
        if (t.y < e.y) {
          return t;
        } else {
          return e;
        }
      }));
      o && this.palyAttackAni(function () {
        var e;
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/launch", $10HomeEnum.Bundles.PlantDefense);
        if ($10PlantDefenseDataProxy.plantDefenseDataProxy.getIsSuperPlant(t.roleId)) {
          (e = cc.instantiate(t.mSuperBulletPb)).getComponent($10PDSuperBulletPlant11.default).setSuperData(t._superTimer, t._superAtkPro);
        } else {
          e = cc.instantiate(t.mbullet);
        }
        $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer.addChild(e);
        e.active = true;
        var n = $10Util.default.nodeParentChangeLocalPos(t.node, $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer);
        n.y += 20;
        e.position = n;
        var i = e.getComponent($10PDBulletBase.default);
        if (i) {
          i.initBullet(t._roleId, o, t.atk);
        } else {
          e.destroy();
        }
      });
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSuperBulletPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDPlantBase.default);
exports.default = def_PDPlant8;