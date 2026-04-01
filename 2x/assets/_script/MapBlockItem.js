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
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10Util = require("Util");
var $10AnimationMgr = require("AnimationMgr");
var $10DestroyAllBlockEffect = require("DestroyAllBlockEffect");
var $10MapBlockEffect = require("MapBlockEffect");
var $10WeatherIceBroken = require("WeatherIceBroken");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MapBlockItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBlockImg = null;
    e.mMapBlockEffectPb = null;
    e.mWeatherIceBrokenPb = null;
    e._stoneHp = 0;
    e._stoneSun = 0;
    e._maxHp = 0;
    e._holdGrid = "";
    e._isPlayIceBroken = true;
    e._stageChapter = 0;
    e._blockType = 0;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "holdGrid", {
    get: function () {
      return this._holdGrid;
    },
    set: function (t) {
      this._holdGrid = t;
      var e = this.node.getChildByName("test");
      e.getComponent(cc.Label).string = t;
      e.active = false;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "stoneHp", {
    get: function () {
      return this._stoneHp;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "blockType", {
    get: function () {
      return this._blockType;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.initMapBlockItem = function (t, e, o, i) {
    undefined === i && (i = 0);
    this._stoneHp = t;
    this._maxHp = e;
    this._stoneSun = o;
    this._blockType = i;
    this._isPlayIceBroken = $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.IceAndSnow;
    this.node.getChildByName("snowImg").active = $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.IceAndSnow;
    $10BattleDataProxy.battleDataProxy.weatherType;
    $10GameEnum.WeatherType.NONE;
    this._stageChapter = 1;
    this.changeBlockImg();
  };
  _ctor.prototype.ballCollisionEnter = function (t) {
    if (this.node && this.node.isValid && $10BattleDataProxy.battleDataProxy.isStartFight && !(this._stoneHp <= 0)) {
      this._stoneHp -= 1;
      if (this._stoneHp <= 0 || $10BattleDataProxy.battleDataProxy.testBlock) {
        this._stoneHp = 0;
        var e = $10BattleDataProxy.battleDataProxy.mapBlockNum;
        e -= 1;
        $10BattleDataProxy.battleDataProxy.mapBlockNum = e;
        var o = $10Util.default.nodeWorldPos(this.node);
        this.addMapBlockEffect(cc.v2(o), 2);
        $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.MAP_BLOCK_DESTROY, this._holdGrid);
        if (e <= 0 && $10BattleDataProxy.battleDataProxy.getStageRewardCfg().AllSun > 0) {
          this._stoneSun += $10BattleDataProxy.battleDataProxy.getStageRewardCfg().AllSun;
          this.addDestroyAllBlockEffect();
        }
        if (this._blockType && 0 != this._blockType) {
          $10BattleDataProxy.battleDataProxy.boxRewardTypes.push(this._blockType);
          $10BattleDataProxy.battleDataProxy.showBlockBoxRewardPopup();
        }
        var i = $10BattleDataProxy.battleDataProxy.sunshineRoot;
        var n = $10BattleDataProxy.battleDataProxy.battleView.convertToNodeSpaceAR(i.parent.convertToWorldSpaceAR(i.position));
        var a = $10BattleDataProxy.battleDataProxy.gameCamera;
        $10AnimationMgr.default.instance.showAwardAni({
          id: 8,
          num: this._stoneSun
        }, $10BattleDataProxy.battleDataProxy.battleView, this.node, 0, n.addSelf(a.position));
        var c = $10BattleDataProxy.battleDataProxy.sunshineNum;
        c += this._stoneSun;
        $10BattleDataProxy.battleDataProxy.sunshineNum = c;
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/blockSmash", $10HomeEnum.Bundles.RES);
        this.node.destroy();
        this.node.removeFromParent();
      } else {
        if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.IceAndSnow) {
          if (this._isPlayIceBroken) {
            if (Math.floor(this._stoneHp / this._maxHp / .2) <= 3) {
              this._isPlayIceBroken = false;
              var p = cc.instantiate(this.mWeatherIceBrokenPb);
              $10BattleDataProxy.battleDataProxy.blockLayout.addChild(p, 1);
              p.getComponent($10WeatherIceBroken.default).show(null);
              p.position = this.node.position.clone().subtract($10BattleDataProxy.battleDataProxy.gameCamera.position);
            } else {
              this.addMapBlockEffect(t);
            }
          } else {
            this.addMapBlockEffect(t);
          }
        } else {
          this.addMapBlockEffect(t);
        }
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/blockCollision", $10HomeEnum.Bundles.RES);
        this.changeBlockImg();
      }
    }
  };
  _ctor.prototype.addMapBlockEffect = function (t, e) {
    var o = this;
    undefined === e && (e = 1);
    var i = $10BattleDataProxy.battleDataProxy.blockLayout.convertToNodeSpaceAR(cc.v3(t));
    this.getBlockEffectPb(function (t) {
      if ($10BattleDataProxy.battleDataProxy.blockLayout && $10BattleDataProxy.battleDataProxy.blockLayout.isValid) {
        var n = $10NodePoolManager.default.instance.getNode(t);
        $10BattleDataProxy.battleDataProxy.blockLayout.addChild(n, 1);
        n.position = i;
        n.getComponent($10MapBlockEffect.default).play(e, o._isPlayIceBroken);
      }
    });
  };
  _ctor.prototype.getBlockEffectPb = function (t) {
    if (1 != this._stageChapter || this._blockType && 0 != this._blockType) {
      $10ResUtil.ResUtil.loadAsset({
        path: "prefabs/effect/MapBlockEffect2",
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (e) {
        t && t(e);
      }).catch(function (e) {
        console.log("error:", e);
        t && t(null);
      });
    } else {
      t && t(this.mMapBlockEffectPb);
    }
  };
  _ctor.prototype.addDestroyAllBlockEffect = function () {
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/effect/DestroyAllBlockEffect",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      var e = cc.instantiate(t);
      $10BattleDataProxy.battleDataProxy.top1.addChild(e);
      e.position = cc.v3(70, 175);
      e.getComponent($10DestroyAllBlockEffect.default).play();
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.changeBlockImg = function () {
    var t = this;
    var e = Math.floor(this._stoneHp / this._maxHp / .2);
    if (e < 1) {
      e = 1;
    } else {
      e > 4 && (e = 4);
    }
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/mapAdorn/MapAdorn",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (o) {
      if (t._blockType && 0 != t._blockType) {
        t.mBlockImg.spriteFrame = o.getSpriteFrame("pic_ditu10zhuan_" + e);
      } else if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.SandWind) {
        t.mBlockImg.spriteFrame = o.getSpriteFrame("pic_tianqi4_zhuankuai" + e);
      } else {
        t.mBlockImg.spriteFrame = o.getSpriteFrame("pic_ditu" + t._stageChapter + "zhuan_" + e);
      }
    }).catch(function (t) {
      console.log("error:", t);
    });
    var o = this.node.getChildByName("snowImg");
    o.active && e <= 3 && (o.active = false);
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mBlockImg", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mMapBlockEffectPb", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mWeatherIceBrokenPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_MapBlockItem;