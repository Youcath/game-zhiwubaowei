var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDEnemyPathIce = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mIceSp = null;
    e.mIceSprite = null;
    e._pathNode = null;
    e.pathIdx = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initEnemyPathIce = function (t, e, n) {
    var o = this;
    this.pathIdx = n;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/monster/zombieSp/pic_bingkuai1",
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      o.node && o.node.isValid && (o.mIceSprite.spriteFrame = t);
    }).catch(function (t) {
      console.log("error:", t);
    });
    this.mIceSp.setCompleteListener(function () {
      var t = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemyPathIce.indexOf(o.node);
      t >= 0 && $10PlantDefenseDataProxy.plantDefenseDataProxy.enemyPathIce.splice(t, 0);
      if (o.node && o.node.isValid) {
        o.node.destroy();
        o.node.removeFromParent();
      }
    });
  };
  _ctor.prototype.playIceSp = function () {
    this.mIceSprite.node.active = false;
    this.mIceSp.node.active = true;
    this.mIceSp.setAnimation(0, "songhua", false);
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mIceSp", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mIceSprite", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDEnemyPathIce;