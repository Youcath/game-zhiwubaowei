var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10BulletPlant101 = require("BulletPlant101");
var $10FixedPlantEquipBase = require("FixedPlantEquipBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_FixedPlantEquip101 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mXiSpine = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.openFire = function () {
    var t = this._atkTargets[0];
    if (t && t.isValid) {
      var e = cc.instantiate(this.mBulletPb);
      $10BattleDataProxy.battleDataProxy.bulletView.addChild(e, 1e3);
      var o = this.getFixedPlantAtkNum(this._fixedPlantData.atk, this._fixedPlantData.atkLevelup);
      e.getComponent($10BulletPlant101.default).initBullet(o, t);
      e.position = this.getCreatePosition(t);
    }
  };
  _ctor.prototype.getCreatePosition = function (t) {
    if (t.x <= this.node.width / 2 - 275) {
      var e = t.y;
      e = e > 0 ? e > 640 ? 640 : e : e < -358 ? -358 : e;
      return cc.v3(-286, e);
    }
    if (t.y > 0) {
      return cc.v3(t.x, 640);
    } else {
      return cc.v3(t.x, -358);
    }
  };
  _ctor.prototype.update = function (e) {
    t.prototype.update.call(this, e);
    this.isPurchased && (this.mXiSpine.active = $10BattleDataProxy.battleDataProxy.priestZombie.length > 0);
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mXiSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10FixedPlantEquipBase.default);
exports.default = def_FixedPlantEquip101;