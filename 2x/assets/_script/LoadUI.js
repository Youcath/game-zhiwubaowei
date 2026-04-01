var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__awaiter = __awaiter;
var cc__generator = __generator;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadUI = undefined;
var $10LoadUIBase = require("LoadUIBase");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10GameGlobal = require("GameGlobal");
cc.dynamicAtlasManager.maxFrameSize = 512;
cc.macro.CLEANUP_IMAGE_CACHE = false;
cc.dynamicAtlasManager.enabled = true;
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var exp_LoadUI = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
    $10GameGlobal.GGC && $10GameGlobal.GGC.registerEvents();
    this.bundles.push($10HomeEnum.Bundles.RES, $10HomeEnum.Bundles.RES_JSON, $10HomeEnum.Bundles.GAME);
  };
  _ctor.prototype.loginComplete = function () {};
  _ctor.prototype.gameConfigRes = function () {
    return new Promise(function (t) {
      $10DataManager.DataManager.instance.initConfig(t);
    });
  };
  _ctor.prototype.userDataRes = function (t) {
    return cc__awaiter(this, undefined, undefined, function () {
      var e = this;
      return cc__generator(this, function () {
        $10DataManager.DataManager.instance.init();
        return [2, new Promise(function (o) {
          return cc__awaiter(e, undefined, undefined, function () {
            return cc__generator(this, function () {
              $10DataManager.DataManager.instance.initGameDataBase(t);
              o();
              return [2];
            });
          });
        })];
      });
    });
  };
  _ctor.prototype.loadComplete = function () {};
  _ctor.prototype.update = function (e) {
    t.prototype.update.call(this, e);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10LoadUIBase.LoadUIBase);
exports.LoadUI = exp_LoadUI;