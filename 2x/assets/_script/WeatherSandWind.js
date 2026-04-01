var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10WeatherTornado = require("WeatherTornado");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_WeatherSandWind = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mWeatherTornadoPb = null;
    e.mWeatherTumbleweedPb = null;
    e._tornadoTime = 0;
    e._tumbleweedTime = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PAUSE) {
      this._tornadoTime += t;
      if (this._tornadoTime >= 5) {
        this._tornadoTime = 0, this.createWeatherTornado();
      }
      this._tumbleweedTime += t;
      if (this._tumbleweedTime >= 2) {
        this._tumbleweedTime = 0, this.createWeatherTumbleweed();
      }
    }
  };
  _ctor.prototype.createWeatherTornado = function () {
    var t = cc.instantiate(this.mWeatherTornadoPb);
    $10BattleDataProxy.battleDataProxy.bulletView.addChild(t);
    var e = this.randTornadoPos();
    t.position = e.nodePos;
    t.getComponent($10WeatherTornado.default).startMove(e.targetPos);
  };
  _ctor.prototype.randTornadoPos = function () {
    var t = 0;
    var e = 0;
    if (Math.floor(1e3 * Math.random()) % 2 == 0) {
      t = -$10BattleDataProxy.battleDataProxy.battleView.width / 2;
      e = Math.abs(t);
    } else {
      e = -(t = $10BattleDataProxy.battleDataProxy.battleView.width / 2);
    }
    var o = 0;
    var i = 0;
    var n = Math.floor(1e3 * Math.random()) % 2 == 0;
    var a = $10BattleDataProxy.battleDataProxy.battleView.height;
    if (n) {
      o = Math.floor(1e3 * Math.random()) % (a / 2);
      i = -Math.floor(1e3 * Math.random()) % (a / 2);
    } else {
      o = -Math.floor(1e3 * Math.random()) % (a / 2);
      i = Math.floor(1e3 * Math.random()) % (a / 2);
    }
    return {
      nodePos: cc.v3(t, o),
      targetPos: cc.v3(e, i)
    };
  };
  _ctor.prototype.createWeatherTumbleweed = function () {
    var t = cc.instantiate(this.mWeatherTumbleweedPb);
    $10BattleDataProxy.battleDataProxy.bulletView.addChild(t);
    t.position = this.randTumbleweedPos();
    t.zIndex = -t.y;
  };
  _ctor.prototype.randTumbleweedPos = function () {
    var t = Math.floor(1e4 * Math.random()) % (cc.winSize.height - 200) + 100;
    return cc.v3(0, -cc.winSize.height / 2 + t);
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mWeatherTornadoPb", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mWeatherTumbleweedPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_WeatherSandWind;