var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PDSumPlant = require("PDSumPlant");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDSummerLayerCtl = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onDestroy = function () {
    this.node.targetOff(this);
  };
  _ctor.prototype.start = function () {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
  };
  _ctor.prototype.onTouchMove = function (t) {
    if (this.node.children.length > 0) {
      for (var e = this.node.children.length - 1; e >= 0; e--) {
        var n = this.node.children[e];
        if (n && n.active) {
          var o = n.getBoundingBoxToWorld();
          var i = t.getLocation();
          if (o.contains(i)) {
            var a = n.getComponent($10PDSumPlant.default);
            a && !a.isFlying && a.collect();
          }
        }
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDSummerLayerCtl;