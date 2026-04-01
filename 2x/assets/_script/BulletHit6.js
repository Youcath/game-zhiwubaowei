var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10SkillDataMgr = require("SkillDataMgr");
var $10EnemyBase = require("EnemyBase");
var $10BulletHit = require("BulletHit");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletHit6 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mHitImg = null;
    e._isBoom = false;
    e._boomTime = 0;
    e._atkNum = 0;
    e._synthesisLv = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletHit = function (t, e) {
    var o = this;
    this._synthesisLv = e;
    this.mHitSpine.setCompleteListener(function (t) {
      if ("skill" == (t.animation ? t.animation.name : "")) {
        o.node.destroy();
        o.node.removeFromParent();
      }
    });
    this._boomTime = 1;
    if ($10BattleDataProxy.battleDataProxy.checkHasSkill(60001)) {
      this._isBoom = true;
      this._atkNum = 5;
    }
    this.mHitSpine.setEventListener(function (t, e) {
      e.data.name;
      var i = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      for (var n = 0; n < i.length; ++n) {
        var a = i[n];
        if (a && a.isValid) {
          if (o._atkNum <= 0) {
            break;
          }
          if ($10MathUtil.MathUtil.distance(a.position, o.node.position) <= 100) {
            o._atkNum--;
            var r = a.getComponent($10EnemyBase.default).monsterCfg;
            var c = $10SkillDataMgr.default.instance.getSkillProperty(13, 6);
            var l = $10BattleDataProxy.battleDataProxy.getBulletHarm(r.type, 6, o._synthesisLv, 1, 1, 1, 1);
            l.num = Math.floor(l.num * c);
            a.getComponent($10EnemyBase.default).beAttack(l, 6, true);
          }
        }
      }
    });
    this.node.zIndex = -this.node.y;
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/bulletHit6", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      this.mHitSpine.node.active && (this.mHitSpine.paused = false);
      if (!(this._boomTime <= 0)) {
        this._boomTime -= t, this._boomTime <= 0 && (this._isBoom ? (this.mHitImg.node.active = false, this.mHitSpine.node.active = true, this.mHitSpine.setAnimation(0, "skill", false)) : (this.node.destroy(), this.node.removeFromParent()));
      }
    } else {
      this.mHitSpine.node.active && (this.mHitSpine.paused = true);
    }
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mHitImg", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletHit.default);
exports.default = def_BulletHit6;