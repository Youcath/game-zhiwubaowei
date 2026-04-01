var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MapBlockEffect = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSpine = null;
    e.mSnowEffect = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.mSpine.setCompleteListener(function (e) {
      e.animation && e.animation.name;
      t.node.destroy();
      t.node.removeFromParent();
    });
    if (this.mSnowEffect) {
      this.mSnowEffect.setCompleteListener(function (e) {
        e.animation && e.animation.name;
        t.node.destroy();
        t.node.removeFromParent();
      });
      this.mSnowEffect.node.active = $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.IceAndSnow;
    }
    this.mSpine.node.active = $10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.IceAndSnow;
  };
  _ctor.prototype.play = function (t, e) {
    if (e && this.mSnowEffect) {
      this.mSnowEffect.node.active = true;
      this.mSpine.node.active = false;
      this.mSnowEffect.setAnimation(0, "hit" + t, false);
      this.mSnowEffect.timeScale = 2;
    } else {
      this.mSnowEffect && (this.mSnowEffect.node.active = false);
      this.mSpine.node.active = true;
      this.mSpine.setAnimation(0, "broken" + t, false);
      this.mSpine.timeScale = 2;
    }
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSpine", undefined);
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSnowEffect", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_MapBlockEffect;