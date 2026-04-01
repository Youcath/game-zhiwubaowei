var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameUIManager = require("GameUIManager");
var $10AudioManager = require("AudioManager");
var $10CommonUtil = require("CommonUtil");
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10GuardingDataProxy = require("GuardingDataProxy");
var $10GTBulletHit = require("GTBulletHit");
var $10GTPoolMgr = require("GTPoolMgr");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_GTGameMgr = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  var o;
  cc__extends(_ctor, t);
  o = _ctor;
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == this._instance && (this._instance = new o());
      return this._instance;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.showHitNum = function (t, e) {
    var o = $10GTPoolMgr.GTPoolMgr.Inst.get("gtHitNum");
    if (o) {
      o.parent = $10GuardingDataProxy.guardingDataProxy.effectLayer;
      var i = 100 * (Math.random() - .5);
      e.x += i;
      o.setPosition(e);
      var a = o.getChildByName("num").getComponent(cc.Label);
      a && (a.string = t.toString());
      o.scale = 0;
      o.opacity = 255;
      o.active = true;
      var n = 50 * (Math.random() - .5);
      var r = cc.v3(e.x + n, e.y + 50, e.z);
      cc.tween(o).parallel(cc.tween().to(.3, {
        scale: .8
      }, {
        easing: "backOut"
      }), cc.tween().to(.8, {
        position: r
      }, {
        easing: "sineOut"
      }), cc.tween().delay(.3).to(.5, {
        opacity: 0
      }, {
        easing: "sineIn"
      })).call(function () {
        o.active = false;
        $10GTPoolMgr.GTPoolMgr.Inst.put("gtHitNum", o);
      }).start();
    } else {
      console.warn("gtHitNum预制体未找到，请检查对象池初始化");
    }
  };
  _ctor.prototype.hitEffect = function (t, e) {
    var o = $10GTPoolMgr.GTPoolMgr.Inst.get("gtHitEeffect");
    if (o) {
      o.parent = $10GuardingDataProxy.guardingDataProxy.effectLayer;
      o.setPosition(t);
      o.active = true;
      o.getComponent($10GTBulletHit.default).initBulletHit(e, function () {
        o.active = false;
        $10GTPoolMgr.GTPoolMgr.Inst.put("gtHitEeffect", o);
      });
    }
  };
  _ctor.prototype.getEquipementEffect = function (t, e) {
    var o = this;
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.GuardingTheBridge,
      path: "prefabs/EquiEffect",
      type: cc.Prefab
    }).then(function (i) {
      var a = cc.instantiate(i);
      a.parent = $10GuardingDataProxy.guardingDataProxy.effectLayer;
      a.setPosition(t);
      $10ResUtil.ResUtil.loadAsset({
        bundleName: $10HomeEnum.Bundles.GuardingTheBridge,
        path: "textrues/" + e.icon,
        type: cc.SpriteFrame
      }).then(function (t) {
        a.getComponent(cc.Sprite).spriteFrame = t;
        a.active = true;
        var i = $10GuardingDataProxy.guardingDataProxy.playerNode ? $10GuardingDataProxy.guardingDataProxy.playerNode.getPosition() : cc.v3(0, 0, 0);
        cc.tween(a).parallel(cc.tween().to(.2, {
          scaleX: -1
        }).to(.2, {
          scaleX: 1
        }), cc.tween().to(.2, {
          scaleX: -1
        }).to(.2, {
          scaleX: 1
        })).delay(.2).parallel(cc.tween().to(.2, {
          position: i
        }, {
          easing: "sineIn"
        }), cc.tween().delay(.2).to(.1, {
          opacity: 0
        }, {
          easing: "sineIn"
        })).call(function () {
          if (a && a.isValid) {
            a.destroy();
            o.setEffectEquipUpgrade();
          }
          o.getEqupentAtt(e);
        }).start();
      });
    });
  };
  _ctor.prototype.getEqupentAtt = function (t) {
    "" != t.des && $10GameUIManager.gameUIMgr.showTips(t.des);
    if (20 != t.id) {
      t.role && $10GuardingDataProxy.guardingDataProxy.playerNode.getComponent("GTPlayerCtl").addPlay(t.role);
      t.atk && ($10GuardingDataProxy.guardingDataProxy.attackNum += t.atk);
      t.speed && ($10GuardingDataProxy.guardingDataProxy.attackSpeed = $10GuardingDataProxy.guardingDataProxy.attackSpeed / t.speed);
      t.penetrate && ($10GuardingDataProxy.guardingDataProxy.bPenetrate += t.penetrate);
      t.atkNum && ($10GuardingDataProxy.guardingDataProxy.attackNum = $10GuardingDataProxy.guardingDataProxy.attackNum * t.atkNum);
      if (t.skin) {
        var e = t.skin.split("|");
        $10GuardingDataProxy.guardingDataProxy.curRoleImgsrc = e[$10GuardingDataProxy.guardingDataProxy.factions - 1];
        $10GuardingDataProxy.guardingDataProxy.playerNode.getComponent("GTPlayerCtl").resetPlayerImg();
      }
      if (t.bullet) {
        var o = t.bullet.split("|");
        $10GuardingDataProxy.guardingDataProxy.curBulletImgsrc = o[$10GuardingDataProxy.guardingDataProxy.factions - 1];
        $10GuardingDataProxy.guardingDataProxy.playerNode.getComponent("GTPlayerCtl").resetPlayerImg();
      }
    } else {
      $10ResUtil.ResUtil.loadAsset({
        bundleName: $10HomeEnum.Bundles.GuardingTheBridge,
        path: "prefabs/DaoZhang",
        type: cc.Prefab
      }).then(function (t) {
        var e = cc.instantiate(t);
        e.parent = $10GuardingDataProxy.guardingDataProxy.battleView;
        e.setPosition(cc.v3(0, -400));
        e.getComponent("GTDaoZhang").playSkill();
        e.zIndex = -e.y;
      });
    }
  };
  _ctor.prototype.setEffectEquipUpgrade = function () {
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/bonus", $10HomeEnum.Bundles.GuardingTheBridge);
    $10ResUtil.ResUtil.loadAsset({
      bundleName: "Res",
      path: "prefab/MiniGameSkillUpgrade",
      type: cc.Prefab
    }).then(function (t) {
      var e = cc.instantiate(t);
      e.parent = $10GuardingDataProxy.guardingDataProxy.playerNode;
      e.scale = 1;
      e.setPosition(cc.v3(0, 0));
      var o = e.getComponent(sp.Skeleton);
      o.setAnimation(0, "level up", false);
      o.setCompleteListener(null);
      o.setCompleteListener(function () {
        e.destroy();
        e.removeFromParent();
      });
    }).catch(function (t) {
      $10CommonUtil.CommonUtil.print(t);
    });
  };
  _ctor._instance = null;
  return o = cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_GTGameMgr;