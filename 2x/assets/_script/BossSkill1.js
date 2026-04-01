var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10BossSkillCourse = require("BossSkillCourse");
var $10EquipmentItem = require("EquipmentItem");
var $10BossSkillBase = require("BossSkillBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BossSkill1 = function (t) {
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
    this.mSkillSp.setEventListener(function (t, o) {
      o.data.name;
      var i;
      var n;
      var a = [];
      var r = $10DataManager.DataManager.instance.eData.data_bossskill[1];
      for (var s = 0; s < (null === (n = null === (i = $10BattleDataProxy.battleDataProxy.equipRoot) || undefined === i ? undefined : i.children) || undefined === n ? undefined : n.length); ++s) {
        (h = $10BattleDataProxy.battleDataProxy.equipRoot.children[s]).getComponent($10EquipmentItem.default).isPurchased && (h.getComponent($10EquipmentItem.default).isIce || a.push(h));
      }
      var u = false;
      for (s = 0; s < r.num && !(a.length <= 0); ++s) {
        var h;
        var d = Math.floor(1e3 * Math.random()) % a.length;
        if ((h = a[d]) && h.isValid) {
          h.getComponent($10EquipmentItem.default).ice(r.click);
          a.splice(d, 1);
          if (!(h.getComponent($10EquipmentItem.default).bossSkillCourse || u)) {
            u = true, e.addBossSkillCourse(h);
          }
        }
      }
    });
  };
  _ctor.prototype.play = function () {
    this.mSkillSp.setAnimation(0, "skill", false);
  };
  _ctor.prototype.addBossSkillCourse = function (t) {
    $10BattleDataProxy.battleDataProxy.bossSkillCourseIds.indexOf(1) >= 0 || $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/effect/BossSkillCourse",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      var o = cc.instantiate(e);
      $10BattleDataProxy.battleDataProxy.top1.addChild(o);
      o.getComponent($10BossSkillCourse.default).play([t]);
      t.getComponent($10EquipmentItem.default).bossSkillCourse = o;
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSkillSp", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BossSkillBase.default);
exports.default = def_BossSkill1;