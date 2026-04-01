var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__awaiter = __awaiter;
var cc__generator = __generator;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PopupBase = exports.AnimType = undefined;
var c;
var $10PopupManager = require("PopupManager");
var $10EventManager = require("EventManager");
var $10AppProxy = require("AppProxy");
var $10ComponentBase = require("ComponentBase");
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
(function (t) {
  t[t.NONE = 0] = "NONE";
  t[t.SCALE = 1] = "SCALE";
  t[t.FADE = 2] = "FADE";
  t[t.CUSTOM = 3] = "CUSTOM";
  t[t.SCALE_EASING = 4] = "SCALE_EASING";
})(c = exports.AnimType || (exports.AnimType = {}));
var exp_PopupBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.transBack = true;
    e.blockInput = true;
    e.bgColor = cc.color(0, 0, 0, 200);
    e.anim = true;
    e.hideAnim = true;
    e.animType = c.SCALE;
    e.closeTime = .1;
    e._fullScreen = false;
    e.mWidgets = [];
    e._popupName = "";
    e.bannerPosition = null;
    e.nativePosition = null;
    e.align = false;
    e._bgNode = null;
    e._closePosition = null;
    e._isShow = false;
    e._showComplete = false;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "fullScreen", {
    get: function () {
      return this._fullScreen;
    },
    set: function (t) {
      this._fullScreen = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "popupName", {
    get: function () {
      return this._popupName;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    var e = this;
    t.prototype.onLoad.call(this);
    var o = cc.view.getVisibleSize();
    if (this.transBack) {
      this._bgNode = new cc.Node("BgNode");
      var i = this._bgNode.addComponent(cc.Sprite);
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/transback",
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.RES
      }).then(function (t) {
        i.spriteFrame = t;
        e._bgNode.color = new cc.Color(e.bgColor.r, e.bgColor.g, e.bgColor.b);
        e._bgNode.setContentSize(o.width, o.height);
      }).catch(function () {});
      i.type = cc.Sprite.Type.SLICED;
      i.sizeMode = cc.Sprite.SizeMode.CUSTOM;
      this.node.addChild(this._bgNode, -1);
      this._bgNode.opacity = 0;
    }
    if (this.blockInput) {
      this.node.setContentSize(o);
      this.node.addComponent(cc.BlockInputEvents);
    }
  };
  _ctor.prototype._init = function (t, e, o) {
    this._popupName = t;
    this._closePosition = e;
    this.init(o);
  };
  _ctor.prototype._show = function () {
    return cc__awaiter(this, undefined, Promise, function () {
      return cc__generator(this, function (t) {
        switch (t.label) {
          case 0:
            if (this._bgNode && this._bgNode.isValid) {
              cc.Tween.stopAllByTarget(this._bgNode);
              cc.tween(this._bgNode).to(.25, {
                opacity: this.bgColor.a
              }).start();
            }
            if (this.node && this.node.isValid) {
              return this._isShow = true, $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.POPUP_SHOW, this._popupName), this.node.active = true, cc.Tween.stopAllByTarget(this.node), this.node.setPosition(0, 0, 0), this.anim ? c.CUSTOM !== this.animType ? [3, 2] : [4, this.customShowAnim()] : [3, 8];
            } else {
              return [2];
            }
          case 1:
            t.sent();
            return [3, 8];
          case 2:
            if (c.SCALE_EASING !== this.animType) {
              return [3, 4];
            } else {
              return [4, this._scaleEasingAnim()];
            }
          case 3:
            t.sent();
            return [3, 8];
          case 4:
            if (c.SCALE != this.animType) {
              return [3, 6];
            } else {
              return [4, this._scaleAnim()];
            }
          case 5:
            t.sent();
            return [3, 8];
          case 6:
            if (c.FADE != this.animType) {
              return [3, 8];
            } else {
              return [4, this._fadeAnim()];
            }
          case 7:
            t.sent();
            t.label = 8;
          case 8:
            this._showComplete = true;
            this.updateAlignment();
            this.onShow();
            return [2];
        }
      });
    });
  };
  _ctor.prototype.customShowAnim = function () {
    return cc__awaiter(this, undefined, undefined, function () {
      var t;
      var e = this;
      return cc__generator(this, function () {
        if (t = $10PopupManager.PopupManager.instance.globalAnim) {
          return [2, new Promise(function (o) {
            t.clone(e.node).call(function () {
              o(true);
            }).start();
          })];
        } else {
          return [2, Promise.resolve()];
        }
      });
    });
  };
  _ctor.prototype._scaleEasingAnim = function () {
    var t = this;
    this.node.scale = 0;
    return new Promise(function (e) {
      cc.tween(t.node).to(.35, {
        scale: 1
      }, {
        easing: "backOut"
      }).call(function () {
        e(true);
      }).start();
    });
  };
  _ctor.prototype._scaleAnim = function () {
    var t = this;
    this.node.scale = 0;
    return new Promise(function (e) {
      cc.tween(t.node).to(.25, {
        scale: 1
      }, {
        easing: "backOut",
        onUpdate: function (e) {
          t._bgNode && (t._bgNode.scale = 1 / e.scale);
        }
      }).call(function () {
        e(true);
      }).start();
    });
  };
  _ctor.prototype._fadeAnim = function () {
    var t = this;
    this.node.opacity = 0;
    return new Promise(function (e) {
      cc.tween(t.node).to(.25, {
        opacity: 255
      }).call(function () {
        e(true);
      }).start();
    });
  };
  _ctor.prototype._hide = function (t) {
    var e = this;
    undefined === t && (t = true);
    $10EventManager.EventManager.instance.emit($10AppProxy.AppEvent.POPUP_HIDE, this._popupName);
    this.onHide();
    if (!this.anim || !this.hideAnim || !t) {
      this.node.active = false;
      return Promise.resolve();
    }
    cc.Tween.stopAllByTarget(this.node);
    var o = Object.create(null);
    if (c.SCALE === this.animType) {
      o.scale = .5;
    } else {
      c.FADE === this.animType && (o.opacity = 0);
    }
    null != this._closePosition && (o.position = this._closePosition);
    return new Promise(function (t) {
      if (c.FADE != e.animType) {
        e._bgNode && cc.tween(e._bgNode).to(e.closeTime, {
          opacity: 0
        }).start();
        cc.tween(e.node).to(e.closeTime, {
          scale: .5
        }, {
          onUpdate: function (t) {
            e._bgNode && (e._bgNode.scale = 1 / t.scale);
          }
        }).call(function () {
          e.node.active = false;
          t(true);
        }).start();
      } else {
        cc.tween(e.node).to(e.closeTime, {
          opacity: 0
        }).call(function () {
          e.node.active = false;
          t(true);
        }).start();
      }
    });
  };
  _ctor.prototype.init = function () {
    this.mWidgets.forEach(function (t) {
      if (null == t ? undefined : t.getComponent(cc.Widget)) {
        t.width = cc.winSize.width;
        t.height = cc.winSize.height;
        t.getComponent(cc.Widget).enabled = false;
      }
    });
  };
  _ctor.prototype.onShow = function () {
    this.mWidgets.forEach(function (t) {
      (null == t ? undefined : t.getComponent(cc.Widget)) && (t.getComponent(cc.Widget).enabled = true);
    });
  };
  _ctor.prototype.onHide = function () {};
  _ctor.prototype.removeUI = function (t, e) {
    undefined === t && (t = $10PopupManager.PopupCacheMode.ONCE);
    undefined === e && (e = true);
    $10PopupManager.PopupManager.instance.remove(this.popupName, t, true, e);
  };
  _ctor.prototype.updateAlignment = function () {
    if (!this.align) {
      var t = this.node.getComponent(cc.Widget);
      null != t && t.updateAlignment();
    }
  };
  cc__decorate([ccp_property({
    tooltip: "是否需要默认透明背景"
  })], _ctor.prototype, "transBack", undefined);
  cc__decorate([ccp_property({
    tooltip: "是否不能穿透"
  })], _ctor.prototype, "blockInput", undefined);
  cc__decorate([ccp_property({
    tooltip: "背景颜色",
    visible: function () {
      return this.transBack;
    }
  })], _ctor.prototype, "bgColor", undefined);
  cc__decorate([ccp_property({
    tooltip: "是否需要动画"
  })], _ctor.prototype, "anim", undefined);
  cc__decorate([ccp_property({
    tooltip: "是否需要关闭动画"
  })], _ctor.prototype, "hideAnim", undefined);
  cc__decorate([ccp_property({
    type: cc.Enum(c),
    tooltip: "动画类型",
    visible: function () {
      return this.anim;
    }
  })], _ctor.prototype, "animType", undefined);
  cc__decorate([ccp_property({
    tooltip: "关闭动画所需时间",
    visible: function () {
      return this.hideAnim;
    }
  })], _ctor.prototype, "closeTime", undefined);
  cc__decorate([ccp_property({
    tooltip: "该弹框是否覆盖了整个屏幕"
  })], _ctor.prototype, "_fullScreen", undefined);
  cc__decorate([ccp_property({})], _ctor.prototype, "fullScreen", null);
  cc__decorate([ccp_property({
    tooltip: "播放scale动画时，不需要适配的节点",
    type: [cc.Node],
    visible: function () {
      return this.animType == c.SCALE;
    }
  })], _ctor.prototype, "mWidgets", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComponentBase.ComponentBase);
exports.PopupBase = exp_PopupBase;