var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_SuperBullet6 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSpine = null;
    e._synthesisLv = 0;
    e._superRate = 0;
    e._atkNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (t, e) {
    var o = this;
    this._synthesisLv = t;
    this._superRate = e;
    this.mSpine.setAnimation(0, "atk", true);
    this._atkNum = 5;
    this.mSpine.setEventListener(function (t, e) {
      e.data.name;
      var i = o.node.getComponent($10SimplyRectCollider.default);
      var n = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      o._atkNum--;
      for (var a = 0; a < n.length; ++a) {
        var h = n[a];
        if (i) {
          var d = h.getChildByName("collision").getComponent($10SimplyRectCollider.default);
          if (d && $10SimplyCollisionDetector.default.isCollisionRectToRect(d.rect, i.rect)) {
            var m = h.getComponent($10EnemyBase.default).monsterCfg;
            var f = $10BattleDataProxy.battleDataProxy.getBulletHarm(m.type, 6, o._synthesisLv, 1, 1, 1, o._superRate);
            h.getComponent($10EnemyBase.default).beAttack(f, 6);
          }
        }
      }
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/bulletHit6", $10HomeEnum.Bundles.RES);
      if (o._atkNum <= 0) {
        o.node.destroy();
        o.node.removeFromParent();
      }
    });
  };
  _ctor.prototype.update = function () {};
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_SuperBullet6;