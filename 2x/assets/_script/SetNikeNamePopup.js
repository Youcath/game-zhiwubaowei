var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PopupBase = require("PopupBase");
var $10SensitiveUtils = require("SensitiveUtils");
var $10GameUIManager = require("GameUIManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_SetNikeNamePopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mEditBox = null;
    e._closeFunc = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    this._closeFunc = t.closeFunc;
  };
  _ctor.prototype.onBtnSet = function () {
    var t = this.mEditBox.string;
    if ($10SensitiveUtils.default.getIsSensitive(t)) {
      $10GameUIManager.gameUIMgr.showTips("名字不合法");
    } else if ("" != t) {
      this._closeFunc(t);
      this.removeUI();
    } else {
      $10GameUIManager.gameUIMgr.showTips("请输入昵称");
    }
  };
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "mEditBox", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_SetNikeNamePopup;