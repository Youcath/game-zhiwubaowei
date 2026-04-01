var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10RandomUtil = require("RandomUtil");
var $10ResUtil = require("ResUtil");
var $10ShimmerWhite = require("ShimmerWhite");
var $10DataManager = require("DataManager");
var $10SpAnimCtrl = require("SpAnimCtrl");
var $10E_AttrType = require("E_AttrType");
var $10MB_GameEnum = require("MB_GameEnum");
var $10MBScene = require("MBScene");
var $10MB_Actor = require("MB_Actor");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MB_Enemy = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.spAnimCtrl = null;
    e.nBullet = null;
    e.nShootPos = null;
    e._isAttack = false;
    e._atkAnimFrameNums = [];
    e._onAttackComplete = null;
    e._isLoadedAnim = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initAttribute = function () {
    t.prototype.initAttribute.call(this);
    var e = $10DataManager.DataManager.instance.eData.data_bagstage[$10MBScene.default.instance.curStage];
    this._actorAttribute.getNumeric($10E_AttrType.E_AttrType.ATK).setFixBase(e.atk);
    this._actorAttribute.getNumeric($10E_AttrType.E_AttrType.DEF).setFixBase(e.def);
    this._actorAttribute.getNumeric($10E_AttrType.E_AttrType.HP).setFixBase(e.hp);
    this._actorAttribute.getNumeric($10E_AttrType.E_AttrType.SPD).setFixBase(e.speed);
    this._actorAttribute.getNumeric($10E_AttrType.E_AttrType.DODGE).setFixBase(100 * e.att1);
    this._actorAttribute.getNumeric($10E_AttrType.E_AttrType.STUN).setFixBase(100 * e.att2);
    this._actorAttribute.getNumeric($10E_AttrType.E_AttrType.REBATE).setFixBase(100 * e.att3);
    this._actorAttribute.getNumeric($10E_AttrType.E_AttrType.COMBO).setFixBase(100 * e.att4);
    this._actorAttribute.getNumeric($10E_AttrType.E_AttrType.BLOOD).setFixBase(100 * e.att5);
    this._actorAttribute.getNumeric($10E_AttrType.E_AttrType.CRIT).setFixBase(100 * e.att6);
    this._actorAttribute.getNumeric($10E_AttrType.E_AttrType.RECOVER).setFixBase(100 * e.att7);
  };
  _ctor.prototype.onInit = function () {
    var t = this;
    var e = $10DataManager.DataManager.instance.eData.data_bagstage[$10MBScene.default.instance.curStage];
    var n = $10DataManager.DataManager.instance.eData.datamonster[e.monster];
    this._atkAnimFrameNums = "0" == n.atkFrame ? [] : n.atkFrame.split("|").map(Number);
    this._isLoadedAnim = false;
    this._team = $10MB_GameEnum.E_MB_ActorTeam.ENEMY;
    $10EventManager.EventManager.instance.emit($10MB_GameEnum.E_MB_BattleEvent.MONSTER_LOADED);
    this.spAnimCtrl.init();
    this.spAnimCtrl.registerFrameEvent(this.onSpAnimAnimEvent, this);
    cc.tween(this.node).by(.2, {
      x: -500
    }).call(function () {
      t.playIdleAnim();
    }).start();
  };
  _ctor.prototype.playIdleAnim = function () {
    this.spAnimCtrl.playAnim("move", 1.5, true);
  };
  _ctor.prototype.playMoveAnim = function () {
    this.spAnimCtrl.playAnim("move", 1.5, true);
  };
  _ctor.prototype.playDeadAnim = function () {
    var t = this;
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/monster_death2", "res_MB");
    this.spAnimCtrl.playAnim("die", 1, false, function () {
      t.node.destroy();
    });
  };
  _ctor.prototype.playAttackAnim = function (t) {
    var e = this;
    this._onAttackComplete = t;
    var n = this.node.x;
    this.playMoveAnim();
    var i = "atk";
    this._atkAnimFrameNums[0];
    if (this._atkAnimFrameNums.length > 1) {
      var o = Math.floor(1e3 * Math.random()) % this._atkAnimFrameNums.length;
      i = "atk" + (o + 1);
      this._atkAnimFrameNums[o + 1];
    }
    var a = $10DataManager.DataManager.instance.eData.datamonster[$10DataManager.DataManager.instance.eData.data_bagstage[$10MBScene.default.instance.curStage].monster];
    if (2002 == a.id || 2004 == a.id || 2006 == a.id || 2008 == a.id) {
      this.spAnimCtrl.playAnim(i, 1, false, function () {
        e.playIdleAnim();
      });
    } else if (2003 == a.id || 2007 == a.id) {
      this.spAnimCtrl.playAnim(i, 1, false, function () {
        e.playIdleAnim();
        e._onAttackComplete && e._onAttackComplete();
      });
    } else {
      cc.tween(this.node).to(.2 * $10MBScene.default.instance.battleView.gameSpeed, {
        x: n - 300
      }, {
        easing: "sineIn"
      }).delay(.2).call(function () {
        e.spAnimCtrl.clearAnim();
        e.spAnimCtrl.playAnim(i, 1, false, function () {
          cc.tween(e.node).to(.1 * $10MBScene.default.instance.battleView.gameSpeed, {
            x: n
          }, {
            easing: "sineIn"
          }).call(function () {
            e.playIdleAnim();
            e._onAttackComplete && e._onAttackComplete();
          }).start();
        });
      }).start();
    }
  };
  _ctor.prototype.onSpAnimAnimEvent = function (t, e) {
    var n = this;
    if ("atk" == e && t.includes("atk")) {
      var i = $10DataManager.DataManager.instance.eData.datamonster[$10DataManager.DataManager.instance.eData.data_bagstage[$10MBScene.default.instance.curStage].monster];
      if (2002 == i.id || 2004 == i.id || 2006 == i.id || 2008 == i.id) {
        var o = cc.instantiate(this.nBullet);
        o.parent = $10MBScene.default.instance.battleView.nBullets;
        o.active = true;
        var a = this.node.getPosition().add(this.nShootPos.getPosition());
        o.setPosition(a);
        $10ResUtil.ResUtil.setSpritFrame(o.getChildByName("Icon").getComponent(cc.Sprite), "Game", "textures/enemyBullet/" + i.modeName + "_zidan");
        cc.tween(o).to(.2 * $10MBScene.default.instance.battleView.gameSpeed, {
          x: a.x - 500
        }, {
          easing: "sineIn"
        }).call(function () {
          o.destroy();
          var t = $10RandomUtil.RandomUtil.randomInt(0, 1e3) < 10 * n.getAttribute($10E_AttrType.E_AttrType.CRIT).value;
          $10AudioManager.AudioManager.instance.playEffectPath("sounds/boss_atk1", "res_MB");
          n.attackTarget.beHurt(n, t);
          n._onAttackComplete && n._onAttackComplete();
        }).start();
      } else {
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/dao", "res_MB");
        var s = $10RandomUtil.RandomUtil.randomInt(0, 1e3) < 10 * this.getAttribute($10E_AttrType.E_AttrType.CRIT).value;
        this.attackTarget.beHurt(this, s);
      }
    }
  };
  _ctor.prototype.playHitAnim = function () {
    this.spAnimCtrl.getComponent($10ShimmerWhite.default).show(.3);
  };
  cc__decorate([ccp_property($10SpAnimCtrl.default)], _ctor.prototype, "spAnimCtrl", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nBullet", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nShootPos", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10MB_Actor.default);
exports.default = def_MB_Enemy;