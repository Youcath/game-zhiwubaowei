var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10BulletBase = require("BulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_SuperBulletPlant5 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._atkEnemyNodes = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, o, i, n) {
    t.prototype.initBullet.call(this, e, o, i, n);
    this._isPenetrate = true;
  };
  _ctor.prototype.getIsCanAtk = function (t) {
    for (var e = 0; e < this._atkEnemyNodes.length; ++e) {
      if (this._atkEnemyNodes[e] == t) {
        return false;
      }
    }
    return true;
  };
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      var e = this._moveSpd * (t / 0.016666666666666666);
      var o = this._moveNormalize;
      this.node.x -= e * o.x;
      this.node.y -= e * o.y;
      var i = cc.winSize;
      if (this.node.x > i.width || this.node.x < -i.width || this.node.y > i.height || this.node.y < -i.height) {
        this.node.destroy();
        return void this.node.removeFromParent();
      }
      this._colliderTime -= t;
      if (this._colliderTime <= 0) {
        this._colliderTime = $10GameEnum.EGameEnum.CHECK_COLLIDER_TIME;
        this.monsterColliderCheck(true);
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_SuperBulletPlant5;