var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_HeavyFogEffect = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._isMoveBack = false;
    e._backTime = 0;
    e._isCanBeBlown = true;
    e._showImage = null;
    e._heavyFogPos = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initHeavyFogEffect = function (t) {
    this._heavyFogPos = t;
    this._heavyFogPos.pos.addSelf(cc.v3(0, 196));
    this._showImage = this.node.getChildByName("image" + this._heavyFogPos.imageId);
    cc.Tween.stopAllByTarget(this._showImage);
    var e = Math.floor(1e3 * Math.random()) % 20 + 15;
    0 == Math.floor(1e3 * Math.random()) % 2 && (e *= -1);
    var o = cc.tween(this._showImage).by(2, {
      position: cc.v3(e, 0)
    }).by(2, {
      position: cc.v3(-e, 0)
    });
    cc.tween(this._showImage).repeatForever(o).start();
    this.node.position = this._heavyFogPos.pos;
    this.node.scale = this._heavyFogPos.scale;
    this._showImage.active = true;
  };
  _ctor.prototype.beBlownAway = function (t) {
    if (!this._isMoveBack && this._isCanBeBlown) {
      this._showImage.pauseAllActions();
      var e = $10MathUtil.MathUtil.getDoublPointRadian(this.node.position, t.position);
      var o = this.node.x + 500 * Math.cos(e);
      var i = this.node.y + 500 * Math.sin(e);
      var n = cc.v3(o, i);
      cc.Tween.stopAllByTarget(this.node);
      cc.tween(this.node).to(.5, {
        position: n,
        angle: 950
      }).start();
      this._isMoveBack = true;
    }
  };
  _ctor.prototype.update = function (t) {
    var e = this;
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._isMoveBack) {
      this._backTime += t;
      if (this._backTime >= 6) {
        this._backTime = 0, this._isMoveBack = false, this._isCanBeBlown = false, cc.Tween.stopAllByTarget(this.node), this.node.scale = 0, this.node.position = this._heavyFogPos.pos, this.node.angle = 0, this._showImage.resumeAllActions(), cc.tween(this.node).to(.5, {
          scale: this._heavyFogPos.scale
        }).call(function () {
          e._isCanBeBlown = true;
        }).start();
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_HeavyFogEffect;