var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YXCollectionView = exports.YXLayout = exports.YXLayoutAttributes = exports.YXEdgeInsets = exports.YXIndexPath = undefined;
var r;
var s;
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
cc__decorator.requireComponent;
var ccp_executionOrder = cc__decorator.executionOrder;
var ccp_disallowMultiple = cc__decorator.disallowMultiple;
var ccp_help = cc__decorator.help;
var cc_Enum = cc.Enum;
var cc_Node = cc.Node;
var cc_Prefab = cc.Prefab;
var cc_ValueType = cc.ValueType;
var cc_NodePool = cc.NodePool;
var cc_Component = cc.Component;
var cc_ScrollView = cc.ScrollView;
cc.Event.EventMouse;
cc.Event.EventTouch;
var cc_Mask = cc.Mask;
var D = cc.Node.EventType;
var S = new cc.Vec3();
var E = new cc.Rect();
var C = new cc.Rect();
(function (t) {
  t[t.HORIZONTAL = 0] = "HORIZONTAL";
  t[t.VERTICAL = 1] = "VERTICAL";
})(r || (r = {}));
cc_Enum(r);
(function (t) {
  t[t.RECYCLE = 0] = "RECYCLE";
  t[t.PRELOAD = 1] = "PRELOAD";
})(s || (s = {}));
cc_Enum(s);
var B = function () {
  function t() {
    this.prefab = null;
    this.identifier = "";
    this.comp = "";
  }
  cc__decorate([ccp_property({
    type: cc_Prefab,
    tooltip: "cell 节点预制体，必须配置"
  })], t.prototype, "prefab", undefined);
  cc__decorate([ccp_property({
    tooltip: "节点重用标识符\n如果确定此列表仅使用一种节点类型，可以忽略此配置"
  })], t.prototype, "identifier", undefined);
  cc__decorate([ccp_property({
    tooltip: "节点挂载的自定义组件\n如果需要监听 NodePool 的重用/回收事件，确保你的自定义组件已经实现了 YXCollectionViewCell 接口并配置此属性为你的自定义组件名\n如果不需要，可以忽略此配置"
  })], t.prototype, "comp", undefined);
  return cc__decorate([ccp_ccclass("_yx_editor_register_cell_info")], t);
}();
var exp_YXIndexPath = function (t) {
  function _ctor(e, o) {
    var i = t.call(this) || this;
    i.section = 0;
    i.item = 0;
    i.section = e;
    i.item = o;
    return i;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "row", {
    get: function () {
      return this.item;
    },
    set: function (t) {
      this.item = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.clone = function () {
    return new _ctor(this.section, this.item);
  };
  _ctor.prototype.equals = function (t) {
    return this.section == t.section && this.item == t.item;
  };
  _ctor.prototype.set = function (t) {
    this.section = t.section;
    this.item = t.item;
  };
  _ctor.prototype.toString = function () {
    return this.section + " - " + this.item;
  };
  _ctor.ZERO = new _ctor(0, 0);
  return _ctor;
}(cc_ValueType);
exports.YXIndexPath = exp_YXIndexPath;
var exp_YXEdgeInsets = function (t) {
  function e(e, o, i, n) {
    var a = t.call(this) || this;
    a.top = e;
    a.left = o;
    a.bottom = i;
    a.right = n;
    return a;
  }
  cc__extends(e, t);
  e.prototype.clone = function () {
    return new e(this.top, this.left, this.bottom, this.right);
  };
  e.prototype.equals = function (t) {
    return this.top == t.top && this.left == t.left && this.bottom == t.bottom && this.right == t.right;
  };
  e.prototype.set = function (t) {
    this.top = t.top;
    this.left = t.left;
    this.bottom = t.bottom;
    this.right = t.right;
  };
  e.prototype.toString = function () {
    return "[ " + this.top + ", " + this.left + ", " + this.bottom + ", " + this.right + " ]";
  };
  e.ZERO = new e(0, 0, 0, 0);
  return e;
}(cc_ValueType);
exports.YXEdgeInsets = exp_YXEdgeInsets;
var w = function (t) {
  function e() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(e, t);
  return e;
}(cc_Component);
var A = function (t) {
  function e() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(e, t);
  e.prototype._onMouseWheel = function () {};
  e.prototype._startInertiaScroll = function (e) {
    t.prototype._startInertiaScroll.call(this, e);
    this._yxOnStartInertiaScroll && this._yxOnStartInertiaScroll(e);
  };
  e.prototype._onTouchBegan = function (e, o) {
    if (0 != this.node.getComponent(exp_YXCollectionView).scrollEnabled) {
      var i = [e.target];
      o && (i = i.concat(o));
      for (var n = 0; n < i.length; n++) {
        var a = i[n];
        a._yx_scroll_target = null;
        var r = a.getComponent(exp_YXCollectionView);
        if (r) {
          var s = r.scrollView.getScrollOffset();
          s.x = -s.x;
          r._scroll_offset_on_touch_start = s;
        }
      }
      t.prototype._onTouchBegan.call(this, e, o);
    }
  };
  e.prototype._onTouchMoved = function (e, o) {
    if (0 != this.node.getComponent(exp_YXCollectionView).scrollEnabled) {
      var i = this._yxGetScrollTarget(e, o);
      this.node === i && t.prototype._onTouchMoved.call(this, e, o);
    }
  };
  e.prototype.hasNestedViewGroup = function () {
    return false;
  };
  e.prototype._stopPropagationIfTargetIsMe = function (e) {
    if (1 != this._touchMoved) {
      t.prototype._stopPropagationIfTargetIsMe.call(this, e);
    } else {
      e.stopPropagation();
    }
  };
  e.prototype._yxGetScrollTarget = function (t, o) {
    var i = t.target._yx_scroll_target;
    if (i) {
      return i;
    }
    var n = [t.target];
    o && (n = n.concat(o));
    if (1 == n.length) {
      return n[0];
    }
    var a = t.touch;
    var r = a.getLocation().subtract(a.getStartLocation());
    var s = Math.abs(r.x);
    var c = Math.abs(r.y);
    if (Math.abs(s - c) < 5) {
      return null;
    }
    var l = null;
    for (var u = 0; u < n.length; u++) {
      var p = (d = n[u]).getComponent(e);
      if (p) {
        var h = d.getComponent(exp_YXCollectionView);
        if (h && 0 == h.scrollEnabled) {
          continue;
        }
        null == l && (l = d);
        if (p.horizontal && p.vertical) {
          continue;
        }
        if (!p.horizontal && !p.vertical) {
          continue;
        }
        if (p.horizontal && s > c) {
          l = d;
          break;
        }
        if (p.vertical && c > s) {
          l = d;
          break;
        }
      }
    }
    if (l) {
      for (u = 0; u < n.length; u++) {
        var d;
        (d = n[u])._yx_scroll_target = l;
      }
    }
    return l;
  };
  return e;
}(cc_ScrollView);
exports.YXLayoutAttributes = function () {
  this.indexPath = null;
  this.frame = null;
  this.zIndex = 0;
  this.opacity = null;
  this.scale = null;
  this.offset = null;
  this.eulerAngles = null;
};
var exp_YXLayout = function () {
  function t() {
    this.contentSize = cc.Size.ZERO;
    this.attributes = [];
  }
  t.prototype.initOffset = function () {};
  t.prototype.targetOffset = function () {
    return null;
  };
  t.prototype.onScrollEnded = function () {};
  t.prototype.layoutAttributesForElementsInRect = function (t) {
    var e = [];
    for (var o = 0; o < this.attributes.length; o++) {
      var i = this.attributes[o];
      1 == t.intersects(i.frame) && e.push(i);
    }
    return e;
  };
  t.prototype.layoutAttributesForItemAtIndexPath = function (t) {
    return this.attributes.find(function (e) {
      return e.indexPath.equals(t);
    });
  };
  t.prototype.scrollTo = function () {
    return null;
  };
  t.prototype.shouldUpdateAttributesZIndex = function () {
    return false;
  };
  t.prototype.shouldUpdateAttributesOpacity = function () {
    return false;
  };
  t.prototype.shouldUpdateAttributesForBoundsChange = function () {
    return false;
  };
  return t;
}();
exports.YXLayout = exp_YXLayout;
var exp_YXCollectionView = function (t) {
  function e() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mask = true;
    e.scrollEnabled = true;
    e.scrollDirection = o.ScrollDirection.VERTICAL;
    e.mode = o.Mode.RECYCLE;
    e.preloadNodesLimitPerFrame = 2;
    e.preloadProgress = null;
    e.frameInterval = 1;
    e.recycleInterval = 1;
    e.registerCellForEditor = [];
    e.pools = new Map();
    e.makers = new Map();
    e.numberOfSections = 1;
    e.numberOfItems = 0;
    e.cellForItemAt = null;
    e.onCellDisplay = null;
    e.onCellEndDisplay = null;
    e.onTouchItemAt = null;
    e.layout = null;
    e.visibleNodesMap = new Map();
    e.preloadNodesMap = new Map();
    e._late_reload_data = false;
    e.reloadDataCounter = 0;
    e._frameIdx = 0;
    e._late_update_visible_data = false;
    e._late_recycle_invisible_node = false;
    e.preloadIdx = null;
    e._scroll_offset_on_touch_start = null;
    return e;
  }
  var o;
  cc__extends(e, t);
  o = e;
  Object.defineProperty(e.prototype, "scrollView", {
    get: function () {
      var t = this.node.getComponent(A);
      null == t && (t = this.node.addComponent(A));
      if (null == t.content) {
        var e = new cc_Node("com.yx.scroll.content");
        e.parent = t.node;
        e.setContentSize(this.node.getContentSize());
        t.content = e;
      }
      if (this.mask) {
        var o = t.node.getComponent(cc_Mask);
        null == o && ((o = t.node.addComponent(cc_Mask)).type = cc_Mask.Type.RECT);
      }
      return t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(e.prototype, "_scrollView", {
    get: function () {
      return this.scrollView;
    },
    enumerable: false,
    configurable: true
  });
  e.prototype.register = function (t, e, o) {
    undefined === o && (o = null);
    var i = new cc_NodePool(o);
    this.pools.set(t, i);
    this.makers.set(t, e);
  };
  e.prototype.dequeueReusableCell = function (t) {
    var e = this.pools.get(t);
    if (null == e) {
      throw new Error("YXCollectionView: 未注册标识符为 `" + t + "` 的 cell，请先调用 YXCollectionView 的 register() 方法注册 cell 节点");
    }
    var o = null;
    null == o && (o = e.get());
    if (null == o) {
      ((o = this.makers.get(t)()).getComponent(w) || o.addComponent(w)).identifier = t;
      o.on(D.TOUCH_END, this.onTouchItem, this);
    }
    return o;
  };
  e.prototype.onTouchItem = function (t) {
    if (this.onTouchItemAt) {
      var e = t.target.getComponent(w);
      this.onTouchItemAt(e.attributes.indexPath, this);
    }
  };
  Object.defineProperty(e.prototype, "visibleRect", {
    get: function () {
      var t = E;
      t.origin = this.scrollView.getScrollOffset();
      t.x = -t.x;
      t.size = this.scrollView.node.getContentSize();
      return t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(e.prototype, "visibleNodes", {
    get: function () {
      var t = [];
      this.visibleNodesMap.forEach(function (e) {
        t.push(e);
      });
      return t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(e.prototype, "visibleCells", {
    get: function () {
      var t = [];
      this.visibleNodesMap.forEach(function (e) {
        t.push(e.getComponent(w));
      });
      return t;
    },
    enumerable: false,
    configurable: true
  });
  e.prototype.getVisibleNode = function (t) {
    return this.visibleNodesMap.get(t.toString());
  };
  e.prototype.getVisibleCell = function (t) {
    var e = this.getVisibleNode(t);
    if (null == e) {
      return null;
    } else {
      return e.getComponent(w);
    }
  };
  e.prototype.getCellComp = function (t) {
    if (null == t) {
      return null;
    } else {
      return t.getComponent(w);
    }
  };
  e.prototype.reloadData = function () {
    if (this.node.activeInHierarchy && this.node.parent) {
      this._reloadData();
    } else {
      this._late_reload_data = true;
    }
  };
  e.prototype.update_reloadDataIfNeeds = function () {
    0 != this._late_reload_data && this._reloadData();
  };
  e.prototype._reloadData = function () {
    var t = this;
    this._late_reload_data = false;
    if (null == this.layout) {
      throw new Error("YXCollectionView: 参数错误，请正确配置 layout 以确定布局方案");
    }
    this.scrollView.stopAutoScroll();
    this.pools.forEach(function (t) {
      t.clear();
    });
    if (this.mode == s.RECYCLE) {
      this.visibleNodesMap.forEach(function (e, o) {
        var i = e.getComponent(w);
        t.pools.get(i.identifier).put(e);
        t.visibleNodesMap.delete(o);
        t.onCellEndDisplay && t.onCellEndDisplay(i.node, i.attributes.indexPath, t);
      });
      this.visibleNodesMap.clear();
    }
    if (this.mode == s.PRELOAD) {
      this.visibleNodesMap.forEach(function (t) {
        if (t) {
          t.removeFromParent();
          t.destroy();
        }
      });
      this.visibleNodesMap.clear();
      this.preloadNodesMap.forEach(function (t) {
        if (t) {
          t.removeFromParent();
          t.destroy();
        }
      });
      this.preloadNodesMap.clear();
      this.preloadIdx = 0;
    }
    var e = this.scrollView.getScrollOffset();
    e.x = -e.x;
    this.layout.prepare(this);
    this.scrollView.content.setContentSize(this.layout.contentSize);
    if (this.reloadDataCounter <= 0) {
      this.layout.initOffset(this);
    } else {
      var o = this.scrollView.getMaxScrollOffset();
      cc.Vec2.min(e, e, o);
      this.scrollView.scrollToOffset(e);
    }
    this.markForUpdateVisibleData(true);
    this.reloadDataCounter++;
  };
  e.prototype.reloadVisibleCells = function (t) {
    undefined === t && (t = null);
    null == t && (t = this.visibleRect);
    var e = this.layout.layoutAttributesForElementsInRect(t, this);
    var o = this.layout.shouldUpdateAttributesZIndex();
    if (o) {
      null != e && e != this.layout.attributes || (e = this.layout.attributes.slice());
      e.sort(function (t, e) {
        return t.zIndex - e.zIndex;
      });
    }
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      var a = null;
      null == a && (a = this.preloadNodesMap.get(n.indexPath.toString()));
      null == a && (a = this.getVisibleNode(n.indexPath));
      null == a && (a = this.cellForItemAt(n.indexPath, this));
      if (null == a) {
        throw new Error("需要实现 cellForItemAt 方法并确保正确的返回了节点");
      }
      var r = this.restoreCellNodeIfNeeds(a);
      this.applyLayoutAttributes(a, n);
      o && a.setSiblingIndex(-1);
      this.visibleNodesMap.set(n.indexPath.toString(), a);
      1 == r && this.onCellDisplay && this.onCellDisplay(a, n.indexPath, this);
    }
    e = [];
  };
  e.prototype.restoreCellNodeIfNeeds = function (t) {
    var e = 0;
    if (t.parent != this.scrollView.content) {
      t.parent = this.scrollView.content;
      e = 1;
    }
    if (this.mode == s.PRELOAD && 255 !== t.opacity) {
      t.opacity = 255;
      e = 1;
    }
    return e;
  };
  e.prototype.recycleInvisibleNodes = function (t) {
    var e = this;
    undefined === t && (t = null);
    null == t && (t = this.visibleRect);
    var o = C;
    var i = this.scrollView.content.getContentSize();
    this.visibleNodesMap.forEach(function (n, a) {
      var r = n.getComponent(w);
      var c = n.getBoundingBox();
      o.size = c.size;
      o.x = .5 * (i.width - o.width) + n.position.x;
      o.y = .5 * (i.height - o.height) - n.position.y;
      if (0 == t.intersects(o)) {
        if (e.mode == s.PRELOAD) {
          n.opacity = 0, e.preloadNodesMap.set(r.attributes.indexPath.toString(), n);
        } else {
          e.pools.get(r.identifier).put(n);
        }
        e.visibleNodesMap.delete(a);
        e.onCellEndDisplay && e.onCellEndDisplay(r.node, r.attributes.indexPath, e);
      }
    });
  };
  e.prototype.applyLayoutAttributes = function (t, e) {
    t.getComponent(w).attributes = e;
    t.setContentSize(e.frame.size);
    S.x = .5 * -(this.layout.contentSize.width - e.frame.width) + e.frame.x;
    S.y = .5 * +(this.layout.contentSize.height - e.frame.height) - e.frame.y;
    S.z = t.position.z;
    e.offset && cc.Vec3.add(S, S, e.offset);
    t.position = S;
    if (e.scale) {
      t.scaleX = e.scale.x;
      t.scaleY = e.scale.y;
      t.scaleZ = e.scale.z;
    }
    e.eulerAngles && (t.eulerAngles = e.eulerAngles);
    this.layout.shouldUpdateAttributesOpacity() && e.opacity && (t.opacity = e.opacity);
  };
  e.prototype.scrollTo = function (t, e, o) {
    var i;
    undefined === e && (e = 0);
    undefined === o && (o = true);
    var n = this.layout.scrollTo(t, this);
    null == n && (n = null === (i = this.layout.layoutAttributesForItemAtIndexPath(t, this)) || undefined === i ? undefined : i.frame.origin);
    if (n) {
      this.scrollView.stopAutoScroll();
      this.scrollView.scrollToOffset(n, e, o);
      this.markForUpdateVisibleData();
    }
  };
  e.prototype.onLoad = function () {
    var t = function (t) {
      var o = e.registerCellForEditor[t];
      e.register(o.identifier, function () {
        return cc.instantiate(o.prefab);
      }, o.comp);
    };
    var e = this;
    for (var o = 0; o < this.registerCellForEditor.length; o++) {
      t(o);
    }
    this.node.on("scroll-began", this.onScrollBegan, this);
    this.node.on("scrolling", this.onScrolling, this);
    this.node.on("touch-up", this.onScrollTouchUp, this);
    this.node.on("scroll-ended", this.onScrollEnded, this);
    this._scrollView._yxOnStartInertiaScroll = this.onStartInertiaScroll.bind(this);
  };
  e.prototype.onDestroy = function () {
    this.node.off("scroll-began", this.onScrollBegan, this);
    this.node.off("scrolling", this.onScrolling, this);
    this.node.off("touch-up", this.onScrollTouchUp, this);
    this.node.off("scroll-ended", this.onScrollEnded, this);
    this.visibleNodesMap.forEach(function (t) {
      if (t && t.isValid) {
        t.removeFromParent();
        t.destroy();
      }
    });
    this.visibleNodesMap.clear();
    this.visibleNodesMap = null;
    this.preloadNodesMap.forEach(function (t) {
      if (t && t.isValid) {
        t.removeFromParent();
        t.destroy();
      }
    });
    this.preloadNodesMap.clear();
    this.preloadNodesMap = null;
    this.pools.forEach(function (t) {
      t.clear();
    });
    this.pools.clear();
    this.pools = null;
    this.makers.clear();
    this.makers = null;
    this.layout && (this.layout.attributes = []);
  };
  e.prototype.update = function (t) {
    this._frameIdx++;
    this.update_reloadVisibleCellsIfNeeds(t);
    this.update_recycleInvisibleNodesIfNeeds(t);
    this.update_reloadDataIfNeeds(t);
    this.update_preloadNodeIfNeeds(t);
  };
  e.prototype.markForUpdateVisibleData = function (t) {
    undefined === t && (t = false);
    if (t) {
      var e = this.visibleRect;
      this.reloadVisibleCells(e);
      return void this.recycleInvisibleNodes(e);
    }
    this._late_update_visible_data = true;
    this._late_recycle_invisible_node = true;
  };
  e.prototype.update_reloadVisibleCellsIfNeeds = function () {
    if ((this.frameInterval <= 1 || this._frameIdx % this.frameInterval == 0) && this._late_update_visible_data) {
      this._late_update_visible_data = false;
      this.reloadVisibleCells();
    }
  };
  e.prototype.update_recycleInvisibleNodesIfNeeds = function () {
    if (this.recycleInterval >= 1 && this._frameIdx % this.recycleInterval == 0 && this._late_recycle_invisible_node) {
      this._late_recycle_invisible_node = false;
      this.recycleInvisibleNodes();
    }
  };
  e.prototype.update_preloadNodeIfNeeds = function () {
    if (this.mode === s.PRELOAD && null != this.preloadIdx && !(this.preloadIdx >= this.layout.attributes.length || this.preloadNodesLimitPerFrame <= 0)) {
      var t = 0;
      for (var e = false; !e && t < this.preloadNodesLimitPerFrame;) {
        var o = this.layout.attributes[this.preloadIdx];
        var i = o.indexPath.toString();
        var n = null;
        null == n && (n = this.getVisibleNode(o.indexPath));
        null == n && (n = this.preloadNodesMap.get(i));
        if (null == n) {
          n = this.cellForItemAt(o.indexPath, this);
          this.restoreCellNodeIfNeeds(n);
          this.applyLayoutAttributes(n, o);
          this.visibleNodesMap.set(i, n);
          this._late_recycle_invisible_node = true;
        }
        this.preloadNodesMap.set(i, n);
        this.preloadIdx++;
        t++;
        this.preloadProgress && this.preloadProgress(this.preloadIdx, this.layout.attributes.length);
        e = this.preloadIdx >= this.layout.attributes.length;
      }
    }
  };
  e.prototype.onScrollBegan = function () {};
  e.prototype.onScrolling = function () {
    this.markForUpdateVisibleData(this.layout.shouldUpdateAttributesForBoundsChange());
    this._late_recycle_invisible_node = true;
  };
  e.prototype.onScrollTouchUp = function () {
    this.recycleInvisibleNodes();
  };
  e.prototype.onScrollEnded = function () {
    this.markForUpdateVisibleData();
    this.recycleInvisibleNodes();
    this.layout.onScrollEnded(this);
  };
  e.prototype.onStartInertiaScroll = function (t) {
    var e = this.layout.targetOffset(this, t, this._scroll_offset_on_touch_start);
    if (e) {
      this.scrollView.scrollToOffset(e.offset, e.time);
      this.markForUpdateVisibleData();
    }
  };
  Object.defineProperty(e.prototype, "visibleIndexPaths", {
    get: function () {
      var t = [];
      this.visibleNodesMap.forEach(function (e) {
        var o = e.getComponent(w);
        t.push(o.attributes.indexPath.clone());
      });
      return t;
    },
    enumerable: false,
    configurable: true
  });
  e.prototype.getVisibleNodeIndexPath = function (t) {
    var e = this.getCellComp(t);
    if (e) {
      return e.attributes.indexPath;
    } else {
      return null;
    }
  };
  e.ScrollDirection = r;
  e.Mode = s;
  cc__decorate([ccp_property({
    tooltip: "自动给挂载节点添加 mask 组件",
    visible: true
  })], e.prototype, "mask", undefined);
  cc__decorate([ccp_property({
    tooltip: "允许手势滚动"
  })], e.prototype, "scrollEnabled", undefined);
  cc__decorate([ccp_property({
    type: r,
    tooltip: "列表滚动方向"
  })], e.prototype, "scrollDirection", undefined);
  cc__decorate([ccp_property({
    type: s,
    tooltip: "列表单元节点加载模式 (详细区别查看枚举注释)\nRECYCLE: 根据列表显示范围加载需要的节点，同类型的节点会进行复用\nPRELOAD: 会实例化所有节点，并非真正的虚拟列表，仅仅是把显示范围外的节点透明了，如果列表数据量很大仍然会卡"
  })], e.prototype, "mode", undefined);
  cc__decorate([ccp_property({
    tooltip: "预加载模式下每帧加载多少个节点",
    visible: function () {
      return this.mode == s.PRELOAD;
    }
  })], e.prototype, "preloadNodesLimitPerFrame", undefined);
  cc__decorate([ccp_property({
    tooltip: "每多少帧刷新一次可见节点，1 表示每帧都刷"
  })], e.prototype, "frameInterval", undefined);
  cc__decorate([ccp_property({
    tooltip: "滚动过程中，每多少帧回收一次不可见节点，1表示每帧都回收，0表示不在滚动过程中回收不可见节点"
  })], e.prototype, "recycleInterval", undefined);
  cc__decorate([ccp_property({
    type: [B],
    visible: true,
    displayName: "Register Cells",
    tooltip: "配置此列表内需要用到的 cell 节点类型"
  })], e.prototype, "registerCellForEditor", undefined);
  return o = cc__decorate([ccp_ccclass, ccp_disallowMultiple, ccp_executionOrder(-1), ccp_help("https://gitee.com/568071718/creator-collection-view-doc")], e);
}(cc_Component);
exports.YXCollectionView = exp_YXCollectionView;