var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDBulletFire = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._pathIdx = 0;
    e._leftIdxs = [2, 4, 6, 8];
    e._rightIdxs = [1, 3, 5, 7];
    e._showIdx = 0;
    e._frameTime = 0;
    e._continueTime = 0;
    e._isContinue = false;
    e._atkNum = 0;
    e._atkRate = 0;
    e._atkEnemyNodes = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletFire = function (t, e, n, o) {
    var i = this;
    this._pathIdx = t;
    this._continueTime = n;
    this._atkNum = e;
    this._atkRate = o;
    if (n > 0) {
      this._isContinue = true;
      this.unschedule(this.continueHurt);
      this.schedule(this.continueHurt, 1);
    }
    var a = this.node.children;
    if (1 == this._pathIdx) {
      this.node.angle = 90;
      for (var r = 0; r < a.length; ++r) {
        a[r].angle = -90;
      }
    }
    this._showIdx = 0;
    a[0].getComponent(sp.Skeleton).setAnimation(0, "fire", true);
    a[a.length - 1].getComponent(sp.Skeleton).setCompleteListener(function (t) {
      "fire" == (t.animation ? t.animation.name : "") && (i._isContinue || (i.setEnemyBaseIsBeFire(), i.node.destroy(), i.node.removeFromParent()));
    });
  };
  _ctor.prototype.continueHurt = function () {
    if (!($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState != $10GameEnum.GameState.READY)) {
      this._continueTime--;
      this.atkEnemy();
      if (this._continueTime <= 1) {
        this.setEnemyBaseIsBeFire(), this.unschedule(this.continueHurt), this.node.destroy(), this.node.removeFromParent();
      }
    }
  };
  _ctor.prototype.setEnemyBaseIsBeFire = function () {};
  _ctor.prototype.update = function (t) {
    if (($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.READY) && (this._frameTime += t, this._frameTime >= .1)) {
      this._frameTime = 0;
      var e = this._leftIdxs[this._showIdx];
      var n = this._rightIdxs[this._showIdx];
      var o = this.node.getChildByName("fire" + e);
      var i = this.node.getChildByName("fire" + n);
      this._showIdx++;
      if (o) {
        if (this._showIdx >= this._leftIdxs.length) {
          o.getComponent(sp.Skeleton).setAnimation(0, "fire", this._isContinue);
        } else {
          o.getComponent(sp.Skeleton).setAnimation(0, "fire", true);
        }
      }
      if (i) {
        if (this._showIdx >= this._rightIdxs.length) {
          i.getComponent(sp.Skeleton).setAnimation(0, "fire", this._isContinue);
        } else {
          i.getComponent(sp.Skeleton).setAnimation(0, "fire", true);
        }
        1 == this._showIdx && this.atkEnemy(true);
      }
    }
  };
  _ctor.prototype.atkEnemy = function (t) {
    undefined === t && (t = false);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDBulletFire;