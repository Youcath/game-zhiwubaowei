var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__values = __values;
var cc__read = __read;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameUIManager = require("GameUIManager");
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10PopupManager = require("PopupManager");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10STJDataProxy = require("STJDataProxy");
var $10STRoleBase = require("STRoleBase");
var $10STCardItem = require("STCardItem");
var $10STJarBox = require("STJarBox");
var $10STMonster = require("STMonster");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_STBattleView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.jarNode = null;
    e.monsterFab = null;
    e.suipianNode = null;
    e.cuizi = null;
    e.cardItem = null;
    e.grids = [];
    e.rows = 10;
    e.cols = 5;
    e.gridWidth = 150;
    e.gridHeight = 120;
    e.selectNode = null;
    e.creatorMonster = [];
    e.gridHighlights = new Map();
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if ($10STJDataProxy.sTJDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      for (var e in $10BattleDataProxy.battleDataProxy.audioFilterInfo) {
        $10BattleDataProxy.battleDataProxy.audioFilterInfo[e].time -= t;
      }
    }
  };
  _ctor.prototype.checkGameEnd = function () {
    this.areAllJarsBroken() && this.areAllMonstersDefeated() && this.onGameWin();
  };
  _ctor.prototype.areAllMonstersDefeated = function () {
    $10STJDataProxy.sTJDataProxy.enemySoldiers = $10STJDataProxy.sTJDataProxy.enemySoldiers.filter(function (t) {
      return t && t.isValid;
    });
    return 0 === $10STJDataProxy.sTJDataProxy.enemySoldiers.length;
  };
  _ctor.prototype.areAllJarsBroken = function () {
    for (var t = 0; t < this.grids.length; t++) {
      var e = this.grids[t];
      if (e && $10STJDataProxy.sTJDataProxy.isJarIntact(e.id)) {
        return false;
      }
    }
    return true;
  };
  _ctor.prototype.hasMonsterReachedBottom = function () {
    var t = -cc.winSize.height / 2 - 100;
    for (var e = 0; e < $10STJDataProxy.sTJDataProxy.enemySoldiers.length; e++) {
      var o = $10STJDataProxy.sTJDataProxy.enemySoldiers[e];
      if (o && o.isValid && o.y <= t) {
        return true;
      }
    }
    return false;
  };
  _ctor.prototype.onGameWin = function () {
    if ($10STJDataProxy.sTJDataProxy.gameState === $10GameEnum.GameState.PLAYING) {
      $10STJDataProxy.sTJDataProxy.gameState = $10GameEnum.GameState.OVER;
      this.scheduleOnce(function () {
        $10PopupManager.PopupManager.instance.show({
          bundleName: $10HomeEnum.Bundles.SmashTheJar,
          path: "prefabs/popups/STWinPopup",
          keep: true
        });
      }, .5);
    }
  };
  _ctor.prototype.onLoad = function () {
    $10STJDataProxy.sTJDataProxy.resetData();
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10STJDataProxy.STJDataEvent.CHECK_GAME_END, this.checkGameEnd, this);
  };
  _ctor.prototype.start = function () {
    $10STJDataProxy.sTJDataProxy.effectLayer = this.node.parent.getChildByName("EffectLayer");
    $10STJDataProxy.sTJDataProxy.bulletLayer = this.node.parent.getChildByName("BulletLayer");
    $10STJDataProxy.sTJDataProxy.gridLayer = cc.find("Canvas/mapView/GridLayer");
    $10STJDataProxy.sTJDataProxy.battleView = this.node;
    this.initGrid();
    this.initTouchEvents();
    this.scheduleOnce(function () {
      $10STJDataProxy.sTJDataProxy.gameState = $10GameEnum.GameState.PLAYING;
    }, 1);
  };
  _ctor.prototype.onEnable = function () {
    this.node.targetOff(this);
  };
  _ctor.prototype.initTouchEvents = function () {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    $10EventManager.EventManager.instance.on($10STJDataProxy.STJDataEvent.CHECK_GAME_END, this.checkGameEnd, this);
  };
  _ctor.prototype.onTouchStart = function () {};
  _ctor.prototype.onTouchMove = function (t) {
    var e = this.node.convertToNodeSpaceAR(t.getLocation());
    var o = this.getExactGridByPosition(e.x, e.y);
    if (o && o.node && $10STJDataProxy.sTJDataProxy.isJarIntact(o.id)) {
      if (this.selectNode && this.selectNode.uuid == o.node.uuid) {
        return;
      }
      this.addTouchFeedback(o.node);
    } else {
      this.selectNode && this.removeTouchFeedback(this.selectNode);
    }
  };
  _ctor.prototype.onTouchEnd = function (t) {
    var e = this.node.convertToNodeSpaceAR(t.getLocation());
    var o = this.getExactGridByPosition(e.x, e.y);
    o && o.node && $10STJDataProxy.sTJDataProxy.isJarIntact(o.id) && this.smashJar(o);
    if (this.selectNode) {
      this.removeTouchFeedback(this.selectNode);
      this.selectNode = null;
    }
  };
  _ctor.prototype.addTouchFeedback = function (t) {
    if (t && t.isValid) {
      this.selectNode && this.removeTouchFeedback(this.selectNode);
      this.selectNode = t;
      t.getChildByName("liangguanzi").active = true;
      t.getChildByName("guanzi").active = false;
    }
  };
  _ctor.prototype.removeTouchFeedback = function (t) {
    if (t && t.isValid) {
      t.getChildByName("liangguanzi").active = false;
      t.getChildByName("guanzi").active = true;
    }
  };
  _ctor.prototype.smashJar = function (t, e) {
    undefined === e && (e = true);
    if ($10STJDataProxy.sTJDataProxy.isJarIntact(t.id)) {
      if (e) {
        this.createCuiziEffect(t);
      } else {
        this.createCuiziRole(t), this.createSuipian(t), t.node && (t.node.destroy(), t.node = null);
      }
      $10STJDataProxy.sTJDataProxy.jarStates.set(t.id, "broken");
      this.playSmashAnimation(t);
    }
  };
  _ctor.prototype.createSuipian = function (t) {
    var e = cc.instantiate(this.suipianNode);
    e.parent = $10STJDataProxy.sTJDataProxy.gridLayer;
    e.setPosition(cc.v3(t.x, t.y - 33, 0));
    e.active = true;
    e.getComponent(sp.Skeleton).setCompleteListener(function () {
      e.destroy();
      e.removeFromParent();
    });
    e.getComponent(sp.Skeleton).setAnimation(0, "broken", false);
  };
  _ctor.prototype.playSmashAnimation = function (t) {
    var e = t.node;
    if (e) {
      var o = cc.sequence(cc.moveBy(.05, cc.v2(5, 0)), cc.moveBy(.05, cc.v2(-10, 0)), cc.moveBy(.05, cc.v2(5, 0)));
      e.runAction(o);
    }
  };
  _ctor.prototype.createCuiziEffect = function (t) {
    var e = this;
    if (this.cuizi) {
      var o = cc.instantiate(this.cuizi);
      o.parent = $10STJDataProxy.sTJDataProxy.effectLayer;
      o.active = true;
      o.setPosition(t.x + 50, t.y + 50);
      var i = o.getComponent(cc.Animation);
      if (i) {
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/Waving", $10HomeEnum.Bundles.SmashTheJar);
        i.on("finished", function () {
          e.createSuipian(t);
          $10AudioManager.AudioManager.instance.playEffectPath("sounds/Knock", $10HomeEnum.Bundles.SmashTheJar);
          e.createCuiziRole(t);
          o.destroy();
          t.node.destroy();
          t.node = null;
        }, this);
        i.play();
      } else {
        o.destroy();
      }
    }
  };
  _ctor.prototype.createCuiziRole = function (t) {
    var e = this;
    if (t.node && t.node.isValid) {
      var o = t.node.getComponent($10STJarBox.default).radomId;
      var i = $10DataManager.DataManager.instance.eData.data_jarmonster[o];
      if (1 == i.type) {
        if (!i) {
          return void console.warn("无效的怪物ID: " + o);
        }
        var n = cc.instantiate(this.cardItem);
        if (!n) {
          return void console.error("创建卡片实例失败");
        }
        n.parent = this.node;
        n.setPosition(t.x, t.y);
        var a = n.getComponent($10STCardItem.default);
        if (a) {
          a.init(o);
        } else {
          console.error("STCardItem组件未找到");
        }
        n.scale = 1;
        var r = 1e3 * Math.random() % (2 * Math.PI);
        var s = cc.v2(t.x + 50 * Math.cos(r), t.y + 50 * Math.sin(r));
        cc.Tween.stopAllByTarget(n);
        var c = cc.v2(t.x + (t.x - s.x) / 2, t.y + 200);
        $10MathUtil.MathUtil.bezierTo(n, .3, n.getPosition(), c, s, function () {}, "").call(function () {}).start();
        this.checkGameEnd();
      } else if (i.id > 2003) {
        var l = $10DataManager.DataManager.instance.eData.datamonster[i.res];
        $10ResUtil.ResUtil.loadAsset({
          bundleName: $10HomeEnum.Bundles.SmashTheJar,
          path: "prefabs/" + l.modeName,
          type: cc.Prefab
        }).then(function (o) {
          var n = cc.instantiate(o);
          n.parent = e.node;
          n.setPosition(t.x, t.y - 50);
          n.getComponent($10STMonster.default).initEnemy(i, t.col, function () {
            e.checkJarComplete(i, t);
            n.scale = 0;
            cc.tween(n).to(.2, {
              scale: 1
            }, {
              easing: "backOut"
            }).start();
          });
          $10STJDataProxy.sTJDataProxy.enemySoldiers.push(n, t);
        });
      } else {
        var p = cc.instantiate(this.monsterFab);
        p.parent = this.node;
        p.setPosition(t.x, t.y);
        p.getComponent($10STMonster.default).initEnemy(i, t.col, function () {
          e.checkJarComplete(i, t);
          p.scale = 0;
          cc.tween(p).to(.2, {
            scale: 1
          }, {
            easing: "backOut"
          }).start();
        });
        $10STJDataProxy.sTJDataProxy.enemySoldiers.push(p, t);
      }
    }
  };
  _ctor.prototype.checkJarComplete = function (t, e) {
    if (2004 == t.id) {
      if (e) {
        $10GameUIManager.gameUIMgr.showTips(t.des);
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/skills", $10HomeEnum.Bundles.SmashTheJar);
        this.smashJarsInArea(e.row, e.col, 1);
      }
    } else if (2007 == t.id) {
      $10GameUIManager.gameUIMgr.showTips(t.des);
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/skills", $10HomeEnum.Bundles.SmashTheJar);
      var o = t.parm.split("|");
      $10STJDataProxy.sTJDataProxy.speedAtkBuff = 1 + Number(o[0]);
      clearTimeout(this.timerId);
      this.timerId = setTimeout(function () {
        $10STJDataProxy.sTJDataProxy.speedAtkBuff = 1;
      }, 1e3 * Number(o[1]));
    }
  };
  _ctor.prototype.resetAllJars = function () {
    $10STJDataProxy.sTJDataProxy.jarStates.clear();
  };
  _ctor.prototype.getIntactJarCount = function () {
    var t = 0;
    this.grids.forEach(function (e) {
      $10STJDataProxy.sTJDataProxy.isJarIntact(e.id) && t++;
    });
    return t;
  };
  _ctor.prototype.smashJarsInArea = function (t, e, o) {
    var i = this;
    undefined === o && (o = 1);
    var n = [];
    for (var a = t - o; a <= t + o; a++) {
      for (var r = e - o; r <= e + o; r++) {
        var s = this.getGridByRowCol(a, r);
        s && $10STJDataProxy.sTJDataProxy.isJarIntact(s.id) && n.push(s);
      }
    }
    n.forEach(function (t, e) {
      t.node && t.node.getComponent($10STJarBox.default).playLight();
      i.scheduleOnce(function () {
        i.smashJar(t, false);
      }, 1 + .2 * e);
    });
  };
  _ctor.prototype.getRandomIdByProbability = function (t, e) {
    var o;
    var i;
    var n = [];
    var a = {};
    var s = t.split("|").map(function (t) {
      var e = t.split("_");
      return {
        id: e[0],
        maxCount: parseInt(e[1]),
        probability: parseInt(e[2])
      };
    });
    s.forEach(function (t) {
      a[t.id] = 0;
    });
    var c = 0;
    for (var l = 100 * e; n.length < e && c < l;) {
      c++;
      var p = s.filter(function (t) {
        return a[t.id] < t.maxCount;
      });
      if (0 === p.length) {
        console.warn("所有物品都已达到最大数量限制");
        break;
      }
      var u = p.reduce(function (t, e) {
        return t + e.probability;
      }, 0);
      if (0 === u) {
        console.warn("可用物品总概率为0");
        break;
      }
      var d = Math.random() * u;
      var h = 0;
      try {
        o = undefined;
        var m = cc__values(p);
        for (var f = m.next(); !f.done; f = m.next()) {
          var y = f.value;
          if (d <= (h += y.probability)) {
            a[y.id]++;
            n.push(y.id);
            break;
          }
        }
      } catch (g) {
        o = {
          error: g
        };
      } finally {
        try {
          f && !f.done && (i = m.return) && i.call(m);
        } finally {
          if (o) {
            throw o.error;
          }
        }
      }
    }
    c >= l && console.warn("达到最大尝试次数，可能存在配置问题");
    return n;
  };
  _ctor.prototype.initGrid = function () {
    var t = $10DataManager.DataManager.instance.eData.data_jarstage[$10STJDataProxy.sTJDataProxy.selectStageId];
    $10STJDataProxy.sTJDataProxy.stagetAddBuff = t.hp;
    if ($10STJDataProxy.sTJDataProxy.STJData.stageLoseNum[$10STJDataProxy.sTJDataProxy.selectStageId]) {
      var e = t.num.split("|");
      $10STJDataProxy.sTJDataProxy.stagetJianBuff = Number(e[0]) * $10STJDataProxy.sTJDataProxy.STJData.stageLoseNum[$10STJDataProxy.sTJDataProxy.selectStageId];
      $10STJDataProxy.sTJDataProxy.stagetJianBuff > Number(e[1]) && ($10STJDataProxy.sTJDataProxy.stagetJianBuff = Number(e[1]));
    } else {
      $10STJDataProxy.sTJDataProxy.stagetJianBuff = 0;
    }
    var o = -(this.cols - 1) * this.gridWidth / 2;
    var i = (this.rows - 1) * this.gridHeight / 2 - 160;
    this.grids = [];
    var n = this.getRandomIdByProbability(t.jar, 35);
    var a = 0;
    for (var r = 0; r < this.rows; r++) {
      for (var s = 0; s < this.cols; s++) {
        var c = o + s * this.gridWidth;
        var l = i - r * this.gridHeight;
        var p = {
          id: r * this.cols + s,
          row: r,
          col: s,
          x: c,
          y: l,
          node: null
        };
        this.grids.push(p);
        if (this.jarNode && r < 7) {
          var u = cc.instantiate(this.jarNode);
          u.parent = this.node;
          u.setPosition(c, l);
          u.getComponent($10STJarBox.default).init(n[a]);
          p.node = u;
          u.active = true;
          u.zIndex = -u.y;
          a++;
        } else {
          $10STJDataProxy.sTJDataProxy.jarStates.set(p.id, "broken");
        }
      }
    }
  };
  _ctor.prototype.creatorMosnterNode = function (t, e) {
    if (!(e > 2003 || this.creatorMonster[e])) {
      var o = $10DataManager.DataManager.instance.eData.data_jarmonster[e];
      if (2 == o.type) {
        var i = cc.instantiate(this.monsterFab);
        i.getComponent($10STMonster.default).initEnemy(o, t.col, function () {
          i.destroy();
        });
        this.creatorMonster.push(e);
      }
    }
  };
  _ctor.prototype.getGridByRowCol = function (t, e) {
    return this.grids.find(function (o) {
      return o.row === t && o.col === e;
    });
  };
  _ctor.prototype.getSurroundingGrids = function (t, e) {
    var o;
    var i;
    var n = [];
    try {
      var a = cc__values([[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]);
      for (var c = a.next(); !c.done; c = a.next()) {
        var l = cc__read(c.value, 2);
        var p = l[0];
        var u = l[1];
        var d = t + p;
        var h = e + u;
        if (d >= 0 && d < this.rows && h >= 0 && h < this.cols) {
          var m = this.getGridByRowCol(d, h);
          m && n.push(m);
        }
      }
    } catch (f) {
      o = {
        error: f
      };
    } finally {
      try {
        c && !c.done && (i = a.return) && i.call(a);
      } finally {
        if (o) {
          throw o.error;
        }
      }
    }
    return n;
  };
  _ctor.prototype.getGridsByColumn = function (t) {
    if (t < 0 || t >= this.cols) {
      return console.warn("列索引 " + t + " 超出范围 [0, " + (this.cols - 1) + "]"), [];
    } else {
      return this.grids.filter(function (e) {
        return e.col === t;
      });
    }
  };
  _ctor.prototype.getGridsByRow = function (t) {
    if (t < 0 || t >= this.rows) {
      return console.warn("行索引 " + t + " 超出范围 [0, " + (this.rows - 1) + "]"), [];
    } else {
      return this.grids.filter(function (e) {
        return e.row === t;
      });
    }
  };
  _ctor.prototype.getGridsInRange = function (t, e, o, i) {
    var n = [];
    for (var a = Math.max(0, t); a <= Math.min(this.rows - 1, e); a++) {
      for (var r = Math.max(0, o); r <= Math.min(this.cols - 1, i); r++) {
        var s = this.getGridByRowCol(a, r);
        s && n.push(s);
      }
    }
    return n;
  };
  _ctor.prototype.getExactGridByPosition = function (t, e) {
    var o;
    var i;
    try {
      var n = cc__values(this.grids);
      for (var a = n.next(); !a.done; a = n.next()) {
        var s = a.value;
        var c = Math.abs(s.x - t);
        var l = Math.abs(s.y - e);
        if (c <= this.gridWidth / 2 + 10 && l <= this.gridHeight / 2 + 10) {
          return s;
        }
      }
    } catch (p) {
      o = {
        error: p
      };
    } finally {
      try {
        a && !a.done && (i = n.return) && i.call(n);
      } finally {
        if (o) {
          throw o.error;
        }
      }
    }
    return null;
  };
  _ctor.prototype.calculateRowColByPosition = function (t, e) {
    var o = -(this.cols - 1) * this.gridWidth / 2;
    var i = (this.rows - 1) * this.gridHeight / 2 - 180;
    var n = Math.round((t - o) / this.gridWidth);
    var a = Math.round((i - e) / this.gridHeight);
    if (a >= 0 && a < this.rows && n >= 0 && n < this.cols) {
      return {
        row: a,
        col: n,
        valid: true
      };
    } else {
      return {
        row: a,
        col: n,
        valid: false
      };
    }
  };
  _ctor.prototype.getGridByPositionCalculated = function (t, e) {
    var o = this.calculateRowColByPosition(t, e);
    if (o.valid) {
      return this.getGridByRowCol(o.row, o.col);
    } else {
      return null;
    }
  };
  _ctor.prototype.resetJarState = function (t) {
    $10STJDataProxy.sTJDataProxy.jarStates.set(t.id, "broken");
  };
  _ctor.prototype.createDefender = function (t, e) {
    var o = this;
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.SmashTheJar,
      path: "prefabs/roles/Role_" + e.id,
      type: cc.Prefab
    }).then(function (i) {
      var n = cc.instantiate(i);
      n.parent = o.node;
      n.setPosition(t.x, t.y);
      $10STJDataProxy.sTJDataProxy.jarStates.set(t.id, "defender");
      n.getComponent($10STRoleBase.default).initRole(e, t);
      $10STJDataProxy.sTJDataProxy.soldiers.push(n);
      n.scale = 0;
      n.zIndex = -n.y;
      cc.tween(n).to(.3, {
        scale: 1
      }, {
        easing: "backOut"
      }).start();
    });
  };
  _ctor.prototype.highlightGrid = function (t, e) {
    var o = new cc.Node("GridHighlight");
    var i = o.addComponent(cc.Graphics);
    i.fillColor = e;
    i.rect(-this.gridWidth / 2, -this.gridHeight / 2, this.gridWidth, this.gridHeight);
    i.fill();
    o.opacity = 100;
    o.setPosition(t.x, t.y);
    o.parent = this.node;
    this.gridHighlights.set(t.id, o);
  };
  _ctor.prototype.clearGridHighlight = function () {
    this.gridHighlights.forEach(function (t) {
      t.destroy();
    });
    this.gridHighlights.clear();
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "jarNode", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "monsterFab", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "suipianNode", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "cuizi", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "cardItem", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_STBattleView;