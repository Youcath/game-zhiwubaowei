var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10PDBulletBase = require("PDBulletBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDSuperBulletPlant2 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mBulletGrapePb = null;
    e._bombScope = 100;
    e._isCanMove = false;
    e._bombNum = 1;
    e._atkNum = 0;
    e._bulletNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initBullet = function () {};
  _ctor.prototype.getCreatePos = function (t) {
    if (t.x <= this.node.width / 2 - 275) {
      var e = t.y;
      e = e > 0 ? e > 630 ? 630 : e : e < -390 ? -390 : e;
      return cc.v3(-285, e);
    }
    if (t.y > 0) {
      return cc.v3(t.x, 630);
    } else {
      return cc.v3(t.x, -390);
    }
  };
  _ctor.prototype.initFixedPlantBullet = function (t, e, n) {
    var o = this;
    if (!e || !e.isValid) {
      console.log("目标丢失，这次不算");
      this.node.destroy();
      return void this.node.removeFromParent();
    }
    this._isCanMove = true;
    this._isCheckCollision = false;
    this._atkNum = t;
    this._atkTarget = e;
    this._bulletNum = n;
    this._atkPos = this.getCreatePos(e);
    this._moveNormalize = this.node.position.clone().sub(this._atkPos.clone()).normalize();
    this.mSpAni.setCompleteListener(function (t) {
      var e = t.animation ? t.animation.name : "";
      if (!("bomb1" != e && "bomb2" != e)) {
        o._bombNum--;
        if (o._bombNum > 0) {
          o.playBomb2();
        } else {
          o.node.destroy(), o.node.removeFromParent();
        }
      }
    });
    this.mSpAni.setEventListener(function (t, e) {
      e.data.name;
      var n = battleDataProxy.enemyNodes.slice();
      AudioManager.instance.playEffectPath("sounds/plant12", Bundles.RES);
      EventManager.instance.emit(EGameEvent.SCREEN_SHAKE);
      for (var i = 0; i < n.length; ++i) {
        var a = n[i];
        if (a && a.isValid && MathUtil.distance(a.position, o.node.position) <= o._bombScope) {
          var r = a.getComponent(EnemyBase).monsterCfg;
          var s = battleDataProxy.getFixedPlantBulletHarm(o._atkNum, r.type, 1);
          a.getComponent(EnemyBase).beAttack(s, 104, true);
        }
      }
      for (i = 0; i < o._bulletNum; ++i) {
        var l = cc.instantiate(o.mBulletGrapePb);
        battleDataProxy.bulletView.addChild(l);
        l.position = o.node.position;
        l.getComponent(BulletGrape).initBullet(o._atkNum, i + 1);
      }
    });
    this.startMove();
  };
  _ctor.prototype.playBomb2 = function () {
    this.mSpAni.paused = false;
    this.mSpAni.setAnimation(0, "bomb2", false);
  };
  _ctor.prototype.moveArrive = function () {
    this._isCanMove = false;
    this.node.zIndex = -this.node.y;
    this.mSpAni.paused = false;
    this.mSpAni.setAnimation(0, "bomb1", false);
  };
  _ctor.prototype.update = function () {
    if (this._isCanMove) {
      if (battleDataProxy.gameState == GameState.PLAYING || battleDataProxy.gameState == GameState.READY) {
        if (this._isPauseGame) {
          this.mSpAni.paused = false, this._isPauseGame = false, this.node.resumeAllActions();
        }
      } else if (!this._isPauseGame) {
        this._isPauseGame = true, this.mSpAni.paused = true, this.node.pauseAllActions();
      }
    }
  };
  _ctor.prototype.startMove = function () {
    var t = this;
    var e = MathUtil.distance(this.node.position, this._atkPos.clone()) / (60 * this._moveSpd);
    var n = this._atkPos.clone();
    this.bezierTo(cc.v2(this.node.position), this.getC2(cc.v2(this.node.position), cc.v2(n)), cc.v2(n), e, true, function () {
      t.moveArrive();
    });
  };
  _ctor.prototype.bezierTo = function (t, e, n, o, i, a, r, s) {
    undefined === r && (r = "");
    undefined === s && (s = null);
    cc.Tween.stopAllByTarget(this.node);
    MathUtil.bezierTo(this.node, o, t, e, n, function (t, e) {
      s && s(t, e);
    }, r).call(function () {
      a && a();
    }).start();
  };
  _ctor.prototype.getC2 = function (t, e) {
    var n = Math.abs(t.x - e.x);
    var o = t.x > e.x ? t.x - n / 2 : t.x + n / 2;
    var i = 250 * Math.random() + 250;
    if (t.y > e.y) {
      return cc.v2(o, t.y + i);
    } else {
      return cc.v2(o, e.y + i);
    }
  };
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletGrapePb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}($10PDBulletBase.default);
exports.default = def_PDSuperBulletPlant2;