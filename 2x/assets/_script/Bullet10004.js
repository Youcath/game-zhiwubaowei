var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10BulletPlant6 = require("BulletPlant6");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_Bullet10004 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._atkTime = 0;
    e._atkNum = 0;
    e._isStartTime = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.startMove = function (e) {
    t.prototype.startMove.call(this, e);
    this._isPenetrate = true;
    this._isStartTime = false;
    this.node.scale = .5;
  };
  _ctor.prototype.moveArrive = function (e) {
    var o = this;
    t.prototype.moveArrive.call(this, e);
    cc.Tween.stopAllByTarget(this.node);
    cc.tween(this.node).to(.5, {
      scale: .8
    }).call(function () {
      o._atkTime = .5;
      o._isStartTime = true;
    }).start();
  };
  _ctor.prototype.update = function (e) {
    if (!($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.READY)) {
      t.prototype.update.call(this, e);
      if (this._isStartTime) {
        this._atkTime += e, this._atkTime >= .5 && (this._atkTime = 0, this._collisionNodes = [], this.monsterColliderCheck(true), this._atkNum++, this._atkNum > 6 && (this.node.destroy(), this.node.removeFromParent()));
      }
    }
  };
  _ctor.prototype.setAngle = function () {
    return 0;
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletPlant6.default);
exports.default = def_Bullet10004;