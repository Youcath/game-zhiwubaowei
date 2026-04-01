var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10EnemyBase = require("EnemyBase");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_EnemyNormal = function (t) {
  function _ctor() {
    return null !== t && t.apply(this, arguments) || this;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.initEnemy = function (e) {
    t.prototype.initEnemy.call(this, e);
    if (3 == this.monsterCfg.type) {
      this.node.height = this.getEliteHeight();
      this.node.getChildByName("collision").height = this.node.height;
    }
  };
  _ctor.prototype.getEliteHeight = function () {
    if (3001 == this.monsterCfg.id) {
      return 105;
    } else {
      if (3002 == this.monsterCfg.id) {
        return 89;
      } else {
        if (3003 == this.monsterCfg.id) {
          return 83;
        } else {
          if (3004 == this.monsterCfg.id) {
            return 80;
          } else {
            if (3005 == this.monsterCfg.id) {
              return 121;
            } else {
              if (3006 == this.monsterCfg.id) {
                return 96;
              } else {
                if (3007 == this.monsterCfg.id) {
                  return 118;
                } else {
                  if (3008 == this.monsterCfg.id) {
                    return 91;
                  } else {
                    if (3009 == this.monsterCfg.id) {
                      return 97;
                    } else {
                      return 100;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  return cc__decorate([ccp_ccclass], _ctor);
}($10EnemyBase.default);
exports.default = def_EnemyNormal;