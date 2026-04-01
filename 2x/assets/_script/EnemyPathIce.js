var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_EnemyPathIce = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mIceSp = null;
    e.mIceSprite = null;
    e._pathNode = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initEnemyPathIce = function (t, e) {
    var o = this;
    this._pathNode = t;
    var i = "textures/monster/zombieSp/pic_bingkuai1";
    if (5 == e) {
      i = "textures/monster/zombieSp/pic_bingkuai2";
      this.mIceSprite.node.y = 6;
    } else if (13 == e) {
      i = "textures/monster/zombieSp/pic_bingkuai4";
      this.mIceSprite.node.y = -19;
    } else {
      e > 5 && e < 13 && (i = "textures/monster/zombieSp/pic_bingkuai3");
    }
    $10ResUtil.ResUtil.loadAsset({
      path: i,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      o.node && o.node.isValid && (o.mIceSprite.spriteFrame = t);
    }).catch(function (t) {
      console.log("error:", t);
    });
    this.mIceSp.setCompleteListener(function () {
      o._pathNode.PathIce = null;
      var t = $10BattleDataProxy.battleDataProxy.enemyPathIce.indexOf(o.node);
      t >= 0 && $10BattleDataProxy.battleDataProxy.enemyPathIce.splice(t, 0);
      o.node.destroy();
      o.node.removeFromParent();
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
exports.default = def_EnemyPathIce;