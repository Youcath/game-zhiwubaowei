var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10BulletHit = require("BulletHit");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_BulletHit10005 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._boomTime = 1;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletHit = function () {
    this._boomTime = 1;
    this.node.zIndex = -this.node.y;
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/bulletHit6", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.update = function (t) {
    if (!($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.READY || this._boomTime <= 0)) {
      this._boomTime -= t;
      if (this._boomTime <= 0) {
        this.node.destroy(), this.node.removeFromParent();
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10BulletHit.default);
exports.default = def_BulletHit10005;