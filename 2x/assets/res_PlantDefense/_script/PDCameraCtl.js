var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10GameEnum = require("GameEnum");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDCameraCtl = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._originVec = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    $10EventManager.EventManager.instance.on($10GameEnum.EGameEvent.SCREEN_SHAKE, this.shake, this);
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10GameEnum.EGameEvent.SCREEN_SHAKE, this.shake, this);
  };
  _ctor.prototype.onMainEnter = function (t) {
    cc.Tween.stopAllByTarget(this.node);
    cc.tween(this.node).to(1, {
      y: 500
    }).delay(1.5).to(.5, {
      y: 0
    }).call(function () {
      t && t();
    }).start();
  };
  _ctor.prototype.shake = function (t, e, n, o, i) {
    undefined === t && (t = this.node);
    undefined === e && (e = 5);
    undefined === n && (n = .05);
    undefined === o && (o = 2);
    this._originVec || (this._originVec = t.position.clone());
    cc.Tween.stopAllByTarget(t);
    t.position = this._originVec.clone();
    cc.tween(t).by(n / 2, {
      position: cc.v3(e, 0, 0)
    }).by(n / 2, {
      position: cc.v3(-e, 0, 0)
    }).by(n / 2, {
      position: cc.v3(0, -e, 0)
    }).by(n / 2, {
      position: cc.v3(0, e, 0)
    }).by(n / 2, {
      position: cc.v3(-e, 0, 0)
    }).by(n / 2, {
      position: cc.v3(e, 0, 0)
    }).by(n / 2, {
      position: cc.v3(0, e, 0)
    }).by(n / 2, {
      position: cc.v3(0, -e, 0)
    }).union().repeat(o).call(function () {
      i && i();
    }).start();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDCameraCtl;