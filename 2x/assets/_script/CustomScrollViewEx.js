var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomScrollViewEx = exports.ScrollViewCustomProperty = undefined;
var r;
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
var exp_CustomScrollViewEx = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mScrollView = null;
    e.mContent = null;
    e._usefulList = [];
    e._itemAmount = 0;
    e._initLen = 0;
    e._itemHeight = 0;
    e._checkSize = 0;
    e._extra = null;
    e._titleHeight = 0;
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
    this._extra.startItemIndex = this._extra.startItemIndex || 0;
    this._extra.updateItemInfo = this._extra.updateItemInfo || null;
    this.mScrollView.scrollToTop();
    var i = this._extra.startItemIndex || 0;
    i > 0 && i > t - e && (i = t - e);
    this._extra.startItemIndex = i;
    var n = new cc.Component.EventHandler();
    n.component = "CustomScrollViewEx";
    n.handler = "onScrolling";
    n.target = this.node;
    n.customEventData = "";
    this.mScrollView.scrollEvents.splice(0, this.mScrollView.scrollEvents.length);
    this.mScrollView.scrollEvents.push(n);
    this.recycle();
    this._usefulList = [];
    this._itemAmount = t;
    this._initLen = e;
    var a = $10NodePoolManager.default.instance.getNode(this._extra.prefab);
    this._itemHeight = a.height;
    var r = $10NodePoolManager.default.instance.getNode(this._extra.titlePrefab);
    this._titleHeight = r.height;
    this._checkSize = this._itemHeight * this._initLen;
    this.mContent.height = this._itemHeight * this._itemAmount + this._titleHeight * this._extra.titleIdx.length;
    this.mContent.y = this._itemHeight * this._extra.startItemIndex + this.mScrollView.node.height / 2;
    $10NodePoolManager.default.instance.putNode(a);
    $10NodePoolManager.default.instance.putNode(r);
    for (var c = 0; c < this._extra.titleIdx.length; ++c) {
      this.addTitle(c);
    }
    for (c = 0; c < this._initLen; ++c) {
      this.addItem(c);
    }
  };
  _ctor.prototype.recycle = function () {
    var t = this.mContent.children.length;
    for (var e = 0; e < t; ++e) {
      if (this.mContent.children[0].name == this._extra.prefab.name) {
        var o = this.mContent.children[0].children.length;
        for (var i = 0; i < o; ++i) {
          $10NodePoolManager.default.instance.putNode(this.mContent.children[0].children[0]);
        }
      }
      $10NodePoolManager.default.instance.putNode(this.mContent.children[0]);
    }
  };
  _ctor.prototype.getChildren = function () {
    return this._usefulList;
  };
  _ctor.prototype.addTitle = function (t) {
    var e = $10NodePoolManager.default.instance.getNode(this._extra.titlePrefab);
    var o = cc.v3(0, 0, 0);
    if (0 == t) {
      o = cc.v3(e.position.x, -this._titleHeight / 2);
    } else {
      var i = this._extra.titleIdx[t] - this._extra.titleIdx[t - 1];
      o = cc.v3(e.position.x, -(this._titleHeight / 2 + this._itemHeight * i + this._titleHeight * t));
    }
    this.mContent.addChild(e);
    e.position = o;
    this._extra.updateTitleInfo && this._extra.updateTitleInfo.call(this._extra.target, e, t);
  };
  _ctor.prototype.addItem = function (t) {
    var e = $10NodePoolManager.default.instance.getNode(this._extra.prefab);
    var o = cc.v3(0, 0, 0);
    var i = this._extra.startItemIndex + t;
    var n = 0;
    for (var a = this._extra.titleIdx.length - 1; a >= 0; --a) {
      if (t >= this._extra.titleIdx[a]) {
        n = a + 1;
        break;
      }
    }
    o = cc.v3(e.position.x, -(this._itemHeight / 2 + this._itemHeight * i + this._titleHeight * n), 0);
    this._usefulList.push(e);
    this.mContent.addChild(e);
    e.position = o;
    e[r.ItemIndex] = i;
    this.updateItemInfo(e, i + n, i);
    return e;
  };
  _ctor.prototype.moveItem = function (t) {
    var e = null;
    var o = null;
    var i = null;
    var n = null;
    if ("down" == t) {
      if ((c = (e = this._usefulList[this._initLen - 1])[r.ItemIndex]) >= this._itemAmount - 1) {
        return;
      }
      o = this._usefulList[0];
      var a = false;
      for (var s = this._extra.titleIdx.length - 1; s >= 0; --s) {
        if (c == this._extra.titleIdx[s] - 1) {
          a = true;
          break;
        }
      }
      i = cc.v3(o.position.x, e.position.y - this._itemHeight - (a ? this._titleHeight : 0));
      n = e[r.ItemIndex] + 1;
      this._usefulList.splice(0, 1);
      this._usefulList.push(o);
      o[r.ItemIndex] = n;
    } else if ("up" == t) {
      var c;
      if ((c = (e = this._usefulList[0])[r.ItemIndex]) <= 0) {
        return;
      }
      o = this._usefulList[this._initLen - 1];
      a = false;
      for (s = this._extra.titleIdx.length - 1; s >= 0; --s) {
        if (c == this._extra.titleIdx[s] - 1) {
          a = true;
          break;
        }
      }
      i = cc.v3(o.position.x, e.position.y + this._itemHeight + (a ? this._titleHeight : 0));
      n = e[r.ItemIndex] - 1;
      this._usefulList.splice(this._initLen - 1, 1);
      this._usefulList.splice(0, 0, o);
      o[r.ItemIndex] = n;
    }
    if (o) {
      o.position = i;
      o[r.ItemIndex] = n;
      var l = 0;
      for (s = this._extra.titleIdx.length - 1; s >= 0; --s) {
        if (n >= this._extra.titleIdx[s]) {
          l = s + 1;
          break;
        }
      }
      this.updateItemInfo(o, n + l, n);
    }
  };
  _ctor.prototype.updateItemInfo = function (t, e, o) {
    this._extra.updateItemInfo && this._extra.updateItemInfo.call(this._extra.target, t, e, o);
  };
  _ctor.prototype.onScrolling = function () {
    if (this.mScrollView && this.mContent) {
      for (var t = 0; t < this._usefulList.length; ++t) {
        var e = this._usefulList[t].convertToWorldSpaceAR(cc.v3(0, 0, 0));
        var o = this.node.convertToNodeSpaceAR(e);
        if (o.y - this._itemHeight / 2 > this._checkSize / 2) {
          this.moveItem("down");
          break;
        }
        if (o.y + this._itemHeight / 2 < -this._checkSize / 2) {
          this.moveItem("up");
          break;
        }
      }
    } else {
      $10CommonUtil.CommonUtil.print("请初始化 scrollView 或 content");
    }
  };
  cc__decorate([ccp_property(cc.ScrollView)], _ctor.prototype, "mScrollView", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mContent", undefined);
  return cc__decorate([ccp_ccclass, ccp_menu("自定义组件/滚动视图Ex"), ccp_requireComponent(cc.ScrollView)], _ctor);
}($10ComponentBase.ComponentBase);
exports.CustomScrollViewEx = exp_CustomScrollViewEx;