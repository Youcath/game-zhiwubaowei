var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletPoison = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mPoisonSpine = null;
    e._hurt = null;
    e._continueTime = 0;
    e._plantId = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletPoison = function (t, e, o) {
    var i = this;
    this._hurt = o;
    this._plantId = t;
    this._continueTime = e;
    this.unschedule(this.continueTimer);
    this.schedule(this.continueTimer, 1);
    this.mPoisonSpine.setAnimation(0, "atk_duwu", false);
    this.mPoisonSpine.setCompleteListener(function (t) {
      "atk_duwu" == (t.animation ? t.animation.name : "") && i.mPoisonSpine.setAnimation(0, "duwu_stand", true);
    });
  };
  _ctor.prototype.continueTimer = function () {
    this._continueTime--;
    this.atkEnemy();
    if (this._continueTime <= 0) {
      this.unschedule(this.continueTimer);
      this.node.destroy();
      this.node.removeFromParent();
    }
  };
  _ctor.prototype.atkEnemy = function () {
    var t = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
    for (var e = 0; e < t.length; ++e) {
      var o = t[e];
      o && o.isValid && $10MathUtil.MathUtil.distance(o.position, this.node.position) <= this.node.width / 2 && o.getComponent($10EnemyBase.default).beAttack(this._hurt, this._plantId);
    }
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mPoisonSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BulletPoison;