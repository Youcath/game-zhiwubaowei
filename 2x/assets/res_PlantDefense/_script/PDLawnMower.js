var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10SimplyCircleCollider = require("SimplyCircleCollider");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDLawnMower = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mColliderNode = null;
    e._isplay = false;
    e._speed = 670;
    e._maxY = 1e3;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._isplay) {
      this.node.y += this._speed * t;
      this.onMonsterCollider();
      if (Math.abs(this.node.y) > this._maxY) {
        this._isplay = false, this.node.destroy();
      }
    }
  };
  _ctor.prototype.initPlay = function () {
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemy4010", $10HomeEnum.Bundles.RES);
    this._isplay = true;
  };
  _ctor.prototype.onMonsterCollider = function () {
    var t = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers;
    for (var e = 0; e < t.length; ++e) {
      var n = t[e];
      if (n.isValid) {
        var o = n.getChildByName("collision").getComponent($10SimplyRectCollider.default);
        var i = this.mColliderNode.getComponent($10SimplyCircleCollider.default);
        o && i && $10SimplyCollisionDetector.default.isCollisionRectToCircle(o.rect, i.circle) && n.getComponent($10PDEnemyBase.default).beLawnMowerAttack();
      }
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mColliderNode", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDLawnMower;