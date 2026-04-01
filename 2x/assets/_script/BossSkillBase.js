var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10BattleDataProxy = require("BattleDataProxy");
var $10GameUI = require("GameUI");
var $10MapGridItem = require("MapGridItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_BossSkillBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._isPauseGame = false;
    e._markNode = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {};
  _ctor.prototype.play = function () {};
  _ctor.prototype.getEmptyGrids = function () {
    var t = [];
    for (var e = 0; e < $10GameUI.ROW_MAX * $10GameUI.COL_MAX; ++e) {
      var o = Math.floor(e / $10GameUI.COL_MAX) + "-" + e % $10GameUI.COL_MAX;
      var i = $10BattleDataProxy.battleDataProxy.gridsMap.get(o);
      var n = i.getComponent($10MapGridItem.default).isBlackHole;
      var a = i.getComponent($10MapGridItem.default).belongTo;
      var r = i.getComponent($10MapGridItem.default).bValid;
      n || a || !r || t.push(i);
    }
    return t;
  };
  _ctor.prototype.bezierTo = function (t, e, o, i, n, a, s, c) {
    undefined === s && (s = "");
    undefined === c && (c = null);
    cc.Tween.stopAllByTarget(this.node);
    $10MathUtil.MathUtil.bezierTo(this.node, i, t, e, o, function (t, e) {
      c && c(t, e);
    }, s).call(function () {
      a && a();
    }).start();
  };
  _ctor.prototype.getC2 = function (t, e) {
    var o = Math.abs(t.x - e.x);
    var i = t.x > e.x ? t.x - o / 2 : t.x + o / 2;
    var n = 250 * Math.random() + 250;
    if (t.y > e.y) {
      return cc.v2(i, t.y + n);
    } else {
      return cc.v2(i, e.y + n);
    }
  };
  _ctor.prototype.removeSelf = function () {
    if (this._markNode && this._markNode.isValid) {
      this._markNode.destroy();
      this._markNode.removeFromParent();
    }
    this.node.destroy();
    this.node.removeFromParent();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BossSkillBase;