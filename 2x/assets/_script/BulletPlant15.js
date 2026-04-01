var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10BulletBase = require("BulletBase");
var $10BulletSoundWave = require("BulletSoundWave");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BulletPlant15 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletSoundWavePb = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (e, o, i, n) {
    t.prototype.initBullet.call(this, e, o, i, n);
    this.setBulletSpriteFrame();
    this._isCheckCollision = false;
  };
  _ctor.prototype.moveArrive = function (e) {
    this.addBulletHit(e);
    t.prototype.moveArrive.call(this, e);
  };
  _ctor.prototype.addBulletHit = function (e) {
    var o = 0;
    var i = $10BattleDataProxy.battleDataProxy.checkHasSkill(150001);
    i && (o = 100 * i.skillData.probability);
    var n = $10BattleDataProxy.battleDataProxy.checkHasSkill(150004);
    n && (o = 100 * n.skillData.probability);
    var a = false;
    Math.floor(1e3 * Math.random()) % 100 < o && (a = true);
    if (a) {
      if ($10BattleDataProxy.battleDataProxy.soundWaveTime <= 0) {
        $10BattleDataProxy.battleDataProxy.soundWaveTime = .5;
        var c = cc.instantiate(this.mBulletSoundWavePb);
        $10BattleDataProxy.battleDataProxy.bulletView.addChild(c, 1e3);
        c.position = this.node.position;
        c.getComponent($10BulletSoundWave.default).initBulletFire(this._synthesisLv);
        $10NodePoolManager.default.instance.putNode(this.node);
      } else {
        t.prototype.addBulletHit.call(this, e);
      }
    } else {
      t.prototype.addBulletHit.call(this, e);
    }
  };
  _ctor.prototype.addBulletHitEx = function () {};
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletSoundWavePb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_BulletPlant15;