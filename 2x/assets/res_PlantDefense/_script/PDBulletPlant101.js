var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDBulletPlant101 = function (t) {
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
      var t = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
      var n = e.node.getComponent($10SimplyRectCollider.default);
      for (var o = 0; o < t.length; ++o) {
        var i = t[o];
        if (i && i.isValid && "PDEnemy4008" != i.name) {
          var a = i.getChildByName("collision").getComponent($10SimplyRectCollider.default);
          a && $10SimplyCollisionDetector.default.isCollisionRectToRect(a.rect, n.rect);
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
exports.default = def_PDBulletPlant101;