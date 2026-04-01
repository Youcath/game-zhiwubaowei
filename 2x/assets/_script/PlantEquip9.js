var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10BulletBase = require("BulletBase");
var $10BulletPlant13 = require("BulletPlant13");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PlantEquip9 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSuperBulletPb = null;
    e._thunderTime = 0;
    e._equipRageEffect = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.ballCollisionEnter = function () {
    if (this.getCollisionIsValid()) {
      t.prototype.ballCollisionEnter.call(this);
      if (this.addSuperTriggerCounter()) {
        this.addSuperBullet(true);
      } else {
        this.addTriggerCounter() && this.openFireEx();
      }
    }
  };
  _ctor.prototype.openFireEx = function () {
    if ($10BattleDataProxy.battleDataProxy.getIsSuperPlant(this.mEquipId) || this._isRage) {
      this.addSuperBullet(false);
    } else {
      this.openFire();
    }
  };
  _ctor.prototype.addSuperBullet = function (t) {
    if (this._atkTarget && this._atkTarget.isValid) {
      var e = cc.instantiate(this.mSuperBulletPb);
      $10BattleDataProxy.battleDataProxy.bulletView.addChild(e, 1e3);
      e.position = this._atkTarget.position;
      e.getComponent($10BulletBase.default).atkRate = this.getAtkRate();
      e.getComponent($10BulletBase.default).superRate = this._superPlantData.damage1;
      e.getComponent($10BulletBase.default).initBullet(this.mEquipId, this._atkTarget, this._level, this._atkCount, this._isRage);
      e.getComponent($10BulletPlant13.default).play(t);
    } else {
      console.log("目标丢失!");
    }
  };
  _ctor.prototype.lightningStroke = function () {
    if (13 == $10BattleDataProxy.battleDataProxy.battleData.superPlantId) {
      this.addEquipRageEffect();
      this._thunderTime = 10;
      $10BattleDataProxy.battleDataProxy.getIsSuperPlant(13) || $10AudioManager.AudioManager.instance.playEffectPath("sounds/getPlant", $10HomeEnum.Bundles.RES);
    } else {
      this.addEquipDizziness();
    }
  };
  _ctor.prototype.addEquipRageEffect = function () {
    var t = this;
    if (!this._isRage) {
      if (this._equipRageEffect && this._equipRageEffect.isValid) {
        this._equipRageEffect.active = true;
      } else {
        $10ResUtil.ResUtil.loadAsset({
          path: "prefabs/effect/EquipRageEffect",
          type: cc.Prefab,
          bundleName: $10HomeEnum.Bundles.GAME
        }).then(function (e) {
          if (t.node && t.node.isValid) {
            t._equipRageEffect = cc.instantiate(e);
            t._root.addChild(t._equipRageEffect);
            t._equipRageEffect.position = cc.v3(0, 0, 0);
            t.setSuperPlantIcon();
          }
        }).catch(function (t) {
          console.log("error:", t);
        });
      }
    }
    this._isRage = true;
    this.setSuperPlantIcon();
  };
  _ctor.prototype.update = function (e) {
    t.prototype.update.call(this, e);
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._isRage) {
      this._thunderTime -= e;
      if (this._thunderTime <= 0) {
        this._thunderTime = 0, this._isRage = false, this._equipRageEffect && this._equipRageEffect.isValid && (this._equipRageEffect.active = false), this.setSuperPlantIcon();
      }
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSuperBulletPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10EquipmentItem.default);
exports.default = def_PlantEquip9;