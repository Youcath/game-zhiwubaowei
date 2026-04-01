var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDFaPaiView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.itemCard = null;
    e.fapaiSp = null;
    e._endPos = null;
    e._plantData = null;
    e._isClickEd = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.play = function (t, e) {
    var n = this;
    this._endPos = e;
    var o = [];
    var i = $10PlantDefenseDataProxy.plantDefenseDataProxy.selectStageId + 112;
    var a = $10DataManager.DataManager.instance.eData.datapara[i];
    var r = 0;
    if (a && (r = Number(a.num)) > 0) {
      var c = $10DataManager.DataManager.instance.eData.data_zombieplant[r];
      o.push(c);
    }
    var h = t.split("|");
    var m = [];
    for (var f = 0; f < h.length; f++) {
      var y = h[f].split("_");
      2 == y.length && Number(y[0]) != r && m.push({
        id: Number(y[0]),
        weights: Number(y[1])
      });
    }
    for (; o.length < 3;) {
      var _ = m.map(function (t) {
        return t.weights;
      });
      var P = $10MathUtil.MathUtil.weightedRandom(_);
      var v = $10DataManager.DataManager.instance.eData.data_zombieplant[m[P].id];
      o.push(v);
      m.splice(P, 1);
    }
    var D = o[Math.floor(Math.random() * o.length)];
    this._plantData = D;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/botanyIcon/BotanyIcon",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      if (n.node && n.node.isValid) {
        n.itemCard.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame(D.icon);
        for (var e = 1; e < 4; e++) {
          var i = n.node.getChildByName("PlantItem" + e);
          i && (i.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame(o[e - 1].icon));
        }
      }
    }).catch(function (t) {
      console.log("error:", t);
    });
    o = o.sort(function () {
      return Math.random() - .5;
    });
    this.scheduleOnce(function () {
      var t = function (t) {
        var e = n.node.getChildByName("PlantItem" + t);
        var o = n.node.getChildByName("beimian" + t);
        o.scaleX = 0;
        cc.tween(e).to(.2, {
          scaleX: 0
        }).call(function () {
          e.active = false;
          cc.tween(o).to(.2, {
            scaleX: 1
          }).call(function () {
            o.scaleX = 1;
            o.active = false;
            n.fapaiSp.node.active = true;
            n.fapaiSp.setCompleteListener(function () {
              for (var t = 1; t < 4; t++) {
                n.node.getChildByName("beimian" + t).active = true;
              }
              n.fapaiSp.node.active = false;
              n.node.getChildByName("tips").active = true;
            });
            n.fapaiSp.setAnimation(0, "xipai", false);
          }).start();
        }).start();
      };
      for (var e = 1; e < 4; e++) {
        t(e);
      }
    }, 1);
  };
  _ctor.prototype.onClick = function (t) {
    var e = this;
    if (!this._isClickEd) {
      this._isClickEd = true;
      this.node.getChildByName("tips").active = false;
      var n = t.target;
      this.itemCard.position = n.position;
      cc.tween(n).to(.2, {
        scaleX: 0
      }).call(function () {
        n.active = false;
        e.itemCard.scaleX = 0;
        e.itemCard.active = true;
        cc.tween(e.itemCard).to(.2, {
          scaleX: 1
        }).delay(1).call(function () {
          cc.tween(e.itemCard).to(.2, {
            position: e._endPos
          }).call(function () {
            $10EventManager.EventManager.instance.emit($10PlantDefenseDataProxy.PDDataEvent.ADD_PLANT_CARD, e._plantData);
            e.node.destroy();
            $10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PAUSE && ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState = $10GameEnum.GameState.PLAYING);
          }).start();
        }).start();
      }).start();
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "itemCard", undefined);
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "fapaiSp", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDFaPaiView;