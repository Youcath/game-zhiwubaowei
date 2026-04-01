var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDEnemyNormal = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initEnemy = function (e) {
    t.prototype.initEnemy.call(this, e);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDEnemyBase.default);
exports.default = def_PDEnemyNormal;