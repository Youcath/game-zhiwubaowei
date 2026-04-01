var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc_gfx = cc.gfx;
var s = function () {
  this.x = 0;
  this.y = 0;
  this.dis = 0;
  this.cos = 0;
  this.sin = 0;
};
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_playOnFocus = cc__decorator.playOnFocus;
var ccp_menu = cc__decorator.menu;
var def_MotionTrail = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.atlas = null;
    e._spriteFrame = null;
    e._active = true;
    e._isWorldXY = true;
    e.offset = cc.v2(0, 0);
    e._length = 20;
    e._headWidth = 100;
    e._tailWidth = 0;
    e._headOpacity = 255;
    e._tailOpacity = 0;
    e.renderData = null;
    e.meshID = 0;
    e.capacity = 0;
    e.verticesCount = 0;
    e.indicesCount = 0;
    e.$flush = null;
    e.$xyOffset = 1e8;
    e.$uvOffset = 1e8;
    e.$colorOffset = 1e8;
    e.$step = 0;
    e.trailData = [];
    e.$getVData = function () {
      return e.renderData.vDatas[e.meshID];
    };
    e.$getUintVData = function () {
      return e.renderData.uintVDatas[e.meshID];
    };
    e.$getIData = function () {
      return e.renderData.iDatas[e.meshID];
    };
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "$spriteFrame", {
    get: function () {
      return this._spriteFrame;
    },
    set: function (t) {
      this._spriteFrame = t;
      this.$updateSpriteFrame();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "active", {
    get: function () {
      return this._active;
    },
    set: function (t) {
      this._active = t;
      this.enabled = t;
      this.$updateActive();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "$isWorldXY", {
    get: function () {
      return this._isWorldXY;
    },
    set: function (t) {
      this._isWorldXY = t;
      this.$updateXY();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "length", {
    get: function () {
      return this._length;
    },
    set: function (t) {
      this._length = Math.max(t, 0);
      this.updateLength();
      this.updateWidth();
      this.$updateUV();
      this.$updateColor();
      this.resetPos();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "headWidth", {
    get: function () {
      return this._headWidth;
    },
    set: function (t) {
      this._headWidth = Math.max(t, 0);
      this.updateWidth();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "tailWidth", {
    get: function () {
      return this._tailWidth;
    },
    set: function (t) {
      this._tailWidth = Math.max(t, 0);
      this.updateWidth();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "headOpacity", {
    get: function () {
      return this._headOpacity;
    },
    set: function (t) {
      this._headOpacity = t;
      this.$updateColor();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "tailOpacity", {
    get: function () {
      return this._tailOpacity;
    },
    set: function (t) {
      this._tailOpacity = t;
      this.$updateColor();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "$vDataLength", {
    get: function () {
      return this.verticesCount * this.$step;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "$iDataLength", {
    get: function () {
      return this.indicesCount;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype._resetAssembler = function () {
    var t = this._assembler = new m();
    t.init(this);
    t.updateRenderData = this.$onFlushed.bind(this);
    this.$flush = this.setVertsDirty;
    var e = this.renderData = new cc.RenderData();
    e.init(t);
    this.meshID = e.meshCount;
    this.$init();
  };
  _ctor.prototype.$init = function () {
    this.$setVFmt();
    this.updateLength();
    this.updateWidth();
    this.node.on(cc.Node.EventType.COLOR_CHANGED, this.$updateColor, this);
    this.resetPos();
  };
  _ctor.prototype.start = function () {
    this.$updateSpriteFrame();
    cc.director.once(cc.Director.EVENT_AFTER_DRAW, this.$updateColor, this);
  };
  _ctor.prototype.initMotionTrail = function () {
    this.active = true;
  };
  _ctor.prototype.$setVFmt = function (t) {
    undefined === t && (t = new cc_gfx.VertexFormat([{
      name: cc_gfx.ATTR_POSITION,
      type: cc_gfx.ATTR_TYPE_FLOAT32,
      num: 2
    }, {
      name: cc_gfx.ATTR_UV0,
      type: cc_gfx.ATTR_TYPE_FLOAT32,
      num: 2
    }, {
      name: cc_gfx.ATTR_COLOR,
      type: cc_gfx.ATTR_TYPE_UINT8,
      num: 4,
      normalize: true
    }]));
    var e = this._assembler;
    cc.sys.isNative && e.setVertexFormat(t);
    var o = t._elements;
    for (var i = o.length - 1; i > -1; --i) {
      this.$step += o[i].bytes >> 2;
    }
    var n = t._attr2el;
    this.$xyOffset = n[cc_gfx.ATTR_POSITION].offset >> 2;
    this.$uvOffset = n[cc_gfx.ATTR_UV0].offset >> 2;
    this.$colorOffset = n[cc_gfx.ATTR_COLOR].offset >> 2;
  };
  _ctor.prototype.$createBuffer = function (t, e, o) {
    undefined === e && (e = t - 2);
    undefined === o && (o = 2);
    o = Math.max(o, 1.5);
    var i = this.renderData;
    this.verticesCount = Math.max(t, 0);
    this.indicesCount = Math.max(3 * e, 0);
    var n = !i.vDatas[this.meshID];
    if (this.verticesCount > this.capacity) {
      this.capacity = ~~Math.max(this.capacity * o, this.verticesCount);
      n = true;
    } else if (this.verticesCount < this.capacity / o) {
      this.capacity = ~~Math.max(this.capacity / o, this.verticesCount), n = true;
    }
    if (n) {
      var a = new Float32Array(this.verticesCount * this.$step);
      var r = new Uint16Array(this.indicesCount);
      i.updateMesh(this.meshID, a, r);
    }
    this.$updateIndice();
  };
  _ctor.prototype.update = function () {
    cc.sys.isNative && this.$updateColor();
    this.$flush();
  };
  _ctor.prototype.$onFlushed = function () {
    if (false !== this.active && null !== this.$spriteFrame && 0 !== this.length) {
      var t = this.trailData;
      for (var e = this.length - 1; e > 0; --e) {
        var o = t[e];
        var i = t[e - 1];
        o.x = i.x;
        o.y = i.y;
        o.sin = i.sin;
        o.cos = i.cos;
      }
      if (this.$isWorldXY) {
        var n = this.node._worldMatrix.m;
        this.node._updateWorldMatrix();
        t[0].x = this.offset.x + n[12];
        t[0].y = this.offset.y + n[13];
      } else {
        t[0].x = this.offset.x + this.node.x;
        t[0].y = this.offset.y + this.node.y;
      }
      this.$updateXY();
    }
  };
  _ctor.prototype.$updateActive = function () {
    this.active && this.resetPos();
  };
  _ctor.prototype.$updateSpriteFrame = function () {
    var t = this.$spriteFrame;
    var e = this.getMaterial(0) || cc.Material.getBuiltinMaterial("2d-sprite");
    e.define("USE_TEXTURE", true);
    e.setProperty("texture", t ? t.getTexture() : null);
    this.$updateUV();
  };
  _ctor.prototype.$updateXY = function () {
    var t = this.$getVData();
    var e = null;
    var o = null;
    var i = 0;
    var n = 0;
    var a = 0;
    var r = 0;
    var s = 0;
    var c = this.$step;
    var l = 0;
    var u = 0;
    if (!this.$isWorldXY) {
      l = this.node.x;
      u = this.node.y;
    }
    var p = this.trailData;
    var h = 0;
    for (var d = this.length - 1; h < d; ++h) {
      e = p[h];
      o = p[h + 1];
      i = e.x - l;
      n = e.y - u;
      a = o.x - l;
      r = o.y - u;
      if (0 === h) {
        var m = Math.atan2(r - n, a - i);
        e.sin = Math.sin(m);
        e.cos = Math.cos(m);
      }
      t[s] = i + e.dis * e.sin;
      t[s + 1] = n - e.dis * e.cos;
      t[s += c] = i - e.dis * e.sin;
      t[s + 1] = n + e.dis * e.cos;
      s += c;
    }
    t[s] = a + o.dis * e.sin;
    t[s + 1] = r - o.dis * e.cos;
    t[s += c] = a - o.dis * e.sin;
    t[s + 1] = r + o.dis * e.cos;
  };
  _ctor.prototype.$updateUV = function () {
    if (null !== this.$spriteFrame) {
      var t = this.$getVData();
      var e = this.$step;
      var o = 1 / (this.trailData.length - 1);
      var i = this.$uvOffset;
      var n = 0;
      for (var a = this.$vDataLength; i < a; i += e, ++n) {
        t[i] = 1 & n;
        t[i + 1] = 1 - o * (n >> 1);
      }
      this.$fitUV();
    }
  };
  _ctor.prototype.$updateColor = function () {
    var t = this.$getUintVData();
    var e = this.length;
    var o = this.headOpacity;
    var i = (o - this.tailOpacity) / (e - 1);
    var n = this.node.opacity / 255;
    var a = this.node.color.b << 16 | this.node.color.g << 8 | this.node.color.r;
    var r = 0;
    var s = this.$colorOffset;
    for (var c = this.$step; r < e; ++r) {
      var l = (o - i * r) * n << 24 | a;
      t[s] = l;
      t[s += c] = l;
      s += c;
    }
  };
  _ctor.prototype.$updateIndice = function () {
    var t = this.$getIData();
    var e = 0;
    var o = 0;
    for (var i = this.$iDataLength; e < i; ++o) {
      t[e++] = o;
      t[e++] = o + 1;
      t[e++] = o + 2;
    }
  };
  _ctor.prototype.updateLength = function () {
    var t = this.length;
    this.trailData = [];
    for (var e = 0; e < t; ++e) {
      this.trailData[e] = new s();
    }
    this.$createBuffer(t << 1);
  };
  _ctor.prototype.updateWidth = function () {
    var t = this.trailData;
    var e = this.length;
    var o = .5 * this.headWidth;
    var i = (o - .5 * this.tailWidth) / (e - 1);
    for (var n = 0; n < e; ++n) {
      t[n].dis = o - i * n;
    }
  };
  _ctor.prototype.resetPos = function () {
    var t = this.trailData;
    var e = this.offset.x;
    var o = this.offset.y;
    if (this.$isWorldXY) {
      var i = this.node._worldMatrix.m;
      this.node._updateWorldMatrix();
      e += i[12];
      o += i[13];
    } else {
      e += this.node.x;
      o += this.node.y;
    }
    for (var n = this.length - 1; n > -1; --n) {
      t[n].x = e;
      t[n].y = o;
    }
    var a = this.$getVData();
    var r = this.$step;
    n = 0;
    for (var s = this.$vDataLength; n < s; n += r) {
      a[n] = e;
      a[n + 1] = o;
    }
  };
  _ctor.prototype.$fitUV = function () {
    if (null !== this.$spriteFrame) {
      var t = this.$step;
      var e = this.$spriteFrame.getTexture().width;
      var o = this.$spriteFrame.getTexture().height;
      var i = this.$spriteFrame.getRect();
      var n = this.$getVData();
      if (this.$spriteFrame._rotated) {
        var a = this.$uvOffset;
        var r = 0;
        for (var s = this.$vDataLength; a < s; a += t, ++r) {
          var c = n[a];
          n[a] = ((1 - n[a + 1]) * i.height + i.x) / e;
          n[a + 1] = (c * i.width + i.y) / o;
        }
      } else {
        a = this.$uvOffset;
        r = 0;
        for (s = this.$vDataLength; a < s; a += t, ++r) {
          n[a] = (n[a] * i.width + i.x) / e;
          n[a + 1] = (n[a + 1] * i.height + i.y) / o;
        }
      }
    }
  };
  _ctor.prototype.onDestroy = function () {
    this.node.targetOff(this);
  };
  cc__decorate([ccp_property({
    type: cc.SpriteAtlas,
    editorOnly: true,
    readonly: true,
    // displayName: false
  })], _ctor.prototype, "atlas", undefined);
  cc__decorate([ccp_property], _ctor.prototype, "_spriteFrame", undefined);
  cc__decorate([ccp_property({
    type: cc.SpriteFrame,
    // displayName: false
  })], _ctor.prototype, "$spriteFrame", null);
  cc__decorate([ccp_property], _ctor.prototype, "_active", undefined);
  cc__decorate([ccp_property({
    // displayName: false,
    // tooltip: false
  })], _ctor.prototype, "active", null);
  cc__decorate([ccp_property], _ctor.prototype, "_isWorldXY", undefined);
  cc__decorate([ccp_property({
    // displayName: false,
    // tooltip: false
  })], _ctor.prototype, "$isWorldXY", null);
  cc__decorate([ccp_property({
    // displayName: false
  })], _ctor.prototype, "offset", undefined);
  cc__decorate([ccp_property], _ctor.prototype, "_length", undefined);
  cc__decorate([ccp_property({
    type: cc.Integer,
    // displayName: false
  })], _ctor.prototype, "length", null);
  cc__decorate([ccp_property], _ctor.prototype, "_headWidth", undefined);
  cc__decorate([ccp_property({
    // displayName: false
  })], _ctor.prototype, "headWidth", null);
  cc__decorate([ccp_property], _ctor.prototype, "_tailWidth", undefined);
  cc__decorate([ccp_property({
    // displayName: false
  })], _ctor.prototype, "tailWidth", null);
  cc__decorate([ccp_property], _ctor.prototype, "_headOpacity", undefined);
  cc__decorate([ccp_property({
    type: cc.Integer,
    min: 0,
    max: 255,
    slide: true,
    // displayName: false
  })], _ctor.prototype, "headOpacity", null);
  cc__decorate([ccp_property], _ctor.prototype, "_tailOpacity", undefined);
  cc__decorate([ccp_property({
    type: cc.Integer,
    min: 0,
    max: 255,
    slide: true,
    // displayName: false
  })], _ctor.prototype, "tailOpacity", null);
  return cc__decorate([ccp_ccclass, ccp_playOnFocus, ccp_menu("Comp/MotionTrail")], _ctor);
}(cc.RenderComponent);
exports.default = def_MotionTrail;
var m = function (t) {
  function e() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(e, t);
  e.prototype.fillBuffers = function (t) {
    var e = t.renderData.vDatas[t.meshID];
    var o = t.renderData.iDatas[t.meshID];
    var i = cc.renderer._handle._meshBuffer;
    var n = i.request(t.verticesCount, t.indicesCount);
    var a = n.byteOffset >> 2;
    var r = i._vData;
    if (e.length + a > r.length) {
      r.set(e.subarray(0, r.length - a), a);
    } else {
      r.set(e, a);
    }
    var s = i._iData;
    var c = n.indiceOffset;
    var l = n.vertexOffset;
    var u = 0;
    for (var p = o.length; u < p; u++) {
      s[c++] = l + o[u];
    }
  };
  return e;
}(cc.Assembler);