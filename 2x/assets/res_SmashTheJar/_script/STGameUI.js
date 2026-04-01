var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10PopupManager = require("PopupManager");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10STJDataProxy = require("STJDataProxy");
var $10STTresureItem = require("STTresureItem");
var $10STBattleView = require("STBattleView");
var $10STJarBox = require("STJarBox");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_STGameUI = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mWoodLab = null;
    e.tresureLayer = null;
    e.mFlyItemPb = null;
    e._maxWood = 200;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.start = function () {
    this.initView();
    this.node.getChildByName("zbTips").active = cc.sys.isBrowser && yzll.gameConfig.isZB;
    if (cc.sys.isBrowser && yzll.gameConfig.gameTestBtn) {
      this.node.getChildByName("test").active = true;
      this.node.getChildByName("test2").active = true;
    } else {
      this.node.getChildByName("test").active = false;
      this.node.getChildByName("test2").active = false;
    }
  };
  _ctor.prototype.onDisable = function () {
    $10EventManager.EventManager.instance.off($10STJDataProxy.STJDataEvent.WOOD_UPDATE, this.onUpdateWood, this);
    $10EventManager.EventManager.instance.off($10STJDataProxy.STJDataEvent.WOOD_ADD, this.onFlyItem, this);
  };
  _ctor.prototype.initView = function () {
    $10EventManager.EventManager.instance.on($10STJDataProxy.STJDataEvent.WOOD_UPDATE, this.onUpdateWood, this);
    $10EventManager.EventManager.instance.on($10STJDataProxy.STJDataEvent.WOOD_ADD, this.onFlyItem, this);
    this._maxWood = Number($10DataManager.DataManager.instance.eData.datapara[1906].num);
    this.onUpdateItem(0);
    $10AudioManager.AudioManager.instance.playBgmPath("sounds/bgm_1", $10HomeEnum.Bundles.RES, true);
  };
  _ctor.prototype.onUpdateWood = function () {
    $10STJDataProxy.sTJDataProxy.curWood > this._maxWood && ($10STJDataProxy.sTJDataProxy.curWood = this._maxWood);
    this.mWoodLab.string = "" + Math.floor($10STJDataProxy.sTJDataProxy.curWood);
    this.tresureLayer && this.tresureLayer.children.forEach(function (t) {
      t.getComponent($10STTresureItem.default) && t.getComponent($10STTresureItem.default).checkDragCondition();
    });
  };
  _ctor.prototype.onFlyItem = function (t, e) {
    var o = this;
    var i = cc.instantiate(this.mFlyItemPb);
    $10STJDataProxy.sTJDataProxy.effectLayer.addChild(i);
    i.active = true;
    var n;
    var a = $10STJDataProxy.sTJDataProxy.effectLayer.convertToNodeSpaceAR(t);
    a.y += 50;
    i.position = a;
    n = this.mWoodLab.node.parent.position.clone();
    i.position = i.position.clone().add(cc.v3(0, -60));
    cc.tween(i).by(.1, {
      position: cc.v3(0, 20)
    }).by(.15, {
      position: cc.v3(0, -60)
    }).delay(.25).to(.7, {
      position: n
    }).call(function () {
      o.onUpdateItem(Math.round(e / 1));
      i.destroy();
      i.removeFromParent();
    }).start();
  };
  _ctor.prototype.onUpdateItem = function (t) {
    $10STJDataProxy.sTJDataProxy.curWood += t;
    this.onUpdateWood();
  };
  _ctor.prototype.addWood100 = function () {
    $10STJDataProxy.sTJDataProxy.curWood += 100;
    this.onUpdateWood();
  };
  _ctor.prototype.showTest2 = function () {
    $10STJDataProxy.sTJDataProxy.battleView.getComponent($10STBattleView.default).grids.forEach(function (t) {
      $10STJDataProxy.sTJDataProxy.isJarIntact(t.id) && t.node && t.node.getComponent($10STJarBox.default).showLight();
    });
  };
  _ctor.prototype.openSetUp = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.SmashTheJar,
      path: "prefabs/popups/STSettingPopup",
      keep: true
    });
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mWoodLab", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "tresureLayer", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mFlyItemPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_STGameUI;