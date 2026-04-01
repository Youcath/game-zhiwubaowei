var i;
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
var $10STJDataProxy = require("STJDataProxy");
var $10STSelectItem = require("STSelectItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_STSelectPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.list = null;
    e._itemList = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {};
  _ctor.prototype.onEnable = function () {
    $10EventManager.EventManager.instance.on($10STJDataProxy.STJDataEvent.Eenter_STJ_GAME, this.onEnterGame, this);
  };
  _ctor.prototype.onDisable = function () {
    $10EventManager.EventManager.instance.off($10STJDataProxy.STJDataEvent.Eenter_STJ_GAME, this.onEnterGame, this);
  };
  _ctor.prototype.onEnterGame = function () {
    this.removeUI();
    $10PopupManager.PopupManager.instance.removeAll();
    setTimeout(function () {
      $10SceneManager.SceneManager.instance.runScene("SmashTheJar", $10HomeEnum.Bundles.SmashTheJar);
    }, 200);
  };
  _ctor.prototype.onShow = function () {
    this._itemList = Object.values($10DataManager.DataManager.instance.eData.data_jarstage);
    this.list.numItems = this._itemList.length;
  };
  _ctor.prototype.onListRender = function (t, e) {
    var o = this._itemList[e];
    t.getComponent($10STSelectItem.default).updateData(o);
  };
  cc__decorate([ccp_property($10List.default)], _ctor.prototype, "list", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_STSelectPopup;