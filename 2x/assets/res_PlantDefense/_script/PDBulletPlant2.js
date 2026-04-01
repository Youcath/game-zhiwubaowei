var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PDBulletBase = require("PDBulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDBulletPlant2 = function (t) {
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
  _ctor.prototype.initFixedPlantBullet = function (t, e, n) {
    var o = this;
    if (!e || !e.isValid) {
      console.log("目标丢失，这次不算");
      this.node.destroy();
      return void this.node.removeFromParent();
    }
    this._plantId = 103;
    this._atkRate = n;
    this._atkNum = t;
    this._atkTarget = e;
    this._atkPos = e.position.clone();
    this._moveNormalize = this.node.position.clone().sub(this._atkPos.clone()).normalize();
    this.mSpAni.setCompleteListener(function (t) {
      var e = t.animation ? t.animation.name : "";
      if (!("bomb1" != e && "bomb2" != e)) {
        if (o._bombNum > 0) {
          o._bombNum--;
          o.playBomb2();
        } else {
          o.node.destroy();
          o.node.removeFromParent();
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
    if (this._isPauseGame) {
      this._isPauseGame = false;
      this.mSpAni.paused = false;
      this.node.resumeAllActions();
    }
  };
  _ctor.prototype.setAngle = function () {
    return 0;
  };
  _ctor.prototype.startMove = function () {};
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDBulletBase.default);
exports.default = def_PDBulletPlant2;