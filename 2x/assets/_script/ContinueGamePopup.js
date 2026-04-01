var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PopupBase = require("PopupBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_ContinueGamePopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mCloseFunc = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    this.mCloseFunc = t.callBack;
  };
  _ctor.prototype.onBtnAgain = function () {
    this.mCloseFunc && this.mCloseFunc(true);
    this.removeUI();
  };
  _ctor.prototype.onBtnClose = function () {
    this.mCloseFunc && this.mCloseFunc(false);
    this.removeUI();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_ContinueGamePopup;