Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResUtil = undefined;
var $10Logger = require("Logger");
var $10StringUtil = require("StringUtil");
var exp_ResUtil = function () {
  function _ctor() {}
  _ctor.loadRemote = function (t) {
    var e = this;
    null == t.option && (t.option = {});
    var o = t.url;
    var i = t.option;
    var n = t.success;
    var a = t.fail;
    var r = t.complete;
    if (!n) {
      return new Promise(function (t, n) {
        e._loadRemote(o, i, t, n);
      });
    }
    this._loadRemote(o, i, n, a, r);
  };
  _ctor._loadRemote = function (t, e, o, i, n) {
    cc.assetManager.loadRemote(t, e, function (t, e) {
      if (t) {
        i && i({
          errCode: -1,
          errMsg: t.message
        });
      } else {
        o && o(e);
      }
      n && n();
    });
  };
  _ctor.loadAssetAny = function (t) {
    var e = [];
    for (var o = 0; o < t.requests.length; o++) {
      e.push(this.loadAsset(t.requests[o]));
    }
    return Promise.all(e);
  };
  _ctor.preload = function (t) {
    this.loadBundle({
      bundle: t.bundle,
      bundleName: t.bundleName
    }).then(function (e) {
      e.preload(t.paths, t.type);
    }).catch(function () {});
  };
  _ctor.loadAssetSync = function (t, e, o) {
    var i;
    if (i = $10StringUtil.StringUtil.isEmpty(o) ? cc.resources : cc.assetManager.getBundle(o)) {
      return i.get(t, e);
    } else {
      return null;
    }
  };
  _ctor.loadAsset = function (t) {
    var e = this;
    if (!t.success) {
      return new Promise(function (o, i) {
        e._loadAsset(t.path, t.type, t.bundle, t.bundleName, o, i);
      });
    }
    this._loadAsset(t.path, t.type, t.bundle, t.bundleName, t.success, t.fail, t.complete);
  };
  _ctor._loadAsset = function (t, e, o, n, a, r, s) {
    this.loadBundle({
      bundle: o,
      bundleName: n,
      success: function (o) {
        var n = o.get(t, e);
        if (null != n) {
          a && a(n);
          return void (s && s());
        }
        o.load(t, e, function (t, e) {
          if (t) {
            $10Logger.Logger.error(t);
            null == r || r({
              errCode: -1,
              errMsg: t.message
            });
            return void (null == s || s());
          }
          a && a(e);
          s && s();
        });
      },
      fail: function (t) {
        $10Logger.Logger.error(t);
        r && r(t);
        s && s();
      }
    });
  };
  _ctor.loadBundle = function (t) {
    var e = this;
    if (!t.success) {
      return new Promise(function (o, i) {
        e._loadBundle(t.bundle, t.bundleName, o, i);
      });
    }
    this._loadBundle(t.bundle, t.bundleName, t.success, t.fail, t.complete);
  };
  _ctor._loadBundle = function (t, e, o, i, a) {
    t || (t = $10StringUtil.StringUtil.isEmpty(e) ? cc.resources : cc.assetManager.getBundle(e));
    if (t) {
      o && o(t);
      return void (a && a());
    }
    cc.assetManager.loadBundle(e, function (t, e) {
      if (t) {
        i && i({
          errCode: -1,
          errMsg: t.message
        });
        return void (a && a());
      }
      o && o(e);
      a && a();
    });
  };
  _ctor.preloadDir = function (t) {
    this.loadBundle({
      bundle: t.bundle,
      bundleName: t.bundleName
    }).then(function (e) {
      e.preloadDir(t.dir);
    });
  };
  _ctor.loadDir = function (t) {
    var e = this;
    if (!t.success) {
      return new Promise(function (o, i) {
        e._loadDir(t.dir, t.bundle, t.bundleName, o, i);
      });
    }
    this._loadDir(t.dir, t.bundle, t.bundleName, t.success, t.fail, t.complete);
  };
  _ctor._loadDir = function (t, e, o, i, n, a) {
    this.loadBundle({
      bundle: e,
      bundleName: o,
      success: function (e) {
        e.loadDir(t, function (t, e) {
          if (t) {
            n && n({
              errCode: -1,
              errMsg: t.message
            });
            return void (a && a());
          }
          i && i(e);
          a && a();
        });
      },
      fail: function (t) {
        n && n(t);
        a && a();
      }
    });
  };
  _ctor.loadAssetAnySequence = function (t) {
    var e = [];
    for (var o = 0; o < t.requests.length; o++) {
      e.push(this.loadAsset(t.requests[o]));
    }
    var i = [];
    var n = 0;
    return new Promise(function (o) {
      if (t.requests.length <= 0) {
        return o(i);
      }
      var a = function () {
        e[n].then(function (r) {
          i.push({
            asset: r,
            option: t.requests[n]
          });
          if (++n === e.length) {
            return o(i);
          }
          a();
        });
      };
      a();
    });
  };
  _ctor.setSpritFrame = function (t, e, o, i) {
    this.loadAsset({
      bundleName: e,
      path: o,
      type: cc.SpriteFrame
    }).then(function (e) {
      t.spriteFrame = e;
      i && i();
    }).catch(function (t) {
      console.error(t);
    });
  };
  return _ctor;
}();
exports.ResUtil = exp_ResUtil;