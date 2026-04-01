var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__awaiter = __awaiter;
var cc__generator = __generator;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10RandomUtil = require("RandomUtil");
var $10Util = require("Util");
var $10NumericData = require("NumericData");
var $10E_AttrType = require("E_AttrType");
var $10MB_GameEnum = require("MB_GameEnum");
var $10MB_PopHurt = require("MB_PopHurt");
var $10MBScene = require("MBScene");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MB_Actor = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.nHpView = null;
    e.spRecoverAnim = null;
    e.spStunAnim = null;
    e._hp = 0;
    e._actorAttribute = null;
    e._team = $10MB_GameEnum.E_MB_ActorTeam.PLAYER;
    e._isStun = false;
    e.attackTarget = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {};
  _ctor.prototype.onDestroy = function () {};
  _ctor.prototype.init = function () {
    this.nHpView.getChildByName("HpChange").getComponent(cc.Sprite).fillRange = 1;
    this.nHpView.getChildByName("HpChange").active = false;
    this.nHpView.getChildByName("HpValue").getComponent(cc.Sprite).fillRange = 1;
    this.initAttribute();
    this._hp = this.getAttribute($10E_AttrType.E_AttrType.HP).value;
    this.onInit();
  };
  _ctor.prototype.initAttribute = function () {
    this._actorAttribute = new $10NumericData.NumericData();
    this._actorAttribute.init($10E_AttrType.E_AttrType);
  };
  _ctor.prototype.onInit = function () {};
  _ctor.prototype.onEnterReady = function () {};
  _ctor.prototype.onEnterBattle = function () {
    this._hp = this.getAttribute($10E_AttrType.E_AttrType.HP).value;
  };
  _ctor.prototype.startRound = function () {
    return cc__awaiter(this, undefined, Promise, function () {
      return cc__generator(this, function (t) {
        switch (t.label) {
          case 0:
            $10EventManager.EventManager.instance.emit($10MB_GameEnum.E_MB_BattleEvent.ROUND_START, this._team);
            return [4, $10Util.default.promiseDelay(.1 * $10MBScene.default.instance.battleView.gameSpeed)];
          case 1:
            t.sent();
            if (this._isStun) {
              return this._isStun = false, this.spStunAnim.clearTracks(), this.spStunAnim.node.active = false, [2, Promise.resolve()];
            } else {
              return [4, this.dealRecove()];
            }
          case 2:
            t.sent();
            return [4, this.dealAttack()];
          case 3:
            t.sent();
            return [4, this.dealCombo()];
          case 4:
            t.sent();
            return [4, this.dealCounterAttack()];
          case 5:
            t.sent();
            return [4, $10Util.default.promiseDelay(.1)];
          case 6:
            t.sent();
            return [2, Promise.resolve()];
        }
      });
    });
  };
  _ctor.prototype.dealRecove = function () {
    return cc__awaiter(this, undefined, Promise, function () {
      var t;
      var e;
      return cc__generator(this, function (n) {
        switch (n.label) {
          case 0:
            t = this.getAttribute($10E_AttrType.E_AttrType.RECOVER).value;
            e = this.getAttribute($10E_AttrType.E_AttrType.HP).value;
            if (this._hp < e && t > 0 && $10RandomUtil.RandomUtil.randomInt(0, 1e3) < 200) {
              return this.beRecover(this.getAttribute($10E_AttrType.E_AttrType.HP).value * t / 100), [4, $10Util.default.promiseDelay(.1 * $10MBScene.default.instance.battleView.gameSpeed)];
            } else {
              return [3, 2];
            }
          case 1:
            n.sent();
            n.label = 2;
          case 2:
            return [2, Promise.resolve()];
        }
      });
    });
  };
  _ctor.prototype.dealAttack = function () {
    return cc__awaiter(this, undefined, Promise, function () {
      var t = this;
      return cc__generator(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, $10Util.default.promiseDelay(.1 * $10MBScene.default.instance.battleView.gameSpeed)];
          case 1:
            e.sent();
            return [2, new Promise(function (e) {
              if (t.attackTarget.isDead()) {
                e();
              } else {
                t.playAttackAnim(function () {
                  t.playIdleAnim();
                  e();
                });
              }
            })];
        }
      });
    });
  };
  _ctor.prototype.dealCombo = function () {
    return cc__awaiter(this, undefined, Promise, function () {
      var t = this;
      return cc__generator(this, function (e) {
        switch (e.label) {
          case 0:
            if ($10RandomUtil.RandomUtil.randomInt(0, 1e3) < 10 * this.getAttribute($10E_AttrType.E_AttrType.COMBO).value) {
              return [4, $10Util.default.promiseDelay(.1 * $10MBScene.default.instance.battleView.gameSpeed)];
            } else {
              return [3, 2];
            }
          case 1:
            e.sent();
            return [2, new Promise(function (e) {
              if (t.attackTarget.isDead()) {
                e();
              } else {
                $10MBScene.default.instance.battleView.popHurt(0, t.node.getPosition().add(cc.v2(0, 200)), $10MB_PopHurt.EBattlePopHurtType.COMBO);
                t.playAttackAnim(function () {
                  t.playIdleAnim();
                  e();
                });
              }
            })];
          case 2:
            return [2, Promise.resolve()];
        }
      });
    });
  };
  _ctor.prototype.dealCounterAttack = function () {
    return cc__awaiter(this, undefined, Promise, function () {
      var t = this;
      return cc__generator(this, function (e) {
        switch (e.label) {
          case 0:
            if (!this._isStun && !this.attackTarget.isDead() && $10RandomUtil.RandomUtil.randomInt(0, 1e3) < 10 * this.attackTarget.getAttribute($10E_AttrType.E_AttrType.REBATE).value) {
              return [4, $10Util.default.promiseDelay(.1 * $10MBScene.default.instance.battleView.gameSpeed)];
            } else {
              return [3, 2];
            }
          case 1:
            e.sent();
            return [2, new Promise(function (e) {
              $10MBScene.default.instance.battleView.popHurt(0, t.attackTarget.node.getPosition().add(cc.v2(0, 200)), $10MB_PopHurt.EBattlePopHurtType.REBATE);
              t.attackTarget.playAttackAnim(function () {
                e();
              });
            })];
          case 2:
            return [2, Promise.resolve()];
        }
      });
    });
  };
  _ctor.prototype.endRound = function () {
    $10EventManager.EventManager.instance.emit($10MB_GameEnum.E_MB_BattleEvent.ROUND_END, this._team);
  };
  _ctor.prototype.updateHpView = function (t, e) {
    var n = this;
    if (0 != e) {
      var i = t / e;
      var o = this.nHpView.getChildByName("HpValue").getComponent(cc.Sprite);
      if (o.fillRange < i) {
        cc.tween(o).to(.1, {
          fillRange: i
        }).start();
      } else {
        o.fillRange = i;
        var a = this.nHpView.getChildByName("HpChange").getComponent(cc.Sprite);
        a.node.active = true;
        var r = Math.abs(i - a.fillRange);
        cc.tween(a).to(r, {
          fillRange: i
        }).call(function () {
          a.node.active = false;
          i <= 0 && (n.nHpView.active = false);
        }).start();
      }
    }
  };
  _ctor.prototype.beHurt = function (t, e) {
    var n = t.getAttribute($10E_AttrType.E_AttrType.ATK).value - this.getAttribute($10E_AttrType.E_AttrType.DEF).value;
    n <= 0 && (n = 1);
    if ($10RandomUtil.RandomUtil.randomInt(0, 1e3) < 10 * this.getAttribute($10E_AttrType.E_AttrType.DODGE).value) {
      $10MBScene.default.instance.battleView.popHurt(0, this.node.getPosition().add(cc.v2(0, 180)), $10MB_PopHurt.EBattlePopHurtType.EVASION);
    } else {
      if ($10RandomUtil.RandomUtil.randomInt(0, 1e3) < 10 * t.getAttribute($10E_AttrType.E_AttrType.STUN).value) {
        this._isStun = true, this.spStunAnim.node.active = true, this.spStunAnim.clearTracks(), this.spStunAnim.setAnimation(0, "start", true);
      }
      e && (n *= 2);
      t.beRecover(n * t.getAttribute($10E_AttrType.E_AttrType.BLOOD).value / 100);
      this._hp -= n;
      $10MBScene.default.instance.battleView.popHurt(n, this.node.getPosition().add(cc.v2(0, $10RandomUtil.RandomUtil.randomInt(200, 250))), e ? $10MB_PopHurt.EBattlePopHurtType.CRIT : $10MB_PopHurt.EBattlePopHurtType.COMMON);
      this._hp < 0 && (this._hp = 0);
      this.playHitAnim();
      this.beRepel(this._team == $10MB_GameEnum.E_MB_ActorTeam.PLAYER, 20);
      this.updateHpView(this._hp, this.getAttribute($10E_AttrType.E_AttrType.HP).value);
      this.isDead() && this.playDeadAnim();
    }
  };
  _ctor.prototype.beRepel = function (t, e) {
    var n = this;
    var i = this.node.x;
    var o = this.node.x + (t ? -e : e);
    cc.tween(this.node).to(.2, {
      x: o
    }, {
      easing: "quintOut"
    }).call(function () {
      n.node.x = i;
    }).start();
  };
  _ctor.prototype.beRecover = function (t) {
    var e = this;
    if (!(this.isDead() || t <= 0)) {
      t = Math.floor(t);
      var n = this.getAttribute($10E_AttrType.E_AttrType.HP).value;
      this._hp = Math.min(this._hp + t, n);
      this.updateHpView(this._hp, n);
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/se_recover", "res_MB");
      if (this.spRecoverAnim) {
        this.spRecoverAnim.node.active = true;
        this.spRecoverAnim.clearTracks();
        this.spRecoverAnim.setAnimation(0, "start", false);
        this.spRecoverAnim.setCompleteListener(function () {
          e.spRecoverAnim.setCompleteListener(null);
          e.spRecoverAnim.node.active = false;
        });
      }
      $10MBScene.default.instance.battleView.popHurt(t, this.node.getPosition().add(cc.v2(0, 200)), $10MB_PopHurt.EBattlePopHurtType.RECOVER);
    }
  };
  _ctor.prototype.playIdleAnim = function () {};
  _ctor.prototype.playAttackAnim = function () {};
  _ctor.prototype.playDeadAnim = function () {};
  _ctor.prototype.playMoveAnim = function () {};
  _ctor.prototype.isDead = function () {
    return this._hp <= 0;
  };
  _ctor.prototype.getAttribute = function (t) {
    return this._actorAttribute.getNumeric(t);
  };
  _ctor.prototype.playHitAnim = function () {};
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nHpView", undefined);
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "spRecoverAnim", undefined);
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "spStunAnim", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_MB_Actor;