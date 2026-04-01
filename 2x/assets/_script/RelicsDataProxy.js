var i;
var cc__extends = __extends;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.relicsDataProxy = exports.RelicsData = undefined;
var $10ProxyBase = require("ProxyBase");
var $10DataManager = require("DataManager");
var exp_RelicsData = function () {
  this.lookAdNum = 0;
  this.relicsMap = {};
  this.radomNum = 0;
};
exports.RelicsData = exp_RelicsData;
var def_RelicsDataProxy = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "relicsData", {
    get: function () {
      return this._data;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.addRelics = function (t, e) {
    var o = this.relicsData.relicsMap[t];
    if (o) {
      o.curNum += e;
    } else {
      o = {
        id: t,
        level: 1,
        curNum: e
      };
      this.relicsData.relicsMap[t] = o;
    }
    this.saveData();
  };
  _ctor.prototype.getRelicsData = function (t) {
    return this.relicsData.relicsMap[t];
  };
  _ctor.prototype.upgradeRelics = function (t) {
    var e = $10DataManager.DataManager.instance.eData.data_artifact[t];
    var o = this.relicsData.relicsMap[t].level;
    for (var i = Number(e.needNum.split("|")[o - 1]); this.relicsData.relicsMap[t].curNum >= i && this.relicsData.relicsMap[t].level < e.maxLevel;) {
      this.relicsData.relicsMap[t].curNum -= i;
      this.relicsData.relicsMap[t].level += 1;
      o = this.relicsData.relicsMap[t].level;
      i = Number(e.needNum.split("|")[o - 1]);
    }
  };
  _ctor.prototype.addRadomNum = function (t) {
    this.relicsData.radomNum += t;
    this.saveData();
  };
  _ctor.prototype.addLookAdNum = function (t) {
    this.relicsData.lookAdNum += t;
    this.saveData();
  };
  _ctor.prototype.newDataReset = function () {
    this.relicsData.lookAdNum = 0;
    this.saveData();
  };
  _ctor.prototype.saveData = function () {
    $10DataManager.DataManager.instance.writeGameDataBase($10ProxyBase.ProxyKey.RelicsData, this.relicsData);
  };
  _ctor.prototype.resetData = function () {
    this._data = new exp_RelicsData();
    $10DataManager.DataManager.instance.saveGame();
  };
  return _ctor;
}($10ProxyBase.ProxyBase);
exports.default = def_RelicsDataProxy;
exports.relicsDataProxy = new def_RelicsDataProxy(exp_RelicsData);