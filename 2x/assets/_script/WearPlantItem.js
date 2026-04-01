var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10GameUIManager = require("GameUIManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_WearPlantItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mPlantInfo = null;
    e.mLock = null;
    e.mNotTips = null;
    e.mGreadBg = null;
    e.mPlantImg = null;
    e.mPlantName = null;
    e.mLvLab = null;
    e.mBtnDetails = null;
    e.mBtnRemove = null;
    e.mBar = null;
    e.mBarNum = null;
    e._isUnlock = false;
    e._plantData = null;
    e._unlockChapter = 0;
    e._idx = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initWearPlantItem = function (t, e, o) {
    this._isUnlock = t;
    this._idx = e;
    this._unlockChapter = o;
    this.mLock.active = !t;
    this.mBtnDetails.active = false;
    this.mBtnDetails.x = -65;
    this.mBtnRemove.active = true;
    this.mBtnRemove.x = 65;
    this.mBtnDetails.zIndex = 1;
    this.mBtnRemove.zIndex = 1;
    this.node.getComponent(cc.Button).interactable = t;
    if (this._isUnlock) {
      var i = $10UserDataProxy.userDataProxy.combatEqus[e];
      if (i && 0 != i) {
        this.mNotTips.active = false;
        this.mPlantInfo.active = true;
        this.setPlantInfo(i);
      } else {
        this.mNotTips.active = true;
        this.mPlantInfo.active = false;
        this.node.getComponent(cc.Button).interactable = false;
      }
    } else {
      this.mNotTips.active = false;
      this.mPlantInfo.active = false;
      this.mLock.getChildByName("unlockTips").getComponent(cc.Label).string = "通过第" + o + "章后解锁";
    }
  };
  _ctor.prototype.setPlantInfo = function (t) {
    var e = this;
    this._plantData = $10DataManager.DataManager.instance.eData.dataplant[t];
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/public/pic_zhiwukuang_" + this._plantData.qulity,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      e.mGreadBg.spriteFrame = t;
    }).catch(function (t) {
      console.log("error:", t);
    });
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/botanyIcon/BotanyIcon",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (o) {
      e.mPlantImg.spriteFrame = o.getSpriteFrame("pic_plant" + t);
    }).catch(function (t) {
      console.log("error:", t);
    });
    this.updatePlantLevel();
    this.mPlantName.node.color = cc.color($10UserDataProxy.userDataProxy.mPlantColors[this._plantData.qulity - 2]);
    this.mLvLab.node.color = cc.color($10UserDataProxy.userDataProxy.mPlantColors[this._plantData.qulity - 2]);
  };
  _ctor.prototype.onItemClick = function () {
    this.mBtnRemove.active = true;
    if (5 == $10UserDataProxy.userDataProxy.userData.gameCourseData.curId) {
      $10UserDataProxy.userDataProxy.completeCourse(6);
      $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.LOSE_COURSE_VIEW);
    }
    $10GameUIManager.gameUIMgr.showPlantEquipDetailsPopup(this._plantData, false, this._idx);
  };
  _ctor.prototype.hideBtn = function () {};
  _ctor.prototype.onBtnDetails = function () {
    $10GameUIManager.gameUIMgr.showPlantEquipDetailsPopup(this._plantData, false, this._idx);
  };
  _ctor.prototype.onBtnRemove = function () {
    if ($10UserDataProxy.userDataProxy.userData.gameCourseData.curId <= 7) {
      console.log("教程中不能下植物");
    } else {
      $10UserDataProxy.userDataProxy.userData.combatEqus[this._idx] = 0;
      $10UserDataProxy.userDataProxy.saveData();
      this.initWearPlantItem(this._isUnlock, this._idx, this._unlockChapter);
      $10EventManager.EventManager.instance.emit($10UserDataProxy.EUserDataEvent.UPDATE_UNLOCK_PLANT);
    }
  };
  _ctor.prototype.updatePlantLevel = function () {
    if (this._plantData) {
      this.mPlantName.string = this._plantData.name;
      var t = $10UserDataProxy.userDataProxy.getPlantData(this._plantData.id).lv;
      this.mLvLab.string = "Lv." + t;
      var e = $10UserDataProxy.userDataProxy.getPropDatas(this._plantData.needItem);
      var o = Number(this._plantData.needNum.split("|")[t - 1]);
      this.mBar.fillRange = e / o;
      this.mBarNum.string = e + "/" + o;
      var i = this.mBar.node.parent.getChildByName("arrow");
      i.active = e >= o;
      i.y = -78;
      cc.Tween.stopAllByTarget(i);
      if (i.active) {
        var n = cc.tween(i).by(.3, {
          position: cc.v3(0, 5)
        }).by(.3, {
          position: cc.v3(0, -5)
        }).delay(.15);
        cc.tween(i).repeatForever(n).start();
      }
      this.checkMax();
    }
  };
  _ctor.prototype.checkMax = function () {
    var t = $10UserDataProxy.userDataProxy.getPlantData(this._plantData.id).lv;
    if ($10BattleDataProxy.battleDataProxy.getPlantAtk(this._plantData.id, 1, t + 1) <= 0) {
      this.mBar.fillRange = 1;
      this.mBarNum.string = "Max";
      this.mBar.node.parent.getChildByName("arrow").active = false;
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mPlantInfo", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mLock", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mNotTips", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mGreadBg", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mPlantImg", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mPlantName", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mLvLab", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnDetails", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnRemove", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mBar", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mBarNum", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_WearPlantItem;