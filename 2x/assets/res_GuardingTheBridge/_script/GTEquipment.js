var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10GuardingDataProxy = require("GuardingDataProxy");
var $10GTGameMgr = require("GTGameMgr");
var $10GTSpAnimCtrl = require("GTSpAnimCtrl");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GTEquipment = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mColliderNode = null;
    e.mhpLabel = null;
    e.iconSp = null;
    e.nGuanzi = null;
    e.spGuanzi = null;
    e._isDead = false;
    e._hp = 0;
    e._equipmentData = null;
    e._isPlayHitIng = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.lateupdate = function () {
    $10GuardingDataProxy.guardingDataProxy.gameState == $10GameEnum.GameState.PLAYING && (this.node.zIndex = -this.node.y);
  };
  _ctor.prototype.init = function (t) {
    var e = this;
    this._equipmentData = t;
    this.spGuanzi.node.active = false;
    if ("lianhua" != t.icon) {
      $10ResUtil.ResUtil.loadAsset({
        bundleName: $10HomeEnum.Bundles.GuardingTheBridge,
        path: "textrues/" + t.icon,
        type: cc.SpriteFrame
      }).then(function (t) {
        if (e.iconSp && e.iconSp.isValid) {
          e.iconSp.spriteFrame = t;
          e.node.getChildByName("wupinfaguang").active = true;
        }
      });
    } else {
      this.iconSp.node.active = false;
      this.node.getChildByName("wupinfaguang").active = false;
    }
    this._hp = t.hp;
    this.updateHp();
  };
  _ctor.prototype.updateHp = function () {
    this.mhpLabel.string = this._hp.toString();
  };
  _ctor.prototype.beAttack = function (t, e) {
    t *= 1;
    this.subHp(t);
    e && this.showHurtLab(t);
    if (this._hp <= 0) {
      return this.dealDie(), true;
    } else {
      return this.hit(), false;
    }
  };
  _ctor.prototype.showHurtLab = function (t) {
    var e = $10GuardingDataProxy.guardingDataProxy.effectLayer.convertToNodeSpaceAR(this.node.parent.convertToWorldSpaceAR(this.node.position));
    $10GTGameMgr.default.instance.showHitNum(t, e);
  };
  _ctor.prototype.subHp = function (t) {
    isNaN(t) && (t = 1);
    this._hp -= t;
    isNaN(this._hp) && (this._hp = 10);
    this._hp < 0 && (this._hp = 0);
    this.updateHp();
  };
  _ctor.prototype.hit = function () {
    var t = this;
    if (!this._isPlayHitIng) {
      this._isPlayHitIng = true;
      cc.tween(this.node).to(.1, {
        scale: 1.1
      }).to(.1, {
        scale: 1
      }).call(function () {
        t._isPlayHitIng = false;
      }).start();
    }
  };
  _ctor.prototype.dealDie = function () {
    var t = this;
    if (!this._isDead) {
      this._isDead = true;
      this.nGuanzi.active = false;
      this.spGuanzi.node.active = true;
      $10AudioManager.AudioManager.instance.playEffectPath("sounds/Knock", $10HomeEnum.Bundles.GuardingTheBridge);
      this.spGuanzi.playAnim("broken", 1, false, function () {
        if ("lianhua" != t._equipmentData.icon) {
          var e = $10GuardingDataProxy.guardingDataProxy.effectLayer.convertToNodeSpaceAR(t.node.parent.convertToWorldSpaceAR(t.node.position));
          $10GTGameMgr.default.instance.getEquipementEffect(e, t._equipmentData);
        }
        var o = $10GuardingDataProxy.guardingDataProxy.equipments.indexOf(t.node);
        -1 != o && $10GuardingDataProxy.guardingDataProxy.equipments.splice(o, 1);
        t.node.destroy();
        t.node.removeFromParent();
        if ("lianhua" != t._equipmentData.icon) {
          setTimeout(function () {
            $10EventManager.EventManager.instance.emit($10GuardingDataProxy.GuardingDataEvent.UPDATE_EQUIPMENT);
          }, 1e3);
        } else {
          $10EventManager.EventManager.instance.emit($10GuardingDataProxy.GuardingDataEvent.UPDATE_EQUIPMENT);
        }
      });
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mColliderNode", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mhpLabel", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "iconSp", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nGuanzi", undefined);
  cc__decorate([ccp_property($10GTSpAnimCtrl.default)], _ctor.prototype, "spGuanzi", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_GTEquipment;