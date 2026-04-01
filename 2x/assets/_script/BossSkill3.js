var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BossSkillCourse = require("BossSkillCourse");
var $10GameUI = require("GameUI");
var $10EquipmentItem = require("EquipmentItem");
var $10MapGridItem = require("MapGridItem");
var $10BossSkillBase = require("BossSkillBase");
var $10EnemyThiefMark = require("EnemyThiefMark");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BossSkill3 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSkillSp = null;
    e.mMarkPb = null;
    e._markPlant = null;
    e._markHoldGrid = "";
    e._markTime = 0;
    e._skillData = null;
    e._isCapture = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.play = function () {
    var t;
    var e;
    var o = this;
    this.mSkillSp.setCompleteListener(function () {
      o.node.destroy();
      o.node.removeFromParent();
    });
    this.mSkillSp.setEventListener(function (t, e) {
      var i = e.data.name;
      console.log("eventName:", i);
      var n = $10BattleDataProxy.battleDataProxy.gridsMap.get(o._markHoldGrid);
      o._markNode.destroy();
      o._markNode.removeFromParent();
      if (n) {
        var a = n.getComponent($10MapGridItem.default).belongTo;
        a && a.getComponent($10EquipmentItem.default).beCapture(o.node);
      }
    });
    this.mSkillSp.node.active = false;
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/bossSkill3", $10HomeEnum.Bundles.RES);
    var i = [];
    for (var n = 0; n < (null === (e = null === (t = $10BattleDataProxy.battleDataProxy.equipRoot) || undefined === t ? undefined : t.children) || undefined === e ? undefined : e.length); ++n) {
      var a = $10BattleDataProxy.battleDataProxy.equipRoot.children[n];
      a.getComponent($10EquipmentItem.default).isSpecialPlant || i.push(a);
    }
    if (i.length <= 0) {
      this.node.destroy();
      return void this.node.removeFromParent();
    }
    this._skillData = $10DataManager.DataManager.instance.eData.data_bossskill[3];
    var s = Math.floor(1e3 * Math.random()) % i.length;
    this._markPlant = i[s];
    var c = this._markPlant.getComponent($10EquipmentItem.default).holdGrids;
    var d = Math.floor(1e3 * Math.random()) % c.length;
    this._markHoldGrid = c[d];
    var g = $10BattleDataProxy.battleDataProxy.gridsMap.get(this._markHoldGrid);
    var _ = $10Util.default.convertToTargetNodeSpace(g, this.node);
    this.node.position = _;
    var v = g.getComponent($10MapGridItem.default).belongTo;
    var b = [g];
    if (v) {
      var P = this.getEmptyGrids();
      if (P.length > 0) {
        var D = Math.floor(100 * Math.random()) % P.length;
        b.push(P[D]);
      } else {
        var S = Math.floor(100 * Math.random()) % $10GameUI.ROW_MAX + "-" + Math.floor(100 * Math.random()) % $10GameUI.COL_MAX;
        var E = $10BattleDataProxy.battleDataProxy.gridsMap.get(S);
        b.push(E);
      }
    }
    this.addMark(_, v, b);
  };
  _ctor.prototype.addMark = function (t, e, o) {
    var i = this;
    this._markNode = cc.instantiate(this.mMarkPb);
    $10BattleDataProxy.battleDataProxy.battleView.addChild(this._markNode);
    this._markNode.position = cc.v3(t.x, t.y + cc.winSize.height);
    this._markNode.getComponent($10EnemyThiefMark.default).play(t, function () {
      i.addBossSkillCourse(e, o);
    });
  };
  _ctor.prototype.addBossSkillCourse = function (t, e) {
    $10BattleDataProxy.battleDataProxy.bossSkillCourseIds.indexOf(3) >= 0 || t && t.isValid && e.length > 0 && $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/effect/BossSkillCourse",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (o) {
      var i = cc.instantiate(o);
      $10BattleDataProxy.battleDataProxy.top1.addChild(i);
      i.getComponent($10BossSkillCourse.default).play(e);
      t.getComponent($10EquipmentItem.default).bossSkillCourse = i;
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.update = function (t) {
    if (!($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.READY)) {
      if ($10BattleDataProxy.battleDataProxy.isStartFight) {
        if (!this._isCapture) {
          this._markTime += t, this._markTime >= this._skillData.keepTime && (this.mSkillSp.node.active = true, this._isCapture = true, this.mSkillSp.setAnimation(0, "atk", false));
        }
      } else {
        this.removeSelf();
      }
    }
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSkillSp", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mMarkPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BossSkillBase.default);
exports.default = def_BossSkill3;