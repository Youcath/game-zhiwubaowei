var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__values = __values;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameUIManager = require("GameUIManager");
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
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10Util = require("Util");
var $10PDBulletFire = require("PDBulletFire");
var $10PDPlantItem = require("PDPlantItem");
var $10PDEnemy4001 = require("PDEnemy4001");
var $10PDEnemy4004 = require("PDEnemy4004");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDEnemyPathIce = require("PDEnemyPathIce");
var $10PDFaPaiView = require("PDFaPaiView");
var $10PDGameMgr = require("PDGameMgr");
var $10PDPlantsLayer2Ctl = require("PDPlantsLayer2Ctl");
var $10PDPlantsLayerCtl = require("PDPlantsLayerCtl");
var $10PDSuiJiIconAni = require("PDSuiJiIconAni");
var $10PDPlantBase = require("PDPlantBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDBottomLayerCtl = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.removeBtn = null;
    e.changzi = null;
    e.equipmentTip = null;
    e._propLayer = null;
    e._isDragging = false;
    e._previewNode = null;
    e._selectNode = null;
    e._dragPreview = null;
    e._dragType = 0;
    e._selectData = null;
    e._rangeIndicator = null;
    e._isClicking = false;
    e._isNoUseSummon = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onDestroy = function () {
    this.node.targetOff(this);
    $10EventManager.EventManager.instance.off($10PlantDefenseDataProxy.PDDataEvent.WOOD_UPDATE, this.onUpdateItemsState, this);
    $10EventManager.EventManager.instance.off($10PlantDefenseDataProxy.PDDataEvent.ADD_PLANT_CARD, this.onAddPlantCard, this);
  };
  _ctor.prototype.start = function () {
    this._propLayer = this.node.getChildByName("propLayer");
    this.initDragEvents();
  };
  _ctor.prototype.initPlants = function () {
    var t = $10PlantDefenseDataProxy.plantDefenseDataProxy.plantList.split("|");
    this._propLayer.children.forEach(function (t) {
      t.active = false;
    });
    for (var e = 0; e < t.length; e++) {
      var n = $10DataManager.DataManager.instance.eData.data_zombieplant[Number(t[e])];
      var o = this._propLayer.children[e];
      o || ((o = cc.instantiate(this._propLayer.children[0])).parent = this._propLayer);
      o.getComponent($10PDPlantItem.default).init(n);
      o.active = true;
    }
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameMode == $10PlantDefenseDataProxy.PDGameMode.PD_GAME) {
      cc.find("Canvas/Game/PlantsLayer").getComponent($10PDPlantsLayerCtl.default).initPlants(t);
    } else {
      cc.find("Canvas/Game/PlantsLayer2").getComponent($10PDPlantsLayer2Ctl.default).initPlants();
    }
  };
  _ctor.prototype.initDragEvents = function () {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    $10EventManager.EventManager.instance.on($10PlantDefenseDataProxy.PDDataEvent.WOOD_UPDATE, this.onUpdateItemsState, this);
    $10EventManager.EventManager.instance.on($10PlantDefenseDataProxy.PDDataEvent.ADD_PLANT_CARD, this.onAddPlantCard, this);
  };
  _ctor.prototype.onAddPlantCard = function (t) {
    var e = cc.instantiate(this._propLayer.children[0]);
    e.parent = this._propLayer;
    e.getComponent($10PDPlantItem.default).init(t, true);
    e.active = true;
    $10PlantDefenseDataProxy.plantDefenseDataProxy.oncePlantItem.push(e);
  };
  _ctor.prototype.onUpdateItemsState = function () {
    this._propLayer.children.forEach(function (t) {
      t.getComponent($10PDPlantItem.default).updateState();
    });
  };
  _ctor.prototype.getClickNode = function (t) {
    for (var e = 0; e < this._propLayer.children.length; e++) {
      var n = this._propLayer.children[e];
      if (n.active) {
        var o = n.getBoundingBoxToWorld();
        var i = this.node.convertToWorldSpaceAR(t);
        if (o.contains(cc.v2(i.x, i.y))) {
          var a = n.getComponent($10PDPlantItem.default);
          if (a && a.checkIsCanBuy()) {
            return n;
          }
        }
      }
    }
    return null;
  };
  _ctor.prototype.onTouchStart = function (t) {
    var e = this;
    t.stopPropagation();
    this._isClicking = false;
    var n = this.node.convertToNodeSpaceAR(t.getLocation());
    var o = this.getClickNode(n);
    if (o) {
      var i = o.getComponent($10PDPlantItem.default).itemData.sunshine;
      this._isNoUseSummon = o.getComponent($10PDPlantItem.default).isOnce;
      if (i > $10PlantDefenseDataProxy.plantDefenseDataProxy.curSunshine && !this._isNoUseSummon) {
        return void $10GameUIManager.gameUIMgr.showTips("阳光不够！");
      }
      this._selectNode = o;
      var a = o.getComponent($10PDPlantItem.default).itemData;
      if (22 == a.id) {
        return void (this._isClicking = true);
      }
      this._selectData = a;
      this._dragType = a.type2;
      if (21 == a.id) {
        this._dragType = 1;
        this._previewNode = cc.instantiate(o.getChildByName("icon"));
        this._previewNode.addComponent($10PDSuiJiIconAni.default).play(a.parm, function (t) {
          e._dragPreview && e._dragPreview.isValid && (e._dragPreview.getComponent(cc.Sprite).spriteFrame = t);
        });
      } else {
        this._previewNode = cc.instantiate(o.getChildByName("icon"));
      }
      this._previewNode.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.effectLayer;
      var r = $10PlantDefenseDataProxy.plantDefenseDataProxy.effectLayer.convertToNodeSpaceAR(t.getLocation());
      this._previewNode.setPosition(r);
      this._previewNode.opacity = 200;
      this._isDragging = true;
      if (1 == this._dragType) {
        this.createDragPreview();
      } else {
        this.createRangeIndicator(n);
      }
    } else if (this.removeBtn.getBoundingBox().contains(n)) {
      this._selectNode = this.removeBtn;
      this._previewNode = cc.instantiate(this._selectNode.getChildByName("icon"));
      this._previewNode.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.effectLayer;
      r = $10PlantDefenseDataProxy.plantDefenseDataProxy.effectLayer.convertToNodeSpaceAR(t.getLocation());
      this._previewNode.setPosition(r);
      this._previewNode.active = true;
      this._previewNode.opacity = 180;
      this._isDragging = true;
      this._dragType = 6;
    }
  };
  _ctor.prototype.createDragPreview = function () {
    if (this._selectNode) {
      this._dragPreview = cc.instantiate(this._selectNode.getChildByName("icon"));
      this._dragPreview.opacity = 100;
      this._dragPreview.scale = 1.2;
      this._dragPreview.parent = this.node.parent;
      this._dragPreview.active = false;
    }
  };
  _ctor.prototype.onTouchMove = function (t) {
    t.stopPropagation();
    if (this._isDragging) {
      var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.effectLayer.convertToNodeSpaceAR(t.getLocation());
      this._previewNode && this._previewNode.setPosition(e);
      if (1 == this._dragType) {
        this.updateTargetGridFeedback(e);
      } else if (6 == this._dragType) {
        this.updateTargetGridFeedback2(e);
      } else {
        this.createRangeIndicator(e);
      }
    }
  };
  _ctor.prototype.onTouchEnd = function (t) {
    var e = this;
    t.stopPropagation();
    this.changzi.active = false;
    this.removeRangeIndicator();
    this.cleanupDragState();
    if (this._previewNode) {
      this._previewNode.destroy();
      this._previewNode = null;
    }
    this.equipmentTip.active = false;
    if (this._isClicking) {
      var n = this.node.convertToNodeSpaceAR(t.getLocation());
      var o = this.getClickNode(n);
      if (o) {
        var i = o.getComponent($10PDPlantItem.default).itemData;
        if (22 == i.id) {
          if ($10PlantDefenseDataProxy.plantDefenseDataProxy.oncePlantItem.length >= 2) {
            return void $10GameUIManager.gameUIMgr.showTips("抽取达到上限！");
          }
          $10PlantDefenseDataProxy.plantDefenseDataProxy.addSunshine(-i.sunshine);
          $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState = $10GameEnum.GameState.PAUSE;
          $10ResUtil.ResUtil.loadAsset({
            path: "prefabs/ani/PDFaPaiView",
            type: cc.Prefab,
            bundleName: $10HomeEnum.Bundles.PlantDefense
          }).then(function (t) {
            var n = cc.instantiate(t);
            n.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.effectLayer;
            n.setPosition(cc.v3(0, 0, 0));
            var o = e._propLayer.children[e._propLayer.children.length - 1];
            var a = $10Util.default.nodeParentChangeLocalPos(o, $10PlantDefenseDataProxy.plantDefenseDataProxy.effectLayer);
            a.x += 100;
            n.getComponent($10PDFaPaiView.default).play(i.parm, a);
          }).catch(function (t) {
            console.log("error:", t);
            $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState = $10GameEnum.GameState.PLAYING;
          });
        }
      }
      this._isClicking = false;
    } else if (this._isDragging) {
      this._isDragging = false;
      var a;
      var r = this.node.parent.convertToNodeSpaceAR(t.getLocation());
      if (a = 1 == this._dragType ? this.getValidTargetGrid(r) : this.getValidTargetGrid2(r)) {
        if (1 == this._dragType) {
          this.deployDefender(a);
        } else if (6 == this._dragType) {
          this.removePlantAtGrid(a);
        } else {
          this.executeThrowableAttack(a);
        }
        var l = this._selectNode.getComponent($10PDPlantItem.default);
        if (l && l.isOnce) {
          var c = $10PlantDefenseDataProxy.plantDefenseDataProxy.oncePlantItem.indexOf(this._selectNode);
          $10PlantDefenseDataProxy.plantDefenseDataProxy.oncePlantItem.splice(c, 1);
          this._selectNode.destroy();
        }
      }
      this._selectNode = null;
    }
  };
  _ctor.prototype.removePlantAtGrid = function (t) {
    if (t && t.node) {
      $10ResUtil.ResUtil.loadAsset({
        path: "prefabs/ChanziAni",
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.PlantDefense
      }).then(function (e) {
        var n = cc.instantiate(e);
        n.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView;
        var o = t.node.position;
        o.x += 50;
        o.y += 25;
        n.setPosition(o);
        n.getComponent(cc.Animation).play();
        setTimeout(function () {
          $10AudioManager.AudioManager.instance.playEffectPath("sounds/click_01", $10HomeEnum.Bundles.PlantDefense);
          n.destroy();
          var e = t.node.getComponent($10PDPlantBase.default);
          if (e) {
            e.playDeath();
          } else {
            cc.error("目标节点不是有效的植物");
          }
        }, 1e3);
      }).catch(function (t) {
        console.log("error:", t);
      });
    } else {
      cc.log("目标位置没有植物可移除");
    }
  };
  _ctor.prototype.removeRangeIndicator = function () {
    if (this._rangeIndicator) {
      this._rangeIndicator.destroy();
      this._rangeIndicator = null;
    }
  };
  _ctor.prototype.getEnemiesInRange = function (t, e) {
    var n;
    var o;
    var i = [];
    var a = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers;
    var s = t.col + 1;
    try {
      var l = cc__values(a);
      for (var c = l.next(); !c.done; c = l.next()) {
        var p = c.value;
        if (p && p.isValid) {
          var u = p.getComponent($10PDEnemyBase.default);
          if (u && !u.getIsDie() && "PDEnemy4008" != u.name) {
            var d = u.pathIdx;
            var h = false;
            switch (e) {
              case 15:
              case 16:
                h = d === s && p.y < $10PlantDefenseDataProxy.PDPlantEnum.MAX_ATK_DISTANCE;
                break;
              case 17:
              case 18:
                var m = s;
                var f = Math.floor(1.5);
                var y = Math.max(0, m - f);
                var _ = Math.min($10PDGameMgr.default.Inst.cols - 1, m + f);
                h = d >= y && d <= _;
                break;
              case 19:
                h = true;
            }
            h && i.push(p);
          }
        }
      }
    } catch (v) {
      n = {
        error: v
      };
    } finally {
      try {
        c && !c.done && (o = l.return) && o.call(l);
      } finally {
        if (n) {
          throw n.error;
        }
      }
    }
    return i;
  };
  _ctor.prototype.isEnemyInColumnRange = function (t, e) {
    return t === e;
  };
  _ctor.prototype.isEnemyInMultiColumnRange = function (t, e, n) {
    var o = Math.floor(n / 2);
    var i = Math.max(0, e - o);
    var a = Math.min($10PDGameMgr.default.Inst.cols - 1, e + o);
    return t >= i && t <= a;
  };
  _ctor.prototype.executeThrowableAttack = function (t) {
    var e = this._selectData.id;
    switch (e) {
      case 15:
        this.executeMagneticRoseAttack(t, e);
        break;
      case 16:
        this.executeDevilChiliAttack(t, e);
        break;
      case 17:
        this.executeTomatoBombAttack(t, e);
        break;
      case 18:
        this.executeGrapeBombAttack(t, e);
        break;
      case 19:
        this.executeBambooAssassinAttack(t, e);
    }
    this._isNoUseSummon || this.consumeThrowableItem(e);
  };
  _ctor.prototype.executeMagneticRoseAttack = function (t, e) {
    var n = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/bullet/PDBulletPlantcl",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.PlantDefense
    }).then(function (o) {
      var i = cc.instantiate(o);
      i.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView;
      i.zIndex = 999;
      i.setPosition(t.x, t.y);
      setTimeout(function () {
        var o;
        var a;
        var s = n.getEnemiesInRange(t, n._selectData.id);
        var l = $10DataManager.DataManager.instance.eData.data_zombieplant[e];
        $10PlantDefenseDataProxy.plantDefenseDataProxy.plantNode15 = i;
        var c = l.atk;
        try {
          var p = cc__values(s);
          for (var u = p.next(); !u.done; u = p.next()) {
            var d = u.value;
            var h = {
              num: c,
              isCrit: false
            };
            d.getComponent($10PDEnemyBase.default).beAttack(h, e, false, true);
            "PDEnemy4004" == d.name && d.getComponent($10PDEnemy4004.default).playAttract();
          }
        } catch (m) {
          o = {
            error: m
          };
        } finally {
          try {
            u && !u.done && (a = p.return) && a.call(p);
          } finally {
            if (o) {
              throw o.error;
            }
          }
        }
        n.scheduleOnce(function () {
          var e;
          var o;
          var i = n.getEnemiesInRange(t, n._selectData.id);
          try {
            var a = cc__values(i);
            for (var s = a.next(); !s.done; s = a.next()) {
              var l = s.value;
              "PDEnemy4004" == l.name && l.getComponent($10PDEnemy4004.default).playAttract();
            }
          } catch (c) {
            e = {
              error: c
            };
          } finally {
            try {
              s && !s.done && (o = a.return) && o.call(a);
            } finally {
              if (e) {
                throw e.error;
              }
            }
          }
        }, 1.5);
        setTimeout(function () {
          i.destroy();
          $10PlantDefenseDataProxy.plantDefenseDataProxy.plantNode15 = null;
        }, 4e3);
      }, 200);
    }).catch(function (t) {
      console.error("磁力玫瑰攻击效果:", t);
    });
  };
  _ctor.prototype.executeDevilChiliAttack = function (t, e) {
    var n = this;
    var o = $10DataManager.DataManager.instance.eData.data_zombieplant[e];
    var i = o.parm.split("|");
    if (i.length < 2) {
      cc.error("魔鬼辣椒参数配置不完整");
    } else {
      var a = Number(i[0]);
      var s = Number(i[1]);
      var l = o.atk;
      if (isNaN(a) || isNaN(s) || a <= 0) {
        cc.error("魔鬼辣椒参数配置无效");
      } else {
        $10ResUtil.ResUtil.loadAsset({
          path: "prefabs/bullet/PDSuperBulletPlant102",
          type: cc.Prefab,
          bundleName: $10HomeEnum.Bundles.PlantDefense
        }).then(function (o) {
          var i = cc.instantiate(o);
          i.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView;
          i.setPosition(t.x, t.y);
          i.zIndex = 999;
          var c = i.getChildByName("spine").getComponent(sp.Skeleton);
          c.setCompleteListener(function () {
            i.destroy();
            i.removeFromParent();
          });
          c.setAnimation(0, "bomb", false);
          setTimeout(function () {
            $10ResUtil.ResUtil.loadAsset({
              path: "prefabs/bullet/PDBulletFire2",
              type: cc.Prefab,
              bundleName: $10HomeEnum.Bundles.PlantDefense
            }).then(function (o) {
              var i = cc.instantiate(o);
              i.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.mapLayer;
              i.setPosition(t.x, 0);
              i.getComponent($10PDBulletFire.default).initBulletFire(1, 1, a, 50);
              var c = 0;
              var p = function () {
                var o;
                var u;
                $10PlantDefenseDataProxy.plantDefenseDataProxy.enemyPathIce.forEach(function (e) {
                  var n;
                  e && e.isValid && t.col + 1 == e.getComponent($10PDEnemyPathIce.default).pathIdx && (null === (n = e.getComponent($10PDEnemyPathIce.default)) || undefined === n || n.playIceSp());
                });
                var d = n.getEnemiesInRange(t, e);
                try {
                  var h = cc__values(d);
                  for (var m = h.next(); !m.done; m = h.next()) {
                    var f = m.value;
                    if (f && f.isValid) {
                      var y = {
                        num: l * s,
                        isCrit: false
                      };
                      var _ = f.getComponent($10PDEnemyBase.default);
                      _ && _.beAttack(y, e, true, true);
                    }
                  }
                } catch (v) {
                  o = {
                    error: v
                  };
                } finally {
                  try {
                    m && !m.done && (u = h.return) && u.call(h);
                  } finally {
                    if (o) {
                      throw o.error;
                    }
                  }
                }
                if (++c >= a) {
                  n.unschedule(p);
                  i.destroy();
                }
              };
              p();
              n.schedule(p, 1, a - 1);
            }).catch(function (t) {
              console.error("加载魔鬼辣椒特效失败:", t);
            });
          }, 800);
        }).catch(function (t) {
          console.error("番茄炸弹攻击效果失败:", t);
        });
      }
    }
  };
  _ctor.prototype.executeTomatoBombAttack = function (t, e) {
    var n = this;
    var o = $10DataManager.DataManager.instance.eData.data_zombieplant[e];
    var i = Number(o.parm);
    var a = o.atk;
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/bullet/PDBulletPlant2",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.PlantDefense
    }).then(function (e) {
      var o = cc.instantiate(e);
      o.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView;
      o.setPosition(t.x, t.y);
      o.zIndex = 999;
      var r = o.getChildByName("spine").getComponent(sp.Skeleton);
      r.setCompleteListener(function () {
        o.destroy();
        o.removeFromParent();
      });
      r.setAnimation(0, "bomb1", false);
      setTimeout(function () {
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/plant12", $10HomeEnum.Bundles.RES);
        r.setCompleteListener(null);
        var t = o.getChildByName("Collider").getComponent($10SimplyCircleCollider.default);
        var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
        for (var s = 0; s < e.length; ++s) {
          var c = e[s];
          if (t && c && c.isValid && "PDEnemy4008" != c.name) {
            var p = c.getChildByName("collision").getComponent($10SimplyRectCollider.default);
            if (p && $10SimplyCollisionDetector.default.isCollisionRectToCircle(p.rect, t.circle)) {
              if ("PDEnemy4007" == c.name) {
                c.getComponent($10PDEnemyBase.default).playAtk();
                continue;
              }
              var u = {
                num: a * i,
                isCrit: false
              };
              c.getComponent($10PDEnemyBase.default).beAttack(u, n._selectData.id, true, true);
            }
          }
        }
      }, 1600);
    }).catch(function (t) {
      console.error("番茄炸弹攻击效果失败:", t);
    });
  };
  _ctor.prototype.executeGrapeBombAttack = function (t, e) {
    var n = this;
    var o = $10DataManager.DataManager.instance.eData.data_zombieplant[e];
    var i = Number(o.parm);
    var a = o.atk;
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/bullet/PDSuperBulletPlant2",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.PlantDefense
    }).then(function (e) {
      var o = cc.instantiate(e);
      o.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView;
      o.setPosition(t.x, t.y);
      o.zIndex = 999;
      var r = o.getChildByName("spine").getComponent(sp.Skeleton);
      r.setCompleteListener(function () {
        o.destroy();
        o.removeFromParent();
      });
      r.setAnimation(0, "bomb1", false);
      setTimeout(function () {
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/plant12", $10HomeEnum.Bundles.SmashTheJar);
        r.setCompleteListener(null);
        var t = o.getChildByName("Collider").getComponent($10SimplyCircleCollider.default);
        var e = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.slice();
        for (var s = 0; s < e.length; ++s) {
          var c = e[s];
          if (t && c && c.isValid && "PDEnemy4008" != c.name) {
            var p = c.getChildByName("collision").getComponent($10SimplyRectCollider.default);
            if (p && $10SimplyCollisionDetector.default.isCollisionRectToCircle(p.rect, t.circle)) {
              var u = {
                num: a * i,
                isCrit: false
              };
              c.getComponent($10PDEnemyBase.default).beAttack(u, n._selectData.id, true, true);
              if ("PDEnemy4002" == c.name) {
                c.getComponent("PDEnemy4002").cannelHide();
                c.getComponent("PDEnemy4002").playShow();
              }
            }
          }
        }
      }, 1600);
    }).catch(function (t) {
      console.error("葡萄爆弹攻击效果失败:", t);
    });
  };
  _ctor.prototype.executeBambooAssassinAttack = function (t, e) {
    var n = this;
    var o = $10DataManager.DataManager.instance.eData.data_zombieplant[e];
    var i = o.parm.split("|");
    if (i.length < 2) {
      cc.error("参数配置不完整");
    } else {
      var a = Number(i[0]);
      var s = Number(i[1]);
      var l = o.atk;
      if (isNaN(a) || isNaN(s) || a <= 0) {
        cc.error("参数配置无效");
      } else {
        $10ResUtil.ResUtil.loadAsset({
          path: "prefabs/bullet/PDSuperBullet6",
          type: cc.Prefab,
          bundleName: $10HomeEnum.Bundles.PlantDefense
        }).then(function (o) {
          var i = cc.instantiate(o);
          i.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.mapLayer;
          i.setPosition(0, 0);
          var c = 0;
          var p = function () {
            var o;
            var u;
            var d = n.getEnemiesInRange(t, e).filter(function (t) {
              return t.y < $10PlantDefenseDataProxy.PDPlantEnum.MAX_ATK_DISTANCE;
            });
            try {
              var h = cc__values(d);
              for (var m = h.next(); !m.done; m = h.next()) {
                var f = m.value;
                if (f && f.isValid) {
                  var y = {
                    num: l * s,
                    isCrit: false
                  };
                  var _ = f.getComponent($10PDEnemyBase.default);
                  if (_) {
                    _.beAttack(y, e, false, true);
                    "PDEnemy4001" == f.name && f.getComponent($10PDEnemy4001.default).beResist();
                  }
                }
              }
            } catch (v) {
              o = {
                error: v
              };
            } finally {
              try {
                m && !m.done && (u = h.return) && u.call(h);
              } finally {
                if (o) {
                  throw o.error;
                }
              }
            }
            if (++c >= a) {
              n.unschedule(p);
              i.destroy();
            }
          };
          p();
          n.schedule(p, 1, a - 1);
        }).catch(function (t) {
          console.error("加载特效失败:", t);
        });
      }
    }
  };
  _ctor.prototype.consumeThrowableItem = function (t) {
    var e = $10DataManager.DataManager.instance.eData.data_zombieplant[t];
    $10PlantDefenseDataProxy.plantDefenseDataProxy.addSunshine(-e.sunshine);
  };
  _ctor.prototype.getValidTargetGrid = function (t) {
    var e = $10PDGameMgr.default.Inst.getExactGridByPosition(t.x, t.y);
    if (e && !e.node) {
      return e;
    } else {
      return null;
    }
  };
  _ctor.prototype.getValidTargetGrid2 = function (t) {
    return $10PDGameMgr.default.Inst.getExactGridByPosition(t.x, t.y);
  };
  _ctor.prototype.deployDefender = function (t) {
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/placePlant", $10HomeEnum.Bundles.RES);
    var e = this._selectNode.getComponent($10PDPlantItem.default).itemData;
    $10PlantDefenseDataProxy.plantDefenseDataProxy.addSunshine(-e.sunshine);
    if (21 == e.id) {
      var n = e.parm.split("|");
      var o = [];
      for (var i = 0; i < n.length; i++) {
        var a = n[i].split("_");
        o.push({
          id: Number(a[0]),
          weights: Number(a[1])
        });
      }
      var r = o.map(function (t) {
        return t.weights;
      });
      var s = $10MathUtil.MathUtil.weightedRandom(r);
      e = $10DataManager.DataManager.instance.eData.data_zombieplant[o[s].id];
    }
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.PlantDefense,
      path: "prefabs/plants/PDPlant_" + e.id,
      type: cc.Prefab
    }).then(function (n) {
      var o = cc.instantiate(n);
      o.group = "game";
      o.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView;
      o.setPosition(t.x, t.y);
      if (20 != e.id && 14 != e.id) {
        $10PlantDefenseDataProxy.plantDefenseDataProxy.idPlants[e.id] || ($10PlantDefenseDataProxy.plantDefenseDataProxy.idPlants[e.id] = 0);
        $10PlantDefenseDataProxy.plantDefenseDataProxy.idPlants[e.id] += 1;
      }
      o.getComponent($10PDPlantBase.default).initBaseInfo(e, t);
      $10PlantDefenseDataProxy.plantDefenseDataProxy.soldiers.push(o);
      o.zIndex = -o.y;
      t.node = o;
      o.scale = 0;
      cc.tween(o).to(.3, {
        scale: 1
      }, {
        easing: "backOut"
      }).start();
    });
  };
  _ctor.prototype.updateTargetGridFeedback = function (t) {
    var e = $10PDGameMgr.default.Inst.getExactGridByPosition(t.x, t.y);
    $10PDGameMgr.default.Inst.clearGridHighlight();
    if (e && !e.node) {
      if (this._dragPreview) {
        this._dragPreview.setPosition(e.x, e.y), this._dragPreview.active = true;
      }
    } else {
      this._dragPreview && (this._dragPreview.active = false);
      e && e.node && $10PDGameMgr.default.Inst.highlightGrid(e, cc.Color.RED);
    }
  };
  _ctor.prototype.updateTargetGridFeedback2 = function (t) {
    var e = $10PDGameMgr.default.Inst.getExactGridByPosition(t.x, t.y);
    $10PDGameMgr.default.Inst.clearGridHighlight();
    if (e && e.node) {
      $10PDGameMgr.default.Inst.highlightGrid(e, cc.Color.GREEN);
    } else {
      e && $10PDGameMgr.default.Inst.highlightGrid(e, cc.Color.RED);
    }
  };
  _ctor.prototype.cleanupDragState = function () {
    if (this._dragPreview) {
      this._dragPreview.destroy();
      this._dragPreview = null;
    }
    $10PDGameMgr.default.Inst.clearGridHighlight();
  };
  _ctor.prototype.createRangeIndicator = function (t) {
    this._rangeIndicator && this._rangeIndicator.destroy();
    this._rangeIndicator = new cc.Node("RangeIndicator");
    this._rangeIndicator.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.effectLayer;
    var e = this._rangeIndicator.addComponent(cc.Graphics);
    e.lineWidth = 3;
    e.strokeColor = cc.Color.GREEN;
    e.fillColor = new cc.Color(255, 255, 0, 50);
    var n = $10PDGameMgr.default.Inst.getExactGridByPosition(t.x, t.y);
    if (n) {
      switch (this._selectData.id) {
        case 15:
        case 16:
          this.drawColumnRange(e, n);
          break;
        case 17:
        case 18:
          this.drawMultiColumnRange(e, n, 3);
          break;
        case 19:
          this.drawFullScreenRange(e);
      }
      this._rangeIndicator.setPosition(0, 0);
      this._selectData && this.showeEuipmentTip(this._selectData);
    } else {
      this._rangeIndicator.setPosition(t);
    }
  };
  _ctor.prototype.showeEuipmentTip = function (t) {
    this.equipmentTip.getChildByName("desc").getComponent(cc.Label).string = t.des;
    this.equipmentTip.active = true;
  };
  _ctor.prototype.drawFullScreenRange = function (t) {
    var e = -($10PDGameMgr.default.Inst.cols - 1) * $10PDGameMgr.default.Inst.gridWidth / 2 - $10PDGameMgr.default.Inst.gridWidth / 2;
    var n = cc.winSize.height / 2 - 280;
    var o = ($10PDGameMgr.default.Inst.rows - 1) * $10PDGameMgr.default.Inst.gridHeight / 2 + 20 + $10PDGameMgr.default.Inst.gridHeight / 2 - $10PDGameMgr.default.Inst.rows * $10PDGameMgr.default.Inst.gridHeight;
    var i = $10PDGameMgr.default.Inst.cols * $10PDGameMgr.default.Inst.gridWidth;
    var a = n - o;
    t.rect(e, o, i, a);
    t.fill();
    t.stroke();
  };
  _ctor.prototype.drawMultiColumnRange = function (t, e) {
    var n = e.x;
    var o = e.y;
    t.circle(n, o, 300);
    t.fill();
    t.stroke();
  };
  _ctor.prototype.drawColumnRange = function (t, e) {
    var n = e.x;
    var o = $10PDGameMgr.default.Inst.gridWidth;
    var i = ($10PDGameMgr.default.Inst.rows - 1) * $10PDGameMgr.default.Inst.gridHeight / 2 + 20 - ($10PDGameMgr.default.Inst.rows - 1) * $10PDGameMgr.default.Inst.gridHeight - $10PDGameMgr.default.Inst.gridHeight / 2;
    var a = cc.winSize.height / 2 - 280 - i;
    t.rect(n - o / 2, i, o, a);
    t.fill();
    t.stroke();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "removeBtn", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "changzi", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "equipmentTip", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDBottomLayerCtl;