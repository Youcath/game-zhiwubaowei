var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10PopupBase = require("PopupBase");
var $10AdsMgr = require("AdsMgr");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10GameUIManager = require("GameUIManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_RandomSuperPlantPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSpine = null;
    e.mPlantName = null;
    e.mPlantIcon = null;
    e.mBtnRoot = null;
    e._showPlantId = 0;
    e._combatEqus = [];
    e._superFrameDatas = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    var t = this;
    this.mSpine.setCompleteListener(function (e) {
      if ("rotate" == (e.animation ? e.animation.name : "")) {
        t.mSpine.setAnimation(0, "stand", true);
        t.mBtnRoot.active = true;
      }
    });
    var e = 0;
    this.mSpine.setEventListener(function (o, i) {
      if ("change" == i.data.name) {
        e++;
        t.setSuperData(12 == e);
        if (12 == e) {
          t.mPlantIcon.node.scale = .3, cc.tween(t.mPlantIcon.node).to(.3, {
            scale: 1.1
          }).to(.1, {
            scale: 1
          }).start(), t.setNormalSpr();
        }
      }
    });
    this._combatEqus = $10UserDataProxy.userDataProxy.userData.combatEqus.slice();
    this._superFrameDatas = $10BattleDataProxy.battleDataProxy.superFrameDatas.slice();
    this.mBtnRoot.active = false;
  };
  _ctor.prototype.setNormalSpr = function () {
    var t = this;
    var e = this.node.getChildByName("normalBg");
    var o = e.getChildByName("normalIcon");
    e.active = true;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/botanyIcon/BotanyIcon",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      o.getComponent(cc.Sprite).spriteFrame = e.getSpriteFrame("pic_plant" + t._showPlantId);
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.onShow = function () {
    var t = this.mBtnRoot.getChildByName("btnAgain");
    var e = t.getChildByName("videoIcon");
    $10BattleDataProxy.battleDataProxy.setVideoCardIcon(e, 1);
    t.active = this._combatEqus.length > 1;
    this.setSuperData();
    if (this._combatEqus.length > 1) {
      this.mSpine.setAnimation(0, "rotate", false);
    } else {
      this.mSpine.setAnimation(0, "stand", true);
      this.mBtnRoot.active = true;
      this.setNormalSpr();
    }
  };
  _ctor.prototype.setSuperData = function (t) {
    var e = this.randSuperId(t);
    this.mPlantIcon.spriteFrame = e.frame;
    var o = $10DataManager.DataManager.instance.eData.dataplant[this._showPlantId];
    this.mPlantName.string = "超级" + o.name;
  };
  _ctor.prototype.randSuperId = function (t) {
    var e = Math.floor(100 * Math.random()) % this._superFrameDatas.length;
    var o = this._superFrameDatas[e];
    if (t) {
      if (o.plantId == $10BattleDataProxy.battleDataProxy.topSuperId) {
        console.log("最后一波不能随到上次选的");
        return this.randSuperId(t);
      }
    } else if (o.plantId == this._showPlantId) {
      return this.randSuperId();
    }
    this._showPlantId = o.plantId;
    return o;
  };
  _ctor.prototype.onBtnClose = function () {
    this.confirmSelect();
  };
  _ctor.prototype.confirmSelect = function () {
    $10BattleDataProxy.battleDataProxy.battleData.superPlantId = this._showPlantId;
    $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.SELECT_SUPER_PLANT);
    this.removeUI();
  };
  _ctor.prototype.onBtnAgain = function () {
    var t = this;
    if ($10UserDataProxy.userDataProxy.getProp(4) > 0) {
      $10UserDataProxy.userDataProxy.addProp(4, -1);
      $10GameUIManager.gameUIMgr.showSelectSuperPlantPopup();
      return void this.removeUI();
    }
    $10AdsMgr.default.showVideoAds({
      id: 1,
      eventId: "selfSelect_SuperPlant_ad",
      success: function () {
        $10GameUIManager.gameUIMgr.showSelectSuperPlantPopup();
        t.removeUI();
      },
      fail: function () {},
      error: function (t) {
        cc.log(t);
      }
    }, true);
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSpine", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mPlantName", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mPlantIcon", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnRoot", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_RandomSuperPlantPopup;