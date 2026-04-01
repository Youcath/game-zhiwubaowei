var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MB_AttrMgr = require("MB_AttrMgr");
var $10E_AttrType = require("E_AttrType");
var $10MB_GameEnum = require("MB_GameEnum");
var $10MBScene = require("MBScene");
var $10MB_Actor = require("MB_Actor");
var $10RandomUtil = require("RandomUtil");
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10DataManager = require("DataManager");
var $10SpAnimCtrl = require("SpAnimCtrl");
var $10BulletHit = require("BulletHit");
var $10ResUtil = require("ResUtil");
var $10MathUtil = require("MathUtil");
var $10BulletHit6 = require("BulletHit6");
var $10HomeEnum = require("HomeEnum");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MB_Player = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.spAnimCtrl = null;
    e.nPlantBullet = null;
    e.nSelfBullet = null;
    e.nSelfShootPos = null;
    e.spHitAnimCtrl = null;
    e.spUp = null;
    e._onAttackComplete = null;
    e._curEquipTypeIds = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
    $10EventManager.EventManager.instance.on($10MB_GameEnum.E_MB_BattleEvent.UPDATE_PLAYER_ANIMATION, this.updatePlayerAnim, this);
  };
  _ctor.prototype.onDestroy = function () {
    t.prototype.onDestroy.call(this);
    $10EventManager.EventManager.instance.off($10MB_GameEnum.E_MB_BattleEvent.UPDATE_PLAYER_ANIMATION, this.updatePlayerAnim, this);
  };
  _ctor.prototype.initAttribute = function () {
    t.prototype.initAttribute.call(this);
    this.updateAttr();
  };
  _ctor.prototype.onInit = function () {
    t.prototype.onInit.call(this);
    this._team = $10MB_GameEnum.E_MB_ActorTeam.PLAYER;
    this.spAnimCtrl.registerFrameEvent(this.onAnimEvent, this);
    this.playIdleAnim();
    this.updatePlayerAnim();
  };
  _ctor.prototype.updateAttr = function () {
    var t = $10MB_AttrMgr.MB_AttrMgr.instance.getPlayerAttrMap($10MBScene.default.instance.bagView.eqiupedIds);
    for (var e in $10E_AttrType.E_AttrType) {
      if (!isNaN(e)) {
        var n = t.has(Number(e)) ? t.get(Number(e)) : 0;
        this._actorAttribute.getNumeric(Number(e)).setFixBase(n);
      }
    }
  };
  _ctor.prototype.onEnterReady = function () {
    t.prototype.onEnterReady.call(this);
    var e = this.getAttribute($10E_AttrType.E_AttrType.HP).value;
    this._hp = e;
    this.updateHpView(this._hp, e);
  };
  _ctor.prototype.onEnterBattle = function () {
    this.updateAttr();
    t.prototype.onEnterBattle.call(this);
  };
  _ctor.prototype.updatePlayerAnim = function () {
    var t = this;
    var e = new Map([[1, "plant1"], [2, "plant8"], [3, "plant3"], [4, "plant6"], [5, "plant14"], [6, "plant11"], [7, "plant13"], [8, "CWplant3"], [9, "CWplant4"], [10, "CWplant5"], [11, "plant12"]]);
    var n = false;
    var i = $10MBScene.default.instance.bagView.eqiupedIds.map(function (t) {
      return $10DataManager.DataManager.instance.eData.data_bagweapon[t].type;
    });
    i.forEach(function (e) {
      n || t._curEquipTypeIds.includes(e) || (n = true);
    });
    this._curEquipTypeIds = i;
    e.forEach(function (e, n) {
      if (i.includes(n)) {
        t.spAnimCtrl.spAnim.findBone(e).active = true;
      } else {
        t.spAnimCtrl.spAnim.findBone(e).active = false;
      }
    });
    if (n) {
      this.spUp.node.active = true;
      this.spUp.clearAnim();
      this.spUp.playAnim("level up", 1, false, function () {
        t.spUp.node.active = false;
      });
    }
    this.spAnimCtrl.spAnim.findBone("muma").active = !i.includes(11);
  };
  _ctor.prototype.playAttackAnim = function (t) {
    var e = this;
    this.node.x;
    this.node.zIndex = cc.macro.MAX_ZINDEX;
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/se_launch", "res_MB");
    this._onAttackComplete = t;
    this.spAnimCtrl.playAnim("atk", 1, false, function () {
      e.playIdleAnim();
    });
  };
  _ctor.prototype.onAnimEvent = function (t, e) {
    if ("atk" == e) {
      var n = $10MBScene.default.instance.bagView.eqiupedIds.map(function (t) {
        return $10DataManager.DataManager.instance.eData.data_bagweapon[t].type;
      });
      if (n.length > 0) {
        this.shootPlantBullet(n);
      } else {
        this.shootSelfBullet();
      }
    }
  };
  _ctor.prototype.shootSelfBullet = function () {
    var t = this;
    var e = this.attackTarget.node.getPosition().add(cc.v2(0, 60));
    var n = cc.instantiate(this.nSelfBullet);
    n.parent = $10MBScene.default.instance.battleView.nBullets;
    n.active = true;
    var i = this.node.getPosition().add(this.nSelfShootPos.getPosition());
    n.setPosition(i);
    cc.tween(n).to(.4, {
      x: e.x,
      y: e.y
    }).call(function () {
      var e = n.getChildByName("Hit").getComponent($10SpAnimCtrl.default);
      n.getChildByName("Icon").active = false;
      e.node.active = true;
      e.playAnim("broken1", 1, false, function () {
        n.destroy();
      });
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/hit1", "res_MB");
      var i = $10RandomUtil.RandomUtil.randomInt(0, 1e3) < 10 * t.getAttribute($10E_AttrType.E_AttrType.CRIT).value;
      t.attackTarget.beHurt(t, i);
      t._onAttackComplete && t._onAttackComplete();
    }).start();
  };
  _ctor.prototype.shootPlantBullet = function (t) {
    var e = this;
    var n = this.attackTarget.node.getPosition().add(cc.v2(0, 60));
    var i = new Map([[1, "plant1"], [2, "plant8"], [3, "plant3"], [4, "plant6"], [5, "plant14"], [6, "plant11"], [7, "plant13"], [8, "CWplant3"], [9, "CWplant4"], [10, "CWplant5"], [11, "plant12"]]);
    var o = new Map([[1, 0], [2, 0], [3, 0], [4, 700], [5, -300], [6, 550], [7, 0], [8, 0], [9, 500], [10, 0], [11, 200]]);
    t.forEach(function (t) {
      var a = i.get(t);
      if (a) {
        var r = new cc.Node();
        e.spAnimCtrl.generateSomeNodes(a, r);
        e.scheduleOnce(function () {
          var i = r.convertToWorldSpaceAR(cc.v2());
          var c = $10MBScene.default.instance.battleView.nBullets.convertToNodeSpaceAR(i);
          e.spAnimCtrl.destroySomeNodes(a);
          var l = cc.instantiate(e.nPlantBullet);
          l.parent = $10MBScene.default.instance.battleView.nBullets;
          l.active = true;
          l.setPosition(c);
          l.angle = 180 * cc.Vec2.RIGHT_R.signAngle(n.sub(c).normalize()) / Math.PI;
          var h = "" + a.replace("plant", "zidan");
          var f = Number(a.match(/\d+/)[0]);
          $10ResUtil.ResUtil.loadAsset({
            path: "textures/bulletHit/BulletHit",
            type: cc.SpriteAtlas,
            bundleName: $10HomeEnum.Bundles.GAME
          }).then(function (t) {
            l.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame(h);
          }).catch(function (t) {
            console.log("error:", t);
          });
          var m = o.get(t);
          e.bezierTo(l, n, m, function () {
            var t = null;
            t = 6 == f ? l.getChildByName("BulletHit6").getComponent($10BulletHit6.default) : l.getChildByName("BulletHit").getComponent($10BulletHit.default);
            l.getChildByName("Icon").active = false;
            t.node.active = true;
            if (e._onAttackComplete) {
              $10AudioManager.AudioManager.instance.playEffectPath("sounds/hit1", "res_MB");
              var n = $10RandomUtil.RandomUtil.randomInt(0, 1e3) < 10 * e.getAttribute($10E_AttrType.E_AttrType.CRIT).value;
              e.attackTarget.beHurt(e, n);
              e._onAttackComplete();
              e._onAttackComplete = null;
            }
            t.initBulletHit(f, 1);
            e.scheduleOnce(function () {
              l.destroy();
            }, .5);
          });
        });
      }
    });
  };
  _ctor.prototype.lineTo = function (t, e, n) {
    cc.tween(t).to(.4, {
      x: e.x,
      y: e.y
    }).call(function () {
      n && n();
    }).start();
  };
  _ctor.prototype.bezierTo = function (t, e, n, i) {
    var o = t.getPosition();
    var a = o.add(e).mul(.5);
    var r = $10MathUtil.MathUtil.getPerpendicularVector(e.sub(o).normalize().mul(n), a);
    $10MathUtil.MathUtil.bezierTo(t, .6, o, r, e, function (e) {
      var n = e.x - t.x;
      var i = e.y - t.y;
      var o = cc.v2(n, i).normalizeSelf();
      0 == o.x && 0 == o.y || (t.angle = $10MathUtil.MathUtil.radians2Angle(cc.v2(1, 0).signAngle(o)));
    }).call(function () {
      i && i();
    }).start();
  };
  _ctor.prototype.playDeadAnim = function () {
    this.spAnimCtrl.playAnim("die", 1, false);
  };
  _ctor.prototype.playIdleAnim = function () {
    this.spAnimCtrl.playAnim("stand", 1, true);
  };
  _ctor.prototype.playMoveAnim = function () {};
  _ctor.prototype.playHitAnim = function () {
    var t = this;
    this.scheduleOnce(function () {
      t.spHitAnimCtrl.node.active = true;
      t.spHitAnimCtrl.clearAnim();
      t.spHitAnimCtrl.playAnim("hit", 1, false, function () {
        t.spHitAnimCtrl.node.active = false;
      });
    }, .05);
    this.spAnimCtrl.playAnim("hit", 1, false);
  };
  cc__decorate([ccp_property($10SpAnimCtrl.default)], _ctor.prototype, "spAnimCtrl", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nPlantBullet", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nSelfBullet", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nSelfShootPos", undefined);
  cc__decorate([ccp_property($10SpAnimCtrl.default)], _ctor.prototype, "spHitAnimCtrl", undefined);
  cc__decorate([ccp_property($10SpAnimCtrl.default)], _ctor.prototype, "spUp", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10MB_Actor.default);
exports.default = def_MB_Player;