var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_BulletTornado = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._atkPos = null;
    e._moveSpd = 20;
    e._isMoveEnd = false;
    e._existTime = 5;
    e._checkTime = 0;
    e._synthesisLv = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletTornado = function (t, e) {
    this._synthesisLv = e;
    this._atkPos = t;
    this._isMoveEnd = false;
  };
  _ctor.prototype.update = function (t) {
    if (($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) && this._atkPos) {
      if (this._isMoveEnd) {
        this._checkTime += t;
        if (this._checkTime >= .5) {
          this._checkTime = 0;
          this.monsterColliderCheck();
        }
        this._existTime -= t;
        return void (this._existTime <= 0 && (this.node.destroy(), this.node.removeFromParent()));
      }
      if ($10MathUtil.MathUtil.distance(this.node.position, this._atkPos) <= this._moveSpd) {
        this._isMoveEnd = true;
        return void this.monsterColliderCheck();
      }
      var e = this.node.position.clone().sub(this._atkPos.clone()).normalize();
      this.node.x -= this._moveSpd * e.x;
      this.node.y -= this._moveSpd * e.y;
      this.node.zIndex = -this.node.y;
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
          var r = $10BattleDataProxy.battleDataProxy.getBulletHarm(a.type, 5, this._synthesisLv, 1, 1, 1, 1);
          r.num *= .2;
          i.getComponent($10EnemyBase.default).beAttack(r, 5, false, true);
        }
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BulletTornado;