var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDSumPlant = require("PDSumPlant");
var $10PDPlantBase = require("PDPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDPlant14 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    var e = this;
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead) {
      this._atkInverval >= 0 && (this._atkInverval -= t);
      if (this._atkInverval <= 0) {
        this.palyAttackAni(function () {
          e.addWood();
        }), this._atkInverval = this.atkSpeed;
      }
    }
  };
  _ctor.prototype.addWood = function () {
    var t = cc.instantiate(this.mbullet);
    t.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.summerLayer;
    t.position = this.node.position;
    t.getComponent($10PDSumPlant.default).init(this.atk);
    var e = 1e3 * Math.random() % (2 * Math.PI);
    var n = cc.v2(this._grid.x + 50 * Math.cos(e), this._grid.y + 50 * Math.sin(e));
    cc.Tween.stopAllByTarget(t);
    var o = cc.v2(this._grid.x + (this._grid.x - n.x) / 2, this._grid.y + 200);
    $10MathUtil.MathUtil.bezierTo(t, .3, t.getPosition(), o, n, function () {}, "").call(function () {}).start();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDPlantBase.default);
exports.default = def_PDPlant14;