var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10PopupBase = require("PopupBase");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_EnemyDetailsPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mAnimCtrl = null;
    e.mRotateBg = null;
    e.mEnemyName = null;
    e.mRestrain = null;
    e.mDetails = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (e) {
    var o = this;
    t.prototype.init.call(this, e);
    var i = e.enemyId;
    var n = $10DataManager.DataManager.instance.eData.datamonster[i];
    this.mDetails.string = n.des;
    this.mEnemyName.string = n.name;
    var a = cc.tween(this.mRotateBg).by(.3, {
      angle: 60
    });
    cc.tween(this.mRotateBg).repeatForever(a).start();
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/monster/zombieSp/" + n.modeName + "_atk_0",
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      o.mAnimCtrl.spriteFrame = t;
    }).catch(function (t) {
      console.log("error:", t);
    });
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/botanyIcon/BotanyIcon",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      var e = n.fixedPlantId.split("|").map(Number);
      for (var i = 0; i < e.length; ++i) {
        var a = e[i];
        var r = cc.instantiate(o.mRestrain.children[1]);
        o.mRestrain.addChild(r);
        r.active = true;
        r.getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("pic_plant" + a);
      }
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.onDestroy = function () {
    $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.PLAYING;
  };
  _ctor.prototype.onShow = function () {
    $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.PAUSE;
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mAnimCtrl", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mRotateBg", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mEnemyName", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mRestrain", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mDetails", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_EnemyDetailsPopup;