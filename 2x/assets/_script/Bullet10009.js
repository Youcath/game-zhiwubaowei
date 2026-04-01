var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var $10BulletBase = require("BulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_Bullet10009 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._isTopAni = false;
    e._isTopPlace = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, o, i, n) {
    var a = this;
    t.prototype.initBullet.call(this, e, o, i, n);
    this.mSpAni.setCompleteListener(function (t) {
      var e = t.animation ? t.animation.name : "";
      if ("appear" == e) {
        var o = a._isTopAni ? "atk_up" : "atk_left";
        a._isTopPlace && (o = a._isTopAni ? "atk_down" : "atk_left");
        a.mSpAni.setAnimation(0, o, false);
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/superPlant14", $10HomeEnum.Bundles.RES);
      } else if ("disappear" == e) {
        a.mSpAni.node.active = false;
      } else {
        "atk_up" != e && "atk_left" != e && "atk_down" != e && "atk_left" != e || a.mSpAni.setAnimation(0, "disappear", false);
      }
    });
    this.mSpAni.setEventListener(function () {
      a.spEventListener();
    });
  };
  _ctor.prototype.spEventListener = function () {
    var t = this.node.getComponent($10SimplyRectCollider.default);
    var e = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
    for (var o = 0; o < e.length; ++o) {
      var i = e[o];
      if (t) {
        var n = i.getChildByName("collision").getComponent($10SimplyRectCollider.default);
        if (n && $10SimplyCollisionDetector.default.isCollisionRectToRect(n.rect, t.rect)) {
          var a = i.getComponent($10EnemyBase.default).monsterCfg;
          var l = $10BattleDataProxy.battleDataProxy.getBulletHarm(a.type, 10009, this._synthesisLv, 1, 1, this._atkRate, this._superRate);
          i.getComponent($10EnemyBase.default).beAttack(l, 10009);
        }
      }
    }
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/bulletHit6", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.initOrientation = function (t, e, o) {
    var i = this;
    this._isTopAni = t >= 0 && t <= 4 || t >= 14;
    this._isTopPlace = o;
    this.mSpAni.node.active = false;
    cc.tween(this.node).delay(.15 * e).call(function () {
      i.mSpAni.node.active = true;
      i.mSpAni.setAnimation(0, "appear", false);
      if (i._isTopAni) {
        if (i._isTopPlace) {
          i.mSpAni.node.x = 0;
          i.mSpAni.node.y = 80;
        } else {
          i.mSpAni.node.x = 0;
          i.mSpAni.node.y = -60;
        }
      } else if (i._isTopPlace) {
        i.mSpAni.node.x = -80;
        i.mSpAni.node.y = 0;
      } else {
        i.mSpAni.node.x = 80;
        i.mSpAni.node.y = 0;
      }
      i.node.zIndex = -i.node.y - e;
    }).start();
  };
  _ctor.prototype.update = function () {
    if ($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.READY) {
      this.mSpAni.paused = true;
      return void this.node.pauseAllActions();
    }
    this.node.resumeAllActions();
    this.mSpAni.paused = false;
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_Bullet10009;