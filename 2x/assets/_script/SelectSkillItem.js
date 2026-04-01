var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10ResUtil = require("ResUtil");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_SelectSkillItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mRecommend = null;
    e.mLvBg = null;
    e.mGradeBg = null;
    e.mSkillIcon = null;
    e.mDes = null;
    e.mSelectEffect = null;
    e._skillData = null;
    e._isItemClick = false;
    e._isCanClick = true;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initSkillItem = function (t) {
    var e = this;
    this._isItemClick = false;
    this._isCanClick = true;
    this._skillData = t;
    this.mRecommend.active = t.quality >= 4;
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/public/pic_dazhiwukuang_" + t.quality,
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      e.mLvBg.spriteFrame = t;
    }).catch(function (t) {
      console.log("error:", t);
    });
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/skill/skillkuang_lv" + (t.quality - 1),
      type: cc.SpriteFrame,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (t) {
      e.mGradeBg.spriteFrame = t;
    }).catch(function (t) {
      console.log("error:", t);
    });
    $10ResUtil.ResUtil.loadAsset({
      path: "textures/skillIcon/SkillIcons",
      type: cc.SpriteAtlas,
      bundleName: $10HomeEnum.Bundles.GAME
    }).then(function (o) {
      e.mSkillIcon.spriteFrame = o.getSpriteFrame("" + t.icon);
    }).catch(function (t) {
      console.log("error:", t);
    });
    this.mDes.string = this._skillData.des;
    this.mSelectEffect.setCompleteListener(function () {
      e._isItemClick && $10EventManager.EventManager.instance.emit($10BattleDataProxy.EBattleEvent.SELECT_SKILL_FINISH, e.node);
    });
    this.mSelectEffect.node.active = false;
  };
  _ctor.prototype.playSelectEffect = function (t) {
    this._isCanClick = false;
    this._isItemClick = t;
    this.mSelectEffect.node.active = true;
    this.mSelectEffect.setAnimation(0, "animation", false);
  };
  _ctor.prototype.onItemClick = function () {
    if (this._isCanClick) {
      $10BattleDataProxy.battleDataProxy.selectSkill(this._skillData.id, this.node);
      $10BattleDataProxy.battleDataProxy.saveData();
      this.playSelectEffect(true);
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mRecommend", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mLvBg", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mGradeBg", undefined);
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "mSkillIcon", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mDes", undefined);
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSelectEffect", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_SelectSkillItem;