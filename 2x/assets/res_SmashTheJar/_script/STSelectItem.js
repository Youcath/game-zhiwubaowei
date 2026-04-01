var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EventManager = require("EventManager");
var $10AdsMgr = require("AdsMgr");
var $10STJDataProxy = require("STJDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_STSelectItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mName = null;
    e.level = null;
    e.startBtn = null;
    e._itemData = null;
    e._isCanLocked = false;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.updateData = function (t) {
    this._itemData = t;
    this.level.string = "第" + t.id + "关";
    this._isCanLocked = false;
    if ($10STJDataProxy.sTJDataProxy.STJData.unlockLevels.indexOf(t.id) < 0) {
      this._isCanLocked = false;
      var e = $10STJDataProxy.sTJDataProxy.STJData.unlocklookAd[t.id] || 0;
      this.startBtn.getChildByName("locked").getChildByName("num").getComponent(cc.Label).string = e + "/3";
    } else {
      this._isCanLocked = true;
      this.startBtn.getChildByName("locked").active = true;
    }
    this.startBtn.getChildByName("unLocked").active = this._isCanLocked;
    this.startBtn.getChildByName("locked").active = !this._isCanLocked;
  };
  _ctor.prototype.onClickStart = function () {
    var t = this;
    if (this._isCanLocked) {
      $10STJDataProxy.sTJDataProxy.selectStageId = this._itemData.id;
      $10EventManager.EventManager.instance.emit($10STJDataProxy.STJDataEvent.Eenter_STJ_GAME);
    } else {
      $10AdsMgr.default.showVideoAds({
        id: 1,
        eventId: "shoot_unlock_game",
        success: function () {
          if ($10STJDataProxy.sTJDataProxy.STJData.unlocklookAd[t._itemData.id]) {
            $10STJDataProxy.sTJDataProxy.STJData.unlocklookAd[t._itemData.id] += 1;
          } else {
            $10STJDataProxy.sTJDataProxy.STJData.unlocklookAd[t._itemData.id] = 1;
          }
          $10STJDataProxy.sTJDataProxy.STJData.unlocklookAd[t._itemData.id] >= 3 && ($10STJDataProxy.sTJDataProxy.STJData.unlockLevels.includes(t._itemData.id) || $10STJDataProxy.sTJDataProxy.STJData.unlockLevels.push(t._itemData.id));
          $10STJDataProxy.sTJDataProxy.saveData();
          t.updateData(t._itemData);
        },
        fail: function () {},
        error: function (t) {
          cc.log(t);
        }
      }, true);
    }
  };
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "mName", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "level", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "startBtn", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_STSelectItem;