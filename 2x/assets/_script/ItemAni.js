var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10NodePoolManager = require("NodePoolManager");
var $10Util = require("Util");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_ItemAni = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t, e, o, i) {
    var n = this;
    var a = 80;
    var c = 80;
    if (t.num < 10) {
      a = 60;
      c = 60;
    }
    1 != t.id && 2 != t.id || (a = 200);
    var l = 2 * Math.random() * c - c;
    var u = 2 * Math.random() * a - a;
    if (e) {
      this.node.setPosition(e);
    } else {
      this.node.y = 0;
    }
    if (1 == t.id || 2 == t.id || 8 == t.id) {
      var p = e.y - 10;
      cc.tween(this.node).to($10Util.default.getRandomNum(10, 20, true) / 100, {
        position: cc.v3(e.x + l, e.y + Math.abs(u))
      }, {
        easing: "quadOut"
      }).to($10Util.default.getRandomNum(10, 20, true) / 100, {
        position: cc.v3(e.x + l, p)
      }, {
        easing: "quadIn"
      }).call(function () {
        var t = cc.tween(n.node);
        for (var e = 0; e < 3; e++) {
          var o = $10Util.default.getRandomNum(10, 20, true);
          t.to(.2, {
            y: p + o
          }, {
            easing: "quadOut"
          });
          t.to(.2, {
            y: p
          }, {
            easing: "quadIn"
          });
          o -= o / 3;
        }
        t.start();
      }).start();
      this.scheduleOnce(function () {
        var e;
        var a = cc.v2(n.node.position.x, n.node.position.y);
        e = n.node.position.x > 0 ? cc.v2(n.node.position.x + 150, n.node.position.y + 200) : cc.v2(n.node.position.x - 150, n.node.position.y + 200);
        var s = cc.v2(o.x, o.y);
        cc.tween(n.node).bezierTo(i || .4, a, e, s).call(function () {
          t.id;
          $10NodePoolManager.default.instance.putNode(n.node);
        }).start();
      }, $10Util.default.getRandomNum(80, 100, true) / 100);
    } else {
      var h = e.y - 20;
      cc.tween(this.node).to($10Util.default.getRandomNum(10, 20, true) / 100, {
        position: cc.v3(e.x + l, e.y + Math.abs(u))
      }, {
        easing: "quadIn"
      }).to($10Util.default.getRandomNum(10, 20, true) / 100, {
        position: cc.v3(e.x + l, h)
      }, {
        easing: "quadIn"
      }).start();
      this.scheduleOnce(function () {
        var t;
        var e = cc.v2(n.node.position.x, n.node.position.y);
        t = n.node.position.x > 0 ? cc.v2(n.node.position.x + 150, n.node.position.y - 300) : cc.v2(n.node.position.x - 150, n.node.position.y - 300);
        var a = cc.v2(o.x, o.y);
        cc.tween(n.node).bezierTo(i || .4, e, t, a).call(function () {
          $10NodePoolManager.default.instance.putNode(n.node);
        }).start();
      }, $10Util.default.getRandomNum(80, 100, true) / 100);
    }
  };
  _ctor.prototype.init2 = function (t, e) {
    var o;
    var i = this;
    var n = cc.v2(this.node.position.x, this.node.position.y);
    o = this.node.position.x > 0 ? cc.v2(this.node.position.x + 150, this.node.position.y - 200) : cc.v2(this.node.position.x - 150, this.node.position.y - 200);
    var a = cc.v2(t.x, t.y);
    cc.tween(this.node).bezierTo(e || .4, n, o, a).call(function () {
      $10NodePoolManager.default.instance.putNode(i.node);
    }).start();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_ItemAni;