var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletBase = require("BulletBase");
var $10BulletPlant4 = require("BulletPlant4");
var $10SuperBulletPlant4 = require("SuperBulletPlant4");
var $10EquipmentItem = require("EquipmentItem");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PlantEquip4 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSuperBulletPb = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.ballCollisionEnter = function () {
    var e = this;
    if (this.getCollisionIsValid()) {
      t.prototype.ballCollisionEnter.call(this);
      if (this.addSuperTriggerCounter()) {
        var o = Number(this._superPlantData.num);
        var i = $10BattleDataProxy.battleDataProxy.getBulletPathPoints(this._atkTarget.position);
        var n = 0;
        var a = function () {
          if (++n == Math.ceil(o / 2)) {
            var t = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
            for (var a = 0; a < t.length; ++a) {
              var s = t[a];
              if (s && s.isValid && e.getIsAtk(i, s)) {
                var c = s.getComponent($10EnemyBase.default).monsterCfg;
                var l = e._superPlantData.damage1;
                var u = $10BattleDataProxy.battleDataProxy.getBulletHarm(c.type, e.mEquipId, e.level, e._atkCount, e._oneAtkTargetNum, e._superPlantData.damage, l);
                s.getComponent($10EnemyBase.default).beAttack(u, e.mEquipId);
              }
            }
          }
        };
        for (var l = 0; l < o; ++l) {
          var p = Math.floor(100 * Math.random()) % i.length;
          var d = i[p];
          var m = Math.floor(1e3 * Math.random()) % d.width;
          var f = Math.floor(1e3 * Math.random()) % d.height;
          var y = d.x + (-d.width / 2 + m);
          var g = d.y + (-d.height / 2 + f);
          var _ = cc.instantiate(this.mSuperBulletPb);
          $10BattleDataProxy.battleDataProxy.bulletView.addChild(_, 1e3);
          var v = $10Util.default.convertToTargetNodeSpace(this.node, _);
          _.position = v;
          _.getComponent($10BulletBase.default).atkRate = this.getAtkRate();
          _.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
          _.getComponent($10BulletBase.default).initBullet(this.mEquipId, this._atkTarget, this._level, this._atkCount);
          _.getComponent($10BulletBase.default).setAtkPos(cc.v3(y, g));
          _.getComponent($10SuperBulletPlant4.default).startMove(function () {
            e.node && e.node.isValid && a && a();
          });
        }
      } else {
        this.addTriggerCounter() && this.openFire();
      }
    }
  };
  _ctor.prototype.openFire = function () {
    for (var t = 0; t < this._atkTargetNum; ++t) {
      var e = this._atkTargets[t];
      if (e && e.isValid) {
        var o = e.x;
        var i = e.y + e.height;
        var n = cc.instantiate(this.mBulletPb);
        $10BattleDataProxy.battleDataProxy.bulletView.addChild(n, 1e3);
        var a = $10Util.default.convertToTargetNodeSpace(this.node, n);
        n.position = a;
        n.getComponent($10BulletBase.default).atkRate = this.getAtkRate();
        n.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
        n.getComponent($10BulletBase.default).initBullet(this.mEquipId, e, this._level, this._atkCount);
        n.getComponent($10BulletBase.default).setAtkPos(cc.v3(o, i));
        n.getComponent($10BulletPlant4.default).startMove(e);
      }
    }
  };
  _ctor.prototype.getIsAtk = function (t, e) {
    for (var o = 0; o < t.length; ++o) {
      if (t[o].getBoundingBox().contains(e.getPosition())) {
        return true;
      }
    }
    return false;
  };
  _ctor.prototype.getSuperBulletAtkPos = function () {};
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSuperBulletPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10EquipmentItem.default);
exports.default = def_PlantEquip4;