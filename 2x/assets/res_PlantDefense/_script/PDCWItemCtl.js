var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10CommonUtil = require("CommonUtil");
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDCWItemCtl = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.iconSp = null;
    e.proLabel = null;
    e._plantData = null;
    e._isChaoWu = false;
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
  _ctor.prototype.updatePlant = function () {
    var t;
    var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.idPlants[this._plantData.id];
    if (e <= 0) {
      this.node && this.node.isValid && this.node.destroy();
    } else {
      this.proLabel.string = e + "/" + this._plantData.super;
      if (e >= this._plantData.super) {
        this._isChaoWu || (this._isChaoWu = true, (t = $10PlantDefenseDataProxy.plantDefenseDataProxy.superPlantIds.indexOf(this._plantData.id)) < 0 && $10PlantDefenseDataProxy.plantDefenseDataProxy.superPlantIds.push(this._plantData.id), this.udpateView(), this.playChaoWuEffect(), $10EventManager.EventManager.instance.emit($10PlantDefenseDataProxy.PDDataEvent.SWITCH_SUPER_WEAPON, this._plantData.id, true));
      } else {
        this._isChaoWu && (this._isChaoWu = false, (t = $10PlantDefenseDataProxy.plantDefenseDataProxy.superPlantIds.indexOf(this._plantData.id)) > -1 && $10PlantDefenseDataProxy.plantDefenseDataProxy.superPlantIds.splice(t, 1), this.udpateView(), $10EventManager.EventManager.instance.emit($10PlantDefenseDataProxy.PDDataEvent.SWITCH_SUPER_WEAPON, this._plantData.id, false));
      }
    }
  };
  _ctor.prototype.init = function (t) {
    this._plantData = t;
    this.udpateView();
  };
  _ctor.prototype.udpateView = function () {
    var t = this;
    var e = this._plantData.icon;
    this._isChaoWu && (e = this._plantData.icon2);
    this.node.getChildByName("pic_CWjihuo").active = this._isChaoWu;
    this.node.getChildByName("pic_CWdaiji").active = !this._isChaoWu;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/botanyIcon/BotanyIcon",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (n) {
      t.iconSp.spriteFrame = n.getSpriteFrame(e);
    }).catch(function (t) {
      console.log("error:", t);
    });
    var n = $10PlantDefenseDataProxy.plantDefenseDataProxy.idPlants[this._plantData.id];
    this.proLabel.string = n + "/" + this._plantData.super;
    this.iconSp.node.scale = this.getScale(this._plantData.id);
  };
  _ctor.prototype.getScale = function (t) {
    switch (t) {
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 11:
      case 13:
        return .6;
      default:
        return 1;
    }
  };
  _ctor.prototype.playChaoWuEffect = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.PlantDefense,
      path: "prefabs/CWjihuo",
      type: cc.Prefab
    }).then(function (e) {
      if (t.node && t.node.isValid) {
        var n = cc.instantiate(e);
        n.parent = t.node;
        n.setPosition(cc.v3(0, 0));
        var o = n.getComponent(sp.Skeleton);
        o.setCompleteListener(function () {
          n.destroy();
          n.removeFromParent();
        });
        o.setAnimation(0, "jihuo", false);
        o.setCompleteListener(null);
      }
    }).catch(function (t) {
      $10CommonUtil.CommonUtil.print(t);
    });
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "iconSp", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "proLabel", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDCWItemCtl;