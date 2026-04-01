var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GTMonster = require("GTMonster");
var $10GTSpAnimCtrl = require("GTSpAnimCtrl");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GTBoss = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.spAnimCtrl = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.playMoveAnim = function () {
    this.spAnimCtrl.playAnim("move", 1, true);
  };
  _ctor.prototype.playAtkAnim = function (t) {
    this.spAnimCtrl.playAnim("atk", 1, false, function () {
      t && t();
    });
  };
  _ctor.prototype.playIdleAnim = function () {
    this.spAnimCtrl.playAnim("move", 1, true);
  };
  _ctor.prototype.playDeadAnim = function (t) {
    this.spAnimCtrl.playAnim("die", 1, false, function () {
      t && t();
    });
  };
  _ctor.prototype.setAnimScaleX = function (t) {
    var e = Math.abs(this.spAnimCtrl.node.scale);
    this.spAnimCtrl.node.scaleX = t ? e : -e;
  };
  _ctor.prototype.hit = function () {
    var t = this;
    this.spAnimCtrl.node.color = cc.Color.RED;
    this.scheduleOnce(function () {
      t.spAnimCtrl.node.color = cc.Color.WHITE;
    }, .2);
  };
  cc__decorate([ccp_property($10GTSpAnimCtrl.default)], _ctor.prototype, "spAnimCtrl", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10GTMonster.default);
exports.default = def_GTBoss;