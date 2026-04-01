var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__awaiter = __awaiter;
var cc__generator = __generator;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_menu = cc__decorator.menu;
var def_AnimationCtrl = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.animation = null;
    e._curAnimName = "";
    e._onceFrameEvent = null;
    e._defaultSpd = .2;
    e._animationClipInfoMap = new Map();
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.loadAnimation = function (t) {
    return cc__awaiter(this, undefined, Promise, function () {
      var e;
      var o;
      var i;
      return cc__generator(this, function (n) {
        switch (n.label) {
          case 0:
            if (!this.node || !this.node.isValid) {
              return [2, Promise.resolve()];
            }
            this._animationClipInfoMap.clear();
            e = function (e) {
              var i;
              var n;
              var a;
              var r;
              var l;
              var u;
              return cc__generator(this, function (s) {
                switch (s.label) {
                  case 0:
                    i = t[e];
                    n = [];
                    a = {
                      actionName: i.actionName,
                      frameNum: i.frameNum,
                      frameEventIndexs: i.frameEventIndexs
                    };
                    r = 0;
                    s.label = 1;
                  case 1:
                    if (r < i.frameNum) {
                      return [4, $10ResUtil.ResUtil.loadAsset({
                        bundleName: i.bundleName,
                        path: i.path + "/" + i.spriteFrameNameHead + r,
                        type: cc.SpriteFrame
                      })];
                    } else {
                      return [3, 4];
                    }
                  case 2:
                    (l = s.sent()) instanceof cc.Asset && (n[r] = l);
                    s.label = 3;
                  case 3:
                    ++r;
                    return [3, 1];
                  case 4:
                    o._animationClipInfoMap || (o._animationClipInfoMap = new Map());
                    o._animationClipInfoMap.set(i.actionName, a);
                    (u = cc.AnimationClip.createWithSpriteFrames(n, 60)).name = i.actionName;
                    u.speed = .2;
                    i.frameEventIndexs && i.frameEventIndexs.forEach(function (t) {
                      u.events.push({
                        frame: t / i.frameNum * u.duration,
                        func: "onFrameEvent",
                        params: [i.actionName, t.toString()]
                      });
                    });
                    o.animation && o.animation.addClip(u);
                    return [2];
                }
              });
            };
            o = this;
            i = 0;
            n.label = 1;
          case 1:
            if (i < t.length) {
              return [5, e(i)];
            } else {
              return [3, 4];
            }
          case 2:
            n.sent();
            n.label = 3;
          case 3:
            i++;
            return [3, 1];
          case 4:
            this.animation && (this.animation.onFrameEvent = this.onFrameEvent.bind(this));
            return [2, Promise.resolve()];
        }
      });
    });
  };
  _ctor.prototype.loadAtlasAnimation = function (t, e) {
    return cc__awaiter(this, undefined, Promise, function () {
      var o;
      var i;
      var n;
      return cc__generator(this, function (a) {
        switch (a.label) {
          case 0:
            if (!this.node || !this.node.isValid) {
              return [2, Promise.resolve()];
            }
            this._animationClipInfoMap.clear();
            o = function (o) {
              var n;
              var a;
              var r;
              var l;
              var u;
              var p;
              return cc__generator(this, function (s) {
                switch (s.label) {
                  case 0:
                    n = t[o];
                    a = [];
                    r = {
                      actionName: n.actionName,
                      frameNum: n.frameNum,
                      frameEventIndexs: n.frameEventIndexs
                    };
                    return [4, $10ResUtil.ResUtil.loadAsset({
                      bundleName: "Game",
                      path: n.path,
                      type: cc.SpriteAtlas
                    })];
                  case 1:
                    l = s.sent();
                    for (u = 0; u < n.frameNum; ++u) {
                      a[u] = e && u < 10 ? l.getSpriteFrame(n.spriteFrameNameHead + "0" + u) : l.getSpriteFrame("" + n.spriteFrameNameHead + u);
                    }
                    i._animationClipInfoMap || (i._animationClipInfoMap = new Map());
                    i._animationClipInfoMap.set(n.actionName, r);
                    (p = cc.AnimationClip.createWithSpriteFrames(a, 60)).name = n.actionName;
                    p.speed = .2;
                    n.frameEventIndexs && n.frameEventIndexs.forEach(function (t) {
                      p.events.push({
                        frame: t / n.frameNum * p.duration,
                        func: "onFrameEvent",
                        params: [n.actionName, t.toString()]
                      });
                    });
                    i.animation && i.animation.addClip(p);
                    return [2];
                }
              });
            };
            i = this;
            n = 0;
            a.label = 1;
          case 1:
            if (n < t.length) {
              return [5, o(n)];
            } else {
              return [3, 4];
            }
          case 2:
            a.sent();
            a.label = 3;
          case 3:
            n++;
            return [3, 1];
          case 4:
            this.animation && (this.animation.onFrameEvent = this.onFrameEvent.bind(this));
            return [2, Promise.resolve()];
        }
      });
    });
  };
  _ctor.prototype.init = function () {};
  _ctor.prototype.playAnim = function (t, e, o, i, n) {
    undefined === e && (e = false);
    undefined === o && (o = null);
    undefined === i && (i = null);
    undefined === n && (n = 1);
    if (this._curAnimName != t && this.node && this.node.isValid) {
      o && this.animation.once(cc.Animation.EventType.FINISHED, function () {
        o && o();
      }, this);
      var a = this.animation.getClips().find(function (e) {
        return e.name == t;
      });
      if (a) {
        e && (a.wrapMode = cc.WrapMode.Loop);
        this._onceFrameEvent = i;
        this._curAnimName = t;
        this.animation.stop();
        this.animation.play(t, 0).speed = this._defaultSpd * n;
      } else {
        cc.error("没有这个动画", t);
      }
    }
  };
  _ctor.prototype.setSpeed = function (t) {
    this.animation.getAnimationState(this._curAnimName).speed = this._defaultSpd * t;
  };
  _ctor.prototype.clearAnimEvent = function () {
    this._curAnimName = "";
    this.animation.onFrameEvent = null;
    this.animation.off(cc.Animation.EventType.FINISHED);
  };
  _ctor.prototype.onFrameEvent = function (t, e) {
    this._onceFrameEvent && this._onceFrameEvent(Number(e));
  };
  cc__decorate([ccp_property(cc.Animation)], _ctor.prototype, "animation", undefined);
  return cc__decorate([ccp_ccclass, ccp_menu("帧动画组件/AnimationCtrl")], _ctor);
}(cc.Component);
exports.default = def_AnimationCtrl;