Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toast = undefined;
var $10AppBase = require("AppBase");
var exp_Toast = function () {
  function _ctor() {
    this._bgColor = cc.color(255, 255, 255, 180);
    this._textColor = cc.color(0, 0, 0, 255);
    this._fontSize = 30;
    this.bgNode = null;
    this.duration = 0;
    this.textNode = null;
  }
  _ctor.makeText = function (e, o, n) {
    if (null == e) {
      if (null == this.parentNode) {
        this.parentNode = new cc.Node("Toast"), this.parentNode.width = $10AppBase.rootNode.width, this.parentNode.height = $10AppBase.rootNode.height, $10AppBase.rootNode.addChild(this.parentNode, 999);
      }
      e = this.parentNode;
    }
    var a = new _ctor();
    a.duration = n;
    a.init(e, o);
    return a;
  };
  _ctor.prototype.setFontSize = function (t) {
    this._fontSize = t;
    this.textNode.getComponent(cc.Label).fontSize = t;
    return this;
  };
  _ctor.prototype.setBgColor = function (t) {
    this._bgColor = t;
    this.bgNode.color = this._bgColor;
    return this;
  };
  _ctor.prototype.setTextColor = function (t) {
    this._textColor = t;
    this.textNode.color = this._textColor;
    return this;
  };
  _ctor.prototype.setGravity = function (e) {
    if (e == _ctor.CENTER) {
      this.bgNode.y = 0;
    } else if (e == _ctor.TOP) {
      this.bgNode.y = this.bgNode.parent.height / 5 * 2;
    } else {
      e == _ctor.BOTTOM && (this.bgNode.y = -this.bgNode.parent.height / 5 * 2);
    }
    return this;
  };
  _ctor.prototype.show = function () {
    this.bgNode.opacity = 255;
    cc.tween(this.bgNode).by(this.duration / 2, {
      x: 0,
      y: 0
    }).to(this.duration / 2, {
      opacity: 0
    }).call(function (t) {
      t.destroy();
    }).start();
    return this;
  };
  _ctor.prototype.init = function (t, e) {
    var o = t.width;
    this.bgNode = new cc.Node();
    this.textNode = new cc.Node();
    this.textNode.color = this._textColor;
    var i = this.textNode.addComponent(cc.Label);
    i.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    i.verticalAlign = cc.Label.VerticalAlign.CENTER;
    i.fontSize = this._fontSize;
    i.string = e;
    if (e.length * i.fontSize > 3 * o / 5) {
      this.textNode.width = 3 * o / 5;
      i.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
    } else {
      this.textNode.width = e.length * i.fontSize;
    }
    var n = 1 + ~~(e.length * i.fontSize / (3 * o / 5));
    this.textNode.height = i.fontSize * n;
    var a = this.bgNode.addComponent(cc.Graphics);
    a.arc(-this.textNode.width / 2, 0, this.textNode.height / 2 + 20, .5 * Math.PI, 1.5 * Math.PI, true);
    a.lineTo(this.textNode.width / 2, -(this.textNode.height / 2 + 20));
    a.arc(this.textNode.width / 2, 0, this.textNode.height / 2 + 20, 1.5 * Math.PI, .5 * Math.PI, true);
    a.lineTo(-this.textNode.width / 2, this.textNode.height / 2 + 20);
    a.fillColor = this._bgColor;
    a.fill();
    this.textNode.parent = this.bgNode;
    this.bgNode.opacity = 0;
    this.bgNode.parent = t;
  };
  _ctor.CENTER = 0;
  _ctor.TOP = 1;
  _ctor.BOTTOM = 2;
  _ctor.LENGTH_SHORT = 2;
  _ctor.LENGTH_LONG = 3.5;
  _ctor.parentNode = null;
  return _ctor;
}();
exports.Toast = exp_Toast;