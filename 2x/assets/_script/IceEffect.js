var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_IceEffect = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mIceSpine = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.mIceSpine.setCompleteListener(function (e) {
      "start" == (e.animation ? e.animation.name : "") && t.mIceSpine.setAnimation(0, "stand", true);
    });
  };
  _ctor.prototype.play = function () {
    this.mIceSpine.setAnimation(0, "start", false);
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mIceSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_IceEffect;