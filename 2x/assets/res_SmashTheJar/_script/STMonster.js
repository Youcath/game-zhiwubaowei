var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__values = __values;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameUIManager = require("GameUIManager");
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10CommonUtil = require("CommonUtil");
var $10ResUtil = require("ResUtil");
var $10PopupManager = require("PopupManager");
var $10AnimationCfgMgr = require("AnimationCfgMgr");
var $10AnimationCtrl = require("AnimationCtrl");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10STJDataProxy = require("STJDataProxy");
var $10Util = require("Util");
var $10STRoleBase = require("STRoleBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_STMonster = function (t) {
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
    e._speedCutTime = 0;
    e._isSpeedCut = false;
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
  _ctor.prototype.onLoad = function () {
    this._atkIntervalMulti = 0;
    this._isReadyOK = false;
  };
  _ctor.prototype.update = function (t) {
    if ($10STJDataProxy.sTJDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._enemyInfo && this._amimState != $10GameEnum.RoleState.Dead && this._isReadyOK) {
      this._atkInverval >= 0 && (this._atkInverval -= t * (1 + this._atkIntervalMulti));
      this.checkAtk();
      this._amimState == $10GameEnum.RoleState.Move && this.move(t);
      if (this._isSpeedCut && (this._speedCutTime -= t, this._speedCutTime <= 0)) {
        this._isSpeedCut = false;
        var e = null;
        this._moveBuff = 1;
        if (!(e = this.mAnimCtrl ? this.mAnimCtrl.node : this.mBody) && !e.isValid) {
          return;
        }
        e.color = cc.Color.WHITE;
      }
      if (this._amimState == $10GameEnum.RoleState.Attack) {
        if (!this._target || !this._target.isValid) {
          return;
        }
        this._atkReady && this._atkInverval <= 0 && this.attack();
      }
    }
  };
  _ctor.prototype.initEnemy = function (t, e, o) {
    var i = this;
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
    this.mMonsterId = Number(t.res);
    if (this.mAnimCtrl) {
      this.mAnimCtrl.loadAtlasAnimation($10AnimationCfgMgr.AnimationCfgMgr.instance.getAnimationCfg($10DataManager.DataManager.instance.eData.datamonster[t.res]), true).then(function () {
        i.playMoveAnim();
        i._amimState = $10GameEnum.RoleState.Move;
        i._isAnimReady = true;
        i._atkReady = true;
        var e = $10STJDataProxy.sTJDataProxy.stagetAddBuff - $10STJDataProxy.sTJDataProxy.stagetJianBuff;
        i._hpMax = Math.floor(t.hp * e);
        i._hp = i._hpMax;
        i._moveSpeed = t.speed;
        i.node.zIndex = -i.node.y;
        i._hp = i._hpMax;
        i._moveSpeed = t.speed;
        i.node.zIndex = -i.node.y;
        i._isReadyOK = true;
        o && o();
        if (2006 == i._enemyInfo.id) {
          $10AudioManager.AudioManager.instance.playEffectPath("sounds/skills", $10HomeEnum.Bundles.SmashTheJar);
          i.triggerShapeShiftSkill();
        }
      });
    } else {
      this.playMoveAnim();
      this._amimState = $10GameEnum.RoleState.Move;
      this._isAnimReady = true;
      this._atkReady = true;
      var n = $10STJDataProxy.sTJDataProxy.stagetAddBuff - $10STJDataProxy.sTJDataProxy.stagetJianBuff;
      this._hpMax = Math.floor(t.hp * n);
      this._hp = this._hpMax;
      this._moveSpeed = t.speed;
      this.node.zIndex = -this.node.y;
      this._hp = this._hpMax;
      this._moveSpeed = t.speed;
      this.node.zIndex = -this.node.y;
      this._isReadyOK = true;
      o && o();
      if (2006 == this._enemyInfo.id) {
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/skills", $10HomeEnum.Bundles.SmashTheJar);
        this.triggerShapeShiftSkill();
      }
    }
  };
  _ctor.prototype.stopMoveBuff = function (t, e) {
    this._isSpeedCut = true;
    this._speedCutTime = t;
    if (e <= this._moveBuff) {
      this._moveBuff = e;
      var o = null;
      ((o = this.mAnimCtrl ? this.mAnimCtrl.node : this.mBody) || o.isValid) && (o.color = cc.Color.BLUE);
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
    var o = this;
    this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady && this.playAtkAnim(function () {
      o.shoot(e);
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
    return this._enemyInfo.move * this._moveBuff;
  };
  _ctor.prototype.move = function (t) {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._amimState != $10GameEnum.RoleState.Attack) {
      this._moveDir || (this._moveDir = cc.v3(0, -1, 0));
      var e = this.getMoveSpeed() * t;
      var o = this.node.position.clone();
      o.y -= e;
      this.node.position = o;
      this.node.zIndex = -this.node.y;
      if (this.node.y < -cc.winSize.height / 2 - 50) {
        this.recycle();
        $10STJDataProxy.sTJDataProxy.gameState = $10GameEnum.GameState.OVER;
        $10PopupManager.PopupManager.instance.show({
          bundleName: $10HomeEnum.Bundles.SmashTheJar,
          path: "prefabs/popups/STLosePopup",
          keep: true
        });
      }
    }
  };
  _ctor.prototype.checkAtk = function () {
    var t = null;
    for (var e = 0; e < $10STJDataProxy.sTJDataProxy.soldiers.length; e++) {
      var o = $10STJDataProxy.sTJDataProxy.soldiers[e];
      if (o && o.isValid) {
        var i = o.getComponent($10STRoleBase.default);
        i && i.col === this._col && cc.Vec2.distance(cc.v2(this.node.x, this.node.y), cc.v2(o.x, o.y)) <= this._enemyInfo.num && (t = o);
      }
    }
    if (t) {
      this._target = t;
      this._amimState = $10GameEnum.RoleState.Attack;
    } else {
      this.playMoveAnim();
      this._amimState = $10GameEnum.RoleState.Move;
    }
  };
  _ctor.prototype.shoot = function (t) {
    if (this._amimState != $10GameEnum.RoleState.Dead && t && t.isValid) {
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/hit2", $10HomeEnum.Bundles.SmashTheJar);
      t.getComponent($10STRoleBase.default).beAttack(this._enemyInfo.atk);
    }
  };
  _ctor.prototype.subHp = function (t) {
    isNaN(t) && (t = 1);
    this._hp -= t;
    isNaN(this._hp) && (this._hp = 10);
    this._hp < 0 && (this._hp = 0);
  };
  _ctor.prototype.showHurtLab = function (t, e) {
    var o = this.node.position;
    o.y += this.mBody.height;
    $10Util.default.showHurt(Math.ceil(t), e ? $10Util.HurtType.CRIT : $10Util.HurtType.NORMAL, o, this, $10STJDataProxy.sTJDataProxy.effectLayer);
  };
  _ctor.prototype.beAttack = function (t, e, o) {
    undefined === o && (o = true);
    return !this._enemyInfo || this._amimState == $10GameEnum.RoleState.Dead || (t.num = 1 * t.num, this.subHp(t.num), o && this.showHurtLab(t.num, t.isCrit), $10AudioManager.AudioManager.instance.playEffectPath("sounds/hit", $10HomeEnum.Bundles.RES), this._hp <= 0 ? (this.dealDie(e), true) : (this.hit(), false));
  };
  _ctor.prototype.dealDie = function (t) {
    if (this._amimState == $10GameEnum.RoleState.Dead) {
      return true;
    }
    this._amimState = $10GameEnum.RoleState.Dead;
    this.playDie(t);
    if (2005 == this._enemyInfo.id && $10STJDataProxy.sTJDataProxy.soldiers.length > 0) {
      $10GameUIManager.gameUIMgr.showTips(this._enemyInfo.des);
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/skills", $10HomeEnum.Bundles.SmashTheJar);
      var e = Math.floor(Math.random() * $10STJDataProxy.sTJDataProxy.soldiers.length);
      var o = $10STJDataProxy.sTJDataProxy.soldiers[e];
      if (o && o.isValid) {
        var i = o.getComponent($10STRoleBase.default);
        i && i.skillKillDie();
      }
    }
  };
  _ctor.prototype.triggerShapeShiftSkill = function () {
    var t;
    var e;
    var o;
    var i = this;
    var n = null === (o = $10STJDataProxy.sTJDataProxy.battleView) || undefined === o ? undefined : o.getComponent("STBattleView");
    if (n) {
      var a = n.getGridsByRow(7);
      if (0 !== a.length) {
        var s = this.node.position;
        var l = null;
        var d = Infinity;
        try {
          var h = cc__values(a);
          for (var m = h.next(); !m.done; m = h.next()) {
            var f = m.value;
            var g = Math.abs(f.x - s.x);
            if (g < d) {
              d = g;
              l = f;
            }
          }
        } catch (_) {
          t = {
            error: _
          };
        } finally {
          try {
            m && !m.done && (e = h.return) && e.call(h);
          } finally {
            if (t) {
              throw t.error;
            }
          }
        }
        if (l) {
          $10AudioManager.AudioManager.instance.playEffectPath("sounds/bonus", $10HomeEnum.Bundles.SmashTheJar);
          $10ResUtil.ResUtil.loadAsset({
            bundleName: $10HomeEnum.Bundles.SmashTheJar,
            path: "prefabs/LightEffect",
            type: cc.Prefab
          }).then(function (t) {
            var e = cc.instantiate(t);
            e.parent = i.node;
            e.setPosition(cc.v3(0, 0));
            var o = e.getComponent(sp.Skeleton);
            o.setAnimation(0, "start", false);
            o.setCompleteListener(null);
            o.setCompleteListener(function () {
              e.destroy();
              e.removeFromParent();
            });
            cc.tween(i.node).to(.2, {
              position: cc.v3(l.x, l.y)
            }).start();
          }).catch(function (t) {
            $10CommonUtil.CommonUtil.print(t);
          });
        } else {
          console.warn("未找到合适的传送目标位置");
        }
      } else {
        console.warn("第7排没有可用格子");
      }
    } else {
      console.warn("无法获取战场视图，移形换影技能失败");
    }
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
    var t = $10STJDataProxy.sTJDataProxy.enemySoldiers.indexOf(this.node);
    -1 != t && $10STJDataProxy.sTJDataProxy.enemySoldiers.splice(t, 1);
    this.node.destroy();
    this.node.removeFromParent();
    $10EventManager.EventManager.instance.emit($10STJDataProxy.STJDataEvent.CHECK_GAME_END);
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
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mColliderNode", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBody", undefined);
  cc__decorate([ccp_property({
    type: $10AnimationCtrl.default
  })], _ctor.prototype, "mAnimCtrl", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_STMonster;