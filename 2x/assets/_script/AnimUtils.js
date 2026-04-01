Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimUtil = undefined;
var $10BattleDataProxy = require("BattleDataProxy");
var $10RandomUtil = require("RandomUtil");
var exp_AnimUtil = function () {
  function _ctor() {}
  _ctor.floatAnim = function (t, e, o) {
    undefined === e && (e = 1);
    undefined === o && (o = 25);
    cc.Tween.stopAllByTarget(t);
    var i = t.y;
    cc.tween(t).to(e, {
      y: i + o
    }).to(e, {
      y: i
    }).union().repeatForever().start();
  };
  _ctor.shakeAnim = function (t, e, o, i) {
    undefined === i && (i = 1);
    cc.Tween.stopAllByTarget(t);
    var n = t.x;
    var a = t.y;
    cc.tween(t).to(.02, {
      x: n + 3 * i,
      y: a + 4 * i
    }).to(.02, {
      x: n - 3 * i,
      y: a + 4 * i
    }).to(.02, {
      x: n - 5 * i,
      y: a + 1 * i
    }).to(.02, {
      x: n + 1 * i,
      y: a - 3 * i
    }).to(.02, {
      x: n - 3 * i,
      y: a + 3 * i
    }).to(.02, {
      x: n + 1 * i,
      y: a - 4 * i
    }).to(.02, {
      x: n - 4 * i,
      y: a - 5 * i
    }).to(.02, {
      x: n + 1 * i,
      y: a + 5 * i
    }).to(.02, {
      x: n,
      y: a
    }).union().repeatForever().start();
    var r = setTimeout(function () {
      clearTimeout(r);
      cc.Tween.stopAllByTarget(t);
      t.x = n;
      t.y = a;
      o && o();
    }, e);
  };
  _ctor.flyItemAnim = function (t, e, o, a, r, s) {
    undefined === r && (r = 60);
    var c = t.length;
    var l = this.getCirclePoints(e, cc.v3(o, o.y), c, r);
    t.forEach(function (t, e) {
      t.active = false;
      var r = $10RandomUtil.RandomUtil.randomInt(0, l.length);
      var u = cc.v2(l[r].x, l[r].y);
      var p = Math.min(Math.abs(u.y - a.y) / 500, .8);
      p = Math.max(p, .5);
      p /= $10BattleDataProxy.battleDataProxy.gameSpeed;
      var h = u.add(cc.v2(u.x >= o.x ? $10RandomUtil.RandomUtil.randomInt(0, 300) : $10RandomUtil.RandomUtil.randomInt(-300, 0), $10RandomUtil.RandomUtil.randomInt(0, 150)));
      cc.tween(t).delay(.01 * e).call(function () {
        t.active = true;
      }).to(.05, {
        x: u.x,
        y: u.y
      }).bezierTo(p, u, h, cc.v2(a.x, a.y)).call(function () {
        t.active = false;
        e === c - 1 && s && s();
      }).start();
    });
  };
  _ctor.getCirclePoints = function (t, e, o, i) {
    undefined === i && (i = 60);
    var n = [];
    var a = Math.PI / 180 * Math.round(360 / o);
    for (var r = 0; r < o; r++) {
      var s = e.x + t * Math.sin(a * r);
      var c = e.y + t * Math.cos(a * r);
      n.unshift(cc.v3(s + Math.random() * i, c + Math.random() * i, 0));
    }
    return n;
  };
  _ctor.breathAnim = function (t, e, o) {
    undefined === e && (e = 1.2);
    undefined === o && (o = .5);
    cc.Tween.stopAllByTarget(t);
    cc.tween(t).to(o, {
      scale: e
    }).to(o, {
      scale: 1
    }).union().repeatForever().start();
  };
  _ctor.rotateAnim = function (t, e) {
    cc.Tween.stopAllByTarget(t);
    cc.tween(t).by(1, {
      angle: e
    }).union().repeatForever().start();
  };
  _ctor.swingAnim = function (t, e, o, i, n, a) {
    undefined === a && (a = "");
    cc.Tween.stopAllByTarget(t);
    cc.tween(t).to(i / 2, {
      angle: e
    }).to(i / 2, {
      angle: o
    }, {
      easing: a
    }).delay(n).union().repeatForever().start();
  };
  _ctor.dropItemAnim = function (e, o, i, a, r, s) {
    undefined === a && (a = 60);
    var c = e.length;
    var l = _ctor.getCirclePoints(o, i, c, a);
    e.forEach(function (t, e) {
      t.setPosition(l[e]);
      var o = t.position;
      var a = Math.abs(i.y - r);
      var u = $10RandomUtil.RandomUtil.randomInt(-30, a / 300 * 50);
      var p = a / 300 * 1.6;
      var h = cc.v3(i.x > o.x ? o.x - u : i.x < o.x ? o.x + u : i.x, r);
      cc.Tween.stopAllByTarget(t);
      var d = Object.create(null);
      var m = false;
      d.progress = function (t, e, o, i) {
        if (m) {
          o.x = e.x;
        } else {
          o.x = t.x + (e.x - t.x) * i;
          i > .98 && (m = true);
        }
        o.y = t.y + (e.y - t.y) * i;
        return o;
      };
      d.easing = "bounceOut";
      cc.tween(t).to(p, {
        position: h
      }, d).delay(.3).call(function () {
        --c <= 0 && s && s();
      }).start();
    });
  };
  _ctor.flyDropItemAnim = function (t, e, o, i) {
    var a = t.length;
    t.forEach(function (t) {
      cc.Tween.stopAllByTarget(t);
      var r = t.getPosition();
      var s = e;
      var c = r.add(cc.v2($10RandomUtil.RandomUtil.randomInt(-300, 300), $10RandomUtil.RandomUtil.randomInt(0, 150)));
      cc.tween(t).bezierTo(.7, r, c, s).call(function () {
        i && i(t);
        --a <= 0 && o && o();
      }).start();
    });
  };
  _ctor.swingLRAnim = function (t, e, o) {
    cc.Tween.stopAllByTarget(t);
    cc.tween(t).by(o / 2, {
      x: -e
    }).by(o / 2, {
      x: e
    }).union().repeatForever().start();
  };
  _ctor.breathAndFadeAnim = function (t, e, o, i, n) {
    undefined === e && (e = 1.2);
    undefined === o && (o = 0);
    undefined === i && (i = 255);
    undefined === n && (n = .5);
    cc.Tween.stopAllByTarget(t);
    cc.tween(t).parallel(cc.tween().to(n, {
      opacity: o
    }).to(n, {
      opacity: i
    }).union(), cc.tween().to(n, {
      scale: e
    }).to(n, {
      scale: 1
    }).union()).union().repeatForever().start();
  };
  _ctor.blickAnim = function (t, e, o) {
    undefined === e && (e = 0);
    undefined === o && (o = .5);
    cc.Tween.stopAllByTarget(t);
    cc.tween(t).to(o, {
      opacity: e
    }).to(o, {
      opacity: 255
    }).union().repeatForever().start();
  };
  _ctor.shakeAngle = function (t, e, o, i) {
    undefined === e && (e = 10);
    undefined === o && (o = .5);
    undefined === i && (i = null);
    var n = t.angle;
    var a = function (e, o) {
      if (e < 1 || o < .1) {
        cc.tween(t).to(.2, {
          angle: n
        }).call(function () {
          i && i();
        }).start();
      } else {
        var r = .3 * o;
        var s = .5 * e;
        var c = o - r;
        cc.tween(t).to(r, {
          angle: -e
        }, {
          easing: "sineInOut"
        }).to(r, {
          angle: e
        }, {
          easing: "sineInOut"
        }).call(function () {
          a(s, c);
        }).start();
      }
    };
    cc.tween(t).to(.25 * o, {
      angle: e
    }, {
      easing: "sineOut"
    }).call(function () {
      a(.5 * e, .75 * o);
    }).start();
  };
  return _ctor;
}();
exports.AnimUtil = exp_AnimUtil;