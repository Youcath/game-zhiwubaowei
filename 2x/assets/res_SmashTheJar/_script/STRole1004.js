var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10STJDataProxy = require("STJDataProxy");
var $10STBulletLight = require("STBulletLight");
var $10STMonster = require("STMonster");
var $10STRoleBase = require("STRoleBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_STRole1004 = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.SmashTheJar,
      path: "prefabs/STBuildLight",
      type: cc.Prefab
    }).then(function () {});
  };
  _ctor.prototype.update = function (t) {
    if ($10STJDataProxy.sTJDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead) {
      this._atkInverval >= 0 && (this._atkInverval -= t);
      if (this._atkInverval <= 0) {
        this.attack(), this._atkInverval = this.getSpeedAtk();
      }
    }
  };
  _ctor.prototype.attack = function () {
    var t = this;
    if (this._amimState != $10GameEnum.RoleState.Dead) {
      var e = $10STJDataProxy.sTJDataProxy.enemySoldiers.filter(function (t) {
        return t && t.isValid && t.getComponent($10STMonster.default).amimState != $10GameEnum.RoleState.Dead;
      });
      if (0 != e.length) {
        var o = e[Math.floor(Math.random() * e.length)];
        $10ResUtil.ResUtil.loadAsset({
          bundleName: $10HomeEnum.Bundles.SmashTheJar,
          path: "prefabs/STBuildLight",
          type: cc.Prefab
        }).then(function (e) {
          o && o.isValid && t.palyAttackAni(function () {
            if (o && o.isValid) {
              var i = cc.instantiate(e);
              i.parent = $10STJDataProxy.sTJDataProxy.effectLayer;
              var n = {
                num: t.atk,
                isCrit: false
              };
              i.position = o.position;
              i.getComponent($10STBulletLight.default).initBulletLight(n);
              i.active = true;
            }
          });
        });
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10STRoleBase.default);
exports.default = def_STRole1004;