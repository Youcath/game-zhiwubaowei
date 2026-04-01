var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PopupBase = require("PopupBase");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_VideoManurePopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._closeFunc = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    this._closeFunc = t.closeFunc;
    this.node.getChildByName("addNum").getComponent(cc.Label).string = "+" + $10DataManager.DataManager.instance.eData.datapara[82].num;
    var e = this.node.getChildByName("residue");
    var o = Number($10DataManager.DataManager.instance.eData.datapara[81].num);
    e.getComponent(cc.Label).string = "剩余次数：" + (o - $10UserDataProxy.userDataProxy.userData.videoManureNum) + "/" + o;
  };
  _ctor.prototype.onVideoBtn = function () {
    this._closeFunc && this._closeFunc();
    this.removeUI();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_VideoManurePopup;