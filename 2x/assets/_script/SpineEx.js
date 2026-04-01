if (sp && sp.Skeleton) {
  sp.SkeletonData.copy = function (t) {
    if (!t) {
      return null;
    }
    var e = new sp.SkeletonData();
    cc.js.mixin(e, t);
    var o = Date.now();
    e._uuid = t._uuid + "_" + o + "_copy";
    var i = e.textureNames;
    var n = [];
    for (var a = 0; a < i.length; a++) {
      e.atlasText = e.atlasText.replace(i[a], "copy_" + i[a]);
      n.push("copy_" + i[a]);
    }
    e.textureNames = n;
    e.init && e.init();
    return e;
  };
  sp.Skeleton.prototype.updateRegion = function (t, e) {
    var o = this.findSlot(t);
    if (null != o) {
      var i = o.getAttachment();
      if (null != i) {
        var n = new sp.SkeletonTexture({
          width: e.width,
          height: e.height
        });
        n.setRealTexture(e);
        var a = new sp.spine.TextureAtlasRegion();
        a.width = e.width;
        a.height = e.height;
        a.originalWidth = e.width;
        a.originalHeight = e.height;
        a.rotate = false;
        a.u = 0;
        a.v = 0;
        a.u2 = 1;
        a.v2 = 1;
        a.texture = n;
        a.renderObject = a;
        i.region = a;
        i.width = e.width;
        i.height = e.height;
        if (i instanceof sp.spine.MeshAttachment) {
          i.updateUVs();
        } else {
          i.setRegion(a);
          i.updateOffset();
        }
      }
    }
  };
}