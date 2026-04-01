var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var $10BulletBase = require("BulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_BulletPlant2 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._isCanMove = true;
    e._bombNum = 0;
    e._bombScope = 150;
    e._atkNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function () {};
  _ctor.prototype.initFixedPlantBullet = function (t, e, o) {
    var i = this;
    if (!e || !e.isValid) {
      console.log("目标丢失，这次不算");
      this.node.destroy();
      return void this.node.removeFromParent();
    }
    this._plantId = 103;
    this._atkRate = o;
    this._atkNum = t;
    this._atkTarget = e;
    this._atkPos = e.position.clone();
    this._moveNormalize = this.node.position.clone().sub(this._atkPos.clone()).normalize();
    this.mSpAni.setCompleteListener(function (t) {
      var e = t.animation ? t.animation.name : "";
      if (!("bomb1" != e && "bomb2" != e)) {
        if (i._bombNum > 0) {
          i._bombNum--;
          i.playBomb2();
        } else {
          i.node.destroy();
          i.node.removeFromParent();
        }
      }
    });
    this.mSpAni.setEventListener(function (t, e) {
      e.data.name;
      var o;
      var n = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      $10EventManager.EventManager.instance.emit($10GameEnum.EGameEvent.SCREEN_SHAKE);
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/plant2", $10HomeEnum.Bundles.RES);
      for (var a = 0; a < n.length; ++a) {
        var d = n[a];
        if (d && d.isValid && $10MathUtil.MathUtil.distance(d.position, i.node.position) <= i._bombScope) {
          var m = null === (o = d.getComponent($10EnemyBase.default)) || undefined === o ? undefined : o.monsterCfg;
          if (!m) {
            continue;
          }
          var f = $10BattleDataProxy.battleDataProxy.getFixedPlantBulletHarm(i._atkNum, m.type, 1);
          d.getComponent($10EnemyBase.default).beAttack(f, i._plantId, true);
        }
      }
    });
    this.startMove();
  };
  _ctor.prototype.playBomb2 = function () {
    this.mSpAni.paused = false;
    this.mSpAni.setAnimation(0, "bomb2", false);
  };
  _ctor.prototype.moveArrive = function () {
    this._isCanMove = false;
    this.node.zIndex = -this.node.y;
    this.mSpAni.paused = false;
    this.mSpAni.setAnimation(0, "bomb1", false);
  };
  _ctor.prototype.update = function () {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      if (this._isPauseGame) {
        this._isPauseGame = false, this.mSpAni.paused = false, this.node.resumeAllActions();
      }
    } else if (!this._isPauseGame) {
      this._isPauseGame = true, this.mSpAni.paused = true, this.node.pauseAllActions();
    }
  };
  _ctor.prototype.setAngle = function () {
    return 0;
  };
  _ctor.prototype.startMove = function () {
    var t = this;
    var e = $10MathUtil.MathUtil.distance(this.node.position, this._atkPos.clone()) / (30 * this._moveSpd);
    var o = this._atkPos.clone();
    this.bezierTo(cc.v2(this.node.position), this.getC2(cc.v2(this.node.position), cc.v2(o)), cc.v2(o), e, true, function () {
      t.moveArrive();
    });
  };
  _ctor.prototype.bezierTo = function (t, e, o, i, n, a, r, s) {
    undefined === r && (r = "");
    undefined === s && (s = null);
    cc.Tween.stopAllByTarget(this.node);
    $10MathUtil.MathUtil.bezierTo(this.node, i, t, e, o, function (t, e) {
      s && s(t, e);
    }, r).call(function () {
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
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_BulletPlant2;