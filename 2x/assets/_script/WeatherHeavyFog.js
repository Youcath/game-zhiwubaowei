var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BattleDataProxy = require("BattleDataProxy");
var $10HeavyFogEffect = require("HeavyFogEffect");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_WeatherHeavyFog = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mHeavyFogEffectPb = null;
    e.mCheckTopHeavyFogs = [];
    e.mCheckDownHeavyFogs = [];
    e._heavyFogPos = [{
      imageId: 1,
      pos: cc.v3(270, 530),
      scale: 1
    }, {
      imageId: 1,
      pos: cc.v3(94, 588),
      scale: 1
    }, {
      imageId: 1,
      pos: cc.v3(-353, 458),
      scale: 1
    }, {
      imageId: 1,
      pos: cc.v3(-186, 323),
      scale: 1.5
    }, {
      imageId: 2,
      pos: cc.v3(-232, 171),
      scale: 1
    }, {
      imageId: 1,
      pos: cc.v3(-340, 66),
      scale: 1
    }, {
      imageId: 1,
      pos: cc.v3(-205, -128),
      scale: 1
    }, {
      imageId: 1,
      pos: cc.v3(-400, -243),
      scale: 1.6
    }, {
      imageId: 1,
      pos: cc.v3(-290, -462),
      scale: 1
    }, {
      imageId: 1,
      pos: cc.v3(-140, -548),
      scale: 1
    }, {
      imageId: 2,
      pos: cc.v3(4, -462),
      scale: 1
    }, {
      imageId: 1,
      pos: cc.v3(118, -580),
      scale: 1
    }, {
      imageId: 1,
      pos: cc.v3(253, -246),
      scale: 1.3
    }, {
      imageId: 1,
      pos: cc.v3(413, 40),
      scale: 1.5
    }, {
      imageId: 1,
      pos: cc.v3(346, 214),
      scale: 1.5
    }, {
      imageId: 2,
      pos: cc.v3(-148, 545),
      scale: 1.5
    }];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    $10BattleDataProxy.battleDataProxy.weatherHeavyFog = this.node;
    var t = this._heavyFogPos.length;
    for (var e = 0; e < t; ++e) {
      var o = this._heavyFogPos[e];
      var i = cc.instantiate(this.mHeavyFogEffectPb);
      this.node.addChild(i);
      i.getComponent($10HeavyFogEffect.default).initHeavyFogEffect(o, e);
      if (10 != e && 12 != e && 13 != e && 14 != e) {
        if (e <= 5 || 15 == e) {
          this.mCheckTopHeavyFogs.push(i);
        } else {
          this.mCheckDownHeavyFogs.push(i);
        }
      }
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mHeavyFogEffectPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_WeatherHeavyFog;