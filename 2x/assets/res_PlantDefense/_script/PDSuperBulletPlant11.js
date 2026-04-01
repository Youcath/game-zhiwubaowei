var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10DataManager = require("DataManager");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDBulletBase = require("PDBulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDSuperBulletPlant11 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._superTimer = 0;
    e._superAtkPro = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.setSuperData = function (t, e) {
    this._superTimer = t;
    this._superAtkPro = e;
  };
  _ctor.prototype.moveArrive = function (t) {
    t || (t = this._atkTarget);
    if (t && t.isValid) {
      var e = {
        num: this._atkCount,
        isCrit: false
      };
      t.getComponent($10PDEnemyBase.default).beAttack(e, this._plantId, false);
      $10DataManager.DataManager.instance.eData.data_zombieplant[this._plantId].parm.split("|");
      t.getComponent($10PDEnemyBase.default).speedCut(this._superTimer, this._superAtkPro);
    }
    if (this.setDapTargetNode()) {
      this._isCheckCollision = false;
      this._isMoveNormalize = false;
      this._catapultNumber > 0 && (this._isStarCatapult = true);
    } else if (!this._isPenetrate) {
      this.node.destroy(), this.node.removeFromParent();
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDBulletBase.default);
exports.default = def_PDSuperBulletPlant11;