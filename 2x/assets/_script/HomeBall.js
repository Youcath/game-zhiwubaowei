var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10NodePoolManager = require("NodePoolManager");
var $10BallCollisionEffect = require("BallCollisionEffect");
var $10HomeCollisionBase = require("HomeCollisionBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_HomeBall = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mRigidBody = null;
    e.mCollisionEffectPb = null;
    e._baseTargetSpeed = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    this.mRigidBody.linearVelocity = this.getLinearVelocity();
    this._baseTargetSpeed = this.mRigidBody.linearVelocity.lengthSqr();
  };
  _ctor.prototype.getLinearVelocity = function () {
    var t = Math.floor(100 * Math.random()) % 2 == 0 ? 1 : -1;
    var e = Math.floor(100 * Math.random()) % 2 == 0 ? 1 : -1;
    return cc.v2($10GameEnum.EGameEnum.BALL_SPEED * t, $10GameEnum.EGameEnum.BALL_SPEED * e);
  };
  _ctor.prototype.onBeginContact = function (t, e, o) {
    var i;
    var n = o.node;
    null === (i = n.getComponent($10HomeCollisionBase.default)) || undefined === i || i.onCollision();
    var a = t.getWorldManifold().points;
    var r = $10NodePoolManager.default.instance.getNode(this.mCollisionEffectPb);
    this.node.parent.addChild(r);
    var u = this.node.parent.convertToNodeSpaceAR(cc.v3(a[0]));
    r.position = u;
    r.getComponent($10BallCollisionEffect.default).play();
    var p = n.getChildByName("root");
    if (p) {
      cc.Tween.stopAllByTarget(p);
      p.scale = 1;
      cc.tween(p).to(.15, {
        scale: 1.1
      }).to(.15, {
        scale: 1
      }).start();
    }
  };
  _ctor.prototype.pause = function () {
    this.mRigidBody.type = cc.RigidBodyType.Static;
  };
  _ctor.prototype.resume = function () {
    this.mRigidBody.type = cc.RigidBodyType.Dynamic;
  };
  _ctor.prototype.lateUpdate = function () {
    var t = this.mRigidBody.linearVelocity;
    if (0 != t.x || 0 != t.y) {
      var e = t.lengthSqr();
      if (Math.abs(e - this._baseTargetSpeed) > .1) {
        var o = t.clone().normalize().multiplyScalar(Math.sqrt(this._baseTargetSpeed));
        this.mRigidBody.linearVelocity = o;
        console.log("速度更新：" + o);
      }
    }
  };
  cc__decorate([ccp_property(cc.RigidBody)], _ctor.prototype, "mRigidBody", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mCollisionEffectPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_HomeBall;