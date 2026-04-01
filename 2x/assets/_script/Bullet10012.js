var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_Bullet10012 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletSp = null;
    e.mCollimation = null;
    e._synthesisLv = 0;
    e._atkTargetPos = null;
    e._moveIdx = 0;
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
    this.mBulletSp.setCompleteListener(function (e) {
      if ("skill" == (e.animation ? e.animation.name : "")) {
        t.node.destroy();
        t.node.removeFromParent();
      }
    });
    this.mBulletSp.setEventListener(function (e, o) {
      o.data.name;
      $10EventManager.EventManager.instance.emit($10GameEnum.EGameEvent.SCREEN_SHAKE);
      var i = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      for (var n = 0; n < i.length; ++n) {
        var a = i[n];
        if (a && a.isValid && $10MathUtil.MathUtil.distance(a.position, t._atkTargetPos) <= 150) {
          var p = a.getComponent($10EnemyBase.default).monsterCfg;
          var h = $10BattleDataProxy.battleDataProxy.getBulletHarm(p.type, 10012, t._synthesisLv, 1, 1, t._atkRate, 1);
          a.getComponent($10EnemyBase.default).beAttack(h, 10012);
        }
      }
    });
    this.mBulletSp.node.active = false;
    this.mCollimation.active = true;
  };
  _ctor.prototype.initBullet = function (t, e) {
    this._atkTargetPos = t;
    this._synthesisLv = e;
    this.mBulletSp.node.active = false;
    this.mCollimation.active = true;
    this.moveToTarget();
  };
  _ctor.prototype.moveToTarget = function () {
    var t = this;
    if (this._moveIdx > 3) {
      this.mBulletSp.node.position = this._atkTargetPos;
      this.mBulletSp.node.active = true;
      this.mBulletSp.setAnimation(0, "skill", false);
      return void (this.mCollimation.active = false);
    }
    var e = 1e3 * Math.random() % Math.PI;
    var o = 150 - 50 * this._moveIdx;
    var i = this._atkTargetPos.x + o * Math.cos(e);
    var n = this._atkTargetPos.y + o * Math.sin(e);
    cc.Tween.stopAllByTarget(this.mCollimation);
    cc.tween(this.mCollimation).to(.3, {
      position: cc.v3(i, n)
    }).call(function () {
      t.moveToTarget();
    }).start();
    this._moveIdx++;
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mBulletSp", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mCollimation", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_Bullet10012;