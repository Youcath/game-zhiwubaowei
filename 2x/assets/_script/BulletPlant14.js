var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var $10BulletBase = require("BulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_BulletPlant14 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._mul = 0;
    e._startPos = null;
    e._duration = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, o, i, n) {
    t.prototype.initBullet.call(this, e, o, i, n);
    this.setBulletSpriteFrame();
    this._isCheckCollision = false;
  };
  _ctor.prototype.startMove = function (t, e) {
    var o = this;
    this._idx = e;
    t.getComponent($10EnemyBase.default).initSimulationData();
    var i = $10MathUtil.MathUtil.distance(this.node.position, this._atkPos.clone());
    this._duration = i / (50 * this._moveSpd);
    this._atkPos = t.getComponent($10EnemyBase.default).getMovePosByTime(this._duration);
    var n = this._atkPos.clone();
    var a = cc.v2(n.subtract(cc.v3(0, t.height / 2)));
    this._startPos = this.node.getPosition().clone();
    var s = this._startPos.add(a).mul(.5);
    if ($10BattleDataProxy.battleDataProxy.checkHasSkill(140001)) {
      this._mul = 0 == e ? 200 : -200;
    } else {
      this._mul = Math.floor(1e3 * Math.random()) % 2 == 0 ? 200 : -200;
    }
    var u = $10MathUtil.MathUtil.getPerpendicularVector((a.x > this._startPos.x ? a.sub(this._startPos) : this._startPos.sub(a)).normalize().mul(this._mul), s);
    this.bezierTo(cc.v2(this.node.position), u, cc.v2(n), this._duration, true, function () {
      o.moveArrive();
    });
    cc.tween(this.node).to(2 * this._duration, {
      angle: 2880
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
  _ctor.prototype.moveArrive = function (e) {
    e || (e = this._atkTarget);
    if (this.getIsChangeAtkTarget()) {
      this.setNextAtkTarget(100);
      e = this._atkTarget;
    }
    this.addBulletHit(e);
    t.prototype.moveArrive.call(this, e);
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
exports.default = def_BulletPlant14;