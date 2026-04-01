var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10GameUIManager = require("GameUIManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PlantEquipItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mGreadBg = null;
    e.mPlantImg = null;
    e.mPlantName = null;
    e.mLvLab = null;
    e.mBtnDetails = null;
    e.mBtnRemove = null;
    e.mBar = null;
    e.mBarNum = null;
    e.mLockTips = null;
    e.mLock = null;
    e._isUnlock = false;
    e._plantData = null;
    e._isShowWear = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initPlantEquipItem = function (t, e, o) {
    var i = this;
    this._plantData = t;
    this._isUnlock = e;
    this.node.getComponent(cc.Button).interactable = e;
    this.mBtnRemove.active = !!e && o;
    this._isShowWear = o;
    this.mBtnDetails.active = false;
    this.mBtnDetails.zIndex = 1;
    this.mBtnRemove.zIndex = 1;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/public/pic_zhiwukuang_" + this._plantData.qulity,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      i.mGreadBg.spriteFrame = t;
    }).catch(function (t) {
      console.log("error:", t);
    });
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/botanyIcon/BotanyIcon",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      i.mPlantImg.spriteFrame = t.getSpriteFrame("pic_plant" + i._plantData.id);
    }).catch(function (t) {
      console.log("error:", t);
    });
    this.updatePlantLevel();
    this.mLockTips.active = !e;
    this.mLock.active = !e;
    if (e) {
      $10Util.default.setSpriteNormalMaterial(this.mGreadBg);
      $10Util.default.setSpriteNormalMaterial(this.mPlantImg);
      this.mLvLab.node.active = true;
      this.mBar.node.parent.active = true;
      this.mPlantName.node.color = cc.color($10UserDataProxy.userDataProxy.mPlantColors[this._plantData.qulity - 2]);
      this.mLvLab.node.color = cc.color($10UserDataProxy.userDataProxy.mPlantColors[this._plantData.qulity - 2]);
    } else {
      $10Util.default.setSpriteGrayMaterial(this.mGreadBg);
      $10Util.default.setSpriteGrayMaterial(this.mPlantImg);
      this.mPlantName.node.color = cc.color(75, 75, 75);
      this.mLvLab.node.active = false;
      this.mBar.node.parent.active = false;
      this.mLock.getChildByName("unlockTips").getComponent(cc.Label).string = "通过第" + this._plantData.stageID + "章后解锁";
    }
  };
  _ctor.prototype.setIsShowWear = function (t) {
    if (this._isUnlock) {
      this.mBtnRemove.active = t;
    } else {
      this.mBtnRemove.active = false;
    }
  };
  _ctor.prototype.onItemClick = function () {
    $10GameUIManager.gameUIMgr.showPlantEquipDetailsPopup(this._plantData, true, 0, this._isShowWear);
  };
  _ctor.prototype.onBtnDetails = function () {
    $10GameUIManager.gameUIMgr.showPlantEquipDetailsPopup(this._plantData, true, 0, this._isShowWear);
  };
  _ctor.prototype.onBtnRemove = function () {
    var t = -1;
    for (var e = 0; e < 4 && $10UserDataProxy.userDataProxy.getWearItemIsUnlock(e).isUnlock; ++e) {
      if (!$10UserDataProxy.userDataProxy.combatEqus[e] || 0 == $10UserDataProxy.userDataProxy.combatEqus[e]) {
        t = e;
        break;
      }
    }
    if (-1 != t) {
      $10UserDataProxy.userDataProxy.userData.combatEqus[t] = this._plantData.id;
      $10UserDataProxy.userDataProxy.saveData();
      if (4 == $10UserDataProxy.userDataProxy.userData.gameCourseData.curId) {
        $10UserDataProxy.userDataProxy.completeCourse(5), $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.LOSE_COURSE_VIEW);
      }
      $10EventManager.EventManager.instance.emit($10UserDataProxy.EUserDataEvent.UPDATE_WEAR_PLANT);
      $10EventManager.EventManager.instance.emit($10UserDataProxy.EUserDataEvent.UPDATE_UNLOCK_PLANT);
    } else {
      $10GameUIManager.gameUIMgr.showTips("没有位置了");
    }
  };
  _ctor.prototype.updatePlantLevel = function () {
    this.mPlantName.string = this._plantData.name;
    var t = $10UserDataProxy.userDataProxy.getPlantData(this._plantData.id).lv;
    this.mLvLab.string = "Lv." + t;
    var e = $10UserDataProxy.userDataProxy.getPropDatas(this._plantData.needItem);
    var o = Number(this._plantData.needNum.split("|")[t - 1]);
    this.mBar.fillRange = e / o;
    this.mBarNum.string = e + "/" + o;
    var i = this.mBar.node.parent.getChildByName("arrow");
    i.active = e >= o;
    i.y = 6.529;
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
  };
  _ctor.prototype.checkMax = function () {
    var t = $10UserDataProxy.userDataProxy.getPlantData(this._plantData.id).lv;
    if ($10BattleDataProxy.battleDataProxy.getPlantAtk(this._plantData.id, 1, t + 1) <= 0) {
      this.mBar.fillRange = 1;
      this.mBarNum.string = "Max";
      this.mBar.node.parent.getChildByName("arrow").active = false;
    }
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mGreadBg", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mPlantImg", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mPlantName", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mLvLab", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnDetails", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnRemove", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mBar", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mBarNum", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mLockTips", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mLock", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PlantEquipItem;