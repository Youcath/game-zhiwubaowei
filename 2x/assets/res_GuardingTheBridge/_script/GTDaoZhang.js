var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10GuardingDataProxy = require("GuardingDataProxy");
var $10GTDZBullet = require("GTDZBullet");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GTDaoZhang = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBullet = null;
    e._skillInfo = null;
    e._bulletAtk = 0;
    e._atkSpeed = 0;
    e._atkBulletNum = 0;
    e._lifeTime = 10;
    e._attackSpeed = .2;
    e._isStarShoot = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if ($10GuardingDataProxy.guardingDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._isStarShoot) {
      this._attackSpeed -= t;
      if (this._attackSpeed <= 0) {
        this._attackSpeed = this._atkSpeed, this.shoot();
      }
      this._lifeTime -= t;
      this._lifeTime <= 0 && this.recycle();
    }
  };
  _ctor.prototype.playSkill = function () {
    this._skillInfo = $10DataManager.DataManager.instance.eData.data_bridgeobstacle[20];
    var t = this._skillInfo.parm.split("|");
    this._atkBulletNum = Number(t[0]);
    this._bulletAtk = Number(t[1]);
    this._lifeTime = Number(t[2]);
    this._atkSpeed = Number(t[3]);
    this._isStarShoot = true;
  };
  _ctor.prototype.shoot = function () {
    var t = this._atkBulletNum;
    var e = 150 / (t - 1);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/sword", $10HomeEnum.Bundles.GuardingTheBridge);
    for (var o = 0; o < t; o++) {
      var i = e * o - 75;
      var a = i * Math.PI / 180;
      var n = cc.instantiate(this.mBullet);
      n.parent = $10GuardingDataProxy.guardingDataProxy.bulletLayout;
      var s = $10GuardingDataProxy.guardingDataProxy.bulletLayout.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v2(0, 0)));
      n.setPosition(s.x, s.y);
      var l = n.getComponent($10GTDZBullet.default);
      if (l) {
        var d = cc.v3(Math.sin(a), Math.cos(a), 0);
        l.init({
          damage: this._bulletAtk,
          direction: d,
          speed: 800,
          penetrate: 999
        });
      }
      n.angle = -i;
    }
  };
  _ctor.prototype.recycle = function () {
    this._isStarShoot = false;
    this.node.removeFromParent();
    this.node.destroy();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBullet", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_GTDaoZhang;