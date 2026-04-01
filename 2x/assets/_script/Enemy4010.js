var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10MathUtil = require("MathUtil");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var $10EnemyPathIce = require("EnemyPathIce");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_Enemy4010 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mEnemyPathIcePb = null;
    e._pathNodes = [];
    e._icePathIdx = 0;
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
      var o = e.animation ? e.animation.name : "";
      if (o.indexOf("atk") >= 0) {
        t.playMove();
      } else if ("die" == o) {
        t.node.destroy(), t.node.removeFromParent();
      }
    });
    this.mAnimSp.setEventListener(function (e, o) {
      if ("atk" == o.data.name) {
        $10AudioManager.AudioManager.instance.playEffectPath("sounds/enemyAtk", $10HomeEnum.Bundles.RES);
        $10BattleDataProxy.battleDataProxy.updateHouseHp({
          isCirt: false,
          num: -t._atkNum
        });
      }
    });
    this._pathNodes = $10BattleDataProxy.battleDataProxy.pathPointView.children;
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
      this._atkSpd = this.monsterCfg.atkSpeed;
      this._amimState = $10GameEnum.RoleState.Attack;
      this._canAtk = false;
      this._isStartAtk = true;
      this.mAnimSp.setAnimation(0, "atk", false);
    }
  };
  _ctor.prototype.update = function (e) {
    if ($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING && this._amimState != $10GameEnum.RoleState.Dead && this._isAnimReady && (t.prototype.update.call(this, e), this._amimState != $10GameEnum.RoleState.Attack)) {
      if (this._target && this._target.isValid) {
        var o = 3;
        $10BattleDataProxy.battleDataProxy.isEndless && (o = 2);
        if (this._enemyPathIdx == o && $10MathUtil.MathUtil.distance(this._target.position, this.node.position) <= this.monsterCfg.range && this._canAtk) {
          this._target = null;
          this.playAtk();
        }
      } else {
        this._canAtk && this.playAtk();
      }
    }
  };
  _ctor.prototype.move = function (e) {
    t.prototype.move.call(this, e);
    var o = this._pathNodes[this._icePathIdx];
    if (o && o.isValid && (this._icePathIdx >= 5 && this._icePathIdx <= 13 ? Math.abs(o.y - this.node.y) : Math.abs(o.x - this.node.x)) <= this.getMoveSpd(this._isSpdAdd, e)) {
      var i = this._icePathIdx;
      this._icePathIdx++;
      if (this._beFireNum > 0) {
        return;
      }
      var n = o.PathIce;
      if (n && n.isValid) {
        return;
      }
      var a = cc.instantiate(this.mEnemyPathIcePb);
      $10BattleDataProxy.battleDataProxy.iceView.addChild(a);
      a.position = o.position;
      o.PathIce = a;
      $10BattleDataProxy.battleDataProxy.enemyPathIce.push(a);
      a.getComponent($10EnemyPathIce.default).initEnemyPathIce(o, i);
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mEnemyPathIcePb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10EnemyBase.default);
exports.default = def_Enemy4010;