var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_GTXuanZhuan = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function () {
    this.node.angle += 1;
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_GTXuanZhuan;