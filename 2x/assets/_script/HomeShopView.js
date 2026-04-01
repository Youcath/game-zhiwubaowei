var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10TimeUtil = require("TimeUtil");
var $10AdsMgr = require("AdsMgr");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10GameUIManager = require("GameUIManager");
var $10GlodShopItem = require("GlodShopItem");
var $10BigBoxShopLayer = require("BigBoxShopLayer");
var $10ShopItem = require("ShopItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_HomeShopView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.contant = null;
    e.dailyContant = null;
    e.bigBoxShopLayer = null;
    e.goldContant = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onEnable = function () {
    $10UserDataProxy.userDataProxy.userData.boxData || ($10UserDataProxy.userDataProxy.userData.boxData = {
      cdTime: 0,
      bigState: 0,
      level: 1,
      exp: 0
    });
    $10UserDataProxy.userDataProxy.userData.goldData || ($10UserDataProxy.userDataProxy.userData.goldData = {
      videoNum: 0,
      mfNum: 0
    });
    this.initView();
    this.startCdTimer();
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.REFRESH_DIAMOND, this.initView, this);
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.REFRESH_MONEY, this.initView, this);
  };
  _ctor.prototype.onDisable = function () {
    this.unscheduleAllCallbacks();
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.REFRESH_DIAMOND, this.initView, this);
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.REFRESH_MONEY, this.initView, this);
  };
  _ctor.prototype.initView = function () {
    var t = $10DataManager.DataManager.instance.eData.datadailyshop;
    var e = 0;
    for (var o in t) {
      this.dailyContant.children[e].getComponent($10ShopItem.default).init(t[o]);
      e++;
    }
    var i = cc.find("dailyShopLayer/videoBtn", this.contant);
    i.getChildByName("proLabel").getComponent(cc.Label).string = 20 - $10UserDataProxy.userDataProxy.userData.refreshNum + "/20";
    this.bigBoxShopLayer.getComponent($10BigBoxShopLayer.default).init();
    var n = $10DataManager.DataManager.instance.eData.databuygold;
    e = 0;
    for (var o in n) {
      this.goldContant.getChildByName("glodItem_" + (e + 1)).getComponent($10GlodShopItem.default).init(n[o]);
      e++;
    }
    if ($10UserDataProxy.userDataProxy.userData.refreshNum >= 20) {
      i.getChildByName("icon_ad").getComponent(cc.Sprite).setMaterial(0, cc.Material.getBuiltinMaterial("2d-gray-sprite"));
      i.getComponent(cc.Sprite).setMaterial(0, cc.Material.getBuiltinMaterial("2d-gray-sprite"));
    }
  };
  _ctor.prototype.startCdTimer = function () {
    var t = this;
    this.unscheduleAllCallbacks();
    var e = $10Util.default.getNextDayZeroTimestamp() - Date.now();
    var o = cc.find("dailyShopLayer/timerCd", this.contant).getComponent(cc.Label);
    var i = cc.find("bigBoxShopLayer/boxShopItem2/timerCd", this.contant).getComponent(cc.Label);
    i.node.active = 1 == $10UserDataProxy.userDataProxy.userData.boxData.bigState;
    o.string = $10TimeUtil.TimeUtil.format_HHMMSS(e);
    this.schedule(function () {
      if ((e -= 1e3) < 0) {
        t.unscheduleAllCallbacks();
        $10UserDataProxy.userDataProxy.userData.dailyData = {};
        $10UserDataProxy.userDataProxy.userData.boxData.cdTime = 0;
        $10UserDataProxy.userDataProxy.userData.boxData.bigState = 0;
        $10UserDataProxy.userDataProxy.saveData();
        t.initView();
        t.startCdTimer();
      }
      o.string = $10TimeUtil.TimeUtil.format_HHMMSS(e);
      1 == $10UserDataProxy.userDataProxy.userData.boxData.bigState && (i.string = $10TimeUtil.TimeUtil.format_HHMMSS(e));
    }, 1);
  };
  _ctor.prototype.refreshClick = function () {
    var t = this;
    if ($10UserDataProxy.userDataProxy.userData.refreshNum >= 20) {
      $10GameUIManager.gameUIMgr.showTips("今日刷新次数已达上限！");
    } else {
      $10AdsMgr.default.showVideoAds({
        id: 1,
        eventId: "shop_refresh_ad",
        success: function () {
          $10UserDataProxy.userDataProxy.userData.refreshNum += 1;
          var e = $10DataManager.DataManager.instance.eData.datadailyshop;
          for (var o in e) {
            e[o].videoRefresh > 0 && ($10UserDataProxy.userDataProxy.userData.dailyData[e[o].id] = null);
          }
          t.initView();
          $10UserDataProxy.userDataProxy.saveData();
        },
        fail: function (t) {
          return console.log(t);
        },
        error: function (t) {
          return console.log(t);
        }
      }, true);
    }
  };
  _ctor.prototype.openEquipmentFragmentsPopup = function () {
    $10GameUIManager.gameUIMgr.showEquipmentFragmentsPopup();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "contant", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "dailyContant", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "bigBoxShopLayer", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "goldContant", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_HomeShopView;