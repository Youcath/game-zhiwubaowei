var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_YZLLLoading = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.nBg = null;
    e.nCenterView = null;
    e.lPoint = null;
    e.lDesc = null;
    e.sSpine = null;
    e.pointStr = "";
    e.isShow = false;
    e.isLock = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.show = function (t, e, o, i) {
    var n = this;
    undefined === t && (t = "喵喵加载中");
    undefined === e && (e = 120);
    undefined === o && (o = null);
    undefined === i && (i = false);
    if (!(this.isShow || this.isLock)) {
      this.isLock = i;
      this.node.setSiblingIndex(this.node.parent.childrenCount - 1);
      this.nCenterView.active = false;
      this.nBg.opacity = 0;
      this.lDesc.string = t;
      this.pointStr = "";
      this.lPoint.string = this.pointStr;
      this.unschedule(this.pointLoad);
      cc.Tween.stopAllByTarget(this.nBg);
      this.node.active = true;
      this.isShow = true;
      cc.tween(this.nBg).to(.3, {
        opacity: e
      }).call(function () {
        n.nCenterView.active = true;
        o && o();
      }).start();
      this.schedule(this.pointLoad, .2);
    }
  };
  _ctor.prototype.hide = function (t, e) {
    var o = this;
    undefined === t && (t = null);
    undefined === e && (e = false);
    this.isShow && (this.isLock && !e || (e && (this.isLock = false), this.isShow = false, cc.Tween.stopAllByTarget(this.nBg), cc.tween(this.nBg).delay(.1).call(function () {
      o.unschedule(o.pointLoad);
      o.nCenterView.active = false;
    }).to(.1, {
      opacity: 0
    }).call(function () {
      t && t();
      o.node.active = false;
    }).start()));
  };
  _ctor.prototype.pointLoad = function () {
    if (this.pointStr.length >= 3) {
      this.pointStr = "";
    } else {
      this.pointStr += ".";
    }
    this.lPoint.string = this.pointStr;
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nBg", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nCenterView", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "lPoint", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "lDesc", undefined);
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "sSpine", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_YZLLLoading;