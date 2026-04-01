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
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_WeatherTornado = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._moveTarget = null;
    e._moveSpeed = 3;
    e._checkTime = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.startMove = function (t) {
    this._moveTarget = t;
  };
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PAUSE && this._moveTarget) {
      if ($10MathUtil.MathUtil.distance(this.node.position, this._moveTarget) <= this._moveSpeed) {
        this.node.destroy();
        return void this.node.removeFromParent();
      }
      var e = this.node.position.clone().sub(this._moveTarget.clone()).normalize();
      this.node.x -= this._moveSpeed * e.x;
      this.node.y -= this._moveSpeed * e.y;
      this.node.zIndex = -this.node.y;
      this._checkTime += t;
      if (this._checkTime >= .3) {
        this._checkTime = 0;
        this.plantColliderCheck();
      }
    }
  };
  _ctor.prototype.plantColliderCheck = function () {
    var t;
    var e;
    var o;
    var i;
    var n;
    var a = this.node.getComponent($10SimplyRectCollider.default);
    for (var r = 0; r < (null === (e = null === (t = $10BattleDataProxy.battleDataProxy.equipRoot) || undefined === t ? undefined : t.children) || undefined === e ? undefined : e.length); ++r) {
      var l = $10BattleDataProxy.battleDataProxy.equipRoot.children[r];
      if (a && !(null === (o = l.getComponent($10EquipmentItem.default)) || undefined === o ? undefined : o.isBeWindUp) && !(null === (i = l.getComponent($10EquipmentItem.default)) || undefined === i ? undefined : i.isSpecialPlant)) {
        var h = null === (n = l.getChildByName("root")) || undefined === n ? undefined : n.getChildByName("collisions");
        if (h) {
          for (var d = 0; d < h.childrenCount; ++d) {
            var m = h.children[d].getComponent($10SimplyRectCollider.default);
            if (m && $10SimplyCollisionDetector.default.isCollisionRectToRect(a.rect, m.rect)) {
              l.getComponent($10EquipmentItem.default).beWindUp(this.node);
              this.node.destroy();
              return void this.node.removeFromParent();
            }
          }
        }
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_WeatherTornado;