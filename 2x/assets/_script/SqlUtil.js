var cc__awaiter = __awaiter;
var cc__generator = __generator;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SqlUtil = undefined;
var $10Logger = require("Logger");
var $10Md5 = require("Md5");
var $10StringUtil = require("StringUtil");
var $10TypeUtil = require("TypeUtil");
var $10WorkerManager = require("WorkerManager");
var exp_SqlUtil = function () {
  function _ctor() {}
  Object.defineProperty(_ctor, "key", {
    get: function () {
      null == this._key && (this._key = $10Md5.md5(yzll.gameConfig.name));
      return this._key;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor, "iv", {
    get: function () {
      null == this._iv && (this._iv = $10Md5.md5(yzll.gameConfig.gid));
      return this._iv;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.init = function (t) {
    this._userId = t;
  };
  _ctor.setUserData = function (t, e) {
    if (!$10StringUtil.StringUtil.isEmpty(this._userId)) {
      this.addUserKey(t);
      this.set(this._userId + t, e);
    }
  };
  _ctor.getUserData = function (t, e) {
    if (!$10StringUtil.StringUtil.isEmpty(this._userId)) {
      return this.get(this._userId + t, e);
    }
  };
  _ctor.removeUserData = function (t) {
    $10StringUtil.StringUtil.isAnyEmpty(this._userId) || this.remove(this._userId + t);
  };
  _ctor.clearUserData = function () {
    if (!$10StringUtil.StringUtil.isEmpty(this._userId)) {
      this._userKeys || (this._userKeys = this.get("user_save_keys", []));
      for (var t = 0; t < this._userKeys.length; t++) {
        this.remove(this._userId + this._userKeys[t]);
      }
    }
  };
  _ctor.set = function (t, e) {
    return cc__awaiter(this, undefined, undefined, function () {
      var o;
      var i;
      var u = this;
      return cc__generator(this, function (n) {
        switch (n.label) {
          case 0:
            if ($10StringUtil.StringUtil.isEmpty(t)) {
              $10Logger.Logger.error("存储的key不能为空");
              return [2];
            }
            if (-1 !== this._tempKeys.indexOf(t)) {
              this._tempData[t] = e;
              return [2];
            }
            if (null == e) {
              $10Logger.Logger.debug("存储的值为空，则直接移除该存储");
              this.remove(t);
              return [2];
            }
            if ($10TypeUtil.TypeUtil.isFunction(e)) {
              $10Logger.Logger.error("储存的值不能为方法");
              return [2];
            }
            this._tempKeys.push(t);
            o = yzll.gameConfig.name + t;
            o = $10Md5.md5(o);
            e = JSON.stringify({
              yzllVal: e
            });
            n.label = 1;
          case 1:
            n.trys.push([1, 4,, 5]);
            if ($10WorkerManager.WorkerManager.instance.isSupport) {
              return [4, $10WorkerManager.WorkerManager.instance.postMessage({
                type: "ZS_AES_ENCRYPT",
                key: this.key,
                iv: this.iv,
                value: e
              })];
            } else {
              return [3, 3];
            }
          case 2:
            e = n.sent();
            return [3, 3];
          case 3:
            return [3, 5];
          case 4:
            n.sent();
            e = null;
            return [3, 5];
          case 5:
            i = {
              key: o,
              data: e,
              success: null,
              complete: function () {
                var e = u._tempKeys.indexOf(t);
                -1 !== e && u._tempKeys.splice(e, 1);
                if (u._tempData.hasOwnProperty(t) || -1 === e) {
                  var o = u._tempData[t] || null;
                  delete u._tempData[t];
                  u.set(t, o);
                }
              }
            };
            setTimeout(function () {
              var t;
              var e;
              cc.sys.localStorage.setItem(i.key, i.data);
              null === (t = null == i ? undefined : i.success) || undefined === t || t.call(i);
              null === (e = null == i ? undefined : i.complete) || undefined === e || e.call(i);
            }, 1);
            return [2];
        }
      });
    });
  };
  _ctor.get = function (t, e) {
    if (null != t) {
      t = yzll.gameConfig.name + t;
      t = $10Md5.md5(t);
      var o = this.getString(t);
      $10StringUtil.StringUtil.isEmpty(o);
      if (o && -1 !== o.indexOf("yzllVal")) {
        return JSON.parse(o).yzllVal;
      }
      if (null == e) {
        return o;
      }
      if (null === o) {
        return e;
      }
      if ($10TypeUtil.TypeUtil.isString(e)) {
        return o;
      }
      if ($10TypeUtil.TypeUtil.isNumber(e)) {
        return Number(o);
      }
      if ($10TypeUtil.TypeUtil.isBoolean(e)) {
        return "true" == o;
      }
      if ($10TypeUtil.TypeUtil.isObject(e)) {
        try {
          return JSON.parse(o);
        } catch (i) {
          $10Logger.Logger.error("解析数据失败,str=" + o);
          return e;
        }
      }
      return o;
    }
    $10Logger.Logger.error("存储的key不能为空");
  };
  _ctor.remove = function (t) {
    if (null != t) {
      delete this._tempData[t];
      var e = this._tempKeys.indexOf(t);
      -1 !== e && this._tempKeys.splice(e, 1);
      t = yzll.gameConfig.name + t;
      t = $10Md5.md5(t);
      cc.sys.localStorage.removeItem(t);
    } else {
      $10Logger.Logger.error("存储的key不能为空");
    }
  };
  _ctor.clear = function () {
    for (var t in this._tempData) {
      delete this._tempData[t];
    }
    this._tempKeys.length = 0;
    cc.sys.localStorage.clear();
  };
  _ctor.getString = function (t) {
    var e = cc.sys.localStorage.getItem(t);
    if ($10StringUtil.StringUtil.isEmpty(e)) {
      return null;
    } else {
      return e;
    }
  };
  _ctor.addUserKey = function (t) {
    this._userKeys || (this._userKeys = this.get("user_save_keys", []));
    if (-1 == this._userKeys.indexOf(t)) {
      this._userKeys.push(t);
      this.set("user_save_keys", this._userKeys);
    }
  };
  _ctor.setLocalUserData = function (t, e) {
    cc.sys.localStorage.setItem(t, e);
  };
  _ctor.getLocalUserData = function (t, e) {
    return cc.sys.localStorage.getItem(t) || e;
  };
  _ctor._key = null;
  _ctor._iv = null;
  _ctor._userId = null;
  _ctor._userKeys = null;
  _ctor._tempKeys = [];
  _ctor._tempData = {};
  return _ctor;
}();
exports.SqlUtil = exp_SqlUtil;