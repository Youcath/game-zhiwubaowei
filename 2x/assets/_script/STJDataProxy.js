var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sTJDataProxy = exports.STJDataEvent = exports.STJData = undefined;
var $10ProxyBase = require("ProxyBase");
var $10GameEnum = require("GameEnum");
var $10DataManager = require("DataManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var exp_STJData = function () {
  this.reliveCnt = 1;
  this.hurtMulti = 1;
  this.btnStartTime = 0;
  this.unlockLevels = [1];
  this.unlocklookAd = {};
  this.stageLoseNum = {};
};
exports.STJData = exp_STJData;
(function (t) {
  t.WOOD_UPDATE = "WOOD_UPDATE";
  t.WOOD_ADD = "WOOD_ADD";
  t.Eenter_STJ_GAME = "Eenter_STJ_GAME";
  t.CHECK_GAME_END = "CHECK_GAME_END";
})(exports.STJDataEvent || (exports.STJDataEvent = {}));
var def_STJDataProxy = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.gameState = $10GameEnum.GameState.NONE;
    e.gridLayer = null;
    e.battleView = null;
    e.bulletLayer = null;
    e.effectLayer = null;
    e.keyboradList = [];
    e.selectStageId = 1;
    e.soldiers = [];
    e.enemySoldiers = [];
    e.curWood = 0;
    e.speedAtkBuff = 1;
    e.stagetAddBuff = 1;
    e.stagetJianBuff = 0;
    e.jarStates = new Map();
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.resetData = function () {
    this.curWood = 0;
    this.soldiers = [];
    this.enemySoldiers = [];
    this.jarStates.clear();
    this.speedAtkBuff = 1;
  };
  _ctor.prototype.isJarIntact = function (t) {
    return "broken" !== this.jarStates.get(t) && "defender" !== this.jarStates.get(t);
  };
  _ctor.prototype.isJarfanzhi = function (t) {
    return "broken" !== this.jarStates.get(t);
  };
  Object.defineProperty(_ctor.prototype, "STJData", {
    get: function () {
      return this._data;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.saveData = function () {
    $10DataManager.DataManager.instance.writeGameDataBase($10ProxyBase.ProxyKey.STJData, this.STJData, null);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10ProxyBase.ProxyBase);
exports.default = def_STJDataProxy;
exports.sTJDataProxy = new def_STJDataProxy(exp_STJData);