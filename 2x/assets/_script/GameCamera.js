var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ComponentBase = require("ComponentBase");
var $10EventManager = require("EventManager");
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GameCamera = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mCamera = null;
    e._originVec = null;
    e._target = null;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "myCamera", {
    get: function () {
      return this.mCamera;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    $10EventManager.EventManager.instance.on($10GameEnum.EGameEvent.SCREEN_SHAKE, this.shake, this);
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10GameEnum.EGameEvent.SCREEN_SHAKE, this.shake, this);
  };
  _ctor.prototype.initGameCamera = function (t) {
    this._target = t;
  };
  _ctor.prototype.lateUpdate = function () {
    $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._target;
  };
  _ctor.prototype.onMainEnter = function (t) {
    undefined === t && (t = 1);
    cc.Tween.stopAllByTarget(this.mCamera);
    cc.tween(this.mCamera).to(.5, {
      zoomRatio: t
    }).start();
    this.node.position = cc.v3(0, 0);
  };
  _ctor.prototype.onGameStart = function (t) {
    cc.Tween.stopAllByTarget(this.mCamera);
    this.mCamera.zoomRatio = 1;
    cc.tween(this.mCamera).to(.5, {
      zoomRatio: .7
    }).call(function () {
      t && t();
    }).start();
  };
  _ctor.prototype.shake = function (t, e, o, i, n) {
    undefined === t && (t = this.mCamera.node);
    undefined === e && (e = 5);
    undefined === o && (o = .05);
    undefined === i && (i = 2);
    this._originVec || (this._originVec = t.position.clone());
    cc.Tween.stopAllByTarget(t);
    t.position = this._originVec.clone();
    cc.tween(t).by(o / 2, {
      position: cc.v3(e, 0, 0)
    }).by(o / 2, {
      position: cc.v3(-e, 0, 0)
    }).by(o / 2, {
      position: cc.v3(0, -e, 0)
    }).by(o / 2, {
      position: cc.v3(0, e, 0)
    }).by(o / 2, {
      position: cc.v3(-e, 0, 0)
    }).by(o / 2, {
      position: cc.v3(e, 0, 0)
    }).by(o / 2, {
      position: cc.v3(0, e, 0)
    }).by(o / 2, {
      position: cc.v3(0, -e, 0)
    }).union().repeat(i).call(function () {
      n && n();
    }).start();
  };
  cc__decorate([ccp_property(cc.Camera)], _ctor.prototype, "mCamera", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComponentBase.ComponentBase);
exports.default = def_GameCamera;