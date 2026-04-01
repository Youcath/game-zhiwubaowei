var i;
var cc__extends = __extends;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.otherDataProxy = exports.OtherData = exports.ConditionKey = exports.EOtherDataEvent = undefined;
var $10ProxyBase = require("ProxyBase");
var $10DataManager = require("DataManager");
(function (t) {
  t.OLINE_UPDATE = "EOtherDataEvent.OlineUpdate";
  t.TASK_UPDATE = "EOtherDataEvent.TaskUpdate";
  t.CUMULATIVE_REWARD_UPDATE = "EOtherDataEvent.CumulativeRewardUpdate";
  t.SIGN_UPDATE = "EOtherDataEvent.SignUpdate";
})(exports.EOtherDataEvent || (exports.EOtherDataEvent = {}));
(function (t) {
  t[t.MUTOU = 1] = "MUTOU";
  t[t.TIANFU = 2] = "TIANFU";
  t[t.SLAY = 3] = "SLAY";
  t[t.BUILD = 4] = "BUILD";
  t[t.LOOKAD = 5] = "LOOKAD";
  t[t.DRAWWW = 6] = "DRAWWW";
  t[t.UPGRADE = 7] = "UPGRADE";
  t[t.BATTLE = 8] = "BATTLE";
  t[t.RESETSKILL = 9] = "RESETSKILL";
})(exports.ConditionKey || (exports.ConditionKey = {}));
var exp_OtherData = function () {
  this.onlineData = [];
  this.taskData = [];
  this.condition = {};
  this.starNum = 0;
  this.cumulativeRewardData = {
    onlineSecond: 0
  };
  this.signData = {
    signDay: 0,
    signTime: 0,
    isTodaySign: false
  };
};
exports.OtherData = exp_OtherData;
var def_OtherDataProxy = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "otherData", {
    get: function () {
      return this._data;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.addCondition = function (t, e) {
    undefined === e && (e = 1);
    this.otherData.condition[t] += e;
    this.saveData();
  };
  _ctor.prototype.saveData = function () {
    $10DataManager.DataManager.instance.writeGameDataBase($10ProxyBase.ProxyKey.OtherData, this.otherData);
  };
  _ctor.prototype.resetData = function () {
    this._data = new exp_OtherData();
    $10DataManager.DataManager.instance.saveGame();
  };
  return _ctor;
}($10ProxyBase.ProxyBase);
exports.default = def_OtherDataProxy;
exports.otherDataProxy = new def_OtherDataProxy(exp_OtherData);