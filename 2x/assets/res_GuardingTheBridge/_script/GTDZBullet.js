var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10GuardingDataProxy = require("GuardingDataProxy");
var $10GTBulletBase = require("GTBulletBase");
var $10SimplyCircleCollider = require("SimplyCircleCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GTMonster = require("GTMonster");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10GTGameMgr = require("GTGameMgr");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_GTDZBullet = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._colliderNode = null;
    e._damage = 0;
    e._direction = cc.v3(0, 1, 0);
    e._speed = 1e3;
    e._markingnodes = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    0 == this._endMaxY && (this._endMaxY = cc.winSize.height / 2 + 100);
    this._colliderNode || (this._colliderNode = this.node.getChildByName("Collider"));
  };
  _ctor.prototype.init = function (e) {
    t.prototype.init.call(this, e);
    this._markingnodes = [];
    if (e) {
      this._damage = e.damage || 0;
      this._direction = e.direction || cc.v3(0, 1, 0);
      this._speed = e.speed || 800;
      this._penetrate = e.penetrate || 1;
    }
    this.node.active = true;
  };
  _ctor.prototype.update = function (t) {
    if ($10GuardingDataProxy.guardingDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      var e = this._direction.mul(this._speed * t);
      this.node.position = this.node.position.add(e);
      if (this.node.y > this._endMaxY || this.node.x > cc.winSize.width / 2 + 100 || this.node.x < -cc.winSize.width / 2 - 100) {
        this.recycle(false);
      } else {
        this.checkCollision();
      }
    }
  };
  _ctor.prototype.checkCollision = function () {
    if (this._colliderNode) {
      var t = $10GuardingDataProxy.guardingDataProxy.monsters;
      if (t.length > 0) {
        var e = undefined;
        var o = undefined;
        var i = undefined;
        var a = undefined;
        for (var n = t.length - 1; n >= 0; n--) {
          i = null == (o = (e = t[n]).getChildByName("Collider")) ? undefined : o.getComponent($10SimplyCircleCollider.default);
          a = this._colliderNode.getComponent($10SimplyRectCollider.default);
          if (i && a && $10SimplyCollisionDetector.default.isCollisionRectToCircle(a.rect, i.circle)) {
            if (this._markingnodes.length > 0 && this._markingnodes.indexOf(e.uuid) > -1) {
              return;
            }
            return void this.onHitTarget(e);
          }
        }
      }
    }
  };
  _ctor.prototype.onHitTarget = function (t) {
    this._markingnodes.push(t.uuid);
    $10GTGameMgr.default.instance.hitEffect(this.node.position, "zidan12");
    var e = t.getComponent($10GTMonster.default);
    e && e.beAttack(this._damage);
    this._penetrate--;
    this._penetrate <= 0 && this.recycle();
  };
  _ctor.prototype.recycle = function (t) {
    undefined === t && (t = true);
    this._markingnodes = [];
    this.node.active = false;
    this.node.removeFromParent();
    this.node.destroy();
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10GTBulletBase.default);
exports.default = def_GTDZBullet;