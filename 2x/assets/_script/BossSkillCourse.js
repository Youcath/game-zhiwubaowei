var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10Util = require("Util");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BossSkillCourse = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mFinger = null;
    e._originPos = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.play = function (t, e) {
    var o = this;
    undefined === e && (e = true);
    if (e) {
      var i = t[0];
      this._originPos = $10Util.default.convertToTargetNodeSpace(i, this.node);
      this.node.position = this._originPos;
    } else {
      this.node.position = cc.v3(0, 0, 0);
    }
    if (t.length > 1) {
      if (t[1] && t[1].isValid) {
        this.mFinger.setAnimation(0, "Drag", true);
        var n = $10Util.default.convertToTargetNodeSpace(t[1], this.node);
        var a = cc.tween(this.node).to(1, {
          position: n
        }).call(function () {
          o.node.position = o._originPos;
        });
        cc.tween(this.node).repeatForever(a).start();
      } else {
        this.mFinger.setAnimation(0, "Click", true);
      }
    } else {
      this.mFinger.setAnimation(0, "Click", true);
    }
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mFinger", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BossSkillCourse;