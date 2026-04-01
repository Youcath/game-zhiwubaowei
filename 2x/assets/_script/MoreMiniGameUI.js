var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var $10Util = require("Util");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_MoreMiniGameUI = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.contant = null;
    e._isShow = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    $10EventManager.EventManager.instance.on($10HomeEnum.EHomeEvent.RECEIVE_ENDLESS_RWWARDS, this.onReceiveEndlessRewards, this);
  };
  _ctor.prototype.onDestroy = function () {
    $10EventManager.EventManager.instance.off($10HomeEnum.EHomeEvent.RECEIVE_ENDLESS_RWWARDS, this.onReceiveEndlessRewards, this);
  };
  _ctor.prototype.show = function () {
    if (this._isShow) {
      this.hide();
    } else {
      this._isShow = true;
      this.node.active = true;
      this.contant.scale = 0;
      cc.tween(this.contant).to(.2, {
        scale: 1
      }).start();
      this.initEndlessBtn();
    }
  };
  _ctor.prototype.initEndlessBtn = function () {
    var t = this.node.getChildByName("contant").getChildByName("newLayer").getChildByName("BtnEndless");
    var e = $10DataManager.DataManager.instance.miniGames.indexOf($10HomeEnum.ESubGameSwitch.Endless);
    t.active = e >= 0;
    if (t.active) {
      var o = t.getChildByName("redDot");
      var i = Number($10DataManager.DataManager.instance.eData.datapara[1015].num);
      if (i > $10UserDataProxy.userDataProxy.userData.passChapter) {
        var n = t.getChildByName("tipLabel");
        n.getComponent(cc.Label).string = "通过第" + i + "章解锁";
        n.active = true;
        var a = t.getChildByName("icon_wujing");
        $10Util.default.setSpriteGrayMaterial(a.getComponent(cc.Sprite));
        o.active = false;
      } else if (i <= $10UserDataProxy.userDataProxy.userData.passChapter) {
        o.active = $10UserDataProxy.userDataProxy.mYesterdayRank > 0 && 1 != $10UserDataProxy.userDataProxy.userData.endlessData.isReceive;
      } else {
        o.active = false;
      }
    }
  };
  _ctor.prototype.onReceiveEndlessRewards = function () {
    this.node.getChildByName("contant").getChildByName("newLayer").getChildByName("BtnEndless").getChildByName("redDot").active = false;
  };
  _ctor.prototype.hide = function () {
    var t = this;
    if (this._isShow) {
      this._isShow = false;
      cc.tween(this.contant).to(.2, {
        scale: 0
      }).call(function () {
        t.node.active = false;
      }).start();
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "contant", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_MoreMiniGameUI;