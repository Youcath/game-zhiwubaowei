var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PDPlantBase = require("PDPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDPlant13 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function () {};
  _ctor.prototype.beAttack = function (t) {
    if (this.mbody) {
      this.mbody.color = cc.Color.RED;
      cc.Tween.stopAllByTarget(this.mbody);
      cc.tween(this.mbody).to(.2, {
        color: cc.Color.WHITE
      }).start();
    }
    this.showHurtLab(t, false);
    this.hp -= t;
    this.hp <= 0 && this.playDeath();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDPlantBase.default);
exports.default = def_PDPlant13;