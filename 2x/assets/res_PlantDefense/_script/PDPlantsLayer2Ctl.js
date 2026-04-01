var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10DataManager = require("DataManager");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDCWItemCtl = require("PDCWItemCtl");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDPlantsLayer2Ctl = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.caowuItem = null;
    e._plantIds = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onDestroy = function () {};
  _ctor.prototype.start = function () {
    $10EventManager.EventManager.instance.on($10PlantDefenseDataProxy.PDDataEvent.UPDATE_PLANT, this.updatePlant, this);
  };
  _ctor.prototype.updatePlant = function () {
    var t = [];
    this.node.children.forEach(function (e) {
      e.getComponent($10PDCWItemCtl.default).updatePlant();
      t.push(e.getComponent($10PDCWItemCtl.default).plantData.id);
    });
    for (var e in $10PlantDefenseDataProxy.plantDefenseDataProxy.idPlants) {
      var n = $10DataManager.DataManager.instance.eData.data_zombieplant[Number(e)];
      if ($10PlantDefenseDataProxy.plantDefenseDataProxy.idPlants[n.id] <= 0) {
        delete $10PlantDefenseDataProxy.plantDefenseDataProxy.idPlants[n.id];
      } else if (-1 == t.indexOf(n.id)) {
        var o = cc.instantiate(this.caowuItem);
        o.parent = this.node;
        o.getComponent($10PDCWItemCtl.default).init(n);
        o.active = true;
      }
    }
    if (this.node.children.length > 5) {
      this.node.width = 720;
    } else {
      this.node.width = 106 + 136 * (this.node.children.length - 1);
    }
  };
  _ctor.prototype.initPlants = function () {
    this.node.children.forEach(function (t) {
      t.active = false;
    });
    this.node.active = true;
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "caowuItem", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDPlantsLayer2Ctl;