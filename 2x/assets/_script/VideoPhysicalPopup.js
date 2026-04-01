var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PopupBase = require("PopupBase");
var $10AdsMgr = require("AdsMgr");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var $10AnimationMgr = require("AnimationMgr");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_VideoPhysicalPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mAddNum = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    this.mAddNum.string = "+" + $10DataManager.DataManager.instance.eData.datapara[24].num;
  };
  _ctor.prototype.onBtnVideo = function () {
    var t = this;
    $10AdsMgr.default.showVideoAds({
      id: 1,
      eventId: "video_physical_ad",
      success: function () {
        var e = Number($10DataManager.DataManager.instance.eData.datapara[24].num);
        $10UserDataProxy.userDataProxy.addProp(3, e);
        $10AnimationMgr.default.instance.showAwardAni({
          id: 3,
          num: e
        }, t.node.parent, t.mAddNum.node);
        t.removeUI();
      },
      fail: function () {},
      error: function (t) {
        cc.log(t);
      }
    }, true);
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mAddNum", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_VideoPhysicalPopup;