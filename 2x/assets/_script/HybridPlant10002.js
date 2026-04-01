var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletBase = require("BulletBase");
var $10HybridPlantBase = require("HybridPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HybridPlant10002 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.useUltimateSkill = function () {
    var t = 0;
    if (this._atkTarget) {
      t = $10MathUtil.MathUtil.getDoublPointRadian(this._atkTarget.position, this.node.position);
    } else {
      var e = Math.floor(1e3 * Math.random()) % 130 + 110;
      t = $10MathUtil.MathUtil.getRadian(e);
    }
    var o = $10NodePoolManager.default.instance.getNode(this.mUltimateSkillPb);
    $10BattleDataProxy.battleDataProxy.bulletView.addChild(o, 1e3);
    var i = $10Util.default.convertToTargetNodeSpace(this.mFireNode, o);
    o.position = i;
    o.getComponent($10BulletBase.default).atkRate = this._hybridPlantData.damage1;
    o.getComponent($10BulletBase.default).superRate = 1;
    o.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
    o.getComponent($10BulletBase.default).initBullet(this.mEquipId, this._atkTarget, this._level, this._atkCount);
    var n = $10Util.default.convertToTargetNodeSpace(this.node, o);
    var a = n.x + cc.winSize.height * Math.cos(t);
    var p = n.y + cc.winSize.height * Math.sin(t);
    o.getComponent($10BulletBase.default).setAtkPos(cc.v3(a, p));
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10HybridPlantBase.default);
exports.default = def_HybridPlant10002;