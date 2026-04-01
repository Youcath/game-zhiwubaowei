var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10PopupManager = require("PopupManager");
var $10HomeEnum = require("HomeEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDGameUI = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mWoodLab = null;
    e.mFlyItemPb = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.start = function () {
    this.initView();
    var t = this.node.getChildByName("zbTips");
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameMode == $10PlantDefenseDataProxy.PDGameMode.PD_GAME) {
      t.getComponent(cc.Label).string = "游戏主页>小玩法合集>战僵尸";
    } else {
      t.getComponent(cc.Label).string = "游戏主页>小玩法合集>随机植物";
    }
    t.active = cc.sys.isBrowser && yzll.gameConfig.isZB;
    if (yzll.gameConfig.gameTestBtn) {
      this.node.getChildByName("test").active = true;
    } else {
      this.node.getChildByName("test").active = false;
    }
    $10PlantDefenseDataProxy.plantDefenseDataProxy.sumBoxNode = cc.find("Wood/jinbi", this.node);
  };
  _ctor.prototype.onDisable = function () {
    $10EventManager.EventManager.instance.off($10PlantDefenseDataProxy.PDDataEvent.WOOD_UPDATE, this.onUpdateWood, this);
    $10EventManager.EventManager.instance.off($10PlantDefenseDataProxy.PDDataEvent.WOOD_ADD, this.onFlyItem, this);
  };
  _ctor.prototype.initView = function () {
    $10EventManager.EventManager.instance.on($10PlantDefenseDataProxy.PDDataEvent.WOOD_UPDATE, this.onUpdateWood, this);
    $10EventManager.EventManager.instance.on($10PlantDefenseDataProxy.PDDataEvent.WOOD_ADD, this.onFlyItem, this);
    this.onUpdateItem(0);
    $10AudioManager.AudioManager.instance.playBgmPath("sounds/bgm_1", $10HomeEnum.Bundles.RES, true);
  };
  _ctor.prototype.onUpdateWood = function () {
    this.mWoodLab.string = "" + Math.floor($10PlantDefenseDataProxy.plantDefenseDataProxy.curSunshine);
  };
  _ctor.prototype.onFlyItem = function () {};
  _ctor.prototype.onUpdateItem = function (t) {
    $10PlantDefenseDataProxy.plantDefenseDataProxy.addSunshine(t);
  };
  _ctor.prototype.addWood100 = function () {
    $10PlantDefenseDataProxy.plantDefenseDataProxy.addSunshine(100);
  };
  _ctor.prototype.openSetUp = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.PlantDefense,
      path: "prefabs/popups/PDSettingPopup",
      keep: true
    });
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mWoodLab", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mFlyItemPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDGameUI;