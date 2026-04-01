var i;
var cc__extends = __extends;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mbGameDataProxy = exports.MBGameDataProxy = exports.MBGameData = undefined;
var $10ProxyBase = require("ProxyBase");
var $10DataManager = require("DataManager");
var exp_MBGameData = function () {
  this.failCount = 0;
  this.weaponRefreshCDData = {};
  this.btnStartTime = 0;
};
exports.MBGameData = exp_MBGameData;
var exp_MBGameDataProxy = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "failCount", {
    get: function () {
      return this._data.failCount;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "btnStartTime", {
    get: function () {
      return this._data.btnStartTime;
    },
    set: function (t) {
      this._data.btnStartTime = t;
      this.saveData();
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.enterGame = function () {
    for (var t in this._data.weaponRefreshCDData) {
      --this._data.weaponRefreshCDData[t];
      this._data.weaponRefreshCDData[t] <= 0 && delete this._data.weaponRefreshCDData[t];
    }
    this.saveData();
  };
  _ctor.prototype.isEquipCd = function (t) {
    return this._data.weaponRefreshCDData[t] && this._data.weaponRefreshCDData[t] > 0;
  };
  _ctor.prototype.getEquipCD = function (t) {
    return this._data.weaponRefreshCDData[t] || 0;
  };
  _ctor.prototype.enterCD = function (t, e) {
    this._data.weaponRefreshCDData[t] = e;
    this.saveData();
  };
  _ctor.prototype.saveData = function () {
    $10DataManager.DataManager.instance.writeGameDataBase($10ProxyBase.ProxyKey.MBData, this._data);
  };
  _ctor.prototype.fail = function () {
    this._data.failCount++;
    this._data.btnStartTime = new Date().getTime();
    this.saveData();
  };
  _ctor.prototype.win = function () {
    this._data.failCount = 0;
    this._data.btnStartTime = new Date().getTime();
    this.saveData();
  };
  return _ctor;
}($10ProxyBase.ProxyBase);
exports.MBGameDataProxy = exp_MBGameDataProxy;
exports.mbGameDataProxy = new exp_MBGameDataProxy(exp_MBGameData);