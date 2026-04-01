var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10PopupBase = require("PopupBase");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10BattleDataProxy = require("BattleDataProxy");
var $10UserDataProxy = require("UserDataProxy");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_CourseView = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBlackMask = null;
    e.mHoleMask = null;
    e.mContent = null;
    e.mTxt = null;
    e.mNpcSpine = null;
    e.mFinger = null;
    e._dialogueTexts = [];
    e._dialogueIdx = 0;
    e._dialogueTextIdx = 0;
    e._plotIsOver = false;
    e._courseId = 0;
    e._isUpdate = false;
    e._courseData = null;
    e._oldGameState = $10GameEnum.GameState.PLAYING;
    e._soundId = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.onLoad = function () {
    $10EventManager.EventManager.instance.on($10BattleDataProxy.EBattleEvent.LOSE_COURSE_VIEW, this.removeSelf, this);
  };
  _ctor.prototype.touchStart = function () {
    this._plotIsOver || this.showFullDialogue();
  };
  _ctor.prototype.onDisable = function () {
    this._courseData.isGame && ($10BattleDataProxy.battleDataProxy.gameState = this._oldGameState);
    $10EventManager.EventManager.instance.off($10BattleDataProxy.EBattleEvent.LOSE_COURSE_VIEW, this.removeSelf, this);
  };
  _ctor.prototype.init = function (t) {
    if (this._courseId != t.args.courseId) {
      this._courseData = t.args;
      this._isUpdate = true;
      this._courseId = t.args.courseId;
      mm.platform.umaTrackEvent("guide", {
        userA: "guide" + this._courseId
      });
      if (this._courseData.isGame) {
        this._oldGameState = $10BattleDataProxy.battleDataProxy.gameState, $10BattleDataProxy.battleDataProxy.gameState = $10GameEnum.GameState.PAUSE;
      }
    } else {
      this._isUpdate = false;
    }
  };
  _ctor.prototype.changeDes = function () {};
  _ctor.prototype.initDialogueData = function () {
    this._dialogueIdx = 0;
    this._dialogueTexts.length = 0;
    this._dialogueTextIdx = 0;
    this._plotIsOver = false;
  };
  _ctor.prototype.showTalk = function () {
    var t = this;
    var e = $10DataManager.DataManager.instance.eData.datagameguid[this._courseId];
    this.mNpcSpine.setAnimation(0, "talk", true);
    this.mContent.active = true;
    this.initDialogueData();
    $10AudioManager.AudioManager.instance.playCourseSound("sounds/" + e.voice, $10HomeEnum.Bundles.RES, function (e) {
      t._soundId = e;
    });
    if (this._isUpdate) {
      this.mHoleMask.active = false;
      this.mBlackMask.active = true;
      this.mFinger.active = false;
      this.mFinger.children[0].getComponent(sp.Skeleton).paused = false;
      this.mContent.active = e.boradType > 0;
      this.mTxt.string = "";
      var o = e.des.replace("\\n", "\n");
      this._dialogueTexts.push(o);
      this._dialogueTexts.length > 0 && this.schedule(this.dialogueSchedule, .075);
      var i = this.mContent.getChildByName("guangbiao");
      cc.Tween.stopAllByTarget(i);
      var n = cc.tween(i).by(.25, {
        position: cc.v3(0, -10)
      }).by(.25, {
        position: cc.v3(0, 10)
      }).delay(.25);
      cc.tween(i).repeatForever(n).start();
      var a = this.node.getChildByName("touchNode");
      a.targetOff(this);
      a.on(cc.Node.EventType.TOUCH_START, function (e) {
        t.touchStart(e);
      }, this);
    } else {
      this.setTouchEvent();
    }
  };
  _ctor.prototype.onShow = function () {
    var t = this;
    var e = $10DataManager.DataManager.instance.eData.datagameguid[this._courseId];
    if (10 == e.id || 8 == e.id) {
      this.mContent.y = 500;
    } else if (2 == e.id) {
      this.mContent.y = 600;
    } else if (5 == e.id) {
      this.mContent.y = -270;
    } else {
      this.mContent.y = e.desy;
    }
    this.mNpcSpine.node.y = this.mContent.y - 288;
    if (1 == e.falsh || 3 == e.falsh) {
      this.mContent.active = false;
      this.mNpcSpine.node.x = cc.winSize.width / 2 + 300;
      cc.Tween.stopAllByTarget(this.mNpcSpine.node);
      this.mNpcSpine.setAnimation(0, "jinru", false);
      cc.tween(this.mNpcSpine.node).to(0.16666666666666666, {
        position: cc.v3(210, this.mNpcSpine.node.y)
      }).call(function () {
        t.showTalk();
      }).start();
    } else {
      this.showTalk();
    }
  };
  _ctor.prototype.setTouchEvent = function () {
    var t = this;
    var e = $10DataManager.DataManager.instance.eData.datagameguid[this._courseId];
    this.mHoleMask.active = false;
    this.mBlackMask.active = true;
    this.mFinger.active = 2 == e.showType;
    cc.Tween.stopAllByTarget(this.mFinger);
    this.mFinger.children[0].getComponent(sp.Skeleton).paused = false;
    this.mContent.active = e.boradType > 0;
    this.changeDes();
    switch (e.showType) {
      case 2:
        this.mHoleMask.active = true;
        this.mBlackMask.active = false;
        this.mHoleMask.getChildByName("bg").targetOff(this);
        this.mHoleMask.targetOff(this);
        break;
      default:
        if (11 != e.id) {
          this.mBlackMask.active = true;
          this.mBlackMask.targetOff(this);
          this.mBlackMask.on(cc.Node.EventType.TOUCH_END, function () {
            t.removeSelf();
          }, this);
        }
    }
    cc.Tween.stopAllByTarget(this.mFinger);
    if (this._courseData.targetNode) {
      this.mHoleMask.active = true;
      this.mBlackMask.active = false;
      this.mHoleMask.width = this._courseData.targetNode.width;
      this.mHoleMask.height = this._courseData.targetNode.height;
      var o = this._courseData.targetNode.convertToWorldSpaceAR(cc.v3());
      var i = this._courseData.targetNode.anchorY;
      var n = this.node.convertToNodeSpaceAR(o).add(cc.v3(0, (.5 - i) * this._courseData.targetNode.height));
      this.mHoleMask.position = n.clone();
      this.mFinger.position = n.clone();
      this.mFinger.children[0].getComponent(sp.Skeleton).setAnimation(0, "Click", true);
    } else {
      this._courseData.targetNode1 && this._courseData.targetNode2 && this.updateMoveTargetNode(this._courseData.targetNode1, this._courseData.targetNode2);
    }
    if (3 == e.finishType) {
      if (this.mHoleMask.active) {
        this.mHoleMask.getChildByName("bg").targetOff(this);
        this.mHoleMask.getChildByName("bg").on(cc.Node.EventType.TOUCH_END, function () {
          t.mHoleMask.getChildByName("bg").targetOff(t);
          t.removeSelf();
        }, this);
      } else if (this.mBlackMask.active) {
        this.mBlackMask.targetOff(this);
        this.mBlackMask.on(cc.Node.EventType.TOUCH_END, function () {
          t.removeSelf();
        }, this);
      } else {
        this.node.targetOff(this);
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
          t.removeSelf();
        }, this);
      }
    } else {
      this.mHoleMask.getChildByName("bg").targetOff(this);
    }
    switch (e.id) {
      case 2:
        this.mHoleMask.active = false;
        this.mBlackMask.active = false;
    }
    cc.audioEngine.stopEffect(this._soundId);
    this.mNpcSpine.setAnimation(0, "stand", true);
  };
  _ctor.prototype.updateMoveTargetNode = function (t, e) {
    var o = this;
    var i = t.convertToWorldSpaceAR(cc.v3());
    var n = e.convertToWorldSpaceAR(cc.v3());
    var a = this.node.convertToNodeSpaceAR(i);
    var r = this.node.convertToNodeSpaceAR(n);
    cc.Tween.stopAllByTarget(this.mFinger);
    var s = cc.tween(this.mFinger).call(function () {
      o.mFinger.children[0].getComponent(sp.Skeleton).setAnimation(0, "Drag", false);
      o.mFinger.position = a.clone();
    }).delay(0.6666666666666666).to(1, {
      position: r
    }).delay(0.8333333333333334);
    cc.tween(this.mFinger).repeatForever(s).start();
  };
  _ctor.prototype.removeSelf = function (t) {
    var e = this;
    t && (this._oldGameState = t);
    var o = $10DataManager.DataManager.instance.eData.datagameguid[this._courseId];
    if (2 == o.falsh || 3 == o.falsh) {
      cc.Tween.stopAllByTarget(this.mNpcSpine.node);
      this.mNpcSpine.setAnimation(0, "tuichu", false);
      cc.tween(this.mNpcSpine.node).to(0.16666666666666666, {
        position: cc.v3(cc.winSize.width / 2 + 300, this.mNpcSpine.node.y)
      }).call(function () {
        e.removeUI();
        $10UserDataProxy.userDataProxy.completeCourse(e._courseId);
      }).start();
    } else {
      this.removeUI();
      $10UserDataProxy.userDataProxy.completeCourse(this._courseId);
    }
  };
  _ctor.prototype.setFingerIsShow = function (t) {
    this.mFinger.active = t;
  };
  _ctor.prototype.dialogueSchedule = function () {
    if (this._dialogueIdx >= this._dialogueTexts.length) {
      this.showFullDialogue();
    } else {
      this.mTxt.node.active = true;
      this.mTxt.string = this.getText(0);
    }
  };
  _ctor.prototype.showFullDialogue = function () {
    this._plotIsOver = true;
    this.unschedule(this.dialogueSchedule);
    this._dialogueIdx = this._dialogueTexts.length;
    this.mTxt.node.active = true;
    this.mTxt.string = this.getText(0);
    this.node.getChildByName("touchNode").targetOff(this);
    this.setTouchEvent();
  };
  _ctor.prototype.getText = function (t) {
    var e = this._dialogueTexts[t];
    if (!e) {
      return "";
    }
    if (this._dialogueIdx > t) {
      return e;
    }
    if (this._dialogueIdx < t) {
      return "";
    }
    var o = "";
    for (var i = 0; i < this._dialogueTextIdx; ++i) {
      o += e[i];
    }
    if (o.length >= e.length) {
      this._dialogueIdx++;
      this._dialogueTextIdx = 0;
    } else {
      this._dialogueTextIdx++;
    }
    return o;
  };
  cc__decorate([ccp_property({
    type: cc.Node,
    displayName: "纯黑遮罩"
  })], _ctor.prototype, "mBlackMask", undefined);
  cc__decorate([ccp_property({
    type: cc.Node,
    displayName: "抠洞遮罩"
  })], _ctor.prototype, "mHoleMask", undefined);
  cc__decorate([ccp_property({
    type: cc.Node,
    displayName: "文字窗口"
  })], _ctor.prototype, "mContent", undefined);
  cc__decorate([ccp_property({
    type: cc.Label,
    displayName: "文字"
  })], _ctor.prototype, "mTxt", undefined);
  cc__decorate([ccp_property({
    type: sp.Skeleton,
    displayName: "人物spine"
  })], _ctor.prototype, "mNpcSpine", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mFinger", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PopupBase.PopupBase);
exports.default = def_CourseView;