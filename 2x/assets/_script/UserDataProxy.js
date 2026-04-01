(function (i) {
  "use strict";

  var n;
  var a = this && this.__extends || (n = function (t, e) {
    return (n = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (t, e) {
      t.__proto__ = e;
    } || function (t, e) {
      for (var o in e) {
        Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
      }
    })(t, e);
  }, function (t, e) {
    function o() {
      this.constructor = t;
    }
    n(t, e);
    t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
  });
  var r = this && this.__read || function (t, e) {
    var o = "function" == typeof Symbol && t[Symbol.iterator];
    if (!o) {
      return t;
    }
    var i;
    var n;
    var a = o.call(t);
    var r = [];
    try {
      for (; (undefined === e || e-- > 0) && !(i = a.next()).done;) {
        r.push(i.value);
      }
    } catch (s) {
      n = {
        error: s
      };
    } finally {
      try {
        i && !i.done && (o = a.return) && o.call(a);
      } finally {
        if (n) {
          throw n.error;
        }
      }
    }
    return r;
  };
  var s = this && this.__values || function (t) {
    var e = "function" == typeof Symbol && Symbol.iterator;
    var o = e && t[e];
    var i = 0;
    if (o) {
      return o.call(t);
    }
    if (t && "number" == typeof t.length) {
      return {
        next: function () {
          t && i >= t.length && (t = undefined);
          return {
            value: t && t[i++],
            done: !t
          };
        }
      };
    }
    throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.userDataProxy = exports.UserDataProxy = exports.UserData = exports.SaveUserDataKey = exports.EUserDataEvent = undefined;
  var c;
  var l = require("GameUIManager");
  var u = require("ProxyBase");
  var p = require("EventManager");
  var h = require("GameEnum");
  var d = require("HomeEnum");
  var m = require("DataManager");
  (function (t) {
    t.POWER_UPDATE = "EUserDataEvent.PowerUpdate";
    t.GOLD_UPDATE = "EUserDataEvent.GoldUpdate";
    t.DIAMOD_UPDATE = "EUserDataEvent.DiamodUpdate";
    t.MANURE_UPDATE = "EUserDataEvent.ManureUpdate";
    t.GM_COMMAND = "GM_COMMAND";
    t.UPDATE_UNLOCK_PLANT = "UPDATE_UNLOCK_PLANT";
    t.UPDATE_WEAR_PLANT = "UPDATE_WEAR_PLANT";
    t.UPDATE_PLANT_LEVEL = "UPDATE_PLANT_LEVEL";
    t.REFRESH_DIAMOND = "REFRESH_DIAMOND";
    t.REFRESH_MONEY = "REFRESH_MONEY";
    t.UPDATE_VIDEO_CARD = "UPDATE_VIDEO_CARD";
    t.UPDATE_LOOP_REWARD_RED = "UPDATE_LOOP_REWARD_RED";
    t.COURSE_OPEN = "COURSE_OPEN";
    t.CLOSE_EQUIP_DETAILS = "CLOSE_EQUIP_DETAILS";
    t.UPDATE_HYBRID_WEAR_PLANT = "UPDATE_HYBRID_WEAR_PLANT";
  })(c = exports.EUserDataEvent || (exports.EUserDataEvent = {}));
  exports.SaveUserDataKey || (exports.SaveUserDataKey = {});
  var exp_UserData = function () {
    this.newPlayer = true;
    this.name = "玩家名字";
    this.gold = 0;
    this.diamond = 0;
    this.power = 0;
    this.manure = 0;
    this.passChapter = 0;
    this.curChapter = 1;
    this.lastLoginTime = 1;
    this.lastPowerTime = 1;
    this.isGetSideBarAward = 0;
    this.sweeping = 0;
    this.loopNum = 0;
    this.videoPower = 0;
    this.passWeatherChapter = 0;
    this.cursWeatherChapter = 1;
    this.combatEqus = [3];
    this.superEquipId = 0;
    this.curWave = 1;
    this.plantLvDatas = [];
    this.propData = [];
    this.refreshNum = 0;
    this.dailyData = {};
    this.passWave = 0;
    this.videoDiamondNum = 0;
    this.videoManureNum = 0;
    this.curWeatherWave = 0;
    this.plantDatas = [];
    this.startGameRights = false;
    this.unlockPlantIds = [];
    this.versionStr = "";
    this.gameCourseData = {
      curId: 0,
      completeId: 0,
      isComplete: false
    };
    this.hybridData = {
      plant1: 0,
      plant2: 0,
      time: 0
    };
    this.gameModel = 1;
    this.newPropDatas = [];
    this.hybridPlantDatas = [];
    this.wearHybridPlantId = 0;
  };
  exports.UserData = exp_UserData;
  var exp_UserDataProxy = function (t) {
    function _ctor() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.mPlantColors = ["#2A6E2E", "#2D438C", "#6B30A6"];
      e.mNewUnlockPlantIds = [];
      e.mOnLineTime = 0;
      e.mIsChangeVersion = false;
      e.mYesterdayRank = 0;
      return e;
    }
    a(_ctor, t);
    Object.defineProperty(_ctor.prototype, "userData", {
      get: function () {
        return this._data;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(_ctor.prototype, "combatEqus", {
      get: function () {
        return this.userData.combatEqus;
      },
      enumerable: false,
      configurable: true
    });
    _ctor.prototype.initData = function () {
      var t = this;
      setInterval(function () {
        t.mOnLineTime++;
        [1, 3, 5, 7, 10, 12, 15, 20, 30].indexOf(t.mOnLineTime) >= 0 && mm.platform.umaTrackEvent("time", {
          userA: "time_" + t.mOnLineTime
        });
      }, 6e4);
      var e = m.DataManager.instance.eData.dataplant;
      var n = exports.userDataProxy.userData.passChapter;
      for (var a = 0; a < this.userData.combatEqus.length; ++a) {
        var r = e[this.userData.combatEqus[a]];
        if (r) {
          r.stageID >= n + 1 && exports.userDataProxy.userData.combatEqus.indexOf(r.id) >= 0 && this.userData.combatEqus.splice(a--, 1);
        } else {
          this.userData.combatEqus.splice(a--, 1);
        }
      }
      if (!(this.userData.versionStr && "" != this.userData.versionStr)) {
        this.userData.versionStr = mm.platform.versionStr;
        this.saveData();
      }
      i.on("unhandledRejection", function (t) {
        console.log("未处理的拒绝:", t);
      });
    };
    _ctor.prototype.getPropDatas = function (t) {
      return this.userData.propData[t] || 0;
    };
    _ctor.prototype.changeGold = function (t) {
      var e = Number(t);
      if (e) {
        this.userData.gold += Math.floor(e);
        this.userData.gold < 0 && (this.userData.gold = 0);
        p.EventManager.instance.emit(c.GOLD_UPDATE);
      } else {
        console.log("changeGold内容不合法！:", t);
      }
    };
    _ctor.prototype.changeDiamond = function (t) {
      var e = Number(t);
      if (e) {
        this.userData.diamond += e;
        this.userData.diamond < 0 && (this.userData.diamond = 0);
        this.saveData();
        p.EventManager.instance.emit(c.DIAMOD_UPDATE);
      } else {
        console.log("changeDiamond内容不合法！:", t);
      }
    };
    _ctor.prototype.updatePower = function (t) {
      var e = Number(t);
      if (e) {
        exports.userDataProxy.userData.power += e;
        exports.userDataProxy.userData.power < 0 && (exports.userDataProxy.userData.power = 0);
        this.saveData();
        p.EventManager.instance.emit(c.POWER_UPDATE);
      } else {
        console.log("updatePower内容不合法！:", t);
      }
    };
    _ctor.prototype.changeManure = function (t) {
      var e = Number(t);
      if (e) {
        this.userData.manure += e;
        this.userData.manure < 0 && (this.userData.manure = 0);
        this.saveData();
        p.EventManager.instance.emit(c.MANURE_UPDATE);
      } else {
        console.log("changeManure内容不合法！:", t);
      }
    };
    _ctor.prototype.saveData = function (t) {
      m.DataManager.instance.writeGameDataBase("UserData", this.userData, t);
    };
    _ctor.prototype.resetData = function (t) {
      var e = this.userData.startGameRights;
      this._data = new exp_UserData();
      this._data.startGameRights = e;
      this.saveData(t);
    };
    _ctor.prototype.newDataReset = function () {
      this.userData.sweeping = 0;
      this.userData.videoPower = 0;
      this.userData.refreshNum = 0;
      this.userData.dailyData = {};
      this.userData.refreshNum = 0;
      this.userData.videoDiamondNum = 0;
      this.userData.videoManureNum = 0;
      if (exports.userDataProxy.userData.boxData) {
        this.userData.boxData.cdTime = 0;
        this.userData.boxData.bigState = 0;
      } else {
        exports.userDataProxy.userData.boxData = {
          cdTime: 0,
          bigState: 0,
          level: 1,
          exp: 0
        };
      }
      this.userData.goldData = {
        videoNum: 0,
        mfNum: 0
      };
      if (exports.userDataProxy.userData.endlessData) {
        this.userData.endlessData.maxWave = 0;
        this.userData.endlessData.isReceive = 0;
        exports.userDataProxy.userData.endlessData.playNum = Number(m.DataManager.instance.eData.datapara[1001].num);
      } else {
        exports.userDataProxy.userData.endlessData = {
          maxWave: 0,
          isReceive: 0,
          myRank: 0,
          playNum: Number(m.DataManager.instance.eData.datapara[1001].num)
        };
      }
      this.saveData();
      mm.platform.umaTrackEvent("dau", {
        userA: "dau"
      });
    };
    _ctor.prototype.getAward = function (t) {
      for (var e = 0; e < t.length; ++e) {
        var o = t[e];
        if (1 == o.id) {
          this.changeDiamond(o.num);
        } else if (!(2 == o.id)) {
          if (3 == o.id) {
            this.changeGold(o.num);
          } else {
            3001 == o.id || o.id;
          }
        }
      }
    };
    _ctor.prototype.showCourse = function (t) {
      return !(t.courseId > 27) && (this.checkCourseCanOpen(t.courseId) ? (l.gameUIMgr.showCoursePopup(t), true) : undefined);
    };
    _ctor.prototype.checkCourseIsComplete = function (t) {
      if (this.checkCourseCanOpen(t)) {
        return true;
      }
    };
    _ctor.prototype.checkCourseCanOpen = function (t) {
      var e = this.userData.gameCourseData;
      return !e.isComplete && t == e.curId + 1;
    };
    _ctor.prototype.completeCourse = function (t) {
      var e = this.userData.gameCourseData;
      if (t != e.curId + 1) {
        return false;
      }
      e.completeId = t;
      e.curId = t;
      var o = t + 1;
      m.DataManager.instance.eData.datagameguid[e.curId] || (e.isComplete = true);
      this.saveData();
      p.EventManager.instance.emit(c.COURSE_OPEN, o);
      return true;
    };
    _ctor.prototype.getPlantData = function (t) {
      for (var e = 0; e < this.userData.plantDatas.length; ++e) {
        var o = this.userData.plantDatas[e];
        if (o.id == t) {
          return o;
        }
      }
      return {
        id: t,
        lv: 1
      };
    };
    _ctor.prototype.updatePlantLv = function (t, e) {
      for (var o = 0; o < this.userData.plantDatas.length; ++o) {
        var i = this.userData.plantDatas[o];
        if (i.id == t) {
          return void (i.lv = e);
        }
      }
      this.userData.plantDatas.push({
        id: t,
        lv: e
      });
      this.saveData();
    };
    _ctor.prototype.updateHybridPlantLv = function (t, e) {
      for (var o = 0; o < this.userData.hybridPlantDatas.length; ++o) {
        var i = this.userData.hybridPlantDatas[o];
        if (i.plantId == t) {
          return void (i.lv = e);
        }
      }
      this.userData.hybridPlantDatas.push({
        plantId: t,
        lv: e
      });
      this.saveData();
    };
    _ctor.prototype.getWeightAwards = function (t, e) {
      var o = [];
      for (var i = 0; i < e && !(t.length <= 0); i++) {
        var n = this.getWeightAward(t);
        for (var a = 0; a < t.length; a++) {
          if (t[a].id == n.id) {
            t.splice(a, 1);
            break;
          }
        }
        o.push(n);
      }
      return o;
    };
    _ctor.prototype.getWeightAward = function (t) {
      var e;
      t.sort(function (t, e) {
        return t.weight - e.weight;
      });
      var o = (e = this.arrWeightAdd(t))[e.length - 1].weight;
      var i = Math.random() * o;
      return this.getRadomAward(i, e);
    };
    _ctor.prototype.arrWeightAdd = function (t) {
      if (!t || t.length <= 0) {
        return [];
      }
      var e = [];
      for (var o = 0; o < t.length; o++) {
        if (0 == o) {
          e[o] = t[o];
        } else {
          e[o] = t[o];
          e[o].weight = e[o - 1].weight + t[o].weight;
        }
      }
      return e;
    };
    _ctor.prototype.getRadomAward = function (t, e) {
      if (1 == e.length) {
        return e[0].id;
      }
      var o = 0;
      if (t <= e[0].weight) {
        return e[o];
      }
      if (t >= e[e.length - 1].weight) {
        return e[o = e.length - 1];
      }
      for (var i = 0; i < e.length; i++) {
        if (t <= e[i].weight) {
          o = i;
        } else {
          if (t > e[i].weight && t <= e[i + 1].weight) {
            o = i + 1;
            break;
          }
          if (t > e[i].weight && t <= e[i + 1].weight) {
            o = i + 1;
            break;
          }
        }
      }
      return e[o];
    };
    _ctor.prototype.checkBoxRetrunAwards = function (t) {
      var e;
      var o;
      var i = [];
      var n = 0;
      for (var a = t.length; n < a; n++) {
        var c = m.DataManager.instance.eData.dataitem[t[n].id];
        if (c) {
          if (c.type == h.ItemType.BOX) {
            var l = m.DataManager.instance.eData.databox[t[n].id];
            if (!l) {
              continue;
            }
            if (l.type == h.BoxType.FIXED) {
              var u = l.reward.split("_");
              for (var p = 0; p < t[n].num; p++) {
                i.push({
                  id: u[0],
                  num: Number(u[0])
                });
              }
            } else if (l.type == h.BoxType.RADOM) {
              var d = l.reward.split("|");
              var f = l.weight.split("|");
              var y = [];
              for (var g = 0; g < d.length; g++) {
                var _ = r(d[g].split("_"), 2);
                var v = _[0];
                var b = _[1];
                v && b && y.push({
                  id: parseInt(v, 10),
                  num: parseInt(b, 10),
                  weight: parseInt(f[g], 10)
                });
              }
              var P = null;
              for (p = 0; p < t[n].num; p++) {
                if ((P = this.getWeightAwards(JSON.parse(JSON.stringify(y)), 1)).length > 0) {
                  var D = P[0];
                  i.push({
                    id: D.id,
                    num: D.num
                  });
                }
              }
            }
          } else {
            i.push({
              id: t[n].id,
              num: t[n].num
            });
          }
        }
      }
      var S = {};
      try {
        var E = s(i);
        for (var C = E.next(); !C.done; C = E.next()) {
          var B = C.value;
          if (S[B.id]) {
            S[B.id] += B.num;
          } else {
            S[B.id] = B.num;
          }
        }
      } catch (w) {
        e = {
          error: w
        };
      } finally {
        try {
          C && !C.done && (o = E.return) && o.call(E);
        } finally {
          if (e) {
            throw e.error;
          }
        }
      }
      var x = [];
      for (var M in S) {
        x.push({
          id: M,
          num: S[M]
        });
      }
      return x;
    };
    _ctor.prototype.getWearItemIsUnlock = function (t) {
      if (t < Number(m.DataManager.instance.eData.datapara[34].num)) {
        return {
          isUnlock: true,
          unlockChapter: 0
        };
      }
      var e = exports.userDataProxy.userData.passChapter;
      if (2 == t) {
        var i = Number(m.DataManager.instance.eData.datapara[35].num);
        return {
          isUnlock: e >= i,
          unlockChapter: i
        };
      }
      if (1 == t) {
        var n = Number(m.DataManager.instance.eData.datapara[43].num);
        return {
          isUnlock: e >= n,
          unlockChapter: n
        };
      }
      var a = Number(m.DataManager.instance.eData.datapara[36].num);
      return {
        isUnlock: e >= a,
        unlockChapter: a
      };
    };
    _ctor.prototype.addProp = function (t, e, o) {
      undefined === o && (o = true);
      if (1 != t) {
        if (2 != t) {
          if (3 != t) {
            if (9 != t) {
              if (t >= 2001) {
                this.addNewProp(t, e);
              } else {
                var i = this.userData.propData;
                if (i[t]) {
                  i[t] += e;
                } else {
                  i[t] = e;
                }
                if (!(6 == t)) {
                  if (t >= 1001 && t <= 1014) {
                    p.EventManager.instance.emit(d.EHomeEvent.UPDATE_HOME_REDDOT, [d.HOME_REDDOT.PLANTRED]);
                  } else {
                    5 == t || 2001 == t || 2002 == t || 4 == t && p.EventManager.instance.emit(c.UPDATE_VIDEO_CARD);
                  }
                }
                this.saveData();
              }
            } else {
              this.changeManure(e);
            }
          } else {
            this.updatePower(e);
          }
        } else {
          this.changeDiamond(e);
        }
      } else {
        this.changeGold(e);
      }
    };
    _ctor.prototype.getProp = function (t) {
      if (t >= 2001) {
        return this.getNewProp(t);
      } else {
        return 0 | this.userData.propData[t];
      }
    };
    _ctor.prototype.addNewProp = function (t, e) {
      this.userData.newPropDatas || (this.userData.newPropDatas = []);
      var o = this.userData.newPropDatas.findIndex(function (e) {
        return e.propId == t;
      });
      if (o >= 0) {
        this.userData.newPropDatas[o].num += e;
      } else {
        this.userData.newPropDatas.push({
          propId: t,
          num: e
        });
      }
      this.saveData();
    };
    _ctor.prototype.getNewProp = function (t) {
      var e;
      this.userData.newPropDatas || (this.userData.newPropDatas = []);
      var o = this.userData.newPropDatas.findIndex(function (e) {
        return e.propId == t;
      });
      return o >= 0 && (null === (e = this.userData.newPropDatas[o]) || undefined === e ? undefined : e.num) || 0;
    };
    _ctor.prototype.getIsUnlockPlant = function (t) {
      return !(this.userData.unlockPlantIds.indexOf(t) < 0 && (this.userData.unlockPlantIds.push(t), this.saveData(), 1));
    };
    _ctor.prototype.getHybridAllStar = function () {
      var t = 0;
      for (var e = 0; e < this.userData.hybridPlantDatas.length; ++e) {
        t += this.userData.hybridPlantDatas[e].lv;
      }
      return t;
    };
    return _ctor;
  }(u.ProxyBase);
  exports.UserDataProxy = exp_UserDataProxy;
  exports.userDataProxy = new exp_UserDataProxy(exp_UserData);
}).call(this, require("5"));