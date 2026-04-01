var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDBulletBase = require("PDBulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDSuperBulletPlant10 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, n, o, i, a) {
    var s = this;
    t.prototype.initBullet.call(this, e, n, o, i, a);
    this.mSpAni.setCompleteListener(function (t) {
      if ("atk" == (t.animation ? t.animation.name : "")) {
        s.node.destroy();
        s.node.removeFromParent();
      }
    });
    this.mSpAni.setEventListener(function (t, e) {
      e.data.name;
      s.monsterColliderCheck();
    });
    this.mSpAni.setAnimation(0, "stand", true);
    var l = $10MathUtil.MathUtil.distance(this.node.position, this._atkTarget.position) / (100 * this._moveSpd);
    var c = this._atkTarget.position.clone().addSelf(cc.v3(0, 250));
    var p = 250 / (100 * this._moveSpd);
    if (Math.abs(this._atkTarget.x - this.node.x) <= this.node.width) {
      cc.tween(this.node).to(l, {
        position: c
      }).by(p, {
        position: cc.v3(0, -250)
      }).delay(.1).call(function () {
        s.mSpAni.setAnimation(0, "atk", false);
      }).start();
    } else {
      this.bezierTo(cc.v2(this.node.position), this.getC2(cc.v2(this.node.position), cc.v2(c)), cc.v2(c), l, true, function () {
        var t = 250 / (100 * s._moveSpd);
        cc.tween(s.node).by(t, {
          position: cc.v3(0, -250)
        }).delay(.1).call(function () {
          s.mSpAni.setAnimation(0, "atk", false);
        }).start();
      });
    }
  };
  _ctor.prototype.bezierTo = function (t, e, n, o, i, a, s, l) {
    undefined === s && (s = "");
    undefined === l && (l = null);
    cc.Tween.stopAllByTarget(this.node);
    $10MathUtil.MathUtil.bezierTo(this.node, o, t, e, n, function (t, e) {
      l && l(t, e);
    }, s).call(function () {
      a && a();
    }).start();
  };
  _ctor.prototype.getC2 = function (t, e) {
    var n = Math.abs(t.x - e.x);
    var o = t.x > e.x ? t.x - n / 2 : t.x + n / 2;
    var i = 150 * Math.random() + 150;
    if (t.y > e.y) {
      return cc.v2(o, t.y + i);
    } else {
      return cc.v2(o, e.y + i);
    }
  };
  _ctor.prototype.getPerpendicularVector = function (t, e) {
    return cc.v2(-t.y, t.x).add(e);
  };
  _ctor.prototype.monsterColliderCheck = function () {
    var t = this.node.getComponent($10SimplyRectCollider.default);
    var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
    var n = Math.floor(1.6 * this._atkCount);
    for (var o = 0; o < e.length; ++o) {
      var i = e[o];
      if (t && i && i.isValid && ("PDEnemy4008" != i.name || 20 == this._plantId)) {
        var a = i.getChildByName("collision").getComponent($10SimplyRectCollider.default);
        if (a && $10SimplyCollisionDetector.default.isCollisionRectToRect(a.rect, t.rect)) {
          var r = {
            num: n,
            isCrit: false
          };
          i.getComponent($10PDEnemyBase.default).beAttack(r, this._plantId);
        }
      }
    }
  };
  _ctor.prototype.update = function () {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.READY) {
      if (this._isPauseGame) {
        this._isPauseGame = false, this.node.resumeAllActions();
      }
    } else if (!this._isPauseGame) {
      this._isPauseGame = true, this.node.pauseAllActions();
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDBulletBase.default);
exports.default = def_PDSuperBulletPlant10;