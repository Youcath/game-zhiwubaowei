Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProxyManager = undefined;
var $10ProxyBase = require("ProxyBase");
var $10BattleDataProxy = require("BattleDataProxy");
var $10GuardingDataProxy = require("GuardingDataProxy");
var $10MBGameDataProxy = require("MBGameDataProxy");
var $10OtherDataProxy = require("OtherDataProxy");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10RelicsDataProxy = require("RelicsDataProxy");
var $10STJDataProxy = require("STJDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10UserSetDataProxy = require("UserSetDataProxy");
var exp_ProxyManager = function () {
  function _ctor() {}
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == this._instance && (this._instance = new _ctor());
      return this._instance;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.readGameDataBase = function (t, e) {
    switch (t) {
      case $10ProxyBase.ProxyKey.BattleData:
        var o = new $10BattleDataProxy.BattleData();
        this.readDataItem(o, e);
        $10BattleDataProxy.battleDataProxy.init(o);
        break;
      case $10ProxyBase.ProxyKey.UserData:
        var d = new $10UserDataProxy.UserData();
        this.readDataItem(d, e);
        $10UserDataProxy.userDataProxy.init(d);
        break;
      case $10ProxyBase.ProxyKey.SetData:
        var m = new $10UserSetDataProxy.SetData();
        this.readDataItem(m, e);
        $10UserSetDataProxy.userSetDataProxy.init(m);
        break;
      case $10ProxyBase.ProxyKey.RelicsData:
        var f = new $10RelicsDataProxy.RelicsData();
        this.readDataItem(f, e);
        $10RelicsDataProxy.relicsDataProxy.init(f);
        break;
      case $10ProxyBase.ProxyKey.OtherData:
        var y = new $10OtherDataProxy.OtherData();
        this.readDataItem(y, e);
        $10OtherDataProxy.otherDataProxy.init(y);
        break;
      case $10ProxyBase.ProxyKey.MBData:
        var g = new $10MBGameDataProxy.MBGameData();
        this.readDataItem(g, e);
        $10MBGameDataProxy.mbGameDataProxy.init(g);
        break;
      case $10ProxyBase.ProxyKey.GuardingData:
        var _ = new $10GuardingDataProxy.GuardingData();
        this.readDataItem(_, e);
        $10GuardingDataProxy.guardingDataProxy.init(_);
        break;
      case $10ProxyBase.ProxyKey.STJData:
        var v = new $10STJDataProxy.STJData();
        this.readDataItem(v, e);
        $10STJDataProxy.sTJDataProxy.init(v);
        break;
      case $10ProxyBase.ProxyKey.PlantDefenseData:
        var b = new $10PlantDefenseDataProxy.PlantDefenseData();
        this.readDataItem(b, e);
        $10PlantDefenseDataProxy.plantDefenseDataProxy.init(b);
    }
  };
  _ctor.prototype.readDataItem = function (t, e) {
    for (var o in e) {
      if ("object" == typeof e[o] && t[o]) {
        this.readDataItem(t[o], e[o]);
      } else {
        t[o] = e[o];
      }
    }
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.ProxyManager = exp_ProxyManager;