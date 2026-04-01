var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletPlant12 = require("BulletPlant12");
var $10FixedPlantEquipBase = require("FixedPlantEquipBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_FixedPlantEquip107 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._bulletNum = 0;
    e._atkCd = 0;
    e._bulletIdx = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (e) {
    t.prototype.update.call(this, e);
    if (this._bulletNum > 0) {
      this._atkCd += e;
      if (this._atkCd >= .3) {
        this._atkCd = 0, this._bulletNum--, this.addSuperBullet();
      }
    }
  };
  _ctor.prototype.openFire = function () {
    this._bulletNum += Number(this._fixedPlantData.num) - 1;
    this._bulletIdx = 0;
    this.addSuperBullet();
  };
  _ctor.prototype.addSuperBullet = function () {
    this._atkTargets = $10BattleDataProxy.battleDataProxy.getPlantAtkTargets(5, this.mEquipId, false);
    if (!(this._atkTargets.length <= 0)) {
      var t = this._atkTargets[this._bulletIdx];
      t || (t = this._atkTargets[0]);
      if (t && t.isValid) {
        var e = this.getFixedPlantAtkNum(this._fixedPlantData.atk, this._fixedPlantData.atkLevelup);
        var o = cc.instantiate(this.mBulletPb);
        $10BattleDataProxy.battleDataProxy.bulletView.addChild(o, 1e3);
        var i = $10Util.default.convertToTargetNodeSpace(this.mFireNode, o);
        o.position = i;
        o.getComponent($10BulletPlant12.default).initFixedPlantBullet(e, t);
        this._bulletIdx++;
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10FixedPlantEquipBase.default);
exports.default = def_FixedPlantEquip107;