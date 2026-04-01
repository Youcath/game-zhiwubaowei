var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10PDEnemy4005 = require("PDEnemy4005");
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDEnemy4006 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._followNode = null;
    e._idx = 0;
    e._baseRadian = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.playMove = function (t) {
    undefined === t && (t = 5);
  };
  _ctor.prototype.setFollowData = function (t, e) {
    this._followNode = t;
    this._idx = e;
    var n = 60 * e;
    this._baseRadian = $10MathUtil.MathUtil.getRadian(n);
    var o = this._followNode.x + 70 * Math.cos(this._baseRadian);
    var i = this._followNode.y + 70 * Math.sin(this._baseRadian);
    this.node.position = cc.v3(o, i);
    this.node.zIndex = -this.node.y;
  };
  _ctor.prototype.playFollowMove = function (t) {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      if (t % 2 == 0) {
        this.mAnimCtrl.playAnim("move", true, null, null, 3);
      } else {
        this.mAnimCtrl.playAnim("move2", true, null, null, 3);
      }
    }
  };
  _ctor.prototype.addRushEffect = function () {};
  _ctor.prototype.addHpProgress = function () {};
  _ctor.prototype.move = function () {
    var t = this._followNode.x + 70 * Math.cos(this._baseRadian);
    var e = this._followNode.y + 70 * Math.sin(this._baseRadian);
    var n = cc.v3(t, e);
    this.node.position = n;
    this.node.zIndex = -this.node.y;
    var o = this._followNode.getComponent($10PDEnemyBase.default).mAnimCtrl.node.scaleX;
    this.mAnimCtrl.node.scaleX = o;
  };
  _ctor.prototype.beAttack = function (e, n, o, i) {
    if (101 == n) {
      e.num = this._maxHp;
      i = false;
    }
    var a = t.prototype.beAttack.call(this, e, n, o, i);
    a && this._followNode.getComponent($10PDEnemy4005.default).boyEnemyDie(this.node);
    return a;
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDEnemyBase.default);
exports.default = def_PDEnemy4006;