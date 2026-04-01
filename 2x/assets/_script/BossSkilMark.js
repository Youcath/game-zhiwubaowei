var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_BossSkilMark = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.play = function (t) {
    undefined === t && (t = 1);
    this.node.scale = t;
    cc.Tween.stopAllByTarget(this.node);
    var e = cc.tween(this.node).to(.3, {
      scale: t + .3
    }).to(.3, {
      scale: t
    });
    cc.tween(this.node).repeatForever(e).start();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BossSkilMark;