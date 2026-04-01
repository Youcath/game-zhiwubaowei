var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_STThunderEffect = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mHunderSpine = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.mHunderSpine.setCompleteListener(function () {
      t.node.destroy();
      t.node.removeFromParent();
    });
  };
  _ctor.prototype.onEnable = function () {
    this.mHunderSpine.setAnimation(0, "atk", false);
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mHunderSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_STThunderEffect;