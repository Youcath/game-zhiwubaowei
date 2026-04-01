var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var $10BulletBase = require("BulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_SuperBulletPlant10 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, o, i, n) {
    var a = this;
    t.prototype.initBullet.call(this, e, o, i, n);
    this.mSpAni.setCompleteListener(function (t) {
      if ("atk" == (t.animation ? t.animation.name : "")) {
        a.node.destroy();
        a.node.removeFromParent();
      }
    });
    this.mSpAni.setEventListener(function (t, e) {
      e.data.name;
      a.monsterColliderCheck();
    });
    this.mSpAni.setAnimation(0, "stand", true);
    var s = $10MathUtil.MathUtil.distance(this.node.position, this._atkTarget.position) / (100 * this._moveSpd);
    var c = this._atkTarget.position.clone().addSelf(cc.v3(0, 250));
    var l = 250 / (100 * this._moveSpd);
    if (Math.abs(this._atkTarget.x - this.node.x) <= this.node.width) {
      cc.tween(this.node).to(s, {
        position: c
      }).by(l, {
        position: cc.v3(0, -250)
      }).delay(.1).call(function () {
        a.mSpAni.setAnimation(0, "atk", false);
      }).start();
    } else {
      this.bezierTo(cc.v2(this.node.position), this.getC2(cc.v2(this.node.position), cc.v2(c)), cc.v2(c), s, true, function () {
        var t = 250 / (100 * a._moveSpd);
        cc.tween(a.node).by(t, {
          position: cc.v3(0, -250)
        }).delay(.1).call(function () {
          a.mSpAni.setAnimation(0, "atk", false);
        }).start();
      });
    }
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
    var n = 150 * Math.random() + 150;
    if (t.y > e.y) {
      return cc.v2(i, t.y + n);
    } else {
      return cc.v2(i, e.y + n);
    }
  };
  _ctor.prototype.getPerpendicularVector = function (t, e) {
    return cc.v2(-t.y, t.x).add(e);
  };
  _ctor.prototype.monsterColliderCheck = function () {
    var t = this.node.getComponent($10SimplyRectCollider.default);
    var e = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
    for (var o = 0; o < e.length; ++o) {
      var i = e[o];
      if (t && i && i.isValid && !this.getIsHaveCollisionNode(i)) {
        var n = i.getChildByName("collision").getComponent($10SimplyRectCollider.default);
        if (n && $10SimplyCollisionDetector.default.isCollisionRectToRect(n.rect, t.rect)) {
          var a = i.getComponent($10EnemyBase.default).monsterCfg;
          var r = $10BattleDataProxy.battleDataProxy.getBulletHarm(a.type, this._plantId, this._synthesisLv, this._atkCount, this._oneAtkTargetNum, this._atkRate, this._superRate);
          i.getComponent($10EnemyBase.default).beAttack(r, this._plantId);
        }
      }
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
exports.default = def_SuperBulletPlant10;