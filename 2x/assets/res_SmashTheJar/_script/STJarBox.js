var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_STJarBox = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.radomId = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    var e = this;
    this.radomId = t;
    var o = $10DataManager.DataManager.instance.eData.data_jarmonster[this.radomId];
    var i = cc.find("show/icon", this.node);
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.SmashTheJar,
      path: "textrues/role/" + o.res,
      type: cc.SpriteFrame
    }).then(function (t) {
      if (e.node && e.node.isValid) {
        i.getComponent(cc.Sprite).spriteFrame = t;
        e.node.getChildByName("show").active = false;
      }
    });
  };
  _ctor.prototype.playLight = function () {
    var t = this.node.getChildByName("liangguanzi");
    this.schedule(function () {
      t.active = !t.active;
    }, .2);
  };
  _ctor.prototype.showLight = function () {
    var t = this;
    this.node.getChildByName("show").active = true;
    this.node.getChildByName("guanzi").active = false;
    this.scheduleOnce(function () {
      t.node.getChildByName("show").active = false;
      t.node.getChildByName("guanzi").active = true;
    }, 3);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_STJarBox;