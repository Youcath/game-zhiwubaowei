Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimerManager = undefined;
var $10Logger = require("Logger");
var n = function () {
  this.interval = 0;
  this.dt = 0;
  this.repeat = 0;
  this.callback = null;
  this.pause = false;
  this.check = true;
};
var exp_TimerManager = function () {
  function _ctor() {
    this._timer = [];
    this._pause = false;
    cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this._update, this);
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == this._instance && (this._instance = new _ctor());
      return this._instance;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.hasSchedule = function (t) {
    return null != this._timer.find(function (e) {
      return e.callback === t;
    });
  };
  _ctor.prototype.scheduleOnce = function (t, e, o) {
    undefined === o && (o = 0);
    var i = this._timer.find(function (e) {
      return e.callback === t;
    });
    if (!i) {
      i = new n();
      this._timer.push(i);
      i.callback = t;
    }
    i.target = e;
    i.repeat = 1;
    i.dt = o;
    i.check = e instanceof cc.Component;
  };
  _ctor.prototype.schedule = function (t, e, o, i, a) {
    undefined === o && (o = 0);
    undefined === i && (i = 0);
    undefined === a && (a = 0);
    var r = this._timer.findIndex(function (e) {
      return e.callback === t;
    });
    var s = this._timer[r];
    if (-1 === r) {
      if (1 == i && o + a < 0) {
        return void (null == t || t.call(e));
      }
      s = new n();
      this._timer.push(s);
      s.callback = t;
    }
    s.target = e;
    s.interval = o;
    s.repeat = i;
    s.dt = o + a;
    s.check = e instanceof cc.Component;
    s.dt < 0 && this.runTimer(s, r);
  };
  _ctor.prototype.pause = function (t) {
    var e = this._timer.find(function (e) {
      return e.callback === t;
    });
    if (e) {
      e.pause = true;
    } else {
      $10Logger.Logger.warn("该定时器不存在或已销毁");
    }
  };
  _ctor.prototype.pauseAll = function () {
    this._pause = true;
  };
  _ctor.prototype.resume = function (t) {
    var e = this._timer.find(function (e) {
      return e.callback === t;
    });
    if (e) {
      e.pause = false;
    } else {
      $10Logger.Logger.warn("该定时器不存在或已销毁");
    }
  };
  _ctor.prototype.resumeAll = function () {
    this._pause = false;
  };
  _ctor.prototype.unschedule = function (t) {
    var e = this._timer.findIndex(function (e) {
      return e.callback === t;
    });
    if (-1 !== e) {
      this._timer.splice(e, 1);
    } else {
      $10Logger.Logger.warn("该定时器不存在或已销毁");
    }
  };
  _ctor.prototype.unscheduleAll = function () {
    this._timer.length = 0;
  };
  _ctor.prototype._update = function () {
    var t;
    if (!this._pause) {
      var e = this._timer.length;
      if (0 !== e) {
        var o = cc.director.getDeltaTime();
        var i = null;
        for (var n = e - 1; n >= 0; n--) {
          if (!(i = this._timer[n]).check || (null === (t = i.target) || undefined === t ? undefined : t.node)) {
            if (!i.pause) {
              i.dt -= o, i.dt <= 0 && this.runTimer(i, n);
            }
          } else {
            this._timer.splice(n, 1);
          }
        }
      }
    }
  };
  _ctor.prototype.runTimer = function (t, e) {
    var o;
    var i;
    if (1 === t.repeat) {
      this._timer.splice(e, 1);
      return void (null === (o = t.callback) || undefined === o || o.call(t.target));
    }
    null === (i = t.callback) || undefined === i || i.call(t.target);
    t.dt = t.interval;
    0 !== t.repeat && t.repeat--;
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.TimerManager = exp_TimerManager;