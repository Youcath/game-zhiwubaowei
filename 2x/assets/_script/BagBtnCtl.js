var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10PopupManager = require("PopupManager");
var $10SceneManager = require("SceneManager");
var $10AdsMgr = require("AdsMgr");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10MBGameDataProxy = require("MBGameDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10GameUIManager = require("GameUIManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_BagBtnCtl = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onEnable = function () {
    this.updateView();
    $10EventManager.EventManager.instance.on($10HomeEnum.EHomeEvent.CHAPTER_SELECT, this.updateUnlock, this);
    $10EventManager.EventManager.instance.on($10HomeEnum.EHomeEvent.UPDATE_MINI_BTN_VIEW, this.updateView, this);
  };
  _ctor.prototype.onDisable = function () {
    $10EventManager.EventManager.instance.off($10HomeEnum.EHomeEvent.CHAPTER_SELECT, this.updateUnlock, this);
    $10EventManager.EventManager.instance.off($10HomeEnum.EHomeEvent.UPDATE_MINI_BTN_VIEW, this.updateView, this);
  };
  _ctor.prototype.updateView = function () {
    if ($10DataManager.DataManager.instance.isSubGameOpen($10HomeEnum.ESubGameSwitch.BAG)) {
      this.node.active = true;
      this.updateUnlock();
    } else {
      this.node.active = false;
    }
  };
  _ctor.prototype.updateUnlock = function () {
    var t = Number($10DataManager.DataManager.instance.eData.datapara[1801].num);
    this.node.getChildByName("cdTime").active = false;
    if ($10UserDataProxy.userDataProxy.userData.passChapter >= t) {
      this.updateTime();
      $10Util.default.setSpriteNormalMaterial(this.node.getChildByName("icon_wujing").getComponent(cc.Sprite));
    } else {
      $10Util.default.setSpriteGrayMaterial(this.node.getChildByName("icon_wujing").getComponent(cc.Sprite));
    }
    this.node.getChildByName("txt").getComponent(cc.Label).string = "背包大战";
    this.node.getChildByName("tipLabel").active = $10UserDataProxy.userDataProxy.userData.passChapter < t;
    this.node.getChildByName("tipLabel").getComponent(cc.Label).string = "通过第" + t + "章解锁";
  };
  _ctor.prototype.updateTime = function () {
    var t = this;
    var e = this.node.getChildByName("cdTime");
    e.active = false;
    var o = $10MBGameDataProxy.mbGameDataProxy.btnStartTime;
    if (o > 0) {
      var i = 6e4 * Number($10DataManager.DataManager.instance.eData.datapara[1802].num);
      var n = e.getComponent(cc.Label);
      var a = $10Util.default.getTimeLeftTime(o, i);
      n.string = $10Util.default.formatTimeMS(a, 3);
      this.schedule(function () {
        if ((a = $10Util.default.getTimeLeftTime(o, i)) <= 0) {
          t.unscheduleAllCallbacks();
          $10MBGameDataProxy.mbGameDataProxy.btnStartTime = 0;
          t.node.getChildByName("ad").active = false;
          e.active = false;
        }
        n.string = $10Util.default.formatTimeMS(a, 3);
      }, 1);
      e.active = true;
    } else {
      e.active = false;
    }
    this.node.getChildByName("ad").active = o > 0;
  };
  _ctor.prototype.onEnterMiniGame = function () {
    var t = this;
    var e = Number($10DataManager.DataManager.instance.eData.datapara[1801].num);
    if ($10UserDataProxy.userDataProxy.userData.passChapter >= e) {
      if ($10MBGameDataProxy.mbGameDataProxy.btnStartTime > 0) {
        $10AdsMgr.default.showVideoAds({
          id: 1,
          eventId: "mb_game_enter",
          success: function () {
            t.enterGame();
          },
          fail: function () {},
          error: function (t) {
            cc.log(t);
          }
        }, true);
      } else {
        this.enterGame();
      }
    } else {
      $10GameUIManager.gameUIMgr.showTips("第" + e + "章解锁!");
    }
  };
  _ctor.prototype.enterGame = function () {
    $10PopupManager.PopupManager.instance.removeAll();
    $10SceneManager.SceneManager.instance.runScene("mb", "res_MB");
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BagBtnCtl;