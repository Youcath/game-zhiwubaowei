Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimationCfgMgr = undefined;
var $10BattleDataProxy = require("BattleDataProxy");
var exp_AnimationCfgMgr = function () {
  function _ctor() {}
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == this._instance && (this._instance = new _ctor());
      return this._instance;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.getAnimationCfg = function (t) {
    if (4 == t.type) {
      if (4001 == t.id) {
        return this.getEnemy4001Cfg();
      } else {
        if (4002 == t.id) {
          return this.getEnemy4002Cfg();
        } else {
          if (4003 == t.id) {
            return this.getEnemy4003Cfg();
          } else {
            if (4004 == t.id) {
              return this.getEnemy4004Cfg();
            } else {
              if (4005 == t.id) {
                return this.getEnemy4005Cfg();
              } else {
                if (4006 == t.id) {
                  return this.getEnemy4006Cfg();
                } else {
                  return [];
                }
              }
            }
          }
        }
      }
    }
    var e = [];
    var o = t.modeName + "_die_";
    var i = t.modeName + "_move_";
    var n = "textures/monster/" + t.modeName;
    var a = t.frame.split("|").map(Number);
    e.push({
      actionName: "move",
      frameNum: a[1],
      bundleName: "Game",
      spriteFrameNameHead: i,
      path: n,
      frameEventIndexs: [1]
    }, {
      actionName: "die",
      frameNum: a[0],
      bundleName: "Game",
      spriteFrameNameHead: o,
      path: n
    });
    var r = t.atkFrame;
    if ("0" != r) {
      var s = r.split("|").map(Number);
      if (s.length < 2) {
        e.push({
          actionName: "atk",
          frameNum: s[0],
          bundleName: "Game",
          spriteFrameNameHead: t.modeName + "_atk_",
          path: n,
          frameEventIndexs: [1]
        });
      } else {
        for (var c = 0; c < s.length; ++c) {
          var l = s[c];
          e.push({
            actionName: "atk" + c,
            frameNum: l,
            bundleName: "Game",
            spriteFrameNameHead: t.modeName + "_atk" + (c + 1) + "_",
            path: n,
            frameEventIndexs: [1]
          });
        }
      }
    }
    return e;
  };
  _ctor.prototype.getBulletHitCfg = function (t, e, o) {
    undefined === o && (o = false);
    var n = 10;
    var a = "";
    if (o || $10BattleDataProxy.battleDataProxy.getIsSuperPlant(t) && t < 10001) {
      if (3 == t) {
        n = 13;
      } else if (4 == t) {
        n = 15;
      } else if (7 == t) {
        n = 19;
      } else if (11 == t) {
        n = 20;
      } else if (12 == t) {
        n = 22;
      } else if (14 == t) {
        n = 13;
      } else {
        15 == t && (n = 12);
      }
      a = "CWzidan" + t + "_liekai_";
    } else {
      if (4 == t) {
        n = 14;
      } else if (11 == t) {
        n = 17;
      } else if (12 == t) {
        n = 22;
      } else if (13 == t) {
        n = 12;
      } else if (14 == t) {
        n = 13;
      } else if (15 == t) {
        n = 12;
      } else if (10001 == t || 10002 == t || 10004 == t || 10008 == t) {
        n = 15;
      } else if (10006 == t || 10009 == t || 10012 == t) {
        n = 12;
      } else if (10007 == t) {
        n = 18;
      } else if (10010 == t) {
        n = 14;
      } else {
        10011 == t && (n = 10);
      }
      a = "zidan" + t + "_liekai_";
    }
    var r = "textures/bulletHit/BulletHit";
    t >= 10001 && (r = "textures/bulletHit/BulletHit1");
    var s = [];
    s.push({
      actionName: "bulletHit",
      frameNum: n,
      bundleName: "Game",
      spriteFrameNameHead: a,
      path: r,
      frameEventIndexs: [1]
    });
    return s;
  };
  _ctor.prototype.getBulletBoom = function () {
    var t = [];
    t.push({
      actionName: "bulletBoom",
      frameNum: 15,
      bundleName: "Game",
      spriteFrameNameHead: "bullet_boom_",
      path: "textures/bulletHit/BulletHit",
      frameEventIndexs: [1]
    });
    return t;
  };
  _ctor.prototype.getDizzinessEffect = function () {
    var t = [];
    t.push({
      actionName: "dizziness",
      frameNum: 21,
      bundleName: "Game",
      spriteFrameNameHead: "dizziness_",
      path: "textures/dizziness",
      frameEventIndexs: [1]
    });
    return t;
  };
  _ctor.prototype.getRushEffect = function () {
    var t = [];
    t.push({
      actionName: "rush",
      frameNum: 2,
      bundleName: "Game",
      spriteFrameNameHead: "benpao_",
      path: "textures/benPao",
      frameEventIndexs: [1]
    });
    return t;
  };
  _ctor.prototype.getEnemyBoomDie = function () {
    var t = [];
    t.push({
      actionName: "boomDie",
      frameNum: 44,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_boomDie_",
      path: "textures/monster/boomDie",
      frameEventIndexs: [1]
    });
    return t;
  };
  _ctor.prototype.getEarthSoilEffect = function () {
    var t = [];
    t.push({
      actionName: "earthSoil",
      frameNum: 35,
      bundleName: "Game",
      spriteFrameNameHead: "nitu_",
      path: "textures/monster/zombie_SP1",
      frameEventIndexs: [1]
    });
    return t;
  };
  _ctor.prototype.getEnemy4001Cfg = function () {
    var t = [];
    t.push({
      actionName: "move",
      frameNum: 40,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP1_move_",
      path: "textures/monster/zombie_SP1",
      frameEventIndexs: [1]
    }, {
      actionName: "atk",
      frameNum: 15,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP1_atk_",
      path: "textures/monster/zombie_SP1",
      frameEventIndexs: [1]
    }, {
      actionName: "die",
      frameNum: 35,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP1_die_",
      path: "textures/monster/zombie_SP1",
      frameEventIndexs: [1]
    }, {
      actionName: "stop",
      frameNum: 45,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP1_stop_",
      path: "textures/monster/zombie_SP1",
      frameEventIndexs: [1]
    }, {
      actionName: "move2",
      frameNum: 32,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP1_move_zuandi_",
      path: "textures/monster/zombie_SP1",
      frameEventIndexs: [1]
    });
    return t;
  };
  _ctor.prototype.getEnemy4002Cfg = function () {
    var t = [];
    t.push({
      actionName: "move",
      frameNum: 40,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP2_move_shiti_",
      path: "textures/monster/zombie_SP2",
      frameEventIndexs: [1]
    }, {
      actionName: "atk",
      frameNum: 15,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP2_atk_",
      path: "textures/monster/zombie_SP2",
      frameEventIndexs: [1]
    }, {
      actionName: "die",
      frameNum: 30,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP2_die_",
      path: "textures/monster/zombie_SP2",
      frameEventIndexs: [1]
    }, {
      actionName: "show",
      frameNum: 40,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP2_xianxing_",
      path: "textures/monster/zombie_SP2",
      frameEventIndexs: [1]
    }, {
      actionName: "move2",
      frameNum: 40,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP2_move_xuti_",
      path: "textures/monster/zombie_SP2",
      frameEventIndexs: [1]
    }, {
      actionName: "hide",
      frameNum: 40,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP2_yinshen_",
      path: "textures/monster/zombie_SP2",
      frameEventIndexs: [1]
    }, {
      actionName: "atk2",
      frameNum: 15,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP2_atk_xuti_",
      path: "textures/monster/zombie_SP2",
      frameEventIndexs: [1]
    });
    return t;
  };
  _ctor.prototype.getEnemy4003Cfg = function () {
    var t = [];
    t.push({
      actionName: "move",
      frameNum: 40,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP3_move_",
      path: "textures/monster/zombie_SP3",
      frameEventIndexs: [1]
    }, {
      actionName: "atk",
      frameNum: 15,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP3_atk_",
      path: "textures/monster/zombie_SP3",
      frameEventIndexs: [1]
    }, {
      actionName: "die",
      frameNum: 22,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP3_die_",
      path: "textures/monster/zombie_SP3",
      frameEventIndexs: [1]
    }, {
      actionName: "jumpAtk",
      frameNum: 16,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP3_atk_tiaotiao_",
      path: "textures/monster/zombie_SP3",
      frameEventIndexs: [1]
    }, {
      actionName: "move2",
      frameNum: 13,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP3_move_tiaotiao_",
      path: "textures/monster/zombie_SP3",
      frameEventIndexs: [1]
    }, {
      actionName: "vehiclesDestroy",
      frameNum: 20,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP3_hit_",
      path: "textures/monster/zombie_SP3",
      frameEventIndexs: [1]
    });
    return t;
  };
  _ctor.prototype.getEnemy4004Cfg = function () {
    var t = [];
    t.push({
      actionName: "move",
      frameNum: 40,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP4_move_",
      path: "textures/monster/zombie_SP4",
      frameEventIndexs: [1]
    }, {
      actionName: "atk",
      frameNum: 20,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP4_atk_",
      path: "textures/monster/zombie_SP4",
      frameEventIndexs: [1]
    }, {
      actionName: "die",
      frameNum: 24,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP4_fuhuo_die_",
      path: "textures/monster/zombie_SP4",
      frameEventIndexs: [1]
    }, {
      actionName: "atk2",
      frameNum: 15,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP4_fuhuo_atk_",
      path: "textures/monster/zombie_SP4",
      frameEventIndexs: [1]
    }, {
      actionName: "move2",
      frameNum: 20,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP4_fuhuo_move_",
      path: "textures/monster/zombie_SP4",
      frameEventIndexs: [1]
    }, {
      actionName: "fuhuo",
      frameNum: 23,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP4_fuhuo_",
      path: "textures/monster/zombie_SP4",
      frameEventIndexs: [1]
    }, {
      actionName: "fuhuozhong",
      frameNum: 65,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP4_fuhuoing_",
      path: "textures/monster/zombie_SP4",
      frameEventIndexs: [1]
    }, {
      actionName: "die2",
      frameNum: 45,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP4_die_",
      path: "textures/monster/zombie_SP4",
      frameEventIndexs: [1]
    });
    return t;
  };
  _ctor.prototype.getEnemy4005Cfg = function () {
    var t = [];
    t.push({
      actionName: "move",
      frameNum: 32,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP5_move1_",
      path: "textures/monster/zombie_SP5",
      frameEventIndexs: [1]
    }, {
      actionName: "atk",
      frameNum: 15,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP5_atk_",
      path: "textures/monster/zombie_SP5",
      frameEventIndexs: [1]
    }, {
      actionName: "die",
      frameNum: 22,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP5_die_",
      path: "textures/monster/zombie_SP5",
      frameEventIndexs: [1]
    }, {
      actionName: "move2",
      frameNum: 32,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP5_move2_",
      path: "textures/monster/zombie_SP5",
      frameEventIndexs: [1]
    });
    return t;
  };
  _ctor.prototype.getEnemy4006Cfg = function () {
    var t = [];
    t.push({
      actionName: "move",
      frameNum: 32,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP6_move1_",
      path: "textures/monster/zombie_SP6",
      frameEventIndexs: [1]
    }, {
      actionName: "die",
      frameNum: 22,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP6_die_",
      path: "textures/monster/zombie_SP6",
      frameEventIndexs: [1]
    }, {
      actionName: "move2",
      frameNum: 32,
      bundleName: "Game",
      spriteFrameNameHead: "zombie_SP6_move2_",
      path: "textures/monster/zombie_SP6",
      frameEventIndexs: [1]
    });
    return t;
  };
  _ctor.prototype.getGTBulletHit = function (t) {
    switch (t) {
      case "CWzidan1_2":
        (e = []).push({
          actionName: "liekai2",
          frameNum: 10,
          bundleName: "res_GuardingTheBridge",
          spriteFrameNameHead: "CWzidan1_liekai2_",
          path: "textrues/bulletHit",
          frameEventIndexs: []
        });
        return e;
      case "CWzidan8_2":
        (e = []).push({
          actionName: "liekai2",
          frameNum: 13,
          bundleName: "res_GuardingTheBridge",
          spriteFrameNameHead: "CWzidan8_liekai2_",
          path: "textrues/bulletHit",
          frameEventIndexs: []
        });
        return e;
      case "CWzidan11_2":
        var e;
        (e = []).push({
          actionName: "liekai2",
          frameNum: 13,
          bundleName: "res_GuardingTheBridge",
          spriteFrameNameHead: "CWzidan11_liekai2_",
          path: "textrues/bulletHit",
          frameEventIndexs: []
        });
        return e;
    }
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.AnimationCfgMgr = exp_AnimationCfgMgr;