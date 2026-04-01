var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_WeatherNightLight = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mLight = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.show = function () {
    var t = cc.tween(this.mLight).to(1, {
      opacity: 125
    }).to(1, {
      opacity: 255
    });
    cc.tween(this.mLight).repeatForever(t).start();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mLight", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_WeatherNightLight;