var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10List = require("List");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10PopupBase = require("PopupBase");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10GameUIManager = require("GameUIManager");
var $10RedDotMgr = require("RedDotMgr");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PlantEquipDetailsPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mGreadBg = null;
    e.mPlantName = null;
    e.mPlantImg = null;
    e.mLvLab = null;
    e.mAtkNum = null;
    e.mAddNum = null;
    e.mBar = null;
    e.mBarNum = null;
    e.mPriceLab = null;
    e.mMyLiset = null;
    e.mUpGradeEffect = null;
    e._plantData = null;
    e._skillIds = [];
    e._unlockLvs = [];
    e._needGlod = 0;
    e._needNum = 0;
    e._isWear = false;
    e._idx = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    var e = this;
    this._plantData = t.plantData;
    this._isWear = t.isWear;
    this._idx = t.idx;
    this.mUpGradeEffect.setCompleteListener(function () {
      e.mUpGradeEffect.node.active = false;
    });
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/public/pic_dazhiwukuang_" + this._plantData.qulity,
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
    }).then(function (t) {
      e.mPlantImg.spriteFrame = t.getSpriteFrame("pic_plant" + e._plantData.id);
    }).catch(function (t) {
      console.log("error:", t);
    });
    var o = this.node.getChildByName("BtnWear");
    var i = o.getChildByName("upBg");
    var n = o.getChildByName("lab");
    i.active = this._isWear;
    n.getComponent(cc.Label).string = this._isWear ? "上阵" : "下阵";
    o.active = t.isShowWear;
    o.active || (this.node.getChildByName("BtnUpgrade").x = 0);
    this.initData();
  };
  _ctor.prototype.initData = function () {
    this.mPlantName.string = this._plantData.name;
    var t = $10UserDataProxy.userDataProxy.getPlantData(this._plantData.id).lv;
    this.mLvLab.string = "Lv." + t;
    var e = $10UserDataProxy.userDataProxy.getPropDatas(this._plantData.needItem);
    var o = Number(this._plantData.needNum.split("|")[t - 1]);
    this.mBar.fillRange = e / o;
    this.mBarNum.string = e + "/" + o;
    var i = $10BattleDataProxy.battleDataProxy.getPlantAtk(this._plantData.id, 1);
    this.mAtkNum.string = "" + i;
    var n = this.mBar.node.parent.getChildByName("arrow");
    var a = this.node.getChildByName("maxLevel");
    var r = this.node.getChildByName("BtnUpgrade");
    n.active = e >= o;
    n.y = -29.115;
    cc.Tween.stopAllByTarget(n);
    this.mAddNum.node.active = n.active;
    a.active = false;
    r.active = true;
    a.position = r.position;
    if (n.active) {
      var s = cc.tween(n).by(.3, {
        position: cc.v3(0, 5)
      }).by(.3, {
        position: cc.v3(0, -5)
      }).delay(.15);
      cc.tween(n).repeatForever(s).start();
      var c = $10BattleDataProxy.battleDataProxy.getPlantAtk(this._plantData.id, 1, t + 1);
      if (c > 0) {
        this.mAddNum.string = "+" + (c - i);
        a.active = false;
      } else {
        this.mBar.fillRange = 1;
        n.active = false;
        this.mAddNum.node.active = false;
        a.active = true;
        this.mBarNum.string = "Max";
        r.active = false;
      }
    }
    this.setNeedNum();
  };
  _ctor.prototype.setNeedNum = function () {
    var t = $10UserDataProxy.userDataProxy.getPlantData(this._plantData.id).lv;
    this._needNum = Number(this._plantData.needNum.split("|")[t - 1]);
    this._needGlod = Number(this._plantData.needGold.split("|")[t - 1]);
    if (this._needGlod > $10UserDataProxy.userDataProxy.userData.gold) {
      this.mPriceLab.node.color = cc.Color.RED;
    } else {
      this.mPriceLab.node.color = cc.Color.WHITE;
    }
    this.mPriceLab.string = "" + this._needGlod;
  };
  _ctor.prototype.onShow = function () {
    this.updateSkillItem();
    if (6 == $10UserDataProxy.userDataProxy.userData.gameCourseData.curId) {
      var t = {
        courseId: 0,
        isGame: false
      };
      t.courseId = 7;
      t.targetNode = this.node.getChildByName("BtnUpgrade");
      $10UserDataProxy.userDataProxy.showCourse(t);
    }
  };
  _ctor.prototype.onDestroy = function () {
    t.prototype.onDestroy.call(this);
    $10EventManager.EventManager.instance.emit($10UserDataProxy.EUserDataEvent.CLOSE_EQUIP_DETAILS);
  };
  _ctor.prototype.updateSkillItem = function () {
    this._skillIds = this._plantData.skillId.split("|").map(Number);
    this._unlockLvs = this._plantData.unlockLv.split("|").map(Number);
    this.mMyLiset.numItems = this._skillIds.length;
  };
  _ctor.prototype.onUpdateItem = function (t, e) {
    var o = $10DataManager.DataManager.instance.eData.dataskill[this._skillIds[e]];
    var i = t.getChildByName("gradeImg");
    var n = t.getChildByName("gradeBg");
    var a = t.getChildByName("skillIcon");
    var r = t.getChildByName("skillDes");
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/skill/skillkuang_lv" + (o.quality - 1),
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      i.getComponent(cc.Sprite).spriteFrame = t;
    }).catch(function (t) {
      console.log("error:", t);
    });
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/public/pic_yeqian_" + o.quality,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      n.getComponent(cc.Sprite).spriteFrame = t;
    }).catch(function (t) {
      console.log("error:", t);
    });
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/skillIcon/SkillIcons",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      a.getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("" + o.icon);
    }).catch(function (t) {
      console.log("error:", t);
    });
    var s = t.getChildByName("lockMask");
    var c = this._unlockLvs[e];
    var u = $10UserDataProxy.userDataProxy.getPlantData(this._plantData.id).lv;
    c > u && (s.getChildByName("unlockTips").getComponent(cc.Label).string = "等级" + c + "解锁");
    r.getComponent(cc.Label).string = o.des;
    s.active = c > u;
  };
  _ctor.prototype.onBtnUpgrade = function () {
    if (6 == $10UserDataProxy.userDataProxy.userData.gameCourseData.curId) {
      $10UserDataProxy.userDataProxy.completeCourse(7);
      $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.LOSE_COURSE_VIEW);
    }
    if ($10UserDataProxy.userDataProxy.getProp(this._plantData.needItem) < this._needNum) {
      $10GameUIManager.gameUIMgr.showTips("碎片不够！");
    } else if (this._needGlod > $10UserDataProxy.userDataProxy.userData.gold) {
      $10GameUIManager.gameUIMgr.showTips("金币不够！");
    } else {
      $10UserDataProxy.userDataProxy.changeGold(-this._needGlod);
      $10UserDataProxy.userDataProxy.addProp(this._plantData.needItem, -1 * this._needNum);
      var t = $10UserDataProxy.userDataProxy.getPlantData(this._plantData.id).lv;
      t += 1;
      $10UserDataProxy.userDataProxy.updatePlantLv(this._plantData.id, t);
      this.initData();
      this.updateSkillItem();
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/getPlant", $10HomeEnum.Bundles.RES);
      this.mUpGradeEffect.node.active = true;
      this.mUpGradeEffect.setAnimation(0, "level up", false);
      var e = this.mAddNum.node.parent.parent.getChildByName("pic_atk");
      var o = this.mAddNum.node.parent;
      cc.Tween.stopAllByTarget(e);
      cc.Tween.stopAllByTarget(o);
      cc.tween(e).to(.15, {
        scale: 1.5
      }).to(.15, {
        scale: 1
      }).start();
      cc.tween(o).to(.15, {
        scale: 1.5
      }).to(.15, {
        scale: 1
      }).start();
      $10EventManager.EventManager.instance.emit($10UserDataProxy.EUserDataEvent.UPDATE_PLANT_LEVEL);
      $10RedDotMgr.default.instance.updateRedDotState([$10HomeEnum.HOME_REDDOT.PLANTRED]);
      $10UserDataProxy.userDataProxy.saveData();
    }
  };
  _ctor.prototype.onBtnWear = function () {
    if (this._isWear) {
      var t = -1;
      for (var e = 0; e < 4 && $10UserDataProxy.userDataProxy.getWearItemIsUnlock(e).isUnlock; ++e) {
        if (!$10UserDataProxy.userDataProxy.combatEqus[e] || 0 == $10UserDataProxy.userDataProxy.combatEqus[e]) {
          t = e;
          break;
        }
      }
      if (-1 == t) {
        return void $10GameUIManager.gameUIMgr.showTips("没有位置了");
      }
      $10UserDataProxy.userDataProxy.userData.combatEqus[t] = this._plantData.id;
      $10UserDataProxy.userDataProxy.saveData();
      if (4 == $10UserDataProxy.userDataProxy.userData.gameCourseData.curId) {
        $10UserDataProxy.userDataProxy.completeCourse(5);
        $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.LOSE_COURSE_VIEW);
      }
      $10EventManager.EventManager.instance.emit($10UserDataProxy.EUserDataEvent.UPDATE_WEAR_PLANT);
      $10EventManager.EventManager.instance.emit($10UserDataProxy.EUserDataEvent.UPDATE_UNLOCK_PLANT);
    } else {
      if ($10UserDataProxy.userDataProxy.userData.gameCourseData.curId <= 7) {
        return void console.log("教程中不能下植物");
      }
      $10UserDataProxy.userDataProxy.userData.combatEqus[this._idx] = 0;
      $10UserDataProxy.userDataProxy.saveData();
      $10EventManager.EventManager.instance.emit($10UserDataProxy.EUserDataEvent.UPDATE_UNLOCK_PLANT, this._idx);
    }
    this.removeUI();
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mGreadBg", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mPlantName", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mPlantImg", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mLvLab", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mAtkNum", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mAddNum", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mBar", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mBarNum", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mPriceLab", undefined);
  cc__decorate([ccp_property($10List.default)], _ctor.prototype, "mMyLiset", undefined);
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mUpGradeEffect", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_PlantEquipDetailsPopup;