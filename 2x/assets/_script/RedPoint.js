var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var r;
var $10RedPointPathConfig = require("RedPointPathConfig");
var $10RedPointMgr = require("RedPointMgr");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
(function (t) {
  t[t.BREATHE = 0] = "BREATHE";
  t[t.FLOAT = 1] = "FLOAT";
})(r || (r = {}));
var def_RedPoint = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.redPointType = $10RedPointPathConfig.ERedPointPathName.GAME;
    e.redPointAnimType = r.BREATHE;
    e._initScale = 0;
    e._initY = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    var t = this;
    t._initScale = t.node.scale;
    t._initY = t.node.y;
    t.node.active = false;
    $10RedPointMgr.default.instance.registerRedPointChange(t.redPointType, function (e) {
      t.node.active = e.redPointNum > 0;
      var o = t.node.getChildByName("Num");
      if (o && o.active) {
        o.active = true;
        o.getComponent(cc.Label).string = "" + e.redPointNum;
      }
    }, this);
  };
  _ctor.prototype.onEnable = function () {};
  _ctor.prototype.onDestroy = function () {
    $10RedPointMgr.default.instance.unRegisterRedPointChange(this.redPointType, this);
  };
  cc__decorate([ccp_property({
    type: cc.Enum($10RedPointPathConfig.ERedPointPathName)
  })], _ctor.prototype, "redPointType", undefined);
  cc__decorate([ccp_property({
    type: cc.Enum(r)
  })], _ctor.prototype, "redPointAnimType", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_RedPoint;