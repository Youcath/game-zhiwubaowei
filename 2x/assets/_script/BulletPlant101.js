var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletPlant101 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSpine = null;
    e._atkNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (t) {
    var e = this;
    this._atkNum = t;
    this.mSpine.setEventListener(function () {
      var t;
      var o = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      var i = e.node.getComponent($10SimplyRectCollider.default);
      for (var n = 0; n < o.length; ++n) {
        var a = o[n];
        if (a && a.isValid) {
          var u = a.getChildByName("collision").getComponent($10SimplyRectCollider.default);
          if (u && $10SimplyCollisionDetector.default.isCollisionRectToRect(u.rect, i.rect)) {
            var p = null === (t = a.getComponent($10EnemyBase.default)) || undefined === t ? undefined : t.monsterCfg;
            if (!p) {
              continue;
            }
            var h = $10BattleDataProxy.battleDataProxy.getFixedPlantBulletHarm(e._atkNum, p.atkType, 1);
            a.getComponent($10EnemyBase.default).beAttack(h, 101);
            a.getComponent($10EnemyBase.default).flaser();
          }
        }
      }
    });
    this.mSpine.setCompleteListener(function () {
      e.node.destroy();
      e.node.removeFromParent();
    });
    this.play();
  };
  _ctor.prototype.play = function () {
    this.mSpine.setAnimation(0, "skill", false);
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BulletPlant101;