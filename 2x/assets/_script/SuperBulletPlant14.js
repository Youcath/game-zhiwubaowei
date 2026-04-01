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
var ccp_property = cc__decorator.property;
var def_SuperBulletPlant14 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSpAni2 = null;
    e._isTopAni = false;
    e._spShowTime = 0;
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
        a.mSpAni.setAnimation(0, o, false);
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/superPlant14", $10HomeEnum.Bundles.RES);
      } else if ("disappear" == e) {
        a.mSpAni.node.active = false;
      } else {
        "atk_up" != e && "atk_left" != e || a.mSpAni.setAnimation(0, "disappear", false);
      }
    });
    this.mSpAni2.setCompleteListener(function (t) {
      var e = t.animation ? t.animation.name : "";
      if ("appear" == e) {
        var o = a._isTopAni ? "atk_down" : "atk_left";
        a.mSpAni2.setAnimation(0, o, false);
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/superPlant14", $10HomeEnum.Bundles.RES);
      } else if ("disappear" == e) {
        a.node.destroy();
        a.node.removeFromParent();
      } else {
        "atk_down" != e && "atk_left" != e || a.mSpAni2.setAnimation(0, "disappear", false);
      }
    });
    this.mSpAni.setEventListener(function () {
      a.spEventListener();
    });
    this.mSpAni2.setEventListener(function () {
      a.spEventListener();
    });
    this.node.scale = 1.5;
  };
  _ctor.prototype.initOrientation = function (t) {
    this._isTopAni = t >= 0 && t <= 4 || t >= 14;
    this._spShowTime = .15;
    this.mSpAni.setAnimation(0, "appear", false);
    this.mSpAni2.node.active = false;
    this.mSpAni2.node.scaleX = this._isTopAni ? 1 : -1;
    if (this._isTopAni) {
      this.mSpAni2.node.x = 0;
      this.mSpAni2.node.y = 80;
      this.mSpAni.node.x = 0;
      this.mSpAni.node.y = -60;
    } else {
      this.mSpAni2.node.x = -80;
      this.mSpAni2.node.y = 0;
      this.mSpAni.node.x = 80;
      this.mSpAni.node.y = 0;
    }
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
          var l = $10BattleDataProxy.battleDataProxy.getBulletHarm(a.type, 14, this._synthesisLv, 1, 1, 1, this._superRate);
          i.getComponent($10EnemyBase.default).beAttack(l, 14);
        }
      }
    }
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/bulletHit6", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.READY) {
      this.mSpAni.paused = true;
      return void (this.mSpAni2.paused = true);
    }
    this.mSpAni.paused = false;
    this.mSpAni2.paused = false;
    if (this._spShowTime > 0) {
      this._spShowTime -= t;
      if (this._spShowTime <= 0) {
        this.mSpAni2.node.active = true, this.mSpAni2.setAnimation(0, "appear", false);
      }
    }
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSpAni2", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_SuperBulletPlant14;