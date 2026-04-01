var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
cc__decorator.menu;
sp.SkeletonData.prototype.isTexturesLoaded = function () {
  var t = this.textures;
  var e = t ? t.length : 0;
  for (var o = 0; o < e; o++) {
    if (!t[o].loaded) {
      return false;
    }
  }
  return true;
};
var def_GTSpAnimCtrl = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.spAnim = null;
    e.animFrameEventListener = new Map();
    e.animCompleteListener = new Map();
    e.onceOnComplete = null;
    e._onPlayAnimFunc = null;
    e._timeScale = 1;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    this.spAnim.setEventListener(this.onFrameEvent.bind(this));
    this.spAnim.setCompleteListener(this.onCompleteEvent.bind(this));
    if (this.spAnim.skeletonData) {
      var t = this.spAnim.skeletonData.skeletonJson.animations;
      for (var e in t) {
        for (var o in t) {
          e != o && this.spAnim.setMix(e, o, .2);
        }
      }
    }
  };
  _ctor.prototype.onDestroy = function () {
    this.animFrameEventListener.clear();
    this.animCompleteListener.clear();
    this.spAnim.setEventListener(null);
    this.spAnim.setCompleteListener(null);
  };
  _ctor.prototype.init = function (t) {
    undefined === t && (t = null);
    this._timeScale = 1;
    this.spAnim.enabled = true;
    this.spAnim.node.opacity = 255;
    t && t.onPlayAnimFunc && (this._onPlayAnimFunc = t.onPlayAnimFunc);
    if (null == t || !t.skeletonData || this.spAnim.skeletonData && this.spAnim.skeletonData.name == t.skeletonData.name) {
      this.clearTracks();
      this.spAnim.setToSetupPose();
      this.animCompleteListener.clear();
      return void this.animFrameEventListener.clear();
    }
    this.spAnim.skeletonData = t.skeletonData;
    var e = this.spAnim.skeletonData.skeletonJson.animations;
    for (var o in e) {
      for (var i in e) {
        o != i && this.spAnim.setMix(o, i, .2);
      }
    }
    this.clearTracks();
    this.spAnim.setToSetupPose();
    this.animCompleteListener.clear();
    this.animFrameEventListener.clear();
  };
  _ctor.prototype.playAnimWithFrame = function (t, e, o, i, a) {
    undefined === e && (e = false);
    undefined === o && (o = 0);
    undefined === i && (i = Number.MAX_SAFE_INTEGER);
    undefined === a && (a = 1);
    if (!this.spAnim) {
      return null;
    }
    if (this.node.active) {
      var n = this.spAnim.findAnimation(t);
      if (n) {
        var r = n.duration;
        var s = Math.ceil(60 * r);
        i = Math.min(i, s);
        var c = Math.max(0, o / 60);
        var l = Math.min(i / 60, 1);
        var u = this.spAnim.setAnimation(0, t, e);
        this.spAnim.timeScale = 0;
        u.animationStart = c;
        u.animationEnd = l;
        this.spAnim.timeScale = a;
        this._timeScale = this.spAnim.timeScale;
        return u;
      }
    }
  };
  _ctor.prototype.playAnim = function (t, e, o, i) {
    undefined === e && (e = 1);
    undefined === o && (o = false);
    if (!this.spAnim) {
      return null;
    }
    if (this.node.active) {
      t || (t = this.spAnim.defaultAnimation);
      if (!this.spAnim.isAnimationCached()) {
        var a = this.spAnim.getCurrent(0);
        if (a && a.animation.name == t) {
          return null;
        }
        this.spAnim.clearTrack(0);
      }
      this.spAnim.setToSetupPose();
      this.spAnim.timeScale = e;
      this._timeScale = this.spAnim.timeScale;
      this.onceOnComplete = i;
      this._onPlayAnimFunc && this._onPlayAnimFunc(t, e, o);
      return this.spAnim.setAnimation(0, t, o);
    }
  };
  _ctor.prototype.playAnimFixSpeed = function (t, e, o, i) {
    undefined === e && (e = 1);
    undefined === o && (o = false);
    if (!this.spAnim) {
      return null;
    }
    t || (t = this.spAnim.defaultAnimation);
    if (!this.spAnim.isAnimationCached()) {
      var a = this.spAnim.getCurrent(0);
      if (a && a.animation.name == t) {
        return null;
      }
      this.spAnim.clearTrack(0);
    }
    this.spAnim.setToSetupPose();
    this.spAnim.timeScale = e;
    this._timeScale = this.spAnim.timeScale;
    this.onceOnComplete = i;
    return this.spAnim.setAnimation(0, t, o);
  };
  _ctor.prototype.setTimeScale = function (t) {
    t * this._timeScale != this.spAnim.timeScale && (this.spAnim.timeScale = this._timeScale * t);
  };
  _ctor.prototype.getCurAnimTime = function () {
    if (!this.spAnim.isAnimationCached()) {
      var t = this.spAnim.getCurrent(0);
      if (t) {
        return t.animationEnd;
      }
    }
    return 0;
  };
  _ctor.prototype.registerFrameEvent = function (t, e) {
    this.animFrameEventListener.set(e, t);
  };
  _ctor.prototype.unregisterFrameEvent = function (t) {
    this.animFrameEventListener.delete(t);
  };
  _ctor.prototype.registerComplete = function (t, e) {
    this.animCompleteListener.set(e, t);
  };
  _ctor.prototype.unregisterComplete = function (t) {
    this.animCompleteListener.delete(t);
  };
  _ctor.prototype.onFrameEvent = function (t, e) {
    var o = this;
    this.animFrameEventListener.forEach(function (i, a) {
      i.call(a, t.animation.name, e.data.name, o);
    });
  };
  _ctor.prototype.onCompleteEvent = function (t) {
    this.onceOnComplete && this.onceOnComplete(t);
    this.onceOnComplete = null;
    this.animCompleteListener.forEach(function (e, o) {
      e.call(o, t);
    });
  };
  _ctor.prototype.clearAnim = function () {
    this.clearTracks();
  };
  _ctor.prototype.releaseRes = function () {};
  _ctor.prototype.generateSomeNodes = function (t, e) {
    var o = this.spAnim.attachUtil.generateAttachedNodes(t)[0];
    if (e) {
      return e instanceof cc.Prefab ? o.addChild(cc.instantiate(e)) : e.parent ? e.parent = o : o.addChild(e), o;
    } else {
      return o;
    }
  };
  _ctor.prototype.destroySomeNodes = function (t) {
    this.spAnim.attachUtil.destroyAttachedNodes(t);
  };
  _ctor.prototype.clearTracks = function () {
    this.spAnim.isAnimationCached() || this.spAnim.clearTracks();
  };
  _ctor.prototype.clear = function () {
    this.clearTracks();
    this.animCompleteListener.clear();
    this.animFrameEventListener.clear();
  };
  _ctor.prototype.clearOnceComplete = function () {
    this.onceOnComplete = null;
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "spAnim", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_GTSpAnimCtrl;