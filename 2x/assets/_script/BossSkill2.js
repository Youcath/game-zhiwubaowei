var i;
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
var $10DataManager = require("DataManager");
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10BulletBoom = require("BulletBoom");
var $10BossSkillCourse = require("BossSkillCourse");
var $10EquipmentItem = require("EquipmentItem");
var $10MapGridItem = require("MapGridItem");
var $10BossSkillBase = require("BossSkillBase");
var $10BossSkillSmoke = require("BossSkillSmoke");
var $10BossSkilMark = require("BossSkilMark");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_BossSkill2 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSmokePb = null;
    e.mMarkPb = null;
    e.mBoomPb = null;
    e.mTail = null;
    e.mBoomSpr = null;
    e._markPlant = null;
    e._markPlantPos = null;
    e.mLastPos = null;
    e._smokeTime = 0;
    e._boomHoldGrid = "";
    e._clickNum = 0;
    e._skillData = null;
    e._bossSkillCourse = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.play = function () {
    var t;
    var e;
    var o = this;
    this.node.on(cc.Node.EventType.TOUCH_START, this.touchBegin, this);
    var i = [];
    for (var n = 0; n < (null === (e = null === (t = $10BattleDataProxy.battleDataProxy.equipRoot) || undefined === t ? undefined : t.children) || undefined === e ? undefined : e.length); ++n) {
      var a = $10BattleDataProxy.battleDataProxy.equipRoot.children[n];
      a.getComponent($10EquipmentItem.default).isSpecialPlant || i.push(a);
    }
    if (i.length <= 0) {
      this.removeBossSkillCourse();
      this.node.destroy();
      return void this.node.removeFromParent();
    }
    this._skillData = $10DataManager.DataManager.instance.eData.data_bossskill[2];
    var r = Math.floor(1e3 * Math.random()) % i.length;
    this._markPlant = i[r];
    var s = this._markPlant.getComponent($10EquipmentItem.default).holdGrids;
    var c = Math.floor(1e3 * Math.random()) % s.length;
    this._boomHoldGrid = s[c];
    var l = $10BattleDataProxy.battleDataProxy.gridsMap.get(this._boomHoldGrid);
    this._markPlantPos = $10Util.default.convertToTargetNodeSpace(l, this.node);
    var u = this._skillData.keepTime;
    this.bezierTo(cc.v2(this.node.position), this.getC2(cc.v2(this.node.position), cc.v2(this._markPlantPos)), cc.v2(this._markPlantPos), u, true, function () {
      o.addBoom();
    });
    this.addMark();
    this.addBossSkillCourse();
  };
  _ctor.prototype.removeBossSkillCourse = function () {
    if (this._bossSkillCourse && this._bossSkillCourse.isValid) {
      $10BattleDataProxy.battleDataProxy.bossSkillCourseIds.push(2);
      $10BattleDataProxy.battleDataProxy.saveBossSkillCourseIds();
      this._bossSkillCourse.destroy();
      this._bossSkillCourse.removeFromParent();
      this._bossSkillCourse = null;
    }
  };
  _ctor.prototype.addBossSkillCourse = function () {
    var t = this;
    $10BattleDataProxy.battleDataProxy.bossSkillCourseIds.indexOf(2) >= 0 || $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/effect/BossSkillCourse",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      t._bossSkillCourse = cc.instantiate(e);
      t.node.addChild(t._bossSkillCourse);
      t._bossSkillCourse.getComponent($10BossSkillCourse.default).play([t.node], false);
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.onDestroy = function () {
    this.node.off(cc.Node.EventType.TOUCH_START, this.touchBegin, this);
  };
  _ctor.prototype.touchBegin = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      var e = t.getLocation();
      var o = $10BattleDataProxy.battleDataProxy.gameCamera;
      e.addSelf(cc.v2(o.position));
      if (this.node.getBoundingBoxToWorld().contains(e)) {
        this._clickNum++;
        if (this._clickNum >= this._skillData.click) {
          this.addBoom(false);
        } else {
          this.mBoomSpr.scale = 1, cc.Tween.stopAllByTarget(this.mBoomSpr), cc.tween(this.mBoomSpr).to(.15, {
            scale: .8
          }).to(.15, {
            scale: 1
          }).start();
        }
      }
    }
  };
  _ctor.prototype.addMark = function () {
    this._markNode = cc.instantiate(this.mMarkPb);
    $10BattleDataProxy.battleDataProxy.battleView.addChild(this._markNode);
    this._markNode.position = this._markPlantPos;
    this._markNode.getComponent($10BossSkilMark.default).play();
  };
  _ctor.prototype.addBoom = function (t) {
    undefined === t && (t = true);
    if ($10BattleDataProxy.battleDataProxy.battleView && $10BattleDataProxy.battleDataProxy.battleView.isValid) {
      cc.Tween.stopAllByTarget(this.node);
      var e = cc.instantiate(this.mBoomPb);
      $10BattleDataProxy.battleDataProxy.battleView.addChild(e);
      e.position = this.node.position;
      e.getComponent($10BulletBoom.default).initBulletBoom();
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/plant12", $10HomeEnum.Bundles.RES);
      if (t) {
        var o = this._boomHoldGrid.split("-").map(Number);
        var i = o[0];
        var n = o[1];
        var a = [];
        for (var c = i - 1; c <= i + 1; ++c) {
          for (var l = n - 1; l <= n + 1; ++l) {
            var p = c + "-" + l;
            var h = $10BattleDataProxy.battleDataProxy.gridsMap.get(p);
            if (h) {
              var m = h.getComponent($10MapGridItem.default).belongTo;
              m && (m.getComponent($10EquipmentItem.default).isSpecialPlant || a.indexOf(m) < 0 && a.push(m));
            }
          }
        }
        for (c = 0; c < a.length; ++c) {
          var y = a[c];
          y.getComponent($10EquipmentItem.default).holdGrids.forEach(function (t) {
            $10BattleDataProxy.battleDataProxy.gridsMap.get(t).getComponent($10MapGridItem.default).belongTo = null;
          });
          y.destroy();
          y.removeFromParent();
        }
        a.length > 0 && $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.UPDATE_SUPER_PLANT_NUM);
      }
      this.removeBossSkillCourse();
      this.removeSelf();
    }
  };
  _ctor.prototype.update = function (t) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) {
      if ($10BattleDataProxy.battleDataProxy.isStartFight) {
        if (this._isPauseGame) {
          this._isPauseGame = false, this.node.resumeAllActions();
        }
        if (this._markPlantPos) {
          this._smokeTime += t, this._smokeTime >= .3 && (this._smokeTime = 0, this.addSmoke()), this.setAngle();
        }
      } else {
        this.removeSelf();
      }
    } else if (!this._isPauseGame) {
      this._isPauseGame = true, this.node.pauseAllActions();
    }
  };
  _ctor.prototype.addSmoke = function () {
    var t = $10NodePoolManager.default.instance.getNode(this.mSmokePb);
    $10BattleDataProxy.battleDataProxy.battleView.addChild(t);
    var e = $10Util.default.convertToTargetNodeSpace(this.mTail, t);
    t.position = e;
    t.getComponent($10BossSkillSmoke.default).play();
  };
  _ctor.prototype.setAngle = function () {
    var t = this.node.position;
    if (this.mLastPos) {
      var e = -1e4;
      if (t != this.mLastPos) {
        var o = t.sub(this.mLastPos);
        var i = cc.v2(o);
        var n = cc.v2(1, 0);
        var a = i.magSqr();
        var r = n.magSqr();
        if (0 == a || 0 == r) {
          return;
        }
        var s = i.signAngle(n);
        var c = Math.floor(cc.misc.radiansToDegrees(s));
        e = c;
        c = -c;
        this.node.angle = c;
        this.mLastPos = t;
      }
      return e;
    }
    this.mLastPos = t;
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mSmokePb", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mMarkPb", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBoomPb", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mTail", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mBoomSpr", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10BossSkillBase.default);
exports.default = def_BossSkill2;