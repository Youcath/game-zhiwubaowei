var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10DataManager = require("DataManager");
var $10NodePoolManager = require("NodePoolManager");
var $10MB_Enemy = require("MB_Enemy");
var $10MB_Player = require("MB_Player");
var $10E_AttrType = require("E_AttrType");
var $10MB_GameEnum = require("MB_GameEnum");
var $10MB_PopHurt = require("MB_PopHurt");
var $10MBScene = require("MBScene");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MB_BattleView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.nActors = null;
    e.nPopHurts = null;
    e.nBullets = null;
    e.player = null;
    e._enemy = null;
    e._curRoundTeam = $10MB_GameEnum.E_MB_ActorTeam.PLAYER;
    e._initEnemyPos = cc.v2(274, 380);
    e._gameSpeed = 1;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "gameSpeed", {
    get: function () {
      return this._gameSpeed;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    $10EventManager.EventManager.instance.on($10MB_GameEnum.E_MB_BattleEvent.ROUND_START, this.onRoundStart, this);
    $10EventManager.EventManager.instance.on($10MB_GameEnum.E_MB_BattleEvent.ROUND_END, this.onRoundEnd, this);
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10MB_GameEnum.E_MB_BattleEvent.ROUND_START, this.onRoundStart, this);
    $10EventManager.EventManager.instance.off($10MB_GameEnum.E_MB_BattleEvent.ROUND_END, this.onRoundEnd, this);
  };
  _ctor.prototype.init = function () {
    this.player.init();
    this._initEnemyPos = this.player.node.getPosition().clone();
    this._initEnemyPos.x = -this._initEnemyPos.x;
  };
  _ctor.prototype.setGameSpeed = function (t) {
    this._gameSpeed = t;
  };
  _ctor.prototype.onEnterReady = function () {
    var t = this;
    this._enemy = null;
    this.player.attackTarget = null;
    this.player.onEnterReady();
    var e = $10DataManager.DataManager.instance.eData.data_bagstage[$10MBScene.default.instance.curStage];
    var n = $10DataManager.DataManager.instance.eData.datamonster[e.monster];
    $10ResUtil.ResUtil.loadAsset({
      bundleName: "res_MB",
      path: "prefabs/enemys/" + n.modeName,
      type: cc.Prefab
    }).then(function (e) {
      if (t.nActors && t.nActors.isValid) {
        var n = cc.instantiate(e);
        t.nActors.addChild(n);
        n.setPosition(t._initEnemyPos.add(cc.v2(500)));
        t._enemy = n.getComponent($10MB_Enemy.default);
        t._enemy.init();
        t._enemy.onEnterReady();
      }
    });
  };
  _ctor.prototype.onEnterBattle = function () {
    var t = this;
    this.player.attackTarget = this._enemy;
    this._enemy.attackTarget = this.player;
    this.player.onEnterBattle();
    this._enemy.onEnterBattle();
    console.log("player speed: " + this.player.getAttribute($10E_AttrType.E_AttrType.SPD).value);
    console.log("enemy speed: " + this._enemy.getAttribute($10E_AttrType.E_AttrType.SPD).value);
    if (this.player.getAttribute($10E_AttrType.E_AttrType.SPD).value >= this._enemy.getAttribute($10E_AttrType.E_AttrType.SPD).value) {
      this._curRoundTeam = $10MB_GameEnum.E_MB_ActorTeam.PLAYER;
      this.player.startRound().then(function () {
        t.player.endRound();
      });
    } else {
      this._curRoundTeam = $10MB_GameEnum.E_MB_ActorTeam.ENEMY;
      this._enemy.startRound().then(function () {
        t._enemy.endRound();
      });
    }
  };
  _ctor.prototype.onRoundStart = function () {};
  _ctor.prototype.onRoundEnd = function (t) {
    var e = this;
    if (this._enemy.isDead()) {
      $10MBScene.default.instance.win();
    } else if (this.player.isDead()) {
      $10MBScene.default.instance.fail();
    } else {
      this._curRoundTeam = t === $10MB_GameEnum.E_MB_ActorTeam.PLAYER ? $10MB_GameEnum.E_MB_ActorTeam.ENEMY : $10MB_GameEnum.E_MB_ActorTeam.PLAYER;
      if (this._curRoundTeam === $10MB_GameEnum.E_MB_ActorTeam.PLAYER) {
        this.player.startRound().then(function () {
          e.player && e.player.endRound();
        });
      } else {
        this._enemy.startRound().then(function () {
          e._enemy && e._enemy.endRound();
        });
      }
    }
  };
  _ctor.prototype.popHurt = function (t, e, n) {
    var i = this;
    var o = $10NodePoolManager.default.instance.getPoolPrefab("MB_PopHurt");
    if (o) {
      var a = $10NodePoolManager.default.instance.getNode(o);
      this.nPopHurts.addChild(a);
      a.setPosition(e);
      a.getComponent($10MB_PopHurt.default).popup(t, n);
    } else {
      $10ResUtil.ResUtil.loadAsset({
        bundleName: "res_MB",
        path: "prefabs/MB_PopHurt",
        type: cc.Prefab,
        success: function (o) {
          $10NodePoolManager.default.instance.addPoolPrefab(o);
          i.popHurt(t, e, n);
        }
      });
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nActors", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nPopHurts", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nBullets", undefined);
  cc__decorate([ccp_property($10MB_Player.default)], _ctor.prototype, "player", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_MB_BattleView;