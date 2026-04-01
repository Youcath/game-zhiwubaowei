var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10PopupBase = require("PopupBase");
var $10GameEnum = require("GameEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10GameUIManager = require("GameUIManager");
var $10MapBlockItem = require("MapBlockItem");
var $10MapGridItem = require("MapGridItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_TestNode = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSkillBox = null;
    e.mPlantBox = null;
    e.mEnemyEditBox = null;
    e.mFixedEditBox = null;
    e.mNameEditBox = null;
    e.mNowBallNum = null;
    e.mBlockHpLab = null;
    e.mDadLab = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onEnable = function () {
    $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.PAUSE;
    this.mNowBallNum.string = "当前球数：" + $10BattleDataProxy.battleDataProxy.bulletBalls.length;
    this.mBlockHpLab.string = $10BattleDataProxy.battleDataProxy.testBlock ? "砖块正常血" : "砖块1滴血";
    this.mDadLab.string = $10BattleDataProxy.battleDataProxy.endlessIsDad ? "取消无敌" : "开启无敌";
  };
  _ctor.prototype.onDestroy = function () {
    if ($10BattleDataProxy.battleDataProxy.isStartFight) {
      $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.PLAYING;
    } else {
      $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.READY;
    }
  };
  _ctor.prototype.onAddSkillBtn = function () {
    if ("" != this.mSkillBox.string) {
      var t = Number(this.mSkillBox.string);
      if ($10BattleDataProxy.battleDataProxy.checkHasSkill(t)) {
        $10GameUIManager.gameUIMgr.showTips("技能已添加");
      } else if ($10DataManager.DataManager.instance.eData.dataskill[t]) {
        $10BattleDataProxy.battleDataProxy.selectSkill(t, null);
        $10BattleDataProxy.battleDataProxy.saveData();
        $10GameUIManager.gameUIMgr.showTips("添加成功");
      } else {
        $10GameUIManager.gameUIMgr.showTips("没有这个技能！");
      }
    } else {
      $10GameUIManager.gameUIMgr.showTips("请输入技能id");
    }
  };
  _ctor.prototype.onAddPlantBtn = function () {
    if ("" != this.mPlantBox.string) {
      var t = this.mPlantBox.string.split("_").map(Number);
      var e = t[0];
      if ($10DataManager.DataManager.instance.eData.dataplant[e]) {
        var o = t[1] ? t[1] : 1;
        o > 5 && (o = 5);
        $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.GM_ADD_EQUIP, {
          plantId: e,
          level: o
        });
      } else {
        $10GameUIManager.gameUIMgr.showTips("没有这个植物");
      }
    } else {
      $10GameUIManager.gameUIMgr.showTips("请输入植物id和等级");
    }
  };
  _ctor.prototype.onAddEnemyBtn = function () {
    if ($10BattleDataProxy.battleDataProxy.isEndless) {
      $10GameUIManager.gameUIMgr.showTips("无尽模式无法使用这个功能");
    } else if ("" != this.mEnemyEditBox.string) {
      if ($10BattleDataProxy.battleDataProxy.isStartFight) {
        var t = Number(this.mEnemyEditBox.string);
        if ($10DataManager.DataManager.instance.eData.datamonster[t]) {
          $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.GM_ADD_ENEMY, t);
          this.removeUI();
        } else {
          $10GameUIManager.gameUIMgr.showTips("没有这个怪物");
        }
      } else {
        $10GameUIManager.gameUIMgr.showTips("在战斗中才能使用");
      }
    } else {
      $10GameUIManager.gameUIMgr.showTips("请输入怪物id");
    }
  };
  _ctor.prototype.onAddFixedBtn = function () {
    if ("" != this.mFixedEditBox.string) {
      var t = Number(this.mFixedEditBox.string);
      var e = $10DataManager.DataManager.instance.eData.datastagereward[t];
      if (e) {
        if ("" != e.plant) {
          $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.GM_ADD_FIXEDPLANT, t);
          this.removeUI();
        } else {
          $10GameUIManager.gameUIMgr.showTips("这一关没有固定植物!");
        }
      } else {
        $10GameUIManager.gameUIMgr.showTips("输入关卡有误!");
      }
    } else {
      $10GameUIManager.gameUIMgr.showTips("请输入固定植物的关卡");
    }
  };
  _ctor.prototype.onAddBallBtn = function () {
    var t = $10BattleDataProxy.battleDataProxy.battleData.ballNum;
    t++;
    $10BattleDataProxy.battleDataProxy.battleData.ballNum = t;
    $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.GM_ADD_BALL);
    var e = $10BattleDataProxy.battleDataProxy.sunshineNum;
    $10BattleDataProxy.battleDataProxy.sunshineNum = e;
    this.removeUI();
  };
  _ctor.prototype.onBtnBlockHp = function () {
    $10BattleDataProxy.battleDataProxy.testBlock = !$10BattleDataProxy.battleDataProxy.testBlock;
    this.removeUI();
  };
  _ctor.prototype.onBtnRemoveBlock = function () {
    var t = $10BattleDataProxy.battleDataProxy.blockLayout.children;
    for (var e = 0; e < t.length; ++e) {
      var o = t[e].getComponent($10MapBlockItem.default).holdGrid;
      var i = $10BattleDataProxy.battleDataProxy.gridsMap.get(o);
      i && (i.getComponent($10MapGridItem.default).bValid = true);
    }
    $10BattleDataProxy.battleDataProxy.blockLayout.removeAllChildren();
    this.removeUI();
  };
  _ctor.prototype.onBtnDad = function () {
    if (yzll.gameConfig.isZB) {
      $10GameUIManager.gameUIMgr.showTips("你无法使用这个功能");
    } else {
      $10BattleDataProxy.battleDataProxy.endlessIsDad = !$10BattleDataProxy.battleDataProxy.endlessIsDad;
      this.mDadLab.string = $10BattleDataProxy.battleDataProxy.endlessIsDad ? "取消无敌" : "开启无敌";
    }
  };
  _ctor.prototype.onUserNameBtn = function () {
    if (!yzll.gameConfig.isZB && $10BattleDataProxy.battleDataProxy.isEndless) {
      var t = this.mNameEditBox.string;
      if ("" != t) {
        var e = Number(t);
        if (e && $10DataManager.DataManager.instance.eData.dataendlessstage[e]) {
          $10BattleDataProxy.battleDataProxy.endlessCurWave = e;
          $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.GM_SET_ENDLESS_WAVE);
          this.removeUI();
        } else {
          $10GameUIManager.gameUIMgr.showTips("输入有误");
        }
      } else {
        $10GameUIManager.gameUIMgr.showTips("请输入波数");
      }
    } else {
      $10GameUIManager.gameUIMgr.showTips("你无法使用这个功能");
    }
  };
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "mSkillBox", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "mPlantBox", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "mEnemyEditBox", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "mFixedEditBox", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "mNameEditBox", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mNowBallNum", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mBlockHpLab", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mDadLab", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_TestNode;