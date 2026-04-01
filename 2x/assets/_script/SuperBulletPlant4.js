var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10BulletBase = require("BulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_SuperBulletPlant4 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, o, i, n) {
    t.prototype.initBullet.call(this, e, o, i, n);
  };
  _ctor.prototype.startMove = function (t) {
    var e = this;
    var o = $10MathUtil.MathUtil.distance(this.node.position, this._atkPos.clone()) / (30 * this._moveSpd);
    var i = this._atkPos.clone();
    this.bezierTo(cc.v2(this.node.position), this.getC2(cc.v2(this.node.position), cc.v2(i)), cc.v2(i), o, true, function () {
      e.addBulletHit(null);
      e.node.destroy();
      e.node.removeFromParent();
      t && t();
    });
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
  _ctor.prototype.getPerpendicularVector = function (t, e) {
    return cc.v2(-t.y, t.x).add(e);
  };
  _ctor.prototype.update = function () {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      if (this._isPauseGame) {
        this._isPauseGame = false, this.node.resumeAllActions();
      }
      this.setAngle();
    } else if (!this._isPauseGame) {
      this._isPauseGame = true, this.node.pauseAllActions();
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_SuperBulletPlant4;