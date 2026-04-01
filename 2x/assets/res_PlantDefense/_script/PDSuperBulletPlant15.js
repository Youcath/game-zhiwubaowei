var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDSuperBulletPlant15 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSpine = null;
    e._superSpeedPro = 0;
    e._superSpeedTime = 0;
    e._superSpeedBack = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletFire = function (t, e, n) {
    var o = this;
    this._superSpeedPro = t;
    this._superSpeedTime = e;
    this._superSpeedBack = n;
    this.mSpine.setEventListener(function () {
      o.onEventListener();
    });
    this.mSpine.setAnimation(0, "skill", false);
    this.mSpine.setCompleteListener(function () {
      o.node.destroy();
      o.node.removeFromParent();
    });
  };
  _ctor.prototype.onEventListener = function () {
    var t = this.node.getComponent($10SimplyRectCollider.default);
    var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
    for (var n = 0; n < e.length; ++n) {
      var o = e[n];
      if (o && o.isValid && "PDEnemy4008" != o.name) {
        var i = o.getChildByName("collision").getComponent($10SimplyRectCollider.default);
        if (i && $10SimplyCollisionDetector.default.isCollisionRectToRect(i.rect, t.rect)) {
          o.getComponent($10PDEnemyBase.default).speedCut(this._superSpeedTime, this._superSpeedPro);
          o.getComponent($10PDEnemyBase.default).beBack(this._superSpeedBack, .2);
        }
      }
    }
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDSuperBulletPlant15;