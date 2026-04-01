var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10PopupManager = require("PopupManager");
var $10SceneBase = require("SceneBase");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10MBGameDataProxy = require("MBGameDataProxy");
var $10MB_AttrUI = require("MB_AttrUI");
var $10MB_BagUI = require("MB_BagUI");
var $10MB_BagView = require("MB_BagView");
var $10MB_BattleView = require("MB_BattleView");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MBScene = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.bagView = null;
    e.battleView = null;
    e.bagUI = null;
    e.attrUI = null;
    e.nGameCarema = null;
    e.isRounding = false;
    e._curStage = 0;
    e._maxStage = 0;
    return e;
  }
  var n;
  cc__extends(_ctor, t);
  n = _ctor;
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      return n._instance;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "curStage", {
    get: function () {
      return this._curStage;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "maxStage", {
    get: function () {
      return this._maxStage;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
    this.isRounding = false;
    $10MBGameDataProxy.mbGameDataProxy.enterGame();
    n._instance = this;
  };
  _ctor.prototype.start = function () {
    $10AudioManager.AudioManager.instance.playBgmPath("sounds/battleBGM", $10HomeEnum.Bundles.RES);
    this.init();
  };
  _ctor.prototype.update = function (t) {
    for (var e in $10BattleDataProxy.battleDataProxy.audioFilterInfo) {
      $10BattleDataProxy.battleDataProxy.audioFilterInfo[e].time -= t;
    }
  };
  _ctor.prototype.onDestroy = function () {
    t.prototype.onDestroy.call(this);
    n._instance = null;
    $10NodePoolManager.default.instance.clearAllPoolPrefab();
  };
  _ctor.prototype.init = function () {
    this._curStage = 1;
    var t = 0;
    for (var e in $10DataManager.DataManager.instance.eData.data_bagstage) {
      t++;
    }
    this._maxStage = t;
    this.bagView.init();
    this.battleView.init();
    this.attrUI.init();
    this.enterReady();
  };
  _ctor.prototype.enterReady = function () {
    this.bagView.onEnterReady();
    this.battleView.onEnterReady();
    this.bagUI.onEnterReady();
    this.isRounding = false;
  };
  _ctor.prototype.enterBattle = function () {
    this.isRounding = true;
    this.bagView.onEnterBattle();
    this.battleView.onEnterBattle();
    this.bagUI.onEnterBattle();
  };
  _ctor.prototype.win = function () {
    this._curStage++;
    if (this._curStage > this._maxStage) {
      $10PopupManager.PopupManager.instance.show({
        bundleName: "res_MB",
        path: "popups/MBWinPopup",
        keep: true,
        params: {}
      });
    } else {
      this.enterReady();
    }
  };
  _ctor.prototype.fail = function () {
    $10PopupManager.PopupManager.instance.show({
      bundleName: "res_MB",
      path: "popups/MBFailPopup",
      keep: true,
      params: {}
    });
  };
  _ctor._instance = null;
  cc__decorate([ccp_property($10MB_BagView.default)], _ctor.prototype, "bagView", undefined);
  cc__decorate([ccp_property($10MB_BattleView.default)], _ctor.prototype, "battleView", undefined);
  cc__decorate([ccp_property($10MB_BagUI.default)], _ctor.prototype, "bagUI", undefined);
  cc__decorate([ccp_property($10MB_AttrUI.default)], _ctor.prototype, "attrUI", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nGameCarema", undefined);
  return n = cc__decorate([ccp_ccclass], _ctor);
}($10SceneBase.SceneBase);
exports.default = def_MBScene;