var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMB_GridState = undefined;
var r;
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
(function (t) {
  t[t.NONE = 0] = "NONE";
  t[t.RIGHT = 1] = "RIGHT";
})(r = exports.EMB_GridState || (exports.EMB_GridState = {}));
var def_MB_GridItem = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.setState = function (t) {
    this.node.getChildByName("Right").active = t == r.RIGHT;
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_MB_GridItem;