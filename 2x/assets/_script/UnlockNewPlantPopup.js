var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10PopupBase = require("PopupBase");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_UnlockNewPlantPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mPlantSpine = null;
    e.mPlantName = null;
    e.mBtnClose = null;
    e._plantId = 0;
    e._closeFunc = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    var e = this;
    this._closeFunc = t.closeFunc;
    this.mPlantSpine.setCompleteListener(function (t) {
      var o = t.animation ? t.animation.name : "";
      if ("1" == o) {
        e.mBtnClose.active = true;
        e.mPlantSpine.setAnimation(0, "2", true);
      } else if ("3" == o) {
        if ($10UserDataProxy.userDataProxy.mNewUnlockPlantIds.length <= 0) {
          e.node.destroy(), e.node.removeFromParent(), e._closeFunc && e._closeFunc();
        } else {
          e.setPlantInfo(), e.playSpine();
        }
      }
    });
    this.setPlantInfo();
  };
  _ctor.prototype.setPlantInfo = function () {
    this._plantId = $10UserDataProxy.userDataProxy.mNewUnlockPlantIds[0];
    var t = $10DataManager.DataManager.instance.eData.dataplant[this._plantId];
    this.mPlantName.node.active = true;
    this.mPlantName.string = t.name;
    this.mBtnClose.active = false;
    this.mPlantSpine.node.active = false;
    $10UserDataProxy.userDataProxy.mNewUnlockPlantIds.splice(0, 1);
  };
  _ctor.prototype.playSpine = function () {
    this.mPlantSpine.node.active = true;
    this.mPlantSpine.setSkin("plant" + this._plantId);
    this.mPlantSpine.setAnimation(0, "1", false);
  };
  _ctor.prototype.onShow = function () {
    this.playSpine();
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/getPlant", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.onBtnClose = function () {
    this.mBtnClose.active = false;
    this.mPlantName.node.active = false;
    this.mPlantSpine.setAnimation(0, "3", false);
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mPlantSpine", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mPlantName", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnClose", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_UnlockNewPlantPopup;