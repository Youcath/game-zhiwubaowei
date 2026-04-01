var o;
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
var def_PDEnemyBoomDie = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mAnimCtrl = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initEnemyBoomDie = function () {
    var t = this;
    this.mAnimCtrl.loadAnimation($10AnimationCfgMgr.AnimationCfgMgr.instance.getEnemyBoomDie()).then(function () {
      t.node && t.node.isValid && t.mAnimCtrl.playAnim("boomDie", false, function () {
        if (t.node && t.node.isValid) {
          t.node.destroy();
          t.node.removeFromParent();
        }
      }, null, 2);
    });
  };
  cc__decorate([ccp_property({
    type: $10AnimationCtrl.default
  })], _ctor.prototype, "mAnimCtrl", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDEnemyBoomDie;