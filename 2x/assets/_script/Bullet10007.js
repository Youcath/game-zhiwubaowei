var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10BulletGrape = require("BulletGrape");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_Bullet10007 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletSp = null;
    e._atkPos = null;
    e._idx = 0;
    e.mLastPos = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.startMove = function (t, e, o) {
    var i = this;
    this._idx = e;
    this._synthesisLv = o;
    this._atkPos = t.position.clone();
    var n = $10MathUtil.MathUtil.distance(this.node.position, this._atkPos.clone()) / 450;
    var a = this._atkPos.clone();
    this.bezierTo(cc.v2(this.node.position), this.getC2(cc.v2(this.node.position), cc.v2(a)), cc.v2(a), n, true, function () {
      i.initBullet(-1, i._idx, 10007);
    });
    cc.tween(this.node).to(n, {
      angle: 1440
    }).start();
  };
  _ctor.prototype.bezierTo = function (t, e, o, i, n, a, s, c) {
    undefined === s && (s = "");
    undefined === c && (c = null);
    cc.Tween.stopAllByTarget(this.node);
    $10MathUtil.MathUtil.bezierTo(this.node, i, t, e, o, function (t, e) {
      c && c(t, e);
    }, s).call(function () {
      a && a();
    }).start();
  };
  _ctor.prototype.getC2 = function (t, e) {
    var o = Math.abs(t.x - e.x);
    var i = t.x > e.x ? t.x - o / 2 : t.x + o / 2;
    var n = 250 * Math.random() + 250;
    if (t.y > e.y) {
      return cc.v2(i, t.y + n);
    } else {
      return cc.v2(i, e.y + n);
    }
  };
  _ctor.prototype.setAngle = function () {
    var t = this.node.position;
    if (this.mLastPos) {
      var e = -1e4;
      if (t != this.mLastPos) {
        var o = t.sub(this.mLastPos);
        var i = cc.v2(o);
        var n = cc.v2(1, 0);
        var a = i.magSqr();
        var r = n.magSqr();
        if (0 == a || 0 == r) {
          return;
        }
        var s = i.signAngle(n);
        var c = Math.floor(cc.misc.radiansToDegrees(s));
        e = c;
        c = -c;
        this.node.angle = c;
        this.mLastPos = t;
      }
      return e;
    }
    this.mLastPos = t;
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mBulletSp", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletGrape.default);
exports.default = def_Bullet10007;