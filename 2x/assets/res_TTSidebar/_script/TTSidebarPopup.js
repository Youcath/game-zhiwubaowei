var r;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameUIManager = require("GameUIManager");
var $10EventManager = require("EventManager");
var $10FlyItemAnimCtrl2 = require("FlyItemAnimCtrl2");
var $10AppProxy = require("AppProxy");
var $10PopupBase = require("PopupBase");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_TTSidebarPopup = function (e) {
  function _ctor() {
    var t = null !== e && e.apply(this, arguments) || this;
    t.mBtnReceive = null;
    t.mBtnTarget = null;
    return t;
  }
  cc__extends(_ctor, e);
  _ctor.prototype.onDisable = function () {
    $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.handlePublicize);
    $10EventManager.EventManager.instance.off($10AppProxy.AppEvent.GAME_SHOW, this.initUI, this);
  };
  _ctor.prototype.init = function () {
    console.log("TTSidebarPopup->init");
    this.mBtnReceive.active = this.mBtnTarget.active = false;
    $10EventManager.EventManager.instance.on($10AppProxy.AppEvent.GAME_SHOW, this.initUI, this);
    this.initUI();
  };
  _ctor.prototype.initUI = function () {
    this.mBtnReceive.active = false;
    this.mBtnTarget.active = true;
    console.log("onGameShow isGetSideBarAward::", $10UserDataProxy.userDataProxy.userData.isGetSideBarAward);
    console.log("isSidebarCardInGameForTT::", $10DataManager.DataManager.isSidebarCardInGameForTT);
    if ($10DataManager.DataManager.isSidebarCardInGameForTT && $10UserDataProxy.userDataProxy.userData.isGetSideBarAward <= 0) {
      this.mBtnReceive.active = true;
      this.mBtnTarget.active = false;
    } else {
      this.mBtnReceive.active = false;
      this.mBtnTarget.active = true;
    }
  };
  _ctor.prototype.btnCallback = function (e, t) {
    switch (t) {
      case "btn_receive":
        if ($10UserDataProxy.userDataProxy.userData.isGetSideBarAward > 0) {
          return;
        }
        $10DataManager.DataManager.isSidebarCardInGameForTT = false;
        $10UserDataProxy.userDataProxy.userData.isGetSideBarAward = 1;
        var a = $10DataManager.DataManager.instance.eData.datapara[54].num.split("|");
        for (var r = 0; r < a.length; ++r) {
          var i = a[r].split("_").map(Number);
          if (2 == i[0]) {
            $10UserDataProxy.userDataProxy.changeDiamond(i[1]);
            var n = "textures/item/icon_2";
            var o = this.node.getChildByName("quality");
            this.getAward(i[1], o, n, $10FlyItemAnimCtrl2.E_ItemIDType.DIAMOND);
          } else if (1 == i[0]) {
            $10UserDataProxy.userDataProxy.changeGold(i[1]);
            n = "textures/item/icon_1";
            o = this.node.getChildByName("quality copy");
            this.getAward(i[1], o, n, $10FlyItemAnimCtrl2.E_ItemIDType.GOLD);
          }
        }
        $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.GET_SIDEBAR);
        this.removeUI();
        break;
      case "btn_to_target":
        if (cc.sys.platform == cc.sys.BYTEDANCE_GAME) {
          tt.navigateToScene({
            scene: "sidebar",
            success: function () {
              console.log("navigate to scene success");
            },
            fail: function (e) {
              console.log("navigate to scene fail: ", e);
            }
          });
        } else if (cc.sys.isBrowser) {
          $10DataManager.DataManager.isSidebarCardInGameForTT = true, $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.GAME_SHOW);
        }
    }
  };
  _ctor.prototype.getAward = function (e, t, a, r) {
    var i = [{
      id: r,
      num: e
    }];
    $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
      list: i,
      type: 1
    });
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnReceive", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnTarget", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_TTSidebarPopup;