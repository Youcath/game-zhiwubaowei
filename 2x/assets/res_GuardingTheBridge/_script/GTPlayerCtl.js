var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10ComponentBase = require("ComponentBase");
var $10ResUtil = require("ResUtil");
var $10PopupManager = require("PopupManager");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10GuardingDataProxy = require("GuardingDataProxy");
var $10GTBullet = require("GTBullet");
var $10GTPoolMgr = require("GTPoolMgr");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GTPlayerCtl = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.player = null;
    e.bullet = null;
    e._playNodes = [];
    e._attackSpeed = .2;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if ($10GuardingDataProxy.guardingDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      this._attackSpeed -= t;
      if (this._attackSpeed <= 0) {
        $10GuardingDataProxy.guardingDataProxy.attackSpeed < $10GuardingDataProxy.guardingDataProxy.attackSpeedMax && ($10GuardingDataProxy.guardingDataProxy.attackSpeed = $10GuardingDataProxy.guardingDataProxy.attackSpeedMax), this._attackSpeed = $10GuardingDataProxy.guardingDataProxy.attackSpeed, this.shoot();
      }
    }
  };
  _ctor.prototype.onLoad = function () {
    this._playNodes = [];
    $10GuardingDataProxy.guardingDataProxy.playerNode = this.node;
    $10GuardingDataProxy.guardingDataProxy.gameState = $10GameEnum.GameState.NONE;
    $10GuardingDataProxy.guardingDataProxy.curRoleImgsrc = "pic_plant10";
    this.addPlay(1);
  };
  _ctor.prototype.start = function () {
    $10GTPoolMgr.GTPoolMgr.Inst.initPool("gt_bullet", this.bullet, 10);
  };
  _ctor.prototype.shoot = function () {
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/launch", $10HomeEnum.Bundles.GuardingTheBridge);
    var t = this._playNodes.length;
    for (var e = 0; e < t; e++) {
      var o = $10GuardingDataProxy.guardingDataProxy.bulletLayout.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(this._playNodes[e].position));
      var i = $10GTPoolMgr.GTPoolMgr.Inst.get("gt_bullet");
      i.parent = $10GuardingDataProxy.guardingDataProxy.bulletLayout;
      i.getComponent($10GTBullet.default).init();
      i.setPosition(o.x, o.y);
    }
  };
  _ctor.prototype.resetPlayerImg = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.GuardingTheBridge,
      path: "textrues/" + $10GuardingDataProxy.guardingDataProxy.curRoleImgsrc,
      type: cc.SpriteFrame
    }).then(function (e) {
      var o = 0;
      for (var i = t._playNodes.length; o < i; o++) {
        var a = t._playNodes[o].getChildByName("body");
        a && (a.getComponent(cc.Sprite).spriteFrame = e);
      }
    });
  };
  _ctor.prototype.beAttack = function (t) {
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/hit_2", $10HomeEnum.Bundles.GuardingTheBridge);
    var e = this.node.getChildByName("zhuahen");
    e.opacity = 0;
    e.active = true;
    cc.tween(e).to(.1, {
      opacity: 255
    }).delay(.2).to(.1, {
      opacity: 0
    }).call(function () {
      e.active = false;
    }).start();
    this.removePlay(t);
  };
  _ctor.prototype.addPlay = function (t) {
    if ($10GuardingDataProxy.guardingDataProxy.gameState != $10GameEnum.GameState.OVER && !(this._playNodes.length >= 20)) {
      this._playNodes.length + t > 20 && (t = 20 - this._playNodes.length);
      for (var e = 0; e < t; e++) {
        var o = cc.instantiate(this.player);
        o.parent = this.node;
        this._playNodes.push(o);
      }
      this.teamArrange();
      this.resetPlayerImg();
    }
  };
  _ctor.prototype.removePlay = function (t) {
    if ($10GuardingDataProxy.guardingDataProxy.gameState != $10GameEnum.GameState.OVER) {
      for (var e = 0; e < t && this._playNodes.length > 0; e++) {
        var o = this._playNodes.pop();
        if (o && o.isValid) {
          o.removeFromParent();
          o.destroy();
        }
      }
      if (0 == this._playNodes.length) {
        $10GuardingDataProxy.guardingDataProxy.gameState = $10GameEnum.GameState.OVER;
        $10PopupManager.PopupManager.instance.show({
          bundleName: $10HomeEnum.Bundles.GuardingTheBridge,
          path: "prefabs/popups/GTLosePopup",
          keep: true
        });
      }
      this.teamArrange();
    }
  };
  _ctor.prototype.teamArrange = function () {
    var t = Math.min(this._playNodes.length, 20);
    if (0 !== t) {
      if (t < 3) {
        this.node.width = 100 + 40 * t;
        this.node.getChildByName("Collider").width = 100 + 40 * t;
      } else {
        this.node.width = 250;
        this.node.getChildByName("Collider").width = 250;
      }
      if (1 == this._playNodes.length) {
        this._playNodes[0].setPosition(cc.v3(0, 0));
        return void (this._playNodes[0].active = true);
      }
      var e = function (t) {
        if (t % 2 == 0) {
          return 3;
        } else {
          return 4;
        }
      };
      var o = 0;
      var i = 0;
      for (var a = t; a > 0;) {
        a -= c = Math.min(e(i), a);
        i++;
      }
      var n = 40 * (i - 1) / 2;
      o = 0;
      for (var r = 0; r < i && o < t; r++) {
        var s = e(r);
        var c = Math.min(s, t - o);
        var l = -50;
        r % 2 > 0 && (l = -75);
        for (var u = 0; u < c && !(o >= t); u++) {
          if (this._playNodes[o] && this._playNodes[o].isValid) {
            var p = l + 50 * u;
            var d = n - 40 * r;
            this._playNodes[o].setPosition(p, d);
            this._playNodes[o].active = true;
            this._playNodes[o].zIndex = -d;
            o++;
          } else {
            o++;
          }
        }
      }
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "player", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "bullet", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10ComponentBase.ComponentBase);
exports.default = def_GTPlayerCtl;