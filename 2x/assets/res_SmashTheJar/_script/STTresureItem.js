var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameUIManager = require("GameUIManager");
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10STJDataProxy = require("STJDataProxy");
var $10Util = require("Util");
var $10STBattleView = require("STBattleView");
var $10STJarBox = require("STJarBox");
var $10STMonster = require("STMonster");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_STTresureItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.label = null;
    e.iconImg = null;
    e.cdMask = null;
    e._itemData = null;
    e._isDragging = false;
    e._previewNode = null;
    e._rangeIndicator = null;
    e._cdTimer = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    var e = this;
    this._itemData = t;
    this.label.string = t.wood;
    this.node.getChildByName("name").getComponent(cc.Label).string = t.name;
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.SmashTheJar,
      path: "textrues/ui/icon_" + t.id,
      type: cc.SpriteFrame
    }).then(function (t) {
      e.iconImg.spriteFrame = t;
    });
    this.cdMask.active = false;
    this.initDragEvents();
    this.checkDragCondition();
  };
  _ctor.prototype.checkDragCondition = function () {
    if (this._itemData) {
      if (this._itemData.wood > $10STJDataProxy.sTJDataProxy.curWood) {
        this.node.children.forEach(function (t) {
          var e = t.getComponent(cc.Sprite);
          e && $10Util.default.setSpriteGrayMaterial(e);
        });
      } else {
        this.node.children.forEach(function (t) {
          var e = t.getComponent(cc.Sprite);
          e && $10Util.default.setSpriteNormalMaterial(e);
        });
      }
    }
  };
  _ctor.prototype.initDragEvents = function () {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  };
  _ctor.prototype.onTouchStart = function (t) {
    t.stopPropagation();
    if (this._cdTimer > 0) {
      $10GameUIManager.gameUIMgr.showTips("冷却中...");
    } else if (this._itemData.wood > $10STJDataProxy.sTJDataProxy.curWood) {
      $10GameUIManager.gameUIMgr.showTips("阳光不够！");
    } else {
      this._previewNode = cc.instantiate(this.iconImg.node);
      this._previewNode.parent = $10STJDataProxy.sTJDataProxy.effectLayer;
      var e = $10STJDataProxy.sTJDataProxy.effectLayer.convertToNodeSpaceAR(t.getLocation());
      this._previewNode.setPosition(e);
      this._previewNode.opacity = 200;
      this._isDragging = true;
      this.createRangeIndicator(e);
    }
  };
  _ctor.prototype.onTouchMove = function (t) {
    t.stopPropagation();
    if (this._isDragging) {
      var e = $10STJDataProxy.sTJDataProxy.effectLayer.convertToNodeSpaceAR(t.getLocation());
      this._previewNode.setPosition(e);
      this.updateRangeIndicator(e);
    }
  };
  _ctor.prototype.onTouchEnd = function (t) {
    t.stopPropagation();
    if (this._isDragging) {
      var e = $10STJDataProxy.sTJDataProxy.effectLayer.convertToNodeSpaceAR(t.getLocation());
      this.useTreasure(e);
      this._previewNode.destroy();
      this._previewNode = null;
      this.addSTIceEffect(e);
      this.clearRangeIndicator();
      this._isDragging = false;
    }
  };
  _ctor.prototype.addSTIceEffect = function (t) {
    2 == this._itemData.id && $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.SmashTheJar,
      path: "prefabs/STIceEffect",
      type: cc.Prefab
    }).then(function (e) {
      var o = cc.instantiate(e);
      $10STJDataProxy.sTJDataProxy.effectLayer.addChild(o);
      o.position = t;
    });
  };
  _ctor.prototype.addSTThunderEffect = function (t) {
    3 == this._itemData.id && $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.SmashTheJar,
      path: "prefabs/STThunderEffect",
      type: cc.Prefab
    }).then(function (e) {
      var o = cc.instantiate(e);
      $10STJDataProxy.sTJDataProxy.effectLayer.addChild(o);
      o.position = t;
    });
  };
  _ctor.prototype.update = function (t) {
    if ($10STJDataProxy.sTJDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._cdTimer > 0) {
      this._cdTimer -= t;
      this.cdMask.getComponent(cc.Sprite).fillRange = -this._cdTimer / this._itemData.cd;
      if (this._cdTimer < 1) {
        this.unscheduleAllCallbacks(), this._cdTimer = 0, this.cdMask.active = false;
      }
    }
  };
  _ctor.prototype.enterSkillCD = function () {
    this.cdMask.active = true;
    this._cdTimer = this._itemData.cd;
  };
  _ctor.prototype.createRangeIndicator = function (t) {
    this._rangeIndicator && this._rangeIndicator.destroy();
    this._rangeIndicator = new cc.Node("RangeIndicator");
    this._rangeIndicator.parent = $10STJDataProxy.sTJDataProxy.effectLayer;
    var e = this._rangeIndicator.addComponent(cc.Graphics);
    e.lineWidth = 3;
    e.strokeColor = cc.Color.GREEN;
    e.fillColor = new cc.Color(255, 255, 0, 50);
    switch (this._itemData.id) {
      case 1:
        this.drawRowRange(e, t);
        break;
      case 3:
        this.drawSingleTargetRange(e);
        break;
      case 4:
        this.drawCircleRange(e, 200);
    }
    this._rangeIndicator.setPosition(t);
  };
  _ctor.prototype.updateRangeIndicator = function (t) {
    if (this._rangeIndicator) {
      var e = this._rangeIndicator.getComponent(cc.Graphics);
      e.clear();
      switch (this._itemData.id) {
        case 1:
          this.drawRowRange(e, t);
          break;
        case 3:
          this.drawSingleTargetRange(e);
          break;
        case 4:
          this.drawCircleRange(e, 200);
      }
      this._rangeIndicator.setPosition(t);
    }
  };
  _ctor.prototype.drawRowRange = function (t, e) {
    var o = $10STJDataProxy.sTJDataProxy.battleView.getComponent($10STBattleView.default);
    if (o) {
      var i = this.worldToGrid(e, o);
      if (!(i.row < 0 || i.row >= o.rows)) {
        var n = -(o.cols - 1) * o.gridWidth / 2 - o.gridWidth / 2;
        var a = (o.cols - 1) * o.gridWidth / 2 + o.gridWidth / 2;
        var r = (o.rows - 1) * o.gridHeight / 2 - 180 - i.row * o.gridHeight;
        var s = n - e.x;
        var c = a - e.x;
        var l = r - e.y;
        t.rect(s, l - o.gridHeight / 2, c - s, o.gridHeight);
        t.fill();
        t.stroke();
      }
    }
  };
  _ctor.prototype.drawSingleTargetRange = function (t) {
    t.circle(0, 0, 50);
    t.fill();
    t.stroke();
  };
  _ctor.prototype.drawCircleRange = function (t, e) {
    t.circle(0, 0, e);
    t.fill();
    t.stroke();
  };
  _ctor.prototype.clearRangeIndicator = function () {
    if (this._rangeIndicator) {
      this._rangeIndicator.destroy();
      this._rangeIndicator = null;
    }
  };
  _ctor.prototype.useTreasure = function (t) {
    console.log("使用道具 " + this._itemData.id + " 在位置:", t);
    var e = $10STJDataProxy.sTJDataProxy.battleView.getComponent($10STBattleView.default);
    if (e) {
      var o = false;
      switch (this._itemData.id) {
        case 1:
          $10AudioManager.AudioManager.instance.playEffectPath("sounds/mirror", $10HomeEnum.Bundles.SmashTheJar);
          o = this.revealJarsInRow(t, e);
          break;
        case 2:
          $10AudioManager.AudioManager.instance.playEffectPath("sounds/Bell", $10HomeEnum.Bundles.SmashTheJar);
          o = this.freezeAllMonsters(3);
          break;
        case 3:
          $10AudioManager.AudioManager.instance.playEffectPath("sounds/Spell", $10HomeEnum.Bundles.SmashTheJar);
          o = this.freezeSingleMonster(t, e, 10);
          break;
        case 4:
          $10AudioManager.AudioManager.instance.playEffectPath("sounds/thorn", $10HomeEnum.Bundles.SmashTheJar);
          o = this.slowMonstersInArea(t, e, 200, .5, 5);
      }
      o && this.enterSkillCD();
    } else {
      console.error("无法获取战斗视图组件");
    }
  };
  _ctor.prototype.revealJarsInRow = function (t, e) {
    var o = this;
    var i = this.worldToGrid(t, e);
    if (i.row < 0 || i.row > 6) {
      return $10GameUIManager.gameUIMgr.showTips("无效位置！"), false;
    } else {
      return $10STJDataProxy.sTJDataProxy.curWood -= this._itemData.wood, $10EventManager.EventManager.instance.emit($10STJDataProxy.STJDataEvent.WOOD_UPDATE), e.grids.filter(function (t) {
        return t.row === i.row;
      }).forEach(function (t) {
        $10STJDataProxy.sTJDataProxy.isJarIntact(t.id) && t.node && o.addRevealEffect(t.node);
      }), $10GameUIManager.gameUIMgr.showTips("透视效果已激活！"), true;
    }
  };
  _ctor.prototype.freezeAllMonsters = function (t) {
    var e = this;
    $10STJDataProxy.sTJDataProxy.curWood -= this._itemData.wood;
    $10EventManager.EventManager.instance.emit($10STJDataProxy.STJDataEvent.WOOD_UPDATE);
    $10STJDataProxy.sTJDataProxy.enemySoldiers.forEach(function (o) {
      if (o && o.isValid) {
        var i = o.getComponent($10STMonster.default);
        i && i.amimState !== $10GameEnum.RoleState.Dead && e.freezeMonster(i, t);
      }
    });
    $10GameUIManager.gameUIMgr.showTips("所有怪物被冰冻" + t + "秒！");
    return true;
  };
  _ctor.prototype.freezeSingleMonster = function (t, e, o) {
    var i = null;
    var n = 100;
    $10STJDataProxy.sTJDataProxy.enemySoldiers.forEach(function (e) {
      if (e && e.isValid) {
        var o = cc.Vec2.distance(t, new cc.Vec2(e.position.x, e.position.y));
        if (o < n) {
          n = o;
          i = e.getComponent("STMonster");
        }
      }
    });
    if (i && i.amimState !== $10GameEnum.RoleState.Dead) {
      return $10STJDataProxy.sTJDataProxy.curWood -= this._itemData.wood, $10EventManager.EventManager.instance.emit($10STJDataProxy.STJDataEvent.WOOD_UPDATE), this.freezeMonster(i, o), this.addSTThunderEffect(i.node.position.clone()), true;
    } else {
      return $10GameUIManager.gameUIMgr.showTips("附近没有可冰冻的怪物！"), false;
    }
  };
  _ctor.prototype.slowMonstersInArea = function (t, e, o, i, n) {
    var a = this;
    var s = [];
    $10STJDataProxy.sTJDataProxy.enemySoldiers.forEach(function (e) {
      if (e && e.isValid && cc.Vec2.distance(t, new cc.Vec2(e.position.x, e.position.y)) <= o) {
        var r = e.getComponent($10STMonster.default);
        if (r && r.amimState !== $10GameEnum.RoleState.Dead) {
          s.push(r);
          a.slowMonster(r, i, n);
        }
      }
    });
    if (s.length > 0) {
      return $10GameUIManager.gameUIMgr.showTips(s.length + "个怪物被减速！"), $10STJDataProxy.sTJDataProxy.curWood -= this._itemData.wood, $10EventManager.EventManager.instance.emit($10STJDataProxy.STJDataEvent.WOOD_UPDATE), this.showAreaEffect(t, n), true;
    } else {
      return $10GameUIManager.gameUIMgr.showTips("范围内没有怪物！"), false;
    }
  };
  _ctor.prototype.showTips = function () {
    $10GameUIManager.gameUIMgr.showTips(this._itemData.des);
  };
  _ctor.prototype.freezeMonster = function (t, e) {
    t.stopMoveBuff(e, 0);
  };
  _ctor.prototype.slowMonster = function (t, e, o) {
    t.stopMoveBuff(o, e);
  };
  _ctor.prototype.worldToGrid = function (t, e) {
    var o = -(e.cols - 1) * e.gridWidth / 2;
    var i = (e.rows - 1) * e.gridHeight / 2 - 180;
    var n = Math.round((t.x - o) / e.gridWidth);
    return {
      row: Math.round((i - t.y) / e.gridHeight),
      col: n
    };
  };
  _ctor.prototype.addRevealEffect = function (t) {
    t.getComponent($10STJarBox.default).showLight();
  };
  _ctor.prototype.showAreaEffect = function (t, e) {
    var o = null;
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.SmashTheJar,
      path: "prefabs/STTrap",
      type: cc.Prefab
    }).then(function (e) {
      (o = cc.instantiate(e)).parent = $10STJDataProxy.sTJDataProxy.gridLayer;
      o.setPosition(t);
    });
    this.scheduleOnce(function () {
      if (o) {
        o.destroy();
        o.removeFromParent();
      }
    }, e);
  };
  _ctor.prototype.onDestroy = function () {
    this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    this.clearRangeIndicator();
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "label", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "iconImg", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "cdMask", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_STTresureItem;