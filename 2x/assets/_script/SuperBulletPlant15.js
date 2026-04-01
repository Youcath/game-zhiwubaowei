var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var $10HeavyFogEffect = require("HeavyFogEffect");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_SuperBulletPlant15 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSpine = null;
    e._synthesisLv = 0;
    e._atkNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletFire = function (t) {
    var e = this;
    this._synthesisLv = t;
    this._atkNum = 10;
    this.mSpine.setEventListener(function () {
      e.onEventListener();
    });
    this.mSpine.setAnimation(0, "skill", false);
    this.mSpine.setCompleteListener(function () {
      e.node.destroy();
      e.node.removeFromParent();
    });
  };
  _ctor.prototype.onEventListener = function () {
    var t;
    var e = this.node.getComponent($10SimplyRectCollider.default);
    var o = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
    for (var i = 0; i < o.length; ++i) {
      var n = o[i];
      if (n && n.isValid) {
        if (this._atkNum <= 0) {
          break;
        }
        var a = n.getChildByName("collision").getComponent($10SimplyRectCollider.default);
        if (a && $10SimplyCollisionDetector.default.isCollisionRectToRect(a.rect, e.rect)) {
          var h = $10DataManager.DataManager.instance.eData.datasuperplant[15].damage1;
          var d = n.getComponent($10EnemyBase.default).monsterCfg;
          var m = $10BattleDataProxy.battleDataProxy.getBulletHarm(d.type, 15, this._synthesisLv, 1, 1, 1, h);
          n.getComponent($10EnemyBase.default).beAttack(m, 15);
          this._atkNum--;
        }
      }
    }
    var f = (null === (t = $10BattleDataProxy.battleDataProxy.weatherHeavyFog) || undefined === t ? undefined : t.children) || [];
    for (i = 0; i < f.length; ++i) {
      var y = f[i];
      var g = null == y ? undefined : y.getComponent($10SimplyRectCollider.default);
      g && $10SimplyCollisionDetector.default.isCollisionRectToRect(e.rect, g.rect) && y.getComponent($10HeavyFogEffect.default).beBlownAway(this.node);
    }
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_SuperBulletPlant15;