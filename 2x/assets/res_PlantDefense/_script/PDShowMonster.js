var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDShowMonster = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._parent = null;
    e._moveSpeed = 50;
    e._targetPos = null;
    e._moveThreshold = 5;
    e._changeTargetTime = 2;
    e._timer = 0;
    e._lastDirection = cc.Vec2.ZERO;
    e._facingRight = true;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.start = function () {
    this._parent = this.node.parent;
    this.generateRandomTarget();
    this.updateZIndex();
  };
  _ctor.prototype.update = function (t) {
    if (this._parent) {
      this._timer += t;
      if (!this._targetPos || this.isReachedTarget() || this._timer >= this._changeTargetTime) {
        this.generateRandomTarget(), this._timer = 0;
      }
      this.moveToTarget(t);
      this.updateZIndex();
    }
  };
  _ctor.prototype.generateRandomTarget = function () {
    if (this._parent) {
      var t = this._parent.getContentSize();
      var e = this.node.getContentSize();
      var n = -t.width / 2 + e.width / 2;
      var o = t.width / 2 - e.width / 2;
      var i = -t.height / 2 + e.height / 2;
      var a = t.height / 2 - e.height / 2;
      var r = n + Math.random() * (o - n);
      var s = i + Math.random() * (a - i);
      this._targetPos = cc.v2(r, s);
    }
  };
  _ctor.prototype.moveToTarget = function (t) {
    if (this._targetPos) {
      var e = this.node.position;
      var n = this._targetPos.sub(cc.v2(e.x, e.y));
      if (n.mag() > this._moveThreshold) {
        n.normalizeSelf();
        var o = this._moveSpeed * t;
        this.updateFacing(n);
        var i = cc.v2(e.x, e.y).add(n.mul(o));
        this.node.setPosition(i.x, i.y);
        this._lastDirection = n.clone();
      }
    }
  };
  _ctor.prototype.updateFacing = function (t) {
    if (this.node && Math.abs(t.x) > .1) {
      var e = t.x > 0;
      if (this._facingRight !== e) {
        this._facingRight = e;
        this.node.scaleX = this._facingRight ? Math.abs(this.node.scaleX) : -1 * Math.abs(this.node.scaleX);
      }
    }
  };
  _ctor.prototype.updateZIndex = function () {
    this.node.zIndex = -this.node.y;
  };
  _ctor.prototype.isReachedTarget = function () {
    return !this._targetPos || cc.v2(this.node.position.x, this.node.position.y).sub(this._targetPos).mag() <= this._moveThreshold;
  };
  _ctor.prototype.setMoveSpeed = function (t) {
    this._moveSpeed = t;
  };
  _ctor.prototype.getFacing = function () {
    return this._facingRight;
  };
  _ctor.prototype.setFacing = function (t) {
    if (this._facingRight !== t) {
      this._facingRight = t;
      this.node && (this.node.scaleX = this._facingRight ? Math.abs(this.node.scaleX) : -1 * Math.abs(this.node.scaleX));
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDShowMonster;