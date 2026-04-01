var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDPlantItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.iconImg = null;
    e.priceLabel = null;
    e.itemData = null;
    e._isOnce = false;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "isOnce", {
    get: function () {
      return this._isOnce;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.init = function (t, e) {
    var n = this;
    undefined === e && (e = false);
    this._isOnce = e;
    this.itemData = t;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/botanyIcon/BotanyIcon",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      n.node && n.node.isValid && (n.iconImg.spriteFrame = e.getSpriteFrame(t.icon));
    }).catch(function (t) {
      console.log("error:", t);
    });
    this.priceLabel.string = t.sunshine;
    this.node.getChildByName("layer").active = !e;
    this.node.getChildByName("bg").active = 1 == t.type;
    this.node.getChildByName("bg2").active = 2 == t.type;
    15 == t.id && ($10PlantDefenseDataProxy.plantDefenseDataProxy.plantNode15 = this.node);
    this.updateState();
    this.iconImg.node.scale = this.getScale(t.id);
  };
  _ctor.prototype.getScale = function (t) {
    switch (t) {
      case 20:
        return .9;
      case 7:
      case 7:
      case 8:
        return .8;
      case 19:
        return .6;
      default:
        return 1;
    }
  };
  _ctor.prototype.updateState = function () {
    if (this._isOnce) {
      this.node.getChildByName("mask").active = false;
    } else {
      this.node.getChildByName("mask").active = !this.checkIsCanBuy();
    }
  };
  _ctor.prototype.checkIsCanBuy = function () {
    return !(!this.itemData || !this._isOnce) || !!(this.itemData && this.itemData.sunshine <= $10PlantDefenseDataProxy.plantDefenseDataProxy.curSunshine);
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "iconImg", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "priceLabel", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDPlantItem;