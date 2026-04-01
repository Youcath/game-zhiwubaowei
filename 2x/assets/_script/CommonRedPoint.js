var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var r;
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
(function (t) {
  t[t.BREATHE = 0] = "BREATHE";
  t[t.FLOAT = 1] = "FLOAT";
})(r || (r = {}));
var def_CommonRedPoint = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.animType = r.BREATHE;
    e._initScale = 0;
    e._initY = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    this._initScale = this.node.scale;
    this._initY = this.node.y;
  };
  _ctor.prototype.onEnable = function () {
    cc.Tween.stopAllByTarget(this.node);
  };
  _ctor.prototype.setRedPointState = function (t, e) {
    this.node.active = t;
    if (e) {
      this.node.getChildByName("Num").active = true;
      this.node.getChildByName("Num").getComponent(cc.Label).string = "" + e;
    }
  };
  cc__decorate([ccp_property({
    type: cc.Enum(r)
  })], _ctor.prototype, "animType", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_CommonRedPoint;