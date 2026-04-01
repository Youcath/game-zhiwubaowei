var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__read = __read;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10AdsMgr = require("AdsMgr");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10GameUIManager = require("GameUIManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BigBoxShopLayer = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.bigBox = null;
    e.bigbigBox = null;
    e.levelLabel = null;
    e.progressBar = null;
    e.progressLabel = null;
    e._bigBoxConfig = null;
    e._buyType1 = 1;
    e._buyPrice1 = 0;
    e._buyType2 = 1;
    e._buyPrice2 = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.DIAMOD_UPDATE, this.updateDiamond, this);
    var t = $10UserDataProxy.userDataProxy.userData.boxData;
    var e = Math.min(t.level, 10);
    this._bigBoxConfig = $10DataManager.DataManager.instance.eData.datashopbox[e];
    if (t.exp >= this._bigBoxConfig.exp) {
      this.upgradeBox(t);
    } else {
      this.updateDisplay(t);
      this.handleCooldown(t);
      this.enableButtons(t);
    }
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.DIAMOD_UPDATE, this.updateDiamond, this);
  };
  _ctor.prototype.upgradeBox = function (t) {
    t.exp -= this._bigBoxConfig.exp;
    t.level += 1;
    $10UserDataProxy.userDataProxy.saveData();
    this.init();
  };
  _ctor.prototype.updateDisplay = function (t) {
    this.levelLabel.string = "Lv." + t.level;
    this.progressBar.progress = t.exp / this._bigBoxConfig.exp;
    this.progressLabel.string = t.exp + "/" + this._bigBoxConfig.exp;
  };
  _ctor.prototype.updateDiamond = function () {
    var t = this._bigBoxConfig.cost.split("_");
    var e = Number(t[1]);
    var o = this.bigBox.getChildByName("buyBtn").getChildByName("label").getComponent(cc.Label);
    if ($10UserDataProxy.userDataProxy.userData.diamond >= e) {
      o.node.color = cc.Color.WHITE;
    } else {
      o.node.color = cc.Color.RED;
    }
    t = this._bigBoxConfig.bigCost.split("_");
    var i = Number(t[1]);
    var n = this.bigbigBox.getChildByName("BtnBuy").getChildByName("label").getComponent(cc.Label);
    if ($10UserDataProxy.userDataProxy.userData.diamond >= i) {
      n.node.color = cc.Color.WHITE;
    } else {
      n.node.color = cc.Color.RED;
    }
    var a = this.bigbigBox.getChildByName("buyBtn").getChildByName("label").getComponent(cc.Label);
    if ($10UserDataProxy.userDataProxy.userData.diamond >= i) {
      a.node.color = cc.Color.WHITE;
    } else {
      a.node.color = cc.Color.RED;
    }
  };
  _ctor.prototype.handleCooldown = function (t) {
    var e = this;
    this.unscheduleAllCallbacks();
    var o = this.bigBox.getChildByName("timerCd");
    o.active = t.cdTime > 0;
    if (t.cdTime > 0) {
      var i = t.cdTime - Date.now();
      var n = o.getComponent(cc.Label);
      n.string = $10Util.default.formatTimeMS(i, 3);
      this.schedule(function () {
        i -= 1e3;
        n.string = $10Util.default.formatTimeMS(i, 3);
        if (i <= 0) {
          e.unscheduleAllCallbacks();
          e.resetCdTimer();
        }
      }, 1);
    }
  };
  _ctor.prototype.resetCdTimer = function () {
    $10UserDataProxy.userDataProxy.userData.boxData.cdTime = 0;
    $10UserDataProxy.userDataProxy.saveData();
    this.init();
    $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.UPDATE_HOME_REDDOT, [$10HomeEnum.HOME_REDDOT.SHOPRED]);
  };
  _ctor.prototype.enableButtons = function (t) {
    var e;
    var o = !t.cdTime;
    this.bigBox.getChildByName("mianfeiBtn").active = o;
    this.bigBox.getChildByName("buyBtn").active = !o;
    if (t.cdTime) {
      e = this._bigBoxConfig.cost.split("_");
      this._buyType1 = Number(e[0]);
      this._buyPrice1 = Number(e[1]);
    }
    e = this._bigBoxConfig.bigCost.split("_");
    this._buyType2 = Number(e[0]);
    this._buyPrice2 = Number(e[1]);
    this.updateBuyButton(this.bigBox.getChildByName("buyBtn"), this._buyType1, this._buyPrice1);
    var i = this.bigbigBox.getChildByName("buyBtn");
    this.updateBuyButton(i, this._buyType2, this._buyPrice2);
    this.bigbigBox.getChildByName("videoBtn").active = !t.bigState;
    var n = this.bigbigBox.getChildByName("BtnBuy");
    i.active = !t.bigState;
    n.active = t.bigState;
    this.updateBuyButton(n, this._buyType2, this._buyPrice2);
  };
  _ctor.prototype.updateBuyButton = function (t, e, o) {
    var i = t.getChildByName("icon").getComponent(cc.Sprite);
    var n = t.getChildByName("label").getComponent(cc.Label);
    if (1 == e) {
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/item/icon_1",
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        i.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      if ($10UserDataProxy.userDataProxy.userData.gold >= o) {
        n.node.color = cc.Color.WHITE;
      } else {
        n.node.color = cc.Color.RED;
      }
    } else {
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/item/icon_2",
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        i.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      if ($10UserDataProxy.userDataProxy.userData.diamond >= o) {
        n.node.color = cc.Color.WHITE;
      } else {
        n.node.color = cc.Color.RED;
      }
    }
    n.string = o.toString();
  };
  _ctor.prototype.getBigBoxProp = function (t) {
    var e = 1 == t ? "reward" : "bigReward";
    var o = 1 == t ? "gainExp" : "bigGainExp";
    $10UserDataProxy.userDataProxy.userData.boxData.exp += Number(this._bigBoxConfig[o]);
    var i = this._bigBoxConfig[e].split("|").map(function (t) {
      return t.split("_");
    }).reduce(function (t, e) {
      var o = cc__read(e, 2);
      var i = o[0];
      var n = o[1];
      t.push({
        id: Number(i),
        num: Number(n)
      });
      return t;
    }, []);
    2 == t && this._bigBoxConfig.bigGainGold && i.push({
      id: 1,
      num: this._bigBoxConfig.bigGainGold
    });
    $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
      list: i,
      type: t + 1
    });
    $10UserDataProxy.userDataProxy.saveData();
    this.init();
  };
  _ctor.prototype.bigOneGetClick = function (t, e) {
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/click", $10HomeEnum.Bundles.RES);
    if (1 == e) {
      $10UserDataProxy.userDataProxy.userData.boxData.cdTime = Date.now() + 36e5 * Number(this._bigBoxConfig.freeTime);
      this.getBigBoxProp(1);
      $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.UPDATE_HOME_REDDOT, [$10HomeEnum.HOME_REDDOT.SHOPRED]);
    } else {
      this.purchaseBox(this._buyType1, this._buyPrice1, 1);
    }
  };
  _ctor.prototype.bigTwoGetClick = function (t, e) {
    var o = this;
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/click", $10HomeEnum.Bundles.RES);
    if (1 == e) {
      $10AdsMgr.default.showVideoAds({
        id: 1,
        eventId: "shop_bigBox_ad",
        success: function () {
          $10UserDataProxy.userDataProxy.userData.boxData.bigState = 1;
          o.bigbigBox.getChildByName("timerCd").active = true;
          o.getBigBoxProp(2);
        },
        fail: function (t) {
          return console.log(t);
        },
        error: function (t) {
          return console.log(t);
        }
      }, true);
    } else {
      this.purchaseBox(this._buyType2, this._buyPrice2, 2);
    }
  };
  _ctor.prototype.purchaseBox = function (t, e, o) {
    if (1 == t && $10UserDataProxy.userDataProxy.userData.gold >= e) {
      $10UserDataProxy.userDataProxy.changeGold(-e);
    } else {
      if (!(2 == t && $10UserDataProxy.userDataProxy.userData.diamond >= e)) {
        $10GameUIManager.gameUIMgr.showTips(1 == t ? "金币不够！" : "钻石不够！");
        return void (1 != t && $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.SHOW_VIDEO_DIAMOMND_POPUP));
      }
      $10UserDataProxy.userDataProxy.changeDiamond(-e);
    }
    this.getBigBoxProp(o);
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "bigBox", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "bigbigBox", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "levelLabel", undefined);
  cc__decorate([ccp_property(cc.ProgressBar)], _ctor.prototype, "progressBar", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "progressLabel", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BigBoxShopLayer;