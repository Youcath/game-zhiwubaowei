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
var $10BulletGrape = require("BulletGrape");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_SuperBulletPlant2 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletGrapePb = null;
    e._bombScope = 100;
    e._isCanMove = false;
    e._bombNum = 1;
    e._atkNum = 0;
    e._bulletNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function () {};
  _ctor.prototype.getCreatePos = function (t) {
    if (t.x <= this.node.width / 2 - 275) {
      var e = t.y;
      e = e > 0 ? e > 630 ? 630 : e : e < -390 ? -390 : e;
      return cc.v3(-285, e);
    }
    if (t.y > 0) {
      return cc.v3(t.x, 630);
    } else {
      return cc.v3(t.x, -390);
    }
  };
  _ctor.prototype.initFixedPlantBullet = function (t, e, o) {
    var i = this;
    if (!e || !e.isValid) {
      console.log("目标丢失，这次不算");
      this.node.destroy();
      return void this.node.removeFromParent();
    }
    this._isCanMove = true;
    this._isCheckCollision = false;
    this._atkNum = t;
    this._atkTarget = e;
    this._bulletNum = o;
    this._atkPos = this.getCreatePos(e);
    this._moveNormalize = this.node.position.clone().sub(this._atkPos.clone()).normalize();
    this.mSpAni.setCompleteListener(function (t) {
      var e = t.animation ? t.animation.name : "";
      if (!("bomb1" != e && "bomb2" != e)) {
        i._bombNum--;
        if (i._bombNum > 0) {
          i.playBomb2();
        } else {
          i.node.destroy(), i.node.removeFromParent();
        }
      }
    });
    this.mSpAni.setEventListener(function (t, e) {
      e.data.name;
      var o = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/plant12", $10HomeEnum.Bundles.RES);
      $10EventManager.EventManager.instance.emit($10GameEnum.EGameEvent.SCREEN_SHAKE);
      for (var n = 0; n < o.length; ++n) {
        var a = o[n];
        if (a && a.isValid && $10MathUtil.MathUtil.distance(a.position, i.node.position) <= i._bombScope) {
          var d = a.getComponent($10EnemyBase.default).monsterCfg;
          var f = $10BattleDataProxy.battleDataProxy.getFixedPlantBulletHarm(i._atkNum, d.type, 1);
          a.getComponent($10EnemyBase.default).beAttack(f, 104, true);
        }
      }
      for (n = 0; n < i._bulletNum; ++n) {
        var y = cc.instantiate(i.mBulletGrapePb);
        $10BattleDataProxy.battleDataProxy.bulletView.addChild(y);
        y.position = i.node.position;
        y.getComponent($10BulletGrape.default).initBullet(i._atkNum, n + 1);
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
    if (this._isCanMove) {
      if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
        if (this._isPauseGame) {
          this.mSpAni.paused = false, this._isPauseGame = false, this.node.resumeAllActions();
        }
      } else if (!this._isPauseGame) {
        this._isPauseGame = true, this.mSpAni.paused = true, this.node.pauseAllActions();
      }
    }
  };
  _ctor.prototype.startMove = function () {
    var t = this;
    var e = $10MathUtil.MathUtil.distance(this.node.position, this._atkPos.clone()) / (60 * this._moveSpd);
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
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletGrapePb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_SuperBulletPlant2;