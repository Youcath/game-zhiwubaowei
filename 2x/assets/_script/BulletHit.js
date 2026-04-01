var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AnimationCfgMgr = require("AnimationCfgMgr");
var $10AnimationCtrl = require("AnimationCtrl");
var $10NodePoolManager = require("NodePoolManager");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletHit = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mIsSpAni = false;
    e.mAnimCtrl = null;
    e.mHitSpine = null;
    e.mTargetNode = null;
    e._bulletId = 0;
    e._isUltimateSkill = false;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "isUltimateSkill", {
    set: function (t) {
      this._isUltimateSkill = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.initBulletHit = function (t, e, o) {
    var i = this;
    this._bulletId = t;
    this.mAnimCtrl.clearAnimEvent();
    this.mAnimCtrl.loadAtlasAnimation($10AnimationCfgMgr.AnimationCfgMgr.instance.getBulletHitCfg(t, e, o)).then(function () {
      i.node && i.node.isValid && i.mAnimCtrl.playAnim("bulletHit", false, function () {
        var t;
        i.mTargetNode && i.mTargetNode.isValid && (null === (t = i.mTargetNode.getComponent($10EnemyBase.default)) || undefined === t || t.removeHitEffectNode(i.node, i._bulletId));
        $10NodePoolManager.default.instance.putNode(i.node);
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
exports.default = def_BulletHit;