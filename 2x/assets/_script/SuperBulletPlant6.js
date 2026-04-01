var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyPathIce = require("EnemyPathIce");
var $10BulletBase = require("BulletBase");
var $10BulletFire = require("BulletFire");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_SuperBulletPlant6 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletFirePb = null;
    e._enemyPathIdx = 0;
    e._firePathIdx = 0;
    e._isCanMove = true;
    e._continueTime = 0;
    e._atkNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if (($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) && this._isCanMove) {
      var e = this._moveSpd * (t / 0.016666666666666666);
      var o = this._atkPos;
      var i = this.node.position.clone().sub(o.clone()).normalize();
      this.node.x -= e * i.x;
      this.node.y -= e * i.y;
      $10MathUtil.MathUtil.distance(this.node.position, o) <= e && this.moveArrive();
    }
  };
  _ctor.prototype.initBullet = function () {};
  _ctor.prototype.initFixedPlantBullet = function (t, e, o) {
    var i = this;
    this._continueTime = e;
    this._atkRate = o;
    this._atkNum = t;
    this.mSpAni.setCompleteListener(function (e) {
      if ("bomb" == (e.animation ? e.animation.name : "")) {
        $10BattleDataProxy.battleDataProxy.enemyPathIce.forEach(function (t) {
          var e;
          t && t.isValid && (null === (e = t.getComponent($10EnemyPathIce.default)) || undefined === e || e.playIceSp());
        });
        $10BattleDataProxy.battleDataProxy.enemyPathIce = [];
        $10EventManager.EventManager.instance.emit($10GameEnum.EGameEvent.SCREEN_SHAKE);
        var o = cc.instantiate(i.mBulletFirePb);
        $10BattleDataProxy.battleDataProxy.battleView.addChild(o, -500);
        o.position = i.node.position;
        o.getComponent($10BulletFire.default).initBulletFire(i._firePathIdx, t, i._continueTime, i._atkRate);
        i.node.destroy();
        i.node.removeFromParent();
      }
    });
  };
  _ctor.prototype.initAtkPos = function (t) {
    this._enemyPathIdx = t;
    var e = $10BattleDataProxy.battleDataProxy.enemyMovePaths[1];
    if (1 == this._enemyPathIdx) {
      this._atkPos = cc.v3(0, e[0].y);
      this._firePathIdx = 0;
    } else if (2 == this._enemyPathIdx) {
      this._atkPos = cc.v3(e[1].x, 90);
      this._firePathIdx = 1;
    } else {
      this._atkPos = cc.v3(0, e[2].y);
      this._firePathIdx = 2;
    }
  };
  _ctor.prototype.moveArrive = function () {
    this._isCanMove = false;
    this.node.zIndex = -this.node.y;
    this.mSpAni.paused = false;
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/plant12", $10HomeEnum.Bundles.RES);
    this.mSpAni.setAnimation(0, "bomb", false);
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletFirePb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletBase.default);
exports.default = def_SuperBulletPlant6;