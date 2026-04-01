var o;
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
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDBulletBase = require("PDBulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDSuperBulletPlant14 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSpAni2 = null;
    e._isTopAni = false;
    e._spShowTime = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, n, o, i, a) {
    var s = this;
    t.prototype.initBullet.call(this, e, n, o, i, a);
    this.mSpAni.setCompleteListener(function (t) {
      var e = t.animation ? t.animation.name : "";
      if ("appear" == e) {
        var n = s._isTopAni ? "atk_up" : "atk_left";
        s.mSpAni.setAnimation(0, n, false);
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/superPlant14", $10HomeEnum.Bundles.RES);
      } else if ("disappear" == e) {
        s.mSpAni.node.active = false;
      } else {
        "atk_up" != e && "atk_left" != e || s.mSpAni.setAnimation(0, "disappear", false);
      }
    });
    this.mSpAni2.setCompleteListener(function (t) {
      var e = t.animation ? t.animation.name : "";
      if ("appear" == e) {
        var n = s._isTopAni ? "atk_down" : "atk_left";
        s.mSpAni2.setAnimation(0, n, false);
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/superPlant14", $10HomeEnum.Bundles.RES);
      } else if ("disappear" == e) {
        s.node.destroy();
        s.node.removeFromParent();
      } else {
        "atk_down" != e && "atk_left" != e || s.mSpAni2.setAnimation(0, "disappear", false);
      }
    });
    this.schedule(function () {
      s.spEventListener();
    }, .1, 2);
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
    var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
    var n = Math.floor(.8 * this._atkCount);
    for (var o = 0; o < e.length; ++o) {
      var i = e[o];
      if (t && "PDEnemy4008" != i.name) {
        var a = i.getChildByName("collision").getComponent($10SimplyRectCollider.default);
        if (a && $10SimplyCollisionDetector.default.isCollisionRectToRect(a.rect, t.rect)) {
          var c = {
            num: n,
            isCrit: false
          };
          i.getComponent($10PDEnemyBase.default).beAttack(c, 14);
        }
      }
    }
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/bulletHit6", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.update = function (t) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState != $10GameEnum.GameState.READY) {
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
}($10PDBulletBase.default);
exports.default = def_PDSuperBulletPlant14;