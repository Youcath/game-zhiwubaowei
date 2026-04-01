var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HomeBulletPlant = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mLastPos = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.setAngle = function () {
    var t = this.node.position;
    if (this.mLastPos) {
      var e = -1e4;
      if (t != this.mLastPos) {
        var o = t.sub(this.mLastPos);
        var i = cc.v2(o);
        var n = cc.v2(1, 0);
        var a = i.magSqr();
        var r = n.magSqr();
        if (0 == a || 0 == r) {
          return;
        }
        var s = i.signAngle(n);
        var c = Math.floor(cc.misc.radiansToDegrees(s));
        e = c;
        c = -c;
        this.node.angle = c;
        this.mLastPos = t;
      }
      return e;
    }
    this.mLastPos = t;
  };
  _ctor.prototype.update = function () {
    this.setAngle();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_HomeBulletPlant;