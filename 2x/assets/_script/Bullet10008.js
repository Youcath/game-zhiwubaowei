var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_Bullet10008 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletSp = null;
    e._synthesisLv = 0;
    e._atkRate = 1;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "atkRate", {
    set: function (t) {
      this._atkRate = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.mBulletSp.setCompleteListener(function () {
      t.node.destroy();
      t.node.removeFromParent();
    });
    this.mBulletSp.setEventListener(function (e, o) {
      o.data.name;
      var i = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      for (var n = 0; n < i.length; ++n) {
        var a = i[n];
        if (a && a.isValid) {
          var c = a.getComponent($10EnemyBase.default).monsterCfg;
          var l = $10BattleDataProxy.battleDataProxy.getBulletHarm(c.type, 10008, t._synthesisLv, 1, 1, t._atkRate, 1);
          a.getComponent($10EnemyBase.default).beAttack(l, 10008, true);
        }
      }
    });
  };
  _ctor.prototype.initBullet = function (t) {
    this._synthesisLv = t;
    this.mBulletSp.setAnimation(0, "skill", false);
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mBulletSp", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_Bullet10008;