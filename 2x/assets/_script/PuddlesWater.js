var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyCircleCollider = require("SimplyCircleCollider");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletBall = require("BulletBall");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PuddlesWater = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._rowcol = "";
    e._isAbsorb = false;
    e._isDetection = false;
    e._checkTime = 0;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "rowCol", {
    get: function () {
      return this._rowcol;
    },
    set: function (t) {
      this._rowcol = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.show = function () {
    var t = this;
    this.node.scale = .1;
    cc.tween(this.node).to(1, {
      scale: 1
    }).call(function () {
      t._isDetection = true;
    }).start();
  };
  _ctor.prototype.hide = function () {};
  _ctor.prototype.update = function (t) {
    var e;
    if ($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PAUSE && !this._isAbsorb && this._isDetection) {
      var o = this.node.getComponent($10SimplyCircleCollider.default);
      var i = $10BattleDataProxy.battleDataProxy.bulletBalls;
      for (var n = 0; n < i.length; ++n) {
        var a = i[n];
        if (a && a.isValid) {
          var p = a.getComponent($10SimplyCircleCollider.default);
          if (p) {
            if ($10SimplyCollisionDetector.default.isCollisionCircleToCircle(p.circle, o.circle)) {
              a.getComponent($10BulletBall.default).pushCollisionWater(this.node);
            } else {
              a.getComponent($10BulletBall.default).removeCollisionWater(this.node);
            }
          }
        }
      }
      this._checkTime += t;
      if (this._checkTime >= .2) {
        this._checkTime = 0;
        var m = (null === (e = $10BattleDataProxy.battleDataProxy.equipRoot) || undefined === e ? undefined : e.children) || [];
        for (n = 0; n < m.length; ++n) {
          var f = m[n];
          var y = f.getComponent($10EquipmentItem.default).equipId;
          if (8 == y || 10007 == y || 10012 == y) {
            var g = f.getChildByName("root").getChildByName("collisions").children;
            for (var _ = 0; _ < g.length; ++_) {
              var v = g[_];
              var b = v.getComponent($10SimplyRectCollider.default);
              if (b && $10SimplyCollisionDetector.default.isCollisionRectToCircle(b.rect, o.circle)) {
                this._isAbsorb = true;
                this.beAbsorb(v);
                break;
              }
            }
          }
        }
      }
    }
  };
  _ctor.prototype.beAbsorb = function (t) {
    var e = this;
    var o = this.node.position;
    var i = cc.v3($10Util.default.convertToTargetNodeSpace(t, this.node));
    o.sub(i).normalize();
    var n = i.sub(o).normalize().mul(.5);
    var a = this.node.getChildByName("pic_tianqi2_niba");
    a.setAnchorPoint(cc.v2(.5, .5).add(cc.v2(n)));
    a.position = cc.v3(n.x * a.width, n.y * a.height);
    cc.tween(a).to(1, {
      scale: 0
    }).call(function () {
      e.node.destroy();
      e.node.removeFromParent();
    }).start();
    var r = $10BattleDataProxy.battleDataProxy.bulletBalls;
    for (var s = 0; s < r.length; ++s) {
      r[s].getComponent($10BulletBall.default).removeCollisionWater(this.node);
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PuddlesWater;