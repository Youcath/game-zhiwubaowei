var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10PopupBase = require("PopupBase");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_EquipmentFragmentsPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._curLevel = 1;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    this._curLevel = $10UserDataProxy.userDataProxy.userData.boxData.level;
    if (this._curLevel < 1) {
      this._curLevel = 1;
    } else {
      this._curLevel > 10 && (this._curLevel = 10);
    }
    this.initView();
  };
  _ctor.prototype.initView = function () {
    var t = $10DataManager.DataManager.instance.eData.datashopbox[this._curLevel];
    this.node.getChildByName("levelLabel").getComponent(cc.Label).string = "Lv." + this._curLevel;
    var e = t.reward.split("|");
    this.updateAwardList(e, "contant1");
    var o = t.bigReward.split("|");
    this.updateAwardList(o, "contant2");
    this.node.getChildByName("leftBtn").active = this._curLevel > 1;
    this.node.getChildByName("rightBtn").active = this._curLevel < 10;
  };
  _ctor.prototype.updateAwardList = function (t, e) {
    var o = this.node.getChildByName(e);
    o.children.forEach(function (t) {
      return t.active = false;
    });
    var i = function (e) {
      var i = t[e].split("_");
      var n = $10DataManager.DataManager.instance.eData.dataitem[i[0]];
      if (2 == i.length) {
        var a = o.children[e];
        a || ((a = cc.instantiate(o.children[0])).parent = o);
        var s = a.getChildByName("icon").getComponent(cc.Sprite);
        $10ResUtil.ResUtil.loadAsset({
          path: "textures/item/" + n.icon,
          type: cc.SpriteFrame,
          bundleName: $10HomeEnum.Bundles.GAME
        }).then(function (t) {
          s.spriteFrame = t;
        }).catch(function (t) {
          console.log("error:", t);
        });
        a.getChildByName("numLabel").getComponent(cc.Label).string = "x" + i[1];
        a.active = true;
      }
    };
    var n = 0;
    for (var a = t.length; n < a; n++) {
      i(n);
    }
  };
  _ctor.prototype.onClickLeftBtn = function () {
    this._curLevel -= 1;
    this._curLevel < 1 && (this._curLevel = 1);
    this.initView();
  };
  _ctor.prototype.onClickRightBtn = function () {
    this._curLevel += 1;
    this._curLevel > 10 && (this._curLevel = 10);
    this.initView();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_EquipmentFragmentsPopup;