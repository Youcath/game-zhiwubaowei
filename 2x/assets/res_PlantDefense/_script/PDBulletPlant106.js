var o;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
var ccp_property = cc__decorator.property;
var def_PDBulletPlant106 = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mSpine = null;
    e.mBulletBoomPb = null;
    e._boomTime = 0;
    e._isMove = false;
    e._atkNum = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initFixedPlantBullet = function (t, e) {
    var n = this;
    if (!e || !e.isValid) {
      console.log("目标丢失，这次不算");
      this.node.destroy();
      return void this.node.removeFromParent();
    }
    battleDataProxy.nutWalNodes.push(this.node);
    this._atkNum = t;
    this._boomTime = 1;
    this.node.position = this.getCreatePosition(e);
    this.mSpine.setCompleteListener(function (t) {
      if ("atk" == (t.animation ? t.animation.name : "")) {
        n._isMove = true;
        n.mSpine.setAnimation(0, "stand", true);
      }
    });
    this.mSpine.setAnimation(0, "atk", false);
    this._isMove = false;
    this.node.zIndex = -this.node.y;
  };
  _ctor.prototype.getCreatePosition = function (t) {
    if (t.x <= this.node.width / 2 - 275) {
      var e = t.y - 100;
      e = e > 0 ? e > 620 ? 620 : e : e < -438 ? -438 : e;
      return cc.v3(-286, e);
    }
    if (t.y > 0) {
      return cc.v3(t.x - 100, 620);
    } else {
      return cc.v3(t.x + 100, -438);
    }
  };
  _ctor.prototype.update = function (t) {
    if (battleDataProxy.gameState == GameState.PLAYING || battleDataProxy.gameState == GameState.READY) {
      this.mSpine.paused = false;
      if (this._isMove) {
        this._boomTime -= t, this._boomTime <= 0 && (this._isMove = false, this.addBulletBoom());
      }
    } else {
      this.mSpine.paused = true;
    }
  };
  _ctor.prototype.addBulletBoom = function () {
    var t = this;
    AudioManager.instance.playEffectPath("sounds/plant12", Bundles.RES);
    var e = cc.instantiate(this.mBulletBoomPb);
    battleDataProxy.bulletView.addChild(e, 1e3);
    e.position = this.node.position.addSelf(cc.v3(0, this.node.height / 2));
    e.scale = 2;
    e.getComponent(BulletBoom).initBulletBoom(function () {
      t.startBoom();
    });
  };
  _ctor.prototype.startBoom = function () {
    var t = battleDataProxy.enemyNodes.slice();
    for (var e = 0; e < t.length; ++e) {
      var n = t[e];
      if (n && n.isValid && MathUtil.distance(n.position, this.node.position) <= 200) {
        var o = n.getComponent(EnemyBase).monsterCfg;
        var i = battleDataProxy.getFixedPlantBulletHarm(this._atkNum, o.type, 1);
        n.getComponent(EnemyBase).beAttack(i, 106, true);
      }
    }
    var a = battleDataProxy.nutWalNodes.indexOf(this.node);
    a >= 0 && battleDataProxy.nutWalNodes.splice(a, 1);
    this.node.destroy();
    this.node.removeFromParent();
  };
  cc__decorate([ccp_property(sp.Skeleton)], _ctor.prototype, "mSpine", undefined);
  cc__decorate([ccp_property(cc.Prefab)], _ctor.prototype, "mBulletBoomPb", undefined);
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_PDBulletPlant106;