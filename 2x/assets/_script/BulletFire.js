var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10GameEnum = require("GameEnum");
var $10BattleDataProxy = require("BattleDataProxy");
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_BulletFire = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._pathIdx = 0;
    e._leftIdxs = [2, 4, 6, 8];
    e._rightIdxs = [1, 3, 5, 7];
    e._showIdx = 0;
    e._frameTime = 0;
    e._continueTime = 0;
    e._isContinue = false;
    e._atkNum = 0;
    e._atkRate = 0;
    e._atkEnemyNodes = [];
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBulletFire = function (t, e, o, i) {
    var n = this;
    this._pathIdx = t;
    this._continueTime = o;
    this._atkNum = e;
    this._atkRate = i;
    if (o > 0) {
      this._isContinue = true;
      this.unschedule(this.continueHurt);
      this.schedule(this.continueHurt, 1);
    }
    var a = this.node.children;
    if (1 == this._pathIdx) {
      this.node.angle = 90;
      for (var r = 0; r < a.length; ++r) {
        a[r].angle = -90;
      }
    }
    this._showIdx = 0;
    a[0].getComponent(sp.Skeleton).setAnimation(0, "fire", true);
    a[a.length - 1].getComponent(sp.Skeleton).setCompleteListener(function (t) {
      "fire" == (t.animation ? t.animation.name : "") && (n._isContinue || (n.setEnemyBaseIsBeFire(), n.node.destroy(), n.node.removeFromParent()));
    });
  };
  _ctor.prototype.continueHurt = function () {
    if (!($10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.PLAYING && $10BattleDataProxy.battleDataProxy.gameState != $10GameEnum.GameState.READY)) {
      this._continueTime--;
      this.atkEnemy();
      if (this._continueTime <= 1) {
        this.setEnemyBaseIsBeFire(), this.unschedule(this.continueHurt), this.node.destroy(), this.node.removeFromParent();
      }
    }
  };
  _ctor.prototype.setEnemyBaseIsBeFire = function () {
    for (var t = 0; t < this._atkEnemyNodes.length; ++t) {
      var e = this._atkEnemyNodes[t];
      e && e.isValid && (e.getComponent($10EnemyBase.default).isBeFire = false);
    }
  };
  _ctor.prototype.update = function (t) {
    if (($10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.PLAYING || $10BattleDataProxy.battleDataProxy.gameState == $10GameEnum.GameState.READY) && (this._frameTime += t, this._frameTime >= .1)) {
      this._frameTime = 0;
      var e = this._leftIdxs[this._showIdx];
      var o = this._rightIdxs[this._showIdx];
      var i = this.node.getChildByName("fire" + e);
      var n = this.node.getChildByName("fire" + o);
      this._showIdx++;
      if (i) {
        if (this._showIdx >= this._leftIdxs.length) {
          i.getComponent(sp.Skeleton).setAnimation(0, "fire", this._isContinue);
        } else {
          i.getComponent(sp.Skeleton).setAnimation(0, "fire", true);
        }
      }
      if (n) {
        if (this._showIdx >= this._rightIdxs.length) {
          n.getComponent(sp.Skeleton).setAnimation(0, "fire", this._isContinue);
        } else {
          n.getComponent(sp.Skeleton).setAnimation(0, "fire", true);
        }
        1 == this._showIdx && this.atkEnemy(true);
      }
    }
  };
  _ctor.prototype.atkEnemy = function (t) {
    undefined === t && (t = false);
    var e = $10BattleDataProxy.battleDataProxy.enemyNodes.slice();
    for (var o = 0; o < e.length; ++o) {
      var i = e[o];
      if (i && i.isValid) {
        var n = Math.abs(this.node.x - i.x);
        var a = Math.abs(this.node.y - i.y);
        var r = false;
        if (1 == this._pathIdx) {
          a <= this.node.width / 2 && n <= this.node.height / 2 && (r = true);
        } else {
          n <= this.node.width / 2 && a <= this.node.height / 2 && (r = true);
        }
        if (r) {
          var l = i.getComponent($10EnemyBase.default).monsterCfg;
          var u = $10BattleDataProxy.battleDataProxy.getFixedPlantBulletHarm(this._atkNum, l.atkType, 1);
          this._isContinue && !t && (u.num = Math.ceil(u.num * this._atkRate));
          i.getComponent($10EnemyBase.default).beAttack(u, 102, true);
          if (this._atkEnemyNodes.indexOf(i) < 0) {
            i.getComponent($10EnemyBase.default).isBeFire = true;
            this._atkEnemyNodes.push(i);
          }
        }
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_BulletFire;