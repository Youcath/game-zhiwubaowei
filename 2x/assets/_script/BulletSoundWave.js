var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10BattleDataProxy = require("BattleDataProxy");
var $10SkillDataMgr = require("SkillDataMgr");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletSoundWave = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSuperSpine = null;
    e.mNormalSpine = null;
    e._synthesisLv = 0;
    e._atkMaxNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletFire = function (t) {
    var e = this;
    this._synthesisLv = t;
    this._atkMaxNum = 5;
    this.mSuperSpine.node.active = $10BattleDataProxy.battleDataProxy.getIsSuperPlant(15);
    this.mNormalSpine.node.active = !$10BattleDataProxy.battleDataProxy.getIsSuperPlant(15);
    if ($10BattleDataProxy.battleDataProxy.getIsSuperPlant(15)) {
      this.mSuperSpine.node.active = true;
      this.mSuperSpine.setEventListener(function () {
        e.onEventListener();
      });
      this.mSuperSpine.setAnimation(0, "skill", false);
      this.mSuperSpine.setCompleteListener(function () {
        e.node.destroy();
        e.node.removeFromParent();
      });
    } else {
      this.mNormalSpine.node.active = true;
      this.mNormalSpine.setEventListener(function () {
        e.onEventListener();
      });
      this.mNormalSpine.setAnimation(0, "skill", false);
      this.mNormalSpine.setCompleteListener(function () {
        e.node.destroy();
        e.node.removeFromParent();
      });
    }
  };
  _ctor.prototype.onEventListener = function () {
    var t = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
    for (var e = 0; e < t.length; ++e) {
      var o = t[e];
      if (o && o.isValid && $10MathUtil.MathUtil.distance(o.position, this.node.position) <= 150) {
        this._atkMaxNum--;
        var i = o.getComponent($10EnemyBase.default).monsterCfg;
        var n = $10SkillDataMgr.default.instance.getSkillProperty(13, 15);
        var a = 1;
        n && (a = n);
        var u = $10BattleDataProxy.battleDataProxy.getBulletHarm(i.type, 15, this._synthesisLv, 1, 1, a, 1);
        o.getComponent($10EnemyBase.default).beAttack(u, 15);
        if (this._atkMaxNum <= 0) {
          break;
        }
      }
    }
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSuperSpine", undefined);
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mNormalSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BulletSoundWave;