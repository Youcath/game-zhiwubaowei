var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10SkillDataMgr = require("SkillDataMgr");
var $10EnemyBase = require("EnemyBase");
var $10BulletBase = require("BulletBase");
var $10BulletBoom = require("BulletBoom");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_SuperBulletPlant9 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletBoomPb = null;
    e._checkSdTime = 0;
    e._movePaths = [];
    e._movePathIdx = 0;
    e._atkEnemyNodes = [];
    e._isMoveBack = false;
    e._moveDis = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, o, i, n) {
    t.prototype.initBullet.call(this, e, o, i, n);
    var a = $10BattleDataProxy.battleDataProxy.enemyMovePaths[1];
    for (var r = a.length - 1; r >= 0; --r) {
      this._movePaths.push(a[r]);
    }
    this._moveDis = 0;
    this._atkEnemyNodes = [];
    this._movePathIdx = 1;
    this.node.position = this._movePaths[0].position;
    this._atkPos = this._movePaths[this._movePathIdx].position;
    this.node.angle = 90;
    this._isMoveBack = false;
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
    return this._moveSpd / 4 * (1 + $10SkillDataMgr.default.instance.getSkillProperty(2, this._plantId));
  };
  _ctor.prototype.setIsMoveBack = function () {
    var t;
    this._isMoveBack || this.node.x + this.node.height / 2 >= this.node.parent.width / 2 && (this._isMoveBack = true, this._movePaths = this._movePaths.reverse(), this._atkPos = (null === (t = this._movePaths[1]) || undefined === t ? undefined : t.position) || null, this._movePathIdx = 1, this._moveDis = $10MathUtil.MathUtil.distance(this._movePaths[0].position, this.node.position), this.node.scaleY = 1);
  };
  _ctor.prototype.addBulletBoom = function () {
    var t = cc.instantiate(this.mBulletBoomPb);
    $10BattleDataProxy.battleDataProxy.bulletView.addChild(t, 1e3);
    t.position = this.node.position;
    t.getComponent($10BulletBoom.default).initBulletBoom();
    var e = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
    for (var o = 0; o < e.length; ++o) {
      var i = e[o];
      if (i && i.isValid && $10MathUtil.MathUtil.distance(i.position, this.node.position) <= 150) {
        var n = i.getComponent($10EnemyBase.default).monsterCfg;
        var a = $10BattleDataProxy.battleDataProxy.getBulletHarm(n.type, this._plantId, this._synthesisLv, this._atkCount, this._oneAtkTargetNum, this._atkRate, this._superRate);
        i.getComponent($10EnemyBase.default).beAttack(a, this._plantId);
      }
    }
    this.node.destroy();
    this.node.removeFromParent();
  };
  _ctor.prototype.checkIsBoom = function () {
    var t = $10BattleDataProxy.battleDataProxy.getPlantAtkTargets(1, this._plantId, false);
    if (t.length <= 0) {
      this.addBulletBoom();
    } else {
      t[0].getComponent($10EnemyBase.default).moveDis + this.node.width / 2 < this._moveDis && this.addBulletBoom();
    }
  };
  _ctor.prototype.update = function (t) {
    var e;
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      var o = this.getMoveSpd() * (t / 0.016666666666666666);
      var i = this._atkPos;
      if (!i) {
        console.log("目标以经丢失");
        this.node.destroy();
        return void this.node.removeFromParent();
      }
      var n = this.node.position.clone().sub(i.clone()).normalize();
      this.node.x -= o * n.x;
      this.node.y -= o * n.y;
      this.setIsMoveBack();
      if ($10MathUtil.MathUtil.distance(this.node.position, i) <= o) {
        this._movePathIdx++;
        this._atkPos = (null === (e = this._movePaths[this._movePathIdx]) || undefined === e ? undefined : e.position) || null;
        if (!this._atkPos) {
          return void this.addBulletBoom();
        }
        if (2 == this._movePathIdx) {
          this.node.angle = 0;
          this._isMoveBack && (this.node.scaleY = -1);
        } else if (this._isMoveBack) {
          this.node.angle = -90;
          this.node.scaleY = 1;
        } else {
          this.node.angle = 90;
          this.node.scaleY = -1;
        }
      }
      var a = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      for (var l = 0; l < a.length; ++l) {
        var p = a[l];
        if (p && p.isValid && !(p.x >= cc.winSize.width / 2) && this.getIsCanAtk(p) && $10MathUtil.MathUtil.distance(p.position, this.node.position) <= this.node.width) {
          var h = p.getComponent($10EnemyBase.default).monsterCfg;
          var d = $10BattleDataProxy.battleDataProxy.getBulletHarm(h.type, this._plantId, this._synthesisLv, this._atkCount, this._oneAtkTargetNum, this._atkRate, this._superRate);
          p.getComponent($10EnemyBase.default).beAttack(d, this._plantId);
          this._atkEnemyNodes.push(p);
        }
      }
      if (this._isMoveBack) {
        this._moveDis += this.getMoveSpd();
        this._checkSdTime += t;
        this._checkSdTime >= .3 && (this._checkSdTime = 0);
      }
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletBoomPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_SuperBulletPlant9;