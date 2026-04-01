Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderUtil = undefined;
var exp_RenderUtil = function () {
  function _ctor() {}
  _ctor.getRenderTexture = function (t, e) {
    if (!cc.isValid(t)) {
      return null;
    }
    e && e instanceof cc.RenderTexture || (e = new cc.RenderTexture());
    var o = Math.floor(t.width);
    var i = Math.floor(t.height);
    e.initWithSize(o, i);
    var n = new cc.Node();
    n.parent = t;
    var a = n.addComponent(cc.Camera);
    a.clearFlags |= cc.Camera.ClearFlags.COLOR;
    a.backgroundColor = cc.color(0, 0, 0, 0);
    a.zoomRatio = cc.winSize.height / i;
    a.targetTexture = e;
    a.render(t);
    n.destroy();
    return e;
  };
  _ctor.renderWithMaterial = function (t, e, o) {
    if (e instanceof cc.Material) {
      o = e;
      e = new cc.RenderTexture();
    }
    var i = new cc.Node();
    i.setParent(cc.Canvas.instance.node);
    var n = i.addComponent(cc.Sprite);
    n.sizeMode = cc.Sprite.SizeMode.RAW;
    n.trim = false;
    n.spriteFrame = new cc.SpriteFrame(t);
    var a = t.width;
    var r = t.height;
    e.initWithSize(a, r);
    o instanceof cc.Material && n.setMaterial(0, o);
    var s = new cc.Node();
    s.setParent(i);
    var c = s.addComponent(cc.Camera);
    c.clearFlags |= cc.Camera.ClearFlags.COLOR;
    c.backgroundColor = cc.color(0, 0, 0, 0);
    c.zoomRatio = cc.winSize.height / r;
    c.targetTexture = e;
    c.render(i);
    s.destroy();
    i.destroy();
    return e;
  };
  _ctor.getPixelsData = function (t, e) {
    undefined === e && (e = true);
    if (!cc.isValid(t)) {
      return null;
    }
    var o = Math.floor(t.width);
    var i = Math.floor(t.height);
    var n = new cc.Node();
    n.parent = t;
    var a = n.addComponent(cc.Camera);
    a.clearFlags |= cc.Camera.ClearFlags.COLOR;
    a.backgroundColor = cc.color(0, 0, 0, 0);
    a.zoomRatio = cc.winSize.height / i;
    var r = new cc.RenderTexture();
    r.initWithSize(o, i, cc.RenderTexture.DepthStencilFormat.RB_FMT_S8);
    a.targetTexture = r;
    a.render(t);
    var s = r.readPixels();
    r.destroy();
    n.destroy();
    if (e) {
      var c = s.length;
      var l = 4 * o;
      var u = new Uint8Array(c);
      var p = 0;
      for (var h = c - l; p < c; p += l, h -= l) {
        for (var d = 0; d < l; d++) {
          u[p + d] = s[h + d];
        }
      }
      return u;
    }
    return s;
  };
  _ctor.flipY = function (t, e) {
    var o = t.length;
    var i = new Uint8Array(o);
    var n = 0;
    for (var a = o - e; n < o; n += e, a -= e) {
      for (var r = 0; r < e; r++) {
        i[n + r] = t[a + r];
      }
    }
    return i;
  };
  return _ctor;
}();
exports.RenderUtil = exp_RenderUtil;