var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AnimationCfgMgr = require("AnimationCfgMgr");
var $10AnimationCtrl = require("AnimationCtrl");
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDBulletHit = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mIsSpAni = false;
    e.mAnimCtrl = null;
    e.mHitSpine = null;
    e.mTargetNode = null;
    e._bulletId = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletHit = function (t, e, n) {
    var o = this;
    this._bulletId = t;
    this.mAnimCtrl.clearAnimEvent();
    this.mAnimCtrl.loadAtlasAnimation($10AnimationCfgMgr.AnimationCfgMgr.instance.getBulletHitCfg(t, e, n)).then(function () {
      o.node && o.node.isValid && o.mAnimCtrl.playAnim("bulletHit", false, function () {
        var t;
        o.mTargetNode && o.mTargetNode.isValid && (null === (t = o.mTargetNode.getComponent($10PDEnemyBase.default)) || undefined === t || t.removeHitEffectNode(o.node, o._bulletId));
        o.node.destroy();
        o.node.removeFromParent();
      }, null, 3.5);
    });
  };
  cc__decorate([ccp_property()], _ctor.prototype, "mIsSpAni", undefined);
  cc__decorate([ccp_property({
    type: $10AnimationCtrl.default,
    tooltip: "是否展示Img",
    visible: function () {
      return !this.mIsSpAni;
    }
  })], _ctor.prototype, "mAnimCtrl", undefined);
  cc__decorate([ccp_property({
    type: sp.Skeleton,
    tooltip: "是否展示spine",
    visible: function () {
      return this.mIsSpAni;
    }
  })], _ctor.prototype, "mHitSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDBulletHit;