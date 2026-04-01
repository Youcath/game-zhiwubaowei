var cc__decorate = __decorate;
var cc__read = __read;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gutil = undefined;
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var exp_Gutil = function () {
  function _ctor() {}
  var e;
  e = _ctor;
  _ctor.base64decode = function (t) {
    var e;
    var o;
    var i;
    var n;
    var a;
    var r;
    var s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var c = "";
    var l = 0;
    for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); l < t.length;) {
      e = s.indexOf(t.charAt(l++)) << 2 | (n = s.indexOf(t.charAt(l++))) >> 4;
      o = (15 & n) << 4 | (a = s.indexOf(t.charAt(l++))) >> 2;
      i = (3 & a) << 6 | (r = s.indexOf(t.charAt(l++)));
      c += String.fromCharCode(e);
      64 != a && (c += String.fromCharCode(o));
      64 != r && (c += String.fromCharCode(i));
    }
    return this._utf8_encode(c);
  };
  _ctor._utf8_encode = function (t) {
    t = t.replace(/\r\n/g, "\n");
    var e = "";
    for (var o = 0; o < t.length; o++) {
      var i = t.charCodeAt(o);
      if (i < 128) {
        e += String.fromCharCode(i);
      } else if (i > 127 && i < 2048) {
        e += String.fromCharCode(i >> 6 | 192);
        e += String.fromCharCode(63 & i | 128);
      } else {
        e += String.fromCharCode(i >> 12 | 224);
        e += String.fromCharCode(i >> 6 & 63 | 128);
        e += String.fromCharCode(63 & i | 128);
      }
    }
    return e;
  };
  _ctor.base64_encode = function (t) {
    var e;
    var o;
    var i;
    var n;
    var a;
    var r;
    var s;
    var c = "";
    var l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var u = 0;
    for (t = this._utf8_encode(t); u < t.length;) {
      n = (e = t.charCodeAt(u++)) >> 2;
      a = (3 & e) << 4 | (o = t.charCodeAt(u++)) >> 4;
      r = (15 & o) << 2 | (i = t.charCodeAt(u++)) >> 6;
      s = 63 & i;
      if (isNaN(o)) {
        r = s = 64;
      } else {
        isNaN(i) && (s = 64);
      }
      c = c + l.charAt(n) + l.charAt(a) + l.charAt(r) + l.charAt(s);
    }
    return c;
  };
  _ctor.isBase64 = function (t) {
    if ("" === t || "" === t.trim()) {
      return false;
    }
    try {
      return this.base64_encode(this.base64decode(t)) == t;
    } catch (e) {
      return false;
    }
  };
  _ctor.arrDeleteObj = function (t, e) {
    var o = t.indexOf(e);
    -1 != o && t.splice(o, 1);
  };
  _ctor.Random = function (t, e) {
    return Math.random() * (e - t) + t;
  };
  _ctor.RandomRangeInt = function (t, e) {
    var o = e + 1 - t;
    var i = Math.random();
    return t + Math.floor(i * o);
  };
  _ctor.xipai = function (t) {
    var e;
    for (var o = 1; o < t.length; o++) {
      var i = Math.floor(Math.random() * (o + 1));
      e = cc__read([t[i], t[o]], 2);
      t[o] = e[0];
      t[i] = e[1];
    }
    return t;
  };
  _ctor.makeRandomArr = function (t, e) {
    if (e > t.length) {
      return t;
    }
    var o = t.slice();
    var i = [];
    for (var n = 0; n < e; n++) {
      var a = Math.floor(Math.random() * o.length);
      var r = o[a];
      o.splice(a, 1);
      i.push(r);
    }
    return i;
  };
  _ctor.DistanceSqrtWithoutY = function (t, e) {
    this._a.x = t.x;
    this._a.y = 0;
    this._a.z = t.z;
    this._b.x = e.x;
    this._b.y = 0;
    this._b.z = e.z;
    return cc.Vec3.squaredDistance(this._a, this._b);
  };
  _ctor.DistanceSqrtWithoutYXZXZ = function (t, e, o, i) {
    this._a.x = t;
    this._a.y = 0;
    this._a.z = e;
    this._b.x = o;
    this._b.y = 0;
    this._b.z = i;
    return cc.Vec3.squaredDistance(this._a, this._b);
  };
  _ctor.DistanceWithoutZ = function (t, e) {
    this._a.x = t.x;
    this._a.z = 0;
    this._a.y = t.y;
    this._b.x = e.x;
    this._b.z = 0;
    this._b.y = e.y;
    return cc.Vec3.distance(this._a, this._b);
  };
  _ctor.setNewV3 = function (t, e) {
    t.x = e.x;
    t.y = e.y;
    t.z = e.z;
    return t;
  };
  _ctor.setNewV3with = function (t, e, o, i) {
    undefined === i && (i = 0);
    t.x = e;
    t.y = o;
    t.z = i;
    return t;
  };
  _ctor.SystemTime = function () {
    return new Date().getTime();
  };
  _ctor.SystemMillionSecond = function () {
    0 == e._sms && e.UpdateSystemTime();
    return e._sms;
  };
  _ctor.UpdateSystemTime = function () {
    e._sms = new Date().getTime();
  };
  _ctor.SystemTimeHHMMSS = function () {
    var t = new Date().getTime();
    var o = t.toString();
    o = o.substr(o.length - 4);
    return e.FormatTime_HHMMSS(t) + " " + o;
  };
  _ctor.SystemDay = function () {
    return this.GetDay(this.SystemTime());
  };
  _ctor.GetDay = function (t) {
    var e = t / 1e3;
    e /= 60;
    e /= 60;
    e += 8;
    e /= 24;
    return Math.floor(e);
  };
  _ctor.FormatTime_HHMMSS = function (t) {
    var e = t / 1e3;
    var o = (Array(2).join("0") + Math.floor(e / 3600)).slice(-2);
    var i = (Array(2).join("0") + Math.floor(e % 3600 / 60)).slice(-2);
    var n = (Array(2).join("0") + Math.floor(e) % 60).slice(-2);
    if ("00" == o) {
      return i + ":" + n;
    } else {
      return o + ":" + i + ":" + n;
    }
  };
  _ctor.FormatTime_DDHHMMSS = function (t) {
    var e = t / 1e3;
    e = Math.floor(e / 60);
    e = Math.floor(e / 60);
    e = Math.floor(e / 24);
    return "";
  };
  _ctor.FormatTime_YYMMDD = function (t) {
    var e = new Date(t);
    return e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate() + " " + e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds();
  };
  _ctor.getLookAtAngle = function (t) {
    return Math.atan2(t.y, t.x) / Math.PI * 180;
  };
  _ctor.getDirFromAngle = function (t) {
    var e = t * Math.PI / 180;
    var o = cc.v3(Math.cos(e), Math.sin(e));
    o.normalizeSelf();
    return o;
  };
  _ctor.WorldPos = function (t) {
    return t.parent.convertToWorldSpaceAR(t.position);
  };
  _ctor.LocationPos = function (t, e) {
    return t.convertToNodeSpaceAR(e);
  };
  _ctor._a = new cc.Vec3();
  _ctor._b = new cc.Vec3();
  _ctor._sms = 0;
  return e = cc__decorate([ccp_ccclass], _ctor);
}();
exports.Gutil = exp_Gutil;