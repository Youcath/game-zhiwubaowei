var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EnemyBase = require("EnemyBase");
var $10AnimationCfgMgr = require("AnimationCfgMgr");
var $10AnimationCtrl = require("AnimationCtrl");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GTBulletHit = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mIsSpAni = false;
    e.mAnimCtrl = null;
    e.mTargetNode = null;
    e._bulletId = 0;
    e.otherBullets = ["CWzidan1_2", "CWzidan8_2", "CWzidan11_2"];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletHit = function (t, e) {
    var o = this;
    var i = Number(t.match(/\d+/)[0]);
    this._bulletId = i;
    this.mAnimCtrl.clearAnimEvent();
    if (this.otherBullets.includes(t)) {
      this.node.scale = .45;
      this.mAnimCtrl.loadAnimation($10AnimationCfgMgr.AnimationCfgMgr.instance.getGTBulletHit(t)).then(function () {
        o.node && o.node.isValid && o.mAnimCtrl.playAnim("liekai2", false, function () {
          var t;
          o.mTargetNode && o.mTargetNode.isValid && (null === (t = o.mTargetNode.getComponent($10EnemyBase.default)) || undefined === t || t.removeHitEffectNode(o.node, o._bulletId));
          e && e();
        }, null, 3.5);
      });
    } else {
      this.node.scale = 1;
      var a = t.includes("CW");
      this.mAnimCtrl.loadAtlasAnimation($10AnimationCfgMgr.AnimationCfgMgr.instance.getBulletHitCfg(i, 1, a)).then(function () {
        o.node && o.node.isValid && o.mAnimCtrl.playAnim("bulletHit", false, function () {
          var t;
          o.mTargetNode && o.mTargetNode.isValid && (null === (t = o.mTargetNode.getComponent($10EnemyBase.default)) || undefined === t || t.removeHitEffectNode(o.node, o._bulletId));
          e && e();
        }, null, 3.5);
      });
    }
  };
  cc__decorate([ccp_property()], _ctor.prototype, "mIsSpAni", undefined);
  cc__decorate([ccp_property({
    type: $10AnimationCtrl.default,
    tooltip: "是否展示Img",
    visible: function () {
      return !this.mIsSpAni;
    }
  })], _ctor.prototype, "mAnimCtrl", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_GTBulletHit;