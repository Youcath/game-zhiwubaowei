var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10ResUtil = require("ResUtil");
var $10SimplyCircleCollider = require("SimplyCircleCollider");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10GuardingDataProxy = require("GuardingDataProxy");
var $10GTBuff = require("GTBuff");
var $10GTBulletBase = require("GTBulletBase");
var $10GTEquipment = require("GTEquipment");
var $10GTGameMgr = require("GTGameMgr");
var $10GTMonster = require("GTMonster");
var $10GTPoolMgr = require("GTPoolMgr");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_GTBullet = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._colliderNode = null;
    e._markingnodes = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    0 == this._endMaxY && (this._endMaxY = cc.winSize.height / 2 + 100);
    this._colliderNode || (this._colliderNode = this.node.getChildByName("collider"));
  };
  _ctor.prototype.updateImg = function () {};
  _ctor.prototype.lateUpdate = function (t) {
    if ($10GuardingDataProxy.guardingDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      this.node.position = this.node.position.add(this._moveSpeed.mul(t));
      this.node.y > this._endMaxY && this.recycle(false);
    }
  };
  _ctor.prototype.update = function () {
    if ($10GuardingDataProxy.guardingDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._colliderNode) {
      var t = $10GuardingDataProxy.guardingDataProxy.monsters;
      if (t.length > 0) {
        var e = undefined;
        var o = undefined;
        var i = undefined;
        for (var a = t.length - 1; a >= 0; a--) {
          o = (e = t[a]).getChildByName("Collider").getComponent($10SimplyCircleCollider.default);
          i = this._colliderNode.getComponent($10SimplyCircleCollider.default);
          if (o && i && $10SimplyCollisionDetector.default.isCollisionCircleToCircle(i.circle, o.circle)) {
            if (this._markingnodes.length > 0 && this._markingnodes.indexOf(e.uuid) > -1) {
              return undefined;
            } else {
              return void this.myCollisionEnter(this.node, e);
            }
          }
        }
      }
      if (this.node.x > 0) {
        var n = $10GuardingDataProxy.guardingDataProxy.skillBoxs;
        if (n.length > 0) {
          e = undefined;
          var r = undefined;
          i = undefined;
          for (a = n.length - 1; a >= 0; a--) {
            r = (e = n[a]).getChildByName("Collider").getComponent($10SimplyRectCollider.default);
            i = this._colliderNode.getComponent($10SimplyCircleCollider.default);
            if (r && i && $10SimplyCollisionDetector.default.isCollisionRectToCircle(r.rect, i.circle)) {
              if (this._markingnodes.length > 0 && this._markingnodes.indexOf(e.uuid) > -1) {
                return undefined;
              } else {
                return void this.myCollisionEnter(this.node, e);
              }
            }
          }
        }
      }
      if (this.node.x < 0) {
        var s = $10GuardingDataProxy.guardingDataProxy.equipments;
        e = undefined;
        r = undefined;
        i = undefined;
        for (a = s.length - 1; a >= 0; a--) {
          r = (e = s[a]).getChildByName("Collider").getComponent($10SimplyRectCollider.default);
          i = this._colliderNode.getComponent($10SimplyCircleCollider.default);
          if (r && i && $10SimplyCollisionDetector.default.isCollisionRectToCircle(r.rect, i.circle)) {
            if (this._markingnodes.length > 0 && this._markingnodes.indexOf(e.uuid) > -1) {
              return undefined;
            } else {
              return void this.myCollisionEnter(this.node, e);
            }
          }
        }
      }
    }
  };
  _ctor.prototype.myCollisionEnter = function (t, e) {
    this.onCollisionEnter(t, e);
    $10GTGameMgr.default.instance.hitEffect(this.node.position, $10GuardingDataProxy.guardingDataProxy.curBulletImgsrc);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/hit", $10HomeEnum.Bundles.GuardingTheBridge);
    var o = Math.floor($10GuardingDataProxy.guardingDataProxy.attackNum);
    var i = false;
    if ($10GuardingDataProxy.guardingDataProxy.attackCrit > Math.random()) {
      o = Math.floor(2 * $10GuardingDataProxy.guardingDataProxy.attackNum);
      i = true;
    }
    if (e.name.includes("boss") || e.name.includes("zombie") || e.name.includes("Monster")) {
      var a = e.getComponent($10GTMonster.default);
      a && a.beAttack(o, i);
    } else {
      switch (e.name) {
        case "BuffNode":
          var n = e.getComponent($10GTBuff.default);
          n && n.beAttack();
          break;
        case "Equipment":
          var s = e.getComponent($10GTEquipment.default);
          s && s.beAttack(o, i);
      }
    }
  };
  _ctor.prototype.init = function () {
    this._penetrate = $10GuardingDataProxy.guardingDataProxy.bPenetrate;
    this._markingnodes = [];
    this._moveSpeed.y = $10GuardingDataProxy.guardingDataProxy.bulletSpeed;
    this.resetImg();
  };
  _ctor.prototype.resetImg = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.GuardingTheBridge,
      path: "textrues/" + $10GuardingDataProxy.guardingDataProxy.curBulletImgsrc,
      type: cc.SpriteFrame
    }).then(function (e) {
      t.node.getComponent(cc.Sprite).spriteFrame = e;
      t.node.active = true;
      if ("xiandao_3" == $10GuardingDataProxy.guardingDataProxy.curBulletImgsrc || "modao_3" == $10GuardingDataProxy.guardingDataProxy.curBulletImgsrc) {
        t.node.scale = .5;
      } else if ("xiandao_2" == $10GuardingDataProxy.guardingDataProxy.curBulletImgsrc || "modao_2" == $10GuardingDataProxy.guardingDataProxy.curBulletImgsrc) {
        t.node.scale = .5;
      } else {
        t.node.scale = .7;
      }
    });
  };
  _ctor.prototype.onCollisionEnter = function (t, e) {
    this._markingnodes.push(e.uuid);
    this._penetrate--;
    this._penetrate <= 0 && this.recycle();
  };
  _ctor.prototype.recycle = function (t) {
    undefined === t && (t = true);
    this._markingnodes = [];
    $10GTPoolMgr.GTPoolMgr.Inst.put("gt_bullet", this.node);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10GTBulletBase.default);
exports.default = def_GTBullet;