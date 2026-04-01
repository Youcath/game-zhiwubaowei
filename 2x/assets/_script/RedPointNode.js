Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10RedPointPathConfig = require("RedPointPathConfig");
var def_RedPointNode = function () {
  function _ctor() {
    this._nodeName = "";
    this._redPointNum = 0;
    this.parent = null;
    this.dictChilds = new Map();
    this.numChangeFuncMap = new Map();
  }
  _ctor.prototype.init = function (t) {
    this._nodeName = t;
    this.numChangeFuncMap.clear();
  };
  Object.defineProperty(_ctor.prototype, "nodeName", {
    get: function () {
      return this._nodeName;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "redPointNum", {
    get: function () {
      return this._redPointNum;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.addChild = function (e) {
    if (this.dictChilds.has(e)) {
      return this.dictChilds.get(e);
    }
    var o = new _ctor();
    o._nodeName = e;
    o.parent = this;
    this.dictChilds.set(e, o);
    return o;
  };
  _ctor.prototype.getChild = function (t) {
    if (this.dictChilds.has(t)) {
      return this.dictChilds.get(t);
    } else {
      return null;
    }
  };
  _ctor.prototype.setNumChangeFunc = function (t, e) {
    this.numChangeFuncMap.set(e, t);
    t && t.call(e, this);
  };
  _ctor.prototype.delNumChangeFunc = function (t) {
    this.numChangeFuncMap.delete(t);
  };
  _ctor.prototype.setRedPointNum = function (t) {
    var e = this;
    e.dictChilds.size > 0 || e._redPointNum != t && (e._redPointNum = t, e.notyfyRedPointNumChange(), e.parent && e.parent.changeParentRedPointNum());
  };
  _ctor.prototype.changeParentRedPointNum = function () {
    var t = this;
    if (t._nodeName != $10RedPointPathConfig.redPointConf[$10RedPointPathConfig.ERedPointPathName.GAME].path) {
      var e = 0;
      t.dictChilds.forEach(function (t) {
        e += t._redPointNum;
      });
      if (e != t._redPointNum) {
        t._redPointNum = e;
        t.notyfyRedPointNumChange();
        t.parent && t.parent.changeParentRedPointNum();
      }
    }
  };
  _ctor.prototype.notyfyRedPointNumChange = function () {
    var t = this;
    t.numChangeFuncMap.forEach(function (e, o) {
      e && e.call(o, t);
    });
  };
  return _ctor;
}();
exports.default = def_RedPointNode;