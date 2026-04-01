var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10Bullet10011_2 = require("Bullet10011_2");
var $10BulletBase = require("BulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_Bullet10011 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletSp1 = null;
    e.mBulletSp2 = null;
    e.mBulletPb1 = null;
    e.mBulletPb2 = null;
    e._atkTargets = [];
    e._synthesisLv = 0;
    e._targetAngle1 = 0;
    e._targetAngle2 = 0;
    e._atkRate = 1;
    e._collisionEnemyNodes = [];
    e._checkColliderTime = 0;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "atkRate", {
    set: function (t) {
      this._atkRate = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.mBulletSp1.setCompleteListener(function (e) {
      var o = e.animation ? e.animation.name : "";
      if ("appear" == o) {
        t.mBulletSp1.setAnimation(0, "atk", false);
      } else {
        "disappear" == o || "atk" == o && t.mBulletSp1.setAnimation(0, "disappear", false);
      }
    });
    this.mBulletSp1.setEventListener(function (e, o) {
      o.data.name;
      t.addBulletNode(1);
    });
    this.mBulletSp2.setCompleteListener(function (e) {
      var o = e.animation ? e.animation.name : "";
      if ("appear" == o) {
        t.mBulletSp2.setAnimation(0, "atk", false);
      } else if ("disappear" == o) {
        t.node.destroy();
        t.node.removeFromParent();
      } else {
        "atk" == o && t.mBulletSp2.setAnimation(0, "disappear", false);
      }
    });
    this.mBulletSp2.setEventListener(function (e, o) {
      o.data.name;
      t.addBulletNode(2);
    });
  };
  _ctor.prototype.addBulletNode = function (t) {
    var e = this.node.getChildByName("fire" + t);
    var o = cc.instantiate(this.mBulletPb1);
    $10BattleDataProxy.battleDataProxy.bulletView.addChild(o, 1e3);
    var i = $10Util.default.convertToTargetNodeSpace(e, o);
    o.position = i;
    var n = 0;
    var a = 0;
    if (1 == t) {
      a = this._targetAngle1;
      n = $10MathUtil.MathUtil.getRadian(this._targetAngle1);
    } else {
      a = this._targetAngle2;
      n = $10MathUtil.MathUtil.getRadian(this._targetAngle2);
    }
    var s = i.x + cc.winSize.height * Math.cos(n);
    var d = i.y + cc.winSize.height * Math.sin(n);
    o.getComponent($10Bullet10011_2.default).initBullet(cc.v3(s, d), this._synthesisLv, this._atkRate);
    for (var m = 0; m < 7; ++m) {
      var f = this.getBulletStartAngle(7, m, a);
      var y = $10NodePoolManager.default.instance.getNode(this.mBulletPb2);
      $10BattleDataProxy.battleDataProxy.bulletView.addChild(y, 999);
      var g = $10Util.default.convertToTargetNodeSpace(e, y);
      y.position = g;
      y.getComponent($10BulletBase.default).atkRate = this._atkRate;
      y.getComponent($10BulletBase.default).superRate = 1;
      y.getComponent($10BulletBase.default).setOneAtkTargetNum(1);
      y.getComponent($10BulletBase.default).initBullet(10011, this.node, this._synthesisLv, 1);
      var _ = $10MathUtil.MathUtil.getRadian(f);
      var v = g.x + cc.winSize.height * Math.cos(_);
      var b = g.y + cc.winSize.height * Math.sin(_);
      y.getComponent($10BulletBase.default).setAtkPos(cc.v3(v, b));
    }
  };
  _ctor.prototype.getBulletStartAngle = function (t, e, o) {
    var i = 49 / t;
    return o + Math.floor(t / 2) * i - i * e;
  };
  _ctor.prototype.initBullet = function (t, e) {
    var o = this;
    this._atkTargets = t;
    this._synthesisLv = e;
    this.mBulletSp1.setAnimation(0, "appear", false);
    var i = this._atkTargets[0];
    var n = this._atkTargets[this._atkTargets.length - 1];
    var a = this.node.getChildByName("fire1");
    var s = this.node.getChildByName("fire1");
    var c = $10Util.default.convertToTargetNodeSpace(a, i);
    var l = $10Util.default.convertToTargetNodeSpace(s, n);
    var p = $10MathUtil.MathUtil.getDoublPointRadian(i.position, c);
    var h = $10MathUtil.MathUtil.getDoublPointRadian(n.position, l);
    this._targetAngle1 = $10MathUtil.MathUtil.getAngle(p);
    this._targetAngle2 = $10MathUtil.MathUtil.getAngle(h);
    this.mBulletSp2.node.active = false;
    cc.tween(this.node).delay(.15).call(function () {
      o.mBulletSp2.node.active = true;
      o.mBulletSp2.setAnimation(0, "appear", false);
    }).start();
  };
  _ctor.prototype.update = function () {
    if ($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.READY) {
      this.mBulletSp1.paused = true;
      this.mBulletSp2.paused = true;
      return void this.node.pauseAllActions();
    }
    this.node.resumeAllActions();
    this.mBulletSp1.paused = false;
    this.mBulletSp2.paused = false;
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mBulletSp1", undefined);
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mBulletSp2", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletPb1", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletPb2", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_Bullet10011;