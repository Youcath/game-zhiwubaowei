Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeUtil = exports.DAY_TIMESTAMPS = exports.HOUR_TIMESTAMPS = exports.MINUTE_TIMESTAMPS = exports.SECOND_TIMESTAMPS = undefined;
exports.SECOND_TIMESTAMPS = 1e3;
exports.MINUTE_TIMESTAMPS = 60 * exports.SECOND_TIMESTAMPS;
exports.HOUR_TIMESTAMPS = 60 * exports.MINUTE_TIMESTAMPS;
exports.DAY_TIMESTAMPS = 24 * exports.HOUR_TIMESTAMPS;
var exp_TimeUtil = function () {
  function _ctor() {}
  Object.defineProperty(_ctor, "useLocalDate", {
    set: function (t) {
      this._useLocalDate = t;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.updateServerTime = function (t) {
    if (!this._useLocalDate) {
      this._diff = t - new Date().getTime();
      if (t || 0 !== this._updateTime) {
        this._updateTime = t;
      } else {
        this._updateTime = new Date().getTime();
      }
    }
  };
  _ctor.getTime = function () {
    if (this._useLocalDate || 0 === this._updateTime) {
      return new Date().getTime();
    } else {
      return new Date().getTime() + this._diff;
    }
  };
  _ctor.getDate = function () {
    if (this._useLocalDate) {
      return new Date();
    } else {
      return new Date(this.getTime());
    }
  };
  _ctor.getDayStartTime = function (t) {
    return new Date(t).setHours(0, 0, 0, 0);
  };
  _ctor.getDayEndTime = function (t) {
    return new Date(t).setHours(23, 59, 59, 999);
  };
  _ctor.getWeekEndTime = function (t) {
    var e = new Date(t).getDay();
    return this.getDayEndTime(t) + (0 === e ? 0 : (7 - e) * exports.DAY_TIMESTAMPS);
  };
  _ctor.getMonthEndTime = function (t) {
    var e = new Date(t);
    if (11 === e.getMonth()) {
      e.setFullYear(e.getFullYear() + 1, 0, 0);
    } else {
      e.setMonth(e.getMonth() + 1, 0);
    }
    return e.setHours(23, 59, 59, 999);
  };
  _ctor.isSameDay = function (t, e) {
    return this.getDayStartTime(t) === this.getDayStartTime(e);
  };
  _ctor.getDiffDayNum = function (t, e) {
    var i = this.getDayStartTime(t);
    var n = this.getDayStartTime(e);
    return Math.ceil(Math.abs(i - n) / exports.DAY_TIMESTAMPS);
  };
  _ctor.getDaysBetweenTimestamps = function (t, e) {
    if ("number" != typeof t || "number" != typeof e) {
      throw new Error("输入参数必须为数字");
    }
    var o = Math.abs(t - e);
    return Math.floor(o / 864e5);
  };
  _ctor.getCalendarDaysBetweenTimestamps = function (t, e) {
    if ("number" != typeof t || "number" != typeof e) {
      throw new Error("输入参数必须为数字");
    }
    var o = new Date(t);
    o.setHours(0, 0, 0, 0);
    var i = new Date(e);
    i.setHours(0, 0, 0, 0);
    var n = Math.abs(o.getTime() - i.getTime());
    return Math.ceil(n / 864e5);
  };
  _ctor.format = function (t) {
    var e = [];
    for (var o = 1; o < arguments.length; o++) {
      e[o - 1] = arguments[o];
    }
    function i(t, e) {
      var o = "";
      for (var i = 0; i < e; i++) {
        o += t;
      }
      return o;
    }
    for (var n = 1; n < arguments.length; n++) {
      var a = "";
      var r = false;
      var s = " ";
      var c = 256;
      var l = (t = t.replace(/%%/g, "%$")).match(/%(?!\$)-?0?[0-9]*\.?[0-9]*[adfgs]/);
      if (!l || !(l = l[0])) {
        break;
      }
      if ("-" == (l = l.substr(1)).charAt(0)) {
        r = true;
        l = l.substr(1);
      }
      if ("0" == l.charAt(0)) {
        s = "0";
        l = l.substr(1);
      }
      var u = l.split(/[\.adfgs]/);
      if (u.length > 2) {
        c = parseInt(u[0]);
        parseInt(u[1]);
      } else {
        u.length > 1 && (c = parseInt(u[0]));
      }
      var p = function (t) {
        if (t.length > c) {
          t = r ? t.substr(0, c) : t.substr(-c);
        } else if (r) {
          t += i(s, c - t.length);
        } else {
          t = i(s, c - t.length) + t;
        }
        return t;
      };
      switch (l.charAt(l.length - 1)) {
        case "d":
        case "f":
          a = p(parseInt(arguments[n]) + "");
          break;
        case "s":
          a = arguments[n] ? p(arguments[n].toString()) : "";
      }
      t = t.replace(/%(?!\$)-?0?[0-9]*\.?[0-9]*[adfgs]/, a);
    }
    return t.replace(/%\$/g, "%");
  };
  _ctor.formatMillisecond = function (t, e) {
    var o = Math.floor(t / 864e5);
    t -= 864e5 * o;
    var i = Math.floor(t / 36e5);
    t -= 36e5 * i;
    var n = Math.floor(t / 6e4);
    t -= 6e4 * n;
    var a = Math.floor(t / 1e3);
    return (e = (e = (e = (e = (e = (e = (e = (e = e.replace(/%%/g, "%$")).replace(/%d/g, o)).replace(/%0h/g, this.format("%02d", i))).replace(/%h/g, i)).replace(/%0m/g, this.format("%02d", n))).replace(/%m/g, n)).replace(/%0s/g, this.format("%02d", a))).replace(/%s/g, a)).replace(/%\$/g, "%");
  };
  _ctor.format_HHMMSS = function (t) {
    var e = Math.floor(t / 1e3);
    return (Array(2).join("0") + Math.floor(e / 3600)).slice(-2) + ":" + (Array(2).join("0") + Math.floor(e % 3600 / 60)).slice(-2) + ":" + (Array(2).join("0") + Math.floor(e) % 60).slice(-2);
  };
  _ctor.format_HHMM = function (t) {
    var e = Math.floor(t / 1e3);
    return (Array(2).join("0") + Math.floor(e / 3600)).slice(-2) + ":" + (Array(2).join("0") + Math.floor(e % 3600 / 60)).slice(-2);
  };
  _ctor.format_MMSS = function (t) {
    var e = Math.floor(t / 1e3);
    return (Array(2).join("0") + Math.floor(e / 60)).slice(-2) + ":" + (Array(2).join("0") + Math.floor(e) % 60).slice(-2);
  };
  _ctor.getTomorrowZeroDate = function () {
    var t = new Date(this.getTime());
    t.setDate(t.getDate() + 1);
    t.setHours(0);
    t.setMinutes(0);
    t.setSeconds(0);
    return t;
  };
  _ctor.getNextMonthZeroDate = function () {
    var t = new Date(this.getTime());
    t.setMonth(t.getMonth() + 1);
    t.setDate(1);
    t.setHours(0);
    t.setMinutes(0);
    t.setSeconds(0);
    return t;
  };
  _ctor.getNextMondayDate = function () {
    var t = new Date();
    t.setHours(0);
    t.setMinutes(0);
    t.setSeconds(0);
    var e = (t.getDay() || 7) - 7;
    return new Date(t.getTime() - 864e5 * (e - 1));
  };
  _ctor._diff = 0;
  _ctor._updateTime = 0;
  _ctor._useLocalDate = false;
  return _ctor;
}();
exports.TimeUtil = exp_TimeUtil;