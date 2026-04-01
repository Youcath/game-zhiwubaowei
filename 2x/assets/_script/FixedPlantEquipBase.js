var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10GameEnum = require("GameEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var $10EquipmentItem = require("EquipmentItem");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_FixedPlantEquipBase = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._fixedPlantData = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    this._equipmentData = $10GameEnum.EquipmentData["form" + this.mDataFormIdx].data;
    this.level = 1;
    this._root = this.node.getChildByName("root");
    this._adNode = this._root.getChildByName("Ad");
    this.mCounterBar = this._root.getChildByName("barBg").getChildByName("bar").getComponent(cc.Sprite);
    this.mCounterBar.node.parent.active = false;
    this._fixedPlantData = $10DataManager.DataManager.instance.eData.data_fixedplant[this.mEquipId];
    this._superTriggerNum = this._fixedPlantData.triggerNum;
    this._isPurchased = false;
    this.mBoxWhite = this._root.getChildByName("boxWhite");
    this.mBoxWhite.active = false;
    $10EventManager.EventManager.instance.on($10UserDataProxy.EUserDataEvent.UPDATE_VIDEO_CARD, this.updateVideoIconFrame, this);
    this.updateVideoIconFrame();
  };
  _ctor.prototype.onDestroy = function () {
    t.prototype.onDestroy.call(this);
    $10EventManager.EventManager.instance.off($10UserDataProxy.EUserDataEvent.UPDATE_VIDEO_CARD, this.updateVideoIconFrame, this);
  };
  Object.defineProperty(_ctor.prototype, "isPurchased", {
    get: function () {
      return this._isPurchased;
    },
    set: function (t) {
      this._isPurchased = t;
      if (t) {
        this._adNode.active = false;
        this.mCounterBar.node.parent.active = this._superTriggerNum > 1;
        this.mCounterBar.fillRange = this._superTriggerCounter / this._superTriggerNum;
        this.addSleep();
      }
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.hideTriggerBar = function () {
    if (!this.mIsFixedPlant) {
      this._superTriggerCounter = 0;
      this.mCounterBar.fillRange = this._superTriggerCounter / this._superTriggerNum;
    }
  };
  _ctor.prototype.frenzyCollisionEnter = function () {
    if (this.getCollisionIsValid()) {
      this.initAtkTargets();
      if (this._atkTargets.length > 0) {
        this.addSuperTriggerCounter() && this.openFire(), t.prototype.frenzyCollisionEnter.call(this);
      }
    }
  };
  _ctor.prototype.ballCollisionEnter = function () {
    if (this.getCollisionIsValid()) {
      t.prototype.ballCollisionEnter.call(this);
      this.addSuperTriggerCounter() && this.openFire();
    }
  };
  _ctor.prototype.addSuperTriggerCounter = function () {
    var t = false;
    if (106 == this.mEquipId && this._atkTargets.length <= 0) {
      var e = $10BattleDataProxy.battleDataProxy.getEnemyById(4001);
      if (e) {
        this._atkTargets.push(e);
        this._atkTarget = e;
      }
    }
    if (this._atkTargets.length > 0) {
      this._superTriggerCounter++;
      if (this._superTriggerCounter >= this._superTriggerNum) {
        this._superTriggerCounter = 0, t = true, this.addSuperPlantActive();
      }
      this._superTriggerNum > 1 && (this.mCounterBar.fillRange = this._superTriggerCounter / this._superTriggerNum);
    }
    return t;
  };
  _ctor.prototype.setTriggerBarFillRange = function () {};
  _ctor.prototype.getFixedPlantAtkNum = function (t, e) {
    var o = (t + e * ($10UserDataProxy.userDataProxy.userData.curWave - 1)) * $10BattleDataProxy.battleDataProxy.fixedPlantAtkRate;
    return Math.ceil(o);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10EquipmentItem.default);
exports.default = def_FixedPlantEquipBase;