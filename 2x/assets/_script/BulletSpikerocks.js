var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletSpikerocks = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSpine = null;
    e._atkRate = 0;
    e._synthesisLv = 0;
    e._continueTime = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletSpikerocks = function (t) {
    var e = this;
    this._synthesisLv = t;
    this._continueTime = 5;
    this.mSpine.setAnimation(0, "atk", true);
    this._atkRate = $10DataManager.DataManager.instance.eData.datasuperplant[12].damage1;
    this.mSpine.setEventListener(function (t, o) {
      o.data.name;
      e.monsterColliderCheck();
    });
    this.node.zIndex = -this.node.y;
  };
  _ctor.prototype.update = function (t) {
    if (!($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.READY)) {
      this._continueTime -= t;
      if (this._continueTime <= 0) {
        this.node.destroy(), this.node.removeFromParent();
      }
    }
  };
  _ctor.prototype.monsterColliderCheck = function () {
    var t = this.node.getComponent($10SimplyRectCollider.default);
    var e = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
    for (var o = 0; o < e.length; ++o) {
      var i = e[o];
      if (t && i && i.isValid) {
        var n = i.getChildByName("collision").getComponent($10SimplyRectCollider.default);
        if (n && $10SimplyCollisionDetector.default.isCollisionRectToRect(n.rect, t.rect)) {
          var a = i.getComponent($10EnemyBase.default).monsterCfg;
          var c = $10BattleDataProxy.battleDataProxy.getBulletHarm(a.type, 12, this._synthesisLv, 1, 1, this._atkRate, 1);
          i.getComponent($10EnemyBase.default).beAttack(c, 12);
        }
      }
    }
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BulletSpikerocks;