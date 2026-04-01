var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AnimationCfgMgr = require("AnimationCfgMgr");
var $10AnimationCtrl = require("AnimationCtrl");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletBoom = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mAnimCtrl = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletBoom = function (t) {
    var e = this;
    undefined === t && (t = null);
    this.mAnimCtrl.loadAtlasAnimation($10AnimationCfgMgr.AnimationCfgMgr.instance.getBulletBoom()).then(function () {
      t && t();
      e.node && e.node.isValid && e.mAnimCtrl.playAnim("bulletBoom", false, function () {
        e.node.destroy();
        e.node.removeFromParent();
      }, null, 2);
    });
  };
  cc__decorate([ccp_property({
    type: $10AnimationCtrl.default
  })], _ctor.prototype, "mAnimCtrl", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BulletBoom;