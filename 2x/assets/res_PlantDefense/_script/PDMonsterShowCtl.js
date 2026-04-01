var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10Util = require("Util");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDShowMonster = require("PDShowMonster");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDMonsterShowCtl = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.contant = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    this.initView();
  };
  _ctor.prototype.initView = function () {
    var t = this;
    var e = $10DataManager.DataManager.instance.eData.data_zombiestage;
    var n = [];
    for (var o in e) {
      e[o].stage == $10PlantDefenseDataProxy.plantDefenseDataProxy.selectStageId && n.push(e[o]);
    }
    var i = [];
    for (var a = 0; a < n.length; a++) {
      -1 == i.indexOf(n[a].armyId) && i.push(n[a].armyId);
    }
    var r = function (e) {
      s.scheduleOnce(function () {
        t.createEnemy(i[e]);
      }, .2 * e);
    };
    var s = this;
    for (a = 0; a < i.length; a++) {
      r(a);
    }
  };
  _ctor.prototype.createEnemy = function (t) {
    var e = this;
    var n = $10DataManager.DataManager.instance.eData.data_zombiemonster[t];
    this.getEnemyPrefab(n, function (t) {
      if (t) {
        var o = 1;
        2 != n.type && (o = $10Util.default.getRandomNum(2, 4));
        for (var i = 0; i < o; i++) {
          var a = cc.instantiate(t);
          a.removeComponent($10PDEnemyBase.default);
          e.contant.addChild(a);
          var r = -e.contant.width / 2 + e.contant.width / 2;
          var s = e.contant.width / 2 - e.contant.width / 2;
          var l = -e.contant.height / 2 + e.contant.height / 2;
          var c = e.contant.height / 2 - e.contant.height / 2;
          var h = r + Math.random() * (s - r);
          var m = l + Math.random() * (c - l);
          var f = cc.v2(h, m);
          a.setPosition(f);
          a.addComponent($10PDShowMonster.default);
        }
      }
    });
  };
  _ctor.prototype.getEnemyPrefab = function (t, e) {
    if (2 == t.type) {
      $10ResUtil.ResUtil.loadAsset({
        path: "prefabs/monsters/PDEnemyBoss" + t.id,
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.PlantDefense
      }).then(function (t) {
        e && e(t);
      }).catch(function (t) {
        console.log("error:", t);
      });
    } else if (4 == t.type || 3 == t.type) {
      $10ResUtil.ResUtil.loadAsset({
        path: "prefabs/monsters/PDEnemy" + t.id,
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.PlantDefense
      }).then(function (t) {
        e && e(t);
      }).catch(function (t) {
        console.log("error:", t);
      });
    } else {
      $10ResUtil.ResUtil.loadAsset({
        path: "prefabs/monsters/PDEnemyNormal",
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.PlantDefense
      }).then(function (t) {
        e && e(t);
      }).catch(function (t) {
        console.log("error:", t);
      });
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "contant", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDMonsterShowCtl;