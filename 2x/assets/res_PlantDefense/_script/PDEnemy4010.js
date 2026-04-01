var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10PlantDefenseDataProxy = require("PlantDefenseDataProxy");
var $10PDEnemyBase = require("PDEnemyBase");
var $10PDEnemyPathIce = require("PDEnemyPathIce");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDEnemy4010 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mEnemyPathIcePb = null;
    e._pathNodes = [];
    e._icePathIdx = 0;
    e._lastIceNode = null;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.playMove = function (t) {
    undefined === t && (t = 5);
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._amimState = $10GameEnum.RoleState.Move;
      this.mAnimSp.setAnimation(0, "move", true);
      this.mAnimSp.timeScale = t / 5;
    }
  };
  _ctor.prototype.onLoad = function () {
    var t = this;
    this.mIsSpAni && this.mAnimSp.setCompleteListener(function (e) {
      var n = e.animation ? e.animation.name : "";
      if (n.indexOf("atk") >= 0) {
        t.openFire();
        t.playMove();
      } else if ("die" == n && t.node && t.node.isValid) {
        t.node.destroy(), t.node.removeFromParent();
      }
    });
    this.mAnimSp.setEventListener(function (t, e) {
      "atk" == e.data.name && $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyAtk", $10HomeEnum.Bundles.RES);
    });
  };
  _ctor.prototype.loadAnimation = function () {
    this._isAnimReady = true;
    this.playMove(10);
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemy4010", $10HomeEnum.Bundles.RES);
  };
  _ctor.prototype.getIsCanChoose = function () {
    return true;
  };
  _ctor.prototype.moveToHouse = function () {
    this.playAtk();
  };
  _ctor.prototype.playAtk = function () {
    if (this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady) {
      this._atkSpd = this.monsterCfg.atkspeed;
      this._amimState = $10GameEnum.RoleState.Attack;
      this._canAtk = false;
      this._isStartAtk = true;
      this.mAnimSp.setAnimation(0, "atk", false);
    }
  };
  _ctor.prototype.update = function (e) {
    if ($10PlantDefenseDataProxy.plantDefenseDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady && (t.prototype.update.call(this, e), this._amimState != $10GameEnum.RoleState.Attack)) {
      if (this._target && this._target.isValid) {
        if (3 == this._enemyPathIdx && $10MathUtil.MathUtil.distance(this._target.position, this.node.position) <= this.monsterCfg.range && this._canAtk) {
          this._target = null, this.playAtk();
        }
      } else {
        this._canAtk && this.playAtk();
      }
    }
  };
  _ctor.prototype.move = function (e) {
    t.prototype.move.call(this, e);
    if (!(this.node.y > 500)) {
      var n = false;
      this._lastIceNode && this._lastIceNode.isValid || (this._lastIceNode = null);
      this._lastIceNode || (n = true);
      n || Math.abs(this._lastIceNode.y - this.node.y) > 120 && (n = true);
      if (n) {
        var o = this._icePathIdx;
        this._icePathIdx++;
        if (this._beFireNum > 0) {
          return;
        }
        var i = cc.instantiate(this.mEnemyPathIcePb);
        $10PlantDefenseDataProxy.plantDefenseDataProxy.iceView.addChild(i);
        i.setPosition(this.node.position);
        this._lastIceNode = i;
        $10PlantDefenseDataProxy.plantDefenseDataProxy.enemyPathIce.push(i);
        i.getComponent($10PDEnemyPathIce.default).initEnemyPathIce(null, o, this.pathIdx);
      }
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mEnemyPathIcePb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDEnemyBase.default);
exports.default = def_PDEnemy4010;