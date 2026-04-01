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
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var $10BulletHit = require("BulletHit");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletHit10003 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mHitImg = null;
    e._atkNum = 0;
    e._synthesisLv = 0;
    e._boomTime = 1;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletHit = function (t, e) {
    var o = this;
    this._synthesisLv = e;
    this.mHitImg.node.active = !this._isUltimateSkill;
    this.mHitSpine.node.active = this._isUltimateSkill;
    this._boomTime = 1;
    this.node.zIndex = -this.node.y;
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/bulletHit6", $10HomeEnum.Bundles.RES);
    this._atkNum = 5;
    if (this._isUltimateSkill) {
      this.mHitSpine.setAnimation(0, "stand", true);
      this.mHitSpine.setCompleteListener(function (t) {
        if ("skill" == (t.animation ? t.animation.name : "")) {
          o.node.destroy();
          o.node.removeFromParent();
        }
      });
      this.mHitSpine.setEventListener(function (t, e) {
        e.data.name;
        var i = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
        var n = $10DataManager.DataManager.instance.eData.data_hybridizationskill[10003];
        for (var a = 0; a < i.length; ++a) {
          var r = i[a];
          if (r && r.isValid) {
            if (o._atkNum <= 0) {
              break;
            }
            if ($10MathUtil.MathUtil.distance(r.position, o.node.position) <= 150) {
              var c = r.getComponent($10EnemyBase.default).monsterCfg;
              var l = $10BattleDataProxy.battleDataProxy.getBulletHarm(c.type, 10003, o._synthesisLv, 1, 1, n.damage1, 1);
              r.getComponent($10EnemyBase.default).beAttack(l, 6, true);
              o._atkNum--;
            }
          }
        }
      });
    }
  };
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      this.mHitSpine.node.active && (this.mHitSpine.paused = false);
      if (!(this._boomTime <= 0)) {
        this._boomTime -= t, this._boomTime <= 0 && (this._isUltimateSkill ? (this.mHitSpine.node.active = true, this.mHitSpine.setAnimation(0, "skill", false)) : (this.node.destroy(), this.node.removeFromParent()));
      }
    } else {
      this.mHitSpine.node.active && (this.mHitSpine.paused = true);
    }
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mHitImg", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletHit.default);
exports.default = def_BulletHit10003;