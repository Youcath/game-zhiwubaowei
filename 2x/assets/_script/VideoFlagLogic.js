var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_VideoFlagLogic = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._originSpf = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    this._originSpf = this.node.getComponent(cc.Sprite).spriteFrame;
  };
  _ctor.prototype.onDestroy = function () {};
  _ctor.prototype.onEnable = function () {
    if ("加时视频小图标" === this.node.name) {
      this.node.active = true;
    } else {
      this.node.getComponent(cc.Sprite).spriteFrame = this._originSpf;
    }
    this.refreshFlagStatus();
  };
  _ctor.prototype.playHideAnim = function () {
    var t = this;
    if ("加时视频小图标" === this.node.name) {
      this.node.active = false;
    } else {
      $10ResUtil.ResUtil.loadAsset({
        bundleName: "Res",
        path: "FreeAdFlag",
        type: cc.SpriteFrame
      }).then(function (e) {
        t.node.getComponent(cc.Sprite).spriteFrame = e;
      }).catch(function () {});
    }
  };
  _ctor.prototype.reLightVideoFlag = function () {
    if ("加时视频小图标" === this.node.name) {
      this.node.active = true;
    } else {
      this.node.getComponent(cc.Sprite).spriteFrame = this._originSpf;
    }
    this.refreshFlagStatus();
  };
  _ctor.prototype.refreshFlagStatus = function () {};
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_VideoFlagLogic;