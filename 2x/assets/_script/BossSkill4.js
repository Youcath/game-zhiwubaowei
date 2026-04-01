var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyCircleCollider = require("SimplyCircleCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10BulletBall = require("BulletBall");
var $10MapGridItem = require("MapGridItem");
var $10BossSkillBase = require("BossSkillBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BossSkill4 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSkillSp = null;
    e.mBlackHole = null;
    e._continueTime = 0;
    e._skillData = null;
    e._gridItem = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.play = function () {
    var t = this;
    this.mSkillSp.setCompleteListener(function () {
      t.mBlackHole.active = true;
      t.mSkillSp.node.active = false;
      $10BattleDataProxy.battleDataProxy.blackHoleNodes.push(t.node);
    });
    this._skillData = $10DataManager.DataManager.instance.eData.data_bossskill[4];
    var e = this.getEmptyGrids();
    if (e.length <= 0) {
      var o = $10BattleDataProxy.battleDataProxy.blackHoleNodes.indexOf(this.node);
      o >= 0 && $10BattleDataProxy.battleDataProxy.blackHoleNodes.splice(o, 1);
      this.node.destroy();
      return void this.node.removeFromParent();
    }
    var i = Math.floor(1e4 * Math.random()) % e.length;
    this._gridItem = e[i];
    this._gridItem.getComponent($10MapGridItem.default).isBlackHole = true;
    this.node.parent = $10BattleDataProxy.battleDataProxy.blackHoleView;
    this.node.position = this._gridItem.position;
  };
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      this._continueTime += t;
      if (this._continueTime >= this._skillData.keepTime) {
        this._gridItem.getComponent($10MapGridItem.default).isBlackHole = false;
        var e = $10BattleDataProxy.battleDataProxy.blackHoleNodes.indexOf(this.node);
        e >= 0 && $10BattleDataProxy.battleDataProxy.blackHoleNodes.splice(e, 1);
        this.node.destroy();
        this.node.removeFromParent();
      } else {
        this.ballColliderCheck();
      }
    }
  };
  _ctor.prototype.ballColliderCheck = function () {
    if (this.mBlackHole.active) {
      var t = this.node.getComponent($10SimplyCircleCollider.default);
      var e = $10BattleDataProxy.battleDataProxy.bulletBalls.slice();
      for (var o = 0; o < e.length; ++o) {
        var i = e[o];
        if (t) {
          var n = i.getComponent($10SimplyCircleCollider.default);
          if (n && $10SimplyCollisionDetector.default.isCollisionCircleToCircle(n.circle, t.circle)) {
            var a = $10BattleDataProxy.battleDataProxy.bulletBalls.indexOf(i);
            a >= 0 && $10BattleDataProxy.battleDataProxy.bulletBalls.splice(a, 1);
            i.getComponent($10BulletBall.default).blackHole(this.node);
            break;
          }
        }
      }
    }
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSkillSp", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBlackHole", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BossSkillBase.default);
exports.default = def_BossSkill4;