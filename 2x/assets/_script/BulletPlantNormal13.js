var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10BulletBase = require("BulletBase");
var $10BulletPlantSplit = require("BulletPlantSplit");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletPlantNormal13 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletSplitPb = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, o, i, n) {
    t.prototype.initBullet.call(this, e, o, i, n);
    var a = cc.tween(this.node).by(.1, {
      angle: 90
    });
    cc.tween(this.node).repeatForever(a).start();
  };
  _ctor.prototype.moveArrive = function (e) {
    this.addBulletHit(e);
    this.addBulletSplit();
    t.prototype.moveArrive.call(this, e);
  };
  _ctor.prototype.addBulletSplit = function () {
    if ($10BattleDataProxy.battleDataProxy.checkHasSkill(130001)) {
      var t = Math.floor(1e3 * Math.random()) % 70;
      for (var e = 0; e < 5; ++e) {
        var o = $10NodePoolManager.default.instance.getNode(this.mBulletSplitPb);
        $10BattleDataProxy.battleDataProxy.bulletView.addChild(o, this.node.zIndex);
        o.position = this.node.position;
        o.getComponent($10BulletPlantSplit.default).initBulletPlantSplit(t + 72 * e, this._plantId, this._synthesisLv, this._atkTarget);
      }
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletSplitPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_BulletPlantNormal13;