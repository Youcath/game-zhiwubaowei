var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameScene = undefined;
var $10AudioManager = require("AudioManager");
var $10SceneBase = require("SceneBase");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10GameUI = require("GameUI");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
cc.internal.inputManager._maxTouches = 1;
var exp_GameScene = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mUICamera = null;
    e.mGameCamera = null;
    e.mGameUIPb = null;
    e._gameUI = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onDestroy = function () {
    t.prototype.onDestroy.call(this);
  };
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
    $10BattleDataProxy.battleDataProxy.gameCamera = this.mGameCamera;
    $10BattleDataProxy.battleDataProxy.enterGame();
    $10AudioManager.AudioManager.instance.playBgmPath("sounds/battleBGM", $10HomeEnum.Bundles.RES);
    cc.director.getScene().name = "Game";
  };
  _ctor.prototype.onDisable = function () {};
  _ctor.prototype.start = function () {
    this.addGameUI();
  };
  _ctor.prototype.addGameUI = function () {
    this._gameUI = cc.instantiate(this.mGameUIPb);
    this.node.addChild(this._gameUI);
    this._gameUI.getComponent($10GameUI.default).initUI();
  };
  _ctor.prototype.gameStart = function () {};
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mUICamera", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mGameCamera", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mGameUIPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10SceneBase.SceneBase);
exports.GameScene = exp_GameScene;