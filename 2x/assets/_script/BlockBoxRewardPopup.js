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
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10AnimationMgr = require("AnimationMgr");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BlockBoxRewardPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mVideoIcon = null;
    e.mRewardIcon = null;
    e.mRewardName = null;
    e.mTips2 = null;
    e.mTips1 = null;
    e.mSpine = null;
    e._oldGameState = $10GameEnum.GameState.PLAYING;
    e._closeFunc = null;
    e._type = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    var e = this;
    this._oldGameState = $10BattleDataProxy.battleDataProxy.gameState;
    $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.PAUSE;
    this._closeFunc = t.callBack;
    this.mSpine.setCompleteListener(function (t) {
      "pop up" == (t.animation ? t.animation.name : "") && e.mSpine.setAnimation(0, "stand", true);
    });
    var o = t.type;
    this._type = o;
    var i = "textures/public/pic_icon_yangguang";
    2 == o && (i = "textures/public/pic_icon_tanqiu");
    $10ResUtil.ResUtil.loadAsset({
      path: i,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      e.mRewardIcon.spriteFrame = t;
    }).catch(function (t) {
      console.log("error:", t);
    });
    this.mRewardIcon.node.scale = .3;
    this.mSpine.setAnimation(0, "pop up", false);
    cc.tween(this.mRewardIcon.node).to(.3, {
      scale: 1.1
    }).to(.1, {
      scale: 1
    }).start();
    this.mRewardName.string = 2 == o ? "阳光弹球" : "大量阳光";
    this.mTips1.node.active = 1 != $10UserDataProxy.userDataProxy.userData.curChapter;
    this.mTips2.node.y = 1 == $10UserDataProxy.userDataProxy.userData.curChapter ? 0 : -16.766;
    this.mVideoIcon.active = 1 != $10UserDataProxy.userDataProxy.userData.curChapter;
    $10BattleDataProxy.battleDataProxy.setVideoCardIcon(this.mVideoIcon, 4);
    2 == o && (this.mTips2.string = "<outline color=#000000 width=3><color=#FFB748>增加</color><color=#FF4427>1</color><color=#FFB748>个阳光弹球</color></outline>");
  };
  _ctor.prototype.onShow = function () {};
  _ctor.prototype.removeUI = function (e, o) {
    t.prototype.removeUI.call(this, e, o);
    $10BattleDataProxy.battleDataProxy.gameState = this._oldGameState;
    this._closeFunc && this._closeFunc();
  };
  _ctor.prototype.onBtnVideo = function () {
    var t = this;
    if (1 != $10UserDataProxy.userDataProxy.userData.curChapter) {
      if ($10UserDataProxy.userDataProxy.getProp(4) > 0) {
        $10UserDataProxy.userDataProxy.addProp(4, -1);
        this.getReward();
      } else {
        $10AdsMgr.default.showVideoAds({
          id: 1,
          eventId: "bockBoxReward_" + this._type + "_ad",
          success: function () {
            t.getReward();
          },
          fail: function () {},
          error: function (t) {
            cc.log(t);
          }
        }, true);
      }
    } else {
      this.getReward();
    }
  };
  _ctor.prototype.getReward = function () {
    if (2 == this._type) {
      var t = $10BattleDataProxy.battleDataProxy.battleData.ballNum;
      t++;
      $10BattleDataProxy.battleDataProxy.battleData.ballNum = t;
      $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.GM_ADD_BALL);
      $10BattleDataProxy.battleDataProxy.saveData();
    } else {
      var e = $10BattleDataProxy.battleDataProxy.sunshineRoot;
      var o = $10BattleDataProxy.battleDataProxy.battleView.convertToNodeSpaceAR(e.parent.convertToWorldSpaceAR(e.position));
      var i = $10BattleDataProxy.battleDataProxy.gameCamera;
      $10AnimationMgr.default.instance.showAwardAni({
        id: 8,
        num: 60
      }, $10BattleDataProxy.battleDataProxy.battleView, this.mRewardIcon.node, 0, o.addSelf(i.position));
      var n = $10BattleDataProxy.battleDataProxy.sunshineNum;
      n += 60;
      $10BattleDataProxy.battleDataProxy.sunshineNum = n;
    }
    this.removeUI();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mVideoIcon", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mRewardIcon", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mRewardName", undefined);
  cc__decorate([ccp_property(cc.RichText)], _ctor.prototype, "mTips2", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mTips1", undefined);
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_BlockBoxRewardPopup;