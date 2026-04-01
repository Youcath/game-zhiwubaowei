var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BaseSimplyCollider = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.isDrawCollider = false;
    e.Tag = 0;
    e.graphics = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.start = function () {
    if (this.isDrawCollider) {
      var t = new cc.Node("DrawNode");
      t.zIndex = cc.macro.MAX_ZINDEX;
      this.node.addChild(t);
      this.graphics = t.addComponent(cc.Graphics);
      this.graphics.lineWidth = 5;
      this.graphics.strokeColor = cc.Color.RED;
      this.drawCollider();
    }
  };
  _ctor.prototype.update = function () {
    this.isDrawCollider && this.drawCollider();
  };
  _ctor.prototype.drawCollider = function () {};
  Object.defineProperty(_ctor.prototype, "tag", {
    get: function () {
      return this.Tag;
    },
    enumerable: false,
    configurable: true
  });
  cc__decorate([ccp_property()], _ctor.prototype, "isDrawCollider", undefined);
  cc__decorate([ccp_property()], _ctor.prototype, "Tag", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BaseSimplyCollider;