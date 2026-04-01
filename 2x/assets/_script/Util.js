Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HurtType = undefined;
var i;
var $10CommonUtil = require("CommonUtil");
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10NodePoolManager = require("NodePoolManager");
(function (t) {
  t[t.NORMAL = 0] = "NORMAL";
  t[t.CRIT = 1] = "CRIT";
  t[t.RECOVERY = 2] = "RECOVERY";
})(i = exports.HurtType || (exports.HurtType = {}));
var def_Util = function () {
  function _ctor() {}
  _ctor.getClassName = function (e) {
    if ("function" == typeof e) {
      var o = e.prototype;
      if (o && o.hasOwnProperty("__classname__") && o.__classname__) {
        return o.__classname__;
      }
      var i = "";
      e.name && (i = e.name);
      if (e.toString) {
        var n;
        var a = e.toString();
        (n = "[" === a.charAt(0) ? a.match(/\[\w+\s*(\w+)\]/) : a.match(/function\s*(\w+)/)) && 2 === n.length && (i = n[1]);
      }
      if ("Object" !== i) {
        return i;
      } else {
        return "";
      }
    }
    if (e && e.constructor) {
      return _ctor.getClassName(e.constructor);
    } else {
      return "";
    }
  };
  _ctor.numberEnumToArray = function (t) {
    var e = Object.values(t);
    return e.filter(function (t) {
      return "number" == typeof t;
    });
  };
  _ctor.deepCloneObj = function (e) {
    var o = Array.isArray(e) ? [] : {};
    for (var i in e) {
      var n = e[i];
      if (n) {
        if (n instanceof Function) {
          o[i] = new Function("return" + n.toString())();
        } else {
          o[i] = "object" == typeof n ? _ctor.deepCloneObj(n) : n;
        }
      }
    }
    return o;
  };
  _ctor.addButtonListener = function (t, e, o, i, n) {
    var a = t.getComponent(cc.Button) || t.addComponent(cc.Button);
    var r = new cc.Component.EventHandler();
    r.component = e;
    r.handler = o;
    r.target = i;
    r.customEventData = n;
    a.clickEvents.splice(0, a.clickEvents.length);
    a.clickEvents.push(r);
  };
  _ctor.addToggleListener = function (t, e, o, i, n) {
    var a = t.getComponent(cc.Toggle) || t.addComponent(cc.Toggle);
    var r = new cc.Component.EventHandler();
    r.component = e;
    r.handler = o;
    r.target = i;
    r.customEventData = n;
    a.clickEvents.splice(0, a.clickEvents.length);
    a.clickEvents.push(r);
  };
  _ctor.shake = function (t, e, o, i, n) {
    undefined === e && (e = 1);
    undefined === o && (o = .08);
    undefined === i && (i = 2);
    cc.Tween.stopAllByTarget(t);
    t.position = cc.Vec3.ZERO;
    cc.tween(t).by(o / 2, {
      position: cc.v3(e, 0, 0)
    }).by(o / 2, {
      position: cc.v3(-e, 0, 0)
    }).by(o / 2, {
      position: cc.v3(0, -e, 0)
    }).by(o / 2, {
      position: cc.v3(0, e, 0)
    }).by(o / 2, {
      position: cc.v3(-e, 0, 0)
    }).by(o / 2, {
      position: cc.v3(e, 0, 0)
    }).by(o / 2, {
      position: cc.v3(0, e, 0)
    }).by(o / 2, {
      position: cc.v3(0, -e, 0)
    }).union().repeat(i).call(function () {
      n && n();
    }).start();
  };
  _ctor.getTimeFormat = function (t, e) {
    if (t < 60) {
      return "%0s秒";
    } else {
      if (t < 3600) {
        return "%0m分%0s秒";
      } else {
        if (t < 86400) {
          if (e) {
            return "%0h:%0m:%0s";
          } else {
            return "%h小时";
          }
        } else {
          return "%d天";
        }
      }
    }
  };
  _ctor.setSpriteNormalMaterial = function (t) {
    t.setMaterial(0, cc.Material.getBuiltinMaterial("2d-sprite"));
  };
  _ctor.setSpriteGrayMaterial = function (t) {
    t.setMaterial(0, cc.Material.getBuiltinMaterial("2d-gray-sprite"));
  };
  _ctor.nodeWorldPos = function (t) {
    return t.convertToWorldSpaceAR(cc.v3());
  };
  _ctor.nodeLocalPos = function (t, e) {
    return t.convertToNodeSpaceAR(e);
  };
  _ctor.nodeParentChangeLocalPos = function (e, o) {
    var i = _ctor.nodeWorldPos(e);
    return _ctor.nodeLocalPos(o, i);
  };
  _ctor.delay = function (t, e, o) {
    var i = setTimeout(function () {
      clearTimeout(i);
      e && e.call(o);
    }, 1e3 * t);
    return i;
  };
  _ctor.promiseDelay = function (t, e, o) {
    return new Promise(function (i) {
      var n = setTimeout(function () {
        clearTimeout(n);
        e && e.call(o);
        i();
      }, 1e3 * t);
    });
  };
  _ctor.getAnimationTimeByName = function (t, e) {
    var o = t.getState();
    if (null == o) {
      throw "[ERROR SPINE ANIMATION] 无法获取获取动画状态>";
    }
    var i = o.data.skeletonData.animations;
    var n = 0;
    for (var a in i) {
      if (Object.prototype.hasOwnProperty.call(i, a)) {
        var r = i[a];
        r.name == e && (n = r.duration);
      }
    }
    return n;
  };
  _ctor.sumArray = function (t) {
    return t.reduce(function (t, e) {
      return t + e;
    }, 0);
  };
  _ctor.checkSpecialCharacters = function (t) {
    return /[.*+?#$\[\]{}()|\\/<:;'"<>!=,!\-_`|]/.test(t);
  };
  _ctor.getMapKey = function (t, e) {
    t += 4096;
    e += 4096;
    var o = Math.floor(e / 100);
    var i = Math.floor(t / 100);
    return {
      key: o + "|" + i,
      row: o,
      col: i
    };
  };
  _ctor.showHurt = function (t, e, o, l, u, p) {
    var h = this;
    if (t) {
      t = Math.abs(t);
      $10ResUtil.ResUtil.loadAsset({
        bundleName: $10HomeEnum.Bundles.GAME,
        path: "prefabs/root/HurtLabel",
        type: cc.Prefab
      }).then(function (n) {
        var r = $10NodePoolManager.default.instance.getNode(n);
        r.getChildByName("miss").active = false;
        r.getChildByName("Num").active = true;
        r.getChildByName("Num").getComponent(cc.Label).string = $10MathUtil.MathUtil.formatNumber(t);
        r.opacity = 255;
        r.position = o;
        switch (e) {
          case i.CRIT:
            r.getChildByName("Num").color = cc.Color.RED;
            break;
          case i.RECOVERY:
            r.getChildByName("Num").color = cc.Color.GREEN;
            break;
          default:
            r.getChildByName("Num").color = cc.Color.WHITE;
        }
        u.addChild(r);
        h.playHurtEffect(r, function () {
          p && p.isValid && -1 != p.name.indexOf("Enemy") && p.getComponent("EnemyBase").removeHurtItemNode(r);
          $10NodePoolManager.default.instance.putNode(r);
        }, l, e);
        p && p.isValid && -1 != p.name.indexOf("Enemy") && p.getComponent("EnemyBase").updateHurtItemNode(r);
      }).catch(function (t) {
        $10CommonUtil.CommonUtil.print(t);
      });
    }
  };
  _ctor.showMiss = function (t, e, o, i) {
    var a = this;
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.GAME,
      path: "prefabs/root/HurtLabel",
      type: cc.Prefab
    }).then(function (n) {
      var r = $10NodePoolManager.default.instance.getNode(n);
      r.getChildByName("miss").active = true;
      r.getChildByName("Num").active = false;
      r.opacity = 255;
      r.position = t;
      o.addChild(r);
      a.playHurtEffect(r, function () {
        i && i.isValid && -1 != i.name.indexOf("Enemy") && i.getComponent("EnemyBase").removeHurtItemNode(r);
        $10NodePoolManager.default.instance.putNode(r);
      }, e, 1);
      i && i.isValid && -1 != i.name.indexOf("Enemy") && i.getComponent("EnemyBase").updateHurtItemNode(r);
    }).catch(function (t) {
      $10CommonUtil.CommonUtil.print(t);
    });
  };
  _ctor.playHurtEffect = function (t, e, o, n) {
    var a = this;
    t.opacity = 255;
    t.scale = 1;
    var r = cc.sequence(cc.delayTime(.4), cc.fadeOut(.25));
    var s = cc.moveBy(.15, cc.v2(0, 60));
    var c = cc.moveBy(.1, cc.v2(0, -10));
    var l = cc.scaleTo(.15, i.CRIT ? 1.8 : 1.5);
    var u = cc.scaleTo(.075, 1.2);
    var p = cc.sequence(l, u);
    var h = l;
    t.runAction(cc.sequence(cc.spawn(n == i.NORMAL ? p : h, s), cc.callFunc(function () {
      o.pushDamageNumberObject(a);
    }), c, r, cc.callFunc(function () {
      o && o.isValid && o.removeDamageNumberObject(a);
      e && e();
    })));
  };
  _ctor.getRotationAngle = function (t, e) {
    var o = Math.atan2(e.y - t.y, e.x - t.x);
    if (o < 0) {
      o += 2 * Math.PI;
    } else {
      o > 2 * Math.PI && (o -= 2 * Math.PI);
    }
    return 180 * o / Math.PI;
  };
  _ctor.formatNumToString = function (t, e) {
    undefined === e && (e = 1);
    if (t >= 1e3) {
      var o = t / 1e3;
      var i = t % 1e3;
      var n = Math.min(i ? Math.min(e, String(i).length - 1) : 0, 2);
      var a = o.toFixed(n);
      a.endsWith(".0") && (a = a.slice(0, -2));
      return a + "k";
    }
    return t.toString();
  };
  _ctor.formatTimeMS = function (t, e, o) {
    var i;
    undefined === o && (o = ":");
    var n = function (t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    };
    var a = new Date();
    var r = a.getTimezoneOffset();
    a.setTime(t + 6e4 * r);
    var s = a.getDate() - 1;
    var c = a.getHours() + 24 * s;
    var l = a.getMinutes();
    var u = a.getSeconds();
    if (1 == e) {
      i = "" + n(c) + o + n(l) + o + n(u);
    } else if (2 == e) {
      i = n(c) + "时" + n(l) + "分" + n(u) + "秒";
    } else if (3 == e) {
      i = c > 0 ? "" + n(c) + o : "";
      i += "" + n(l) + o + n(u);
    } else if (4 == e) {
      i = c > 0 ? n(c) + "时" : "", i += n(l) + "分" + n(u) + "秒";
    }
    return i;
  };
  _ctor.getNextDayZeroTimestamp = function () {
    return new Date(Date.now() + 864e5).setHours(0, 0, 0, 0);
  };
  _ctor.convertToTargetNodeSpace = function (t, e) {
    if (!t || !t.isValid) {
      return cc.v3(0, 0);
    }
    if (!e || !e.isValid) {
      return cc.v3(0, 0);
    }
    var o = t.convertToWorldSpaceAR(cc.v2(0, 0));
    var i = e.parent.convertToNodeSpaceAR(o);
    return cc.v3(i);
  };
  _ctor.getQuilityName = function (t) {
    switch (t) {
      case 1:
        return "一般";
      case 2:
        return "稀有";
      case 3:
        return "英雄";
      case 4:
        return "传说";
    }
    return "";
  };
  _ctor.getGradeName = function (t) {
    var e = "";
    switch (t) {
      case 1:
        e = "普通";
        break;
      case 2:
      case 3:
        e = "稀有";
        break;
      case 4:
        e = "史诗";
        break;
      case 5:
        e = "传说";
    }
    return e;
  };
  _ctor.retainTowPlaces = function (t) {
    return t.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  };
  _ctor.getRandomNum = function (t, e, o) {
    undefined === o && (o = true);
    var i = e - t;
    var n = Math.random() * i + t;
    o && (n = Math.round(n));
    return n;
  };
  _ctor.randSortArray = function (t) {
    return t.sort(function () {
      return .5 - Math.random();
    });
  };
  _ctor.getTimeLeftTime = function (t, e) {
    return e - (Date.now() - t);
  };
  return _ctor;
}();
exports.default = def_Util;