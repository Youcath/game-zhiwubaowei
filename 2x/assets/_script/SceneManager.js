Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SceneManager = undefined;
var $10YZLLLoading = require("YZLLLoading");
var $10ResUtil = require("ResUtil");
var $10StringUtil = require("StringUtil");
var exp_SceneManager = function () {
  function _ctor() {
    this._scene = null;
    this._fragment = null;
    this.loading = null;
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == this._instance && (this._instance = new _ctor());
      return this._instance;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "curScene", {
    get: function () {
      return this._scene;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "fragment", {
    get: function () {
      return this._fragment;
    },
    set: function (t) {
      this._fragment = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.runScene = function (t, e, o) {
    var i = this;
    this._scene && (this._scene = null);
    this.showLoading("玩命加载中", 255);
    if ($10StringUtil.StringUtil.isEmpty(e)) {
      this.goScene(t, o);
    } else {
      $10ResUtil.ResUtil.loadBundle({
        bundleName: e,
        success: function () {
          i.goScene(t, o);
        },
        fail: function () {
          i.hideLoading();
        }
      });
    }
  };
  _ctor.prototype.goScene = function (t, e) {
    var o = this;
    cc.director.loadScene(t, function () {
      o.hideLoading();
      e && e();
    });
  };
  _ctor.prototype.setCurScene = function (t) {
    this._scene = t;
  };
  _ctor.prototype.setLoading = function (t) {
    this.loading = t.getComponent($10YZLLLoading.default);
  };
  _ctor.prototype.showLoading = function (t, e, o, i) {
    undefined === t && (t = "加载中");
    undefined === e && (e = 120);
    undefined === o && (o = null);
    undefined === i && (i = false);
    this.loading.show(t, e, o);
  };
  _ctor.prototype.hideLoading = function (t, e) {
    undefined === t && (t = null);
    undefined === e && (e = false);
    this.loading.hide(t, e);
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.SceneManager = exp_SceneManager;