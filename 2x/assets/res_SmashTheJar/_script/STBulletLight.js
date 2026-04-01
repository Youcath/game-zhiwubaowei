var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10SimplyCircleCollider = require("SimplyCircleCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10HomeEnum = require("HomeEnum");
var $10STJDataProxy = require("STJDataProxy");
var $10STMonster = require("STMonster");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_STBulletLight = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSpeAni = null;
    e.mColliderNode = null;
    e._hurt = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletLight = function (t) {
    this._hurt = t;
    this.playLight();
  };
  _ctor.prototype.playLight = function () {
    var t = this;
    this.scheduleOnce(function () {
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/huluobo", $10HomeEnum.Bundles.SmashTheJar);
    }, .1);
    this.mSpeAni.once("finished", function () {
      var e = $10STJDataProxy.sTJDataProxy.enemySoldiers;
      for (var o = 0; o < e.length; ++o) {
        var i = e[o];
        if (i.isValid) {
          var n = i.getChildByName("Collider").getComponent($10SimplyCircleCollider.default);
          var a = t.mColliderNode.getComponent($10SimplyCircleCollider.default);
          if (n && a && $10SimplyCollisionDetector.default.isCollisionCircleToCircle(n.circle, a.circle)) {
            i.getComponent($10STMonster.default).beAttack(t._hurt);
            break;
          }
        }
      }
      t.node.destroy();
      t.node.removeFromParent();
    }, this);
    this.mSpeAni.play("boom");
    return true;
  };
  cc__decorate([ccp_property(cc.Animation)], _ctor.prototype, "mSpeAni", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mColliderNode", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_STBulletLight;