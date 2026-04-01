var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_GTBulletBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._moveSpeed = cc.v3(0, 1e3);
    e._penetrate = 1;
    e._endMaxY = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    if (t) {
      this.roleData = t;
      this._penetrate = t.penetrate;
    }
  };
  _ctor.prototype.onCollisionEnter = function () {};
  _ctor.prototype.update = function () {};
  _ctor.prototype.recycle = function (t) {
    undefined === t && (t = true);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_GTBulletBase;