var cc__read = __read;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MB_AttrMgr = undefined;
var $10DataManager = require("DataManager");
var $10E_AttrType = require("E_AttrType");
var exp_MB_AttrMgr = function () {
  function _ctor() {
    this.attrNames = ["", "攻击", "防御", "生命", "速度", "闪避", "击晕", "反击", "连击", "吸血", "暴击", "恢复"];
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      this._instance || (this._instance = new _ctor());
      return this._instance;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.getPlayerAttrMap = function (t) {
    var e = cc__read($10DataManager.DataManager.instance.eData.datapara[1803].num.split("|").map(Number), 4);
    var n = e[0];
    var r = e[1];
    var s = e[2];
    var c = e[3];
    var p = new Map([[$10E_AttrType.E_AttrType.ATK, n], [$10E_AttrType.E_AttrType.DEF, r], [$10E_AttrType.E_AttrType.HP, s], [$10E_AttrType.E_AttrType.SPD, c]]);
    var l = new Map([[$10E_AttrType.E_AttrType.ATK, "atk"], [$10E_AttrType.E_AttrType.DEF, "def"], [$10E_AttrType.E_AttrType.HP, "hp"], [$10E_AttrType.E_AttrType.SPD, "speed"], [$10E_AttrType.E_AttrType.DODGE, "att1"], [$10E_AttrType.E_AttrType.STUN, "att2"], [$10E_AttrType.E_AttrType.REBATE, "att3"], [$10E_AttrType.E_AttrType.COMBO, "att4"], [$10E_AttrType.E_AttrType.BLOOD, "att5"], [$10E_AttrType.E_AttrType.CRIT, "att6"], [$10E_AttrType.E_AttrType.RECOVER, "att7"]]);
    t.forEach(function (t) {
      var e = $10DataManager.DataManager.instance.eData.data_bagweapon[t];
      l.forEach(function (t, n) {
        var i = Number((e[t] * (n > 4 ? 100 : 1)).toFixed(2));
        if (i > 0) {
          if (p.has(n)) {
            p.set(n, p.get(n) + i);
          } else {
            p.set(n, i);
          }
        }
      });
    });
    return p;
  };
  _ctor.prototype.getEquipAttrMap = function (t) {
    var e = new Map();
    var n = new Map([[$10E_AttrType.E_AttrType.ATK, "atk"], [$10E_AttrType.E_AttrType.DEF, "def"], [$10E_AttrType.E_AttrType.HP, "hp"], [$10E_AttrType.E_AttrType.SPD, "speed"], [$10E_AttrType.E_AttrType.DODGE, "att1"], [$10E_AttrType.E_AttrType.STUN, "att2"], [$10E_AttrType.E_AttrType.REBATE, "att3"], [$10E_AttrType.E_AttrType.COMBO, "att4"], [$10E_AttrType.E_AttrType.BLOOD, "att5"], [$10E_AttrType.E_AttrType.CRIT, "att6"], [$10E_AttrType.E_AttrType.RECOVER, "att7"]]);
    var i = $10DataManager.DataManager.instance.eData.data_bagweapon[t];
    n.forEach(function (t, n) {
      var o = i[t] * (n > 4 ? 100 : 1);
      if (o > 0) {
        if (e.has(n)) {
          e.set(n, e.get(n) + o);
        } else {
          e.set(n, o);
        }
      }
    });
    return e;
  };
  return _ctor;
}();
exports.MB_AttrMgr = exp_MB_AttrMgr;