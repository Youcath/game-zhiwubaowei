var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ComponentBase = require("ComponentBase");
var $10Queue = require("Queue");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_Tips = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.nView = null;
    e.nTipsItem = null;
    e.queue = new $10Queue.default();
    e.itemPool = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    this.queue = new $10Queue.default();
    this.itemPool = new cc.NodePool();
  };
  _ctor.prototype.pushTips = function (t) {
    var e = this;
    e.queue || (e.queue = new $10Queue.default());
    if (!(e.queue.size() > 5)) {
      e.node.zIndex = cc.macro.MAX_ZINDEX;
      var o = null;
      o = this.itemPool.size() <= 0 ? cc.instantiate(e.nTipsItem) : this.itemPool.get();
      e.nView.addChild(o);
      o.active = true;
      var i = o.getChildByName("Desc").getComponent(cc.RichText);
      var n = o.getChildByName("Bg");
      if (i) {
        i.string = "<outline color = #000000>" + t + "</outline>";
        this.scheduleOnce(function () {
          n.width = (i.node.width + 80) * i.node.scaleX;
          e.queue.enqueue(o);
          e.openAnim(o);
        }, .02);
      }
    }
  };
  _ctor.prototype.openAnim = function (t) {
    var e = this;
    var o = this;
    t.scale = 2;
    t.opacity = 255;
    t.active = true;
    cc.tween(t).to(.4, {
      scale: 1.5
    }, {
      easing: "circOut"
    }).delay(1).to(.3, {
      scale: 1,
      opacity: 0
    }).call(function () {
      var t = o.queue.dequeue();
      t.active = false;
      e.itemPool.put(t);
    }).start();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nView", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nTipsItem", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComponentBase.ComponentBase);
exports.default = def_Tips;