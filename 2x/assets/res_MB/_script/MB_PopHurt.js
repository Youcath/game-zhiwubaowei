var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EBattlePopHurtType = undefined;
var r;
var $10MathUtil = require("MathUtil");
var $10NodePoolManager = require("NodePoolManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
(function (t) {
  t[t.COMMON = 0] = "COMMON";
  t[t.CRIT = 1] = "CRIT";
  t[t.RECOVER = 2] = "RECOVER";
  t[t.EVASION = 3] = "EVASION";
  t[t.COMBO = 4] = "COMBO";
  t[t.REBATE = 5] = "REBATE";
})(r = exports.EBattlePopHurtType || (exports.EBattlePopHurtType = {}));
var def_MB_PopHurt = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.lHurt = null;
    e.lCirt = null;
    e.nPop = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.popup = function (t, e) {
    this.nPop.y = 0;
    this.nPop.scale = 1;
    this.nPop.opacity = 255;
    this.lCirt.node.color = cc.Color.WHITE;
    this.lHurt.node.color = cc.Color.WHITE;
    if (e == r.CRIT) {
      this.lCirt.node.active = true;
      this.lHurt.node.active = false;
      this.lCirt.string = $10MathUtil.MathUtil.formatValue(t);
      this.lCirt.node.color = new cc.Color().fromHEX("#FFA800");
    } else if (e == r.COMMON) {
      this.lCirt.node.active = false;
      this.lHurt.node.active = true;
    } else if (e == r.RECOVER) {
      this.lCirt.node.active = false;
      this.lHurt.node.active = true;
      this.lHurt.node.color = cc.Color.GREEN;
    } else if (e == r.EVASION) {
      this.lCirt.node.active = false;
      this.lHurt.node.active = true;
      this.lHurt.node.color = new cc.Color().fromHEX("#00DBFF");
    } else if (e == r.COMBO) {
      this.lCirt.node.active = false;
      this.lHurt.node.active = true;
      this.lHurt.node.color = new cc.Color().fromHEX("#5900FF");
    } else if (e == r.REBATE) {
      this.lCirt.node.active = false, this.lHurt.node.active = true, this.lHurt.node.color = new cc.Color().fromHEX("#FFEE00");
    }
    var n = $10MathUtil.MathUtil.formatValue(t);
    if (this.lHurt.node.active) {
      switch (e) {
        case r.EVASION:
          this.lHurt.string = "闪避";
          break;
        case r.COMBO:
          this.lHurt.string = "连击";
          break;
        case r.REBATE:
          this.lHurt.string = "反击";
          break;
        default:
          this.lHurt.string = n;
      }
    }
    this.lCirt.node.active && (this.lCirt.string = n);
    this.playAnim(e);
  };
  _ctor.prototype.playAnim = function (t) {
    var e = this;
    if (t != r.COMMON) {
      if (t != r.CRIT) {
        if (t != r.RECOVER) {
          this.nPop.scale = 3.25;
          cc.tween(this.nPop).to(.6, {
            scale: 1
          }, {
            easing: "backOut"
          }).delay(.2).call(function () {
            e.remove();
          }).start();
        } else {
          cc.tween(this.nPop).by(.4, {
            y: 60
          }).call(function () {
            e.remove();
          }).start();
        }
      } else {
        cc.tween(this.nPop).to(.1, {
          scale: 1.6
        }, {
          easing: "backOut"
        }).to(.05, {
          scale: 1
        }).delay(.05).to(.2, {
          y: 20
        }).parallel(cc.tween().by(.4, {
          y: 20
        }), cc.tween().to(.3, {
          opacity: 0
        })).call(function () {
          e.remove();
        }).start();
      }
    } else {
      cc.tween(this.nPop).to(.1, {
        scale: 1.4
      }, {
        easing: "backOut"
      }).to(.05, {
        scale: 1
      }).delay(.05).to(.2, {
        y: 20
      }).parallel(cc.tween().by(.4, {
        y: 20
      }), cc.tween().to(.3, {
        opacity: 0
      })).call(function () {
        e.remove();
      }).start();
    }
  };
  _ctor.prototype.remove = function () {
    cc.Tween.stopAllByTarget(this.nPop);
    $10NodePoolManager.default.instance.putNode(this.node, true);
  };
  _ctor.prototype.onDestroy = function () {
    cc.Tween.stopAllByTarget(this.nPop);
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "lHurt", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "lCirt", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nPop", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_MB_PopHurt;