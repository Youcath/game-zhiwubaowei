var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_EnemyBulletBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletImg = null;
    e._atkNum = 0;
    e._atkPos = null;
    e._moveSpd = 20;
    e.mLastPos = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function (t, e, o) {
    var i = this;
    this._atkNum = e;
    this._atkPos = o;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/enemyBullet/" + t.modeName + "_zidan",
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      i.mBulletImg.spriteFrame = t;
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      var e = this._moveSpd * (t / 0.016666666666666666);
      var o = this._atkPos;
      var i = $10MathUtil.MathUtil.distance(this.node.position, o);
      var n = this.node.position.clone().sub(o.clone()).normalize();
      this.node.x -= e * n.x;
      this.node.y -= e * n.y;
      if (i <= e) {
        this.node.destroy();
        this.node.removeFromParent();
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyAtk", $10HomeEnum.Bundles.RES);
        return void $10BattleDataProxy.battleDataProxy.updateHouseHp({
          isCirt: false,
          num: -this._atkNum
        });
      }
      this.setAngle();
    }
  };
  _ctor.prototype.setAngle = function () {
    var t = this.node.position;
    if (this.mLastPos) {
      var e = -1e4;
      if (t != this.mLastPos) {
        var o = t.sub(this.mLastPos);
        var i = cc.v2(o);
        var n = cc.v2(1, 0);
        var a = i.magSqr();
        var r = n.magSqr();
        if (0 == a || 0 == r) {
          return;
        }
        var s = i.signAngle(n);
        var c = Math.floor(cc.misc.radiansToDegrees(s));
        e = c;
        c = -c;
        this.node.angle = c;
        this.mLastPos = t;
      }
      return e;
    }
    this.mLastPos = t;
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mBulletImg", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_EnemyBulletBase;