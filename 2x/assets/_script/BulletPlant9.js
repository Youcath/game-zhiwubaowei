var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10SkillDataMgr = require("SkillDataMgr");
var $10EnemyBase = require("EnemyBase");
var $10BulletBase = require("BulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_BulletPlant9 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._movePaths = [];
    e._movePathIdx = 0;
    e._atkEnemyNodes = [];
    e._atkNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function () {};
  _ctor.prototype.initFixedPlantBullet = function (t) {
    this._atkNum = t;
    var e = $10BattleDataProxy.battleDataProxy.enemyMovePaths[1];
    if (e.length <= 0) {
      console.log("目标丢失，这次不算");
      this.node.destroy();
      return void this.node.removeFromParent();
    }
    for (var o = e.length - 1; o >= 0; --o) {
      this._movePaths.push(e[o]);
    }
    this._atkEnemyNodes = [];
    this._movePathIdx = 1;
    this.node.position = this._movePaths[0].position;
    this._atkPos = this._movePaths[this._movePathIdx].position;
    this.node.angle = 90;
    this.mSpAni.setAnimation(0, "roll", true);
  };
  _ctor.prototype.getIsCanAtk = function (t) {
    for (var e = 0; e < this._atkEnemyNodes.length; ++e) {
      if (this._atkEnemyNodes[e] == t) {
        return false;
      }
    }
    return true;
  };
  _ctor.prototype.getMoveSpd = function () {
    return this._moveSpd / 2 * (1 + $10SkillDataMgr.default.instance.getSkillProperty(2, this._plantId));
  };
  _ctor.prototype.update = function (t) {
    var e;
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      var o = this.getMoveSpd() * (t / 0.016666666666666666);
      var i = this._atkPos;
      var n = this.node.position.clone().sub(i.clone()).normalize();
      this.node.x -= o * n.x;
      this.node.y -= o * n.y;
      if ($10MathUtil.MathUtil.distance(this.node.position, i) <= o) {
        this._movePathIdx++;
        this._atkPos = (null === (e = this._movePaths[this._movePathIdx]) || undefined === e ? undefined : e.position) || null;
        if (!this._atkPos) {
          this.node.destroy();
          return void this.node.removeFromParent();
        }
        if (2 == this._movePathIdx) {
          this.node.angle = 0;
        } else {
          this.node.angle = 90;
          this.node.scaleY = -1;
        }
      }
      var a = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      for (var p = 0; p < a.length; ++p) {
        var d = a[p];
        if (d && d.isValid && !(d.x >= cc.winSize.width / 2) && this.getIsCanAtk(d) && $10MathUtil.MathUtil.distance(d.position, this.node.position) <= this.node.width) {
          var m = d.getComponent($10EnemyBase.default).monsterCfg;
          var f = $10BattleDataProxy.battleDataProxy.getFixedPlantBulletHarm(this._atkNum, m.type, 1);
          d.getComponent($10EnemyBase.default).beAttack(f, 105);
          this._atkEnemyNodes.push(d);
          $10AudioManager.AudioManager.instance.playEffectPath("sounds/plant9", $10HomeEnum.Bundles.RES);
        }
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_BulletPlant9;