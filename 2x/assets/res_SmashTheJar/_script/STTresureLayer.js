var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10DataManager = require("DataManager");
var $10STTresureItem = require("STTresureItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_STTresureLayer = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.treasureNode = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.start = function () {
    this.initView();
  };
  _ctor.prototype.initView = function () {
    var t = $10DataManager.DataManager.instance.eData.data_jartreasure;
    var e = 0;
    for (var o in t) {
      var i = this.node.children[e];
      i || ((i = cc.instantiate(this.treasureNode)).parent = this.node);
      i.getComponent($10STTresureItem.default).init(t[o]);
      e++;
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "treasureNode", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_STTresureLayer;