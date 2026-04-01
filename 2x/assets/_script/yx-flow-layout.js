var i;
var cc__extends = __extends;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YXFlowLayout = undefined;
var $10yxcollectionview = require("yx-collection-view");
var cc__decorator = cc._decorator;
cc__decorator.ccclass;
cc__decorator.property;
var exp_YXFlowLayout = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.pagingEnabled = false;
    e.extraVisibleCount = 0;
    e.itemSize = new cc.Size(100, 100);
    e.verticalSpacing = 0;
    e.horizontalSpacing = 0;
    e.sectionInset = $10yxcollectionview.YXEdgeInsets.ZERO;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.getItemSize = function () {
    if (this.itemSize instanceof Function == 0) {
      return this.itemSize;
    }
    throw new Error("YXFlowLayout: 动态配置的布局参数不支持直接获取，请检查自己的布局逻辑并谨慎的通过动态配置自己获取，注意避免死循环");
  };
  _ctor.prototype.getVerticalSpacing = function () {
    if (this.verticalSpacing instanceof Function == 0) {
      return this.verticalSpacing;
    }
    throw new Error("YXFlowLayout: 动态配置的布局参数不支持直接获取，请检查自己的布局逻辑并谨慎的通过动态配置自己获取，注意避免死循环");
  };
  _ctor.prototype.getHorizontalSpacing = function () {
    if (this.horizontalSpacing instanceof Function == 0) {
      return this.horizontalSpacing;
    }
    throw new Error("YXFlowLayout: 动态配置的布局参数不支持直接获取，请检查自己的布局逻辑并谨慎的通过动态配置自己获取，注意避免死循环");
  };
  _ctor.prototype.getSectionInset = function () {
    if (this.sectionInset instanceof Function == 0) {
      return this.sectionInset;
    }
    throw new Error("YXFlowLayout: 动态配置的布局参数不支持直接获取，请检查自己的布局逻辑并谨慎的通过动态配置自己获取，注意避免死循环");
  };
  _ctor.prototype.prepare = function (t) {
    if (t.scrollDirection != $10yxcollectionview.YXCollectionView.ScrollDirection.HORIZONTAL) {
      t.scrollDirection != $10yxcollectionview.YXCollectionView.ScrollDirection.VERTICAL || this._vertical(t);
    } else {
      this._horizontal(t);
    }
  };
  _ctor.prototype.initOffset = function (t) {
    if (t.scrollDirection != $10yxcollectionview.YXCollectionView.ScrollDirection.HORIZONTAL) {
      t.scrollDirection != $10yxcollectionview.YXCollectionView.ScrollDirection.VERTICAL || t.scrollView.scrollToTop(0);
    } else {
      t.scrollView.scrollToLeft(0);
    }
  };
  _ctor.prototype.targetOffset = function (t, e, o) {
    if (0 == this.pagingEnabled) {
      return null;
    }
    var i = t.scrollView.getScrollOffset();
    i.x = -i.x;
    if (t.scrollDirection == $10yxcollectionview.YXCollectionView.ScrollDirection.HORIZONTAL) {
      var n = Math.round(i.x / t.scrollView.node.width);
      var r = e.x / t.scrollView.node.width;
      o && Math.abs(r) >= .2 && (n = Math.round(o.x / t.scrollView.node.width) + (r > 0 ? -1 : 1));
      i.x = n * t.scrollView.node.width;
    }
    if (t.scrollDirection == $10yxcollectionview.YXCollectionView.ScrollDirection.VERTICAL) {
      n = Math.round(i.y / t.scrollView.node.height);
      r = e.y / t.scrollView.node.height;
      o && Math.abs(r) >= .2 && (n = Math.round(o.y / t.scrollView.node.height) + (r > 0 ? 1 : -1));
      i.y = n * t.scrollView.node.height;
    }
    return {
      offset: i,
      time: .25
    };
  };
  _ctor.prototype.layoutAttributesForElementsInRect = function (e, o) {
    if (this.extraVisibleCount < 0) {
      return t.prototype.layoutAttributesForElementsInRect.call(this, e, o);
    }
    var i = -1;
    var n = 0;
    for (var a = this.attributes.length - 1; n <= a && a >= 0;) {
      var r = n + (a - n) / 2;
      r = Math.floor(r);
      var s = this.attributes[r];
      if (e.intersects(s.frame)) {
        i = r;
        break;
      }
      if (e.yMax < s.frame.yMin || e.xMax < s.frame.xMin) {
        a = r - 1;
      } else {
        n = r + 1;
      }
    }
    if (i < 0) {
      return t.prototype.layoutAttributesForElementsInRect.call(this, e, o);
    }
    var c = [];
    c.push(this.attributes[i]);
    for (var l = i; l > 0;) {
      var u = l - 1;
      s = this.attributes[u];
      if (0 == e.intersects(s.frame)) {
        break;
      }
      c.push(s);
      l = u;
    }
    for (var p = this.extraVisibleCount; p > 0 && !((u = l - 1) < 0);) {
      s = this.attributes[u];
      e.intersects(s.frame) && c.push(s);
      l = u;
      p--;
    }
    for (var h = i; h < this.attributes.length - 1 && (u = h + 1, s = this.attributes[u], 0 != e.intersects(s.frame));) {
      c.push(s);
      h = u;
    }
    for (var d = this.extraVisibleCount; d > 0 && !((u = h + 1) >= this.attributes.length);) {
      s = this.attributes[u];
      e.intersects(s.frame) && c.push(s);
      h = u;
      d--;
    }
    return c;
  };
  _ctor.prototype.layoutAttributesForItemAtIndexPath = function (e, o) {
    var i = 0;
    for (var n = this.attributes.length - 1; i <= n && n >= 0;) {
      var a = i + (n - i) / 2;
      a = Math.floor(a);
      var r = this.attributes[a];
      if (r.indexPath.equals(e)) {
        return r;
      }
      if (r.indexPath.section < e.section || r.indexPath.section == e.section && r.indexPath.item < e.item) {
        i = a + 1;
      } else {
        n = a - 1;
      }
    }
    return t.prototype.layoutAttributesForItemAtIndexPath.call(this, e, o);
  };
  _ctor.prototype._horizontal = function (t) {
    t.scrollView.horizontal = true;
    t.scrollView.vertical = false;
    var e = t.node.getContentSize().clone();
    var o = [];
    var i = t.numberOfSections instanceof Function ? t.numberOfSections(t) : t.numberOfSections;
    var n = 0;
    for (var r = 0; r < i; r++) {
      var s = t.numberOfItems instanceof Function ? t.numberOfItems(r, t) : t.numberOfItems;
      var l = this.verticalSpacing instanceof Function ? this.verticalSpacing(r, this, t) : this.verticalSpacing;
      var u = this.horizontalSpacing instanceof Function ? this.horizontalSpacing(r, this, t) : this.horizontalSpacing;
      var p = this.sectionInset instanceof Function ? this.sectionInset(r, this, t) : this.sectionInset;
      n += p.left;
      var h = new c();
      h.verticalSpacing = l;
      h.horizontalSpacing = u;
      h.sectionInset = p;
      h.offset = n;
      h.attrs = [];
      h.containerWidth = 0;
      h.containerHeight = e.height;
      for (var d = 0; d < s; d++) {
        var m = new $10yxcollectionview.YXIndexPath(r, d);
        var f = this.itemSize instanceof Function ? this.itemSize(m, this, t) : this.itemSize;
        var y = h.layout_horizontal_item(m, f);
        if (null == y) {
          h.offset = h.offset + h.containerWidth + u;
          h.containerWidth = 0;
          h.attrs = [];
          y = h.layout_horizontal_item(m, f);
        }
        y && o.push(y);
        n = Math.max(n, h.offset + h.containerWidth);
      }
      n += p.right;
    }
    this.attributes = o;
    e.width = Math.max(e.width, n);
    this.contentSize = e;
  };
  _ctor.prototype._vertical = function (t) {
    t.scrollView.horizontal = false;
    t.scrollView.vertical = true;
    var e = t.node.getContentSize().clone();
    var o = [];
    var i = t.numberOfSections instanceof Function ? t.numberOfSections(t) : t.numberOfSections;
    var n = 0;
    for (var r = 0; r < i; r++) {
      var s = t.numberOfItems instanceof Function ? t.numberOfItems(r, t) : t.numberOfItems;
      var l = this.verticalSpacing instanceof Function ? this.verticalSpacing(r, this, t) : this.verticalSpacing;
      var u = this.horizontalSpacing instanceof Function ? this.horizontalSpacing(r, this, t) : this.horizontalSpacing;
      var p = this.sectionInset instanceof Function ? this.sectionInset(r, this, t) : this.sectionInset;
      n += p.top;
      var h = new c();
      h.verticalSpacing = l;
      h.horizontalSpacing = u;
      h.sectionInset = p;
      h.offset = n;
      h.attrs = [];
      h.containerWidth = e.width;
      h.containerHeight = 0;
      for (var d = 0; d < s; d++) {
        var m = new $10yxcollectionview.YXIndexPath(r, d);
        var f = this.itemSize instanceof Function ? this.itemSize(m, this, t) : this.itemSize;
        var y = h.layout_vertical_item(m, f);
        if (null == y) {
          h.offset = h.offset + h.containerHeight + l;
          h.containerHeight = 0;
          h.attrs = [];
          y = h.layout_vertical_item(m, f);
        }
        y && o.push(y);
        n = Math.max(n, h.offset + h.containerHeight);
      }
      n += p.bottom;
    }
    this.attributes = o;
    e.height = Math.max(e.height, n);
    this.contentSize = e;
  };
  return _ctor;
}($10yxcollectionview.YXLayout);
exports.YXFlowLayout = exp_YXFlowLayout;
var c = function () {
  function t() {
    this.attrs = [];
  }
  t.prototype.intersects = function (t) {
    for (var e = 0; e < this.attrs.length; e++) {
      var o = this.attrs[e];
      var i = new cc.Rect();
      o.frame.intersection(i, t);
      if (i.width * i.height > 0) {
        return true;
      }
    }
    return false;
  };
  t.prototype.layout_vertical_item = function (t, e) {
    if (this.attrs.length <= 0) {
      (r = new $10yxcollectionview.YXLayoutAttributes()).indexPath = t;
      r.frame = new cc.Rect(this.sectionInset.left, this.offset, e.width, e.height);
      this.attrs.push(r);
      this.containerHeight = Math.max(this.containerHeight, r.frame.height);
      return r;
    }
    var o = new cc.Rect();
    o.size = e;
    for (var i = 0; i < this.attrs.length; i++) {
      var n = this.attrs[i];
      o.x = n.frame.xMax + this.horizontalSpacing;
      o.y = n.frame.y;
      if (o.xMax <= this.containerWidth - this.sectionInset.right && 0 == this.intersects(o)) {
        (r = new $10yxcollectionview.YXLayoutAttributes()).indexPath = t;
        r.frame = o;
        this.attrs.push(r);
        this.containerHeight = Math.max(this.containerHeight, r.frame.yMax - this.offset);
        return r;
      }
    }
    for (i = 0; i < this.attrs.length; i++) {
      var r;
      n = this.attrs[i];
      o.x = n.frame.x;
      o.y = n.frame.yMax + this.verticalSpacing;
      if (o.yMax <= this.offset + this.containerHeight && 0 == this.intersects(o)) {
        (r = new $10yxcollectionview.YXLayoutAttributes()).indexPath = t;
        r.frame = o;
        this.attrs.push(r);
        this.containerHeight = Math.max(this.containerHeight, r.frame.height);
        return r;
      }
    }
    return null;
  };
  t.prototype.layout_horizontal_item = function (t, e) {
    if (this.attrs.length <= 0) {
      (r = new $10yxcollectionview.YXLayoutAttributes()).indexPath = t;
      r.frame = new cc.Rect(this.offset, this.sectionInset.top, e.width, e.height);
      this.attrs.push(r);
      this.containerWidth = Math.max(this.containerWidth, r.frame.width);
      return r;
    }
    var o = new cc.Rect();
    o.size = e;
    for (var i = 0; i < this.attrs.length; i++) {
      var n = this.attrs[i];
      o.x = n.frame.x;
      o.y = n.frame.yMax + this.verticalSpacing;
      if (o.yMax <= this.containerHeight - this.sectionInset.bottom && 0 == this.intersects(o)) {
        (r = new $10yxcollectionview.YXLayoutAttributes()).indexPath = t;
        r.frame = o;
        this.attrs.push(r);
        this.containerWidth = Math.max(this.containerWidth, r.frame.xMax - this.offset);
        return r;
      }
    }
    for (i = 0; i < this.attrs.length; i++) {
      var r;
      n = this.attrs[i];
      o.x = n.frame.xMax + this.horizontalSpacing;
      o.y = n.frame.y;
      if (o.xMax <= this.offset + this.containerWidth && 0 == this.intersects(o)) {
        (r = new $10yxcollectionview.YXLayoutAttributes()).indexPath = t;
        r.frame = o;
        this.attrs.push(r);
        this.containerWidth = Math.max(this.containerWidth, r.frame.width);
        return r;
      }
    }
    return null;
  };
  return t;
}();