var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10UserDataProxy = require("UserDataProxy");
var $10AnimationMgr = require("AnimationMgr");
var $10HomeCollisionBase = require("HomeCollisionBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_CollisionGoldItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mGoldCount = null;
    e._goldCount = 0;
    e._maxCount = 10;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    this.mGoldCount.string = "0/10";
    this._goldCount = 0;
  };
  _ctor.prototype.onCollision = function () {
    this._goldCount++;
    if (this._goldCount >= this._maxCount) {
      this._goldCount = 0;
      $10UserDataProxy.userDataProxy.changeGold(5);
      $10AnimationMgr.default.instance.showAwardAni({
        id: 1,
        num: 5
      }, null, this.node);
    }
    this.mGoldCount.string = this._goldCount + "/" + this._maxCount;
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mGoldCount", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10HomeCollisionBase.default);
exports.default = def_CollisionGoldItem;