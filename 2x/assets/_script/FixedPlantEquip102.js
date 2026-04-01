var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletBase = require("BulletBase");
var $10SuperBulletPlant6 = require("SuperBulletPlant6");
var $10FixedPlantEquipBase = require("FixedPlantEquipBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_FixedPlantEquip102 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.openFire = function () {
    var t = Number(this._fixedPlantData.num);
    var e = this._fixedPlantData.time;
    var o = this.getFixedPlantAtkNum(this._fixedPlantData.atk, this._fixedPlantData.atkLevelup);
    for (var i = 0; i < t; ++i) {
      var n = $10BattleDataProxy.battleDataProxy.getPathPos(1, i + 1);
      var a = cc.instantiate(this.mBulletPb);
      $10BattleDataProxy.battleDataProxy.bulletView.addChild(a, 1e3);
      var u = $10Util.default.convertToTargetNodeSpace(this.mFireNode, a);
      a.position = u;
      var p = null;
      if (0 == i || 2 == i) {
        p = cc.v3(0, n.y);
      } else {
        1 == i && (p = cc.v3(n.x, 99));
      }
      a.getComponent($10BulletBase.default).setAtkPos(p);
      a.getComponent($10SuperBulletPlant6.default).initAtkPos(i + 1);
      a.getComponent($10SuperBulletPlant6.default).initFixedPlantBullet(o, e, .5);
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10FixedPlantEquipBase.default);
exports.default = def_FixedPlantEquip102;