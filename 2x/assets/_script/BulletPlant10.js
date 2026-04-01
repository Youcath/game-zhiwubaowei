var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10SkillDataMgr = require("SkillDataMgr");
var $10EnemyBase = require("EnemyBase");
var $10BulletBase = require("BulletBase");
var $10BulletPoison = require("BulletPoison");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletPlant10 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletPoisonPb = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, o, i, n) {
    t.prototype.initBullet.call(this, e, o, i, n);
    this.setBulletSpriteFrame();
  };
  _ctor.prototype.moveArrive = function (e) {
    if (this.getIsChangeAtkTarget()) {
      this.setNextAtkTarget(100);
      e = this._atkTarget;
    }
    this.addBulletHit(e);
    if (e && e.isValid) {
      var o = $10BattleDataProxy.battleDataProxy.checkHasSkill(100001);
      if (o) {
        var i = 100 * o.skillData.probability;
        if (Math.floor(1e3 * Math.random()) % 100 < i) {
          var n = cc.instantiate(this.mBulletPoisonPb);
          $10BattleDataProxy.battleDataProxy.bulletView.addChild(n, 1e3);
          n.position = this.node.position;
          var a = $10SkillDataMgr.default.instance.getSkillProperty(13, this._plantId);
          var l = e.getComponent($10EnemyBase.default).monsterCfg;
          var p = $10BattleDataProxy.battleDataProxy.getBulletHarm(l.type, this._plantId, this._synthesisLv, this._atkCount, this._oneAtkTargetNum, this._atkRate, this._superRate);
          var h = {
            isCrit: p.isCrit,
            num: p.num * a * this._atkRate
          };
          n.getComponent($10BulletPoison.default).initBulletPoison(this._plantId, o.skillData.time, h);
        }
      }
    }
    t.prototype.moveArrive.call(this, e);
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletPoisonPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_BulletPlant10;