var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_GBaseData = function () {
  function _ctor() {}
  var e;
  e = _ctor;
  _ctor.prototype.loadfromSave = function (t) {
    for (var o in this) {
      if (null != t[o]) {
        var i = this[o];
        if (i instanceof e) {
          i.loadfromSave(t[o]);
        } else {
          this[o] = t[o];
        }
      }
    }
  };
  return e = cc__decorate([ccp_ccclass], _ctor);
}();
exports.default = def_GBaseData;