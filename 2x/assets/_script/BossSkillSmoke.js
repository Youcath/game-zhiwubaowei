var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10NodePoolManager = require("NodePoolManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_BossSkillSmoke = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.play = function () {
    var t = this;
    this.node.scale = 1;
    cc.Tween.stopAllByTarget(this.node);
    cc.tween(this.node).to(.5, {
      scale: 1.3
    }).call(function () {
      $10NodePoolManager.default.instance.putNode(t.node);
    }).start();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BossSkillSmoke;