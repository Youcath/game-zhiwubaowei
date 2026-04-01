Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10RedPointPathConfig = require("RedPointPathConfig");
var $10RedPointNode = require("RedPointNode");
var def_RedPointMgr = function () {
  function _ctor() {
    this.rootNode = null;
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == _ctor._instance && (_ctor._instance = new _ctor());
      return _ctor._instance;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.initRedPointTree = function () {
    this.rootNode = new $10RedPointNode.default();
    this.rootNode.init($10RedPointPathConfig.redPointConf[$10RedPointPathConfig.ERedPointPathName.GAME].path);
    for (var t in $10RedPointPathConfig.ERedPointPathName) {
      var e = this.rootNode;
      var o = $10RedPointPathConfig.redPointConf[Number($10RedPointPathConfig.ERedPointPathName[t])].path.split(".");
      if (o[0] == $10RedPointPathConfig.redPointConf[$10RedPointPathConfig.ERedPointPathName.GAME].path) {
        var a = o.length;
        if (a > 1) {
          for (var r = 1; r < a; r++) {
            e && (e = e.addChild(o[r]));
          }
        }
      }
    }
  };
  _ctor.prototype.findLastRedPoint = function (t) {
    var e = $10RedPointPathConfig.redPointConf[t].path.split(".");
    if (1 == e.length && e[0] != $10RedPointPathConfig.redPointConf[$10RedPointPathConfig.ERedPointPathName.GAME].path) {
      console.error("error root node " + e[0]);
      return null;
    }
    var o = this.rootNode;
    var n = 1;
    for (var a = e.length; n < a; n++) {
      o && (o = o.getChild(e[n]));
      if (n == a - 1) {
        return o;
      }
    }
  };
  _ctor.prototype.registerRedPointChange = function (t, e, o) {
    var i = this.findLastRedPoint(t);
    i && i.setNumChangeFunc(e, o);
  };
  _ctor.prototype.unRegisterRedPointChange = function (t, e) {
    var o = this.findLastRedPoint(t);
    o && o.delNumChangeFunc(e);
  };
  _ctor.prototype.setRedPointNum = function (t, e) {
    var o = this.findLastRedPoint(t);
    o && o.setRedPointNum(e);
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.default = def_RedPointMgr;