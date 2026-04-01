var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MapGridItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mFrame = null;
    e.mBG = null;
    e.mState = null;
    e.mAdd = null;
    e.Course = null;
    e._rowcol = null;
    e._bgStatus = $10GameEnum.GridBgStatus.NONE;
    e._gridStatus = $10GameEnum.GridStatus.NORMAL;
    e._belongTo = null;
    e._size = 0;
    e._bValid = false;
    e._isBlackHole = false;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "rowCol", {
    get: function () {
      return this._rowcol;
    },
    set: function (t) {
      this._rowcol = t;
      var e = this.node.getChildByName("test");
      e.getComponent(cc.Label).string = this._rowcol;
      e.active = false;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.showTest = function () {
    this.node.getChildByName("test").active = true;
  };
  Object.defineProperty(_ctor.prototype, "belongTo", {
    get: function () {
      return this._belongTo;
    },
    set: function (t) {
      this._belongTo = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "bValid", {
    get: function () {
      return this._bValid;
    },
    set: function (t) {
      this._bValid = t;
      t && (this.mBG.active = true);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isBlackHole", {
    get: function () {
      return this._isBlackHole;
    },
    set: function (t) {
      this._isBlackHole = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "gridSize", {
    get: function () {
      return this._size;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    var t = this;
    this._size = this.node.getContentSize().width;
    var e = "";
    if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.IceAndSnow) {
      e = "textures/weather/pic_gezi_tianqi5";
    } else {
      $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.SandWind && (e = "textures/weather/pic_gezi_tianqi4");
    }
    "" != e && $10ResUtil.ResUtil.loadAsset({
      path: e,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      t.mBG.getComponent(cc.Sprite).spriteFrame = e;
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.onDestroy = function () {};
  _ctor.prototype.setBgStatus = function (t) {
    if (t != this._bgStatus) {
      this._bgStatus = t;
      var e = null;
      switch (t) {
        case $10GameEnum.GridBgStatus.NONE:
          e = $10GameEnum.GridColor.COLOR_NORMAL;
          this.mState.active = false;
          break;
        case $10GameEnum.GridBgStatus.CHECK_EMPTY:
          e = $10GameEnum.GridColor.COLOR_EMPTY;
          this.mState.active = true;
          break;
        case $10GameEnum.GridBgStatus.CHECK_HOLD:
          e = $10GameEnum.GridColor.COLOR_HOLD;
          this.mState.active = true;
      }
      this.mState.color = cc.color(e);
    }
  };
  _ctor.prototype.setGridStatus = function (t) {
    if (t != this._gridStatus) {
      this._gridStatus = t;
      switch (t) {
        case $10GameEnum.GridStatus.NORMAL:
          this.mAdd.active = false;
          break;
        case $10GameEnum.GridStatus.Add:
          this.mAdd.active = true;
      }
    }
  };
  _ctor.prototype.checkBorderShow = function (t) {
    var e;
    var o;
    var i;
    var n;
    var a;
    if (this.bValid) {
      var r = this.rowCol.split("-").map(Number);
      var s = r[0];
      var c = r[1];
      var l = [[0, -1], [0, 1], [-1, 0], [1, 0]];
      for (var u = 0; u < l.length; ++u) {
        var p = l[u];
        var h = ((null === (e = t[s + p[0]]) || undefined === e ? undefined : e[c + p[1]]) || 0) <= 0;
        this.mFrame.children[u].active = h;
        if (2 == u) {
          if (h) {
            var d = ((null === (o = t[s + (f = l[0])[0]]) || undefined === o ? undefined : o[c + f[1]]) || 0) <= 0;
            this.mFrame.getChildByName("point1").active = d;
            var m = ((null === (i = t[s + (y = l[1])[0]]) || undefined === i ? undefined : i[c + y[1]]) || 0) <= 0;
            this.mFrame.getChildByName("point2").active = m;
          } else {
            this.mFrame.getChildByName("point1").active = false;
            this.mFrame.getChildByName("point2").active = false;
          }
        } else if (3 == u) {
          if (h) {
            var f;
            var y;
            d = ((null === (n = t[s + (f = l[0])[0]]) || undefined === n ? undefined : n[c + f[1]]) || 0) <= 0;
            this.mFrame.getChildByName("point3").active = d;
            m = ((null === (a = t[s + (y = l[1])[0]]) || undefined === a ? undefined : a[c + y[1]]) || 0) <= 0;
            this.mFrame.getChildByName("point4").active = m;
          } else {
            this.mFrame.getChildByName("point3").active = false;
            this.mFrame.getChildByName("point4").active = false;
          }
        }
      }
      for (u = 0; u < t.length; u++) {
        for (var g = 0; g < t[u].length; g++) {
          this.mBG.active = true;
        }
      }
    }
  };
  _ctor.prototype.showFrame = function (t) {
    this.mFrame.active = t;
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mFrame", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBG", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mState", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mAdd", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "Course", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_MapGridItem;