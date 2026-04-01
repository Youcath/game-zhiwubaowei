var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDLawnMower = require("PDLawnMower");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDCarCtl = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.pathIndex = 1;
    e._targetPos = null;
    e._colliderTime = $10GameEnum.EGameEnum.CHECK_COLLIDER_TIME;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    var e = this;
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING && (!this._targetPos && $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView && (this._targetPos = $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v3()))), this._targetPos && (this._colliderTime -= t, this._colliderTime <= 0))) {
      this._colliderTime = $10GameEnum.EGameEnum.CHECK_COLLIDER_TIME;
      var n = $10PlantDefenseDataProxy.plantDefenseDataProxy.enemySoldiers.filter(function (t) {
        return t.getComponent($10PDEnemyBase.default).pathIdx == e.pathIndex;
      });
      for (var o = 0; o < n.length; o++) {
        var i = n[o];
        if ($10MathUtil.MathUtil.distance(i.position, this._targetPos) <= 100) {
          return void this.facheStart();
        }
      }
    }
  };
  _ctor.prototype.facheStart = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/PDLawnMower",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.PlantDefense
    }).then(function (e) {
      var n = cc.instantiate(e);
      n.parent = $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView;
      var o = $10PlantDefenseDataProxy.plantDefenseDataProxy.battleView.convertToNodeSpaceAR(t.node.convertToWorldSpaceAR(cc.v3()));
      n.setPosition(o);
      n.getComponent($10PDLawnMower.default).initPlay();
      t.node.destroy();
      t.node.removeFromParent();
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  cc__decorate([ccp_property(cc.Integer)], _ctor.prototype, "pathIndex", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDCarCtl;