var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameSave = undefined;
var $10GBaseData = require("GBaseData");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var exp_GameSave = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.playerID = "";
    e.playerName = "";
    e.userCode = "";
    e.lifeTime = 0;
    e.lastLoginTime = 0;
    e.gold = 0;
    e.power = 0;
    e.myItemMap = new Map();
    e.myEquipMap = new Map();
    e.myRoleMap = new Map();
    e.customData = {};
    e.autoRefreshData = {};
    return e;
  }
  cc__extends(_ctor, t);
  return cc__decorate([ccp_ccclass], _ctor);
}($10GBaseData.default);
exports.GameSave = exp_GameSave;