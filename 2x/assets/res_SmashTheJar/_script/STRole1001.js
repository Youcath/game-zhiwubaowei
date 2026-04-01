var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10GameEnum = require("GameEnum");
var $10STJDataProxy = require("STJDataProxy");
var $10STRoleBase = require("STRoleBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_STRole1001 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._atkInverval = 1;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    var e = this;
    if ($10STJDataProxy.sTJDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead) {
      this._atkInverval >= 0 && (this._atkInverval -= t);
      if (this._atkInverval <= 0) {
        this.palyAttackAni(function () {
          e.addWood();
        }), this._atkInverval = 5 * $10STJDataProxy.sTJDataProxy.speedAtkBuff;
      }
    }
  };
  _ctor.prototype.addWood = function () {
    $10EventManager.EventManager.instance.emit($10STJDataProxy.STJDataEvent.WOOD_ADD, this.node.convertToWorldSpaceAR(cc.v3()), 5 * this.wood);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10STRoleBase.default);
exports.default = def_STRole1001;