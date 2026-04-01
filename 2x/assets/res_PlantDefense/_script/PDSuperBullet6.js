var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10HomeEnum = require("HomeEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDSuperBullet6 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSpine = null;
    e._synthesisLv = 0;
    e._superRate = 0;
    e._atkNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (t, e) {
    var n = this;
    this._synthesisLv = t;
    this._superRate = e;
    this.mSpine.setAnimation(0, "atk", true);
    this._atkNum = 5;
    this.mSpine.setEventListener(function (t, e) {
      e.data.name;
      var o = n.node.getComponent($10SimplyRectCollider.default);
      var i = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
      n._atkNum--;
      for (var a = 0; a < i.length; ++a) {
        var d = i[a];
        if (o && "PDEnemy4008" != d.name) {
          var h = d.getChildByName("collision").getComponent($10SimplyRectCollider.default);
          h && $10SimplyCollisionDetector.default.isCollisionRectToRect(h.rect, o.rect) && d.getComponent($10PDEnemyBase.default).monsterCfg;
        }
      }
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/bulletHit6", $10HomeEnum.Bundles.RES);
      if (n._atkNum <= 0) {
        n.node.destroy();
        n.node.removeFromParent();
      }
    });
  };
  _ctor.prototype.update = function () {};
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDSuperBullet6;