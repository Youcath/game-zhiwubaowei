var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10BulletHit = require("BulletHit");
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10SimplyCircleCollider = require("SimplyCircleCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10STJDataProxy = require("STJDataProxy");
var $10STMonster = require("STMonster");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_STBullet = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mColliderNode = null;
    e._damage = 0;
    e._speed = 1e3;
    e._direction = 0;
    e._maxY = 0;
    e._isplay = false;
    e._roleId = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if ($10STJDataProxy.sTJDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._isplay) {
      this.node.y += this._speed * t * this._direction;
      this.onMonsterCollider();
      if (Math.abs(this.node.y) > this._maxY) {
        this._isplay = false, this.node.destroy();
      }
    }
  };
  _ctor.prototype.initBullet = function (t, e, o, i) {
    this._roleId = o;
    this._damage = t;
    this._direction = e;
    this._maxY = cc.winSize.height / 2 + 50;
    this._isplay = true;
    if (1003 == o) {
      var n = cc.winSize.height;
      i && i.isValid && (n = $10MathUtil.MathUtil.distance(i.position, this.node.position));
      var a = n / (1 * this._speed / 60) / 60;
      cc.tween(this.node).to(.7 * a, {
        scale: 2
      }).to(.3 * a, {
        scale: .9
      }).start();
      cc.tween(this.node).to(a, {
        angle: 360
      }).start();
    }
  };
  _ctor.prototype.onMonsterCollider = function () {
    var t = $10STJDataProxy.sTJDataProxy.enemySoldiers;
    for (var e = 0; e < t.length; ++e) {
      var o = t[e];
      if (o.isValid) {
        var i = o.getChildByName("Collider").getComponent($10SimplyCircleCollider.default);
        var n = this.mColliderNode.getComponent($10SimplyCircleCollider.default);
        if (i && n && $10SimplyCollisionDetector.default.isCollisionCircleToCircle(i.circle, n.circle)) {
          var a = {
            num: this._damage,
            isCrit: false
          };
          o.getComponent($10STMonster.default).beAttack(a);
          1003 == this._roleId && o.getComponent($10STMonster.default).stopMoveBuff(2, .8);
          this.addBulletHit();
          this.node.destroy();
          return void this.node.removeFromParent();
        }
      }
    }
  };
  _ctor.prototype.addBulletHit = function () {
    if (1003 == this._roleId) {
      var t = this.node.parent;
      var e = this.node.position.clone();
      $10ResUtil.ResUtil.loadAsset({
        bundleName: $10HomeEnum.Bundles.GAME,
        path: "prefabs/bullet/BulletHit",
        type: cc.Prefab
      }).then(function (o) {
        var i = cc.instantiate(o);
        t.addChild(i);
        i.position = e;
        i.getComponent($10BulletHit.default).initBulletHit(11, 2, true);
      });
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mColliderNode", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_STBullet;