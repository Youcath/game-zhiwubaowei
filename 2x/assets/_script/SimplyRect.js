Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10SimplyVec2 = require("SimplyVec2");
var def_SimplyRect = function () {
  function _ctor(t, e, o, i, n) {
    undefined === n && (n = 0);
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.rotation = 0;
    this.x = t;
    this.y = e;
    this.width = o;
    this.height = i;
    this.rotation = n;
  }
  Object.defineProperty(_ctor.prototype, "center", {
    get: function () {
      return new $10SimplyVec2.default(this.x, this.y);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "a1", {
    get: function () {
      return new $10SimplyVec2.default(this.x - this.width / 2, this.y - this.height / 2);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "a2", {
    get: function () {
      return new $10SimplyVec2.default(this.x + this.width / 2, this.y - this.height / 2);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "a3", {
    get: function () {
      return new $10SimplyVec2.default(this.x + this.width / 2, this.y + this.height / 2);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "a4", {
    get: function () {
      return new $10SimplyVec2.default(this.x - this.width / 2, this.y + this.height / 2);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "axisX", {
    get: function () {
      return new $10SimplyVec2.default(1, 0);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "axisY", {
    get: function () {
      return new $10SimplyVec2.default(0, 1);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "rA1", {
    get: function () {
      if (this.rotation % 360 == 0) {
        return this.a1;
      } else {
        return this.center.add(this.a1.sub(this.center).rotate(this.radian));
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "rA2", {
    get: function () {
      if (this.rotation % 360 == 0) {
        return this.a2;
      } else {
        return this.center.add(this.a2.sub(this.center).rotate(this.radian));
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "rA3", {
    get: function () {
      if (this.rotation % 360 == 0) {
        return this.a3;
      } else {
        return this.center.add(this.a3.sub(this.center).rotate(this.radian));
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "rA4", {
    get: function () {
      if (this.rotation % 360 == 0) {
        return this.a4;
      } else {
        return this.center.add(this.a4.sub(this.center).rotate(this.radian));
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "rAxisX", {
    get: function () {
      if (this.rotation % 360 == 0) {
        return this.axisX;
      } else {
        return this.axisX.rotate(this.radian);
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "rAxisY", {
    get: function () {
      if (this.rotation % 360 == 0) {
        return this.axisY;
      } else {
        return this.axisY.rotate(this.radian);
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "vertexs", {
    get: function () {
      return [this.a1, this.a2, this.a3, this.a4];
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "rVertexs", {
    get: function () {
      return [this.rA1, this.rA2, this.rA3, this.rA4];
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "radian", {
    get: function () {
      return this.rotation * Math.PI / 180;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "xMin", {
    get: function () {
      return this.x - this.width / 2;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "xMax", {
    get: function () {
      return this.x + this.width / 2;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "yMin", {
    get: function () {
      return this.y - this.height / 2;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "yMax", {
    get: function () {
      return this.y + this.height / 2;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.intersects = function (t) {
    return !(this.xMax < t.xMin || t.xMax < this.xMin || this.yMax < t.yMin || t.yMax < this.yMin);
  };
  _ctor.prototype.contains = function (t) {
    return this.xMin <= t.x && this.xMax >= t.x && this.yMin <= t.y && this.yMax >= t.y;
  };
  return _ctor;
}();
exports.default = def_SimplyRect;