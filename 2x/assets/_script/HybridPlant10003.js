var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletBase = require("BulletBase");
var $10BulletPlant6 = require("BulletPlant6");
var $10HybridPlantBase = require("HybridPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HybridPlant10003 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._atkIdx = 0;
    e._atkTime = 0;
    e._isUseUltimate = false;
    e._atkUltimateTargets = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (e) {
    t.prototype.update.call(this, e);
    if (($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) && this._isUseUltimate && (this._atkTime += e, this._atkTime >= .1)) {
      this._atkTime = 0;
      var o = this.getAtkNode();
      o && o.isValid && this.plantOpenFire(o, true);
      this._atkIdx++;
      this._atkIdx > 10 && (this._isUseUltimate = false);
    }
  };
  _ctor.prototype.useUltimateSkill = function () {
    this._isUseUltimate = true;
    this._atkIdx = 0;
    this._atkTime = 0;
    this._atkUltimateTargets = [];
    this._atkUltimateTargets = $10BattleDataProxy.battleDataProxy.getPlantAtkTargets(10, this.mEquipId, this._isCharm);
  };
  _ctor.prototype.getAtkNode = function () {
    return this._atkUltimateTargets[this._atkIdx] || $10BattleDataProxy.battleDataProxy.getPlantAtkTargets(1, this.mEquipId, this._isCharm)[0];
  };
  _ctor.prototype.plantOpenFire = function (t, e) {
    if (t && t.isValid) {
      var o = t.x;
      var i = t.y + t.height;
      var n = cc.instantiate(this.mBulletPb);
      $10BattleDataProxy.battleDataProxy.bulletView.addChild(n, 1e3);
      var a = $10Util.default.convertToTargetNodeSpace(this.node, n);
      n.position = a;
      n.getComponent($10BulletBase.default).atkRate = e ? this._hybridPlantData.damage1 : 1;
      n.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
      n.getComponent($10BulletBase.default).initBullet(this.mEquipId, t, this._level, this._atkCount);
      n.getComponent($10BulletBase.default).setAtkPos(cc.v3(o, i));
      n.getComponent($10BulletPlant6.default).startMove(t);
      n.getComponent($10BulletBase.default).isUltimateSkill = e;
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10HybridPlantBase.default);
exports.default = def_HybridPlant10003;