Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10DataManager = require("DataManager");
var def_SkillDataMgr = function () {
  function _ctor() {
    this._skillAttributeData = [];
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == this._instance && (this._instance = new _ctor());
      return this._instance;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.pushSkillInfo = function (t) {
    var e = $10DataManager.DataManager.instance.eData.dataskill[t];
    this.pushSkillAttributeData(e);
  };
  _ctor.prototype.pushSkillAttributeData = function (t) {
    var e = t.attribute.split("_").map(Number);
    this._skillAttributeData.push({
      equipId: t.equipId,
      propertyId: e[0],
      propertyNum: e[1],
      needTime: t.needTime,
      skillId: t.id
    });
  };
  _ctor.prototype.removeSkillInfo = function () {
    this._skillAttributeData.length = 0;
  };
  _ctor.prototype.getSkillProperty = function (t, e) {
    var o = 0;
    for (var i = 0; i < this._skillAttributeData.length; ++i) {
      var n = this._skillAttributeData[i];
      0 != n.equipId && n.equipId != e || n.needTime > 0 || n.propertyId == t && (o += n.propertyNum);
    }
    return o;
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.default = def_SkillDataMgr;