var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EquipEvent = undefined;
var $10EventManager = require("EventManager");
var $10CommonUtil = require("CommonUtil");
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var _ = [];
(exports.EquipEvent || (exports.EquipEvent = {})).CHECK_BUFF = "CHECK_BUFF";
var def_SelectLayout = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.equipIdList = [];
    e._canRefresh = false;
    e._gridsMap = null;
    e._greadWeights = [];
    e._refreshNum = 1;
    e._superRefreshNum = 0;
    e._superNeedRefreshNum = 0;
    e._isRemoveSuperWeight = false;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "refreshNum", {
    set: function (t) {
      this._refreshNum = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "superRefreshNum", {
    set: function (t) {
      this._superRefreshNum = t;
      $10CommonUtil.CommonUtil.print("重置低保次数");
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    this._canRefresh = true;
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.GM_ADD_EQUIP, this.gmAddEquip, this);
    this._greadWeights = [];
    for (var t = 27; t < 30; ++t) {
      this._greadWeights.push(Number($10DataManager.DataManager.instance.eData.datapara[t].num));
    }
  };
  _ctor.prototype.onEnable = function () {};
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.GM_ADD_EQUIP, this.gmAddEquip, this);
  };
  _ctor.prototype.initData = function (t) {
    this.equipIdList = [];
    _ = [];
    var e = $10UserDataProxy.userDataProxy.userData.combatEqus;
    console.log("combatEqus:", e);
    for (var o = 0; o < e.length; ++o) {
      var i = $10DataManager.DataManager.instance.eData.dataplant[e[o]];
      this.equipIdList.push(i.id);
      _.push($10GameEnum.EquipmentData[i.prefabKey].name);
    }
    this.refreshSeletItems(t, true);
  };
  _ctor.prototype.getGrade = function (t) {
    var e = [];
    if (t == $10BattleDataProxy.battleDataProxy.battleData.superPlantId) {
      var o = $10DataManager.DataManager.instance.eData.datasuperplant[$10BattleDataProxy.battleDataProxy.battleData.superPlantId];
      var i = $10BattleDataProxy.battleDataProxy.superPlantNum;
      if (i >= o.chargeNum) {
        var n = i - o.chargeNum;
        for (var a = 1; a < 4; ++a) {
          var r = o["level" + a].split("|").map(Number)[n];
          r && e.push(r);
        }
      }
    }
    var l = [];
    if (e.length >= 3) {
      l = e;
      $10CommonUtil.CommonUtil.print("品级权重变化:", l);
    } else {
      l = this._greadWeights;
    }
    var u = $10MathUtil.MathUtil.weightedRandom(l);
    if (u < 0) {
      console.log("G了，权重有问题");
      return 1;
    }
    var p = u + 1;
    1 == $10UserDataProxy.userDataProxy.userData.curChapter && p > 2 && (p = 2);
    return p;
  };
  _ctor.prototype.getCanRefreshCombatEqus = function () {
    var t = $10UserDataProxy.userDataProxy.userData.combatEqus;
    var e = [];
    var o = 0;
    var i = $10DataManager.DataManager.instance.eData.datasuperplant[$10BattleDataProxy.battleDataProxy.battleData.superPlantId];
    if (!i) {
      return t;
    }
    var n = $10UserDataProxy.userDataProxy.userData.curWave;
    if ($10BattleDataProxy.battleDataProxy.isEndless) {
      n = $10BattleDataProxy.battleDataProxy.endlessCurWave;
    } else {
      $10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE && (n = $10UserDataProxy.userDataProxy.userData.curWeatherWave);
    }
    var a = $10UserDataProxy.userDataProxy.userData.curChapter;
    if (1 == a) {
      return t.slice();
    }
    var r = $10DataManager.DataManager.instance.eData.datastage;
    var c = $10BattleDataProxy.battleDataProxy.getStageRewardCfg(a).monsterList.replace("stage", "");
    for (var l in r) {
      var p = r[l];
      if (p.wave == n && p.stage == Number(c)) {
        o = Number(p.refresh);
        break;
      }
    }
    var f = $10BattleDataProxy.battleDataProxy.getSuperPlantNum();
    var y = i.superNum - f;
    for (var g = 0; g < t.length; ++g) {
      if (t[g] == $10BattleDataProxy.battleDataProxy.battleData.superPlantId && 0 != o && y <= o && !$10BattleDataProxy.battleDataProxy.isActiveSuperPlant) {
        $10CommonUtil.CommonUtil.print("超武数量已达上限，不再刷新");
      } else {
        e.push(t[g]);
      }
    }
    return e;
  };
  _ctor.prototype.refreshSeletItems = function (t, e, o) {
    undefined === e && (e = false);
    undefined === o && (o = false);
    if (this._canRefresh) {
      this._gridsMap = t;
      for (this._canRefresh = false; 0 < this.node.childrenCount;) {
        var i = this.node.children[0];
        i.removeFromParent();
        i.destroy();
      }
      this._isRemoveSuperWeight = false;
      this.node.removeAllChildren();
      var n = [];
      var a = $10UserDataProxy.userDataProxy.userData.combatEqus.slice();
      var r = $10DataManager.DataManager.instance.eData.datasuperplant[$10BattleDataProxy.battleDataProxy.battleData.superPlantId];
      var l = [];
      var p = 1;
      3 == a.length && (p = .71);
      for (var f = 0; f < a.length; ++f) {
        var y = $10DataManager.DataManager.instance.eData.datarefresh[a[f]];
        if (y) {
          var g = e ? y.firstDrawPower : y.drawPower;
          if (y.id == $10BattleDataProxy.battleDataProxy.battleData.superPlantId) {
            var _ = $10BattleDataProxy.battleDataProxy.superPlantNum;
            if (_ >= r.chargeNum) {
              var v = _ - r.chargeNum;
              var b = r.refreshWeight.split("|").map(Number)[v];
              if (b) {
                $10CommonUtil.CommonUtil.print("刷新权重调整:" + g + "->" + g * b * p);
                g *= b * p;
              }
            }
          }
          l.push(g);
        }
      }
      var P = $10UserDataProxy.userDataProxy.userData.curChapter;
      var D = null;
      if (1 == P && !$10BattleDataProxy.battleDataProxy.isEndless && $10BattleDataProxy.battleDataProxy.weatherType == $10GameEnum.WeatherType.NONE) {
        var S = $10UserDataProxy.userDataProxy.userData.curWave;
        var E = $10DataManager.DataManager.instance.eData.data_specialrefresh;
        for (var C in E) {
          if (E[C].refresh == this._refreshNum && E[C].wave == S) {
            D = E[C];
            break;
          }
        }
      }
      var B = 8 - $10BattleDataProxy.battleDataProxy.superPlantNum;
      if (D && B > 0) {
        n.length = 0;
        B < 3 && (B = 3);
        var x = $10UserDataProxy.userDataProxy.userData.gameCourseData.curId;
        S = $10UserDataProxy.userDataProxy.userData.curWave;
        if (1 == P && x < 11 && 3 == S) {
          for (f = 0; f < B; ++f) {
            var M = $10DataManager.DataManager.instance.eData.dataplant[3];
            var w = {
              itemIdx: $10GameEnum.EquipmentData[M.prefabKey].name,
              grade: 1
            };
            n.push(w);
          }
          $10BattleDataProxy.battleDataProxy.sunshineNum = 0;
          var A = $10BattleDataProxy.battleDataProxy.sunshineNum;
          A = 10 * B;
          $10BattleDataProxy.battleDataProxy.sunshineNum = A;
        } else {
          var R = D.num.split("|").map(Number);
          var O = D.level.split("|").map(Number);
          for (f = 0; f < R.length; ++f) {
            var N = R[f];
            M = $10DataManager.DataManager.instance.eData.dataplant[N];
            w = {
              itemIdx: $10GameEnum.EquipmentData[M.prefabKey].name,
              grade: j = O[f],
              adFlag: false
            };
            n.push(w);
          }
        }
      } else if (e) {
        var I = $10DataManager.DataManager.instance.eData.datapara[72].num.split("|").map(Number);
        v = $10MathUtil.MathUtil.weightedRandom(I);
        var T = $10DataManager.DataManager.instance.eData.datapara[[69, 70, 71][v]].num.split("|");
        var k = $10UserDataProxy.userDataProxy.userData.combatEqus.slice();
        var U = k.indexOf($10BattleDataProxy.battleDataProxy.battleData.superPlantId);
        U >= 0 && k.splice(U, 1);
        for (f = 0; f < T.length; ++f) {
          var L = 1 == (Z = T[f].split("_").map(Number))[0];
          var j = Z[1];
          M = null;
          if (L) {
            M = $10DataManager.DataManager.instance.eData.dataplant[$10BattleDataProxy.battleDataProxy.battleData.superPlantId];
          } else {
            N = k[Math.floor(100 * Math.random()) % k.length];
            M = $10DataManager.DataManager.instance.eData.dataplant[N];
          }
          w = {
            itemIdx: $10GameEnum.EquipmentData[M.prefabKey].name,
            grade: j
          };
          n.push(w);
        }
      } else {
        if (o) {
          var F = $10BattleDataProxy.battleDataProxy.battleData.superPlantId;
          var G = $10DataManager.DataManager.instance.eData.datasuperplant[F];
          if (G) {
            var H = $10BattleDataProxy.battleDataProxy.getSuperPlantNum();
            var V = G.superNum - H;
            var W = 8 - G.superNum;
            if (V <= G.chargeNum + W) {
              this._superRefreshNum++;
              $10CommonUtil.CommonUtil.print("超武refreshLevel次数:", this._superRefreshNum);
              var q = false;
              var z = G.refreshLevel2.split("|");
              var Y = z[z.length - V];
              if (Y) {
                var K = (Z = Y.split("_").map(Number))[0];
                var J = Z[1];
                var X = Z[2];
                if (K <= this._superRefreshNum) {
                  if (J > $10BattleDataProxy.battleDataProxy.battleData.sunshineNum) {
                    this._superRefreshNum = 0;
                    for (f = 0; f < X; ++f) {
                      $10CommonUtil.CommonUtil.print("刷新达到上限，强制补偿一个二级超武");
                      M = $10DataManager.DataManager.instance.eData.dataplant[F];
                      n.push({
                        itemIdx: $10GameEnum.EquipmentData[M.prefabKey].name,
                        grade: 2,
                        plantId: F
                      });
                    }
                    q = true;
                  } else {
                    $10CommonUtil.CommonUtil.print("二级刷新达到要求，但是钱太多了");
                  }
                }
              }
              if (!q) {
                var Z;
                var Q = G.refreshLevel1.split("|");
                var $ = Q[Q.length - V];
                if ($) {
                  K = (Z = $.split("_").map(Number))[0];
                  X = Z[1];
                  this.setSuperNeedRefreshNum(K);
                  if (this._superNeedRefreshNum <= this._superRefreshNum) {
                    this._superRefreshNum = 0;
                    for (f = 0; f < X; ++f) {
                      $10CommonUtil.CommonUtil.print("刷新达到上限，强制补偿一个一级超武");
                      M = $10DataManager.DataManager.instance.eData.dataplant[F];
                      n.push({
                        itemIdx: $10GameEnum.EquipmentData[M.prefabKey].name,
                        grade: 1,
                        plantId: F
                      });
                    }
                  }
                }
              }
            }
          }
        }
        var tt = this.removeSuperWeight(n, l, a);
        l = tt.refreshPlantWeight;
        a = tt.combatEqus;
        for (f = 0; f < 3; ++f) {
          (v = $10MathUtil.MathUtil.weightedRandom(l)) < 0 && (v = 0);
          M = $10DataManager.DataManager.instance.eData.dataplant[a[v]];
          w = {
            itemIdx: $10GameEnum.EquipmentData[M.prefabKey].name,
            grade: j = this.getGrade(M.id),
            plantId: a[v]
          };
          n.push(w);
          var et = this.removeSuperWeight(n, l, a);
          l = et.refreshPlantWeight;
          a = et.combatEqus;
          if (n.length >= 3) {
            break;
          }
        }
      }
      var ot = $10UserDataProxy.userDataProxy.userData.wearHybridPlantId;
      if (ot && 0 != ot) {
        var it = this.getHybridPlantLv();
        if (2 == it) {
          var nt = 100 * Number($10DataManager.DataManager.instance.eData.datapara[77].num);
          Math.floor(1e3 * Math.random()) % 100 < nt && n.push({
            itemIdx: "Item" + ot,
            grade: 2,
            adFlag: false,
            plantId: ot
          });
        } else {
          3 == it && Math.floor(1e3 * Math.random()) % 100 < 100 * Number($10DataManager.DataManager.instance.eData.datapara[78].num) && n.push({
            itemIdx: "Item" + ot,
            grade: 3,
            adFlag: true,
            plantId: ot
          });
        }
      }
      this.createEquipmentItem(n);
      this._refreshNum++;
    }
  };
  _ctor.prototype.getHybridPlantLv = function () {
    var t;
    var e = (null === (t = $10BattleDataProxy.battleDataProxy.equipRoot) || undefined === t ? undefined : t.children) || [];
    for (var o = 0; o < e.length; ++o) {
      var i = e[o];
      if (i.getComponent($10EquipmentItem.default).mIsHybridPlant) {
        return i.getComponent($10EquipmentItem.default).level;
      }
    }
    return 2;
  };
  _ctor.prototype.removeSuperWeight = function (t, e, o) {
    if (this._isRemoveSuperWeight || o.length <= 1) {
      return {
        refreshPlantWeight: e,
        combatEqus: o
      };
    }
    var i = o.indexOf($10BattleDataProxy.battleDataProxy.battleData.superPlantId);
    if (i >= 0 && t.findIndex(function (t) {
      return t.plantId == $10BattleDataProxy.battleDataProxy.battleData.superPlantId;
    }) >= 0) {
      $10CommonUtil.CommonUtil.print("刷了一个超武了，不再刷新");
      e.splice(i, 1);
      o.splice(i, 1);
      this._isRemoveSuperWeight = true;
    }
    return {
      refreshPlantWeight: e,
      combatEqus: o
    };
  };
  _ctor.prototype.setSuperNeedRefreshNum = function (t) {
    if (this._superRefreshNum > 1) {
      this._superNeedRefreshNum <= 0 && (this._superNeedRefreshNum = 3);
    } else {
      if (t <= 3) {
        this._superNeedRefreshNum = t;
      } else {
        var e = Math.floor(1e3 * Math.random()) % (t - 3 + 1);
        this._superNeedRefreshNum = e + 3;
      }
      $10CommonUtil.CommonUtil.print("随机超武需要刷新的次数:", this._superNeedRefreshNum);
    }
  };
  _ctor.prototype.orderItems = function () {};
  _ctor.prototype.confirmItemsPos = function (t, e) {
    if (this.node.children.length <= 0) {
      return null;
    }
    var o = [];
    var i = 0;
    var n = [];
    for (var a = 0; a < this.node.children.length; ++a) {
      var r = this.node.children[a];
      if (r != e) {
        n.push(r);
        i += r.width;
      }
    }
    i += 60 * (this.node.children.length - 1 - (e ? 1 : 0));
    var s = 0;
    var c = function (e) {
      var a = n[e];
      s = 0 == e ? -(i / 2 - a.width / 2) : s + 60 + (n[e - 1].width / 2 + a.width / 2);
      var r = null;
      r = Math.floor(a.height / 100) >= 2 ? cc.v3(s, a.height / 2) : cc.v3(s, a.parent.height / 2);
      o.push(r);
      a.getComponent($10EquipmentItem.default).setOriginPosition(r.clone());
      if (t) {
        cc.tween(a).call(function () {
          a.getComponent($10EquipmentItem.default).bAnim = true;
        }).to(.1, {
          position: r.clone()
        }).call(function () {
          a.getComponent($10EquipmentItem.default).bAnim = false;
          a.getComponent($10EquipmentItem.default).setPriceLabIsShow(true);
        }).start();
      } else {
        a.position = r.clone();
      }
    };
    for (var l = 0; l < n.length; ++l) {
      c(l);
    }
    return o;
  };
  _ctor.prototype.createEquipmentItem = function (t, e) {
    var o = this;
    var i = 0;
    var n = t.length;
    var a = {};
    var r = function (r) {
      if (!t[r]) {
        return "continue";
      }
      var s = "prefabItem/" + t[r].itemIdx;
      var c = t[r].plantId;
      c && c >= 10001 && (s = "hybridPlant/" + t[r].itemIdx);
      $10ResUtil.ResUtil.loadAsset({
        path: s,
        type: cc.Prefab,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (s) {
        a["" + r] = s;
        if (Object.keys(a).length >= t.length) {
          for (var c in a) {
            var l = Number(c);
            var p = cc.instantiate(a[l]);
            o.node.addChild(p);
            p.setSiblingIndex(l);
            p.getComponent($10EquipmentItem.default).setIsCollider(false);
            p.getComponent($10EquipmentItem.default).level = t[l].grade;
            if (t[l].hasOwnProperty("adFlag")) {
              p.getComponent($10EquipmentItem.default).adFlag = t[l].adFlag;
            } else {
              var h = t[l].itemIdx;
              p.getComponent($10EquipmentItem.default).adFlag = "Item0_4" == h || "Item0_5" == h || "Item0_6" == h || t[l].grade >= 3;
            }
            cc.Tween.stopAllByTarget(p);
            t[l].anim || cc.tween(p).repeatForever(cc.tween().to(1, {
              scale: .95
            }).to(1, {
              scale: 1
            })).start();
          }
          o.confirmItemsPos();
        }
        if (!e) {
          i++;
          $10UserDataProxy.userDataProxy.userData.curWave;
          if ($10BattleDataProxy.battleDataProxy.isEndless) {
            $10BattleDataProxy.battleDataProxy.endlessCurWave;
          } else {
            $10BattleDataProxy.battleDataProxy.weatherType != $10GameEnum.WeatherType.NONE && $10UserDataProxy.userDataProxy.userData.curWeatherWave;
          }
          i >= n && (o._canRefresh = true);
        }
      }).catch(function (t) {
        console.log("error:", t);
      });
    };
    for (var s = 0; s < t.length; ++s) {
      r(s);
    }
  };
  _ctor.prototype.gmAddEquip = function (t) {
    var e = null;
    if (t.plantId >= 10001) {
      e = {
        itemIdx: "Item" + t.plantId,
        grade: t.level,
        adFlag: t.level > 2,
        plantId: t.plantId
      };
    } else {
      var o = $10DataManager.DataManager.instance.eData.dataplant[t.plantId];
      e = {
        itemIdx: $10GameEnum.EquipmentData[o.prefabKey].name,
        grade: t.level,
        adFlag: t.level > 2,
        plantId: t.plantId
      };
    }
    this.createEquipmentItem([e], true);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_SelectLayout;