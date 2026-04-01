var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10PopupBase = require("PopupBase");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_UnlockHybridPlantPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mPlantImg = null;
    e.mPlantName = null;
    e._closeFunc = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    var e = this;
    var o = t.plantId;
    this._closeFunc = t.callback;
    var i = $10DataManager.DataManager.instance.eData.dataplant[o];
    this.mPlantImg.spriteFrame = null;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/botanyIcon/BotanyIcon",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      e.mPlantImg.spriteFrame = t.getSpriteFrame("" + i.icon);
      e.mPlantImg.node.scale = .3;
      cc.tween(e.mPlantImg.node).to(.15, {
        scale: 3
      }).to(.1, {
        scale: 2.5
      }).call(function () {
        var t = cc.tween(e.mPlantImg.node).to(.3, {
          scale: 2.7
        }).to(.3, {
          scale: 2.5
        });
        cc.tween(e.mPlantImg.node).repeatForever(t).start();
      }).start();
    }).catch(function (t) {
      console.log("error:", t);
    });
    this.mPlantName.string = i.name;
  };
  _ctor.prototype.removeUI = function (e, o) {
    this._closeFunc && this._closeFunc();
    t.prototype.removeUI.call(this, e, o);
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mPlantImg", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mPlantName", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_UnlockHybridPlantPopup;