Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10CsvHelper = require("CsvHelper");
var def_SensitiveUtils = function () {
  function _ctor() {}
  _ctor.loadConfigCsv = function (t) {
    var e = this;
    var o = new $10CsvHelper.default();
    o.loadCsv("csv/KeyWord", function (i) {
      for (var n = 0; n < i.length; ++n) {
        e.mKeyWordInfo.push(i[n].key);
      }
      i.length = 0;
      o = null;
      t && t();
    });
  };
  _ctor.getKeyWordInfo = function () {
    return this.mKeyWordInfo;
  };
  _ctor.getIsSensitive = function (t) {
    var e = this.mKeyWordInfo;
    for (var o = 0; o < e.length; ++o) {
      var i = e[o];
      if ("test" != i && "TEST" != i && "" != i && -1 != t.indexOf(i)) {
        return true;
      }
    }
    return false;
  };
  _ctor.mKeyWordInfo = [];
  return _ctor;
}();
exports.default = def_SensitiveUtils;