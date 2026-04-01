var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10List = require("List");
var $10ResUtil = require("ResUtil");
var $10PopupBase = require("PopupBase");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_SuperPlantMapPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mMyList = null;
    e._plantDatas = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    var t = $10DataManager.DataManager.instance.eData.dataplant;
    for (var e in t) {
      var o = t[e];
      this._plantDatas.push(o);
    }
  };
  _ctor.prototype.onShow = function () {
    this.mMyList.numItems = this._plantDatas.length;
  };
  _ctor.prototype.onUpdateItem = function (t, e) {
    var o = this._plantDatas[e];
    var i = this.getSuperPlantIsUnlock(o.id);
    var n = t.getChildByName("bg2");
    var a = t.getChildByName("bg1");
    var r = t.getChildByName("plantImg");
    var c = t.getChildByName("plantName");
    a.active = !i;
    n.active = i;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/superBigImg/pic_CWplant" + o.id,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      r.getComponent(cc.Sprite).spriteFrame = t;
    }).catch(function (t) {
      console.log("error:", t);
    });
    c.getComponent(cc.Label).string = i ? o.name : "未解锁";
    c.color = i ? cc.color("#FFEC4A") : cc.color(125, 125, 125);
    c.getComponent(cc.LabelOutline).color = i ? cc.color("#4D2A1E") : cc.color(75, 75, 75);
    if (i) {
      $10Util.default.setSpriteNormalMaterial(r.getComponent(cc.Sprite));
    } else {
      $10Util.default.setSpriteGrayMaterial(r.getComponent(cc.Sprite));
    }
  };
  _ctor.prototype.getSuperPlantIsUnlock = function (t) {
    return ($10UserDataProxy.userDataProxy.getPlantData(t).lv || 0) >= this.getSuperUnlockLevel(t);
  };
  _ctor.prototype.getSuperUnlockLevel = function (t) {
    var e = $10DataManager.DataManager.instance.eData.dataplant[t].skillId.split("|").map(Number);
    for (var o = 0; o < e.length; ++o) {
      if (e[o] % 1e4 == 5) {
        return o + 1;
      }
    }
    return 5;
  };
  cc__decorate([ccp_property($10List.default)], _ctor.prototype, "mMyList", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_SuperPlantMapPopup;