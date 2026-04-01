var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__awaiter = __awaiter;
var cc__generator = __generator;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadScene = undefined;
var $10AppBase = require("AppBase");
var $10PopupManager = require("PopupManager");
var $10EngineExUtils = require("EngineExUtils");
var $10SceneBase = require("SceneBase");
var $10ResUtil = require("ResUtil");
var $10BlockInputManager = require("BlockInputManager");
var $10AudioManager = require("AudioManager");
var $10CommonUtil = require("CommonUtil");
var $10EventManager = require("EventManager");
var $10CServerItem = require("CServerItem");
var $10HomeEnum = require("HomeEnum");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var exp_LoadScene = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mLoadSpine = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    var e = this;
    cc.director.getScene().name = "Load";
    $10EventManager.EventManager.instance.clear();
    $10CServerItem.CServerItem.instance.sessionId = "";
    $10ResUtil.ResUtil.preload({
      paths: "uis/LoadUI",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.LOAD
    });
    t.prototype.onLoad.call(this);
    var o = Math.floor(1e3 * Math.random()) % 4 + 1;
    this.mLoadSpine.setSkin("skin" + o);
    this.mLoadSpine.setAnimation(0, "loading", false);
    this.mLoadSpine.setCompleteListener(function () {
      var t = Math.floor(1e3 * Math.random()) % 4 + 1;
      e.mLoadSpine.setSkin("skin" + t);
      e.mLoadSpine.setAnimation(0, "loading", false);
    });
    $10EngineExUtils.EngineExUtils.all();
    var i = new Date();
    $10CommonUtil.CommonUtil.print("nowData-----:", i.getTime());
    "Android" == cc.sys.os && this.checkDuration();
    $10AudioManager.AudioManager.instance.stopBgm();
  };
  _ctor.prototype.start = function () {
    t.prototype.start.call(this);
    $10AppBase.AppBase.init();
    $10PopupManager.PopupManager.instance.init();
    $10BlockInputManager.BlockInputManager.instance.init();
    this.showLoadUI();
  };
  _ctor.prototype.showLoadUI = function () {
    return cc__awaiter(this, undefined, undefined, function () {
      var t;
      var e;
      return cc__generator(this, function (o) {
        switch (o.label) {
          case 0:
            return [4, $10ResUtil.ResUtil.loadAsset({
              path: "uis/LoadUI",
              type: cc.Prefab,
              bundleName: $10HomeEnum.Bundles.LOAD
            })];
          case 1:
            if (t = o.sent()) {
              (e = cc.instantiate(t)).name = "LoadUI";
              e.parent = this.node;
            }
            return [2];
        }
      });
    });
  };
  _ctor.prototype.checkDuration = function () {};
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mLoadSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10SceneBase.SceneBase);
exports.LoadScene = exp_LoadScene;