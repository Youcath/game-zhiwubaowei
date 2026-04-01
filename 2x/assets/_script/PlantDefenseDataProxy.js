var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plantDefenseDataProxy = exports.PDGameMode = exports.PDDataEvent = exports.PlantDefenseData = exports.PDPlantEnum = undefined;
var $10ProxyBase = require("ProxyBase");
var $10EventManager = require("EventManager");
var $10GameEnum = require("GameEnum");
var $10DataManager = require("DataManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
(function (t) {
  t[t.MAX_ATK_DISTANCE = 575] = "MAX_ATK_DISTANCE";
})(exports.PDPlantEnum || (exports.PDPlantEnum = {}));
var h;
var d;
var exp_PlantDefenseData = function () {
  this.reliveCnt = 1;
  this.hurtMulti = 1;
  this.btnStartTime = 0;
  this.btnStartTime2 = 0;
  this.unlockLevels = [1];
  this.unlocklookAd = {};
  this.stageLoseNum = {};
};
exports.PlantDefenseData = exp_PlantDefenseData;
(function (t) {
  t.WOOD_UPDATE = "WOOD_UPDATE";
  t.ADD_PLANT_CARD = "ADD_PLANT_CARD";
  t.WOOD_ADD = "WOOD_ADD";
  t.UPDATE_PLANT = "UPDATE_PLANT";
  t.Eenter_PD_GAME = "Eenter_PD_GAME";
  t.CHECK_GAME_END = "CHECK_GAME_END";
  t.GAME_OVER = "GAME_OVER";
  t.SWITCH_SUPER_WEAPON = "SWITCH_SUPER_WEAPON";
})(h = exports.PDDataEvent || (exports.PDDataEvent = {}));
(function (t) {
  t[t.PD_GAME = 1] = "PD_GAME";
  t[t.SJ_GAME = 2] = "SJ_GAME";
})(d = exports.PDGameMode || (exports.PDGameMode = {}));
var def_PlantDefenseDataProxy = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.gameState = $10GameEnum.GameState.NONE;
    e.gameMode = d.PD_GAME;
    e.mapLayer = null;
    e.iceView = null;
    e.pathView = null;
    e.battleView = null;
    e.bulletLayer = null;
    e.topLayer = null;
    e.effectLayer = null;
    e.keyboradList = [];
    e.selectStageId = 1;
    e.plantList = "";
    e.soldiers = [];
    e.enemySoldiers = [];
    e.curSunshine = 0;
    e.speedAtkBuff = 1;
    e.superPlantIds = [];
    e.stagetAddBuff = 1;
    e.stagetJianBuff = 0;
    e.jarStates = new Map();
    e.priestZombie = [];
    e.enemyAirship = [];
    e.airshipSoldier = [];
    e.enemyPathIce = [];
    e.waveEnemyNum = 0;
    e.plantNode15 = null;
    e.summerLayer = null;
    e.sumBoxNode = null;
    e.idPlants = {};
    e.oncePlantItem = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.resetData = function () {
    this.oncePlantItem = [];
    this.superPlantIds = [];
    this.priestZombie = [];
    this.enemyAirship = [];
    this.airshipSoldier = [];
    this.enemyPathIce = [];
    this.idPlants = {};
    this.plantNode15 = null;
    this.curSunshine = 0;
    this.soldiers = [];
    this.enemySoldiers = [];
    this.jarStates.clear();
    this.speedAtkBuff = 1;
  };
  _ctor.prototype.addSunshine = function (t) {
    this.curSunshine += t;
    this.curSunshine < 0 && (this.curSunshine = 0);
    $10EventManager.EventManager.instance.emit(h.WOOD_UPDATE);
    this.sumBoxNode && cc.tween(this.sumBoxNode).to(.1, {
      scale: 1.1
    }).to(.1, {
      scale: 1
    }).start();
  };
  _ctor.prototype.checkSuperPlant = function () {};
  _ctor.prototype.deleteSuperPlant = function () {};
  _ctor.prototype.removeEnemyNode = function (t) {
    var e = this.enemySoldiers.indexOf(t);
    -1 != e && this.enemySoldiers.splice(e, 1);
  };
  _ctor.prototype.getIsSuperPlant = function (t) {
    return this.superPlantIds.indexOf(t) >= 0;
  };
  _ctor.prototype.isJarIntact = function (t) {
    return "broken" !== this.jarStates.get(t) && "defender" !== this.jarStates.get(t);
  };
  _ctor.prototype.isJarfanzhi = function (t) {
    return "broken" !== this.jarStates.get(t);
  };
  Object.defineProperty(_ctor.prototype, "PlantDefenseData", {
    get: function () {
      return this._data;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.saveData = function () {
    $10DataManager.DataManager.instance.writeGameDataBase($10ProxyBase.ProxyKey.PlantDefenseData, this.PlantDefenseData, null);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10ProxyBase.ProxyBase);
exports.default = def_PlantDefenseDataProxy;
exports.plantDefenseDataProxy = new def_PlantDefenseDataProxy(exp_PlantDefenseData);