var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10PopupManager = require("PopupManager");
var $10Common = require("Common");
var $10Simulator = require("Simulator");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10GuardingDataProxy = require("GuardingDataProxy");
var $10GTBuff = require("GTBuff");
var $10GTEquipment = require("GTEquipment");
var $10GTMonster = require("GTMonster");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GTBattleView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.equipment = null;
    e.equipmentLayer = null;
    e.monster = null;
    e.bosss = [];
    e.buffNode = null;
    e._isNextStart = false;
    e._currRefreshMonsterTime = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    for (var e in $10BattleDataProxy.battleDataProxy.audioFilterInfo) {
      $10BattleDataProxy.battleDataProxy.audioFilterInfo[e].time -= t;
    }
    if ($10GuardingDataProxy.guardingDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      if ($10GuardingDataProxy.guardingDataProxy.keyBoradList.length > 0 && cc.Vec3.ZERO.equals(cc.Vec3.ZERO)) {
        switch ($10GuardingDataProxy.guardingDataProxy.keyBoradList[$10GuardingDataProxy.guardingDataProxy.keyBoradList.length - 1]) {
          case cc.macro.KEY.a:
            $10GuardingDataProxy.guardingDataProxy.playerNode.x -= 500 * t;
            $10GuardingDataProxy.guardingDataProxy.playerNode.x < -this.node.width / 2 + $10GuardingDataProxy.guardingDataProxy.playerNode.width / 2 && ($10GuardingDataProxy.guardingDataProxy.playerNode.x = -this.node.width / 2 + $10GuardingDataProxy.guardingDataProxy.playerNode.width / 2);
            break;
          case cc.macro.KEY.d:
            $10GuardingDataProxy.guardingDataProxy.playerNode.x += 500 * t;
            $10GuardingDataProxy.guardingDataProxy.playerNode.x > this.node.width / 2 - $10GuardingDataProxy.guardingDataProxy.playerNode.width / 2 && ($10GuardingDataProxy.guardingDataProxy.playerNode.x = this.node.width / 2 - $10GuardingDataProxy.guardingDataProxy.playerNode.width / 2);
        }
      }
      $10Simulator.Simulator.instance.run(t * $10BattleDataProxy.battleDataProxy.getGameSpd());
      for (var e in $10BattleDataProxy.battleDataProxy.audioFilterInfo) {
        $10BattleDataProxy.battleDataProxy.audioFilterInfo[e].time -= t;
      }
      if (this._isNextStart) {
        var o = $10DataManager.DataManager.instance.eData.data_bridgestage[$10GuardingDataProxy.guardingDataProxy.currStageId];
        if (!o) {
          return;
        }
        this._currRefreshMonsterTime += t;
        if (this._currRefreshMonsterTime > o.time) {
          this.addMonster($10GuardingDataProxy.guardingDataProxy.currStageId);
          $10GuardingDataProxy.guardingDataProxy.currStageId += 1;
        }
      }
    }
  };
  _ctor.prototype.addMonster = function () {
    var t = this;
    var e = $10DataManager.DataManager.instance.eData.data_bridgestage[$10GuardingDataProxy.guardingDataProxy.currStageId];
    if (e) {
      if (e.monsterId > 0) {
        var o = e.row;
        var i = e.column;
        var a = e.cd;
        var n = 50;
        var r = 80;
        1 == o && (r = 150);
        o > 3 && (n = 30);
        for (var s = 0; s < i; s++) {
          this.scheduleOnce(function () {
            for (var i = 0; i < o; i++) {
              var a = t.monster;
              var s = $10DataManager.DataManager.instance.eData.datamonster[e.monsterId];
              if (1 != s.type) {
                var c = s.modeName;
                for (var l = 0; l < t.bosss.length; ++l) {
                  if (c == t.bosss[l].name) {
                    a = t.bosss[l];
                    break;
                  }
                }
              }
              var u = cc.instantiate(a);
              u.parent = t.node;
              var p = r + i * n;
              var h = Math.min(p, 230);
              u.setPosition(h, 800);
              u.active = true;
              var g = u.getComponent($10GTMonster.default);
              g && g.initEnemy(e);
              $10GuardingDataProxy.guardingDataProxy.monsters.push(u);
            }
          }, a * s);
        }
      } else {
        var c = cc.instantiate(this.buffNode);
        c.parent = $10GuardingDataProxy.guardingDataProxy.buffLayer;
        c.setPosition(175, 800);
        c.getComponent($10GTBuff.default).init(e);
        $10GuardingDataProxy.guardingDataProxy.skillBoxs.push(c);
      }
    }
  };
  _ctor.prototype.onDisable = function () {
    $10EventManager.EventManager.instance.off($10GuardingDataProxy.GuardingDataEvent.UPDATE_EQUIPMENT, this.addEquipemnt, this);
    $10EventManager.EventManager.instance.off($10GuardingDataProxy.GuardingDataEvent.KILL_MONSTER, this.killMonster, this);
    this.node.targetOff(this);
  };
  _ctor.prototype.start = function () {
    this.equipmentLayer.y = 1e3;
    $10EventManager.EventManager.instance.on($10GuardingDataProxy.GuardingDataEvent.UPDATE_EQUIPMENT, this.addEquipemnt, this);
    $10EventManager.EventManager.instance.on($10GuardingDataProxy.GuardingDataEvent.KILL_MONSTER, this.killMonster, this);
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  };
  _ctor.prototype.onTouchStart = function () {};
  _ctor.prototype.onTouchMove = function (t) {
    if ($10GuardingDataProxy.guardingDataProxy.gameState == $10GameEnum.GameState.PLAYING && -1 == $10GuardingDataProxy.guardingDataProxy.keyboradList.indexOf(cc.macro.KEY.a) && -1 == $10GuardingDataProxy.guardingDataProxy.keyboradList.indexOf(cc.macro.KEY.d)) {
      var e = t.touch.getDelta();
      $10GuardingDataProxy.guardingDataProxy.playerNode.x += e.x;
      $10GuardingDataProxy.guardingDataProxy.playerNode.x < -this.node.width / 2 + $10GuardingDataProxy.guardingDataProxy.playerNode.width / 2 && ($10GuardingDataProxy.guardingDataProxy.playerNode.x = -this.node.width / 2 + $10GuardingDataProxy.guardingDataProxy.playerNode.width / 2);
      $10GuardingDataProxy.guardingDataProxy.playerNode.x > this.node.width / 2 - $10GuardingDataProxy.guardingDataProxy.playerNode.width / 2 && ($10GuardingDataProxy.guardingDataProxy.playerNode.x = this.node.width / 2 - $10GuardingDataProxy.guardingDataProxy.playerNode.width / 2);
    }
  };
  _ctor.prototype.onTouchEnd = function () {};
  _ctor.prototype.killMonster = function () {
    $10GuardingDataProxy.guardingDataProxy.currStageId > 46 && 0 == $10GuardingDataProxy.guardingDataProxy.monsters.length && $10PopupManager.PopupManager.instance.show({
      bundleName: $10HomeEnum.Bundles.GuardingTheBridge,
      path: "prefabs/popups/GTWinPopup",
      keep: true
    });
  };
  _ctor.prototype.startGame = function () {
    $10Simulator.Simulator.instance.clear();
    $10Simulator.Simulator.instance.setAgentDefaults(50, 5, 1, .1, 0, 1e3, new $10Common.Vector2(0, 0));
    this._currRefreshMonsterTime = 0;
    this._isNextStart = true;
    $10GuardingDataProxy.guardingDataProxy.skillBoxs = [];
    $10GuardingDataProxy.guardingDataProxy.monsters = [];
    $10GuardingDataProxy.guardingDataProxy.equipments = [];
    this.initBridge();
  };
  _ctor.prototype.addEquipemnt = function () {
    $10GuardingDataProxy.guardingDataProxy.bridgeIndex += 1;
    var t = $10DataManager.DataManager.instance.eData.data_bridgeobstacle[$10GuardingDataProxy.guardingDataProxy.bridgeIndex];
    if (t) {
      var e = cc.instantiate(this.equipment);
      e.parent = this.equipmentLayer;
      e.setPosition(0, 220 * ($10GuardingDataProxy.guardingDataProxy.bridgeIndex - 1));
      e.active = true;
      e.getComponent($10GTEquipment.default).init(t);
      $10GuardingDataProxy.guardingDataProxy.equipments.push(e);
    }
    cc.Tween.stopAllByTarget(this.equipmentLayer);
    cc.tween(this.equipmentLayer).to(.5, {
      y: 280 - 220 * ($10GuardingDataProxy.guardingDataProxy.bridgeIndex - 4)
    }).start();
  };
  _ctor.prototype.initBridge = function () {
    var t = this;
    var e = $10DataManager.DataManager.instance.eData.data_bridgeobstacle;
    var o = function (o) {
      var a = e[o];
      a && i.scheduleOnce(function () {
        var e = cc.instantiate(t.equipment);
        e.parent = t.equipmentLayer;
        e.setPosition(0, 220 * $10GuardingDataProxy.guardingDataProxy.bridgeIndex);
        e.active = true;
        e.getComponent($10GTEquipment.default).init(a);
        $10GuardingDataProxy.guardingDataProxy.equipments.push(e);
        $10GuardingDataProxy.guardingDataProxy.bridgeIndex = o;
      }, .1 * o);
    };
    var i = this;
    for (var a = 1; a < 5; a++) {
      o(a);
    }
    this.scheduleOnce(function () {
      cc.tween(t.equipmentLayer).to(1, {
        y: 280
      }).start();
    }, .5);
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "equipment", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "equipmentLayer", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "monster", undefined);
  cc__decorate([ccp_property([cc.Node])], _ctor.prototype, "bosss", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "buffNode", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_GTBattleView;