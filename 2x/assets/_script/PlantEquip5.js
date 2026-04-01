var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletBase = require("BulletBase");
var $10BulletTornado = require("BulletTornado");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PlantEquip5 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSuperBulletPb = null;
    e.mBulletTornadoPb = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.ballCollisionEnter = function () {
    if (this.getCollisionIsValid()) {
      t.prototype.ballCollisionEnter.call(this);
      if (this.addSuperTriggerCounter()) {
        var e = this.getTargetRadian(this._atkTargets[0]);
        var o = Math.floor(cc.misc.radiansToDegrees(e + Math.PI));
        var i = Number(this._superPlantData.num);
        for (var n = 0; n < i; ++n) {
          var a = cc.instantiate(this.mSuperBulletPb);
          $10BattleDataProxy.battleDataProxy.bulletView.addChild(a, 1e3);
          var u = $10Util.default.convertToTargetNodeSpace(this.mFireNode, a);
          a.position = u;
          a.getComponent($10BulletBase.default).atkRate = this.getAtkRate();
          a.getComponent($10BulletBase.default).superRate = this._superPlantData.damage1;
          a.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
          a.getComponent($10BulletBase.default).initBullet(this.mEquipId, this._atkTarget, this._level, this._atkCount);
          var p = this.getBulletStartAngleEx(i, n, o);
          a.angle = p;
          var h = $10MathUtil.MathUtil.getRadian(p);
          var d = $10Util.default.convertToTargetNodeSpace(this.node, a);
          var m = d.x + cc.winSize.height * Math.cos(h);
          var f = d.y + cc.winSize.height * Math.sin(h);
          a.getComponent($10BulletBase.default).setAtkPos(cc.v3(m, f));
        }
      } else {
        this.addTriggerCounter() && this.openFire();
      }
    }
  };
  _ctor.prototype.getBulletStartAngleEx = function (t, e, o) {
    var i = 45 / t;
    return o + Math.floor(t / 2) * i - i * e;
  };
  _ctor.prototype.fireBulletTornado = function (t) {
    if ($10BattleDataProxy.battleDataProxy.getIsSuperPlant(this.mEquipId)) {
      var e = $10BattleDataProxy.battleDataProxy.getPlantAtkTargets(1, this.mEquipId, this._isCharm)[0];
      if (!e) {
        var o = $10BattleDataProxy.battleDataProxy.pathPointView.children;
        e = o[Math.floor(1e3 * Math.random()) % o.length];
      }
      if (e && e.isValid) {
        var i = cc.instantiate(this.mBulletTornadoPb);
        $10BattleDataProxy.battleDataProxy.bulletView.addChild(i);
        var n = $10Util.default.convertToTargetNodeSpace(t, i);
        i.position = n;
        i.getComponent($10BulletTornado.default).initBulletTornado(e.position.clone(), this.level);
      }
    }
  };
  _ctor.prototype.beWindUp = function (t) {
    this.fireBulletTornado(t);
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSuperBulletPb", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletTornadoPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10EquipmentItem.default);
exports.default = def_PlantEquip5;