var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletBase = require("BulletBase");
var $10HybridPlantBase = require("HybridPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HybridPlant10001 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._ultimateSkillTime = 0;
    e._ultimateSkillNum = 0;
    e._skillStartAngle = 0;
    e._skillNowAngle = 0;
    e._isStartSkill = false;
    e._isAddAngle = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (e) {
    t.prototype.update.call(this, e);
    if ($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.READY && this._isStartSkill && (this._ultimateSkillTime += e, this._ultimateSkillTime >= this._hybridPlantData.CD)) {
      this._ultimateSkillTime -= this._hybridPlantData.CD;
      this._ultimateSkillNum++;
      var o = this.addBulletNode(this._atkTargets[0]);
      if (!o) {
        return;
      }
      var i = this._skillStartAngle + 22.5;
      var n = this._skillStartAngle - 22.5;
      if (this._isAddAngle) {
        this._skillNowAngle += 4.5;
        this._skillNowAngle >= i && (this._isAddAngle = false);
      } else {
        this._skillNowAngle -= 4.5;
        this._skillNowAngle <= n && (this._isAddAngle = true);
      }
      var a = $10MathUtil.MathUtil.getRadian(this._skillNowAngle);
      var p = $10Util.default.convertToTargetNodeSpace(this.node, o);
      var h = p.x + cc.winSize.height * Math.cos(a);
      var d = p.y + cc.winSize.height * Math.sin(a);
      o.getComponent($10BulletBase.default).setAtkPos(cc.v3(h, d));
      o.getComponent($10BulletBase.default).atkRate = this._hybridPlantData.damage1;
      this._ultimateSkillNum >= Number(this._hybridPlantData.num) && (this._isStartSkill = false);
    }
  };
  _ctor.prototype.useUltimateSkill = function () {
    if (this._atkTarget) {
      var t = $10MathUtil.MathUtil.getDoublPointRadian(this._atkTarget.position, this.node.position);
      this._skillStartAngle = $10MathUtil.MathUtil.getAngle(t);
    } else {
      this._skillStartAngle = Math.floor(1e3 * Math.random()) % 130 + 110;
    }
    this._skillNowAngle = this._skillStartAngle;
    this._isAddAngle = true;
    this._isStartSkill = true;
    this._ultimateSkillTime = 0;
    this._ultimateSkillNum = 0;
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10HybridPlantBase.default);
exports.default = def_HybridPlant10001;