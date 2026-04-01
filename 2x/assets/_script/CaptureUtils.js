Object.defineProperty(exports, "__esModule", {
  value: true
});
var def_CaptureUtils = function () {
  function _ctor() {}
  _ctor._capture = function (e, o) {
    var i = _ctor.getCamera();
    var n = i.node;
    var a = new cc.RenderTexture();
    a.initWithSize(o.width, o.height, cc.gfx.RB_FMT_S8);
    n.setPosition(o.x, o.y);
    n.parent = e;
    i.orthoSize = o.height / 2;
    i.targetTexture = a;
    i.render(e);
    i.targetTexture = null;
    n.parent = null;
    return a;
  };
  _ctor._getNodeInfo = function (e) {
    var o = _ctor._tmpInfo;
    var i = e.getWorldMatrix(_ctor._tmpMat4).getScale(_ctor._tmpVec3);
    o.scaleX = i.x;
    o.scaleY = i.y;
    o.scaleZ = i.z;
    if (e == cc.director.getScene()) {
      var n = cc.view._visibleRect;
      o.anchorX = o.anchorY = 0;
      o.width = n.width;
      o.height = n.height;
    } else {
      o.anchorX = e.anchorX;
      o.anchorY = e.anchorY;
      o.width = e.width;
      o.height = e.height;
    }
    return o;
  };
  _ctor.getCamera = function () {
    var e = _ctor._camera;
    if (!e) {
      (e = _ctor._camera = new cc.Node("CaptureUtils").addComponent(cc.Camera)).alignWithScreen = false;
      e.ortho = true;
      e.nearClip = 0;
    }
    return e;
  };
  _ctor.getCanvas = function () {
    return _ctor._canvas || (_ctor._canvas = document.createElement("canvas"));
  };
  _ctor.capture = function (t, e) {
    var o = new cc.SpriteFrame();
    o.setTexture(this.getRenderTexture(t, e));
    o.setFlipY(true);
    return o;
  };
  _ctor.getImgUrl = function (t, e) {
    return this.toImgUrl(this.getRenderTexture(t, e));
  };
  _ctor.getRenderTexture = function (e, o) {
    var i;
    undefined === e && (e = cc.Canvas.instance.node || cc.director.getScene());
    undefined === o && (o = {});
    i = _ctor._getNodeInfo(e);
    undefined === o.width && (o.width = e.width * i.scaleX);
    undefined === o.height && (o.height = e.height * i.scaleY);
    undefined === o.x && (o.x = (.5 - e.anchorX) * e.width);
    undefined === o.y && (o.y = (.5 - e.anchorY) * e.height);
    return _ctor._capture(e, o);
  };
  _ctor.toImgUrl = function (e) {
    var o;
    var i = e.width;
    var n = e.height;
    if (cc.sys.isNative) {
      var a = e.readPixels();
      var r = jsb.fileUtils.getWritablePath() + "tmpImg.png";
      jsb.saveImageData(a, i, n, r);
      o = r;
    } else {
      var s = _ctor.getCanvas();
      var c = s.getContext("2d");
      var l = s.toTempFilePathSync;
      a = e.readPixels();
      var u = 4 * i;
      var p = 0;
      s.width = i;
      for (s.height = n; p < n;) {
        var h = n - 1 - p;
        var d = c.createImageData(i, 1);
        var m = h * i * 4;
        for (var f = 0; f < u; f++) {
          d.data[f] = a[m + f];
        }
        c.putImageData(d, 0, p++);
      }
      o = "function" == typeof l ? l.call(s, {}) : s.toDataURL("image/png");
      c.clearRect(0, 0, i, n);
    }
    return o;
  };
  _ctor._tmpMat4 = cc.mat4();
  _ctor._tmpVec3 = cc.v3();
  _ctor._tmpInfo = {};
  return _ctor;
}();
exports.default = def_CaptureUtils;