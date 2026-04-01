var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HybridPitItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._itemIdx = 0;
    e._homeHybridView = null;
    e._plantId = 0;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "itemIdx", {
    get: function () {
      return this._itemIdx;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "plantId", {
    get: function () {
      return this._plantId;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "homeHybridView", {
    set: function (t) {
      this._homeHybridView = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.initHybridPitItem = function (t, e) {
    this._itemIdx = t;
    this._plantId = e;
    var o = this.node.getChildByName("on");
    var i = this.node.getChildByName("plantImg");
    var n = this.node.getChildByName("mask");
    var a = this.node.getChildByName("plantName");
    var u = this.node.getChildByName("plantedTips");
    var p = this.node.getChildByName("BtnRemove");
    if ($10UserDataProxy.userDataProxy.userData.hybridData.time > 0 || e) {
      u.active = false;
      e || (e = $10UserDataProxy.userDataProxy.userData.hybridData["plant" + (t + 1)]);
      var h = $10DataManager.DataManager.instance.eData.dataplant[e];
      if (!h) {
        return;
      }
      a.getComponent(cc.Label).string = h.name;
      n.active = true;
      o.active = false;
      a.active = true;
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/botanyIcon/BotanyIcon",
        type: cc.SpriteAtlas,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        i.active = true;
        i.getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("pic_plant" + h.id);
      }).catch(function (t) {
        console.log("error:", t);
      });
      p.active = $10UserDataProxy.userDataProxy.userData.hybridData.time <= 0;
    } else {
      u.active = true;
      a.active = false;
      n.active = false;
      i.active = false;
      p.active = false;
      o.active = true;
      cc.Tween.stopAllByTarget(u);
      u.y = 135;
      var d = cc.tween(u).by(.3, {
        position: cc.v3(0, 20)
      }).by(.3, {
        position: cc.v3(0, -20)
      });
      cc.tween(u).repeatForever(d).start();
    }
  };
  _ctor.prototype.onBtnRemove = function () {
    this._homeHybridView.removePitPlant(this._itemIdx, this._plantId);
    this.initHybridPitItem(this._itemIdx, null);
  };
  _ctor.prototype.hideRemoveBtn = function () {
    this.node.getChildByName("BtnRemove").active = false;
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_HybridPitItem;