var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10List = require("List");
var $10PopupBase = require("PopupBase");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_HybridStarPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mMyList = null;
    e._dataKeys = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {};
  _ctor.prototype.onShow = function () {
    var t = $10DataManager.DataManager.instance.eData.data_hybridizationstarmaster;
    this._dataKeys = Object.keys(t);
    this.mMyList.numItems = this._dataKeys.length;
  };
  _ctor.prototype.onUpdateItem = function (t, e) {
    var o = t.getChildByName("starNum");
    var i = t.getChildByName("tips");
    var n = t.getChildByName("propertyNum");
    var a = t.getChildByName("lockMask");
    var r = a.getChildByName("layout").getChildByName("starNum");
    var s = $10DataManager.DataManager.instance.eData.data_hybridizationstarmaster[this._dataKeys[e]];
    var u = s.star;
    o.getComponent(cc.Label).string = "x" + u;
    i.getComponent(cc.Label).string = "总星数达到" + u + "个";
    var p = s.att.split("_").map(Number);
    var h = $10DataManager.DataManager.instance.eData.dataatt[p[0]];
    var d = $10UserDataProxy.userDataProxy.getHybridAllStar();
    if (1 == h.showType) {
      n.getComponent(cc.Label).string = h.des + " +" + p[1];
    } else {
      n.getComponent(cc.Label).string = h.des + " +" + (100 * p[1]).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] + "%";
    }
    a.active = d < u;
    a.active && (r.getComponent(cc.Label).string = "(" + d + "/" + u + ")");
  };
  cc__decorate([ccp_property($10List.default)], _ctor.prototype, "mMyList", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_HybridStarPopup;