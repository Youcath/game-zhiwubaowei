var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__read = __read;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10PopupManager = require("PopupManager");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10GuardingDataProxy = require("GuardingDataProxy");
var $10GTBattleView = require("GTBattleView");
var $10GTGameMgr = require("GTGameMgr");
var $10GTPlayerCtl = require("GTPlayerCtl");
var $10GTPoolMgr = require("GTPoolMgr");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GTGameUI = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.selectNode = null;
    e.gtHitNum = null;
    e.gtHitEeffect = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.start = function () {
    var t = this;
    $10GuardingDataProxy.guardingDataProxy.refreshData();
    $10GuardingDataProxy.guardingDataProxy.bulletLayout = this.node.getChildByName("BulletLayer");
    $10GuardingDataProxy.guardingDataProxy.battleView = this.node.getChildByName("BattleView");
    $10GuardingDataProxy.guardingDataProxy.effectLayer = this.node.getChildByName("EffectLayer");
    $10GuardingDataProxy.guardingDataProxy.buffLayer = this.node.getChildByName("BuffLayer");
    this.selectNode.active = true;
    this.selectNode.x = -this.node.width;
    cc.tween(this.selectNode).to(.5, {
      x: 0
    }).call(function () {
      t.startSelect();
    }).start();
    $10GTPoolMgr.GTPoolMgr.Inst.initPool("gtHitNum", this.gtHitNum, 10);
    $10GTPoolMgr.GTPoolMgr.Inst.initPool("gtHitEeffect", this.gtHitEeffect, 10);
    if (yzll.gameConfig.isZB && cc.sys.isBrowser) {
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    $10AudioManager.AudioManager.instance.playBgmPath("sounds/bgm_1", $10HomeEnum.Bundles.GuardingTheBridge, true);
  };
  _ctor.prototype.onKeyDown = function (t) {
    this.addKeyDownList(t.keyCode);
  };
  _ctor.prototype.onKeyUp = function (t) {
    this.removeKeyDownList(t.keyCode);
    switch (t.keyCode) {
      case cc.macro.KEY.space:
        if (cc.director.isPaused()) {
          cc.director.resume();
        } else {
          cc.director.pause();
        }
    }
  };
  _ctor.prototype.addKeyDownList = function (t) {
    t != cc.macro.KEY.a && t != cc.macro.KEY.s && t != cc.macro.KEY.d && t != cc.macro.KEY.w || $10GuardingDataProxy.guardingDataProxy.keyBoradList.includes(t) || $10GuardingDataProxy.guardingDataProxy.keyBoradList.push(t);
  };
  _ctor.prototype.removeKeyDownList = function (t) {
    var e = $10GuardingDataProxy.guardingDataProxy.keyBoradList.indexOf(t);
    -1 != e && $10GuardingDataProxy.guardingDataProxy.keyBoradList.splice(e, 1);
  };
  _ctor.prototype.onDestroy = function () {
    if (yzll.gameConfig.isZB && cc.sys.isBrowser) {
      cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    $10GTPoolMgr.GTPoolMgr.Inst.realse();
  };
  _ctor.prototype.startSelect = function () {
    var t = this;
    var e = Math.floor(3 * Math.random());
    var o = function (e) {
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/choose", $10HomeEnum.Bundles.GuardingTheBridge);
      t.selectNode.getChildByName("View").children.forEach(function (t, o) {
        t.getChildByName("bg_1").active = o !== e;
        t.getChildByName("icon_1").active = o !== e;
        t.getChildByName("bg_2").active = o === e;
        t.getChildByName("icon_2").active = o === e;
      });
    };
    var i = 0;
    var a = 0;
    o(0);
    this.schedule(function () {
      if (a > 6 && i == e) {
        t.unscheduleAllCallbacks();
        t.scheduleOnce(function () {
          var o = $10GuardingDataProxy.guardingDataProxy.playerNode;
          var i = t.selectNode.getChildByName("View").children[e];
          var a = i.convertToWorldSpaceAR(cc.v2(0, 0));
          var n = o.convertToWorldSpaceAR(cc.v2(0, 0));
          var r = t.selectNode.convertToNodeSpaceAR(a);
          var s = t.selectNode.convertToNodeSpaceAR(n);
          var c = cc.instantiate(i);
          t.selectNode.getChildByName("View").children.forEach(function (t) {
            t.active = false;
          });
          t.selectNode.getChildByName("loading").active = false;
          c.parent = t.selectNode;
          c.setPosition(r);
          cc.tween(c).to(.3, {
            position: cc.v3(s.x, s.y, 0),
            scale: .5
          }, {
            easing: "quadOut"
          }).call(function () {
            c.destroy();
            $10GTGameMgr.default.instance.setEffectEquipUpgrade();
          }).start();
          t.scheduleOnce(function () {
            t.selectNode.destroy();
            t.selectNode.removeFromParent();
            t.onClickFactions(null, e);
          }, .6);
        }, .3);
      }
      o(i);
      i++;
      i %= 3;
      a++;
    }, .3);
  };
  _ctor.prototype.onClickFactions = function (t, e) {
    var o = this;
    var i = cc__read($10DataManager.DataManager.instance.eData.datapara[906 + e].num.split("|"), 2);
    var a = i[0];
    var n = i[1];
    $10GuardingDataProxy.guardingDataProxy.factions = e + 1;
    $10GuardingDataProxy.guardingDataProxy.curRoleImgsrc = a;
    $10GuardingDataProxy.guardingDataProxy.curBulletImgsrc = n;
    var s = $10DataManager.DataManager.instance.eData.datapara[903 + e].num.split("|");
    $10GuardingDataProxy.guardingDataProxy.attackNum = Number(s[0]);
    $10GuardingDataProxy.guardingDataProxy.attackSpeed = Number(s[1]);
    $10GuardingDataProxy.guardingDataProxy.attackSpeedMax = Number(s[2]);
    this.scheduleOnce(function () {
      o.initGameStart();
    }, .5);
  };
  _ctor.prototype.initGameStart = function () {
    $10GuardingDataProxy.guardingDataProxy.bulletSpeed = Number($10DataManager.DataManager.instance.eData.datapara[909].num);
    $10GuardingDataProxy.guardingDataProxy.gameState = $10GameEnum.GameState.PLAYING;
    $10GuardingDataProxy.guardingDataProxy.playerNode.getComponent($10GTPlayerCtl.default).resetPlayerImg();
    $10GuardingDataProxy.guardingDataProxy.battleView.getComponent($10GTBattleView.default).startGame();
  };
  _ctor.prototype.onBtnSet = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GuardingTheBridge,
      path: "prefabs/popups/GTSettingPopup",
      keep: true
    });
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "selectNode", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "gtHitNum", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "gtHitEeffect", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_GTGameUI;