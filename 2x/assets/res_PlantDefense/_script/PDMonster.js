var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10PopupManager = require("PopupManager");
var $10AnimationCfgMgr = require("AnimationCfgMgr");
var $10AnimationCtrl = require("AnimationCtrl");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10Util = require("Util");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDMonster = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mColliderNode = null;
    e.mBody = null;
    e.mAnimCtrl = null;
    e.mMonsterId = 0;
    e._isReadyOK = false;
    e._moveDir = null;
    e._moveSpeed = 0;
    e._target = null;
    e._enemyInfo = null;
    e._hp = 0;
    e._hpMax = 0;
    e._atkRange = 0;
    e._soliderAtkDis = 0;
    e._atkInterval = 0;
    e._amimState = $10GameEnum.RoleState.Dead;
    e._atkReady = true;
    e._atkInverval = 0;
    e._atkIntervalMulti = 0;
    e._atkAddPercent = 0;
    e._moveSpdAddPercent = 0;
    e._isFrezyReady = false;
    e._isBoomReady = false;
    e._isAnimReady = false;
    e._moveBuff = 1;
    e._col = 0;
    e.mDamageNumberObjects = [];
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "hpMax", {
    get: function () {
      return this._hpMax;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "amimState", {
    get: function () {
      return this._amimState;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "monsterId", {
    get: function () {
      return this.mMonsterId;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "bodyHeight", {
    get: function () {
      return this.mBody.height;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "col", {
    get: function () {
      return this._col;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onDisable = function () {
    var t = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.indexOf(this.node);
    -1 != t && $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.splice(t, 1);
    $10EventManager.EventManager.instance.emit($10PlantDefenseDataProxy.PDDataEvent.CHECK_GAME_END);
  };
  _ctor.prototype.onLoad = function () {
    this._atkIntervalMulti = 0;
    this._isReadyOK = false;
  };
  _ctor.prototype.update = function (t) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._enemyInfo && this._amimState != $10GameEnum.RoleState.Dead && this._isReadyOK && (this._atkInverval >= 0 && (this._atkInverval -= t * (1 + this._atkIntervalMulti)), this.checkAtk(), this._amimState == $10GameEnum.RoleState.Move && this.move(t), this._amimState == $10GameEnum.RoleState.Attack)) {
      if (!this._target || !this._target.isValid) {
        return;
      }
      this._atkReady && this._atkInverval <= 0 && this.attack();
    }
  };
  _ctor.prototype.initEnemy = function (t, e, n) {
    var o = this;
    this._isReadyOK = false;
    this._enemyInfo = t;
    this._col = e;
    this._atkAddPercent = 0;
    this._moveSpdAddPercent = 0;
    this._atkIntervalMulti = 0;
    this._isAnimReady = false;
    this._isFrezyReady = false;
    this._isBoomReady = false;
    this.mBody.scaleX = -1;
    this.mBody.scaleY = 1;
    if (this.mAnimCtrl) {
      this.mAnimCtrl.loadAtlasAnimation($10AnimationCfgMgr.AnimationCfgMgr.instance.getAnimationCfg($10DataManager.DataManager.instance.eData.datamonster[t.id])).then(function () {
        o.playMoveAnim();
        o._amimState = $10GameEnum.RoleState.Move;
        o._isAnimReady = true;
        o._atkReady = true;
        var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.stagetAddBuff - $10PlantDefenseDataProxy.plantDefenseDataProxy.stagetJianBuff;
        o._hpMax = Math.floor(t.hp * e);
        o._hp = o._hpMax;
        o._moveSpeed = t.speed;
        o.node.zIndex = -o.node.y;
        o._hp = o._hpMax;
        o._moveSpeed = t.speed;
        o.node.zIndex = -o.node.y;
        o._isReadyOK = true;
        n && n();
      });
    } else {
      this.playMoveAnim();
      this._amimState = $10GameEnum.RoleState.Move;
      this._isAnimReady = true;
      this._atkReady = true;
      var i = $10PlantDefenseDataProxy.plantDefenseDataProxy.stagetAddBuff - $10PlantDefenseDataProxy.plantDefenseDataProxy.stagetJianBuff;
      this._hpMax = Math.floor(t.hp * i);
      this._hp = this._hpMax;
      this._moveSpeed = t.speed;
      this.node.zIndex = -this.node.y;
      this._hp = this._hpMax;
      this._moveSpeed = t.speed;
      this.node.zIndex = -this.node.y;
      this._isReadyOK = true;
      n && n();
    }
  };
  _ctor.prototype.stopMoveBuff = function (t, e) {
    var n = this;
    if (e < this._moveBuff) {
      this._moveBuff = e;
      var o = null;
      if ((o = this.mAnimCtrl ? this.mAnimCtrl.node : this.mBody) || o.isValid) {
        o.color = cc.Color.BLUE;
        this.unscheduleAllCallbacks();
        this.scheduleOnce(function () {
          n._moveBuff = 1;
          (o || o.isValid) && (o.color = cc.Color.WHITE);
        }, t);
      }
    }
  };
  _ctor.prototype.breath = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead) {
      this._amimState = $10GameEnum.RoleState.Breath;
      this.playMoveAnim();
    }
  };
  _ctor.prototype.playBreath = function () {
    this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady && this.mAnimCtrl.playAnim("breath", true);
  };
  _ctor.prototype.playMoveAnim = function () {
    this.mAnimCtrl.playAnim("move", true, null, null, 3);
  };
  _ctor.prototype.attack = function () {
    var t = this;
    if (this._amimState != $10GameEnum.RoleState.Dead) {
      this._atkReady = false;
      return this.playAttack(function () {
        t._atkInverval = t._enemyInfo.speed;
        t._atkReady = true;
        t.breath();
        t._amimState = $10GameEnum.RoleState.Move;
      }, this._target);
    }
  };
  _ctor.prototype.playAttack = function (t, e) {
    var n = this;
    this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady && this.playAtkAnim(function () {
      n.shoot(e);
      t && t();
    });
  };
  _ctor.prototype.playAtkAnim = function (t) {
    this.scheduleOnce(function () {
      t && t();
    }, .5);
  };
  _ctor.prototype.hit = function () {
    cc.Tween.stopAllByTarget(this.mBody);
    this.mBody.scaleX = -1;
    this.mBody.scaleY = 1;
    var t = null;
    if ((t = this.mAnimCtrl ? this.mAnimCtrl.node : this.mBody) || t.isValid) {
      if (t.color == cc.Color.BLUE) {
        t.color = cc.Color.RED, this.scheduleOnce(function () {
          (t || t.isValid) && (t.color = cc.Color.WHITE);
        }, .2);
      }
      cc.tween(this.mBody).to(.1, {
        scaleX: -1.2,
        scaleY: 1.2
      }).to(.2, {
        scaleX: -1,
        scaleY: 1
      }).start();
    }
  };
  _ctor.prototype.getMoveSpeed = function () {
    return this._enemyInfo.speed * this._moveBuff;
  };
  _ctor.prototype.move = function (t) {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._amimState != $10GameEnum.RoleState.Attack) {
      this._moveDir || (this._moveDir = cc.v3(0, -1, 0));
      var e = this.getMoveSpeed() * t;
      var n = this.node.position.clone();
      n.y -= e;
      this.node.position = n;
      this.node.zIndex = -this.node.y;
      if (this.node.y < -cc.winSize.height / 2 - 50) {
        this.recycle();
        $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState = $10GameEnum.GameState.OVER;
        $10PopupManager.PopupManager.instance.show({
          bundleName: $10HomeEnum.Bundles.SmashTheJar,
          path: "prefabs/popups/STLosePopup",
          keep: true
        });
      }
    }
  };
  _ctor.prototype.checkAtk = function () {
    for (var t = 0; t < $10PlantDefenseDataProxy.plantDefenseDataProxy.soldiers.length; t++) {
      var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.soldiers[t];
      e && e.isValid;
    }
    this.playMoveAnim();
    this._amimState = $10GameEnum.RoleState.Move;
  };
  _ctor.prototype.shoot = function (t) {
    this._amimState != $10GameEnum.RoleState.Dead && t && t.isValid && $10AudioManager.AudioManager.instance.playEffectPath("sounds/hit2", $10HomeEnum.Bundles.SmashTheJar);
  };
  _ctor.prototype.subHp = function (t) {
    isNaN(t) && (t = 1);
    this._hp -= t;
    isNaN(this._hp) && (this._hp = 10);
    this._hp < 0 && (this._hp = 0);
  };
  _ctor.prototype.showHurtLab = function (t, e) {
    var n = this.node.position;
    n.y += this.mBody.height;
    $10Util.default.showHurt(Math.ceil(t), e ? $10Util.HurtType.CRIT : $10Util.HurtType.NORMAL, n, this, $10PlantDefenseDataProxy.plantDefenseDataProxy.effectLayer);
  };
  _ctor.prototype.beAttack = function (t, e, n) {
    undefined === n && (n = true);
    return !this._enemyInfo || this._amimState == $10GameEnum.RoleState.Dead || (t.num = 1 * t.num, this.subHp(t.num), n && this.showHurtLab(t.num, t.isCrit), $10AudioManager.AudioManager.instance.playEffectPath("sounds/hit", $10HomeEnum.Bundles.RES), this._hp <= 0 ? (this.dealDie(e), true) : (this.hit(), false));
  };
  _ctor.prototype.dealDie = function (t) {
    if (this._amimState == $10GameEnum.RoleState.Dead) {
      return true;
    }
    this._amimState = $10GameEnum.RoleState.Dead;
    this.playDie(t);
  };
  _ctor.prototype.playMoveAnimTS = function () {};
  _ctor.prototype.playDeadAnim = function (t) {
    this.mAnimCtrl.playAnim("die", false, function () {
      t && t();
    }, null, 5);
  };
  _ctor.prototype.playDie = function (t) {
    var e = this;
    if (this._isBoomReady) {
      this.mAnimCtrl.node.active = false;
      this.playDeadAnim(function () {
        e.recycle(t);
      });
    } else {
      this.recycle(t);
    }
  };
  _ctor.prototype.recycle = function () {
    var t = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.indexOf(this.node);
    -1 != t && $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.splice(t, 1);
    if (this.node && this.node.isValid) {
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
        var n = cc.moveBy(.1, cc.v2(0, 30));
        e && e.isValid && e.node.runAction(n);
      }
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mColliderNode", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBody", undefined);
  cc__decorate([ccp_property({
    type: $10AnimationCtrl.default
  })], _ctor.prototype, "mAnimCtrl", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDMonster;