var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EquipmentItem = require("EquipmentItem");
var $10BossSkillBase = require("BossSkillBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BossSkill7 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSkillSp = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    var e = this;
    t.prototype.onLoad.call(this);
    this.mSkillSp.setCompleteListener(function () {
      e.node.destroy();
      e.node.removeFromParent();
    });
    this.mSkillSp.setEventListener(function (t, e) {
      e.data.name;
      var o;
      var i;
      var n = [];
      var a = $10DataManager.DataManager.instance.eData.data_bossskill[7];
      for (var l = 0; l < (null === (i = null === (o = $10BattleDataProxy.battleDataProxy.equipRoot) || undefined === o ? undefined : o.children) || undefined === i ? undefined : i.length); ++l) {
        (u = $10BattleDataProxy.battleDataProxy.equipRoot.children[l]).getComponent($10EquipmentItem.default).isSpecialPlant || n.push(u);
      }
      for (l = 0; l < a.num && !(n.length <= 0); ++l) {
        var u;
        var p = Math.floor(1e3 * Math.random()) % n.length;
        if ((u = n[p]) && u.isValid) {
          u.getComponent($10EquipmentItem.default).charm(a.keepTime);
          n.splice(p, 1);
        }
      }
    });
  };
  _ctor.prototype.play = function () {
    this.mSkillSp.setAnimation(0, "skill", false);
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSkillSp", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BossSkillBase.default);
exports.default = def_BossSkill7;