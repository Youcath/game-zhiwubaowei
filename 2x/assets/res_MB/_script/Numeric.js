Object.defineProperty(exports, "__esModule", {
  value: true
});
var def_Numeric = function () {
  function _ctor() {
    this.isFloor = false;
    this.isCeil = false;
    this._value = 0;
    this._baseValue = 0;
    this._addBaseValue = 0;
    this._percentAdd = 0;
    this._addValue = 0;
    this._multiplyValue = 1;
    this._limitPercentAdd = Number.MAX_SAFE_INTEGER;
    this._limitValue = Number.MAX_SAFE_INTEGER;
    this._getBaseValueFunc = null;
    this._getPercentAddFunc = null;
    var t = this;
    t._value = t._baseValue = t._addBaseValue = t._percentAdd = t._addValue = 0;
  }
  Object.defineProperty(_ctor.prototype, "value", {
    get: function () {
      (this._getBaseValueFunc || this._getPercentAddFunc) && this.update();
      this._value = Math.min(this._value, this._limitValue);
      return this._value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "baseValue", {
    get: function () {
      if (this._getBaseValueFunc) {
        return this._getBaseValueFunc();
      } else {
        return this._baseValue;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "addBaseValue", {
    get: function () {
      return this._addBaseValue;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "rightBaseValue", {
    get: function () {
      return this.baseValue + this.addBaseValue;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "percentAdd", {
    get: function () {
      var t = this._percentAdd;
      this._getPercentAddFunc && (t = this._getPercentAddFunc());
      return Math.min(t, this._limitPercentAdd);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "addValue", {
    get: function () {
      return this._addValue;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.setBaseGetValueFunc = function (t) {
    if (t) {
      this._getBaseValueFunc = t;
      this.update();
    }
  };
  _ctor.prototype.setFixBase = function (t) {
    this._baseValue = t;
    this._getBaseValueFunc = null;
    this.update();
  };
  _ctor.prototype.changeAddBaseValue = function (t) {
    this._addBaseValue += t;
    this.update();
  };
  _ctor.prototype.changePercentAdd = function (t) {
    this._percentAdd += t;
    this._getPercentAddFunc = null;
    this.update();
  };
  _ctor.prototype.setPercentAddGetValueFunc = function (t) {
    if (t) {
      this._getPercentAddFunc = t;
      this.update();
    }
  };
  _ctor.prototype.changeAddValue = function (t) {
    this._addValue += t;
    this.update();
  };
  _ctor.prototype.changeMultiplyValue = function (t, e) {
    undefined === e && (e = true);
    if (!(t <= 0)) {
      if (e) {
        this._multiplyValue *= t;
      } else {
        this._multiplyValue /= t;
      }
      this.update();
    }
  };
  _ctor.prototype.setLimitPercentAdd = function (t) {
    this._limitPercentAdd = t;
  };
  _ctor.prototype.setLimitValue = function (t) {
    this._limitValue = t;
  };
  _ctor.prototype.update = function () {
    var t = this;
    var e = t.rightBaseValue * (1 + t.percentAdd / 100) * this._multiplyValue + t._addValue;
    t._value = t.isFloor ? Math.floor(e) : t.isCeil ? Math.ceil(e) : e;
  };
  _ctor.prototype.clear = function () {
    this._getBaseValueFunc = null;
  };
  return _ctor;
}();
exports.default = def_Numeric;