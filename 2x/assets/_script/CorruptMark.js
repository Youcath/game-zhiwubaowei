var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_CorruptMark = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.updateMark = function (t) {
    var e = this.node.children;
    for (var o = 0; o < t; ++o) {
      var i = e[o];
      if (!i) {
        break;
      }
      i.getChildByName("mark").active = true;
    }
    var n = e[t - 1];
    if (n) {
      cc.Tween.stopAllByTarget(n);
      n.active = true;
      n.scale = 7;
      n.opacity = 100;
      cc.tween(n).to(.2, {
        scale: 1,
        opacity: 255
      }).start();
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_CorruptMark;