var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10NodePoolManager = require("NodePoolManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10PlacePlantEffect = require("PlacePlantEffect");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_SuperPlantMapItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mRoot = null;
    e.mNewStarNum = 0;
    e.mSuperIsActive = false;
    e._plantNum = 0;
    e._plantItemPos = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function () {
    var t = this;
    this.mRoot.children.forEach(function (e) {
      t._plantItemPos.push(e.position.clone());
      e.active = false;
    });
    var e = $10BattleDataProxy.battleDataProxy.getSuperPlantNum();
    this.initSuperPlantNum(e);
  };
  _ctor.prototype.initSuperPlantNum = function (t) {
    var e = this;
    this.mRoot.children.forEach(function (t) {
      e._plantItemPos.push(t.position.clone());
      t.active = false;
    });
    for (var o = 0; o < t; ++o) {
      var i = this.mRoot.children[o];
      if (!i) {
        break;
      }
      i.scale = 1;
      i.opacity = 255;
      i.active = true;
    }
  };
  _ctor.prototype.updateSuperPlantNum = function (t) {
    var e = this;
    var o = this.mRoot.children;
    if (this._plantNum == t) {
      return t >= o.length;
    }
    for (var i = 0; i < t; ++i) {
      var n = this.mRoot.children[i];
      if (!n) {
        break;
      }
      n.scale = 1;
      n.opacity = 255;
      n.active = true;
    }
    if (!this.node.parent.active) {
      return t >= o.length;
    }
    if (this._plantNum > t && t < this.mRoot.childrenCount) {
      var a = this.mRoot.children[t];
      if (a) {
        cc.Tween.stopAllByTarget(a);
        a.scale = 1;
        a.opacity = 255;
        a.position = this._plantItemPos[t];
        cc.tween(a).by(.6, {
          position: cc.v3(0, 50),
          opacity: -255,
          scale: 1
        }).call(function () {
          a.active = false;
        }).start();
      }
    } else {
      var r = this.mRoot.children[t - 1];
      if (r) {
        cc.Tween.stopAllByTarget(r);
        r.active = true;
        r.scale = 7;
        r.opacity = 100;
        r.position = this._plantItemPos[t - 1];
        cc.tween(r).to(.2, {
          scale: 1,
          opacity: 255
        }).call(function () {
          e.addPlacePlantEffect(r.position);
        }).start();
      }
    }
    this._plantNum = t;
    return t >= o.length;
  };
  _ctor.prototype.addPlacePlantEffect = function (t) {
    var e = this;
    $10ResUtil.ResUtil.loadAsset({
      path: "prefabs/item/PlacePlantEffect",
      type: cc.Prefab,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (o) {
      var i = $10NodePoolManager.default.instance.getNode(o);
      e.node.addChild(i);
      i.position = t;
      i.getComponent($10PlacePlantEffect.default).play();
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mRoot", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_SuperPlantMapItem;