var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10ResUtil = require("ResUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10STJDataProxy = require("STJDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_STCardItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.iconImg = null;
    e._monsterData = null;
    e._isDragging = false;
    e._dragPreview = null;
    e._originalPosition = null;
    e._battleView = null;
    e._liftTimer = 15;
    e._cardState = 3;
    return e;
  }
  cc__extends(_ctor, t);
  Object.defineProperty(_ctor.prototype, "monsterData", {
    get: function () {
      return this._monsterData;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.onDisable = function () {
    this.node.targetOff(this);
  };
  _ctor.prototype.update = function (t) {
    if ($10STJDataProxy.sTJDataProxy.gameState == $10GameEnum.GameState.PLAYING) {
      this._liftTimer -= t;
      if (this._liftTimer <= 10 && 3 == this._cardState) {
        this._cardState = 2, this.playLight();
      }
      if (this._liftTimer <= 0 && this._cardState > 0) {
        this._cardState = 0, this.destroyCard(), this._isDragging && this.cleanupDragState();
      }
    }
  };
  _ctor.prototype.init = function (t) {
    var e = this;
    this._battleView = $10STJDataProxy.sTJDataProxy.battleView.getComponent("STBattleView");
    this._monsterData = $10DataManager.DataManager.instance.eData.data_jarmonster[t];
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.SmashTheJar,
      path: "textrues/role/" + this._monsterData.res,
      type: cc.SpriteFrame
    }).then(function (t) {
      e.iconImg.spriteFrame = t;
      e.node.active = true;
    });
    this.addTouchEvents();
    this.scheduleOnce(function () {
      e.createDragPreview();
    }, .1);
    this._cardState = 3;
    this._liftTimer = 15;
  };
  _ctor.prototype.playLight = function () {
    cc.tween(this.node).repeatForever(cc.tween().to(.5, {
      opacity: 166,
      scale: 1
    }).to(.5, {
      opacity: 255,
      scale: 1.3
    })).start();
  };
  _ctor.prototype.addTouchEvents = function () {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  };
  _ctor.prototype.onTouchStart = function () {
    this._originalPosition = this.node.position.clone();
    this._isDragging = true;
    this.node.zIndex = 1e3;
    this.node.opacity = 180;
  };
  _ctor.prototype.onTouchMove = function (t) {
    t.stopPropagation();
    if (this._isDragging) {
      var e = this.node.parent.convertToNodeSpaceAR(t.getLocation());
      this.node.setPosition(e);
      this.updateTargetGridFeedback(e);
    }
  };
  _ctor.prototype.onTouchEnd = function (t) {
    t.stopPropagation();
    if (this._isDragging) {
      this._isDragging = false;
      var e = this.node.parent.convertToNodeSpaceAR(t.getLocation());
      var o = this.getValidTargetGrid(e);
      if (o) {
        this.deployDefender(o);
        this.destroyCard();
      } else {
        this.returnToOriginalPosition();
      }
      this.cleanupDragState();
    }
  };
  _ctor.prototype.createDragPreview = function () {
    var t = this;
    $10ResUtil.ResUtil.loadAsset({
      bundleName: $10HomeEnum.Bundles.SmashTheJar,
      path: "prefabs/roles/Role_" + this._monsterData.id,
      type: cc.Prefab
    }).then(function (e) {
      t._dragPreview = cc.instantiate(e);
      t._dragPreview.opacity = 100;
      t._dragPreview.parent = t.node.parent;
      t._dragPreview.active = false;
    });
  };
  _ctor.prototype.updateTargetGridFeedback = function (t) {
    if (this._battleView) {
      var e = this._battleView.getExactGridByPosition(t.x, t.y);
      this._battleView.clearGridHighlight();
      if (e && this.isValidPlacement(e)) {
        if (this._dragPreview) {
          this._dragPreview.setPosition(e.x, e.y), this._dragPreview.active = true;
        }
      } else {
        this._dragPreview && (this._dragPreview.active = false);
        e && this._battleView.highlightGrid(e, cc.Color.RED);
      }
    }
  };
  _ctor.prototype.getValidTargetGrid = function (t) {
    if (!this._battleView) {
      return null;
    }
    var e = this._battleView.getExactGridByPosition(t.x, t.y);
    if (e && this.isValidPlacement(e)) {
      return e;
    } else {
      return null;
    }
  };
  _ctor.prototype.isValidPlacement = function (t) {
    return !$10STJDataProxy.sTJDataProxy.isJarfanzhi(t.id);
  };
  _ctor.prototype.deployDefender = function (t) {
    this._battleView && this._battleView.createDefender(t, this._monsterData);
  };
  _ctor.prototype.returnToOriginalPosition = function () {
    cc.tween(this.node).to(.3, {
      position: this._originalPosition,
      opacity: 255
    }, {
      easing: "backOut"
    }).start();
  };
  _ctor.prototype.destroyCard = function () {
    var t = this;
    cc.tween(this.node).to(.2, {
      scale: 0,
      opacity: 0
    }).call(function () {
      t.node.destroy();
    }).start();
  };
  _ctor.prototype.cleanupDragState = function () {
    this._isDragging = false;
    this.node.zIndex = 0;
    this.node.opacity = 255;
    if (this._dragPreview) {
      this._dragPreview.destroy();
      this._dragPreview = null;
    }
    this._battleView && this._battleView.clearGridHighlight();
  };
  cc__decorate([ccp_property(cc.Sprite)], _ctor.prototype, "iconImg", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_STCardItem;