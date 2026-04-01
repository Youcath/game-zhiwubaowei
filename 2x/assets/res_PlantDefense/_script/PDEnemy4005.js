var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10PDEnemy4006 = require("PDEnemy4006");
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDEnemy4005 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._moveAniIdx = 0;
    e._changeMoveAniTime = 0;
    e._boyNodes = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.playMove = function (t) {
    undefined === t && (t = 5);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      this._moveAniIdx++;
      if (this._moveAniIdx % 2 == 0) {
        this.mAnimCtrl.playAnim("move", true, null, null, 3);
      } else {
        this.mAnimCtrl.playAnim("move2", true, null, null, 3);
      }
      for (var e = 0; e < this._boyNodes.length; ++e) {
        this._boyNodes[e].getComponent($10PDEnemy4006.default).playFollowMove(this._moveAniIdx);
      }
    }
  };
  _ctor.prototype.pushBoyNode = function (t) {
    this._boyNodes.push(t);
    t.getComponent($10PDEnemy4006.default).playFollowMove(this._moveAniIdx);
  };
  _ctor.prototype.playDie = function (e, n) {
    t.prototype.playDie.call(this, e, n);
    for (var o = 0; o < this._boyNodes.length; ++o) {
      var i = this._boyNodes[o];
      i && i.isValid && i.getComponent($10PDEnemy4006.default).playDie();
    }
  };
  _ctor.prototype.update = function (e) {
    t.prototype.update.call(this, e);
    if (!(this.getIsDie() || this._amimState == $10GameEnum.RoleState.Attack)) {
      this._changeMoveAniTime += e;
      if (this._changeMoveAniTime >= 2) {
        this._changeMoveAniTime = 0, this.playMove();
      }
    }
  };
  _ctor.prototype.boyEnemyDie = function (t) {
    var e = this._boyNodes.indexOf(t);
    e >= 0 && this._boyNodes.splice(e, 1);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDEnemyBase.default);
exports.default = def_PDEnemy4005;