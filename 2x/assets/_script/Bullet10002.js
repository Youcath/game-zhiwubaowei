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
var $10BulletBase = require("BulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_Bullet10002 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletPb = null;
    e._bulletTime = 0;
    e._addBulletNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (e) {
    t.prototype.update.call(this, e);
    if (!($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.READY)) {
      this._bulletTime += e;
      if (this._bulletTime >= .5) {
        this._bulletTime = 0, this.addBullet();
      }
    }
  };
  _ctor.prototype.initBullet = function (e, o, i, n, a) {
    t.prototype.initBullet.call(this, e, o, i, n, a);
    this._addBulletNum = 0;
    this._bulletTime = 0;
    this._isPenetrate = true;
    this._moveSpd = 5;
    cc.Tween.stopAllByTarget(this.mImg.node);
    var r = cc.tween(this.mImg.node).by(.3, {
      angle: 180
    });
    cc.tween(this.mImg.node).repeatForever(r).start();
    this.addBullet();
  };
  _ctor.prototype.setBulletSpriteFrame = function () {};
  _ctor.prototype.addBullet = function () {
    if (!(this._addBulletNum >= 5)) {
      this._addBulletNum++;
      for (var t = 0; t < 20; ++t) {
        var e = $10NodePoolManager.default.instance.getNode(this.mBulletPb);
        $10BattleDataProxy.battleDataProxy.battleView.addChild(e);
        var o = 18 * t;
        var i = $10MathUtil.MathUtil.getRadian(o);
        var n = this.node.x + this.node.width / 2 * Math.cos(i);
        var a = this.node.y + this.node.width / 2 * Math.sin(i);
        e.position = cc.v3(n, a);
        e.getComponent($10BulletBase.default).atkRate = this._atkRate;
        e.getComponent($10BulletBase.default).superRate = 1;
        e.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
        e.getComponent($10BulletBase.default).initBullet(10002, this.node, this._synthesisLv, this._atkCount, false, "CWzidan5");
        var s = o + 90;
        var p = $10MathUtil.MathUtil.getRadian(s);
        var h = n + cc.winSize.height * Math.cos(p);
        var d = a + cc.winSize.height * Math.sin(p);
        e.getComponent($10BulletBase.default).setAtkPos(cc.v3(h, d));
      }
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_Bullet10002;