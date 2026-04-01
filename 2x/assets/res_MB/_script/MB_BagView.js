var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__read = __read;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10RandomUtil = require("RandomUtil");
var $10ResUtil = require("ResUtil");
var $10DataManager = require("DataManager");
var $10MBGameDataProxy = require("MBGameDataProxy");
var $10Util = require("Util");
var $10MB_GameEnum = require("MB_GameEnum");
var $10MB_EquipItem = require("MB_EquipItem");
var $10MB_GridItem = require("MB_GridItem");
var $10MB_Const = require("MB_Const");
var $10MBScene = require("MBScene");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MB_BagView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.nGrids = null;
    e.nEquips = null;
    e.nPrepares = null;
    e.nPrepareLayout = null;
    e.nDraw = null;
    e.nTouchLock = null;
    e._gridMap = new Map();
    e._selectEquipNode = null;
    e._selectEquipMoveResult = false;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "eqiupedIds", {
    get: function () {
      return this.nEquips.children.map(function (t) {
        return t.getComponent($10MB_EquipItem.default).equipId;
      });
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  };
  _ctor.prototype.onDestroy = function () {
    this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  };
  _ctor.prototype.init = function () {
    this.initGrid();
  };
  _ctor.prototype.onEnterReady = function () {
    this.nTouchLock.active = false;
    this.refreshEquip();
  };
  _ctor.prototype.onEnterBattle = function () {
    this.nPrepareLayout.destroyAllChildren();
    this.nTouchLock.active = true;
  };
  _ctor.prototype.initGrid = function () {
    this._gridMap.clear();
    this._gridMap.set("0&0", this.nGrids.children[0]);
    var t = $10MB_Const.MB_GRID_ROW * $10MB_Const.MB_GRID_COL;
    for (var e = 1; e < t; ++e) {
      var n = cc.instantiate(this.nGrids.children[0]);
      this.nGrids.addChild(n);
      this._gridMap.set(Math.floor(e / $10MB_Const.MB_GRID_COL) + "&" + e % $10MB_Const.MB_GRID_COL, n);
    }
    this._gridMap.forEach(function (t) {
      t.getComponent($10MB_GridItem.default).setState($10MB_GridItem.EMB_GridState.NONE);
    });
  };
  _ctor.prototype.refreshEquip = function () {
    var t = this;
    this.nPrepareLayout.destroyAllChildren();
    if (1 != $10MBScene.default.instance.curStage) {
      var e = $10DataManager.DataManager.instance.eData.data_bagstage[$10MBScene.default.instance.curStage];
      var n = $10MathUtil.MathUtil.weightedRandom(e.numWeight.split("|").map(Number)) + 2;
      var i = [];
      for (var o = 0; o < n; ++o) {
        var a = $10MathUtil.MathUtil.weightedRandom(e.levelWeight.split("|").map(Number)) + 1;
        var s = [];
        for (var c in $10DataManager.DataManager.instance.eData.data_bagweapon) {
          (m = $10DataManager.DataManager.instance.eData.data_bagweapon[c]).type < 8 && m.level == a && s.push(m.id);
        }
        var f = s[$10RandomUtil.RandomUtil.randomInt(0, s.length)];
        i.push(f);
      }
      console.log("MB_连败次数:", $10MBGameDataProxy.mbGameDataProxy.failCount);
      console.log("MB_当前关卡:", $10MBScene.default.instance.curStage);
      for (var o in $10DataManager.DataManager.instance.eData.data_bagweapon) {
        var m;
        if ((m = $10DataManager.DataManager.instance.eData.data_bagweapon[o]).type >= 8) {
          var _ = cc__read(m.refresh.split("|").map(Number), 4);
          var g = _[0];
          var A = _[1];
          var E = _[2];
          var M = _[3];
          console.log("MB_冷却局数" + m.id + ":", $10MBGameDataProxy.mbGameDataProxy.getEquipCD(m.id));
          if ($10MBGameDataProxy.mbGameDataProxy.failCount < g) {
            continue;
          }
          if ($10MBScene.default.instance.curStage < A) {
            continue;
          }
          if ($10MBGameDataProxy.mbGameDataProxy.isEquipCd(m.id)) {
            continue;
          }
          if ($10RandomUtil.RandomUtil.randomInt(0, 100) < E) {
            i.push(m.id);
            $10MBGameDataProxy.mbGameDataProxy.enterCD(m.id, M);
            break;
          }
        }
      }
      console.log(i);
      i.forEach(function (e) {
        var n = $10DataManager.DataManager.instance.eData.data_bagweapon[e];
        $10ResUtil.ResUtil.loadAsset({
          bundleName: "res_MB",
          path: "prefabs/equips/MB_Equip_" + n.type,
          type: cc.Prefab
        }).then(function (n) {
          if (t.nPrepareLayout && t.nPrepareLayout.isValid) {
            var i = cc.instantiate(n);
            t.nPrepareLayout.addChild(i);
            t.updatePrepareLayout();
            i.setPosition(0, 0);
            i.getComponent($10MB_EquipItem.default).init(e, "", t);
          }
        });
      });
    }
  };
  _ctor.prototype.setGirdsHight = function (t) {
    this._gridMap.forEach(function (e, n) {
      if (t && t.indexOf(n) >= 0) {
        e.getComponent($10MB_GridItem.default).setState($10MB_GridItem.EMB_GridState.RIGHT);
      } else {
        e.getComponent($10MB_GridItem.default).setState($10MB_GridItem.EMB_GridState.NONE);
      }
    });
  };
  _ctor.prototype.updateSelectEquipMove = function () {
    var t = this;
    var e = this._selectEquipNode.getComponent($10MB_EquipItem.default).occupyRowCols;
    var n = true;
    if (e.length <= 0) {
      n = false;
    } else {
      e.forEach(function (e) {
        n && (t.isValidGrid(e) || (n = false));
      });
    }
    if (n) {
      this.setGirdsHight(e);
    } else {
      this.setGirdsHight();
    }
    this._selectEquipMoveResult = n;
  };
  _ctor.prototype.onTouchStart = function (t) {
    var e = this.findTouchEquipNode(t.getLocation());
    e && (this._selectEquipNode = e);
  };
  _ctor.prototype.onTouchMove = function (t) {
    if (this._selectEquipNode && !(cc.Vec2.distance(t.getLocation(), t.getStartLocation()) < 10)) {
      if (this._selectEquipNode.parent != this.nDraw) {
        var e = $10Util.default.nodeParentChangeLocalPos(this._selectEquipNode, this.nDraw);
        this._selectEquipNode.parent = this.nDraw;
        this._selectEquipNode.getComponent($10MB_EquipItem.default).onSelectedAnim();
        this._selectEquipNode.getComponent($10MB_EquipItem.default).setPos(cc.v2(e.x, e.y));
        this.updatePrepareLayout();
      }
      var n = this.nDraw.convertToNodeSpaceAR(t.getLocation());
      this._selectEquipNode.getComponent($10MB_EquipItem.default).setPos(n);
      this.updateSelectEquipMove();
    }
  };
  _ctor.prototype.onTouchEnd = function (t) {
    var e = this;
    if (this._selectEquipNode) {
      if (cc.Vec2.distance(t.getLocation(), t.getStartLocation()) < 10 && this._selectEquipNode.parent != this.nDraw) {
        $10MBScene.default.instance.attrUI.showEquipAttr(this._selectEquipNode.getComponent($10MB_EquipItem.default).equipId);
        return void (this._selectEquipNode = null);
      }
      if (this._selectEquipNode.parent != this.nDraw) {
        return void (this._selectEquipNode = null);
      }
      if (!this._selectEquipMoveResult) {
        var n = this._selectEquipNode.convertToWorldSpaceAR(cc.v2());
        var i = new cc.Rect(n.x - this._selectEquipNode.width / 2, n.y - this._selectEquipNode.height / 2, this._selectEquipNode.width, this._selectEquipNode.height);
        var o = this._selectEquipNode.getComponent($10MB_EquipItem.default);
        var a = this.nPrepareLayout;
        var r = false;
        for (var s = 0; s < a.children.length; ++s) {
          var c = a.children[s];
          var p = c.getComponent($10MB_EquipItem.default);
          var l = c.convertToWorldSpaceAR(cc.v2());
          var u = new cc.Rect(l.x - c.width / 2, l.y - c.height / 2, c.width, c.height);
          if (o.canUpLv && p.canUpLv && o.equipId == p.equipId && i.intersects(u)) {
            r = true;
            p.upLv();
            console.log("升级");
            this._selectEquipNode.destroy();
            break;
          }
        }
        r || this.backPrepare(this._selectEquipNode);
        return void (this._selectEquipNode = null);
      }
      var d = [];
      var h = this._selectEquipNode.getComponent($10MB_EquipItem.default);
      h.occupyRowCols.forEach(function (t) {
        var n = e.getGridEquip(t);
        n && !d.includes(n) && d.push(n);
      });
      if (d.length > 0) {
        r = false;
        for (s = 0; s < d.length; ++s) {
          if ((p = (f = d[s]).getComponent($10MB_EquipItem.default)).canUpLv && p.equipId == h.equipId) {
            r = true;
            h.node.destroy();
            p.upLv();
            break;
          }
        }
        if (!r) {
          for (s = 0; s < d.length; ++s) {
            var f = d[s];
            this.backPrepare(f);
          }
          this.downEquip(this._selectEquipNode);
        }
      } else {
        this.downEquip(this._selectEquipNode);
      }
      this.setGirdsHight();
      this._selectEquipNode = null;
    }
  };
  _ctor.prototype.backPrepare = function (t) {
    var e = this;
    var n = $10Util.default.nodeParentChangeLocalPos(t, this.nDraw);
    t.parent = this.nDraw;
    t.setPosition(n);
    var i = $10Util.default.nodeParentChangeLocalPos(this.nPrepares, this.nDraw);
    var o = cc.Vec2.distance(n, i);
    if (o < 100) {
      t.parent = this.nPrepareLayout;
      t.y = 0;
      this.updatePrepareLayout();
      t.getComponent($10MB_EquipItem.default).setPos(this.node.getPosition());
      t.getComponent($10MB_EquipItem.default).onDownAnim();
      return void $10EventManager.EventManager.instance.emit($10MB_GameEnum.E_MB_BattleEvent.UPDATE_PLAYER_ANIMATION);
    }
    cc.tween(t).to(o / 2e3, {
      x: i.x,
      y: i.y
    }).call(function () {
      t.parent = e.nPrepareLayout;
      t.y = 0;
      e.updatePrepareLayout();
      t.getComponent($10MB_EquipItem.default).setPos(e.node.getPosition());
      t.getComponent($10MB_EquipItem.default).onDownAnim();
      $10EventManager.EventManager.instance.emit($10MB_GameEnum.E_MB_BattleEvent.UPDATE_PLAYER_ANIMATION);
    }).start();
  };
  _ctor.prototype.updatePrepareLayout = function () {
    var t = this.nPrepareLayout.getComponent(cc.Layout);
    var e = this.nPrepareLayout.childrenCount;
    t.spacingX = 2 == e ? 50 : 3 == e ? 20 : 5;
    t.updateLayout();
  };
  _ctor.prototype.downEquip = function (t) {
    var e = t.getComponent($10MB_EquipItem.default);
    console.log("植物行列:", e.rowCol);
    var n = this.getPosByRowCol(e.rowCol);
    console.log("放下植物");
    if (!n) {
      console.log("点不存在");
      return void this.backPrepare(t);
    }
    t.parent = this.nEquips;
    e.onDownAnim();
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/se_put", "res_MB");
    e.setPosByGrid(n);
    $10EventManager.EventManager.instance.emit($10MB_GameEnum.E_MB_BattleEvent.UPDATE_PLAYER_ANIMATION);
  };
  _ctor.prototype.findTouchEquipNode = function (t) {
    var e = this.nPrepareLayout;
    for (var n = 0; n < e.children.length; ++n) {
      var i = e.children[n];
      var o = i.convertToWorldSpaceAR(cc.v2());
      if (new cc.Rect(o.x - i.width / 2, o.y - i.height / 2, i.width, i.height).contains(t)) {
        return i;
      }
    }
    var a = this.getRowColByPos(this.node.convertToNodeSpaceAR(t));
    return this.getGridEquip(a);
  };
  _ctor.prototype.isValidGrid = function (t) {
    return this._gridMap.has(t);
  };
  _ctor.prototype.getGrid = function (t) {
    if (this.isValidGrid(t)) {
      return this._gridMap.get(t);
    } else {
      return null;
    }
  };
  _ctor.prototype.getGridEquip = function (t) {
    var e = this.nEquips.children;
    for (var n = 0; n < e.length; ++n) {
      var i = e[n];
      if (i.getComponent($10MB_EquipItem.default).occupyRowCols.indexOf(t) >= 0) {
        return i;
      }
    }
    return null;
  };
  _ctor.prototype.getRowColByPos = function (t) {
    var e = this.node.convertToWorldSpaceAR(t);
    var n = this.nGrids.convertToNodeSpaceAR(e);
    var i = cc.v2(n.x + this.nGrids.width / 2, -n.y);
    var o = this.nGrids.width / 6;
    return Math.floor(i.y / o) + "&" + Math.floor(i.x / o);
  };
  _ctor.prototype.getPosByRowCol = function (t) {
    var e = cc__read(t.split("&").map(Number), 2);
    var n = e[0];
    var i = e[1];
    var o = this.nGrids.children[n * $10MB_Const.MB_GRID_COL + i];
    if (o) {
      return o.getPosition();
    } else {
      return null;
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nGrids", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nEquips", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nPrepares", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nPrepareLayout", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nDraw", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nTouchLock", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_MB_BagView;