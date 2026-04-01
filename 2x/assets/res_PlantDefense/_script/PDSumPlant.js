var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10HomeEnum = require("HomeEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDSumPlant = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.total = 0;
    e.isFlying = false;
    e.floatTimer = 0;
    e.floatInterval = 2;
    e.floatStartTime = 5;
    e.isFloating = false;
    e.originalY = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if (!this.isFlying) {
      this.floatTimer += t;
      this.floatTimer >= this.floatStartTime && (this.floatTimer - this.floatStartTime) % this.floatInterval < t && !this.isFloating && this.startFloatAnimation();
    }
  };
  _ctor.prototype.startFloatAnimation = function () {
    var t = this;
    if (!this.isFloating) {
      this.isFloating = true;
      this.originalY || (this.originalY = this.node.y);
      cc.tween(this.node).to(.25, {
        y: this.originalY + 10
      }, {
        easing: "sineOut"
      }).to(.25, {
        y: this.originalY
      }, {
        easing: "sineIn"
      }).call(function () {
        t.isFloating = false;
      }).start();
    }
  };
  _ctor.prototype.init = function (t) {
    this.total = t;
    this.isFlying = false;
    this.floatTimer = 0;
    this.isFloating = false;
  };
  _ctor.prototype.collect = function () {
    var t = this;
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/shouji", $10HomeEnum.Bundles.PlantDefense);
    this.isFlying = true;
    this.node.stopAllActions();
    var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.sumBoxNode.convertToWorldSpaceAR(cc.v3(0, 0));
    var n = $10PlantDefenseDataProxy.plantDefenseDataProxy.summerLayer.convertToNodeSpaceAR(e);
    var o = this.node.position;
    var i = n.x - o.x;
    var a = n.y - o.y;
    var c = Math.sqrt(i * i + a * a);
    var p = o.x + .5 * i;
    var u = o.y + .5 * a + Math.min(80, .3 * c);
    var d = p + 20 * (Math.random() - .5);
    var h = cc.view.getVisibleSize();
    var m = Math.max(30, Math.min(h.width - 30, d));
    var f = Math.max(30, Math.min(h.height - 30, u));
    var y = cc.v2(m, f);
    var _ = Math.max(.3, Math.min(.5, c / 300));
    cc.tween(this.node).bezierTo(_, y, y, cc.v2(n.x, n.y)).call(function () {
      $10PlantDefenseDataProxy.plantDefenseDataProxy.addSunshine(t.total);
      t.node.destroy();
      t.node.removeFromParent();
    }).start();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDSumPlant;