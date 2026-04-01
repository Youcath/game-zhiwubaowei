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
var $10Util = require("Util");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HybridPlantItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._plantData = null;
    e._isUnlock = false;
    e._selectPlantIds = [];
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "plantData", {
    get: function () {
      return this._plantData;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isUnlock", {
    get: function () {
      return this._isUnlock;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.setHybridPlantData = function (t, e, o) {
    this._plantData = t;
    this._isUnlock = e;
    this._selectPlantIds = o;
    var i = this.node.getChildByName("gradeBg");
    var n = this.node.getChildByName("plantIcon");
    var a = this.node.getChildByName("plantName");
    var l = this.node.getChildByName("selectMask");
    var p = this.node.getChildByName("lock");
    l.active = this.getIsSelect();
    p.active = !e;
    a.getComponent(cc.Label).string = t.name;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/public/pic_zhiwukuang_" + t.qulity,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      i.getComponent(cc.Sprite).spriteFrame = t;
    }).catch(function (t) {
      console.log("error:", t);
    });
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/botanyIcon/BotanyIcon",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      n.getComponent(cc.Sprite).spriteFrame = e.getSpriteFrame("pic_plant" + t.id);
    }).catch(function (t) {
      console.log("error:", t);
    });
    var h = p.getChildByName("unlockTips");
    var d = Number($10DataManager.DataManager.instance.eData.datapara[73].num);
    h.getComponent(cc.Label).string = "等级" + d + "解锁";
    h.scale = .85;
    h.y = -60;
    if (e) {
      $10Util.default.setSpriteNormalMaterial(i.getComponent(cc.Sprite));
      $10Util.default.setSpriteNormalMaterial(n.getComponent(cc.Sprite));
      a.color = cc.color(255, 255, 255);
    } else {
      $10Util.default.setSpriteGrayMaterial(i.getComponent(cc.Sprite));
      $10Util.default.setSpriteGrayMaterial(n.getComponent(cc.Sprite));
      a.color = cc.color(75, 75, 75);
    }
  };
  _ctor.prototype.setSelectIsShow = function (t) {
    this.node.getChildByName("selectMask").active = t;
  };
  _ctor.prototype.getIsCanSelect = function () {
    return !this.node.getChildByName("selectMask").active;
  };
  _ctor.prototype.getIsSelect = function () {
    return $10UserDataProxy.userDataProxy.userData.hybridData.plant1 == this._plantData.id || $10UserDataProxy.userDataProxy.userData.hybridData.plant2 == this._plantData.id || this._selectPlantIds[0] == this._plantData.id || this._selectPlantIds[1] == this._plantData.id;
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_HybridPlantItem;