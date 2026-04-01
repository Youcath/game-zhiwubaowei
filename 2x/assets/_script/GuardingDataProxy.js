var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.guardingDataProxy = exports.GuardingDataEvent = exports.GuardingData = undefined;
var $10ProxyBase = require("ProxyBase");
var $10GameEnum = require("GameEnum");
var $10DataManager = require("DataManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var exp_GuardingData = function () {
  this.btnStartTime = 0;
  this.unlockLevels = [1];
  this.unlocklookAd = {};
};
exports.GuardingData = exp_GuardingData;
(function (t) {
  t.ITEM_UPDATE = "ITEM_UPDATE";
  t.UPDATE_EQUIPMENT = "UPDATE_EQUIPMENT";
  t.KILL_MONSTER = "KILL_MONSTER";
  t.ENTER_LEVEL = "ENTER_LEVEL";
})(exports.GuardingDataEvent || (exports.GuardingDataEvent = {}));
var def_GuardingDataProxy = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.gameState = $10GameEnum.GameState.NONE;
    e.bulletLayout = null;
    e.battleView = null;
    e.effectLayer = null;
    e.buffLayer = null;
    e.factions = 1;
    e.monsters = [];
    e.equipments = [];
    e.skillBoxs = [];
    e.keyboradList = [];
    e.currStageId = 1;
    e.bridgeIndex = 0;
    e.curRoleImgsrc = "pic_plant10";
    e.curBulletImgsrc = "xiandao_1";
    e.bulletCount = 1;
    e.attackSpeed = .2;
    e.attackCrit = 0;
    e.attackSpeedMax = .08;
    e.attackNum = 10;
    e.playerNode = null;
    e.bulletSpeed = 1e3;
    e.bPenetrate = 1;
    e.selectLevel = 1;
    e.keyBoradList = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.refreshData = function () {
    this.curRoleImgsrc = "juese_1";
    this.curBulletImgsrc = "xiandao_1";
    this.bPenetrate = 1;
    this.attackNum = 10;
    this.attackCrit = 0;
    this.attackSpeed = .2;
    this.bulletCount = 1;
    this.currStageId = 1;
    this.bridgeIndex = 0;
  };
  Object.defineProperty(_ctor.prototype, "GuardingData", {
    get: function () {
      return this._data;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.saveData = function () {
    $10DataManager.DataManager.instance.writeGameDataBase($10ProxyBase.ProxyKey.GuardingData, this.GuardingData, null);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10ProxyBase.ProxyBase);
exports.default = def_GuardingDataProxy;
exports.guardingDataProxy = new def_GuardingDataProxy(exp_GuardingData);