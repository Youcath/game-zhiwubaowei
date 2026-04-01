var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDBulletBase = require("PDBulletBase");
var $10PDBulletPlantSplit13 = require("PDBulletPlantSplit13");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDBulletPlant13 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletSplitPb = null;
    e._isBigSkill = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (t, e, n, o) {
    var i = this;
    this._plantId = t;
    this._atkTarget = e;
    this._atkCount = n;
    this._isRage = o;
    this.mSpAni.setCompleteListener(function (t) {
      t.animation && t.animation.name;
      i.node.destroy();
      i.node.removeFromParent();
    });
    this.mSpAni.setEventListener(function () {
      if (!i._isBigSkill) {
        if (i.getIsChangeAtkTarget()) {
          i.setNextAtkTarget(100);
          e = i._atkTarget;
        }
        i.moveArrive(e);
        return void i.addBulletSplit();
      }
      var t = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
      var n = i.node.getComponent($10SimplyRectCollider.default);
      for (var o = 0; o < t.length; ++o) {
        var a = t[o];
        if (a && a.isValid && "PDEnemy4008" != a.name) {
          var l = a.getChildByName("collision").getComponent($10SimplyRectCollider.default);
          l && $10SimplyCollisionDetector.default.isCollisionRectToRect(l.rect, n.rect) && i.moveArrive(a);
        }
      }
    });
  };
  _ctor.prototype.play = function (t) {
    this._isBigSkill = t;
    if (this._isBigSkill) {
      this.mSpAni.setAnimation(0, "skill", false);
    } else {
      this.mSpAni.setAnimation(0, "atk", false);
    }
  };
  _ctor.prototype.moveArrive = function (t) {
    if (t && t.isValid) {
      var e = {
        num: this._atkCount,
        isCrit: false
      };
      t.getComponent($10PDEnemyBase.default).beAttack(e, this._plantId, true);
    }
  };
  _ctor.prototype.addBulletSplit = function () {
    var t = cc.instantiate(this.mBulletSplitPb);
    this.node.parent.addChild(t, 0);
    t.position = this.node.position;
    t.getComponent($10PDBulletPlantSplit13.default).initBulletPlantSplit(this._plantId, this._atkTarget, this._atkCount, this._isRage);
  };
  _ctor.prototype.update = function () {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.READY) {
      this.mSpAni.paused = false;
    } else {
      this.mSpAni.paused = true;
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletSplitPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDBulletBase.default);
exports.default = def_PDBulletPlant13;