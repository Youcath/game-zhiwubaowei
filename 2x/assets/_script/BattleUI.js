var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BattleUI = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mWaveLab = null;
    e.mChapterBar = null;
    e.mChapterBarBlock = null;
    return e;
  }
  cc__extends(_ctor, t);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mWaveLab", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mChapterBar", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mChapterBarBlock", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BattleUI;