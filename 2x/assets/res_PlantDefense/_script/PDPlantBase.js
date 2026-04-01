var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10Util = require("Util");
var $10PDBulletBase = require("PDBulletBase");
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDPlantBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mbody = null;
    e.mbullet = null;
    e.mCollider = null;
    e.maxHp = 0;
    e.hp = 0;
    e.atkSpeed = 0;
    e.atk = 0;
    e.atkRange = 0;
    e._amimState = $10GameEnum.RoleState.Dead;
    e._atkInverval = 0;
    e._roleId = 0;
    e._roleData = null;
    e._ptAtkTotal = 0;
    e.mDamageNumberObjects = [];
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "roleId", {
    get: function () {
      return this._roleId;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "col", {
    get: function () {
      return this._grid.col;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.update = function (t) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead) {
      this._atkInverval >= 0 && (this._atkInverval -= t);
      if (this._atkInverval <= 0) {
        this.attack(), this._atkInverval = this.getSpeedAtk();
      }
    }
  };
  _ctor.prototype.attack = function () {
    var t = this;
    if (this._amimState != $10GameEnum.RoleState.Dead) {
      var e = this.col + 1;
      if ($10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.filter(function (n) {
        return ("PDEnemy4008" != n.name || 20 == t.roleId) && !("PDEnemy4002" == n.name && !n.getComponent("PDEnemy4002").getIsCanChoose()) && n.getComponent($10PDEnemyBase.default).pathIdx == e && n.y < $10PlantDefenseDataProxy.PDPlantEnum.MAX_ATK_DISTANCE;
      }).length > 0) {
        this.palyAttackAni(function () {
          $10AudioManager.AudioManager.instance.playEffectPath("sounds/launch", $10HomeEnum.Bundles.PlantDefense);
          var n = cc.instantiate(t.mbullet);
          $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer.addChild(n);
          n.active = true;
          var o = $10Util.default.nodeParentChangeLocalPos(t.node, $10PlantDefenseDataProxy.plantDefenseDataProxy.bulletLayer);
          o.y += 20;
          n.position = o;
          var i = n.getComponent($10PDBulletBase.default);
          var a = null;
          if (3 == t.roleId || 5 == t.roleId || 8 == t.roleId) {
            var s = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.filter(function (t) {
              return ("PDEnemy4001" != t.name || !t.getComponent("PDEnemy4001").isUnderground) && t.getComponent($10PDEnemyBase.default).pathIdx == e && !t.getComponent($10PDEnemyBase.default).getIsDie() && t.y < $10PlantDefenseDataProxy.PDPlantEnum.MAX_ATK_DISTANCE && "PDEnemy4008" != t.name;
            });
            s.length > 0 && (a = s.reduce(function (t, e) {
              if (t.y < e.y) {
                return t;
              } else {
                return e;
              }
            }));
          }
          if (i) {
            i.initBullet(t._roleId, a, t.atk);
          } else {
            n.destroy();
          }
        });
        $10PlantDefenseDataProxy.plantDefenseDataProxy.getIsSuperPlant(this.roleId) && (this._ptAtkTotal += 1);
      }
    }
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
  _ctor.prototype.initBaseInfo = function (t, e) {
    this._roleId = t.id;
    this._roleData = t;
    this.maxHp = t.hp;
    this.hp = t.hp;
    this.atk = t.atk;
    this.atkSpeed = t.speed;
    this._grid = e;
    this._atkInverval = this.getSpeedAtk();
    this._amimState = $10GameEnum.RoleState.Breath;
    this.node.zIndex = -this.node.y;
    this.setSuperPlantIcon();
    $10EventManager.EventManager.instance.emit($10PlantDefenseDataProxy.PDDataEvent.UPDATE_PLANT);
  };
  _ctor.prototype.getSpeedAtk = function () {
    return this.atkSpeed * $10PlantDefenseDataProxy.plantDefenseDataProxy.speedAtkBuff;
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
  _ctor.prototype.showHurtLab = function () {};
  _ctor.prototype.playDeath = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead) {
      this._amimState = $10GameEnum.RoleState.Dead;
      var t = $10PlantDefenseDataProxy.plantDefenseDataProxy.soldiers.indexOf(this.node);
      -1 != t && $10PlantDefenseDataProxy.plantDefenseDataProxy.soldiers.splice(t, 1);
      $10PlantDefenseDataProxy.plantDefenseDataProxy.idPlants[this._roleId] && ($10PlantDefenseDataProxy.plantDefenseDataProxy.idPlants[this._roleId] -= 1);
      $10EventManager.EventManager.instance.emit($10PlantDefenseDataProxy.PDDataEvent.UPDATE_PLANT);
      this.node.destroy();
      this.node.removeFromParent();
      this._grid.node = null;
    }
  };
  _ctor.prototype.setSuperPlantIcon = function () {
    var t = this;
    var e = "";
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.getIsSuperPlant(this.roleId)) {
      e = "" + this._roleData.icon2;
      if (13 == this.roleId) {
        this.hp = Math.floor(this.hp + .5 * this.maxHp), this.maxHp = Math.floor(this.maxHp + .5 * this.maxHp);
      }
    } else {
      e = "" + this._roleData.icon;
      if (13 == this.roleId && this.maxHp > this._roleData.hp) {
        this.hp > this._roleData.hp && (this.hp = this._roleData.hp), this.maxHp = this._roleData.hp;
      }
    }
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/botanyIcon/BotanyIcon",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (n) {
      t.mbody.getComponent(cc.Sprite).spriteFrame = n.getSpriteFrame(e);
    }).catch(function (t) {
      console.log("error:", t);
    });
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
        var n = cc.moveBy(.1, cc.v2(0, 30));
        e && e.isValid && e.node.runAction(n);
      }
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mbody", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mbullet", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mCollider", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDPlantBase;