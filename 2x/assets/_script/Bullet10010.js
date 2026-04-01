var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10BulletGrape = require("BulletGrape");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_Bullet10010 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletSp = null;
    e._atkPos = null;
    e._idx = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.startMove = function (t, e, o) {
    var i = this;
    this._synthesisLv = o;
    this._idx = e;
    this._atkPos = t.position.clone();
    var n = $10MathUtil.MathUtil.distance(this.node.position, this._atkPos.clone()) / 450;
    var a = this._atkPos.clone();
    cc.tween(this.node).to(n, {
      position: a
    }).call(function () {
      i.initBullet(-1, i._idx, 10010);
    }).start();
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mBulletSp", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletGrape.default);
exports.default = def_Bullet10010;