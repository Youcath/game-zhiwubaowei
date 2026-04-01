var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10TimeUtil = require("TimeUtil");
var $10AdsMgr = require("AdsMgr");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10GameUIManager = require("GameUIManager");
var $10RedDotMgr = require("RedDotMgr");
var $10HybridPitItem = require("HybridPitItem");
var $10HybridPlantItem = require("HybridPlantItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_HomeHybridView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBtnBag = null;
    e.mBtnHybrid = null;
    e.mHybridView = null;
    e.mPits = null;
    e.mSelectView = null;
    e.mWateringView = null;
    e.mHybridTime = null;
    e.mSelectContent = null;
    e.mPriceNumLab = null;
    e.mDots = null;
    e.mBtnRight = null;
    e.mBtnLeft = null;
    e.mTouchNode = null;
    e.mTouchPlant = null;
    e.mSaplingSp = null;
    e.mWateringSp = null;
    e.mBtnWatering = null;
    e.mHybridResult = null;
    e.mBagRedDot = null;
    e.mRotateBg = null;
    e.mHybridTitle = null;
    e._selectPlantIds = [0, 0];
    e._pageIdx = 0;
    e._selectPlantItem = null;
    e._isCanTouch = true;
    e._needTime = 0;
    e._saplingStage = 0;
    e._isCanClickWatering = true;
    e._resultPlantData = null;
    e._isVideoResult = false;
    e._hybridBagView = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    var t = this;
    $10UserDataProxy.userDataProxy.userData.hybridPlantDatas || ($10UserDataProxy.userDataProxy.userData.hybridPlantDatas = []);
    this.mTouchNode.on(cc.Node.EventType.TOUCH_START, this.touchBegin, this);
    this.mTouchNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this);
    this.mTouchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnded, this);
    this.mTouchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnded, this);
    $10EventManager.EventManager.instance.on($10HomeEnum.EHomeEvent.UPDATE_HOME_REDDOT, this.updateRedDotState, this);
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.MANURE_UPDATE, this.updateManure, this);
    this.mTouchNode._touchListener.setSwallowTouches(false);
    this.mSaplingSp.setCompleteListener(function (e) {
      var o = e.animation ? e.animation.name : "";
      if ("phase1" == o) {
        t.mSaplingSp.setAnimation(0, "phase1stand", true);
      } else if ("phase2" == o) {
        t.mSaplingSp.setAnimation(0, "phase2stand", true);
      } else if ("phase3" == o) {
        t.mSaplingSp.setAnimation(0, "phase3stand", true), t._isVideoResult && (t._isVideoResult = false, t.hybridResult());
      }
    });
    this.mWateringSp.setCompleteListener(function () {
      t.mWateringSp.node.active = false;
    });
    this.mWateringSp.node.active = false;
  };
  _ctor.prototype.onDestroy = function () {
    this.mTouchNode.off(cc.Node.EventType.TOUCH_START, this.touchBegin, this);
    this.mTouchNode.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this);
    this.mTouchNode.off(cc.Node.EventType.TOUCH_END, this.touchEnded, this);
    this.mTouchNode.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnded, this);
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.MANURE_UPDATE, this.updateManure, this);
    $10EventManager.EventManager.instance.off($10HomeEnum.EHomeEvent.UPDATE_HOME_REDDOT, this.updateRedDotState, this);
  };
  _ctor.prototype.updateRedDotState = function () {
    this.mBagRedDot.active = $10RedDotMgr.default.instance.getHybridPlantRedIsShow();
  };
  _ctor.prototype.onDisable = function () {
    $10UserDataProxy.userDataProxy.saveData();
  };
  _ctor.prototype.updateManure = function () {
    var t = $10DataManager.DataManager.instance.eData.datapara[79].num.split("_");
    if (Number(t[1]) > $10UserDataProxy.userDataProxy.userData.manure) {
      this.mPriceNumLab.node.color = cc.color(255, 75, 25);
    } else {
      this.mPriceNumLab.node.color = cc.color(255, 255, 255);
    }
  };
  _ctor.prototype.onRotateBg = function () {
    cc.Tween.stopAllByTarget(this.mRotateBg);
    var t = cc.tween(this.mRotateBg).by(.3, {
      angle: -15
    }).start();
    cc.tween(this.mRotateBg).repeatForever(t).start();
  };
  _ctor.prototype.onEnable = function () {
    this.initCanHybridPlantDatas();
    this.initPageBtn();
    this.unschedule(this.scheduleTimer);
    this.setCombineNeedTime();
    $10UserDataProxy.userDataProxy.userData.hybridData.plant1 && $10UserDataProxy.userDataProxy.userData.hybridData.plant2 || ($10UserDataProxy.userDataProxy.userData.hybridData = {
      plant1: 0,
      plant2: 0,
      time: 0
    });
    if ($10UserDataProxy.userDataProxy.userData.hybridData.time > 0) {
      this.mSelectView.active = false;
      this.mWateringView.active = true;
      this._selectPlantIds[0] = $10UserDataProxy.userDataProxy.userData.hybridData.plant1;
      this._selectPlantIds[1] = $10UserDataProxy.userDataProxy.userData.hybridData.plant2;
      this.mWateringView.getChildByName("BtnVideo").active = true;
      this.mWateringView.getChildByName("BtnWatering").active = true;
      this.schedule(this.scheduleTimer, 1);
      this.scheduleTimer();
    } else {
      this.mSelectView.active = true;
      this.mWateringView.active = false;
    }
    var t = $10DataManager.DataManager.instance.eData.datapara[79].num.split("_");
    this.mPriceNumLab.string = t[1];
    if (Number(t[1]) > $10UserDataProxy.userDataProxy.userData.manure) {
      this.mPriceNumLab.node.color = cc.color(255, 75, 25);
    } else {
      this.mPriceNumLab.node.color = cc.color(255, 255, 255);
    }
    this.mBagRedDot.active = $10RedDotMgr.default.instance.getHybridPlantRedIsShow();
    this.initPits();
    this.onRotateBg();
  };
  _ctor.prototype.touchBegin = function (t) {
    var e = this;
    if (this._isCanTouch && this.mSelectView.active) {
      var o = t.getLocation();
      var i = this.findSelectEquipment(o);
      if (i) {
        this._selectPlantItem = i;
        var n = i.getComponent($10HybridPlantItem.default).plantData;
        var a = t.getLocation();
        var r = this.mTouchNode.convertToNodeSpaceAR(a.clone());
        this.mTouchPlant.position = cc.v3(r);
        $10ResUtil.ResUtil.loadAsset({
          path: "textures/botanyIcon/BotanyIcon",
          type: cc.SpriteAtlas,
          bundleName: $10HomeEnum.Bundles.GAME
        }).then(function (t) {
          e.mTouchPlant.active = true;
          e.mTouchPlant.getChildByName("plantImg").getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("pic_plant" + n.id);
        }).catch(function (t) {
          console.log("error:", t);
        });
      }
    } else {
      var c = this.mWateringView.getChildByName("BtnWatering");
      this.mWateringView.active && c.active && this.onBtnWatering();
    }
  };
  _ctor.prototype.touchMoved = function (t) {
    if (this._selectPlantItem && this._isCanTouch && this.mSelectView.active) {
      var e = t.getLocation();
      var o = this.mTouchNode.convertToNodeSpaceAR(e.clone());
      this.mTouchPlant.position = cc.v3(o);
    }
  };
  _ctor.prototype.touchEnded = function (t) {
    var e = this;
    if (this._selectPlantItem && this._isCanTouch && this.mSelectView.active) {
      var o = t.getLocation();
      var i = this.findSelectPit(o);
      if (i) {
        var n = i.getComponent($10HybridPitItem.default).plantId;
        if (n && 0 != n) {
          var a = this.getHybridPlantItemById(n);
          a && a.getComponent($10HybridPlantItem.default).setSelectIsShow(false);
        }
        var r = Number(i.name.split("pit")[1]);
        var s = this._selectPlantItem.getComponent($10HybridPlantItem.default).plantData;
        this._selectPlantIds[r - 1] = s.id;
        this.mTouchPlant.active = false;
        i.getComponent($10HybridPitItem.default).initHybridPitItem(r, s.id);
        this._selectPlantItem.getComponent($10HybridPlantItem.default).setSelectIsShow(true);
      } else {
        this._isCanTouch = false;
        cc.Tween.stopAllByTarget(this.mTouchPlant);
        var c = $10Util.default.convertToTargetNodeSpace(this._selectPlantItem, this.mTouchNode);
        cc.tween(this.mTouchPlant).to(.3, {
          position: c
        }).call(function () {
          e.mTouchPlant.active = false;
          e._isCanTouch = true;
        }).start();
      }
      this._selectPlantItem = null;
    }
  };
  _ctor.prototype.findSelectPit = function (t) {
    var e = this.mPits.children;
    for (var o = 0; o < e.length; ++o) {
      var i = e[o];
      if (i.getBoundingBoxToWorld().contains(t)) {
        return i;
      }
    }
    return null;
  };
  _ctor.prototype.findSelectEquipment = function (t) {
    var e = this.mSelectContent.children[this._pageIdx].children;
    for (var o = 0; o < e.length; ++o) {
      var i = e[o];
      if (i.getBoundingBoxToWorld().contains(t)) {
        if (!i.getComponent($10HybridPlantItem.default).isUnlock) {
          var n = Number($10DataManager.DataManager.instance.eData.datapara[73].num);
          $10GameUIManager.gameUIMgr.showTips("植物升到" + n + "级解锁杂交");
          return null;
        }
        if (i.getComponent($10HybridPlantItem.default).getIsCanSelect()) {
          return i;
        } else {
          return $10GameUIManager.gameUIMgr.showTips("该植物已被选择"), null;
        }
      }
    }
    return null;
  };
  _ctor.prototype.initPageBtn = function () {
    var t = this;
    this._isCanTouch = false;
    this.mBtnRight.active = this._pageIdx < 2;
    this.mBtnLeft.active = this._pageIdx > 0;
    for (var e = 0; e < this.mDots.childrenCount; ++e) {
      this.mDots.children[e].getChildByName("on").active = e == this._pageIdx;
    }
    var o = cc.v3(-280 - this._pageIdx * this.mSelectContent.children[0].width, this.mSelectContent.y);
    cc.Tween.stopAllByTarget(this.mSelectContent);
    cc.tween(this.mSelectContent).to(.3, {
      position: o
    }).call(function () {
      t._isCanTouch = true;
    }).start();
  };
  _ctor.prototype.initPits = function () {
    for (var t = 0; t < this.mPits.childrenCount; ++t) {
      var e = this.mPits.children[t];
      e.getComponent($10HybridPitItem.default).initHybridPitItem(t + 1, this._selectPlantIds[t]);
      e.getComponent($10HybridPitItem.default).homeHybridView = this;
    }
  };
  _ctor.prototype.initCanHybridPlantDatas = function () {
    this.mHybridResult.active = false;
    var t = $10UserDataProxy.userDataProxy.userData.passChapter;
    var e = Number($10DataManager.DataManager.instance.eData.datapara[73].num);
    var o = $10DataManager.DataManager.instance.eData.dataplant;
    var i = 0;
    for (var n in o) {
      var a = o[n];
      if (2 == a.type1) {
        var r = $10UserDataProxy.userDataProxy.getPlantData(a.id).lv;
        var s = a.stageID < t + 1 && r >= e;
        this.getSelectItem(i).getComponent($10HybridPlantItem.default).setHybridPlantData(a, s, this._selectPlantIds);
        i++;
      }
    }
  };
  _ctor.prototype.getSelectItem = function (t) {
    var e = 0;
    if (t >= 4 && t < 8) {
      e = 1;
    } else {
      t >= 8 && (e = 2);
    }
    return this.mSelectContent.children[e].children[Math.floor(t % 4)];
  };
  _ctor.prototype.onBtnHybrid = function () {
    if (this._isCanTouch) {
      this._hybridBagView && (this._hybridBagView.active = false);
      this.mBtnBag.getChildByName("btn_right_green").active = false;
      this.mBtnHybrid.getChildByName("btn_left_green").active = true;
      this.mHybridView.active = true;
    }
  };
  _ctor.prototype.onBtnBag = function () {
    var t = this;
    if (this._isCanTouch) {
      this.mBtnBag.getChildByName("btn_right_green").active = true;
      this.mBtnHybrid.getChildByName("btn_left_green").active = false;
      this.mBagRedDot.active = false;
      this.mHybridView.active = false;
      if (this._hybridBagView) {
        this._hybridBagView.active = true;
      } else {
        this._isCanTouch = false, $10ResUtil.ResUtil.loadAsset({
          path: "uis/homeView/HybridBagView",
          type: cc.Prefab,
          bundleName: $10HomeEnum.Bundles.GAME
        }).then(function (e) {
          t._isCanTouch = true;
          t._hybridBagView = cc.instantiate(e);
          t.node.addChild(t._hybridBagView);
        }).catch(function (t) {
          console.log("error:", t);
        });
      }
    }
  };
  _ctor.prototype.onBtnVideo = function () {
    var t = this;
    this._isCanTouch && $10AdsMgr.default.showVideoAds({
      id: 1,
      eventId: "hybrid_quickGet_ad",
      success: function () {
        t._isCanTouch = false;
        if (3 != t._saplingStage) {
          $10UserDataProxy.userDataProxy.userData.hybridData.time -= 1e7;
          t.unschedule(t.scheduleTimer);
          t.mSaplingSp.setAnimation(0, "phase3", false);
          t._saplingStage = 3;
          t._isVideoResult = true;
          t.mWateringView.getChildByName("BtnVideo").active = false;
          t.mWateringView.getChildByName("BtnWatering").active = false;
        } else {
          t.hybridResult();
        }
      },
      fail: function () {},
      error: function () {}
    }, true);
  };
  _ctor.prototype.onBtnWatering = function () {
    var t = this;
    if (this._isCanClickWatering && this._isCanTouch) {
      this._isCanClickWatering = false;
      this.scheduleOnce(function () {
        t._isCanClickWatering = true;
      }, .3);
      if (!this.mWateringSp.node.active) {
        this.mWateringSp.node.active = true, this.mWateringSp.setAnimation(0, "watering", false);
      }
      cc.Tween.stopAllByTarget(this.mRotateBg);
      cc.tween(this.mRotateBg).by(.3, {
        angle: -90
      }).call(function () {
        t.onRotateBg();
      }).start();
      $10UserDataProxy.userDataProxy.userData.hybridData.time -= 1e3;
      this.scheduleTimer();
    }
  };
  _ctor.prototype.onBtnStart = function () {
    if (this._isCanTouch) {
      for (var t = 0; t < this._selectPlantIds.length; ++t) {
        if (this._selectPlantIds[t] <= 0) {
          return void $10GameUIManager.gameUIMgr.showTips("请选择要杂交的植物");
        }
      }
      var e = $10DataManager.DataManager.instance.eData.datapara[79].num.split("_");
      if (Number(e[1]) > $10UserDataProxy.userDataProxy.userData.manure) {
        var o = Number($10DataManager.DataManager.instance.eData.datapara[81].num);
        $10GameUIManager.gameUIMgr.showTips("肥料不足");
        return void ($10UserDataProxy.userDataProxy.userData.videoManureNum < o && $10GameUIManager.gameUIMgr.showVideoManurePopup(function () {
          $10AdsMgr.default.showVideoAds({
            id: 1,
            eventId: "add_manure_ad",
            success: function () {
              var t = Number($10DataManager.DataManager.instance.eData.datapara[82].num);
              var e = [];
              e.push({
                id: 9,
                num: t
              });
              $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
                list: e,
                type: 1
              });
              var o = $10UserDataProxy.userDataProxy.userData.videoManureNum;
              o++;
              $10UserDataProxy.userDataProxy.userData.videoManureNum = o;
              $10UserDataProxy.userDataProxy.saveData();
            },
            fail: function () {},
            error: function (t) {
              cc.log(t);
            }
          }, true);
        }));
      }
      $10UserDataProxy.userDataProxy.changeManure(-Number(e[1]));
      this.mSelectView.active = false;
      this.mWateringView.active = true;
      this.mWateringView.getChildByName("BtnVideo").active = true;
      this.mWateringView.getChildByName("BtnWatering").active = true;
      var i = this.mPits.children;
      for (t = 0; t < i.length; ++t) {
        i[t].getComponent($10HybridPitItem.default).hideRemoveBtn();
      }
      $10UserDataProxy.userDataProxy.userData.hybridData.plant1 = this._selectPlantIds[0];
      $10UserDataProxy.userDataProxy.userData.hybridData.plant2 = this._selectPlantIds[1];
      $10UserDataProxy.userDataProxy.userData.hybridData.time = new Date().getTime() + this._needTime;
      $10UserDataProxy.userDataProxy.saveData();
      this.scheduleTimer();
      this.unschedule(this.scheduleTimer);
      this.schedule(this.scheduleTimer, 1);
      $10RedDotMgr.default.instance.updateRedDotState([$10HomeEnum.HOME_REDDOT.HYBRIDRED]);
    }
  };
  _ctor.prototype.setCombineNeedTime = function () {
    var t = this.getHybridCombineData(this._selectPlantIds[0], this._selectPlantIds[1]);
    this._needTime = t ? 1e3 * t.time : 1e3 * Number($10DataManager.DataManager.instance.eData.datapara[80].num);
  };
  _ctor.prototype.getHybridCombineData = function (t, e) {
    var o = $10DataManager.DataManager.instance.eData.data_hybridizationcombine;
    for (var i in o) {
      var n = o[i];
      if (n.plantA == t) {
        if (n.plantB == e) {
          return n;
        }
      } else if (n.plantB == t && n.plantA == e) {
        return n;
      }
    }
    return null;
  };
  _ctor.prototype.scheduleTimer = function () {
    var t = $10UserDataProxy.userDataProxy.userData.hybridData.time - $10TimeUtil.TimeUtil.getDate().getTime();
    if (t <= 0) {
      this.hybridResult();
    } else {
      this.mHybridTime.string = $10TimeUtil.TimeUtil.format_MMSS(t);
      var e = this.getSaplingStage();
      if (e != this._saplingStage) {
        this.mSaplingSp.setAnimation(0, "phase" + e, false);
        this._saplingStage = e;
      }
      this.mHybridTitle.string = "杂交成长中";
      this.mHybridTitle.node.color = cc.color("#FFFFFF");
    }
  };
  _ctor.prototype.hybridResult = function () {
    var t = this;
    $10UserDataProxy.userDataProxy.userData.hybridData.time -= 1e8;
    this.unschedule(this.scheduleTimer);
    this.mHybridTime.string = "已成熟";
    this.mHybridResult.active = true;
    this.mHybridResult.y = 325;
    this.mHybridResult.x = 0;
    this.mHybridResult.scale = .5;
    cc.Tween.stopAllByTarget(this.mHybridResult);
    cc.tween(this.mHybridResult).to(.3, {
      scale: 1.1
    }).to(.1, {
      scale: 1
    }).call(function () {
      t._isCanTouch = true;
    }).start();
    var e = this.getHybridCombineData(this._selectPlantIds[0], this._selectPlantIds[1]);
    var o = this.mHybridResult.getChildByName("plantImg");
    var i = this.mHybridResult.getChildByName("plantName");
    var n = "";
    if (e) {
      this._resultPlantData = $10DataManager.DataManager.instance.eData.dataplant[e.firstCombine];
      i.getComponent(cc.Label).string = this._resultPlantData.name;
      n = "" + this._resultPlantData.icon;
      this.mHybridTitle.string = "杂交成功";
      this.mHybridTitle.node.color = cc.color("#FFFFFF");
    } else {
      i.getComponent(cc.Label).string = "杂树根";
      n = "wp_zashugen";
      this.mHybridTitle.string = "杂交失败";
      this.mHybridTitle.node.color = cc.color(125, 125, 125);
    }
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/botanyIcon/BotanyIcon",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      o.getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame(n);
    }).catch(function (t) {
      console.log("error:", t);
    });
    this.mWateringView.getChildByName("BtnVideo").active = false;
    this.mWateringView.getChildByName("BtnWatering").active = false;
  };
  _ctor.prototype.getHybridResult = function () {
    var t = this;
    $10UserDataProxy.userDataProxy.userData.hybridData.plant1 = 0;
    $10UserDataProxy.userDataProxy.userData.hybridData.plant2 = 0;
    $10UserDataProxy.userDataProxy.userData.hybridData.time = 0;
    var e = this.getHybridCombineData(this._selectPlantIds[0], this._selectPlantIds[1]);
    if (e) {
      if ($10UserDataProxy.userDataProxy.userData.hybridPlantDatas.findIndex(function (e) {
        return e.plantId == t._resultPlantData.id;
      }) < 0) {
        $10UserDataProxy.userDataProxy.userData.hybridPlantDatas.push({
          plantId: this._resultPlantData.id,
          lv: 1
        });
        $10UserDataProxy.userDataProxy.saveData();
        this.mBagRedDot.active = true;
        $10GameUIManager.gameUIMgr.showUnlockHybridPlantPopup(this._resultPlantData.id, function () {
          var e = t.node.getChildByName("BtnBag");
          var o = $10Util.default.convertToTargetNodeSpace(e, t.mHybridResult);
          cc.Tween.stopAllByTarget(t.mHybridResult);
          cc.tween(t.mHybridResult).to(.5, {
            position: o,
            scale: .3
          }).call(function () {
            t.initView();
          }).start();
        });
      } else {
        var o = e.repeatCombine.split("_").map(Number);
        this.getShopAward([{
          id: o[0],
          num: o[1]
        }], false);
        this.initView();
      }
    } else {
      var i = [];
      for (var n = 0; n < this._selectPlantIds.length; ++n) {
        var a = 1e3 + this._selectPlantIds[n];
        var r = $10DataManager.DataManager.instance.eData.dataitem[a];
        var s = 74;
        if (3 == r.qulity) {
          s = 75;
        } else {
          4 == r.qulity && (s = 76);
        }
        var c = Number($10DataManager.DataManager.instance.eData.datapara[s].num);
        i.push({
          id: a,
          num: c
        });
      }
      this.getShopAward(i, true);
      this.initView();
    }
  };
  _ctor.prototype.initView = function () {
    this._selectPlantIds = [0, 0];
    this.initPits();
    this.mWateringView.active = false;
    this.mSelectView.active = true;
    this.initCanHybridPlantDatas();
  };
  _ctor.prototype.getShopAward = function (t, e) {
    if (e) {
      $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
        list: t,
        type: 1
      }, "杂交失败", true);
    } else {
      $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
        list: t,
        type: 1
      });
    }
  };
  _ctor.prototype.onHybridResult = function () {
    this._isCanTouch && this.getHybridResult();
  };
  _ctor.prototype.onBtnRight = function () {
    if (this._isCanTouch) {
      this._pageIdx++;
      this.initPageBtn();
    }
  };
  _ctor.prototype.onBtnLeft = function () {
    if (this._isCanTouch) {
      this._pageIdx--;
      this.initPageBtn();
    }
  };
  _ctor.prototype.removePitPlant = function (t, e) {
    this._selectPlantIds[t - 1] = 0;
    var o = this.getHybridPlantItemById(e);
    o && o.getComponent($10HybridPlantItem.default).setSelectIsShow(false);
  };
  _ctor.prototype.getHybridPlantItemById = function (t) {
    var e = this.mSelectContent.children;
    var o = e[this._pageIdx].children;
    for (var i = 0; i < o.length; ++i) {
      if ((r = o[i]).getComponent($10HybridPlantItem.default).plantData.id == t) {
        return r;
      }
    }
    for (i = 0; i < e.length; ++i) {
      if (i != this._pageIdx) {
        var n = e[i].children;
        for (var a = 0; a < n.length; ++a) {
          var r;
          if ((r = n[a]).getComponent($10HybridPlantItem.default).plantData.id == t) {
            return r;
          }
        }
      }
    }
    return null;
  };
  _ctor.prototype.getSaplingStage = function () {
    var t = $10UserDataProxy.userDataProxy.userData.hybridData.time;
    var e = $10TimeUtil.TimeUtil.getDate().getTime();
    var o = Math.floor((t - e) / 1e3);
    var i = 1;
    if (o <= Math.floor(this._needTime / 1e3 * .33)) {
      i = 3;
    } else {
      o <= Math.floor(this._needTime / 1e3 * .66) && (i = 2);
    }
    return i;
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnBag", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnHybrid", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mHybridView", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mPits", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mSelectView", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mWateringView", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mHybridTime", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mSelectContent", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mPriceNumLab", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mDots", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnRight", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBtnLeft", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mTouchNode", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mTouchPlant", undefined);
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSaplingSp", undefined);
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mWateringSp", undefined);
  cc__decorate([ccp_property(cc.Button)], _ctor.prototype, "mBtnWatering", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mHybridResult", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBagRedDot", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mRotateBg", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mHybridTitle", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_HomeHybridView;