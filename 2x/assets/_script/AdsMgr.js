var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdsParam = undefined;
var $10UserDataProxy = require("UserDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var exp_AdsParam = function (t, e, o, i, n) {
  this.success = null;
  this.fail = null;
  this.error = null;
  this.id = t;
  this.eventId = e;
  this.success = o;
  this.fail = i;
  this.error = n;
};
exports.AdsParam = exp_AdsParam;
var def_AdsMgr = function () {
  function _ctor() {}
  _ctor.showVideoAds = function (t, e) {
    undefined === e && (e = false);
   
      mm.platform.umaTrackEvent("pay", {
        userA: t.eventId + "_" + $10UserDataProxy.userDataProxy.userData.curChapter
      });
      return void (t.success && t.success());
       };
  return cc__decorate([ccp_ccclass], _ctor);
}();
exports.default = def_AdsMgr;