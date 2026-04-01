var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10PlantEquipItem = require("PlantEquipItem");
var $10WearPlantItem = require("WearPlantItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_HomePlantView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mPlantEquipItemPb = null;
    e.mWearLayout = null;
    e.mUnlockItemLayout = null;
    e.mLockItemLayout = null;
    e._unlockPlantDatas = [];
    e._lockPlantDatas = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.UPDATE_UNLOCK_PLANT, this.updateUnlockPlantLayout, this);
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.UPDATE_WEAR_PLANT, this.updateWearPlant, this);
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.UPDATE_PLANT_LEVEL, this.updatePlantLevel, this);
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.CLOSE_EQUIP_DETAILS, this.closeEquipDetails, this);
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.UPDATE_UNLOCK_PLANT, this.updateUnlockPlantLayout, this);
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.UPDATE_WEAR_PLANT, this.updateWearPlant, this);
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.UPDATE_PLANT_LEVEL, this.updatePlantLevel, this);
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.CLOSE_EQUIP_DETAILS, this.closeEquipDetails, this);
  };
  _ctor.prototype.onEnable = function () {
    var t = this;
    this.updateWearPlant();
    this.updateUnlockPlantLayout();
    4 == $10UserDataProxy.userDataProxy.userData.gameCourseData.curId && this.mUnlockItemLayout.childrenCount > 0 && this.scheduleOnce(function () {
      var e = t.mUnlockItemLayout.children[0].getChildByName("BtnRemove");
      var o = {
        courseId: 0,
        isGame: false
      };
      o.courseId = 5;
      $10UserDataProxy.userDataProxy.changeGold(1e3);
      $10UserDataProxy.userDataProxy.addProp(1003, 5);
      o.targetNode = e;
      $10UserDataProxy.userDataProxy.showCourse(o);
    }, .15);
  };
  _ctor.prototype.onDisable = function () {
    $10UserDataProxy.userDataProxy.completeCourse(8);
    $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.LOSE_COURSE_VIEW);
  };
  _ctor.prototype.closeEquipDetails = function () {
    if (7 == $10UserDataProxy.userDataProxy.userData.gameCourseData.curId) {
      this.node.getChildByName("scrollView").on(cc.Node.EventType.TOUCH_START, function () {
        $10UserDataProxy.userDataProxy.completeCourse(8);
        $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.LOSE_COURSE_VIEW);
      }, this);
      var t = {
        courseId: 0,
        isGame: false
      };
      t.courseId = 8;
      t.targetNode = this.node.getChildByName("scrollView");
      $10UserDataProxy.userDataProxy.showCourse(t);
    }
  };
  _ctor.prototype.updatePlantLevel = function () {
    var t = this.mWearLayout.children;
    for (var e = 0; e < t.length; ++e) {
      t[e].getComponent($10WearPlantItem.default).updatePlantLevel();
    }
    var o = this.mUnlockItemLayout.children;
    for (e = 0; e < o.length; ++e) {
      o[e].getComponent($10PlantEquipItem.default).updatePlantLevel();
    }
  };
  _ctor.prototype.updateWearPlant = function () {
    var t = this.mWearLayout.children;
    t.forEach(function (t) {
      t.active = false;
    });
    for (var e = 0; e < t.length; ++e) {
      var o = t[e];
      o.active = true;
      var i = $10UserDataProxy.userDataProxy.getWearItemIsUnlock(e);
      o.getComponent($10WearPlantItem.default).initWearPlantItem(i.isUnlock, e, i.unlockChapter);
    }
    if (5 == $10UserDataProxy.userDataProxy.userData.gameCourseData.curId) {
      var n = {
        courseId: 0,
        isGame: false
      };
      n.courseId = 6;
      n.targetNode = this.mWearLayout.children[0];
      $10UserDataProxy.userDataProxy.showCourse(n);
    }
  };
  _ctor.prototype.updateUnlockPlantLayout = function (t) {
    var e = this;
    this.initLayoutPlantIds();
    this.mUnlockItemLayout.children.forEach(function (t) {
      t.active = false;
    });
    this.mUnlockItemLayout.parent.active = this._unlockPlantDatas.length > 0;
    for (var o = 0; o < this._unlockPlantDatas.length; ++o) {
      i = this.mUnlockItemLayout.children[o];
      if (!i) {
        (i = cc.instantiate(this.mPlantEquipItemPb)).parent = this.mUnlockItemLayout;
      }
      i.active = true;
      i.getComponent($10PlantEquipItem.default).initPlantEquipItem(this._unlockPlantDatas[o], true, this.getIsShowDetails());
    }
    this.mLockItemLayout.children.forEach(function (t) {
      t.active = false;
    });
    this.mLockItemLayout.parent.active = this._lockPlantDatas.length > 0;
    for (o = 0; o < this._lockPlantDatas.length; ++o) {
      var i;
      i = this.mLockItemLayout.children[o];
      if (!i) {
        (i = cc.instantiate(this.mPlantEquipItemPb)).parent = this.mLockItemLayout;
      }
      i.active = true;
      i.getComponent($10PlantEquipItem.default).initPlantEquipItem(this._lockPlantDatas[o], false, this.getIsShowDetails());
    }
    this.mUnlockItemLayout.children.forEach(function (t) {
      t.getComponent($10PlantEquipItem.default).setIsShowWear(e.getIsShowDetails());
    });
    if (t || 0 == t) {
      var n = this.mWearLayout.children[t];
      var a = $10UserDataProxy.userDataProxy.getWearItemIsUnlock(t);
      n.getComponent($10WearPlantItem.default).initWearPlantItem(a.isUnlock, t, a.unlockChapter);
    }
  };
  _ctor.prototype.getIsShowDetails = function () {
    var t = -1;
    for (var e = 0; e < 4 && $10UserDataProxy.userDataProxy.getWearItemIsUnlock(e).isUnlock; ++e) {
      if (!$10UserDataProxy.userDataProxy.combatEqus[e] || 0 == $10UserDataProxy.userDataProxy.combatEqus[e]) {
        t = e;
        break;
      }
    }
    return -1 != t;
  };
  _ctor.prototype.initLayoutPlantIds = function () {
    this._unlockPlantDatas = [];
    this._lockPlantDatas = [];
    var t = $10DataManager.DataManager.instance.eData.dataplant;
    var e = $10UserDataProxy.userDataProxy.userData.passChapter;
    for (var o in t) {
      var i = t[o];
      if (1 == i.use) {
        if (i.stageID < e + 1) {
          $10UserDataProxy.userDataProxy.userData.combatEqus.indexOf(i.id) < 0 && this._unlockPlantDatas.push(i);
        } else {
          this._lockPlantDatas.push(i);
        }
      }
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mPlantEquipItemPb", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mWearLayout", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mUnlockItemLayout", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mLockItemLayout", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_HomePlantView;