var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_ButtonSafe = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.safeTime = .5;
    e._clickEvents = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    var t = this;
    var e = this.getComponent(cc.Button);
    if (e) {
      this._clickEvents = e.clickEvents;
      this.node.on("click", function () {
        e.clickEvents = [];
        t.scheduleOnce(function () {
          t && t.node && e && (e.clickEvents = t._clickEvents);
        }, t.safeTime);
      });
    }
  };
  cc__decorate([ccp_property(cc.Integer)], _ctor.prototype, "safeTime", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_ButtonSafe;