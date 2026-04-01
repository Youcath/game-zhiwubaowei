var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BossSkill6 = require("BossSkill6");
var $10BossSkillBase = require("BossSkillBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BossBall = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBossSkillPb = null;
    e._moveNormalize = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBossBall = function () {
    var t = this;
    var e = this.getEmptyGrids();
    var o = cc.v3(-222, -268);
    if (e.length > 0) {
      var i = e[Math.floor(1e4 * Math.random()) % e.length];
      o = $10Util.default.convertToTargetNodeSpace(i, this.node);
    }
    this._moveNormalize = o.clone().sub(this.node.position.clone()).normalize();
    this.bezierTo(cc.v2(this.node.position), this.getC2(cc.v2(this.node.position), cc.v2(o)), cc.v2(o), 2, true, function () {
      t.addBossSkill();
    });
    cc.tween(this.node).to(2, {
      angle: 1800
    }).start();
  };
  _ctor.prototype.addBossSkill = function () {
    var t = cc.instantiate(this.mBossSkillPb);
    this.node.parent.addChild(t);
    t.position = this.node.position;
    t.getComponent($10BossSkill6.default).initMoveNormalize(this._moveNormalize);
    $10BattleDataProxy.battleDataProxy.bossSkillBall.push(t);
    this.node.destroy();
    this.node.removeFromParent();
  };
  _ctor.prototype.update = function () {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      if (this._isPauseGame) {
        this._isPauseGame = false, this.node.resumeAllActions();
      }
    } else if (!this._isPauseGame) {
      this._isPauseGame = true, this.node.pauseAllActions();
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBossSkillPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BossSkillBase.default);
exports.default = def_BossBall;