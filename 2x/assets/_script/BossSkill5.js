var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10MathUtil = require("MathUtil");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletBoom = require("BulletBoom");
var $10EquipmentItem = require("EquipmentItem");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BossSkill5 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSkillSp = null;
    e.mWater = null;
    e.mCollision = null;
    e.mHitEffect = null;
    e.mBoomEffectPb = null;
    e._endPos = null;
    e._isStartMove = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initEnemy = function (e) {
    var o;
    var i;
    var n = this;
    t.prototype.initEnemy.call(this, e);
    this.mWater.width = cc.winSize.width;
    this.node.position = cc.v3(-302, 628).addSelf(cc.v3(0, -this.node.height / 2));
    this._endPos = cc.v3(-292, -374).addSelf(cc.v3(0, -this.node.height / 2));
    this.mSkillSp.setAnimation(0, "luodi", false);
    this._isSpdAdd = false;
    this.mWater.active = false;
    this.mHitEffect.active = false;
    this.mSkillSp.setCompleteListener(function (t) {
      if ("luodi" == (t.animation ? t.animation.name : "")) {
        n.mSkillSp.setAnimation(0, "move", true);
        n.mWater.active = true;
        n.mWater.width = cc.winSize.width;
        n._isStartMove = true;
      }
    });
    $10AudioManager.AudioManager.instance.playBgmPath("sounds/wateringCart", $10HomeEnum.Bundles.RES);
    for (var a = 0; a < (null === (i = null === (o = $10BattleDataProxy.battleDataProxy.equipRoot) || undefined === o ? undefined : o.children) || undefined === i ? undefined : i.length); ++a) {
      $10BattleDataProxy.battleDataProxy.equipRoot.children[a].getComponent($10EquipmentItem.default).isCanDemotion = true;
    }
  };
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
  };
  _ctor.prototype.addRushEffect = function () {};
  _ctor.prototype.addBoom = function () {
    if ($10BattleDataProxy.battleDataProxy.battleView && $10BattleDataProxy.battleDataProxy.battleView.isValid) {
      var t = cc.instantiate(this.mBoomEffectPb);
      $10BattleDataProxy.battleDataProxy.battleView.addChild(t, this.node.zIndex);
      t.position = this.node.position.addSelf(cc.v3(0, this.node.height / 2));
      t.getComponent($10BulletBoom.default).initBulletBoom();
      t.scale = 2;
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/plant2", $10HomeEnum.Bundles.RES);
      $10AudioManager.AudioManager.instance.playBgmPath("sounds/battleBGM", $10HomeEnum.Bundles.RES);
      $10BattleDataProxy.battleDataProxy.wateringCart = null;
      $10BattleDataProxy.battleDataProxy.removeEnemyNode(this.node);
      this.removeHpProgress();
      this.node.destroy();
      this.node.removeFromParent();
    }
  };
  _ctor.prototype.beAttack = function (t, e, o, i) {
    return !($10BattleDataProxy.battleDataProxy.battleData.houseHp <= 0 || this._nowHp <= 0 || this._monsterCfg && this._amimState != $10GameEnum.RoleState.Dead && (this.subHp(t.num), i && this.showHurtLab(t.num, t.isCrit), this.updateHp(), $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyHit", $10HomeEnum.Bundles.RES), !(this._nowHp <= 0) || (this._amimState = $10GameEnum.RoleState.Dead, this.addBoom(), 0)));
  };
  _ctor.prototype.move = function (t) {
    if (this._isStartMove) {
      var e = this.getMoveSpd(false, t);
      var o = this.node.position.clone().sub(this._endPos.clone()).normalize();
      this.node.x -= e * o.x;
      this.node.y -= e * o.y;
      this.node.zIndex = -this.node.y;
      $10MathUtil.MathUtil.distance(this.node.position, this._endPos) <= e && this.addBoom();
    }
  };
  _ctor.prototype.update = function (e) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead) {
      if (!$10BattleDataProxy.battleDataProxy.isStartFight) {
        this.node.destroy();
        return void this.node.removeFromParent();
      }
      t.prototype.update.call(this, e);
      this.plantColliderCheck();
    }
  };
  _ctor.prototype.plantColliderCheck = function () {
    var t;
    var e;
    var o;
    var i = this.mCollision.getComponent($10SimplyRectCollider.default);
    var n = false;
    var a = [];
    for (var r = 0; r < (null === (e = null === (t = $10BattleDataProxy.battleDataProxy.equipRoot) || undefined === t ? undefined : t.children) || undefined === e ? undefined : e.length); ++r) {
      var u = $10BattleDataProxy.battleDataProxy.equipRoot.children[r];
      if (i) {
        var p = (null === (o = u.getChildByName("root")) || undefined === o ? undefined : o.getChildByName("collisions")) || null;
        if (p) {
          var m = function (t) {
            var e = p.children[t];
            var o = e.getComponent($10SimplyRectCollider.default);
            if (o && $10SimplyCollisionDetector.default.isCollisionRectToRect(i.rect, o.rect)) {
              n = true;
              a.findIndex(function (t) {
                return t.collision == e;
              }) < 0 && a.push({
                equipItem: u,
                collision: e
              });
            }
          };
          for (var y = 0; y < p.childrenCount; ++y) {
            m(y);
          }
        }
      }
    }
    var g = null;
    var _ = null;
    if (a.length > 1) {
      g = a[0].collision;
      var v = 0;
      var b = $10Util.default.convertToTargetNodeSpace(g, this.mWater);
      var P = $10MathUtil.MathUtil.distance(b, this.mWater.position);
      for (r = 1; r < a.length; ++r) {
        var D = a[r].collision;
        var S = $10Util.default.convertToTargetNodeSpace(D, this.mWater);
        if ((E = $10MathUtil.MathUtil.distance(S, this.mWater.position)) < P) {
          P = E;
          g = a[r].collision;
          v = r;
        }
      }
      _ = a[v].equipItem;
      g = a[v].collision;
    } else if (1 == a.length) {
      _ = a[0].equipItem;
      g = a[0].collision;
    }
    _ && (_.getComponent($10EquipmentItem.default).isSpecialPlant || _.getComponent($10EquipmentItem.default).beWashedAway());
    if (g) {
      S = $10Util.default.convertToTargetNodeSpace(g, this.mWater);
      var E = $10MathUtil.MathUtil.distance(S, this.mWater.position);
      this.mWater.width = E - g.width / 2;
      this.mHitEffect.active = true;
      this.mHitEffect.x = this.mWater.x + this.mWater.width;
    }
    this.mHitEffect.active = n;
    n || (this.mWater.width = cc.winSize.width);
  };
  _ctor.prototype.getMovePosByTime = function (t) {
    var e = Math.floor(30 * t);
    if (this._isStartAtk) {
      return cc.v3(this._simulationPos.x, this._simulationPos.y + this.node.height);
    }
    for (var o = 0; o < e; ++o) {
      var i = 2 * this.getMoveSpd(false, 0.016666666666666666);
      var n = $10MathUtil.MathUtil.distance(this._endPos, this._simulationPos);
      var a = this._simulationPos.clone().sub(this._endPos.clone()).normalize();
      this._simulationPos.x -= i * a.x;
      this._simulationPos.y -= i * a.y;
      n <= i && (this._simulationPos = this._endPos);
    }
    return cc.v3(this._simulationPos.x, this._simulationPos.y + this.node.height);
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSkillSp", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mWater", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mCollision", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mHitEffect", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBoomEffectPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10EnemyBase.default);
exports.default = def_BossSkill5;