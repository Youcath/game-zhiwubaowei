var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__read = __read;
var cc__spread = __spread;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var c;
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_menu = cc__decorator.menu;
var ccp_requireComponent = cc__decorator.requireComponent;
var ccp_disallowMultiple = cc__decorator.disallowMultiple;
(function (t) {
  t[t.ONE = 1] = "ONE";
  t[t.TWO = 2] = "TWO";
  t[t.MORE = 3] = "MORE";
})(c || (c = {}));
var def_ScrollViewEx = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.childLayerType = c.ONE;
    e.childLayerNum = 3;
    e._scrollView = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    this._scrollView = this.node.getComponent(cc.ScrollView);
  };
  _ctor.prototype.onEnable = function () {
    this.node.on("scrolling", this.onEventUpdateOpacity, this);
    this._scrollView.content.on(cc.Node.EventType.CHILD_REMOVED, this.onEventUpdateOpacity, this);
    this._scrollView.content.on(cc.Node.EventType.CHILD_ADDED, this.onEventUpdateOpacity, this);
    this._scrollView.content.on(cc.Node.EventType.CHILD_REORDER, this.onEventUpdateOpacity, this);
  };
  _ctor.prototype.onDisable = function () {
    this.node.off("scrolling", this.onEventUpdateOpacity, this);
    this._scrollView.content.off(cc.Node.EventType.CHILD_REMOVED, this.onEventUpdateOpacity, this);
    this._scrollView.content.off(cc.Node.EventType.CHILD_ADDED, this.onEventUpdateOpacity, this);
    this._scrollView.content.off(cc.Node.EventType.CHILD_REORDER, this.onEventUpdateOpacity, this);
  };
  _ctor.prototype.updateOpacity = function () {
    var t = this;
    this._scrollView.getComponentsInChildren(cc.Layout).forEach(function (t) {
      t.updateLayout();
    });
    var e = this.childLayerType == c.MORE ? this.childLayerNum : this.childLayerType;
    var o = [];
    for (var i = [this._scrollView.content]; e > 0;) {
      o = [];
      i.forEach(function (t) {
        o.push.apply(o, cc__spread(t.children));
      });
      i = o.slice();
      e--;
    }
    o.forEach(function (e) {
      e.opacity = t.checkCollision(e) ? 255 : 0;
    });
  };
  _ctor.prototype.onEventUpdateOpacity = function () {
    this.updateOpacity();
  };
  _ctor.prototype.getBoundingBoxToWorld = function (t) {
    var e = t._contentSize.width;
    var o = t._contentSize.height;
    var i = cc.rect(-t._anchorPoint.x * e, -t._anchorPoint.y * o, e, o);
    t._calculWorldMatrix();
    i.transformMat4(i, t._worldMatrix);
    return i;
  };
  _ctor.prototype.checkCollision = function (t) {
    var e = this.getBoundingBoxToWorld(this.node.getComponent(cc.ScrollView).content.parent);
    var o = this.getBoundingBoxToWorld(t);
    return e.intersects(o);
  };
  cc__decorate([ccp_property({
    type: cc.Enum(c)
  })], _ctor.prototype, "childLayerType", undefined);
  cc__decorate([ccp_property({
    type: cc.Integer,
    visible: function () {
      return this.childLayerType == c.MORE;
    }
  })], _ctor.prototype, "childLayerNum", undefined);
  return cc__decorate([ccp_ccclass, ccp_disallowMultiple(), ccp_requireComponent(cc.ScrollView), ccp_menu("自定义组件/ScrollViewEx")], _ctor);
}(cc.Component);
exports.default = def_ScrollViewEx;