var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PopupBase = require("PopupBase");
var $10BattleDataProxy = require("BattleDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MessagePopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mVideoIcon = null;
    e.mTitle = null;
    e.mTips = null;
    e._closeFunc = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    var e = t.title;
    var o = t.tips;
    var i = t.isVideo;
    var n = t.isGameVideo;
    var a = t.closeLab;
    var r = t.sltLab;
    var c = t.hideClose;
    this._closeFunc = t.callBack;
    e && "" != e && (this.mTitle.string = e);
    o && "" != o && (this.mTips.string = o);
    this.mVideoIcon.active = i;
    i && n && $10BattleDataProxy.battleDataProxy.setVideoCardIcon(this.mVideoIcon, 1, 1.2);
    a && "" != a && (this.node.getChildByName("btnClose").getChildByName("lab").getComponent(cc.Label).string = a);
    r && "" != r && (this.mVideoIcon.parent.getChildByName("lab").getComponent(cc.Label).string = r);
    if (c) {
      this.node.getChildByName("btnClose").active = false;
      this.node.getChildByName("btnAgain").x = 0;
    }
  };
  _ctor.prototype.onBtnClose = function () {
    this._closeFunc && this._closeFunc(false);
    this.removeUI();
  };
  _ctor.prototype.onBtnAgain = function () {
    this._closeFunc && this._closeFunc(true);
    this.removeUI();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mVideoIcon", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mTitle", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mTips", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_MessagePopup;