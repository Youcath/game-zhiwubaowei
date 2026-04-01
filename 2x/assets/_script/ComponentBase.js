var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ComponentBase = undefined;
var $10Util = require("Util");
var $10ResUtil = require("ResUtil");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var exp_ComponentBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._assets = [];
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "assets", {
    get: function () {
      return this._assets;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.start = function () {};
  _ctor.prototype.onLoad = function () {};
  _ctor.prototype.onEnable = function () {};
  _ctor.prototype.onDisable = function () {};
  _ctor.prototype.onDestroy = function () {
    this._assets.forEach(function (t) {
      t.decRef();
    });
    this._assets.length = 0;
    this.unscheduleAllCallbacks();
  };
  _ctor.prototype.addRef = function (t) {
    var e;
    if (null != t && !this._assets.includes(t)) {
      if (null === (e = this.node) || undefined === e ? undefined : e.isValid) {
        return t.addRef(), void this._assets.push(t);
      } else {
        return void (0 === t.refCount && cc.assetManager.releaseAsset(t));
      }
    }
  };
  _ctor.prototype.decRef = function (t) {
    var e = this._assets.indexOf(t);
    if (e >= 0) {
      t.refCount > 0 && t.decRef();
      this._assets.splice(e, 1);
    }
  };
  _ctor.prototype.clearAssets = function () {
    this._assets.forEach(function (t) {
      t.decRef();
    });
    this._assets = [];
  };
  _ctor.prototype.getAsset = function (t, e) {
    for (var o = 0; o < this._assets.length; ++o) {
      if (this._assets[o].name == t && $10Util.default.getClassName(e) === $10Util.default.getClassName(this._assets[o])) {
        return this._assets[o];
      }
    }
    return null;
  };
  _ctor.prototype.loadSpriteFrame = function (t) {
    var e = this;
    $10ResUtil.ResUtil.loadAsset({
      bundleName: t.bundleName,
      path: t.path,
      type: cc.SpriteFrame
    }).then(function (o) {
      var i = t.sprite;
      if (i && i.isValid) {
        if (i.spriteFrame != o) {
          i.spriteFrame && (e.decRef(i.spriteFrame), i.spriteFrame = null), e.addRef(o), i.spriteFrame = o, t.complete && t.complete();
        }
      } else {
        0 == o.refCount && cc.assetManager.releaseAsset(o);
      }
    }).catch(function () {});
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.ComponentBase = exp_ComponentBase;