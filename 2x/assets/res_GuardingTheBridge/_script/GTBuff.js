var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameUIManager = require("GameUIManager");
var $10SimplyRectCollider = require("SimplyRectCollider");
var $10SimplyCollisionDetector = require("SimplyCollisionDetector");
var $10GameEnum = require("GameEnum");
var $10GuardingDataProxy = require("GuardingDataProxy");
var $10GTGameMgr = require("GTGameMgr");
var $10GTPlayerCtl = require("GTPlayerCtl");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_GTBuff = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mColliderNode = null;
    e.redNode = null;
    e.blueNode = null;
    e.nameLabel = null;
    e.numLabel = null;
    e._curShowNum = 0;
    e._changeNum = 1;
    e._curChangeNum = 0;
    e._difficulty = 1;
    e._atkNum = 0;
    e._bridgeStage = null;
    e._isDead = false;
    e._startY = 800;
    e._endMaxY = -1e3;
    e._moveSpeed = cc.v3(0, 0);
    e._endScale = 1.3;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.update = function (t) {
    if ($10GuardingDataProxy.guardingDataProxy.gameState == $10GameEnum.GameState.PLAYING && !this._isDead) {
      this.node.position = this.node.position.add(this._moveSpeed.mul(t));
      this.node.zIndex = -this.node.y;
      var e = Math.max(0, Math.min(1, (this._startY - this.node.y) / (this._startY - this._endMaxY)));
      var o = e * e;
      var i = 1 + (this._endScale - 1) * o;
      this.node.scale = i;
      if (this.node.y < 380) {
        var a = $10GuardingDataProxy.guardingDataProxy.playerNode.getChildByName("Collider").getComponent($10SimplyRectCollider.default);
        var n = this.mColliderNode.getComponent($10SimplyRectCollider.default);
        if (a && n && $10SimplyCollisionDetector.default.isCollisionRectToRect(a.rect, n.rect)) {
          return void this.dealDie(true);
        }
      }
      this.node.y < this._endMaxY && this.dealDie(false);
    }
  };
  _ctor.prototype.init = function (t) {
    this._bridgeStage = t;
    this._curShowNum = t.num1;
    this._changeNum = t.num2;
    this._difficulty = t.num3;
    this._moveSpeed = cc.v3(0, -t.speed);
    this._isDead = false;
    var e = "攻击";
    if (2 == t.buffType) {
      e = "角色";
    } else if (3 == t.buffType) {
      e = "攻速";
    } else {
      4 == t.buffType && (e = "暴击");
    }
    this.nameLabel.string = e;
    this.updateNum();
    this.node.active = true;
  };
  _ctor.prototype.updateNum = function () {
    if (1 == this._bridgeStage.type) {
      this.numLabel.string = (this._curShowNum >= 0 ? "+" : "-") + Math.abs(this._curShowNum);
    } else {
      this.numLabel.string = (this._curShowNum >= 0 ? "x" : "÷") + Math.abs(this._curShowNum);
    }
    this.blueNode.active = this._curShowNum >= 0;
    this.redNode.active = this._curShowNum < 0;
  };
  _ctor.prototype.beAttack = function () {
    if (!(this._curChangeNum >= this._changeNum)) {
      this._atkNum += 1;
      if (this._atkNum >= this._difficulty) {
        this._curShowNum += Math.floor(this._atkNum / this._difficulty), this._curChangeNum += Math.floor(this._atkNum / this._difficulty), this._atkNum = 0, this.updateNum();
      }
    }
  };
  _ctor.prototype.dealDie = function (t) {
    var e = this;
    if (!this._isDead) {
      this._isDead = true;
      if (t) {
        var o = "";
        if (1 == this._bridgeStage.buffType) {
          if (1 == this._bridgeStage.type) {
            $10GuardingDataProxy.guardingDataProxy.attackNum += this._curShowNum, this._curShowNum > 0 ? o = "攻击+" + this._curShowNum : this._curShowNum < 0 && (o = "攻击-" + Math.abs(this._curShowNum));
          } else if (this._curShowNum < 0) {
            $10GuardingDataProxy.guardingDataProxy.attackNum = $10GuardingDataProxy.guardingDataProxy.attackNum / Math.abs(this._curShowNum), o = "攻击÷" + Math.abs(this._curShowNum);
          } else {
            this._curShowNum > 0 && ($10GuardingDataProxy.guardingDataProxy.attackNum = $10GuardingDataProxy.guardingDataProxy.attackNum * this._curShowNum, o = "攻击x" + this._curShowNum);
          }
          $10GuardingDataProxy.guardingDataProxy.attackNum < 1 && ($10GuardingDataProxy.guardingDataProxy.attackNum = 1);
        } else if (2 == this._bridgeStage.buffType) {
          if (this._curShowNum > 0) {
            $10GuardingDataProxy.guardingDataProxy.playerNode.getComponent($10GTPlayerCtl.default).addPlay(this._curShowNum);
            o = "角色+" + this._curShowNum;
          } else if (this._curShowNum < 0) {
            $10GuardingDataProxy.guardingDataProxy.playerNode.getComponent($10GTPlayerCtl.default).removePlay(Math.abs(this._curShowNum)), o = "角色-" + Math.abs(this._curShowNum);
          }
        } else if (3 == this._bridgeStage.buffType) {
          if (1 == this._bridgeStage.type) {
            this._curShowNum > 0 ? $10GuardingDataProxy.guardingDataProxy.attackSpeed = $10GuardingDataProxy.guardingDataProxy.attackSpeed / this._curShowNum : $10GuardingDataProxy.guardingDataProxy.attackSpeed = $10GuardingDataProxy.guardingDataProxy.attackSpeed * Math.abs(this._curShowNum), this._curShowNum > 0 ? o = "攻速+" + this._curShowNum : this._curShowNum < 0 && (o = "攻速-" + Math.abs(this._curShowNum));
          } else if (this._curShowNum < 0) {
            $10GuardingDataProxy.guardingDataProxy.attackSpeed = $10GuardingDataProxy.guardingDataProxy.attackSpeed * Math.abs(this._curShowNum), o = "攻速÷" + Math.abs(this._curShowNum);
          } else {
            this._curShowNum > 0 && ($10GuardingDataProxy.guardingDataProxy.attackSpeed = $10GuardingDataProxy.guardingDataProxy.attackSpeed / Math.abs(this._curShowNum), o = "攻速x" + this._curShowNum);
          }
          $10GuardingDataProxy.guardingDataProxy.attackSpeed < $10GuardingDataProxy.guardingDataProxy.attackSpeedMax && ($10GuardingDataProxy.guardingDataProxy.attackSpeed = $10GuardingDataProxy.guardingDataProxy.attackSpeedMax);
        } else if (4 == this._bridgeStage.buffType) {
          if (1 == this._bridgeStage.type) {
            $10GuardingDataProxy.guardingDataProxy.attackCrit += this._curShowNum, this._curShowNum > 0 ? o = "暴击+" + this._curShowNum : this._curShowNum < 0 && (o = "暴击-" + Math.abs(this._curShowNum));
          } else if (this._curShowNum < 0) {
            $10GuardingDataProxy.guardingDataProxy.attackCrit = $10GuardingDataProxy.guardingDataProxy.attackCrit / Math.abs(this._curShowNum), o = "暴击÷" + Math.abs(this._curShowNum);
          } else {
            this._curShowNum > 0 && ($10GuardingDataProxy.guardingDataProxy.attackCrit = $10GuardingDataProxy.guardingDataProxy.attackCrit * this._curShowNum, o = "暴击x" + this._curShowNum);
          }
        }
        "" != o && $10GameUIManager.gameUIMgr.showTips(o);
        $10GTGameMgr.default.instance.setEffectEquipUpgrade();
      }
      cc.tween(this.node).to(.1, {
        scale: 1.2
      }).to(.1, {
        opacity: 0
      }).call(function () {
        var t = $10GuardingDataProxy.guardingDataProxy.skillBoxs.indexOf(e.node);
        -1 != t && $10GuardingDataProxy.guardingDataProxy.skillBoxs.splice(t, 1);
        e.node.destroy();
        e.node.removeFromParent();
      }).start();
    }
  };
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "mColliderNode", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "redNode", undefined);
  cc__decorate([ccp_property(cc.Node)], _ctor.prototype, "blueNode", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "nameLabel", undefined);
  cc__decorate([ccp_property(cc.Label)], _ctor.prototype, "numLabel", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_GTBuff;