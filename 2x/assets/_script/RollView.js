var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10UserDataProxy = require("UserDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_RollView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._farRightBg = null;
    e._bgMoveSpeed = 4;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function () {
    2 == $10UserDataProxy.userDataProxy.userData.gameModel && this.updateMapPostion();
  };
  _ctor.prototype.onLoad = function () {
    this.initMapData();
  };
  _ctor.prototype.initMapData = function () {
    var t = this.node.children;
    this._farRightBg = t[2];
  };
  _ctor.prototype.updateMapPostion = function () {
    var t = this.node.children;
    var e = null;
    for (var o = 0; o < t.length; ++o) {
      var i = t[o];
      i.x += this._bgMoveSpeed / 2;
      i.x < -i.width && (e = i);
    }
    if (e) {
      e.x = this._farRightBg.x + e.width;
      this._farRightBg = e;
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_RollView;