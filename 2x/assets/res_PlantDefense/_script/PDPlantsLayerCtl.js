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
cc__decorator.property;
var def_PDPlantsLayerCtl = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onDestroy = function () {};
  _ctor.prototype.start = function () {
    $10EventManager.EventManager.instance.on($10PlantDefenseDataProxy.PDDataEvent.UPDATE_PLANT, this.updatePlant, this);
  };
  _ctor.prototype.updatePlant = function () {
    this.node.children.forEach(function (t) {
      t.active && t.getComponent($10PDCWItemCtl.default).updatePlant();
    });
  };
  _ctor.prototype.initPlants = function (t) {
    this.node.children.forEach(function (t) {
      t.active = false;
    });
    var e = 0;
    for (var n = 0; n < t.length; n++) {
      var o = $10DataManager.DataManager.instance.eData.data_zombieplant[Number(t[n])];
      if (1 == o.type2 && o.super > 0) {
        $10PlantDefenseDataProxy.plantDefenseDataProxy.idPlants[o.id] = 0;
        var i = this.node.children[e];
        if (i) {
          i.getComponent($10PDCWItemCtl.default).init(o);
          i.active = true;
        }
        e++;
      }
    }
    this.node.active = true;
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDPlantsLayerCtl;