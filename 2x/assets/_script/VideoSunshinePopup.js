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
cc__decorator.property;
var def_VideoSunshinePopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._closeFunc = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    this._closeFunc = t.closeFunc;
    var e = this.node.getChildByName("BtnVideo").getChildByName("videoIcon");
    $10BattleDataProxy.battleDataProxy.setVideoCardIcon(e, 4, 1.5);
  };
  _ctor.prototype.onVideoBtn = function () {
    this._closeFunc && this._closeFunc();
    this.removeUI();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_VideoSunshinePopup;