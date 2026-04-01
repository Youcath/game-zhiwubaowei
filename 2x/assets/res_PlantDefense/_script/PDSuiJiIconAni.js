var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_PDSuiJiIconAni = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._icons = [];
    e._showIndex = 0;
    e._speed = .05;
    e._istart = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if (this._istart) {
      this._speed -= t;
      if (this._speed <= 0) {
        this.changeIcon(), this._speed = .05;
      }
    }
  };
  _ctor.prototype.play = function (t, e) {
    this._callback = e;
    var n = t.split("|");
    for (var o = 0; o < n.length; o++) {
      var i = n[o].split("_");
      var a = $10DataManager.DataManager.instance.eData.data_zombieplant[Number(i[0])];
      a && this._icons.push(a.icon);
    }
    this.changeIcon();
    this._istart = true;
  };
  _ctor.prototype.changeIcon = function () {
    var t = this;
    this._showIndex++;
    this._showIndex >= this._icons.length && (this._showIndex = 0);
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/botanyIcon/BotanyIcon",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (e) {
      if (t.node && t.node.isValid) {
        t.node.getComponent(cc.Sprite).spriteFrame = e.getSpriteFrame(t._icons[t._showIndex]);
        t._callback && t._callback(e.getSpriteFrame(t._icons[t._showIndex]));
      }
    }).catch(function (t) {
      console.log("error:", t);
    });
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDSuiJiIconAni;