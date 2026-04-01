var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10STJDataProxy = require("STJDataProxy");
var $10Util = require("Util");
var $10STMonster = require("STMonster");
var $10STBullet = require("STBullet");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_STRoleBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mbody = null;
    e.mbullet = null;
    e.mCollider = null;
    e.maxHp = 0;
    e.hp = 0;
    e.atkSpeed = 0;
    e.atk = 0;
    e.wood = 0;
    e.atkRange = 0;
    e._amimState = $10GameEnum.RoleState.Dead;
    e._atkInverval = 0;
    e._roleId = 0;
    e.mDamageNumberObjects = [];
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "col", {
    get: function () {
      return this._grid.col;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.update = function (t) {
    if ($10STJDataProxy.sTJDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead) {
      this._atkInverval >= 0 && (this._atkInverval -= t);
      if (this._atkInverval <= 0) {
        this.attack(), this._atkInverval = this.getSpeedAtk();
      }
    }
  };
  _ctor.prototype.getSpeedAtk = function () {
    return this.atkSpeed * $10STJDataProxy.sTJDataProxy.speedAtkBuff;
  };
  _ctor.prototype.attack = function () {
    var t = this;
    if (this._amimState != $10GameEnum.RoleState.Dead) {
      var e = false;
      var o = null;
      var i = Number.MAX_VALUE;
      for (var n = 0; n < $10STJDataProxy.sTJDataProxy.enemySoldiers.length; n++) {
        var a = $10STJDataProxy.sTJDataProxy.enemySoldiers[n];
        if (a && a.isValid && a.getComponent($10STMonster.default).amimState != $10GameEnum.RoleState.Dead) {
          var s = a.getComponent($10STMonster.default);
          if (s && s.col === this.col && a.y >= this.node.y) {
            e = true;
            var m = cc.Vec2.distance(cc.v2(this.node.x, this.node.y), cc.v2(a.x, a.y));
            if (m < i) {
              i = m;
              o = a;
            }
          }
        }
      }
      e && o && this.palyAttackAni(function () {
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/launch", $10HomeEnum.Bundles.SmashTheJar);
        var e = cc.instantiate(t.mbullet);
        $10STJDataProxy.sTJDataProxy.bulletLayer.addChild(e);
        e.active = true;
        e.position = $10Util.default.nodeParentChangeLocalPos(t.mbullet, $10STJDataProxy.sTJDataProxy.bulletLayer);
        e.getComponent($10STBullet.default).initBullet(t.atk, 1, t._roleId, o);
      });
    }
  };
  _ctor.prototype.initRole = function (t, e) {
    this._roleId = t.id;
    this.maxHp = t.hp;
    this.hp = t.hp;
    this.atk = t.atk;
    this.wood = t.wood;
    this.atkRange = t.num;
    this.atkSpeed = t.speed;
    this._grid = e;
    this._atkInverval = this.getSpeedAtk();
    this._amimState = $10GameEnum.RoleState.Breath;
  };
  _ctor.prototype.beAttack = function (t) {
    if (this.mbody) {
      this.mbody.color = cc.Color.RED;
      cc.Tween.stopAllByTarget(this.mbody);
      cc.tween(this.mbody).to(.2, {
        color: cc.Color.WHITE
      }).start();
    }
    this.showHurtLab(t, false);
    this.hp -= t;
    this.hp <= 0 && this.playDeath();
  };
  _ctor.prototype.showHurtLab = function (t, e) {
    var o = this.node.position;
    o.y += 50;
    $10Util.default.showHurt(Math.ceil(t), e ? $10Util.HurtType.CRIT : $10Util.HurtType.NORMAL, o, this, $10STJDataProxy.sTJDataProxy.effectLayer);
  };
  _ctor.prototype.skillKillDie = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.SmashTheJar,
      path: "prefabs/ZhuaHen",
      type: cc.Prefab
    }).then(function (e) {
      var o = cc.instantiate(e);
      o.parent = $10STJDataProxy.sTJDataProxy.effectLayer;
      o.setPosition(t.node.position);
      o.opacity = 0;
      cc.tween(o).to(.1, {
        opacity: 255
      }).delay(.2).to(.1, {
        opacity: 0
      }).call(function () {
        o.destroy();
        o.removeFromParent();
        t.playDeath();
      }).start();
    });
  };
  _ctor.prototype.palyAttackAni = function (t) {
    cc.tween(this.mbody).to(.2, {
      scaleY: .6
    }).to(.1, {
      scale: 1
    }).call(function () {
      t && t();
    }).start();
  };
  _ctor.prototype.playDeath = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead) {
      this._amimState = $10GameEnum.RoleState.Dead;
      $10STJDataProxy.sTJDataProxy.jarStates.set(this._grid.id, "broken");
      var t = $10STJDataProxy.sTJDataProxy.soldiers.indexOf(this.node);
      -1 != t && $10STJDataProxy.sTJDataProxy.soldiers.splice(t, 1);
      this.node.destroy();
      this.node.removeFromParent();
    }
  };
  _ctor.prototype.pushDamageNumberObject = function (t) {
    if (this.mDamageNumberObjects) {
      this.damageNumberObjectActive();
      this.mDamageNumberObjects.push(t);
    }
  };
  _ctor.prototype.removeDamageNumberObject = function (t) {
    if (this.mDamageNumberObjects) {
      for (var e = 0; e < this.mDamageNumberObjects.length; ++e) {
        if (this.mDamageNumberObjects[e] == t) {
          this.mDamageNumberObjects.splice(e, 1);
          break;
        }
      }
    }
  };
  _ctor.prototype.damageNumberObjectActive = function () {
    if (this.mDamageNumberObjects) {
      for (var t = 0; t < this.mDamageNumberObjects.length; ++t) {
        var e = this.mDamageNumberObjects[t];
        var o = cc.moveBy(.1, cc.v2(0, 30));
        e && e.isValid && e.node.runAction(o);
      }
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mbody", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mbullet", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mCollider", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_STRoleBase;