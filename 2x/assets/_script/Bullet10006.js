var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyCircleCollider = require("SimplyCircleCollider");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var $10BulletBase = require("BulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_Bullet10006 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, o, i, n, a) {
    var l = this;
    t.prototype.initBullet.call(this, e, o, i, n, a);
    this._isPenetrate = true;
    this.mSpAni.setCompleteListener(function (t) {
      if ("atk" == (t.animation ? t.animation.name : "")) {
        l.node.destroy();
        l.node.removeFromParent();
      }
    });
    this.mSpAni.setEventListener(function (t, e) {
      e.data.name;
      var o = l.node.getComponent($10SimplyCircleCollider.default);
      var i = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      for (var n = 0; n < i.length; ++n) {
        var a = i[n];
        if (o && a && a.isValid && !l.getIsHaveCollisionNode(a)) {
          var h = a.getChildByName("collision").getComponent($10SimplyRectCollider.default);
          if (h && $10SimplyCollisionDetector.default.isCollisionRectToCircle(h.rect, o.circle)) {
            l.moveArrive(a);
            a.getComponent($10EnemyBase.default).flaser();
          }
        }
      }
    });
    this.mSpAni.setAnimation(0, "atk", false);
  };
  _ctor.prototype.update = function () {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      this.mSpAni.paused = false;
    } else {
      this.mSpAni.paused = true;
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_Bullet10006;