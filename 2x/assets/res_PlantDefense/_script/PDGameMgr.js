var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__values = __values;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10CommonUtil = require("CommonUtil");
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10NodePoolManager = require("NodePoolManager");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10Util = require("Util");
var $10PDEnemyBase = require("PDEnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDGameMgr = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.grids = [];
    e.rows = 8;
    e.cols = 5;
    e.gridWidth = 150;
    e.gridHeight = 120;
    e.gridHighlights = new Map();
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor, "Inst", {
    get: function () {
      return this.inst || (this.inst = new this());
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.highlightGrid = function (t, e) {
    var n = new cc.Node("GridHighlight");
    var o = n.addComponent(cc.Graphics);
    o.fillColor = e;
    o.rect(-this.gridWidth / 2, -this.gridHeight / 2, this.gridWidth, this.gridHeight);
    o.fill();
    n.setPosition(t.x, t.y);
    n.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.mapLayer;
    this.gridHighlights.set(t.id, n);
    n.opacity = 120;
  };
  _ctor.prototype.clearGridHighlight = function () {
    this.gridHighlights.forEach(function (t) {
      t.destroy();
    });
    this.gridHighlights.clear();
  };
  _ctor.prototype.getGridByPositionCalculated = function (t, e) {
    var n = this.calculateRowColByPosition(t, e);
    if (n.valid) {
      return this.getGridByRowCol(n.row, n.col);
    } else {
      return null;
    }
  };
  _ctor.prototype.getGridByRowCol = function (t, e) {
    return this.grids.find(function (n) {
      return n.row === t && n.col === e;
    });
  };
  _ctor.prototype.calculateRowColByPosition = function (t, e) {
    var n = -(this.cols - 1) * this.gridWidth / 2;
    var o = (this.rows - 1) * this.gridHeight / 2 - 180;
    var i = Math.round((t - n) / this.gridWidth);
    var a = Math.round((o - e) / this.gridHeight);
    if (a >= 0 && a < this.rows && i >= 0 && i < this.cols) {
      return {
        row: a,
        col: i,
        valid: true
      };
    } else {
      return {
        row: a,
        col: i,
        valid: false
      };
    }
  };
  _ctor.prototype.getExactGridByPosition = function (t, e) {
    var n;
    var o;
    try {
      var i = cc__values(this.grids);
      for (var a = i.next(); !a.done; a = i.next()) {
        var s = a.value;
        var l = Math.abs(s.x - t);
        var c = Math.abs(s.y - e);
        if (l <= this.gridWidth / 2 + 10 && c <= this.gridHeight / 2 + 10) {
          return s;
        }
      }
    } catch (p) {
      n = {
        error: p
      };
    } finally {
      try {
        a && !a.done && (o = i.return) && o.call(i);
      } finally {
        if (n) {
          throw n.error;
        }
      }
    }
    return null;
  };
  _ctor.prototype.playAudioBGM = function (t) {
    $10AudioManager.AudioManager.instance.playBgmPath("sounds/" + t, $10HomeEnum.Bundles.PlantDefense);
  };
  _ctor.prototype.showHurt = function (t, e, n, o, i, a) {
    var r = this;
    if (t) {
      t = Math.abs(t);
      $10ResUtil.ResUtil.loadAsset({
        bundleName: $10HomeEnum.Bundles.GAME,
        path: "prefabs/root/HurtLabel",
        type: cc.Prefab
      }).then(function (s) {
        var l = $10NodePoolManager.default.instance.getNode(s);
        l.getChildByName("miss").active = false;
        l.getChildByName("Num").active = true;
        l.getChildByName("Num").getComponent(cc.Label).string = $10MathUtil.MathUtil.formatNumber(t);
        l.opacity = 255;
        l.position = n;
        switch (e) {
          case $10Util.HurtType.CRIT:
            l.getChildByName("Num").color = cc.Color.RED;
            break;
          case $10Util.HurtType.RECOVERY:
            l.getChildByName("Num").color = cc.Color.GREEN;
            break;
          default:
            l.getChildByName("Num").color = cc.Color.WHITE;
        }
        i.addChild(l);
        r.playHurtEffect(l, function () {
          a && a.isValid && -1 != a.name.indexOf("Enemy") && a.getComponent($10PDEnemyBase.default).removeHurtItemNode(l);
          $10NodePoolManager.default.instance.putNode(l);
        }, o, e);
        a && a.isValid && -1 != a.name.indexOf("Enemy") && a.getComponent($10PDEnemyBase.default).updateHurtItemNode(l);
      }).catch(function (t) {
        $10CommonUtil.CommonUtil.print(t);
      });
    }
  };
  _ctor.prototype.showMiss = function (t, e, n, o) {
    var i = this;
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/root/HurtLabel",
      type: cc.Prefab
    }).then(function (a) {
      var r = $10NodePoolManager.default.instance.getNode(a);
      r.getChildByName("miss").active = true;
      r.getChildByName("Num").active = false;
      r.opacity = 255;
      r.position = t;
      n.addChild(r);
      i.playHurtEffect(r, function () {
        o && o.isValid && -1 != o.name.indexOf("Enemy") && o.getComponent("PDEnemyBase").removeHurtItemNode(r);
        $10NodePoolManager.default.instance.putNode(r);
      }, e, 1);
      o && o.isValid && -1 != o.name.indexOf("Enemy") && o.getComponent("PDEnemyBase").updateHurtItemNode(r);
    }).catch(function (t) {
      $10CommonUtil.CommonUtil.print(t);
    });
  };
  _ctor.prototype.playHurtEffect = function (t, e, n, o) {
    var i = this;
    t.opacity = 255;
    t.scale = 1;
    var a = cc.sequence(cc.delayTime(.4), cc.fadeOut(.25));
    var r = cc.moveBy(.15, cc.v2(0, 60));
    var s = cc.moveBy(.1, cc.v2(0, -10));
    var l = cc.scaleTo(.15, $10Util.HurtType.CRIT ? 1.8 : 1.5);
    var c = cc.scaleTo(.075, 1.2);
    var p = cc.sequence(l, c);
    var u = l;
    t.runAction(cc.sequence(cc.spawn(o == $10Util.HurtType.NORMAL ? p : u, r), cc.callFunc(function () {
      n.pushDamageNumberObject(i);
    }), s, a, cc.callFunc(function () {
      n && n.isValid && n.removeDamageNumberObject(i);
      e && e();
    })));
  };
  _ctor.inst = null;
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDGameMgr;