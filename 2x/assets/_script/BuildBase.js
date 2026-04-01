var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10ShimmerWhite = require("ShimmerWhite");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BuildBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBaseSpr = null;
    e.mHpBar = null;
    e._dadTime = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.READY || this._dadTime > 0 && (this._dadTime -= t, this._dadTime <= 0 && (this._dadTime = 0, $10BattleDataProxy.battleDataProxy.isDad = false));
  };
  _ctor.prototype.onLoad = function () {
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.UPDATE_HOUSE_HP, this.updateHouseHp, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.RESURGENCE, this.resurgence, this);
  };
  _ctor.prototype.initBuildBase = function () {
    var t = this;
    this._monsterCfg = $10DataManager.DataManager.instance.eData.datamonster[1e3];
    this.updateHouseHp(0);
    if ($10BattleDataProxy.battleDataProxy.isEndless) {
      this.node.position = cc.v3(-280, 130);
      this.mBaseSpr.node.scaleX = -1;
      this.node.parent = $10BattleDataProxy.battleDataProxy.battleView;
      this.node.zIndex = -this.node.y;
    }
    var e = "";
    if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.Night) {
      e = "textures/weather/pic_fangzi_tianqi3";
    } else if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.SandWind) {
      e = "textures/weather/pic_fangzi_tianqi4";
    } else {
      $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.IceAndSnow && (e = "textures/weather/pic_fangzi_tianqi5");
    }
    "" != e && $10ResUtil.ResUtil.loadAsset({
      path: e,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      t.mBaseSpr.spriteFrame = e;
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.UPDATE_HOUSE_HP, this.updateHouseHp, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.RESURGENCE, this.resurgence, this);
  };
  _ctor.prototype.resurgence = function () {
    this._dadTime = 3;
    $10BattleDataProxy.battleDataProxy.isDad = true;
    $10BattleDataProxy.battleDataProxy.battleData.houseHp = $10BattleDataProxy.battleDataProxy.battleData.houseMaxHp;
    this.mHpBar.fillRange = $10BattleDataProxy.battleDataProxy.battleData.houseHp / $10BattleDataProxy.battleDataProxy.battleData.houseMaxHp;
    var t = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
    for (var e = 0; e < t.length; ++e) {
      var o = t[e];
      if (o && o.isValid) {
        o.destroy();
        o.removeFromParent();
      }
    }
    var i = $10BattleDataProxy.battleDataProxy.enemyAirship.slice();
    for (e = 0; e < i.length; ++e) {
      var n = i[e];
      if (n && n.isValid) {
        n.destroy();
        n.removeFromParent();
      }
    }
    $10BattleDataProxy.battleDataProxy.pathPointView.children.forEach(function (t) {
      t && t.isValid && (t.PathIce = null);
    });
    $10AudioManager.AudioManager.instance.playBgmPath("sounds/battleBGM", $10HomeEnum.Bundles.RES);
    $10BattleDataProxy.battleDataProxy.wateringCart = null;
    $10BattleDataProxy.battleDataProxy.enemyNodes = [];
    $10BattleDataProxy.battleDataProxy.enemyAirship = [];
    $10BattleDataProxy.battleDataProxy.airshipSoldier = [];
    $10BattleDataProxy.battleDataProxy.priestZombie = [];
    $10BattleDataProxy.battleDataProxy.enemyPathIce.forEach(function (t) {
      if (t && t.isValid) {
        t.destroy();
        t.removeFromParent();
      }
    });
    $10BattleDataProxy.battleDataProxy.enemyPathIce = [];
  };
  _ctor.prototype.updateHouseHp = function (t) {
    this.showHurtLab(t);
    this.mHpBar.fillRange = $10BattleDataProxy.battleDataProxy.battleData.houseHp / $10BattleDataProxy.battleDataProxy.battleData.houseMaxHp;
    t < 0 && this.mBaseSpr.getComponent($10ShimmerWhite.default).show();
  };
  _ctor.prototype.showHurtLab = function (t) {
    if (0 != t) {
      var e = this.node.position;
      e.y += this.node.height / 2;
      $10Util.default.showHurt(Math.ceil(t), t > 0 ? $10Util.HurtType.RECOVERY : $10Util.HurtType.NORMAL, e, this, $10BattleDataProxy.battleDataProxy.numberView);
    }
  };
  _ctor.prototype.beAttack = function () {
    var t = Number($10DataManager.DataManager.instance.eData.datapara[68].num);
    $10BattleDataProxy.battleDataProxy.updateHouseHp({
      isCirt: false,
      num: -t
    });
    return false;
  };
  _ctor.prototype.dizziness = function (t) {
    undefined === t && (t = 2);
  };
  _ctor.prototype.ice = function (t) {
    undefined === t && (t = 3);
  };
  _ctor.prototype.iceSpeedCut = function () {};
  _ctor.prototype.flaser = function () {};
  _ctor.prototype.initSimulationData = function () {};
  _ctor.prototype.getMovePosByTime = function () {
    return this.node.position;
  };
  _ctor.prototype.getIsAllowAstrictMove = function () {
    return false;
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mBaseSpr", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mHpBar", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10EnemyBase.default);
exports.default = def_BuildBase;