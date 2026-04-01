var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadarChart = undefined;
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var ccp_executeInEditMode = cc__decorator.executeInEditMode;
cc__decorator.executionOrder;
cc__decorator.help;
cc__decorator.menu;
var exp_RadarChart = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.target = null;
    e._axisLength = 200;
    e._axes = 6;
    e._axisScales = 3;
    e._drawAxes = true;
    e._gridLineWidth = 4;
    e._innerGridLineWidth = 4;
    e._gridLineColor = cc.Color.GRAY;
    e._gridFillColor = cc.color(100, 100, 100, 100);
    e._dataValuesStrings = ["0.8,0.5,0.6,0.5,0.8,0.6", "0.5,0.9,0.5,0.8,0.5,0.9"];
    e._dataLineWidths = [5, 5];
    e._dataLineColors = [cc.Color.BLUE, cc.Color.RED];
    e._dataFillColors = [cc.color(120, 120, 180, 100), cc.color(180, 120, 120, 100)];
    e._dataJoinColors = [];
    e._drawDataJoin = true;
    e.graphics = null;
    e.keepUpdating = false;
    e.angles = null;
    e._curDatas = [];
    e.curTweenRes = null;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "axisLength", {
    get: function () {
      return this._axisLength;
    },
    set: function (t) {
      this._axisLength = t;
      this.draw(this.curDatas);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "axes", {
    get: function () {
      return this._axes;
    },
    set: function (t) {
      this._axes = Math.floor(t >= 3 ? t : 3);
      this.draw(this.curDatas);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "axisScales", {
    get: function () {
      return this._axisScales;
    },
    set: function (t) {
      this._axisScales = Math.floor(t >= 1 ? t : 1);
      this.draw(this.curDatas);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "drawAxes", {
    get: function () {
      return this._drawAxes;
    },
    set: function (t) {
      this._drawAxes = t;
      this.draw(this.curDatas);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "gridLineWidth", {
    get: function () {
      return this._gridLineWidth;
    },
    set: function (t) {
      this._gridLineWidth = t;
      this.draw(this.curDatas);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "innerGridLineWidth", {
    get: function () {
      return this._innerGridLineWidth;
    },
    set: function (t) {
      this._innerGridLineWidth = t;
      this.draw(this.curDatas);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "gridLineColor", {
    get: function () {
      return this._gridLineColor;
    },
    set: function (t) {
      this._gridLineColor = t;
      this.draw(this.curDatas);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "gridFillColor", {
    get: function () {
      return this._gridFillColor;
    },
    set: function (t) {
      this._gridFillColor = t;
      this.draw(this.curDatas);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "dataValuesStrings", {
    get: function () {
      return this._dataValuesStrings;
    },
    set: function (t) {
      this._dataValuesStrings = t;
      this.drawWithProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "dataLineWidths", {
    get: function () {
      return this._dataLineWidths;
    },
    set: function (t) {
      this._dataLineWidths = t;
      this.drawWithProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "dataLineColors", {
    get: function () {
      return this._dataLineColors;
    },
    set: function (t) {
      this._dataLineColors = t;
      this.drawWithProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "dataFillColors", {
    get: function () {
      return this._dataFillColors;
    },
    set: function (t) {
      this._dataFillColors = t;
      this.drawWithProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "dataJoinColors", {
    get: function () {
      return this._dataJoinColors;
    },
    set: function (t) {
      this._dataJoinColors = t;
      this.drawWithProperties();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "drawDataJoin", {
    get: function () {
      return this._drawDataJoin;
    },
    set: function (t) {
      this._drawDataJoin = t;
      this.draw(this.curDatas);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "curDatas", {
    get: function () {
      return this._curDatas;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onLoad = function () {
    this.init();
    this.drawWithProperties();
  };
  _ctor.prototype.update = function () {
    this.keepUpdating && 0 !== this._curDatas.length && this.draw(this._curDatas);
  };
  _ctor.prototype.init = function () {
    this.target || (this.target = this.node);
    this.graphics = this.target.getComponent(cc.Graphics) || this.target.addComponent(cc.Graphics);
    this.graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
    this.graphics.lineCap = cc.Graphics.LineCap.ROUND;
  };
  _ctor.prototype.drawWithProperties = function () {
    var t = [];
    var e = this.dataValuesStrings;
    var o = this._dataLineWidths;
    var i = this._dataLineColors;
    var n = this._dataFillColors;
    var a = this._dataJoinColors;
    for (var r = 0; r < e.length; r++) {
      t.push({
        values: this.processValuesString(e[r]),
        lineWidth: o[r] || p.lineWidth,
        lineColor: i[r] || p.lineColor,
        fillColor: n[r] || p.fillColor,
        joinColor: a[r] || p.joinColor
      });
    }
    this.draw(t);
  };
  _ctor.prototype.processValuesString = function (t) {
    var e = t.split(",");
    var o = [];
    for (var i = 0; i < e.length; i++) {
      var n = parseFloat(e[i]);
      o.push(isNaN(n) ? 0 : n);
    }
    return o;
  };
  _ctor.prototype.drawBase = function () {
    var t = this.graphics;
    t.lineWidth = this._gridLineWidth;
    t.strokeColor = this._gridLineColor;
    t.fillColor = this._gridFillColor;
    var e = this.angles = [];
    var o = 360 / this.axes;
    for (var i = 0; i < this.axes; i++) {
      e.push(o * i);
    }
    var n = [];
    var a = this._axisLength;
    var r = this._axisScales;
    var s = a / r;
    for (i = 0; i < r; i++) {
      var c = [];
      var l = a - s * i;
      var u = 0;
      for (var p = this.angles.length; u < p; u++) {
        var h = Math.PI / 180 * this.angles[u];
        c.push(cc.v2(l * Math.cos(h), l * Math.sin(h)));
      }
      n.push(c);
    }
    var d = n[0];
    if (this._drawAxes) {
      for (i = 0; i < d.length; i++) {
        t.moveTo(0, 0);
        t.lineTo(d[i].x, d[i].y);
      }
    }
    t.moveTo(d[0].x, d[0].y);
    for (i = 1; i < d.length; i++) {
      t.lineTo(d[i].x, d[i].y);
    }
    t.close();
    t.fill();
    t.stroke();
    if (n.length > 1) {
      t.lineWidth = this._innerGridLineWidth;
      for (i = 1; i < n.length; i++) {
        var m = n[i];
        t.moveTo(m[0].x, m[0].y);
        for (u = 1; u < m.length; u++) {
          t.lineTo(m[u].x, m[u].y);
        }
        t.close();
      }
      t.stroke();
    }
  };
  _ctor.prototype.draw = function (t) {
    var e = this.graphics;
    e.clear();
    this.drawBase();
    var o = Array.isArray(t) ? t : [t];
    this._curDatas = o;
    this.resizeCurDatasValues(0);
    var i = this.axes;
    var n = this.axisLength;
    var a = this.angles;
    for (var r = 0; r < o.length; r++) {
      var s = o[r];
      e.strokeColor = s.lineColor || p.lineColor;
      e.fillColor = s.fillColor || p.fillColor;
      e.lineWidth = s.lineWidth || p.lineWidth;
      var c = [];
      for (var l = 0; l < i; l++) {
        var u = (s.values[l] > 1 ? 1 : s.values[l]) * n;
        var h = Math.PI / 180 * a[l];
        c.push(cc.v2(u * Math.cos(h), u * Math.sin(h)));
      }
      e.moveTo(c[0].x, c[0].y);
      for (l = 1; l < c.length; l++) {
        e.lineTo(c[l].x, c[l].y);
      }
      e.close();
      e.fill();
      e.stroke();
      if (this._drawDataJoin) {
        for (l = 0; l < c.length; l++) {
          var d = c[l];
          e.strokeColor = s.lineColor || p.lineColor;
          e.circle(d.x, d.y, 2);
          e.stroke();
          e.strokeColor = s.joinColor || p.joinColor;
          e.circle(d.x, d.y, .65);
          e.stroke();
        }
      }
    }
  };
  _ctor.prototype.to = function (t, e) {
    var o = this;
    return new Promise(function (i) {
      var n;
      o.unscheduleAllCallbacks();
      o.curTweenRes && o.curTweenRes();
      o.curTweenRes = i;
      var a = Array.isArray(t) ? t : [t];
      o.keepUpdating = true;
      for (var r = 0; r < a.length; r++) {
        var s = o._curDatas[r];
        if (s) {
          var c = a[r];
          for (var l = 0; l < s.values.length; l++) {
            cc.tween(s.values).to(e, (n = {}, n[l] = c.values[l] > 1 ? 1 : c.values[l], n)).start();
          }
          cc.tween(s).to(e, {
            lineWidth: c.lineWidth || s.lineWidth,
            lineColor: c.lineColor || s.lineColor,
            fillColor: c.fillColor || s.fillColor,
            joinColor: c.joinColor || s.joinColor
          }).start();
        }
      }
      o.scheduleOnce(function () {
        o.keepUpdating = false;
        o.curTweenRes();
        o.curTweenRes = null;
      }, e);
    });
  };
  _ctor.prototype.resizeCurDatasValues = function (t) {
    undefined === t && (t = 0);
    var e = this._curDatas;
    for (var o = 0; o < e.length; o++) {
      var i = e[o];
      if (i.values.length < this._axes) {
        var n = this._axes - i.values.length;
        for (var a = 0; a < n; a++) {
          i.values.push(t);
        }
      }
    }
  };
  cc__decorate([ccp_property({
    type: cc.Node,
    // tooltip: false
  })], _ctor.prototype, "target", undefined);
  cc__decorate([ccp_property()], _ctor.prototype, "_axisLength", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "axisLength", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_axes", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "axes", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_axisScales", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "axisScales", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_drawAxes", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "drawAxes", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_gridLineWidth", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "gridLineWidth", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_innerGridLineWidth", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "innerGridLineWidth", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_gridLineColor", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "gridLineColor", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_gridFillColor", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "gridFillColor", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_dataValuesStrings", undefined);
  cc__decorate([ccp_property({
    type: [cc.String],
    // tooltip: false
  })], _ctor.prototype, "dataValuesStrings", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_dataLineWidths", undefined);
  cc__decorate([ccp_property({
    type: [cc.Integer],
    // tooltip: false
  })], _ctor.prototype, "dataLineWidths", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_dataLineColors", undefined);
  cc__decorate([ccp_property({
    type: [cc.Color],
    // tooltip: false
  })], _ctor.prototype, "dataLineColors", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_dataFillColors", undefined);
  cc__decorate([ccp_property({
    type: [cc.Color],
    // tooltip: false
  })], _ctor.prototype, "dataFillColors", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_dataJoinColors", undefined);
  cc__decorate([ccp_property({
    type: [cc.Color],
    // tooltip: false
  })], _ctor.prototype, "dataJoinColors", null);
  cc__decorate([ccp_property()], _ctor.prototype, "_drawDataJoin", undefined);
  cc__decorate([ccp_property({
    // tooltip: false
  })], _ctor.prototype, "drawDataJoin", null);
  return cc__decorate([ccp_ccclass, ccp_executeInEditMode], _ctor);
}(cc.Component);
exports.RadarChart = exp_RadarChart;
var p = {
  lineWidth: 5,
  lineColor: cc.Color.BLUE,
  fillColor: cc.color(120, 120, 180, 100),
  joinColor: cc.Color.WHITE
};