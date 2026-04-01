var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PopupBase = require("PopupBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GMPopup = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mItemIDBox = null;
    e.mItemAmountBox = null;
    e.mGmEmail = null;
    e.mActorIdBox = null;
    e.editBoxJumpStage = null;
    e.mSkillIdBox = null;
    e.editBoxTask = null;
    e.nBtnHomeFunc = null;
    e.nBtnBattleFunc = null;
    e.tBattlePlayerActorInvincible = null;
    e.nBattleToggle = null;
    e.jumpStage = 0;
    e.jumpTask = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    t.prototype.onLoad.call(this);
  };
  _ctor.prototype.init = function (t) {
    this.node.getChildByName("ItemAdd").active = !t.isBattle;
    this.node.getChildByName("ActorAdd").active = t.isBattle;
    this.node.getChildByName("JumpStage").active = !t.isBattle;
    this.nBattleToggle.active = t.isBattle;
    this.nBtnBattleFunc.active = t.isBattle;
    this.nBtnHomeFunc.active = !t.isBattle;
  };
  _ctor.prototype.onDestroy = function () {
    t.prototype.onDestroy.call(this);
  };
  _ctor.prototype.onClickJumpTask = function () {
    var t = Number(this.editBoxTask.string);
    isNaN(t) || 0 == t || (this.jumpTask = t);
  };
  _ctor.prototype.onClickJumpStage = function () {
    var t = Number(this.editBoxJumpStage.string);
    isNaN(t);
  };
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "mItemIDBox", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "mItemAmountBox", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mGmEmail", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "mActorIdBox", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "editBoxJumpStage", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "mSkillIdBox", undefined);
  cc__decorate([ccp_property(cc.EditBox)], _ctor.prototype, "editBoxTask", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nBtnHomeFunc", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nBtnBattleFunc", undefined);
  cc__decorate([ccp_property(cc.Toggle)], _ctor.prototype, "tBattlePlayerActorInvincible", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "nBattleToggle", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_GMPopup;