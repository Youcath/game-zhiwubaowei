var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10SimplyCircleCollider = require("SimplyCircleCollider");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var $10SkillDataMgr = require("SkillDataMgr");
var $10BossSkillCharm = require("BossSkillCharm");
var $10CorruptMark = require("CorruptMark");
var $10BulletBase = require("BulletBase");
var $10BulletBoom = require("BulletBoom");
var $10BoxIceClick = require("BoxIceClick");
var $10BoxIceCrush = require("BoxIceCrush");
var $10PlantIceEffect = require("PlantIceEffect");
var $10WeatherIceBroken = require("WeatherIceBroken");
var $10WeatherIceEffect = require("WeatherIceEffect");
var $10WeatherNightLight = require("WeatherNightLight");
var $10MapGridItem = require("MapGridItem");
var $10SuperPlantActive = require("SuperPlantActive");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_EquipmentItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mGridsLayout = null;
    e.mDataFormIdx = $10GameEnum.EquipmentFormIdx.FORM_0;
    e.mLvLab = null;
    e.mBulletPb = null;
    e.mFireNode = null;
    e.mBoxWhite = null;
    e.mCounterBar = null;
    e.mIsFixedPlant = false;
    e.mIsHybridPlant = false;
    e.mPriceLab = null;
    e.mTriggerBar = null;
    e.mEquipId = 0;
    e._idx = 0;
    e._originPosition = null;
    e._level = 0;
    e._bAnim = false;
    e._equipmentData = [];
    e._holdGrids = [];
    e._triggerNum = 0;
    e._triggerCounter = 0;
    e._superTriggerNum = 0;
    e._superTriggerCounter = 0;
    e._isCheckActive = false;
    e._colliderCd = 0;
    e._atkCount = 0;
    e._continuouFireNum = 0;
    e._continuouFireTime = 0;
    e._atkTarget = null;
    e._oneAtkTargetNum = 0;
    e._lastAtkTarget = null;
    e._isShukuchi = false;
    e._checkSdTime = 0;
    e._plantPrice = 0;
    e._isPurchased = false;
    e._atkTargets = [];
    e._atkTargetNum = 0;
    e._superPlantData = null;
    e._superIsAtkFinish = true;
    e._isIce = false;
    e._isMark = false;
    e._plantIceEffect = null;
    e._iceBreakerCount = 0;
    e._iceBreakerMaxCount = 0;
    e._bossBallNum = 0;
    e._isBossBallMark = false;
    e._corruptMark = null;
    e._isTakeEffect = true;
    e._bossColliderCd = 0;
    e._charmTime = 0;
    e._isCharm = false;
    e._charmNode = null;
    e._isCanDemotion = false;
    e._bossSkillCourse = null;
    e._frenzyBulletNum = 0;
    e._frenzyTime = 0;
    e._adNode = null;
    e._itemIcon2 = null;
    e._itemIcon = null;
    e._star = null;
    e._root = null;
    e._lightningStrokeEffect = null;
    e._lightningDizzinessTime = 0;
    e._isLightningStroke = false;
    e._isRage = false;
    e._isBeWindUp = false;
    e._beWindUpTime = 0;
    e._tornadoEffect = null;
    e._weatherIceCount = 0;
    e._isWeatherIce = false;
    e._weatherIceNodes = [];
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "idx", {
    get: function () {
      return this._idx;
    },
    set: function (t) {
      this._idx = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "bossSkillCourse", {
    get: function () {
      return this._bossSkillCourse;
    },
    set: function (t) {
      this._bossSkillCourse = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "dataFormIdx", {
    get: function () {
      return this.mDataFormIdx;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "grids", {
    get: function () {
      return this.mGridsLayout.children;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isIce", {
    get: function () {
      return this._isIce;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isMark", {
    get: function () {
      return this._isMark;
    },
    set: function (t) {
      this._isMark = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isLightningStroke", {
    get: function () {
      return this._isLightningStroke;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isTakeEffect", {
    get: function () {
      return this._isTakeEffect;
    },
    set: function (t) {
      this._isTakeEffect = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isBeWindUp", {
    get: function () {
      return this._isBeWindUp;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "holdGrids", {
    get: function () {
      return this._holdGrids;
    },
    set: function (t) {
      this._holdGrids = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "adFlag", {
    get: function () {
      return this._adNode.active;
    },
    set: function (t) {
      this._adNode.active = t;
      this.updateVideoIconFrame();
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.updateVideoIconFrame = function () {
    if (this._adNode.active) {
      var t = this._adNode.getChildByName("icon");
      $10BattleDataProxy.battleDataProxy.setVideoCardIcon(t, 3);
      this.isSpecialPlant || (this.mPriceLab.node.parent.active = false);
    }
  };
  Object.defineProperty(_ctor.prototype, "root", {
    get: function () {
      return this._root;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "level", {
    get: function () {
      return this._level;
    },
    set: function (t) {
      this._level = t;
      this.mLvLab.string = "" + this._level;
      if (!this.mIsFixedPlant) {
        var e = this._root.getChildByName("levelIcon");
        if (e) {
          var o = e.getComponent(cc.Sprite).spriteFrame.name;
          var i = o.substring(0, o.length - 1);
          var n = this._level > 5 ? 5 : this._level;
          $10ResUtil.ResUtil.loadAsset({
            path: "textures/botanyGird/BotanyGrid",
            type: cc.SpriteAtlas,
            bundleName: $10HomeEnum.Bundles.GAME
          }).then(function (t) {
            e.getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("" + i + n);
          }).catch(function (t) {
            console.log("error:", t);
          });
        }
        if (this.isPurchased) {
          this.mPriceLab.node.active = false;
        } else {
          this._plantPrice = $10BattleDataProxy.battleDataProxy.getPlantPrice(this.equipId, t);
          this.mPriceLab.string = "" + this._plantPrice;
          this.updatesunshineNum();
        }
        this.setSuperPlantIcon();
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "plantPrice", {
    get: function () {
      return this._plantPrice;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "equipId", {
    get: function () {
      return this.mEquipId;
    },
    set: function (t) {
      this.mEquipId = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "bAnim", {
    set: function (t) {
      this._bAnim = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "canClick", {
    get: function () {
      return !this._bAnim;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isPurchased", {
    get: function () {
      return this._isPurchased;
    },
    set: function (t) {
      this._isPurchased = t;
      if (t) {
        this.mPriceLab && (this.mPriceLab.node.parent.active = false);
        this._adNode.active = false;
        this._star && (this._star.active = false);
        this.addSleep();
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isCanDemotion", {
    set: function (t) {
      this._isCanDemotion = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "isSpecialPlant", {
    get: function () {
      return this.mIsFixedPlant;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.addSleep = function () {
    var t = this;
    if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.Night) {
      if (3 != this.equipId && 10 != this.equipId && 10001 != this.equipId && 10002 != this.equipId && 10006 != this.equipId && 10008 != this.equipId) {
        $10ResUtil.ResUtil.loadAsset({
          path: "prefabs/weather/WeatherSleep",
          type: cc.Prefab,
          bundleName: $10HomeEnum.Bundles.GAME
        }).then(function (e) {
          var o = cc.instantiate(e);
          t._root.addChild(o);
          o.position = cc.v3(0, 0, 0);
        }).catch(function (t) {
          console.log("error:", t);
        });
      } else {
        this.addWeatherNightLight();
      }
    }
  };
  _ctor.prototype.addWeatherNightLight = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/weather/WeatherNightLight",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      var o = t._root.getChildByName("lightRoot");
      var i = cc.instantiate(e);
      o.addChild(i, -1);
      i.position = cc.v3(0, 0, 0);
      i.getComponent($10WeatherNightLight.default).show();
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.cleanBossBall = function () {
    this._bossBallNum = 0;
    this._isBossBallMark = false;
    if (this._corruptMark && this._corruptMark.isValid) {
      this._corruptMark.destroy();
      this._corruptMark.removeFromParent();
      this._corruptMark = null;
    }
  };
  _ctor.prototype.updatesunshineNum = function () {
    var t = $10BattleDataProxy.battleDataProxy.sunshineNum;
    if (this._plantPrice > t) {
      this.mPriceLab.node.color = cc.color(255, 75, 25);
    } else {
      this.mPriceLab.node.color = cc.color(255, 255, 255);
    }
  };
  _ctor.prototype.update = function (t) {
    var e;
    var o = this;
    if (this._isTakeEffect) {
      if (!($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.READY)) {
        this._colliderCd > 0 && (this._colliderCd -= t);
        this._bossColliderCd > 0 && (this._bossColliderCd -= t);
        if (this._charmTime > 0) {
          this._charmTime -= t, this._charmTime <= 0 && (this._isCharm = false, this._charmNode && this._charmNode.isValid && (this._charmNode.destroy(), this._charmNode.removeFromParent(), this._charmNode = null));
        }
        if (this._frenzyBulletNum > 0) {
          this._frenzyTime += t, this._frenzyTime >= .1 && (this._frenzyTime = 0, this._frenzyBulletNum--, this.initAtkTargets(), this.addFrenzyBullet());
        }
        if (this._isLightningStroke) {
          this._lightningDizzinessTime -= t, this._lightningDizzinessTime <= 0 && (this._isLightningStroke = false, this._lightningStrokeEffect && this._lightningStrokeEffect.isValid && (this._lightningStrokeEffect.destroy(), this._lightningStrokeEffect.removeFromParent(), this._lightningStrokeEffect = null));
        }
      }
      if (this._isBeWindUp) {
        this._beWindUpTime -= t;
        if (this._beWindUpTime <= 0) {
          this._beWindUpTime = 5, cc.Tween.stopAllByTarget(this._root), this._root.angle = 0, this._tornadoEffect && this._tornadoEffect.isValid && (this._tornadoEffect.active = false), cc.tween(this._root).to(.1, {
            position: cc.v3(0, 0, 0)
          }).call(function () {
            o._isCheckActive = true;
            o._isBeWindUp = false;
          }).start();
        }
      }
      if (10 == this.equipId && !$10BattleDataProxy.battleDataProxy.isEndless && $10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.Night) {
        if ($10BattleDataProxy.battleDataProxy.getIsSuperPlant(this.equipId)) {
          if (this._isShukuchi) {
            this._isShukuchi = false;
            this._itemIcon.active = !this._isShukuchi;
            this._itemIcon2.active = this._isShukuchi;
          }
        } else {
          this._checkSdTime += t;
          if (this._checkSdTime >= .5) {
            this._checkSdTime = 0;
            var i = false;
            var n = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
            var a = null;
            for (var r = 0; r < n.length; ++r) {
              var s = n[r];
              if (s && s.isValid && (a || (a = $10Util.default.convertToTargetNodeSpace(this.node, s)), s.y < a.y)) {
                i = true;
                break;
              }
            }
            if (this._isShukuchi != i) {
              this._isShukuchi = i;
              this._itemIcon.active = !this._isShukuchi;
              this._itemIcon2.active = this._isShukuchi;
            }
          }
        }
      }
      if (this._isCheckActive) {
        var c = true;
        var l = $10BattleDataProxy.battleDataProxy.bulletBalls;
        for (r = 0; r < l.length; ++r) {
          var m = l[r].getComponent($10SimplyCircleCollider.default);
          var f = null === (e = this._root) || undefined === e ? undefined : e.getChildByName("collisions");
          for (var y = 0; y < f.childrenCount; ++y) {
            var _ = f.children[y].getComponent($10SimplyRectCollider.default);
            if (_ && $10SimplyCollisionDetector.default.isCollisionRectToCircle(_.rect, m.circle)) {
              c = false;
              break;
            }
          }
        }
        if (c) {
          this._isCheckActive = false;
          this.setIsCollider(true);
        }
      }
    }
  };
  _ctor.prototype.onLoad = function () {
    this._level = 1;
    this._equipmentData = $10GameEnum.EquipmentData["form" + this.mDataFormIdx].data;
    this._root = this.node.getChildByName("root");
    this._adNode = this._root.getChildByName("Ad");
    this.mCounterBar = this._root.getChildByName("barBg").getChildByName("bar").getComponent(cc.Sprite);
    this._itemIcon2 = this._root.getChildByName("itemIcon2");
    this._itemIcon = this._root.getChildByName("itemIcon");
    this._star = this._root.getChildByName("star");
    this.mCounterBar.node.parent.active = false;
    this._triggerNum = $10DataManager.DataManager.instance.eData.dataplant[this.equipId].triggerNum;
    this._superPlantData = $10DataManager.DataManager.instance.eData.datasuperplant[this.equipId];
    if (this.mIsHybridPlant) {
      this._superTriggerNum = $10DataManager.DataManager.instance.eData.data_hybridizationskill[this.equipId].needNum;
    } else {
      this._superTriggerNum = this._superPlantData.needNum;
    }
    this._triggerCounter = 0;
    this._isPurchased = false;
    if (this.mTriggerBar) {
      this.mTriggerBar.fillRange = 0;
      this.mTriggerBar.node.opacity = 125;
      this.mTriggerBar.fillStart = 1;
    }
    this.mBoxWhite = this._root.getChildByName("boxWhite");
    this.mBoxWhite && (this.mBoxWhite.active = false);
    this._isCanDemotion = true;
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.UPDATE_VIDEO_CARD, this.updateVideoIconFrame, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.UPDATE_SUPER_STATE, this.setSuperPlantIcon, this);
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.SELECT_SUPER_PLANT, this.selectSuperPlant, this);
    this._star && (this._star.active = this.mEquipId == $10BattleDataProxy.battleDataProxy.battleData.superPlantId);
  };
  _ctor.prototype.setSuperPlantIcon = function () {
    var t;
    var e = this;
    var o = $10BattleDataProxy.battleDataProxy.getIsSuperPlant(this.mEquipId);
    t = o || this._isRage ? "pic_CWplant" + this.mEquipId : this.mIsHybridPlant ? "wp_" + this.mEquipId : "pic_plant" + this.mEquipId;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/botanyIcon/BotanyIcon",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (o) {
      e._itemIcon.getComponent(cc.Sprite).spriteFrame = o.getSpriteFrame(t);
      e.mTriggerBar && (e.mTriggerBar.spriteFrame = o.getSpriteFrame(t));
    }).catch(function (t) {
      console.log("error:", t);
    });
    if ((o || this._isRage || this.mIsHybridPlant) && this.isPurchased) {
      this.mCounterBar.node.parent.active = this._superTriggerNum > 1;
      this.mCounterBar.fillRange = this._superTriggerCounter / this._superTriggerNum;
      if (4 == this.mEquipId) {
        for (var i = 0; i < this._weatherIceNodes.length; ++i) {
          var n = this._weatherIceNodes[i];
          for (var a = 0; a < n.iceNodes.length; ++a) {
            var r = n.iceNodes[a];
            r && r.isValid && (r.active = false);
          }
        }
      }
    } else {
      this.mCounterBar.node.parent.active = false;
    }
    2 != this.mEquipId && 6 != this.mEquipId && 10 != this.mEquipId && 12 != this.mEquipId || $10BattleDataProxy.battleDataProxy.getIsSuperPlant(this.mEquipId) && (this.mTriggerBar.node.active = false);
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.UPDATE_VIDEO_CARD, this.updateVideoIconFrame, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.UPDATE_SUPER_STATE, this.setSuperPlantIcon, this);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.SELECT_SUPER_PLANT, this.selectSuperPlant, this);
  };
  _ctor.prototype.selectSuperPlant = function () {
    this._star && (this._star.active = this.mEquipId == $10BattleDataProxy.battleDataProxy.battleData.superPlantId);
  };
  _ctor.prototype.setCounterIsShow = function (t) {
    if (t && ($10BattleDataProxy.battleDataProxy.getIsSuperPlant(this.mEquipId) || this.mIsHybridPlant) && this.isPurchased) {
      this.mCounterBar.node.parent.active = this._superTriggerNum > 1;
      this._superTriggerNum > 1 && (this.mCounterBar.fillRange = this._superTriggerCounter / this._superTriggerNum);
    } else {
      this.mCounterBar.node.parent.active = false;
    }
  };
  _ctor.prototype.setOriginPosition = function (t) {
    this._originPosition = t;
  };
  _ctor.prototype.backOrgin = function () {
    this.node.position = this._originPosition.clone();
  };
  _ctor.prototype.getIsHaveBeLinkedGrid = function (t, e) {
    for (var o = 0; o < t.length; ++o) {
      if (t[o].mapGridKey == e) {
        return true;
      }
    }
    return false;
  };
  _ctor.prototype.checkGridIsBeLinked = function (t, e) {
    var o = [];
    var i = -1;
    var n = 0;
    var a = 0;
    for (var r = 0; r < t.length; ++r) {
      var s = t[r];
      var c = s.node.getComponent($10MapGridItem.default).rowCol.split("-").map(Number);
      var l = 0;
      var u = null;
      var p = null;
      for (var h = 0; h < this._equipmentData.length; ++h) {
        for (var m = 0; m < this._equipmentData[h].length; ++m) {
          this._equipmentData[h][m] > 0 && l++;
        }
      }
      for (h = 0; h < this._equipmentData.length; ++h) {
        var f = function (r) {
          var m = c[0] + h + "-" + (c[1] + r - $10GameEnum.EquipmentData["form" + y.mDataFormIdx].colOffset);
          if (!y.getIsHaveBeLinkedGrid(t, m)) {
            u = null;
            p = null;
            return "continue";
          }
          var f = e.get(m);
          if (y._equipmentData[h][r] > 0) {
            if (!f) {
              u = null;
              p = null;
              return "continue";
            }
            u || (u = []);
            p || (p = []);
            u.push(m);
            p.push(s);
            if (u.length >= l) {
              o.push(u);
              var g = 0;
              p.forEach(function (t) {
                g += t.area;
              });
              if (g > n) {
                i = a;
                n = g;
              }
              a++;
            }
          }
        };
        var y = this;
        for (m = 0; m < this._equipmentData[h].length; ++m) {
          f(m);
        }
      }
    }
    return o[i];
  };
  _ctor.prototype.addFrenzyBullet = function () {
    if ($10BattleDataProxy.battleDataProxy.isActiveSuperPlant && 13 == this.equipId) {
      this.openFireEx();
    } else {
      this.openFire();
    }
  };
  _ctor.prototype.openFireEx = function () {};
  _ctor.prototype.openFire = function () {
    if (!(this._atkTargets.length <= 0)) {
      this._atkCount++;
      var t = $10BattleDataProxy.battleDataProxy.getBulletNum(this._atkCount, this.equipId);
      this._continuouFireNum = $10BattleDataProxy.battleDataProxy.getFireNum(this.equipId);
      if (t > 1) {
        var e = this.getTargetRadian(this._atkTargets[0]);
        var o = Math.floor(cc.misc.radiansToDegrees(e + Math.PI));
        for (var i = 0; i < t; ++i) {
          var n = this.addBulletNode(this._atkTargets[0]);
          if (n) {
            var a = this.getBulletStartAngle(t, i, o);
            n.angle = a;
            var r = $10MathUtil.MathUtil.getRadian(a);
            var s = $10Util.default.convertToTargetNodeSpace(this.node, n);
            var l = s.x + cc.winSize.height * Math.cos(r);
            var u = s.y + cc.winSize.height * Math.sin(r);
            n.getComponent($10BulletBase.default).setAtkPos(cc.v3(l, u));
          }
        }
      } else if (this._atkTargetNum > 1) {
        for (i = 0; i < this._atkTargetNum; ++i) {
          var p = this._atkTargets[i];
          p && p.isValid && this.addBulletNode(p);
        }
      } else if (this._continuouFireNum > 1) {
        this._atkTarget = this._atkTargets[0];
        this._continuouFireTime = 0;
        this.addBulletNode(this._atkTarget);
      } else {
        this.addBulletNode(this._atkTargets[0]);
      }
    }
  };
  _ctor.prototype.bossBallCollisionEnter = function () {
    var t = this;
    this.isSpecialPlant || this._bossColliderCd > 0 || this._isTakeEffect && (this._bossColliderCd = .2, this._bossBallNum++, this._isBossBallMark ? this._corruptMark && this._corruptMark.isValid && this._corruptMark.getComponent($10CorruptMark.default).updateMark(this._bossBallNum) : $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/bossSkill/CorruptMark",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      t._corruptMark = cc.instantiate(e);
      t.node.addChild(t._corruptMark);
      t._corruptMark.position = t.getCorruptMarkPos();
      t._corruptMark.getComponent($10CorruptMark.default).updateMark(t._bossBallNum);
    }).catch(function (t) {
      console.log("error:", t);
    }), this._bossBallNum >= 3 && (this._isTakeEffect = false, cc.Tween.stopAllByTarget(this._root), cc.tween(this._root).to(.05, {
      angle: -10
    }).to(.05, {
      angle: 0
    }).to(.05, {
      angle: 10
    }).to(.05, {
      angle: 0
    }).to(.3, {
      scale: 1.3
    }).call(function () {
      t.addBoom();
      t.holdGrids.forEach(function (t) {
        $10BattleDataProxy.battleDataProxy.gridsMap.get(t).getComponent($10MapGridItem.default).belongTo = null;
      });
      t.node.destroy();
      t.node.removeFromParent();
      $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.UPDATE_SUPER_PLANT_NUM);
    }).start()), this._isBossBallMark = true);
  };
  _ctor.prototype.addBoom = function () {
    var t = this.node.convertToWorldSpaceAR(cc.v3(0, 0));
    var e = $10BattleDataProxy.battleDataProxy.battleView.convertToNodeSpaceAR(t);
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/bullet/BulletBoom",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      if ($10BattleDataProxy.battleDataProxy.battleView && $10BattleDataProxy.battleDataProxy.battleView.isValid) {
        var o = cc.instantiate(t);
        $10BattleDataProxy.battleDataProxy.bulletView.addChild(o);
        o.position = e;
        o.getComponent($10BulletBoom.default).initBulletBoom();
      }
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.getCorruptMarkPos = function () {
    if (4 == this.mEquipId) {
      return cc.v3(-this.node.width / 2, -this.node.height / 4);
    }
    var t = 30 * (this.node.height / 60 - 1);
    return cc.v3(-this.node.width / 2, t);
  };
  _ctor.prototype.frenzyCollisionEnter = function () {
    if (this.getCollisionIsValid()) {
      this._root.scale = 1;
      cc.Tween.stopAllByTarget(this._root);
      var t = cc.tween(this._root).to(.1, {
        scale: 1.2
      }).to(.1, {
        scale: 1
      });
      cc.tween(this._root).repeat(3, t).start();
      if (this.isSpecialPlant) {
        this._frenzyBulletNum = 0;
      } else {
        var e = $10DataManager.DataManager.instance.eData.dataplant[this.mEquipId].gridNum;
        var o = $10DataManager.DataManager.instance.eData.datapara[44].num.split("|").map(Number)[e - 1];
        o || (o = 2);
        var i = Number($10DataManager.DataManager.instance.eData.datapara[45].num);
        var n = o;
        this._frenzyBulletNum = n <= i ? n : i;
      }
    } else {
      this._frenzyBulletNum = 0;
    }
  };
  _ctor.prototype.initAtkTargets = function () {
    this._atkTargetNum = $10BattleDataProxy.battleDataProxy.getAtkTargetNum(this.equipId);
    this._atkTargets = $10BattleDataProxy.battleDataProxy.getPlantAtkTargets(this._atkTargetNum, this.mEquipId, this._isCharm);
    this._atkTarget = this._atkTargets[0];
  };
  _ctor.prototype.ballCollisionEnterEx = function () {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      if (this._colliderCd > 0) {
        this._atkTargetNum = 0;
        return void (this._atkTargets = []);
      }
      if (this.isSpecialPlant) {
        this.ballCollisionEnter();
      } else {
        if ($10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.IceAndSnow) {
          if (4 == this.mEquipId) {
            if (!$10BattleDataProxy.battleDataProxy.getIsSuperPlant(this.mEquipId) && (this.startWeatherIce(), this._isWeatherIce)) {
              return;
            }
          } else if (11 != this.mEquipId) {
            if (10003 != this.equipId && 10007 != this.equipId && 10009 != this.equipId && 10010 != this.equipId && (this.startWeatherIce(), this._isWeatherIce)) {
              return;
            }
          } else if (11 == $10BattleDataProxy.battleDataProxy.battleData.superPlantId && !this._isRage) {
            this._weatherIceCount++;
            if (this._weatherIceCount > 5) {
              this._isRage = true;
              this.setSuperPlantIcon();
              $10BattleDataProxy.battleDataProxy.getIsSuperPlant(11) || $10AudioManager.AudioManager.instance.playEffectPath("sounds/getPlant", $10HomeEnum.Bundles.RES);
              for (var t = 0; t < this._weatherIceNodes.length; ++t) {
                var e = this._weatherIceNodes[t];
                for (var o = 0; o < e.iceNodes.length; ++o) {
                  var i = e.iceNodes[o];
                  i && i.isValid && (i.active = false);
                }
              }
            } else {
              this.addWeatherIceEffect();
            }
          }
        }
        this.ballCollisionEnter();
      }
    }
  };
  _ctor.prototype.startWeatherIce = function () {
    if (this._isWeatherIce) {
      this._weatherIceCount--;
    } else {
      this._weatherIceCount++;
    }
    this.addWeatherIceEffect();
    if (this._weatherIceCount < 0) {
      this._isWeatherIce = false;
      for (var t = 4; t > this._weatherIceCount; --t) {
        var e = this._weatherIceNodes[t];
        for (var o = 0; o < e.iceNodes.length; ++o) {
          e.iceNodes[o].active = false;
        }
      }
      this._weatherIceCount = 0;
    } else {
      this._weatherIceCount >= 5 && (this._isWeatherIce = true);
    }
  };
  _ctor.prototype.addWeatherIceEffect = function () {
    var t = this;
    if (this._isWeatherIce) {
      if (this._weatherIceCount < 0) {
        this.addWeatherIceBroken();
      } else {
        this.addBoxIceClick();
      }
    } else {
      var e = "";
      var o = false;
      if (this._weatherIceCount >= 5) {
        e = "prefabs/effect/PlantIceEffect";
        o = true;
      } else {
        e = "prefabs/weather/WeatherIceEffect";
      }
      var i = this._weatherIceNodes.findIndex(function (e) {
        return e.iceCount == t._weatherIceCount;
      });
      if (i >= 0) {
        var n = this._weatherIceNodes[i];
        for (var a = 0; a < n.iceNodes.length; ++a) {
          var r = n.iceNodes[a];
          r && r.isValid && (r.active = true);
        }
      } else {
        var s = this._weatherIceCount;
        $10ResUtil.ResUtil.loadAsset({
          path: e,
          type: cc.Prefab,
          bundleName: $10HomeEnum.Bundles.GAME
        }).then(function (e) {
          if (!t._isRage) {
            if (o) {
              var i = cc.instantiate(e);
              t._root.addChild(i);
              i.getComponent($10PlantIceEffect.default).initPlantIceEffect(t.getIceFrameData());
              i.getComponent($10PlantIceEffect.default).updateState(1);
              t._weatherIceNodes.push({
                iceCount: s,
                iceNodes: [i]
              });
            } else {
              var n = t.mGridsLayout.children;
              var a = [];
              for (var r = 0; r < n.length; ++r) {
                var c = cc.instantiate(e);
                t._root.addChild(c);
                c.getComponent($10WeatherIceEffect.default).initWeatherIceEffect(n[r]);
                a.push(c);
              }
              t._weatherIceNodes.push({
                iceCount: s,
                iceNodes: a
              });
            }
          }
        }).catch(function (t) {
          console.log("error:", t);
        });
      }
    }
  };
  _ctor.prototype.addWeatherIceBroken = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/weather/WeatherIceBroken",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      var o = t.mGridsLayout.children;
      for (var i = 0; i < o.length; ++i) {
        var n = cc.instantiate(e);
        t._root.addChild(n);
        n.getComponent($10WeatherIceBroken.default).show(o[i]);
      }
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.ballCollisionEnter = function () {
    if (!(!this._isTakeEffect || (this.initAtkTargets(), this._atkTargets.length <= 0))) {
      this._colliderCd = $10GameEnum.EGameEnum.COLLIDER_BASE_TIME;
      cc.Tween.stopAllByTarget(this._root);
      this._root.scale = 1;
      if (this.mBoxWhite) {
        this.mBoxWhite.active = true, this.mBoxWhite.opacity = 0, cc.Tween.stopAllByTarget(this.mBoxWhite), cc.tween(this.mBoxWhite).to(.1, {
          opacity: 220
        }).to(.1, {
          opacity: 0
        }).start();
      }
      cc.tween(this._root).to(.1, {
        scale: 1.2
      }).to(.1, {
        scale: 1
      }).start();
      this._atkTargets.length > 0 && (this._atkTarget = this._atkTargets[0]);
    }
  };
  _ctor.prototype.addSuperTriggerCounter = function () {
    if (!this._isTakeEffect) {
      return false;
    }
    if (this._isCharm) {
      return false;
    }
    if (!this._atkTarget || !this._atkTarget.isValid) {
      return false;
    }
    var t = false;
    if ($10BattleDataProxy.battleDataProxy.getIsSuperPlant(this.mEquipId) && this._atkTargets.length > 0 || this._isRage) {
      this._superTriggerCounter++;
      if (this._superTriggerCounter >= this._superTriggerNum) {
        this._superTriggerCounter = 0, t = true, this.addSuperPlantActive();
      }
      this._superTriggerNum > 1 && (this.mCounterBar.fillRange = this._superTriggerCounter / this._superTriggerNum);
    }
    return t;
  };
  _ctor.prototype.addTriggerCounter = function () {
    if (!this._isTakeEffect) {
      return false;
    }
    var t = false;
    if (this._atkTargets.length > 0) {
      this._triggerCounter++;
      if (this._triggerCounter >= this._triggerNum) {
        this._triggerCounter = 0, t = true;
      }
      this.setTriggerBarFillRange(t);
    }
    return t;
  };
  _ctor.prototype.setTriggerBarFillRange = function () {};
  _ctor.prototype.hideTriggerBar = function () {
    if (!this.isSpecialPlant) {
      this._superTriggerCounter = 0;
      this._triggerCounter = 0;
      if (this.mTriggerBar) {
        this.mTriggerBar.node.active = false, this._triggerNum > 1 ? this.mTriggerBar.fillRange = -1 : this.mTriggerBar.fillRange = 0;
      }
      this.mCounterBar.fillRange = this._superTriggerCounter / this._superTriggerNum;
    }
  };
  _ctor.prototype.addBulletNode = function (t, e, o) {
    if (!(t && t.isValid || (t = $10BattleDataProxy.battleDataProxy.getPlantAtkTargets(1, this.mEquipId, this._isCharm)[0]))) {
      return null;
    }
    e || (e = this.getAtkRate());
    var i = 1;
    o && (i = this._superPlantData.damage1);
    if (this._lastAtkTarget != t) {
      this._oneAtkTargetNum = 1;
      this._lastAtkTarget = t;
    } else {
      this._oneAtkTargetNum++;
    }
    this._continuouFireNum--;
    var n = $10NodePoolManager.default.instance.getNode(this.mBulletPb);
    $10BattleDataProxy.battleDataProxy.bulletView.addChild(n, 1e3);
    var a = $10Util.default.convertToTargetNodeSpace(this.mFireNode, n);
    n.position = a;
    n.getComponent($10BulletBase.default).atkRate = e;
    n.getComponent($10BulletBase.default).superRate = i;
    n.getComponent($10BulletBase.default).setOneAtkTargetNum(this._oneAtkTargetNum);
    n.getComponent($10BulletBase.default).initBullet(this.mEquipId, t, this._level, this._atkCount);
    return n;
  };
  _ctor.prototype.getAtkRate = function () {
    if ($10BattleDataProxy.battleDataProxy.getIsSuperPlant(this.mEquipId)) {
      return this._superPlantData.damage;
    } else {
      if (10 == this.equipId && this._isShukuchi) {
        return $10SkillDataMgr.default.instance.getSkillProperty(13, this.equipId);
      } else {
        return 1;
      }
    }
  };
  _ctor.prototype.getTargetRadian = function (t) {
    var e = 0;
    if (!this.node || !this.node.isValid) {
      return e;
    }
    if (t && t.isValid && t.position) {
      var o = t.position;
      var i = $10Util.default.convertToTargetNodeSpace(this.node, t);
      e = $10MathUtil.MathUtil.getDoublPointRadian(i, o);
    }
    return e;
  };
  _ctor.prototype.getBulletStartAngle = function (t, e, o) {
    var i = 45 / t;
    if ($10BattleDataProxy.battleDataProxy.enemyNodes.length <= 1) {
      return o + Math.floor(t / 2) * i - i * e;
    } else {
      return o - i * e;
    }
  };
  _ctor.prototype.setIsCollider = function (t) {
    this.getComponent(cc.RigidBody).active = t;
    var e = this.getComponent(cc.PhysicsPolygonCollider);
    var o = this.getComponent(cc.PhysicsBoxCollider);
    if (o) {
      o.enabled = t;
      o.apply();
    }
    if (e) {
      e.enabled = t;
      e.apply();
    }
    t || (this._isCheckActive = false);
  };
  _ctor.prototype.checkIsActive = function () {
    this._isCheckActive = true;
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/placePlant", $10HomeEnum.Bundles.RES);
    this._root.scale = .8;
    cc.Tween.stopAllByTarget(this._root);
    cc.tween(this._root).to(.15, {
      scale: 1.1
    }).to(.15, {
      scale: 1
    }).start();
    this._isCanDemotion = true;
  };
  _ctor.prototype.purchasePlant = function () {
    var t = $10BattleDataProxy.battleDataProxy.sunshineNum;
    return !(t < this._plantPrice || (this.mPriceLab.node.parent.active = false, t -= this._plantPrice, $10BattleDataProxy.battleDataProxy.sunshineNum = t, this._isPurchased = true, this._colliderCd = $10GameEnum.EGameEnum.COLLIDER_BASE_TIME, this._star && (this._star.active = false), this.addSleep(), 0));
  };
  _ctor.prototype.setPriceLabIsShow = function (t) {
    if (this.isPurchased) {
      this.mPriceLab.node.parent.active = false;
    } else {
      this.adFlag || (this.mPriceLab.node.parent.active = t);
    }
  };
  _ctor.prototype.addSuperPlantActive = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/item/SuperPlantActive",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      var o = cc.instantiate(e);
      $10BattleDataProxy.battleDataProxy.battleView.addChild(o, t.node.zIndex);
      var i = t.node;
      var n = t._root.getChildByName("shanguang");
      n && (i = n);
      var a = $10Util.default.convertToTargetNodeSpace(i, o);
      o.position = a;
      o.getComponent($10SuperPlantActive.default).play();
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.ice = function (t) {
    var e = this;
    var o = Math.floor(100 * Math.random()) % t + 1;
    this._iceBreakerMaxCount = t;
    this._iceBreakerCount = o;
    this._isIce || $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/effect/PlantIceEffect",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      e._plantIceEffect = cc.instantiate(t);
      e.node.addChild(e._plantIceEffect);
      e._plantIceEffect.getComponent($10PlantIceEffect.default).initPlantIceEffect(e.getIceFrameData());
      e._plantIceEffect.getComponent($10PlantIceEffect.default).updateState(e._iceBreakerCount / e._iceBreakerMaxCount);
    }).catch(function (t) {
      console.log("error:", t);
    });
    this._isIce = true;
  };
  _ctor.prototype.charm = function (t) {
    var e = this;
    this._charmTime = t;
    this._isCharm || $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/bossSkill/BossSkillCharm",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      e._charmNode = cc.instantiate(t);
      e.node.addChild(e._charmNode);
      e._charmNode.position = cc.v3(0, 0, 0);
      e._charmNode.getComponent($10BossSkillCharm.default).play();
    }).catch(function (t) {
      console.log("error:", t);
    });
    this._isCharm = true;
  };
  _ctor.prototype.equipItemClick = function () {
    if (this._bossSkillCourse && this._bossSkillCourse.isValid) {
      $10BattleDataProxy.battleDataProxy.bossSkillCourseIds.push(3);
      $10BattleDataProxy.battleDataProxy.saveBossSkillCourseIds();
      this._bossSkillCourse.destroy();
      this._bossSkillCourse.removeFromParent();
      this._bossSkillCourse = null;
    }
  };
  _ctor.prototype.iceBreaker = function () {
    this._iceBreakerCount--;
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/se_broken", $10HomeEnum.Bundles.RES);
    if (this._iceBreakerCount <= 0) {
      this._isIce = false;
      this.addBoxIceCrush();
      if (this._plantIceEffect && this._plantIceEffect.isValid) {
        this._plantIceEffect.destroy(), this._plantIceEffect.removeFromParent(), this._plantIceEffect = null;
      }
      if (this._bossSkillCourse && this._bossSkillCourse.isValid) {
        $10BattleDataProxy.battleDataProxy.bossSkillCourseIds.push(1), $10BattleDataProxy.battleDataProxy.saveBossSkillCourseIds(), this._bossSkillCourse.destroy(), this._bossSkillCourse.removeFromParent(), this._bossSkillCourse = null;
      }
    }
    this._plantIceEffect && this._plantIceEffect.isValid && this._plantIceEffect.getComponent($10PlantIceEffect.default).updateState(this._iceBreakerCount / this._iceBreakerMaxCount);
    this.addBoxIceClick();
  };
  _ctor.prototype.addBoxIceClick = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/effect/BoxIceClick",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      var o = $10NodePoolManager.default.instance.getNode(e);
      t.node.addChild(o);
      o.getComponent($10BoxIceClick.default).initBoxIceClick();
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.addBoxIceCrush = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/effect/BoxIceCrush",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      var o = $10NodePoolManager.default.instance.getNode(e);
      t.node.addChild(o);
      o.getComponent($10BoxIceCrush.default).initBoxIceCrush();
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  _ctor.prototype.beCapture = function (t) {
    var e = this;
    if (this._isTakeEffect) {
      this._isTakeEffect = false;
      this.setIsCollider(false);
      cc.Tween.stopAllByTarget(this._root);
      var o = $10Util.default.convertToTargetNodeSpace(this.node, t);
      this.node.parent = t.parent;
      this.node.position = o;
      this.node.zIndex = t.zIndex - 1;
      this._root.scale = 1.1;
      cc.tween(this._root).delay(.2).by(.8, {
        position: cc.v3(0, cc.winSize.height)
      }).call(function () {
        e.node.destroy();
        e.node.removeFromParent();
      }).start();
      this.holdGrids.forEach(function (t) {
        $10BattleDataProxy.battleDataProxy.gridsMap.get(t).getComponent($10MapGridItem.default).belongTo = null;
      });
      if (this._bossSkillCourse && this._bossSkillCourse.isValid) {
        this._bossSkillCourse.destroy();
        this._bossSkillCourse.removeFromParent();
        this._bossSkillCourse = null;
      }
      $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.UPDATE_SUPER_PLANT_NUM);
    }
  };
  _ctor.prototype.beWashedAway = function () {
    if (this._isCanDemotion && (this._isCanDemotion = false, !(this.level <= 1))) {
      var t = this._level;
      t -= 1;
      this.level = t;
      cc.Tween.stopAllByTarget(this._root);
      cc.tween(this._root).delay(.1).to(.25, {
        scale: 1.2
      }).to(.25, {
        scale: 1
      }).start();
    }
  };
  _ctor.prototype.passWave = function () {
    this.hideTriggerBar();
    this.cleanBossBall();
    this._charmTime = 0;
    this._isCharm = false;
    if (this._charmNode && this._charmNode.isValid) {
      this._charmNode.destroy();
      this._charmNode.removeFromParent();
      this._charmNode = null;
    }
  };
  _ctor.prototype.lightningStroke = function () {
    if (10003 != this.equipId && 10005 != this.equipId && 10008 != this.equipId && 10010 != this.equipId) {
      this._lightningDizzinessTime = 2;
      this.addEquipDizziness();
    }
  };
  _ctor.prototype.addEquipDizziness = function () {
    var t = this;
    this._isLightningStroke || $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/effect/EquipDizziness",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      if (t.node && t.node.isValid) {
        t._lightningStrokeEffect = cc.instantiate(e);
        t._root.addChild(t._lightningStrokeEffect);
        var o = t._root.getChildByName("head");
        o || (o = t._root.getChildByName("levelIcon"));
        t._lightningStrokeEffect.position = o.position;
      }
    }).catch(function (t) {
      console.log("error:", t);
    });
    this._isLightningStroke = true;
  };
  _ctor.prototype.getIceFrameData = function () {
    var t = {
      frame: "pic_Icebox2",
      scaleX: 1,
      scaleY: 1,
      angle: 90
    };
    if (3 == this.mEquipId) {
      t.frame = "pic_Icebox1";
      t.angle = 0;
    } else if (4 == this.mEquipId) {
      t.frame = "pic_Icebox4";
      t.angle = 180;
      t.scaleX = -1;
    } else if (5 == this.mEquipId) {
      t.frame = "pic_Icebox4";
      t.angle = 180;
      t.scaleY = -1;
    } else if (7 == this.mEquipId) {
      t.frame = "pic_Icebox4";
      t.angle = 0;
      t.scaleY = -1;
      t.scaleX = -1;
    } else if (8 == this.mEquipId) {
      t.frame = "pic_Icebox4";
      t.angle = 0;
    } else if (10 == this.mEquipId || 101 == this.mEquipId) {
      t.frame = "pic_Icebox11";
      t.angle = 0;
    } else if (11 == this.mEquipId) {
      t.frame = "pic_Icebox8";
      t.angle = 0;
    } else if (13 == this.mEquipId || 105 == this.mEquipId || 106 == this.mEquipId) {
      t.frame = "pic_Icebox10";
      t.angle = 0;
    } else if (13 == this.mEquipId) {
      t.frame = "pic_Icebox10";
      t.angle = 0;
    } else if (103 == this.mEquipId || 104 == this.mEquipId) {
      t.frame = "pic_Icebox2";
      t.angle = 0;
    } else if (107 == this.mEquipId) {
      t.frame = "pic_Icebox8";
      t.angle = 0;
      t.scaleY = -1;
    } else if (6 == this.mEquipId) {
      t.frame = "pic_Icebox11";
      t.angle = 90;
    } else if (15 == this.mEquipId) {
      t.frame = "pic_Icebox8";
      t.angle = 90;
    } else {
      this.mEquipId >= 10001 && (t.frame = "pic_Icebox10");
    }
    return t;
  };
  _ctor.prototype.getCollisionIsValid = function () {
    return !(this.isIce || this.isLightningStroke || !this.isPurchased || this._isBeWindUp || this._isWeatherIce);
  };
  _ctor.prototype.beWindUp = function () {
    var t = this;
    if (!this._isBeWindUp && 10002 != this.equipId && 10004 != this.equipId && 10006 != this.equipId) {
      this._isBeWindUp = true;
      this.setIsCollider(false);
      this._beWindUpTime = 5;
      if (this._tornadoEffect && this._tornadoEffect.isValid) {
        this._tornadoEffect.active = true;
        return void this.beWindUpAction();
      }
      $10ResUtil.ResUtil.loadAsset({
        path: "prefabs/effect/TornadoEffect",
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (e) {
        if (t.node && t.node.isValid) {
          t._tornadoEffect = cc.instantiate(e);
          t.node.addChild(t._tornadoEffect, -1);
          t._tornadoEffect.position = cc.v3(0, 0, 0);
          t.beWindUpAction();
        }
      }).catch(function (t) {
        console.log("error:", t);
      });
    }
  };
  _ctor.prototype.beWindUpAction = function () {
    var t = this;
    this.node.zIndex = this.node.y;
    cc.Tween.stopAllByTarget(this._root);
    cc.tween(this._root).to(.1, {
      position: cc.v3(0, this._tornadoEffect.height)
    }).call(function () {
      var e = cc.tween(t._root).by(.15, {
        position: cc.v3(0, 15),
        angle: -15
      }).by(.15, {
        position: cc.v3(0, -15),
        angle: 15
      }).by(.15, {
        position: cc.v3(0, 15),
        angle: 15
      }).by(.15, {
        position: cc.v3(0, -15),
        angle: -15
      });
      cc.tween(t._root).repeatForever(e).start();
    }).start();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mGridsLayout", undefined);
  cc__decorate([ccp_property({
    type: cc.Enum($10GameEnum.EquipmentFormIdx)
  })], _ctor.prototype, "mDataFormIdx", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mLvLab", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletPb", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mFireNode", undefined);
  cc__decorate([ccp_property()], _ctor.prototype, "mIsFixedPlant", undefined);
  cc__decorate([ccp_property()], _ctor.prototype, "mIsHybridPlant", undefined);
  cc__decorate([ccp_property({
    type: cc.Label,
    tooltip: "价格",
    visible: function () {
      return !this.mIsFixedPlant;
    }
  })], _ctor.prototype, "mPriceLab", undefined);
  cc__decorate([ccp_property({
    type: cc.Sprite,
    tooltip: "遮罩",
    visible: function () {
      return !this.mIsFixedPlant;
    }
  })], _ctor.prototype, "mTriggerBar", undefined);
  cc__decorate([ccp_property], _ctor.prototype, "mEquipId", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_EquipmentItem;