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
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_BulletPlant11 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, o, i, n, a) {
    t.prototype.initBullet.call(this, e, o, i, n, a);
    this.setBulletSpriteFrame();
    this._isCheckCollision = false;
  };
  _ctor.prototype.startMove = function (t) {
    var e = this;
    t.getComponent($10EnemyBase.default).initSimulationData();
    var o = $10MathUtil.MathUtil.distance(this.node.position, this._atkPos.clone()) / (30 * this._moveSpd);
    this._atkPos = t.getComponent($10EnemyBase.default).getMovePosByTime(o);
    var i = this._atkPos.clone();
    this.bezierTo(cc.v2(this.node.position), this.getC2(cc.v2(this.node.position), cc.v2(i)), cc.v2(i), o, true, function () {
      e.moveArrive();
    });
    cc.tween(this.node).to(o, {
      angle: 1440
    }).start();
  };
  _ctor.prototype.setAtkPos = function (t) {
    this._atkPos = t.clone();
  };
  _ctor.prototype.bezierTo = function (t, e, o, i, n, a, s, c) {
    undefined === s && (s = "");
    undefined === c && (c = null);
    cc.Tween.stopAllByTarget(this.node);
    $10MathUtil.MathUtil.bezierTo(this.node, i, t, e, o, function (t, e) {
      c && c(t, e);
    }, s).call(function () {
      a && a();
    }).start();
  };
  _ctor.prototype.getC2 = function (t, e) {
    var o = Math.abs(t.x - e.x);
    var i = t.x > e.x ? t.x - o / 2 : t.x + o / 2;
    var n = 250 * Math.random() + 250;
    if (t.y > e.y) {
      return cc.v2(i, t.y + n);
    } else {
      return cc.v2(i, e.y + n);
    }
  };
  _ctor.prototype.moveArrive = function (t) {
    if (this.getIsChangeAtkTarget()) {
      this.setNextAtkTarget(100);
      t = this._atkTarget;
    }
    t || (t = this._atkTarget);
    this.addBulletHit(t);
    var e = $10BattleDataProxy.battleDataProxy.checkHasSkill(110001);
    var o = false;
    var i = 50;
    if (e) {
      var n = 100 * e.skillData.probability;
      if (Math.floor(1e3 * Math.random()) % 100 < n) {
        o = true;
        i *= 1 + (h = $10SkillDataMgr.default.instance.getSkillProperty(17, this._plantId));
      }
    }
    var a = {
      isCrit: false,
      num: 0
    };
    if (t && t.isValid) {
      var s = t.getComponent($10EnemyBase.default).monsterCfg;
      a = $10BattleDataProxy.battleDataProxy.getBulletHarm(s.type, this._plantId, this._synthesisLv, this._atkCount, this._oneAtkTargetNum, this._atkRate, this._superRate);
    }
    var p = 0;
    if (o) {
      var h = $10SkillDataMgr.default.instance.getSkillProperty(13, this._plantId);
      p = a.num * h;
      var d = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      for (var m = 0; m < d.length; ++m) {
        var f = d[m];
        if (f && f.isValid) {
          var y = t && t.isValid ? t.position.clone() : this.node.position.clone();
          if ($10MathUtil.MathUtil.distance(f.position, y) <= i) {
            if (f == t) {
              var g = {
                isCrit: a.isCrit,
                num: a.num + p
              };
              f.getComponent($10EnemyBase.default).beAttack(g, this._plantId);
            } else {
              g = {
                isCrit: a.isCrit,
                num: p
              };
              f.getComponent($10EnemyBase.default).beAttack(g, this._plantId);
            }
            $10BattleDataProxy.battleDataProxy.getIsSuperPlant(this._plantId) && f.getComponent($10EnemyBase.default).iceSpeedCut();
          }
        }
      }
    } else if (t && t.isValid) {
      t.getComponent($10EnemyBase.default).beAttack(a, this._plantId);
      $10BattleDataProxy.battleDataProxy.getIsSuperPlant(this._plantId) && t.getComponent($10EnemyBase.default).iceSpeedCut();
    }
    if (this.setDapTargetNode()) {
      this._isCheckCollision = false;
      this._isMoveNormalize = false;
    } else {
      this.node.destroy();
      this.node.removeFromParent();
    }
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
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_BulletPlant11;