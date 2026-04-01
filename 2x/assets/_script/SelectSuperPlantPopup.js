var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10PopupBase = require("PopupBase");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_SelectSuperPlantPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mItemLayout = null;
    e._superPlantIds = [];
    e._courseItem = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    var t = $10BattleDataProxy.battleDataProxy.superFrameDatas;
    var e = this.mItemLayout.getChildByName("items1");
    var o = this.mItemLayout.getChildByName("items2");
    o.active = t.length > 2;
    var i = function (i) {
      var a = t[i];
      var r = null;
      (r = i >= 2 ? o.children[i - 2] : e.children[i]).active = true;
      var c = r.getChildByName("plantIcon");
      var p = r.getChildByName("plantName");
      var d = $10DataManager.DataManager.instance.eData.dataplant[a.plantId];
      p.getComponent(cc.Label).string = "超级" + d.name;
      c.getComponent(cc.Sprite).spriteFrame = a.frame;
      var m = r.getChildByName("btnSelect");
      $10Util.default.addButtonListener(m, "SelectSuperPlantPopup", "onBtnSelect", n.node, a.plantId);
      var f = r.getChildByName("normalBg").getChildByName("normalIcon");
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/botanyIcon/BotanyIcon",
        type: cc.SpriteAtlas,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        f.getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("pic_plant" + a.plantId);
      }).catch(function (t) {
        console.log("error:", t);
      });
    };
    var n = this;
    for (var a = 0; a < t.length; ++a) {
      i(a);
    }
  };
  _ctor.prototype.onShow = function () {};
  _ctor.prototype.onBtnSelect = function (t, e) {
    $10BattleDataProxy.battleDataProxy.battleData.superPlantId = e;
    $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.SELECT_SUPER_PLANT);
    this.removeUI();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mItemLayout", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_SelectSuperPlantPopup;