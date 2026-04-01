var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HybridBagItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._plantData = null;
    e._hybridPlantData = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.UPDATE_PLANT_LEVEL, this.onUpdatePlantLevel, this);
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.UPDATE_PLANT_LEVEL, this.onUpdatePlantLevel, this);
  };
  _ctor.prototype.onUpdatePlantLevel = function () {
    this.initHybridBagItem(this._hybridPlantData);
  };
  _ctor.prototype.initHybridBagItem = function (t) {
    var e = this;
    this._hybridPlantData = t;
    var o = this.node.getChildByName("plantImg");
    var i = this.node.getChildByName("lv");
    var n = this.node.getChildByName("plantName");
    var a = this.node.getChildByName("pic_jindutiaodi").getChildByName("bar");
    var r = this.node.getChildByName("pic_jindutiaodi").getChildByName("barNum");
    var u = this.node.getChildByName("pic_jindutiaodi").getChildByName("arrow");
    this.node.getChildByName("redDot");
    this._plantData = $10DataManager.DataManager.instance.eData.dataplant[t.plantId];
    n.getComponent(cc.Label).string = this._plantData.name;
    i.getComponent(cc.Label).string = "" + t.lv;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/botanyIcon/BotanyIcon",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      o.getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("" + e._plantData.icon);
    }).catch(function (t) {
      console.log("error:", t);
    });
    var h = $10UserDataProxy.userDataProxy.getNewProp(this._plantData.needItem);
    var d = Number(this._plantData.needNum.split("|")[t.lv - 1]);
    a.getComponent(cc.Sprite).fillRange = h / d;
    r.getComponent(cc.Label).string = h + "/" + d;
    u.active = h >= d;
    u.y = 7;
    cc.Tween.stopAllByTarget(u);
    if (u.active) {
      var m = cc.tween(u).by(.3, {
        position: cc.v3(0, 5)
      }).by(.3, {
        position: cc.v3(0, -5)
      }).delay(.15);
      cc.tween(u).repeatForever(m).start();
    }
    this.checkMax(t);
  };
  _ctor.prototype.checkMax = function (t) {
    var e = t.lv;
    if ($10BattleDataProxy.battleDataProxy.getPlantAtk(t.plantId, 1, e + 1) <= 0) {
      var o = this.node.getChildByName("pic_jindutiaodi").getChildByName("bar");
      var i = this.node.getChildByName("pic_jindutiaodi").getChildByName("barNum");
      o.getComponent(cc.Sprite).fillRange = 1;
      i.getComponent(cc.Label).string = "Max";
      this.node.getChildByName("pic_jindutiaodi").getChildByName("arrow").active = false;
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_HybridBagItem;