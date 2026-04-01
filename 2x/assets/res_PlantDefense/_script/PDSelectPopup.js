var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10List = require("List");
var $10EventManager = require("EventManager");
var $10PopupBase = require("PopupBase");
var $10PopupManager = require("PopupManager");
var $10SceneManager = require("SceneManager");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDSelectItem = require("PDSelectItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDSelectPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.list = null;
    e._itemList = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {};
  _ctor.prototype.onEnable = function () {
    $10EventManager.EventManager.instance.on($10PlantDefenseDataProxy.PDDataEvent.Eenter_PD_GAME, this.onEnterGame, this);
  };
  _ctor.prototype.onDisable = function () {
    $10EventManager.EventManager.instance.off($10PlantDefenseDataProxy.PDDataEvent.Eenter_PD_GAME, this.onEnterGame, this);
  };
  _ctor.prototype.onEnterGame = function () {
    this.removeUI();
    $10PopupManager.PopupManager.instance.removeAll();
    setTimeout(function () {
      $10SceneManager.SceneManager.instance.runScene("PlantDefense", $10HomeEnum.Bundles.PlantDefense);
    }, 200);
  };
  _ctor.prototype.onShow = function () {
    $10PlantDefenseDataProxy.plantDefenseDataProxy.PlantDefenseData.unlockLevels.includes(101) || $10PlantDefenseDataProxy.plantDefenseDataProxy.PlantDefenseData.unlockLevels.push(101);
    this._itemList = [];
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameMode == $10PlantDefenseDataProxy.PDGameMode.PD_GAME) {
      for (var t = 0; t < 7; t++) {
        e = $10DataManager.DataManager.instance.eData.datapara[t + 108];
        if (e) {
          this._itemList.push({
            id: t + 1,
            data: e.num
          });
        }
      }
    } else if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameMode == $10PlantDefenseDataProxy.PDGameMode.SJ_GAME) {
      for (t = 0; t < 5; t++) {
        var e;
        e = $10DataManager.DataManager.instance.eData.datapara[t + 208];
        if (e) {
          this._itemList.push({
            id: t + 1 + 100,
            data: e.num
          });
        }
      }
    }
    this.list.numItems = this._itemList.length;
  };
  _ctor.prototype.onListRender = function (t, e) {
    var n = this._itemList[e];
    t.getComponent($10PDSelectItem.default).updateData(n);
  };
  cc__decorate([ccp_property($10List.default)], _ctor.prototype, "list", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_PDSelectPopup;