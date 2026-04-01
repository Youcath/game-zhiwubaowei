var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var r;
var s;
var c;
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_disallowMultiple = cc__decorator.disallowMultiple;
var ccp_menu = cc__decorator.menu;
var ccp_executionOrder = cc__decorator.executionOrder;
var ccp_requireComponent = cc__decorator.requireComponent;
var $10ListItem = require("ListItem");
(function (t) {
  t[t.NODE = 1] = "NODE";
  t[t.PREFAB = 2] = "PREFAB";
})(r || (r = {}));
(function (t) {
  t[t.NORMAL = 1] = "NORMAL";
  t[t.ADHERING = 2] = "ADHERING";
  t[t.PAGE = 3] = "PAGE";
})(s || (s = {}));
(function (t) {
  t[t.NONE = 0] = "NONE";
  t[t.SINGLE = 1] = "SINGLE";
  t[t.MULT = 2] = "MULT";
})(c || (c = {}));
var def_List = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.templateType = r.NODE;
    e.tmpNode = null;
    e.tmpPrefab = null;
    e._slideMode = s.NORMAL;
    e.pageDistance = .3;
    e.pageItemNum = 1;
    e.pageChangeEvent = new cc.Component.EventHandler();
    e._virtual = true;
    e.cyclic = false;
    e.lackCenter = false;
    e.lackSlide = false;
    e._updateRate = 0;
    e.frameByFrameRenderNum = 0;
    e.renderEvent = new cc.Component.EventHandler();
    e.selectedMode = c.NONE;
    e.repeatEventSingle = false;
    e.selectedEvent = new cc.Component.EventHandler();
    e._selectedId = -1;
    e._forceUpdate = false;
    e._updateDone = true;
    e._numItems = 0;
    e._inited = false;
    e._needUpdateWidget = false;
    e._aniDelRuning = false;
    e._doneAfterUpdate = false;
    e.adhering = false;
    e._adheringBarrier = false;
    e.curPageNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "slideMode", {
    get: function () {
      return this._slideMode;
    },
    set: function (t) {
      this._slideMode = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "virtual", {
    get: function () {
      return this._virtual;
    },
    set: function (t) {
      null != t && (this._virtual = t);
      0 != this._numItems && this._onScrolling();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "updateRate", {
    get: function () {
      return this._updateRate;
    },
    set: function (t) {
      t >= 0 && t <= 6 && (this._updateRate = t);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "selectedId", {
    get: function () {
      return this._selectedId;
    },
    set: function (t) {
      var e;
      var o = this;
      switch (o.selectedMode) {
        case c.SINGLE:
          if (!o.repeatEventSingle && t == o._selectedId) {
            return;
          }
          e = o.getItemByListId(t);
          var i = undefined;
          if (o._selectedId >= 0) {
            o._lastSelectedId = o._selectedId;
          } else {
            o._lastSelectedId = null;
          }
          o._selectedId = t;
          e && ((i = e.getComponent($10ListItem.default)).selected = true);
          if (o._lastSelectedId >= 0 && o._lastSelectedId != o._selectedId) {
            var n = o.getItemByListId(o._lastSelectedId);
            n && (n.getComponent($10ListItem.default).selected = false);
          }
          o.selectedEvent && cc.Component.EventHandler.emitEvents([o.selectedEvent], e, t % this._actualNumItems, null == o._lastSelectedId ? null : o._lastSelectedId % this._actualNumItems);
          break;
        case c.MULT:
          if (!(e = o.getItemByListId(t))) {
            return;
          }
          i = e.getComponent($10ListItem.default);
          o._selectedId >= 0 && (o._lastSelectedId = o._selectedId);
          o._selectedId = t;
          var a = !i.selected;
          i.selected = a;
          var r = o.multSelected.indexOf(t);
          if (a && r < 0) {
            o.multSelected.push(t);
          } else {
            !a && r >= 0 && o.multSelected.splice(r, 1);
          }
          o.selectedEvent && cc.Component.EventHandler.emitEvents([o.selectedEvent], e, t % this._actualNumItems, null == o._lastSelectedId ? null : o._lastSelectedId % this._actualNumItems, a);
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "numItems", {
    get: function () {
      return this._actualNumItems;
    },
    set: function (t) {
      var e = this;
      if (e.checkInited(false)) {
        if (null == t || t < 0) {
          cc.error("numItems set the wrong::", t);
        } else {
          e._actualNumItems = e._numItems = t;
          e._forceUpdate = true;
          if (e._virtual) {
            e._resizeContent();
            e.cyclic && (e._numItems = e._cyclicNum * e._numItems);
            e._onScrolling();
            e.frameByFrameRenderNum || e.slideMode != s.PAGE || (e.curPageNum = Math.floor(e.nearestListId / e.pageItemNum));
          } else {
            if (e.cyclic) {
              e._resizeContent();
              e._numItems = e._cyclicNum * e._numItems;
            }
            var o = e.content.getComponent(cc.Layout);
            o && (o.enabled = true);
            e._delRedundantItem();
            e.firstListId = 0;
            if (e.frameByFrameRenderNum > 0) {
              var i = e.frameByFrameRenderNum > e._numItems ? e._numItems : e.frameByFrameRenderNum;
              for (var n = 0; n < i; n++) {
                e._createOrUpdateItem2(n);
              }
              if (e.frameByFrameRenderNum < e._numItems) {
                e._updateCounter = e.frameByFrameRenderNum;
                e._updateDone = false;
              }
            } else {
              for (n = 0; n < e._numItems; n++) {
                e._createOrUpdateItem2(n);
              }
              e.displayItemNum = e._numItems;
            }
          }
        }
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "scrollView", {
    get: function () {
      return this._scrollView;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    this._init();
  };
  _ctor.prototype.onDestroy = function () {
    var t = this;
    cc.isValid(t._itemTmp) && t._itemTmp.destroy();
    cc.isValid(t.tmpNode) && t.tmpNode.destroy();
    t._pool && t._pool.clear();
  };
  _ctor.prototype.onEnable = function () {
    this._registerEvent();
    this._init();
    if (this._aniDelRuning) {
      this._aniDelRuning = false;
      if (this._aniDelItem) {
        this._aniDelBeforePos && (this._aniDelItem.position = this._aniDelBeforePos, delete this._aniDelBeforePos), this._aniDelBeforeScale && (this._aniDelItem.scale = this._aniDelBeforeScale, delete this._aniDelBeforeScale), delete this._aniDelItem;
      }
      if (this._aniDelCB) {
        this._aniDelCB(), delete this._aniDelCB;
      }
    }
  };
  _ctor.prototype.onDisable = function () {
    this._unregisterEvent();
  };
  _ctor.prototype._registerEvent = function () {
    var t = this;
    t.node.on(cc.Node.EventType.TOUCH_START, t._onTouchStart, t, true);
    t.node.on("touch-up", t._onTouchUp, t);
    t.node.on(cc.Node.EventType.TOUCH_CANCEL, t._onTouchCancelled, t, true);
    t.node.on("scroll-began", t._onScrollBegan, t, true);
    t.node.on("scroll-ended", t._onScrollEnded, t, true);
    t.node.on("scrolling", t._onScrolling, t, true);
    t.node.on(cc.Node.EventType.SIZE_CHANGED, t._onSizeChanged, t);
  };
  _ctor.prototype._unregisterEvent = function () {
    var t = this;
    t.node.off(cc.Node.EventType.TOUCH_START, t._onTouchStart, t, true);
    t.node.off("touch-up", t._onTouchUp, t);
    t.node.off(cc.Node.EventType.TOUCH_CANCEL, t._onTouchCancelled, t, true);
    t.node.off("scroll-began", t._onScrollBegan, t, true);
    t.node.off("scroll-ended", t._onScrollEnded, t, true);
    t.node.off("scrolling", t._onScrolling, t, true);
    t.node.off(cc.Node.EventType.SIZE_CHANGED, t._onSizeChanged, t);
  };
  _ctor.prototype._init = function () {
    var t = this;
    if (!t._inited) {
      t._scrollView = t.node.getComponent(cc.ScrollView);
      t.content = t._scrollView.content;
      if (t.content) {
        t._layout = t.content.getComponent(cc.Layout);
        t._align = t._layout.type;
        t._resizeMode = t._layout.resizeMode;
        t._startAxis = t._layout.startAxis;
        t._topGap = t._layout.paddingTop;
        t._rightGap = t._layout.paddingRight;
        t._bottomGap = t._layout.paddingBottom;
        t._leftGap = t._layout.paddingLeft;
        t._columnGap = t._layout.spacingX;
        t._lineGap = t._layout.spacingY;
        t._colLineNum;
        t._verticalDir = t._layout.verticalDirection;
        t._horizontalDir = t._layout.horizontalDirection;
        t.setTemplateItem(cc.instantiate(t.templateType == r.PREFAB ? t.tmpPrefab : t.tmpNode));
        if (!(t._slideMode != s.ADHERING && t._slideMode != s.PAGE)) {
          t._scrollView.inertia = false;
          t._scrollView._onMouseWheel = function () {};
        }
        t.virtual || (t.lackCenter = false);
        t._lastDisplayData = [];
        t.displayData = [];
        t._pool = new cc.NodePool();
        t._forceUpdate = false;
        t._updateCounter = 0;
        t._updateDone = true;
        t.curPageNum = 0;
        if (t.cyclic) {
          t._scrollView._processAutoScrolling = this._processAutoScrolling.bind(t);
          t._scrollView._startBounceBackIfNeeded = function () {
            return false;
          };
        }
        switch (t._align) {
          case cc.Layout.Type.HORIZONTAL:
            switch (t._horizontalDir) {
              case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                t._alignCalcType = 1;
                break;
              case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                t._alignCalcType = 2;
            }
            break;
          case cc.Layout.Type.VERTICAL:
            switch (t._verticalDir) {
              case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                t._alignCalcType = 3;
                break;
              case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                t._alignCalcType = 4;
            }
            break;
          case cc.Layout.Type.GRID:
            switch (t._startAxis) {
              case cc.Layout.AxisDirection.HORIZONTAL:
                switch (t._verticalDir) {
                  case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                    t._alignCalcType = 3;
                    break;
                  case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                    t._alignCalcType = 4;
                }
                break;
              case cc.Layout.AxisDirection.VERTICAL:
                switch (t._horizontalDir) {
                  case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                    t._alignCalcType = 1;
                    break;
                  case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                    t._alignCalcType = 2;
                }
            }
        }
        t.content.children.forEach(function (e) {
          e.removeFromParent();
          e != t.tmpNode && e.isValid && e.destroy();
        });
        t._inited = true;
      } else {
        cc.error(t.node.name + "'s cc.ScrollView unset content!");
      }
    }
  };
  _ctor.prototype._processAutoScrolling = function (t) {
    this._scrollView._autoScrollAccumulatedTime += 1 * t;
    var e = Math.min(1, this._scrollView._autoScrollAccumulatedTime / this._scrollView._autoScrollTotalTime);
    if (this._scrollView._autoScrollAttenuate) {
      var o = e - 1;
      e = o * o * o * o * o + 1;
    }
    var i = this._scrollView._autoScrollStartPosition.add(this._scrollView._autoScrollTargetDelta.mul(e));
    var n = this._scrollView.getScrollEndedEventTiming();
    var a = Math.abs(e - 1) <= n;
    if (Math.abs(e - 1) <= this._scrollView.getScrollEndedEventTiming() && !this._scrollView._isScrollEndedWithThresholdEventFired) {
      this._scrollView._dispatchEvent("scroll-ended-with-threshold");
      this._scrollView._isScrollEndedWithThresholdEventFired = true;
    }
    a && (this._scrollView._autoScrolling = false);
    var r = i.sub(this._scrollView.getContentPosition());
    this._scrollView._moveContent(this._scrollView._clampDelta(r), a);
    this._scrollView._dispatchEvent("scrolling");
    if (!this._scrollView._autoScrolling) {
      this._scrollView._isBouncing = false;
      this._scrollView._scrolling = false;
      this._scrollView._dispatchEvent("scroll-ended");
    }
  };
  _ctor.prototype.setTemplateItem = function (t) {
    if (t) {
      var e = this;
      e._itemTmp = t;
      if (e._resizeMode == cc.Layout.ResizeMode.CHILDREN) {
        e._itemSize = e._layout.cellSize;
      } else {
        e._itemSize = cc.size(t.width, t.height);
      }
      var o = t.getComponent($10ListItem.default);
      var i = false;
      o || (i = true);
      i && (e.selectedMode = c.NONE);
      (o = t.getComponent(cc.Widget)) && o.enabled && (e._needUpdateWidget = true);
      e.selectedMode == c.MULT && (e.multSelected = []);
      switch (e._align) {
        case cc.Layout.Type.HORIZONTAL:
          e._colLineNum = 1;
          e._sizeType = false;
          break;
        case cc.Layout.Type.VERTICAL:
          e._colLineNum = 1;
          e._sizeType = true;
          break;
        case cc.Layout.Type.GRID:
          switch (e._startAxis) {
            case cc.Layout.AxisDirection.HORIZONTAL:
              var n = e.content.width - e._leftGap - e._rightGap;
              e._colLineNum = Math.floor((n + e._columnGap) / (e._itemSize.width + e._columnGap));
              e._sizeType = true;
              break;
            case cc.Layout.AxisDirection.VERTICAL:
              var a = e.content.height - e._topGap - e._bottomGap;
              e._colLineNum = Math.floor((a + e._lineGap) / (e._itemSize.height + e._lineGap));
              e._sizeType = false;
          }
      }
    }
  };
  _ctor.prototype.checkInited = function (t) {
    undefined === t && (t = true);
    return !!this._inited || (t && cc.error("List initialization not completed!"), false);
  };
  _ctor.prototype._resizeContent = function () {
    var t;
    var e = this;
    switch (e._align) {
      case cc.Layout.Type.HORIZONTAL:
        if (e._customSize) {
          var o = e._getFixedSize(null);
          t = e._leftGap + o.val + e._itemSize.width * (e._numItems - o.count) + e._columnGap * (e._numItems - 1) + e._rightGap;
        } else {
          t = e._leftGap + e._itemSize.width * e._numItems + e._columnGap * (e._numItems - 1) + e._rightGap;
        }
        break;
      case cc.Layout.Type.VERTICAL:
        if (e._customSize) {
          o = e._getFixedSize(null);
          t = e._topGap + o.val + e._itemSize.height * (e._numItems - o.count) + e._lineGap * (e._numItems - 1) + e._bottomGap;
        } else {
          t = e._topGap + e._itemSize.height * e._numItems + e._lineGap * (e._numItems - 1) + e._bottomGap;
        }
        break;
      case cc.Layout.Type.GRID:
        e.lackCenter && (e.lackCenter = false);
        switch (e._startAxis) {
          case cc.Layout.AxisDirection.HORIZONTAL:
            var i = Math.ceil(e._numItems / e._colLineNum);
            t = e._topGap + e._itemSize.height * i + e._lineGap * (i - 1) + e._bottomGap;
            break;
          case cc.Layout.AxisDirection.VERTICAL:
            var n = Math.ceil(e._numItems / e._colLineNum);
            t = e._leftGap + e._itemSize.width * n + e._columnGap * (n - 1) + e._rightGap;
        }
    }
    var a = e.content.getComponent(cc.Layout);
    a && (a.enabled = false);
    e._allItemSize = t;
    e._allItemSizeNoEdge = e._allItemSize - (e._sizeType ? e._topGap + e._bottomGap : e._leftGap + e._rightGap);
    if (e.cyclic) {
      var r = e._sizeType ? e.node.height : e.node.width;
      e._cyclicPos1 = 0;
      r -= e._cyclicPos1;
      e._cyclicNum = Math.ceil(r / e._allItemSizeNoEdge) + 1;
      var s = e._sizeType ? e._lineGap : e._columnGap;
      e._cyclicPos2 = e._cyclicPos1 + e._allItemSizeNoEdge + s;
      e._cyclicAllItemSize = e._allItemSize + e._allItemSizeNoEdge * (e._cyclicNum - 1) + s * (e._cyclicNum - 1);
      e._cycilcAllItemSizeNoEdge = e._allItemSizeNoEdge * e._cyclicNum;
      e._cycilcAllItemSizeNoEdge += s * (e._cyclicNum - 1);
    }
    e._lack = !e.cyclic && e._allItemSize < (e._sizeType ? e.node.height : e.node.width);
    var c = e._lack && e.lackCenter || !e.lackSlide ? .1 : 0;
    var l = e._lack ? (e._sizeType ? e.node.height : e.node.width) - c : e.cyclic ? e._cyclicAllItemSize : e._allItemSize;
    l < 0 && (l = 0);
    if (e._sizeType) {
      e.content.height = l;
    } else {
      e.content.width = l;
    }
  };
  _ctor.prototype._onScrolling = function (t) {
    undefined === t && (t = null);
    null == this.frameCount && (this.frameCount = this._updateRate);
    if (!this._forceUpdate && t && "scroll-ended" != t.type && this.frameCount > 0) {
      this.frameCount--;
    } else {
      this.frameCount = this._updateRate;
      if (!this._aniDelRuning) {
        if (this.cyclic) {
          var e = this.content.getPosition();
          e = this._sizeType ? e.y : e.x;
          var o = this._allItemSizeNoEdge + (this._sizeType ? this._lineGap : this._columnGap);
          var i = this._sizeType ? cc.v2(0, o) : cc.v2(o, 0);
          switch (this._alignCalcType) {
            case 1:
              if (e > -this._cyclicPos1) {
                this.content.x = -this._cyclicPos2;
                this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(i));
              } else if (e < -this._cyclicPos2) {
                this.content.x = -this._cyclicPos1, this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(i));
              }
              break;
            case 2:
              if (e < this._cyclicPos1) {
                this.content.x = this._cyclicPos2;
                this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(i));
              } else if (e > this._cyclicPos2) {
                this.content.x = this._cyclicPos1, this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(i));
              }
              break;
            case 3:
              if (e < this._cyclicPos1) {
                this.content.y = this._cyclicPos2;
                this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(i));
              } else if (e > this._cyclicPos2) {
                this.content.y = this._cyclicPos1, this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(i));
              }
              break;
            case 4:
              if (e > -this._cyclicPos1) {
                this.content.y = -this._cyclicPos2;
                this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(i));
              } else if (e < -this._cyclicPos2) {
                this.content.y = -this._cyclicPos1, this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(i));
              }
          }
        }
        var n;
        var a;
        var r;
        var s;
        this._calcViewPos();
        if (this._sizeType) {
          n = this.viewTop;
          r = this.viewBottom;
        } else {
          a = this.viewRight;
          s = this.viewLeft;
        }
        if (this._virtual) {
          this.displayData = [];
          var c = undefined;
          var l = 0;
          var u = this._numItems - 1;
          if (this._customSize) {
            for (var p = false; l <= u && !p; l++) {
              c = this._calcItemPos(l);
              switch (this._align) {
                case cc.Layout.Type.HORIZONTAL:
                  if (c.right >= s && c.left <= a) {
                    this.displayData.push(c);
                  } else {
                    0 != l && this.displayData.length > 0 && (p = true);
                  }
                  break;
                case cc.Layout.Type.VERTICAL:
                  if (c.bottom <= n && c.top >= r) {
                    this.displayData.push(c);
                  } else {
                    0 != l && this.displayData.length > 0 && (p = true);
                  }
                  break;
                case cc.Layout.Type.GRID:
                  switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL:
                      if (c.bottom <= n && c.top >= r) {
                        this.displayData.push(c);
                      } else {
                        0 != l && this.displayData.length > 0 && (p = true);
                      }
                      break;
                    case cc.Layout.AxisDirection.VERTICAL:
                      if (c.right >= s && c.left <= a) {
                        this.displayData.push(c);
                      } else {
                        0 != l && this.displayData.length > 0 && (p = true);
                      }
                  }
              }
            }
          } else {
            var h = this._itemSize.width + this._columnGap;
            var d = this._itemSize.height + this._lineGap;
            switch (this._alignCalcType) {
              case 1:
                l = (s - this._leftGap) / h;
                u = (a - this._leftGap) / h;
                break;
              case 2:
                l = (-a - this._rightGap) / h;
                u = (-s - this._rightGap) / h;
                break;
              case 3:
                l = (-n - this._topGap) / d;
                u = (-r - this._topGap) / d;
                break;
              case 4:
                l = (r - this._bottomGap) / d;
                u = (n - this._bottomGap) / d;
            }
            l = Math.floor(l) * this._colLineNum;
            u = Math.ceil(u) * this._colLineNum;
            l < 0 && (l = 0);
            for (--u >= this._numItems && (u = this._numItems - 1); l <= u; l++) {
              this.displayData.push(this._calcItemPos(l));
            }
          }
          this._delRedundantItem();
          if (this.displayData.length <= 0 || !this._numItems) {
            return void (this._lastDisplayData = []);
          }
          this.firstListId = this.displayData[0].id;
          this.displayItemNum = this.displayData.length;
          var m = this._lastDisplayData.length;
          var f = this.displayItemNum != m;
          if (f) {
            this.frameByFrameRenderNum > 0 && this._lastDisplayData.sort(function (t, e) {
              return t - e;
            });
            f = this.firstListId != this._lastDisplayData[0] || this.displayData[this.displayItemNum - 1].id != this._lastDisplayData[m - 1];
          }
          if (this._forceUpdate || f) {
            if (this.frameByFrameRenderNum > 0) {
              if (this._numItems > 0) {
                if (this._updateDone) {
                  this._updateCounter = 0;
                } else {
                  this._doneAfterUpdate = true;
                }
                this._updateDone = false;
              } else {
                this._updateCounter = 0;
                this._updateDone = true;
              }
            } else {
              this._lastDisplayData = [];
              for (var y = 0; y < this.displayItemNum; y++) {
                this._createOrUpdateItem(this.displayData[y]);
              }
              this._forceUpdate = false;
            }
          }
          this._calcNearestItem();
        }
      }
    }
  };
  _ctor.prototype._calcViewPos = function () {
    var t = this.content.getPosition();
    switch (this._alignCalcType) {
      case 1:
        this.elasticLeft = t.x > 0 ? t.x : 0;
        this.viewLeft = (t.x < 0 ? -t.x : 0) - this.elasticLeft;
        this.viewRight = this.viewLeft + this.node.width;
        this.elasticRight = this.viewRight > this.content.width ? Math.abs(this.viewRight - this.content.width) : 0;
        this.viewRight += this.elasticRight;
        break;
      case 2:
        this.elasticRight = t.x < 0 ? -t.x : 0;
        this.viewRight = (t.x > 0 ? -t.x : 0) + this.elasticRight;
        this.viewLeft = this.viewRight - this.node.width;
        this.elasticLeft = this.viewLeft < -this.content.width ? Math.abs(this.viewLeft + this.content.width) : 0;
        this.viewLeft -= this.elasticLeft;
        break;
      case 3:
        this.elasticTop = t.y < 0 ? Math.abs(t.y) : 0;
        this.viewTop = (t.y > 0 ? -t.y : 0) + this.elasticTop;
        this.viewBottom = this.viewTop - this.node.height;
        this.elasticBottom = this.viewBottom < -this.content.height ? Math.abs(this.viewBottom + this.content.height) : 0;
        this.viewBottom += this.elasticBottom;
        break;
      case 4:
        this.elasticBottom = t.y > 0 ? Math.abs(t.y) : 0;
        this.viewBottom = (t.y < 0 ? -t.y : 0) - this.elasticBottom;
        this.viewTop = this.viewBottom + this.node.height;
        this.elasticTop = this.viewTop > this.content.height ? Math.abs(this.viewTop - this.content.height) : 0;
        this.viewTop -= this.elasticTop;
    }
  };
  _ctor.prototype._calcItemPos = function (t) {
    var e;
    var o;
    var i;
    var n;
    var a;
    var r;
    var s;
    var c;
    switch (this._align) {
      case cc.Layout.Type.HORIZONTAL:
        switch (this._horizontalDir) {
          case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
            if (this._customSize) {
              var l = this._getFixedSize(t);
              a = this._leftGap + (this._itemSize.width + this._columnGap) * (t - l.count) + (l.val + this._columnGap * l.count);
              e = (u = this._customSize[t]) > 0 ? u : this._itemSize.width;
            } else {
              a = this._leftGap + (this._itemSize.width + this._columnGap) * t;
              e = this._itemSize.width;
            }
            if (this.lackCenter) {
              a -= this._leftGap;
              a += this.content.width / 2 - this._allItemSizeNoEdge / 2;
            }
            return {
              id: t,
              left: a,
              right: r = a + e,
              x: a + this._itemTmp.anchorX * e,
              y: this._itemTmp.y
            };
          case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
            if (this._customSize) {
              l = this._getFixedSize(t);
              r = -this._rightGap - (this._itemSize.width + this._columnGap) * (t - l.count) - (l.val + this._columnGap * l.count);
              e = (u = this._customSize[t]) > 0 ? u : this._itemSize.width;
            } else {
              r = -this._rightGap - (this._itemSize.width + this._columnGap) * t;
              e = this._itemSize.width;
            }
            if (this.lackCenter) {
              r += this._rightGap;
              r -= this.content.width / 2 - this._allItemSizeNoEdge / 2;
            }
            return {
              id: t,
              right: r,
              left: a = r - e,
              x: a + this._itemTmp.anchorX * e,
              y: this._itemTmp.y
            };
        }
        break;
      case cc.Layout.Type.VERTICAL:
        switch (this._verticalDir) {
          case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
            if (this._customSize) {
              l = this._getFixedSize(t);
              i = -this._topGap - (this._itemSize.height + this._lineGap) * (t - l.count) - (l.val + this._lineGap * l.count);
              o = (u = this._customSize[t]) > 0 ? u : this._itemSize.height;
            } else {
              i = -this._topGap - (this._itemSize.height + this._lineGap) * t;
              o = this._itemSize.height;
            }
            if (this.lackCenter) {
              i += this._topGap;
              i -= this.content.height / 2 - this._allItemSizeNoEdge / 2;
            }
            return {
              id: t,
              top: i,
              bottom: n = i - o,
              x: this._itemTmp.x,
              y: n + this._itemTmp.anchorY * o
            };
          case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
            var u;
            if (this._customSize) {
              l = this._getFixedSize(t);
              n = this._bottomGap + (this._itemSize.height + this._lineGap) * (t - l.count) + (l.val + this._lineGap * l.count);
              o = (u = this._customSize[t]) > 0 ? u : this._itemSize.height;
            } else {
              n = this._bottomGap + (this._itemSize.height + this._lineGap) * t;
              o = this._itemSize.height;
            }
            if (this.lackCenter) {
              n -= this._bottomGap;
              n += this.content.height / 2 - this._allItemSizeNoEdge / 2;
            }
            return {
              id: t,
              top: i = n + o,
              bottom: n,
              x: this._itemTmp.x,
              y: n + this._itemTmp.anchorY * o
            };
        }
      case cc.Layout.Type.GRID:
        var p = Math.floor(t / this._colLineNum);
        switch (this._startAxis) {
          case cc.Layout.AxisDirection.HORIZONTAL:
            switch (this._verticalDir) {
              case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                c = (n = (i = -this._topGap - (this._itemSize.height + this._lineGap) * p) - this._itemSize.height) + this._itemTmp.anchorY * this._itemSize.height;
                break;
              case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                i = (n = this._bottomGap + (this._itemSize.height + this._lineGap) * p) + this._itemSize.height;
                c = n + this._itemTmp.anchorY * this._itemSize.height;
            }
            s = this._leftGap + t % this._colLineNum * (this._itemSize.width + this._columnGap);
            switch (this._horizontalDir) {
              case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                s += this._itemTmp.anchorX * this._itemSize.width;
                s -= this.content.anchorX * this.content.width;
                break;
              case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                s += (1 - this._itemTmp.anchorX) * this._itemSize.width;
                s -= (1 - this.content.anchorX) * this.content.width;
                s *= -1;
            }
            return {
              id: t,
              top: i,
              bottom: n,
              x: s,
              y: c
            };
          case cc.Layout.AxisDirection.VERTICAL:
            switch (this._horizontalDir) {
              case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                r = (a = this._leftGap + (this._itemSize.width + this._columnGap) * p) + this._itemSize.width;
                s = a + this._itemTmp.anchorX * this._itemSize.width;
                s -= this.content.anchorX * this.content.width;
                break;
              case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                s = (a = (r = -this._rightGap - (this._itemSize.width + this._columnGap) * p) - this._itemSize.width) + this._itemTmp.anchorX * this._itemSize.width;
                s += (1 - this.content.anchorX) * this.content.width;
            }
            c = -this._topGap - t % this._colLineNum * (this._itemSize.height + this._lineGap);
            switch (this._verticalDir) {
              case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                c -= (1 - this._itemTmp.anchorY) * this._itemSize.height;
                c += (1 - this.content.anchorY) * this.content.height;
                break;
              case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                c -= this._itemTmp.anchorY * this._itemSize.height;
                c += this.content.anchorY * this.content.height;
                c *= -1;
            }
            return {
              id: t,
              left: a,
              right: r,
              x: s,
              y: c
            };
        }
    }
  };
  _ctor.prototype._calcExistItemPos = function (t) {
    var e = this.getItemByListId(t);
    if (!e) {
      return null;
    }
    var o = {
      id: t,
      x: e.x,
      y: e.y
    };
    if (this._sizeType) {
      o.top = e.y + e.height * (1 - e.anchorY);
      o.bottom = e.y - e.height * e.anchorY;
    } else {
      o.left = e.x - e.width * e.anchorX;
      o.right = e.x + e.width * (1 - e.anchorX);
    }
    return o;
  };
  _ctor.prototype.getItemPos = function (t) {
    if (this._virtual) {
      return this._calcItemPos(t);
    } else {
      if (this.frameByFrameRenderNum) {
        return this._calcItemPos(t);
      } else {
        return this._calcExistItemPos(t);
      }
    }
  };
  _ctor.prototype._getFixedSize = function (t) {
    if (!this._customSize) {
      return null;
    }
    null == t && (t = this._numItems);
    var e = 0;
    var o = 0;
    for (var i in this._customSize) {
      if (parseInt(i) < t) {
        e += this._customSize[i];
        o++;
      }
    }
    return {
      val: e,
      count: o
    };
  };
  _ctor.prototype._onScrollBegan = function () {
    this._beganPos = this._sizeType ? this.viewTop : this.viewLeft;
  };
  _ctor.prototype._onScrollEnded = function () {
    var t = this;
    t.curScrollIsTouch = false;
    if (null != t.scrollToListId) {
      var e = t.getItemByListId(t.scrollToListId);
      t.scrollToListId = null;
      e && cc.tween(e).to(.1, {
        scale: 1.06
      }).to(.1, {
        scale: 1
      }).start();
    }
    t._onScrolling();
    if (t._slideMode != s.ADHERING || t.adhering) {
      if (t._slideMode == s.PAGE) {
        if (null != t._beganPos && t.curScrollIsTouch) {
          this._pageAdhere();
        } else {
          t.adhere();
        }
      }
    } else {
      t.adhere();
    }
  };
  _ctor.prototype._onTouchStart = function (t, e) {
    if (!this._scrollView.hasNestedViewGroup(t, e) && (this.curScrollIsTouch = true, t.eventPhase !== cc.Event.AT_TARGET || t.target !== this.node)) {
      for (var o = t.target; null == o._listId && o.parent;) {
        o = o.parent;
      }
      this._scrollItem = null != o._listId ? o : t.target;
    }
  };
  _ctor.prototype._onTouchUp = function () {
    var t = this;
    t._scrollPos = null;
    if (t._slideMode == s.ADHERING) {
      this.adhering && (this._adheringBarrier = true);
      t.adhere();
    } else if (t._slideMode == s.PAGE) {
      if (null != t._beganPos) {
        this._pageAdhere();
      } else {
        t.adhere();
      }
    }
    this._scrollItem = null;
  };
  _ctor.prototype._onTouchCancelled = function (t, e) {
    var o = this;
    if (!(o._scrollView.hasNestedViewGroup(t, e) || t.simulate)) {
      o._scrollPos = null;
      if (o._slideMode == s.ADHERING) {
        o.adhering && (o._adheringBarrier = true), o.adhere();
      } else {
        o._slideMode == s.PAGE && (null != o._beganPos ? o._pageAdhere() : o.adhere());
      }
      this._scrollItem = null;
    }
  };
  _ctor.prototype._onSizeChanged = function () {
    this.checkInited(false) && this._onScrolling();
  };
  _ctor.prototype._onItemAdaptive = function (t) {
    if (!this._sizeType && t.width != this._itemSize.width || this._sizeType && t.height != this._itemSize.height) {
      this._customSize || (this._customSize = {});
      var e = this._sizeType ? t.height : t.width;
      if (this._customSize[t._listId] != e) {
        this._customSize[t._listId] = e;
        this._resizeContent();
        this.updateAll();
        if (null != this._scrollToListId) {
          this._scrollPos = null, this.unschedule(this._scrollToSo), this.scrollTo(this._scrollToListId, Math.max(0, this._scrollToEndTime - new Date().getTime() / 1e3));
        }
      }
    }
  };
  _ctor.prototype._pageAdhere = function () {
    var t = this;
    if (t.cyclic || !(t.elasticTop > 0 || t.elasticRight > 0 || t.elasticBottom > 0 || t.elasticLeft > 0)) {
      var e = t._sizeType ? t.viewTop : t.viewLeft;
      var o = (t._sizeType ? t.node.height : t.node.width) * t.pageDistance;
      if (Math.abs(t._beganPos - e) > o) {
        switch (t._alignCalcType) {
          case 1:
          case 4:
            if (t._beganPos > e) {
              t.prePage(.5);
            } else {
              t.nextPage(.5);
            }
            break;
          case 2:
          case 3:
            if (t._beganPos < e) {
              t.prePage(.5);
            } else {
              t.nextPage(.5);
            }
        }
      } else {
        t.elasticTop <= 0 && t.elasticRight <= 0 && t.elasticBottom <= 0 && t.elasticLeft <= 0 && t.adhere();
      }
      t._beganPos = null;
    }
  };
  _ctor.prototype.adhere = function () {
    var t = this;
    if (t.checkInited() && !(t.elasticTop > 0 || t.elasticRight > 0 || t.elasticBottom > 0 || t.elasticLeft > 0)) {
      t.adhering = true;
      t._calcNearestItem();
      var e = (t._sizeType ? t._topGap : t._leftGap) / (t._sizeType ? t.node.height : t.node.width);
      t.scrollTo(t.nearestListId, .7, e);
    }
  };
  _ctor.prototype.update = function () {
    if (!(this.frameByFrameRenderNum <= 0 || this._updateDone)) {
      if (this._virtual) {
        var t = this._updateCounter + this.frameByFrameRenderNum > this.displayItemNum ? this.displayItemNum : this._updateCounter + this.frameByFrameRenderNum;
        for (var e = this._updateCounter; e < t; e++) {
          var o = this.displayData[e];
          o && this._createOrUpdateItem(o);
        }
        if (this._updateCounter >= this.displayItemNum - 1) {
          if (this._doneAfterUpdate) {
            this._updateCounter = 0;
            this._updateDone = false;
            this._doneAfterUpdate = false;
          } else {
            this._updateDone = true;
            this._delRedundantItem();
            this._forceUpdate = false;
            this._calcNearestItem();
            this.slideMode == s.PAGE && (this.curPageNum = Math.floor(this.nearestListId / this.pageItemNum));
          }
        } else {
          this._updateCounter += this.frameByFrameRenderNum;
        }
      } else if (this._updateCounter < this._numItems) {
        t = this._updateCounter + this.frameByFrameRenderNum > this._numItems ? this._numItems : this._updateCounter + this.frameByFrameRenderNum;
        for (e = this._updateCounter; e < t; e++) {
          this._createOrUpdateItem2(e);
        }
        this._updateCounter += this.frameByFrameRenderNum;
      } else {
        this._updateDone = true;
        this._calcNearestItem();
        this.slideMode == s.PAGE && (this.curPageNum = Math.floor(this.nearestListId / this.pageItemNum));
      }
    }
  };
  _ctor.prototype._createOrUpdateItem = function (t) {
    var e = this.getItemByListId(t.id);
    if (e) {
      if (this._forceUpdate && this.renderEvent) {
        e.setPosition(cc.v2(t.x, t.y));
        this._resetItemSize(e);
        this.renderEvent && cc.Component.EventHandler.emitEvents([this.renderEvent], e, t.id % this._actualNumItems);
      }
    } else {
      var o = this._pool.size() > 0;
      e = o ? this._pool.get() : cc.instantiate(this._itemTmp);
      if (!(o && cc.isValid(e))) {
        e = cc.instantiate(this._itemTmp);
        o = false;
      }
      if (e._listId != t.id) {
        e._listId = t.id;
        e.setContentSize(this._itemSize);
      }
      e.setPosition(cc.v2(t.x, t.y));
      this._resetItemSize(e);
      this.content.addChild(e);
      if (o && this._needUpdateWidget) {
        var i = e.getComponent(cc.Widget);
        i && i.updateAlignment();
      }
      e.setSiblingIndex(this.content.childrenCount - 1);
      var n = e.getComponent($10ListItem.default);
      e.listItem = n;
      if (n) {
        n.listId = t.id;
        n.list = this;
        n._registerEvent();
      }
      this.renderEvent && cc.Component.EventHandler.emitEvents([this.renderEvent], e, t.id % this._actualNumItems);
    }
    this._resetItemSize(e);
    this._updateListItem(e.listItem);
    this._lastDisplayData.indexOf(t.id) < 0 && this._lastDisplayData.push(t.id);
  };
  _ctor.prototype._createOrUpdateItem2 = function (t) {
    var e;
    var o = this.content.children[t];
    if (o) {
      if (this._forceUpdate && this.renderEvent) {
        o._listId = t, e && (e.listId = t), this.renderEvent && cc.Component.EventHandler.emitEvents([this.renderEvent], o, t % this._actualNumItems);
      }
    } else {
      (o = cc.instantiate(this._itemTmp))._listId = t;
      this.content.addChild(o);
      e = o.getComponent($10ListItem.default);
      o.listItem = e;
      if (e) {
        e.listId = t, e.list = this, e._registerEvent();
      }
      this.renderEvent && cc.Component.EventHandler.emitEvents([this.renderEvent], o, t % this._actualNumItems);
    }
    this._updateListItem(e);
    this._lastDisplayData.indexOf(t) < 0 && this._lastDisplayData.push(t);
  };
  _ctor.prototype._updateListItem = function (t) {
    if (t && this.selectedMode > c.NONE) {
      var e = t.node;
      switch (this.selectedMode) {
        case c.SINGLE:
          t.selected = this.selectedId == e._listId;
          break;
        case c.MULT:
          t.selected = this.multSelected.indexOf(e._listId) >= 0;
      }
    }
  };
  _ctor.prototype._resetItemSize = function () {};
  _ctor.prototype._updateItemPos = function (t) {
    var e = isNaN(t) ? t : this.getItemByListId(t);
    var o = this.getItemPos(e._listId);
    e.setPosition(o.x, o.y);
  };
  _ctor.prototype.setMultSelected = function (t, e) {
    var o = this;
    if (o.checkInited()) {
      Array.isArray(t) || (t = [t]);
      if (null == e) {
        o.multSelected = t;
      } else {
        var i = undefined;
        var n = undefined;
        if (e) {
          for (var a = t.length - 1; a >= 0; a--) {
            i = t[a];
            (n = o.multSelected.indexOf(i)) < 0 && o.multSelected.push(i);
          }
        } else {
          for (a = t.length - 1; a >= 0; a--) {
            i = t[a];
            (n = o.multSelected.indexOf(i)) >= 0 && o.multSelected.splice(n, 1);
          }
        }
      }
      o._forceUpdate = true;
      o._onScrolling();
    }
  };
  _ctor.prototype.getMultSelected = function () {
    return this.multSelected;
  };
  _ctor.prototype.hasMultSelected = function (t) {
    return this.multSelected && this.multSelected.indexOf(t) >= 0;
  };
  _ctor.prototype.updateItem = function (t) {
    if (this.checkInited()) {
      Array.isArray(t) || (t = [t]);
      var e = 0;
      for (var o = t.length; e < o; e++) {
        var i = t[e];
        var n = this.getItemByListId(i);
        n && cc.Component.EventHandler.emitEvents([this.renderEvent], n, i % this._actualNumItems);
      }
    }
  };
  _ctor.prototype.updateAll = function () {
    if (this.checkInited()) {
      this._selectedId = -1;
      this.numItems = this.numItems;
    }
  };
  _ctor.prototype.getItemByListId = function (t) {
    if (this.content) {
      for (var e = this.content.childrenCount - 1; e >= 0; e--) {
        var o = this.content.children[e];
        if (o._listId == t) {
          return o;
        }
      }
    }
  };
  _ctor.prototype._getOutsideItem = function () {
    var t;
    var e = [];
    for (var o = this.content.childrenCount - 1; o >= 0; o--) {
      t = this.content.children[o];
      this.displayData.find(function (e) {
        return e.id == t._listId;
      }) || e.push(t);
    }
    return e;
  };
  _ctor.prototype._delRedundantItem = function () {
    if (this._virtual) {
      var t = this._getOutsideItem();
      for (var e = t.length - 1; e >= 0; e--) {
        var o = t[e];
        if (!this._scrollItem || o._listId != this._scrollItem._listId) {
          o.isCached = true;
          this._pool.put(o);
          for (var i = this._lastDisplayData.length - 1; i >= 0; i--) {
            if (this._lastDisplayData[i] == o._listId) {
              this._lastDisplayData.splice(i, 1);
              break;
            }
          }
        }
      }
    } else {
      for (; this.content.childrenCount > this._numItems;) {
        this._delSingleItem(this.content.children[this.content.childrenCount - 1]);
      }
    }
  };
  _ctor.prototype._delSingleItem = function (t) {
    t.removeFromParent();
    t.destroy && t.destroy();
    t = null;
  };
  _ctor.prototype.aniDelItem = function (t, e, o) {
    var i = this;
    if (!i.checkInited() || i.cyclic || !i._virtual) {
      return cc.error("This function is not allowed to be called!");
    }
    if (!e) {
      return cc.error("CallFunc are not allowed to be NULL, You need to delete the corresponding index in the data array in the CallFunc!");
    }
    if (i._aniDelRuning) {
      return cc.warn("Please wait for the current deletion to finish!");
    }
    var n;
    var a = i.getItemByListId(t);
    if (a) {
      n = a.getComponent($10ListItem.default);
      i._aniDelRuning = true;
      i._aniDelCB = e;
      i._aniDelItem = a;
      i._aniDelBeforePos = a.position;
      i._aniDelBeforeScale = a.scale;
      var r = i.displayData[i.displayData.length - 1].id;
      var s = n.selected;
      n.showAni(o, function () {
        var o;
        var n;
        var l;
        r < i._numItems - 2 && (o = r + 1);
        if (null != o) {
          var u = i._calcItemPos(o);
          i.displayData.push(u);
          if (i._virtual) {
            i._createOrUpdateItem(u);
          } else {
            i._createOrUpdateItem2(o);
          }
        } else {
          i._numItems--;
        }
        if (i.selectedMode == c.SINGLE) {
          if (s) {
            i._selectedId = -1;
          } else {
            i._selectedId - 1 >= 0 && i._selectedId--;
          }
        } else if (i.selectedMode == c.MULT && i.multSelected.length) {
          var p = i.multSelected.indexOf(t);
          p >= 0 && i.multSelected.splice(p, 1);
          for (var h = i.multSelected.length - 1; h >= 0; h--) {
            (f = i.multSelected[h]) >= t && i.multSelected[h]--;
          }
        }
        if (i._customSize) {
          i._customSize[t] && delete i._customSize[t];
          var d = {};
          var m = undefined;
          for (var f in i._customSize) {
            m = i._customSize[f];
            var y = parseInt(f);
            d[y - (y >= t ? 1 : 0)] = m;
          }
          i._customSize = d;
        }
        for (h = null != o ? o : r; h >= t + 1; h--) {
          if (a = i.getItemByListId(h)) {
            var g = i._calcItemPos(h - 1);
            n = cc.tween(a).to(.2333, {
              position: cc.v2(g.x, g.y)
            });
            if (h <= t + 1) {
              l = true;
              n.call(function () {
                i._aniDelRuning = false;
                e(t);
                delete i._aniDelCB;
              });
            }
            n.start();
          }
        }
        if (!l) {
          i._aniDelRuning = false;
          e(t);
          i._aniDelCB = null;
        }
      }, true);
    } else {
      e(t);
    }
  };
  _ctor.prototype.scrollTo = function (t, e, o, i) {
    undefined === e && (e = .5);
    undefined === o && (o = null);
    undefined === i && (i = false);
    var n = this;
    if (n.checkInited(false)) {
      if (null == e) {
        e = .5;
      } else {
        e < 0 && (e = 0);
      }
      if (t < 0) {
        t = 0;
      } else {
        t >= n._numItems && (t = n._numItems - 1);
      }
      !n._virtual && n._layout && n._layout.enabled && n._layout.updateLayout();
      var a;
      var r;
      var s = n.getItemPos(t);
      if (!s) {
        return false;
      }
      switch (n._alignCalcType) {
        case 1:
          a = s.left;
          a -= null != o ? n.node.width * o : n._leftGap;
          s = cc.v2(a, 0);
          break;
        case 2:
          a = s.right - n.node.width;
          a += null != o ? n.node.width * o : n._rightGap;
          s = cc.v2(a + n.content.width, 0);
          break;
        case 3:
          r = s.top;
          r += null != o ? n.node.height * o : n._topGap;
          s = cc.v2(0, -r);
          break;
        case 4:
          r = s.bottom + n.node.height;
          r -= null != o ? n.node.height * o : n._bottomGap;
          s = cc.v2(0, -r + n.content.height);
      }
      var c = n.content.getPosition();
      c = Math.abs(n._sizeType ? c.y : c.x);
      var l = n._sizeType ? s.y : s.x;
      if (Math.abs((null != n._scrollPos ? n._scrollPos : c) - l) > .5) {
        n._scrollView.scrollToOffset(s, e);
        n._scrollToListId = t;
        n._scrollToEndTime = new Date().getTime() / 1e3 + e;
        n._scrollToSo = n.scheduleOnce(function () {
          n._adheringBarrier || (n.adhering = n._adheringBarrier = false);
          n._scrollPos = n._scrollToListId = n._scrollToEndTime = n._scrollToSo = null;
          if (i) {
            var e = n.getItemByListId(t);
            e && cc.tween(e).to(.1, {
              scale: 1.05
            }).to(.1, {
              scale: 1
            }).start();
          }
        }, e + .1);
        e <= 0 && n._onScrolling();
      }
    }
  };
  _ctor.prototype._calcNearestItem = function () {
    var t;
    var e;
    var o;
    var i;
    var n;
    var a;
    var r = this;
    r.nearestListId = null;
    r._virtual && r._calcViewPos();
    o = r.viewTop;
    i = r.viewRight;
    n = r.viewBottom;
    a = r.viewLeft;
    var s = false;
    for (var c = 0; c < r.content.childrenCount && !s; c += r._colLineNum) {
      if (t = r._virtual ? r.displayData[c] : r._calcExistItemPos(c)) {
        e = r._sizeType ? (t.top + t.bottom) / 2 : e = (t.left + t.right) / 2;
        switch (r._alignCalcType) {
          case 1:
            if (t.right >= a) {
              r.nearestListId = t.id;
              a > e && (r.nearestListId += r._colLineNum);
              s = true;
            }
            break;
          case 2:
            if (t.left <= i) {
              r.nearestListId = t.id;
              i < e && (r.nearestListId += r._colLineNum);
              s = true;
            }
            break;
          case 3:
            if (t.bottom <= o) {
              r.nearestListId = t.id;
              o < e && (r.nearestListId += r._colLineNum);
              s = true;
            }
            break;
          case 4:
            if (t.top >= n) {
              r.nearestListId = t.id;
              n > e && (r.nearestListId += r._colLineNum);
              s = true;
            }
        }
      }
    }
    if ((t = r._virtual ? r.displayData[r.displayItemNum - 1] : r._calcExistItemPos(r._numItems - 1)) && t.id == r._numItems - 1) {
      e = r._sizeType ? (t.top + t.bottom) / 2 : e = (t.left + t.right) / 2;
      switch (r._alignCalcType) {
        case 1:
          i > e && (r.nearestListId = t.id);
          break;
        case 2:
          a < e && (r.nearestListId = t.id);
          break;
        case 3:
          n < e && (r.nearestListId = t.id);
          break;
        case 4:
          o > e && (r.nearestListId = t.id);
      }
    }
  };
  _ctor.prototype.prePage = function (t) {
    undefined === t && (t = .5);
    this.checkInited() && this.skipPage(this.curPageNum - 1, t);
  };
  _ctor.prototype.nextPage = function (t) {
    undefined === t && (t = .5);
    this.checkInited() && this.skipPage(this.curPageNum + 1, t);
  };
  _ctor.prototype.skipPage = function (t, e) {
    var o = this;
    if (o.checkInited()) {
      if (o._slideMode != s.PAGE) {
        return cc.error("This function is not allowed to be called, Must SlideMode = PAGE!");
      } else {
        return void (t < 0 || t * o.pageItemNum >= o._numItems || o.curPageNum != t && (o.curPageNum = t, o.pageChangeEvent && cc.Component.EventHandler.emitEvents([o.pageChangeEvent], t), o.scrollTo(t * this.pageItemNum, e)));
      }
    }
  };
  _ctor.prototype.calcCustomSize = function (t) {
    var e = this;
    if (e.checkInited()) {
      if (!e._itemTmp) {
        return cc.error("Unset template item!");
      }
      if (!e.renderEvent) {
        return cc.error("Unset Render-Event!");
      }
      e._customSize = {};
      var o = cc.instantiate(e._itemTmp);
      e.content.addChild(o);
      for (var i = 0; i < t; i++) {
        cc.Component.EventHandler.emitEvents([e.renderEvent], o, i);
        o.height == e._itemSize.height && o.width == e._itemSize.width || (e._customSize[i] = e._sizeType ? o.height : o.width);
      }
      Object.keys(e._customSize).length || (e._customSize = null);
      o.removeFromParent();
      o.destroy && o.destroy();
      return e._customSize;
    }
  };
  cc__decorate([ccp_property({
    type: cc.Enum(r),
    // tooltip: false
  })], _ctor.prototype, "templateType", undefined);
  cc__decorate([ccp_property({
    type: cc.Node,
    // tooltip: false,
    visible: function () {
      return this.templateType == r.NODE;
    }
  })], _ctor.prototype, "tmpNode", undefined);
  cc__decorate([ccp_property({
    type: cc.Prefab,
    // tooltip: false,
    visible: function () {
      return this.templateType == r.PREFAB;
    }
  })], _ctor.prototype, "tmpPrefab", undefined);
  cc__decorate([ccp_property()], _ctor.prototype, "_slideMode", undefined);
  cc__decorate([ccp_property({
    type: cc.Enum(s),
    // tooltip: false
  })], _ctor.prototype, "slideMode", null);
  cc__decorate([ccp_property({
    type: cc.Float,
    range: [0, 1, .1],
    // tooltip: false,
    slide: true,
    visible: function () {
      return this._slideMode == s.PAGE;
    }
  })], _ctor.prototype, "pageDistance", undefined);
  cc__decorate([ccp_property({
    // tooltip: false,
    visible: function () {
      return this._slideMode == s.PAGE;
    }
  })], _ctor.prototype, "pageItemNum", undefined);
  cc__decorate([ccp_property({
    type: cc.Component.EventHandler,
    // tooltip: false,
    visible: function () {
      return this._slideMode == s.PAGE;
    }
  })], _ctor.prototype, "pageChangeEvent", undefined);
  cc__decorate([ccp_property()], _ctor.prototype, "_virtual", undefined);
  cc__decorate([ccp_property({
    type: cc.Boolean,
    // tooltip: false
  })], _ctor.prototype, "virtual", null);
  cc__decorate([ccp_property({
    // tooltip: false,
    visible: function () {
      var t = this.slideMode == s.NORMAL;
      t || (this.cyclic = false);
      return t;
    }
  })], _ctor.prototype, "cyclic", undefined);
  cc__decorate([ccp_property({
    // tooltip: false,
    visible: function () {
      return this.virtual;
    }
  })], _ctor.prototype, "lackCenter", undefined);
  cc__decorate([ccp_property({
    // tooltip: false,
    visible: function () {
      var t = this.virtual && !this.lackCenter;
      t || (this.lackSlide = false);
      return t;
    }
  })], _ctor.prototype, "lackSlide", undefined);
  cc__decorate([ccp_property({
    type: cc.Integer
  })], _ctor.prototype, "_updateRate", undefined);
  cc__decorate([ccp_property({
    type: cc.Integer,
    range: [0, 6, 1],
    // tooltip: false,
    slide: true
  })], _ctor.prototype, "updateRate", null);
  cc__decorate([ccp_property({
    type: cc.Integer,
    range: [0, 12, 1],
    // tooltip: false,
    slide: true
  })], _ctor.prototype, "frameByFrameRenderNum", undefined);
  cc__decorate([ccp_property({
    type: cc.Component.EventHandler,
    // tooltip: false
  })], _ctor.prototype, "renderEvent", undefined);
  cc__decorate([ccp_property({
    type: cc.Enum(c),
    // tooltip: false
  })], _ctor.prototype, "selectedMode", undefined);
  cc__decorate([ccp_property({
    // tooltip: false,
    visible: function () {
      return this.selectedMode == c.SINGLE;
    }
  })], _ctor.prototype, "repeatEventSingle", undefined);
  cc__decorate([ccp_property({
    type: cc.Component.EventHandler,
    // tooltip: false,
    visible: function () {
      return this.selectedMode > c.NONE;
    }
  })], _ctor.prototype, "selectedEvent", undefined);
  cc__decorate([ccp_property({
    serializable: false
  })], _ctor.prototype, "_numItems", undefined);
  return cc__decorate([ccp_ccclass, ccp_disallowMultiple(), ccp_menu("自定义组件/List"), ccp_requireComponent(cc.ScrollView), ccp_executionOrder(-5e3)], _ctor);
}(cc.Component);
exports.default = def_List;