Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProxyBase = exports.ProxyKey = undefined;
(function (t) {
  t.BattleData = "BattleData";
  t.UserData = "UserData";
  t.SetData = "SetData";
  t.RelicsData = "RelicsData";
  t.OtherData = "OtherData";
  t.MBData = "MBData";
  t.GuardingData = "GuardingData";
  t.STJData = "STJData";
  t.PlantDefenseData = "PlantDefenseData";
})(exports.ProxyKey || (exports.ProxyKey = {}));
var exp_ProxyBase = function () {
  function _ctor(t) {
    this._data = null;
    this._data = new t();
    this.onConstructor();
  }
  _ctor.prototype.onConstructor = function () {};
  _ctor.prototype.init = function (t) {
    if (t) {
      for (var e in t) {
        this._data[e] = t[e];
      }
      this.initData();
    }
  };
  _ctor.prototype.initData = function () {};
  return _ctor;
}();
exports.ProxyBase = exp_ProxyBase;