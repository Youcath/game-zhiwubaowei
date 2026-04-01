var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__read = __read;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10AnimUtils = require("AnimUtils");
var $10DataManager = require("DataManager");
var $10Util = require("Util");
var $10MB_Const = require("MB_Const");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MB_EquipItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.nAnchor = null;
    e.formId = 0;
    e._equipId = 0;
    e._rowCol = "";
    e._occupyRowCols = [];
    e._formGrids = null;
    e._mbView = null;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "anchorPos", {
    get: function () {
      return this.node.getPosition().add(this.nAnchor.getPosition());
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "rowCol", {
    get: function () {
      return this._rowCol;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "occupyRowCols", {
    get: function () {
      return this._occupyRowCols.slice();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "canUpLv", {
    get: function () {
      return this.cfgEquip.level < 4;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "equipId", {
    get: function () {
      return this._equipId;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "cfgEquip", {
    get: function () {
      return $10DataManager.DataManager.instance.eData.data_bagweapon[this._equipId];
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.init = function (t, e, n) {
    this._equipId = t;
    this._rowCol = e;
    this._mbView = n;
    this._formGrids = $10MB_Const.MB_EQUIP_FORM[this.formId].grids.slice();
    this._occupyRowCols = [];
    this.updateIcon();
  };
  _ctor.prototype.setPosByGrid = function (t) {
    var e = $10Util.default.nodeParentChangeLocalPos(this.nAnchor, this.node);
    var n = t.sub(cc.v2(e.x, e.y));
    this.setPos(n);
  };
  _ctor.prototype.setPos = function (t) {
    this.node.setPosition(t);
    this.updateRowCol();
    this.updateOccupyGrids();
  };
  _ctor.prototype.onSelectedAnim = function () {
    var t = this.node.getChildByName("Info");
    cc.tween(t).to(.1, {
      scale: .9
    }, {
      easing: "sineIn"
    }).start();
  };
  _ctor.prototype.onDownAnim = function () {
    var t = this.node.getChildByName("Info");
    cc.tween(t).to(.2, {
      scale: 1
    }, {
      easing: "sineIn"
    }).start();
  };
  _ctor.prototype.updateRowCol = function () {
    var t = this.node.convertToWorldSpaceAR(this.nAnchor.getPosition());
    this._rowCol = this._mbView.getRowColByPos(this._mbView.node.convertToNodeSpaceAR(t));
    var e = cc__read(this._rowCol.split("&").map(Number), 2);
    var n = e[0];
    var i = e[1];
    (n < 0 || n >= $10MB_Const.MB_GRID_ROW || i < 0 || i >= $10MB_Const.MB_GRID_COL) && (this._rowCol = "");
  };
  _ctor.prototype.updateOccupyGrids = function () {
    this._occupyRowCols = [];
    if ("" != this._rowCol) {
      var t = this._rowCol.split("&").map(Number);
      for (var e = 0; e < this._formGrids.length; e++) {
        var n = this._formGrids[e];
        this._occupyRowCols.push(t[0] + n[0] + "&" + (t[1] + n[1]));
      }
    }
  };
  _ctor.prototype.updateIcon = function () {
    var t = this;
    this.node.getChildByName("Info").getChildByName("Quality").children.forEach(function (e, n) {
      e.active = t.cfgEquip.level == n + 1;
    });
  };
  _ctor.prototype.upLv = function () {
    this._equipId++;
    this.updateIcon();
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/se_synthesis", "res_MB");
    $10AnimUtils.AnimUtil.shakeAngle(this.node.getChildByName("Info"));
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nAnchor", undefined);
  cc__decorate([ccp_property(cc.Integer)], _ctor.prototype, "formId", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_MB_EquipItem;