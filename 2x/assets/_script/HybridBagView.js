var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10List = require("List");
var $10EventManager = require("EventManager");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10GameUIManager = require("GameUIManager");
var $10HybridBagItem = require("HybridBagItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_HybridBagView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mHybridBagList = null;
    e.mWearHybridBagItem = null;
    e.mItemContent = null;
    e.mStarNum = null;
    e._hybridPlantDatas = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.UPDATE_HYBRID_WEAR_PLANT, this.onUpdateHybridWearPlant, this);
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.UPDATE_HYBRID_WEAR_PLANT, this.onUpdateHybridWearPlant, this);
  };
  _ctor.prototype.onEnable = function () {
    this.onUpdateHybridWearPlant();
  };
  _ctor.prototype.onUpdateHybridWearPlant = function () {
    var t = $10UserDataProxy.userDataProxy.userData.wearHybridPlantId;
    var e = this.mWearHybridBagItem.getChildByName("BtnAdd");
    var o = this.mWearHybridBagItem.getChildByName("HybridBagItem");
    if (t && 0 != t) {
      e.active = false;
      o.active = true;
      var i = $10UserDataProxy.userDataProxy.userData.hybridPlantDatas.findIndex(function (e) {
        return e.plantId == t;
      });
      if (i < 0) {
        return void console.log("佩戴有误：", t);
      }
      this.setHybridBagItem($10UserDataProxy.userDataProxy.userData.hybridPlantDatas[i], o, true);
    } else {
      e.active = true;
      o.active = false;
    }
    this.mItemContent.removeAllChildren();
    this._hybridPlantDatas = [];
    for (var n = 0; n < $10UserDataProxy.userDataProxy.userData.hybridPlantDatas.length; ++n) {
      var a = $10UserDataProxy.userDataProxy.userData.hybridPlantDatas[n];
      a.plantId != t && this._hybridPlantDatas.push(a);
    }
    this.mHybridBagList.numItems = this._hybridPlantDatas.length;
    this.mStarNum.string = "" + $10UserDataProxy.userDataProxy.getHybridAllStar();
  };
  _ctor.prototype.onUpdateHybridBagItem = function (t, e) {
    var o = this._hybridPlantDatas[e];
    this.setHybridBagItem(o, t, false);
  };
  _ctor.prototype.setHybridBagItem = function (t, e, o) {
    e.getComponent($10HybridBagItem.default).initHybridBagItem(t);
    var i = e.getChildByName("BtnRemove");
    $10Util.default.addButtonListener(e, "HybridBagView", "onBagPlantItem", this.node, {
      item: e,
      hybridPlantData: t,
      isWear: o
    });
    $10Util.default.addButtonListener(i, "HybridBagView", "onBtnRemove", this.node, {
      item: e,
      hybridPlantData: t,
      isWear: o
    });
    i.active = !!o || !$10UserDataProxy.userDataProxy.userData.wearHybridPlantId || 0 == $10UserDataProxy.userDataProxy.userData.wearHybridPlantId;
  };
  _ctor.prototype.onBtnStar = function () {
    $10GameUIManager.gameUIMgr.showHybridStarPopup();
  };
  _ctor.prototype.onBagPlantItem = function (t, e) {
    var o = !$10UserDataProxy.userDataProxy.userData.wearHybridPlantId || 0 == $10UserDataProxy.userDataProxy.userData.wearHybridPlantId;
    e.isWear && (o = true);
    $10GameUIManager.gameUIMgr.showHybridPlantDetailsPopup(e.hybridPlantData, !e.isWear, o);
  };
  _ctor.prototype.onBtnRemove = function (t, e) {
    var o = e.isWear;
    $10UserDataProxy.userDataProxy.userData.wearHybridPlantId = o ? 0 : e.hybridPlantData.plantId;
    $10UserDataProxy.userDataProxy.saveData();
    $10EventManager.EventManager.instance.emit($10UserDataProxy.EUserDataEvent.UPDATE_HYBRID_WEAR_PLANT);
  };
  _ctor.prototype.updateRemoveBtn = function () {
    for (var t = 0; t < this.mItemContent.childrenCount; ++t) {
      this.mItemContent.children[t].getChildByName("BtnRemove").active = !$10UserDataProxy.userDataProxy.userData.wearHybridPlantId || 0 == $10UserDataProxy.userDataProxy.userData.wearHybridPlantId;
    }
  };
  cc__decorate([ccp_property($10List.default)], _ctor.prototype, "mHybridBagList", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mWearHybridBagItem", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mItemContent", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mStarNum", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_HybridBagView;