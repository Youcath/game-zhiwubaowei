var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BossSkillCharm = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSpine = null;
    e.mSpine2 = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.play = function () {
    this.mSpine.setAnimation(0, "stand", true);
    this.mSpine2.setAnimation(0, "animation", true);
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSpine", undefined);
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSpine2", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BossSkillCharm;