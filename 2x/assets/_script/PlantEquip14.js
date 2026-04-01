var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletBase = require("BulletBase");
var $10BulletPlant14 = require("BulletPlant14");
var $10SuperBulletPlant14 = require("SuperBulletPlant14");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PlantEquip14 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSuperBulletPb = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.ballCollisionEnter = function () {
    if (this.getCollisionIsValid()) {
      t.prototype.ballCollisionEnter.call(this);
      if (this.addSuperTriggerCounter()) {
        if (!this._atkTarget) {
          return;
        }
        var e = $10BattleDataProxy.battleDataProxy.getEnemyPathPoint(this._atkTarget.position);
        if (!e.nearestPoint) {
          return void console.log("没有最近的方块");
        }
        var o = cc.instantiate(this.mSuperBulletPb);
        $10BattleDataProxy.battleDataProxy.bulletView.addChild(o, 1e3);
        var i = $10Util.default.convertToTargetNodeSpace(e.nearestPoint, o);
        o.position = i;
        o.getComponent($10BulletBase.default).atkRate = this.getAtkRate();
        o.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
        o.getComponent($10BulletBase.default).initBullet(this.mEquipId, this._atkTarget, this._level, this._atkCount);
        o.getComponent($10SuperBulletPlant14.default).initOrientation(e.nearestIdx);
      } else {
        this.addTriggerCounter() && this.openFire();
      }
    }
  };
  _ctor.prototype.openFire = function () {
    var t = 1;
    var e = 0;
    var o = $10BattleDataProxy.battleDataProxy.checkHasSkill(140001);
    var i = $10BattleDataProxy.battleDataProxy.checkHasSkill(140004);
    o && (e = 100 * o.skillData.probability);
    i && (e = 100 * i.skillData.probability);
    Math.floor(1e3 * Math.random()) % 100 + 1 <= e && (t = 2);
    for (var n = 0; n < t; ++n) {
      var a = this._atkTargets[0];
      if (!a || !a.isValid) {
        return;
      }
      var u = a.x;
      var p = a.y + a.height;
      var h = cc.instantiate(this.mBulletPb);
      $10BattleDataProxy.battleDataProxy.bulletView.addChild(h, 1e3);
      var d = $10Util.default.convertToTargetNodeSpace(this.node, h);
      h.position = d;
      h.getComponent($10BulletBase.default).atkRate = this.getAtkRate();
      h.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
      h.getComponent($10BulletBase.default).initBullet(this.mEquipId, a, this._level, this._atkCount);
      h.getComponent($10BulletBase.default).setAtkPos(cc.v3(u, p));
      h.getComponent($10BulletPlant14.default).startMove(a, n);
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSuperBulletPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10EquipmentItem.default);
exports.default = def_PlantEquip14;