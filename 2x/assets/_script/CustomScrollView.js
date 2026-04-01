var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomScrollView = exports.ScrollDirection = exports.ScrollViewCustomProperty = undefined;
var r;
var s;
var $10NodePoolManager = require("NodePoolManager");
var $10ComponentBase = require("ComponentBase");
var $10CommonUtil = require("CommonUtil");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_menu = cc__decorator.menu;
var ccp_requireComponent = cc__decorator.requireComponent;
(function (t) {
  t.ItemIndex = "ItemIndex";
})(r = exports.ScrollViewCustomProperty || (exports.ScrollViewCustomProperty = {}));
(function (t) {
  t[t.horizontal = 0] = "horizontal";
  t[t.vertical = 1] = "vertical";
})(s = exports.ScrollDirection || (exports.ScrollDirection = {}));
var exp_CustomScrollView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mScrollView = null;
    e.mContent = null;
    e.mDir = s.horizontal;
    e._itemAmount = 0;
    e._initLen = 0;
    e._itemHeight = 0;
    e._itemWidth = 0;
    e._checkSize = 0;
    e._extra = null;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "children", {
    get: function () {
      return this.mContent.children;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.initScrollView = function (t, e, o) {
    this._extra = o;
    this._extra.paddingLeft = this._extra.paddingLeft || 0;
    this._extra.paddingTop = this._extra.paddingTop || 0;
    this._extra.startItemIndex = this._extra.startItemIndex || 0;
    this._extra.updateItemInfo = this._extra.updateItemInfo || null;
    if (this.mDir == s.horizontal) {
      this.mScrollView.scrollToLeft();
    } else {
      this.mDir == s.vertical && this.mScrollView.scrollToTop();
    }
    var i = this._extra.startItemIndex || 0;
    i > 0 && i > t - e && (i = t - e);
    this._extra.startItemIndex = i;
    var n = new cc.Component.EventHandler();
    n.component = "CustomScrollView";
    n.handler = "onScrolling";
    n.target = this.node;
    n.customEventData = "";
    this.mScrollView.scrollEvents.splice(0, this.mScrollView.scrollEvents.length);
    this.mScrollView.scrollEvents.push(n);
    this.recycle(o.bPutChild);
    this._itemAmount = t;
    this._initLen = e;
    var a = $10NodePoolManager.default.instance.getNode(this._extra.prefab);
    this._itemWidth = a.width;
    this._itemHeight = a.height;
    if (this.mDir == s.horizontal) {
      this._checkSize = this._itemWidth * this._initLen;
      this.mContent.width = this._itemWidth * this._itemAmount + this._extra.paddingLeft;
      this.mContent.x = this._itemWidth * this._extra.startItemIndex - this.mScrollView.node.width / 2;
    } else if (this.mDir == s.vertical) {
      this._checkSize = this._itemHeight * this._initLen, this.mContent.height = this._itemHeight * this._itemAmount + this._extra.paddingTop, this.mContent.y = this._itemHeight * this._extra.startItemIndex + this.mScrollView.node.height / 2;
    }
    $10NodePoolManager.default.instance.putNode(a);
    for (var r = 0; r < this._initLen; ++r) {
      this.addItem(r);
    }
  };
  _ctor.prototype.recycle = function (t) {
    var e = this.mContent.children.length;
    for (var o = 0; o < e; ++o) {
      if (t) {
        var i = this.mContent.children[0].children.length;
        for (var n = 0; n < i; ++n) {
          $10NodePoolManager.default.instance.putNode(this.mContent.children[0].children[0]);
        }
      }
      $10NodePoolManager.default.instance.putNode(this.mContent.children[0]);
    }
  };
  _ctor.prototype.setEnable = function (t) {
    this.mScrollView.enabled = t;
  };
  _ctor.prototype.getChildren = function () {
    return this.mContent.children;
  };
  _ctor.prototype.addNewItem = function (t, e) {
    if (this._itemAmount < t) {
      this._initLen++;
      this._checkSize = this._itemWidth * this._initLen;
      this.addItem(this._initLen - 1);
    }
    this._itemAmount++;
    this.mScrollView.stopAutoScroll();
    if (this.mDir == s.horizontal) {
      this.mContent.width = this._itemWidth * this._itemAmount + this._extra.paddingLeft;
      e && this.mScrollView.scrollToRight(.2);
    } else if (this.mDir == s.vertical) {
      this.mContent.height = this._itemHeight * this._itemAmount + this._extra.paddingTop, e && this.mScrollView.scrollToBottom(.2);
    }
  };
  _ctor.prototype.addItem = function (t) {
    var e = $10NodePoolManager.default.instance.getNode(this._extra.prefab);
    var o = cc.v3(0, 0, 0);
    var i = this._extra.startItemIndex + t;
    if (0 == i) {
      if (this.mDir == s.horizontal) {
        o = cc.v3(this._itemWidth / 2 + this._extra.paddingLeft, 0, 0);
      } else {
        this.mDir == s.vertical && (o = cc.v3(e.position.x, -this._itemHeight / 2 - this._extra.paddingTop, 0));
      }
    } else if (this.mDir == s.horizontal) {
      o = cc.v3(this._itemWidth / 2 + this._itemWidth * i + this._extra.paddingLeft, 0, 0);
    } else {
      this.mDir == s.vertical && (o = cc.v3(e.position.x, -(this._itemHeight / 2 + this._itemHeight * i) - this._extra.paddingTop, 0));
    }
    this.mContent.addChild(e);
    e.position = o;
    e.setSiblingIndex(i);
    e[r.ItemIndex] = i;
    this.updateItemInfo(e, i);
    return e;
  };
  _ctor.prototype.moveItem = function (t) {
    var e = null;
    var o = null;
    var i = null;
    var n = null;
    var a = null;
    if ("down" == t) {
      if ((e = this.mContent.children[this._initLen - 1])[r.ItemIndex] >= this._itemAmount - 1) {
        return;
      }
      o = this.mContent.children[0];
      i = cc.v3(o.position.x, e.position.y - this._itemHeight);
      n = e.getSiblingIndex() + 1;
      a = e[r.ItemIndex] + 1;
    } else if ("up" == t) {
      if ((e = this.mContent.children[0])[r.ItemIndex] <= 0) {
        return;
      }
      o = this.mContent.children[this._initLen - 1];
      i = cc.v3(o.position.x, e.position.y + this._itemHeight);
      n = 0;
      a = e[r.ItemIndex] - 1;
    } else if ("right" == t) {
      if ((e = this.mContent.children[this._initLen - 1])[r.ItemIndex] >= this._itemAmount - 1) {
        return;
      }
      o = this.mContent.children[0];
      i = cc.v3(e.position.x + this._itemWidth, 0);
      n = e.getSiblingIndex() + 1;
      a = e[r.ItemIndex] + 1;
    } else if ("left" == t) {
      if ((e = this.mContent.children[0])[r.ItemIndex] <= 0) {
        return;
      }
      o = this.mContent.children[this._initLen - 1];
      i = cc.v3(e.position.x - this._itemWidth, 0);
      n = 0;
      a = e[r.ItemIndex] - 1;
    }
    if (o) {
      o.position = i;
      o.setSiblingIndex(n);
      o[r.ItemIndex] = a;
      this.updateItemInfo(o, a);
    }
  };
  _ctor.prototype.updateItemInfo = function (t, e) {
    this._extra.updateItemInfo && this._extra.updateItemInfo.call(this._extra.target, t, e);
  };
  _ctor.prototype.onScrolling = function () {
    if (this.mScrollView && this.mContent) {
      if (this.mDir == s.horizontal) {
        for (var t = 0; t < this.mContent.children.length; ++t) {
          var e = this.mContent.children[t].convertToWorldSpaceAR(cc.v3(0, 0, 0));
          if ((o = this.node.convertToNodeSpaceAR(e)).x - this._itemWidth / 2 > this._checkSize / 2) {
            this.moveItem("left");
            break;
          }
          if (o.x + this._itemWidth / 2 < -this._checkSize / 2) {
            this.moveItem("right");
            break;
          }
        }
      } else if (this.mDir == s.vertical) {
        for (t = 0; t < this.mContent.children.length; ++t) {
          var o;
          e = this.mContent.children[t].convertToWorldSpaceAR(cc.v3(0, 0, 0));
          if ((o = this.node.convertToNodeSpaceAR(e)).y - this._itemHeight / 2 > this._checkSize / 2) {
            this.moveItem("down");
            break;
          }
          if (o.y + this._itemHeight / 2 < -this._checkSize / 2) {
            this.moveItem("up");
            break;
          }
        }
      }
    } else {
      $10CommonUtil.CommonUtil.print("请初始化 scrollView 或 content");
    }
  };
  cc__decorate([ccp_property(cc.ScrollView)], _ctor.prototype, "mScrollView", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mContent", undefined);
  cc__decorate([ccp_property({
    type: cc.Enum(s)
  })], _ctor.prototype, "mDir", undefined);
  return cc__decorate([ccp_ccclass, ccp_menu("自定义组件/滚动视图"), ccp_requireComponent(cc.ScrollView)], _ctor);
}($10ComponentBase.ComponentBase);
exports.CustomScrollView = exp_CustomScrollView;