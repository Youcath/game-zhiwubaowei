var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10ComponentBase = require("ComponentBase");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10ComboEffect = require("ComboEffect");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_FrenzyBar = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBar = null;
    e.mFrenzyFire = null;
    e.mRoot = null;
    e._frenzyTime = 0;
    e._frenzyMaxTime = $10GameEnum.EGameEnum.FRENZY_TIME;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.ACTIVE_FRENZY, this.activeFrenzy, this);
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.ACTIVE_FRENZY, this.activeFrenzy, this);
    t.prototype.onDestroy.call(this);
  };
  _ctor.prototype.activeFrenzy = function () {
    this._frenzyTime = this._frenzyMaxTime;
    $10BattleDataProxy.battleDataProxy.isActiveFrenzy || $10AudioManager.AudioManager.instance.playBgmPath("sounds/frenzyBgm", $10HomeEnum.Bundles.RES);
    this.addComboEffect();
  };
  _ctor.prototype.initFrenzyBar = function () {
    this._frenzyTime = 0;
    this.mRoot.active = false;
    $10AudioManager.AudioManager.instance.playBgmPath("sounds/battleBGM", $10HomeEnum.Bundles.RES);
    $10BattleDataProxy.battleDataProxy.isActiveFrenzy = false;
  };
  _ctor.prototype.addComboEffect = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/effect/ComboEffect",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      var o = cc.instantiate(e);
      $10BattleDataProxy.battleDataProxy.mTopUI.addChild(o);
      o.x = cc.winSize.width / 2 - o.width / 2;
      o.y = t.node.y + o.height / 2;
      o.getComponent($10ComboEffect.default).play();
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      if (this._frenzyTime <= 0) {
        this.initFrenzyBar();
      } else {
        $10BattleDataProxy.battleDataProxy.isActiveFrenzy = true;
        this._frenzyTime -= t;
        this.mRoot.active = true;
        var e = this._frenzyTime / this._frenzyMaxTime;
        this.mBar.fillRange = e;
        this.mFrenzyFire.x = this.mBar.node.x - this.mBar.node.width / 2 + this.mBar.node.width * (1 - e);
      }
    }
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mBar", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mFrenzyFire", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mRoot", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComponentBase.ComponentBase);
exports.default = def_FrenzyBar;