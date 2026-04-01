var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10PopupManager = require("PopupManager");
var $10MB_GameEnum = require("MB_GameEnum");
var $10MBScene = require("MBScene");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MB_BagUI = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.nBtns = null;
    e.lStage = null;
    e.nTips = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.start = function () {
    $10EventManager.EventManager.instance.on($10MB_GameEnum.E_MB_BattleEvent.MONSTER_LOADED, this.onMonsterLoaded, this);
    this.nTips.active = yzll.gameConfig.isZB || yzll.gameConfig.debug;
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10MB_GameEnum.E_MB_BattleEvent.MONSTER_LOADED, this.onMonsterLoaded, this);
  };
  _ctor.prototype.onEnterReady = function () {
    this.lStage.string = $10MBScene.default.instance.curStage + "/" + $10MBScene.default.instance.maxStage + "波";
    this.nBtns.y = -500;
    this.nBtns.active = true;
  };
  _ctor.prototype.onMonsterLoaded = function () {
    cc.tween(this.nBtns).to(.5, {
      y: 0
    }).start();
  };
  _ctor.prototype.onEnterBattle = function () {
    var t = this;
    cc.tween(this.nBtns).to(.2, {
      y: -500
    }).call(function () {
      t.nBtns.active = false;
    }).start();
  };
  _ctor.prototype.onClickBtnStart = function () {
    $10MBScene.default.instance.enterBattle();
  };
  _ctor.prototype.onClickBtnAttrView = function () {
    $10MBScene.default.instance.attrUI.showTotalAttr();
  };
  _ctor.prototype.onClickBtnSet = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: "res_MB",
      path: "popups/MBSettingPopup",
      keep: true
    });
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nBtns", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "lStage", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nTips", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_MB_BagUI;