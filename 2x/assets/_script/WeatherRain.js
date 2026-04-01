var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10MapGridItem = require("MapGridItem");
var $10PuddlesWater = require("PuddlesWater");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_WeatherRain = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mPuddlesWaterPb = null;
    e._waterTime = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PAUSE) {
      this._waterTime += t;
      if (this._waterTime >= 10) {
        this._waterTime = 0, this.createPuddlesWater();
      }
    }
  };
  _ctor.prototype.createPuddlesWater = function () {
    var t = [];
    var e = ["1-1", "4-1", "7-1", "10-1", "1-4", "4-4", "7-4", "10-4"];
    var o = function (o) {
      var i = e[o];
      var n = $10BattleDataProxy.battleDataProxy.gridsMap.get(i);
      if (n) {
        if ($10BattleDataProxy.battleDataProxy.waterView.children.findIndex(function (t) {
          return t.getComponent($10PuddlesWater.default).rowCol == i;
        }) >= 0) {
          return "continue";
        } else {
          return void t.push(n);
        }
      } else {
        return "continue";
      }
    };
    for (var i = 0; i < e.length; ++i) {
      o(i);
    }
    if (t.length <= 0) {
      console.log("没格子了");
    } else {
      var n = Math.floor(1e3 * Math.random()) % t.length;
      var a = t[n];
      var r = cc.instantiate(this.mPuddlesWaterPb);
      $10BattleDataProxy.battleDataProxy.waterView.addChild(r);
      var p = $10Util.default.convertToTargetNodeSpace(a, r);
      r.position = p;
      r.getComponent($10PuddlesWater.default).rowCol = a.getComponent($10MapGridItem.default).rowCol;
      r.getComponent($10PuddlesWater.default).show();
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mPuddlesWaterPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_WeatherRain;