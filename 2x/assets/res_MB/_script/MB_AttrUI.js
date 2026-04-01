var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10E_AttrType = require("E_AttrType");
var $10MB_AttrMgr = require("MB_AttrMgr");
var $10MBScene = require("MBScene");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MB_AttrUI = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.nTotalAttrView = null;
    e.nEquipAttrView = null;
    e._initTotalY = 0;
    e._initEquipY = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    this._initTotalY = this.nTotalAttrView.y;
    this._initEquipY = this.nEquipAttrView.y;
    this.nTotalAttrView.y = this._initEquipY - 700;
    this.nEquipAttrView.y = this._initTotalY - 700;
    this.nEquipAttrView.opacity = 0;
    this.nTotalAttrView.opacity = 0;
    this.nEquipAttrView.active = false;
    this.nTotalAttrView.active = false;
    this.node.active = false;
  };
  _ctor.prototype.showTotalAttr = function () {
    this.node.active = true;
    this.nTotalAttrView.active = true;
    var t = $10MB_AttrMgr.MB_AttrMgr.instance.getPlayerAttrMap($10MBScene.default.instance.bagView.eqiupedIds);
    var e = [$10E_AttrType.E_AttrType.ATK, $10E_AttrType.E_AttrType.DEF, $10E_AttrType.E_AttrType.HP, $10E_AttrType.E_AttrType.SPD];
    this.nTotalAttrView.getChildByName("BaseAttrView").children.forEach(function (n, i) {
      n.getChildByName("Name").getComponent(cc.Label).string = $10MB_AttrMgr.MB_AttrMgr.instance.attrNames[e[i]];
      n.getChildByName("Value").getComponent(cc.Label).string = $10MathUtil.MathUtil.formatValue(t.get(e[i]));
      t.delete(e[i]);
    });
    var n = this.nTotalAttrView.getChildByName("ExAttrView");
    for (var i = t.size - n.childrenCount; i > 0;) {
      var o = cc.instantiate(n.children[0]);
      n.addChild(o);
      i--;
    }
    var a = Array.from(t.keys());
    n.children.forEach(function (e, n) {
      e.active = a.length > n;
      if (e.active) {
        var i = a[n];
        e.getChildByName("Name").getComponent(cc.Label).string = $10MB_AttrMgr.MB_AttrMgr.instance.attrNames[i];
        e.getChildByName("Value").getComponent(cc.Label).string = $10MathUtil.MathUtil.formatNumber(t.get(i), 2) + "%";
      }
    });
    cc.tween(this.nTotalAttrView).to(.3, {
      y: this._initTotalY,
      opacity: 255
    }, {
      easing: "backOut"
    }).start();
  };
  _ctor.prototype.showEquipAttr = function (t) {
    this.node.active = true;
    this.showTotalAttr();
    this.nEquipAttrView.active = true;
    var e = $10MB_AttrMgr.MB_AttrMgr.instance.getEquipAttrMap(t);
    var n = [$10E_AttrType.E_AttrType.ATK, $10E_AttrType.E_AttrType.DEF, $10E_AttrType.E_AttrType.HP, $10E_AttrType.E_AttrType.SPD];
    this.nEquipAttrView.getChildByName("BaseAttrView").children.forEach(function (t, i) {
      t.getChildByName("Name").getComponent(cc.Label).string = $10MB_AttrMgr.MB_AttrMgr.instance.attrNames[n[i]];
      t.getChildByName("Value").getComponent(cc.Label).string = $10MathUtil.MathUtil.formatValue(e.get(n[i]));
      e.delete(n[i]);
    });
    var i = this.nEquipAttrView.getChildByName("ExAttrView");
    for (var o = e.size - i.childrenCount; o > 0;) {
      var a = cc.instantiate(i.children[0]);
      i.addChild(a);
      o--;
    }
    var p = Array.from(e.keys());
    i.children.forEach(function (t, n) {
      t.active = p.length > n;
      if (t.active) {
        var i = p[n];
        t.getChildByName("Name").getComponent(cc.Label).string = $10MB_AttrMgr.MB_AttrMgr.instance.attrNames[i];
        t.getChildByName("Value").getComponent(cc.Label).string = $10MathUtil.MathUtil.formatNumber(e.get(i), 2) + "%";
      }
    });
    cc.tween(this.nEquipAttrView).to(.3, {
      y: this._initEquipY,
      opacity: 255
    }, {
      easing: "backOut"
    }).start();
  };
  _ctor.prototype.hideView = function () {
    this.node.active = false;
    this.nTotalAttrView.y = this._initEquipY - 700;
    this.nEquipAttrView.y = this._initTotalY - 700;
    this.nEquipAttrView.opacity = 0;
    this.nTotalAttrView.opacity = 0;
    this.nEquipAttrView.active = false;
    this.nTotalAttrView.active = false;
  };
  _ctor.prototype.onClickClose = function () {
    this.hideView();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nTotalAttrView", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nEquipAttrView", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_MB_AttrUI;