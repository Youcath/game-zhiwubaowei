var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_WeatherThunder = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mThunders = [];
    e._atkTarget = null;
    e._atkTime = 0;
    e._isCanAtk = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    var t = this;
    var e = function (e) {
      var i = o.mThunders[e];
      i.setCompleteListener(function () {
        i.node.active = false;
      });
      i.setEventListener(function (e, o) {
        var i;
        o.data.name;
        t._atkTarget && t._atkTarget.isValid && (null === (i = t._atkTarget.getComponent($10EquipmentItem.default)) || undefined === i || i.lightningStroke());
      });
      i.node.active = false;
    };
    var o = this;
    for (var i = 0; i < this.mThunders.length; ++i) {
      e(i);
    }
  };
  _ctor.prototype.setAtkTarget = function (t, e) {
    this._atkTarget = t;
    var o = $10Util.default.convertToTargetNodeSpace(t, this.mThunders[e].node);
    this.mThunders[e].node.position = o.subSelf($10BattleDataProxy.battleDataProxy.gameCamera.position);
    this.mThunders[e].node.active = true;
    this.mThunders[e].setAnimation(0, "atk", false);
  };
  _ctor.prototype.update = function (t) {
    var e;
    var o;
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING && (this._isCanAtk || (this._atkTime += t, this._atkTime >= 2 && (this._atkTime = 0, this._isCanAtk = true)), this._isCanAtk)) {
      this._isCanAtk = false;
      var i = [];
      var n = 1;
      if ($10UserDataProxy.userDataProxy.userData.curWeatherWave >= 6 && $10UserDataProxy.userDataProxy.userData.curWeatherWave <= 10) {
        n = 2;
      } else if ($10UserDataProxy.userDataProxy.userData.curWeatherWave >= 11 && $10UserDataProxy.userDataProxy.userData.curWeatherWave <= 15) {
        n = 3;
      } else {
        $10UserDataProxy.userDataProxy.userData.curWeatherWave > 15 && (n = 4);
      }
      for (var a = 0; a < (null === (o = null === (e = $10BattleDataProxy.battleDataProxy.equipRoot) || undefined === e ? undefined : e.children) || undefined === o ? undefined : o.length); ++a) {
        (m = $10BattleDataProxy.battleDataProxy.equipRoot.children[a]).getComponent($10EquipmentItem.default).isSpecialPlant || i.push(m);
      }
      if (i.length <= 0) {
        return;
      }
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/thunder", $10HomeEnum.Bundles.RES);
      for (var p = 0; p < n && !(i.length <= 0); ++p) {
        var d = Math.floor(1e3 * Math.random()) % i.length;
        var m = i[d];
        this.setAtkTarget(m, p);
        i.splice(d, 1);
      }
    }
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mThunders", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_WeatherThunder;