var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10Enemy4005 = require("Enemy4005");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_Enemy4006 = function (t) {
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
    var o = 60 * e;
    this._baseRadian = $10MathUtil.MathUtil.getRadian(o);
    var i = this._followNode.x + 70 * Math.cos(this._baseRadian);
    var n = this._followNode.y + 70 * Math.sin(this._baseRadian);
    this.node.position = cc.v3(i, n);
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
    var o = cc.v3(t, e);
    this.node.position = o;
    this.node.zIndex = -this.node.y;
    var i = this._followNode.getComponent($10EnemyBase.default).mAnimCtrl.node.scaleX;
    this.mAnimCtrl.node.scaleX = i;
  };
  _ctor.prototype.beAttack = function (e, o, i, n) {
    if (101 == o) {
      e.num = this._maxHp;
      n = false;
    }
    var a = t.prototype.beAttack.call(this, e, o, i, n);
    a && this._followNode.getComponent($10Enemy4005.default).boyEnemyDie(this.node);
    return a;
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10EnemyBase.default);
exports.default = def_Enemy4006;