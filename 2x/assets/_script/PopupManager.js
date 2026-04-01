var cc__awaiter = __awaiter;
var cc__generator = __generator;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PopupManager = exports.PopupCacheMode = undefined;
var a;
var $10AppBase = require("AppBase");
var $10BlockInputManager = require("BlockInputManager");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10AppProxy = require("AppProxy");
(function (t) {
  t[t.ONCE = 0] = "ONCE";
  t[t.CACHE = 1] = "CACHE";
  t[t.CACHE_RES = 2] = "CACHE_RES";
  t[t.AWAY = 3] = "AWAY";
})(a = exports.PopupCacheMode || (exports.PopupCacheMode = {}));
var exp_PopupManager = function () {
  function _ctor() {
    this._loadingPopup = [];
    this._dealing = false;
    this._showOptions = [];
    this.popupNode = null;
    this._popups = [];
    this._prefabMap = {};
    this._nodeMap = {};
    this.popupInit = false;
    this._globalAnim = null;
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == this._instance && (this._instance = new _ctor());
      return this._instance;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "popups", {
    get: function () {
      return this._popups;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.getPopupNode = function () {
    return this.popupNode;
  };
  Object.defineProperty(_ctor.prototype, "globalAnim", {
    get: function () {
      return this._globalAnim;
    },
    set: function (t) {
      this._globalAnim = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.init = function () {
    this.setParent();
  };
  _ctor.prototype.checkDealing = function () {
    if (0 === this._showOptions.length) {
      this._dealing = false;
      $10BlockInputManager.BlockInputManager.instance.popupBlockInputNum = 0;
    } else {
      this.dealQueue(this._showOptions.shift());
    }
  };
  _ctor.prototype.dealQueue = function (t) {
    return cc__awaiter(this, undefined, undefined, function () {
      var e;
      var o;
      var i;
      var a;
      var r;
      var c;
      var u;
      return cc__generator(this, function (n) {
        switch (n.label) {
          case 0:
            if ((e = t.name) === this.getCurrentName()) {
              console.warn(e + "弹框已经显示");
              this.checkDealing();
              return [2];
            }
            this._dealing = true;
            $10BlockInputManager.BlockInputManager.instance.popupBlockInputNum = 1;
            o = t.priority || 0;
            if (null != (i = this._nodeMap[e])) {
              return [3, 7];
            }
            if (null != (a = t.prefab || this._prefabMap[e])) {
              return [3, 5];
            }
            if (null == t.path) {
              throw this.checkDealing(), new Error("首次创建必须传入prefab或者path");
            }
            this._loadingPopup.push(e);
            r = null;
            n.label = 1;
          case 1:
            n.trys.push([1, 3,, 4]);
            return [4, $10ResUtil.ResUtil.loadAsset({
              bundleName: t.bundleName,
              path: t.path,
              type: cc.Prefab
            })];
          case 2:
            r = n.sent();
            return [3, 4];
          case 3:
            c = n.sent();
            console.error(c);
            return [3, 4];
          case 4:
            if (null == r) {
              return this.checkDealing(), console.error(t.path + "加载失败"), [2];
            } else {
              return this._prefabMap[e] || (this._prefabMap[e] = r, r.addRef()), -1 === (u = this._loadingPopup.indexOf(e)) ? (console.warn(e + "已取消显示"), [2]) : (this._loadingPopup.splice(u, 1), null == e && (e = r.name), e === this.getCurrentName() ? (console.warn(e + "弹框已经显示"), this.checkDealing(), [2]) : (i = cc.instantiate(r), [3, 6]));
            }
          case 5:
            i = cc.instantiate(a);
            n.label = 6;
          case 6:
            this._nodeMap[e] = i;
            n.label = 7;
          case 7:
            this._show(e, i, o, t.params, t.keep || false, t.closePosition, t.parent);
            return [2];
        }
      });
    });
  };
  _ctor.prototype.show = function (t) {
    var e;
    if (!this.popupInit) {
      throw new Error("请先初始化PopupManager");
    }
    var o = t.name || (null === (e = t.prefab) || undefined === e ? undefined : e.name);
    if (null == o) {
      if (null == t.path) {
        throw new Error("name、prefab、path不同同时为空");
      }
      o = cc.path.basename(t.path);
    }
    t.name = o;
    if (this._dealing) {
      this._showOptions.push(t);
    } else {
      this.dealQueue(t);
    }
  };
  _ctor.prototype._show = function (t, e, o, i, n, a, r) {
    var s;
    var c = e.getComponent("PopupBase");
    if (null == c) {
      throw this.checkDealing(), new Error("请将Popup继承PopupBase");
    }
    var l = this._popups.indexOf(t);
    l >= 0 && this._popups.splice(l, 1);
    var u = (null === (s = this.getCurrentPopup()) || undefined === s ? undefined : s.zIndex) || 0;
    if (o < u) {
      e.active = false;
      for (var p = this._popups.length - 1; p >= 0; p--) {
        if (o <= (this._nodeMap[this._popups[p]].zIndex || 0)) {
          this._popups.splice(p, 0, t);
          break;
        }
      }
    } else if (n) {
      this._popups.push(t);
    } else {
      for (p = 0; p < this._popups.length; p++) {
        var h = this.getPopup(this._popups[p]);
        h && (h.active = false);
      }
      this._popups.push(t);
    }
    c._init(t, a, i);
    var d = r || this.popupNode;
    if (e.parent != d) {
      e.removeFromParent();
      e.parent = d;
    }
    if (e.zIndex != o) {
      if (o > cc.macro.MAX_ZINDEX) {
        o = cc.macro.MAX_ZINDEX;
      } else {
        o < cc.macro.MIN_ZINDEX && (o = cc.macro.MIN_ZINDEX);
      }
      e.zIndex = o;
    }
    if (o >= u) {
      this.showPopup(e);
    } else {
      this.checkDealing();
    }
  };
  _ctor.prototype.showLast = function () {
    var t = null;
    if (this._popups.length > 0) {
      var e = this._popups[this._popups.length - 1];
      t = this._nodeMap[e];
    }
    if (null != t) {
      if (t && t.isValid && !t.active) {
        t.active = true;
        var o = t.getComponent("PopupBase");
        o._isShow || o._show();
        0 === this._showOptions.length && this.checkDealing();
      } else {
        this.checkDealing();
      }
    } else {
      this.checkDealing();
    }
  };
  _ctor.prototype.showPopup = function (t) {
    var e = this;
    var o = t.getComponent("PopupBase");
    var i = 0 === this._showOptions.length;
    o._show().then(function () {
      i && e.checkDealing();
    });
    $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.POPUP_CHANGED);
    i || this.checkDealing();
  };
  _ctor.prototype.hidePopup = function (t, e, o) {
    var i = this;
    undefined === e && (e = a.ONCE);
    undefined === o && (o = true);
    var n = this._nodeMap[t];
    if (n && n.isValid) {
      e != a.AWAY && (this._nodeMap[t] = null);
      var r = this._prefabMap[t];
      e !== a.ONCE && e !== a.CACHE_RES || (this._prefabMap[t] = null);
      var s = n.getComponent("PopupBase");
      if (n.active) {
        s._hide(o).then(function () {
          o && i.removeNode(n, r, e);
        }).catch(function () {});
        o || this.removeNode(n, r, e);
      } else {
        this.removeNode(n, r, e);
      }
    } else {
      console.warn(t + "已被销毁");
    }
  };
  _ctor.prototype.removeNode = function (t, e, o) {
    if (a.AWAY !== o) {
      t.destroy();
      a.ONCE === o && e && e.decRef();
    } else {
      null != t && (t.parent = null);
    }
  };
  _ctor.prototype.remove = function (t, e, o, i) {
    undefined === e && (e = a.ONCE);
    undefined === o && (o = true);
    undefined === i && (i = true);
    var n = this._popups.indexOf(t);
    var r = n === this._popups.length - 1;
    n >= 0 && this._popups.splice(n, 1);
    this.hidePopup(t, e, o);
    if (r && i) {
      this.showLast();
      $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.POPUP_CHANGED);
    }
  };
  _ctor.prototype.removeAll = function (t, e) {
    undefined === t && (t = a.ONCE);
    undefined === e && (e = false);
    var o = this.getCurrentName();
    for (var i in this._nodeMap) {
      if (null != this._nodeMap[i] && o !== i) {
        var n = this._popups.indexOf(i);
        -1 !== n && this._popups.splice(n, 1);
        this.hidePopup(i, t, false);
      }
    }
    if (o) {
      this.remove(o, t, e);
    } else {
      $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.POPUP_CHANGED);
    }
    this.cleanAllPopup();
  };
  _ctor.prototype.showAll = function () {
    for (var t in this._nodeMap) {
      null != this._nodeMap[t] && (this._nodeMap[t].active = true);
    }
  };
  _ctor.prototype.hideAll = function () {
    for (var t in this._nodeMap) {
      null != this._nodeMap[t] && (this._nodeMap[t].active = false);
    }
  };
  _ctor.prototype.has = function (t) {
    return -1 !== this._popups.indexOf(t) || -1 !== this._loadingPopup.indexOf(t);
  };
  _ctor.prototype.hasEach = function () {
    return this._popups.length > 0;
  };
  _ctor.prototype.getCurrentPopup = function () {
    var t = this.getCurrentName();
    if (null == t) {
      return null;
    } else {
      return this._nodeMap[t];
    }
  };
  _ctor.prototype.getCurrentName = function () {
    if (this._popups.length > 0) {
      return this._popups[this._popups.length - 1];
    } else {
      return null;
    }
  };
  _ctor.prototype.getPopup = function (t) {
    return this._nodeMap[t] || null;
  };
  _ctor.prototype.cleanAllPopup = function () {
    this._loadingPopup.length = 0;
    this._popups.length = 0;
    this._showOptions.length = 0;
    this.checkDealing();
  };
  _ctor.prototype.setParent = function () {
    if (!this.popupInit) {
      this.popupNode = new cc.Node("PopupNode");
      this.popupNode.width = $10AppBase.rootNode.width;
      this.popupNode.height = $10AppBase.rootNode.height;
      $10AppBase.rootNode.addChild(this.popupNode, 1);
      this.popupInit = true;
    }
  };
  return _ctor;
}();
exports.PopupManager = exp_PopupManager;