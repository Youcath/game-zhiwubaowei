Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EngineExUtils = exports.headImgExt = undefined;
exports.headImgExt = ".head";
(function (t) {
  function e() {
    cc.assetManager.downloader.register(exports.headImgExt, function (t, e, o) {
      o(null, t);
    });
    cc.assetManager.parser.register(exports.headImgExt, n);
    cc.assetManager.factory.register(exports.headImgExt, i);
  }
  function i(t, e, o, i) {
    var n = null;
    var a = null;
    try {
      (n = new cc.Texture2D())._uuid = t;
      n._nativeUrl = t;
      n._nativeAsset = e;
    } catch (r) {
      a = r;
    }
    i && i(a, n);
  }
  function n(t, e, o) {
    var i = new Image();
    function n() {
      i.removeEventListener("load", n);
      i.removeEventListener("error", a);
      o && o(null, i);
    }
    function a() {
      i.removeEventListener("load", n);
      i.removeEventListener("error", a);
      o && o(new Error(t));
    }
    "file:" !== window.location.protocol && (i.crossOrigin = "anonymous");
    i.addEventListener("load", n);
    i.addEventListener("error", a);
    i.src = t;
    return i;
  }
  t.all = function () {
    e();
  };
  t.registerHeadImgLoader = e;
})(exports.EngineExUtils || (exports.EngineExUtils = {}));