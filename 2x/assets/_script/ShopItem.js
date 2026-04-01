var i;
var cc__extends = __extends;
var cc__decorate = __decorate;
var cc__read = __read;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10AudioManager = require("AudioManager");
var $10EventManager = require("EventManager");
var $10MathUtil = require("MathUtil");
var $10ResUtil = require("ResUtil");
var $10AdsMgr = require("AdsMgr");
var $10GameEnum = require("GameEnum");
var $10HomeEnum = require("HomeEnum");
var $10DataManager = require("DataManager");
var $10UserDataProxy = require("UserDataProxy");
var $10GameUIManager = require("GameUIManager");
var cc__decorator = cc._decorator;
var ccp_ccclass = cc__decorator.ccclass;
cc__decorator.property;
var def_ShopItem = function (t) {
  function _ctor() {
    var e = null !== t && t.apply(this, arguments) || this;
    e._itemData = null;
    e._awardData = null;
    e._priceTotal = 0;
    return e;
  }
  cc__extends(_ctor, t);
  _ctor.prototype.init = function (t) {
    this._itemData = t;
    var e = this._itemData.reward.split("_");
    var o = $10DataManager.DataManager.instance.eData.dataitem[e[0]];
    this._awardData = {};
    if (o.type == $10GameEnum.ItemType.BOX) {
      var i = $10DataManager.DataManager.instance.eData.databox[o.id];
      var n = $10UserDataProxy.userDataProxy.userData.dailyData[this._itemData.id];
      if (i.type == $10GameEnum.BoxType.FIXED) {
        var a = i.reward.split("_");
        if (!n) {
          n = {
            id: parseInt(a[0], 10),
            num: parseInt(a[1], 10),
            buyNum: 0,
            totalNum: this._itemData.buyNum,
            freeNum: this._itemData.freeNum
          };
          $10UserDataProxy.userDataProxy.userData.dailyData[this._itemData.id] = n;
        }
        this._awardData.cfg = $10DataManager.DataManager.instance.eData.dataitem[a[0]];
      } else if (i.type == $10GameEnum.BoxType.RADOM) {
        n || (n = this.getRandomItemData(i));
        this._awardData.cfg = $10DataManager.DataManager.instance.eData.dataitem[n.id];
      }
      this._awardData.radomData = n;
    }
    if (1 == this._itemData.showType) {
      this._awardData.cfg = o;
      this.refreshItem(o);
    }
    this.refreshItem(this._awardData.cfg);
  };
  _ctor.prototype.refreshItem = function (t) {
    if (t) {
      this._itemData.buyNum > 1 && 0 == this._awardData.radomData.freeNum && (this.node.getChildByName("proLabel").getComponent(cc.Label).string = this._awardData.radomData.buyNum + "/" + this._itemData.buyNum);
      var e = this.node.getChildByName("qulityBg");
      var o = this.node.getChildByName("numBox");
      if (101 != t.id && 102 != t.id) {
        $10ResUtil.ResUtil.loadAsset({
          path: "textures/public/item_bg" + t.qulity,
          type: cc.SpriteFrame,
          bundleName: $10HomeEnum.Bundles.GAME
        }).then(function (t) {
          e.getComponent(cc.Sprite).spriteFrame = t;
        }).catch(function (t) {
          console.log("error:", t);
        });
        o.active = false;
        this.node.getChildByName("numLabel").getComponent(cc.Label).string = "x" + this._awardData.radomData.num;
      } else {
        e.getComponent(cc.Sprite).spriteFrame = null;
        this.node.getChildByName("numLabel").active = false;
        o.getChildByName("numLabel").getComponent(cc.Label).string = "x" + this._awardData.radomData.num;
        o.active = true;
        102 == t.id && (o.active = false);
      }
      var i = e.getChildByName("icon").getComponent(cc.Sprite);
      i.node.scale = 1.2;
      e.scale = .7;
      $10ResUtil.ResUtil.loadAsset({
        path: "textures/item/" + t.icon,
        type: cc.SpriteFrame,
        bundleName: $10HomeEnum.Bundles.GAME
      }).then(function (t) {
        i.spriteFrame = t;
      }).catch(function (t) {
        console.log("error:", t);
      });
      this.node.getChildByName("nameLabel").getComponent(cc.Label).string = t.name;
      if (this._awardData.radomData.freeNum > 0) {
        this.node.getChildByName("mfBtn").active = true;
        this.node.getChildByName("videoBtn").active = this.node.getChildByName("buyBtn").active = false;
      } else {
        101 == t.id && (this.node.getChildByName("proLabel").getComponent(cc.Label).string = this._itemData.buyNum - this._awardData.radomData.buyNum + "/" + this._itemData.buyNum);
        this.node.getChildByName("mfBtn").active = false;
        var n = this.node.getChildByName("buyBtn");
        if (this._itemData.buyType == $10GameEnum.BuyType.GEMBUY || this._itemData.buyType == $10GameEnum.BuyType.GLODBUY) {
          var a = n.getChildByName("layer");
          var r = a.getChildByName("icon").getComponent(cc.Sprite);
          if (this._itemData.buyType == $10GameEnum.BuyType.GEMBUY) {
            $10ResUtil.ResUtil.loadAsset({
              path: "textures/item/icon_2",
              type: cc.SpriteFrame,
              bundleName: $10HomeEnum.Bundles.GAME
            }).then(function (t) {
              r.spriteFrame = t;
            }).catch(function (t) {
              console.log("error:", t);
            });
          } else {
            $10ResUtil.ResUtil.loadAsset({
              path: "textures/item/icon_1",
              type: cc.SpriteFrame,
              bundleName: $10HomeEnum.Bundles.GAME
            }).then(function (t) {
              r.spriteFrame = t;
            }).catch(function (t) {
              console.log("error:", t);
            });
          }
          this._priceTotal = Math.round(this.getItemPrice() * this._awardData.radomData.num);
          a.getChildByName("label").getComponent(cc.Label).string = $10MathUtil.MathUtil.formatValue(this._priceTotal);
          if (this._itemData.buyType == $10GameEnum.BuyType.GLODBUY) {
            if ($10UserDataProxy.userDataProxy.userData.gold >= this._priceTotal) {
              a.getChildByName("label").color = cc.Color.WHITE;
            } else {
              a.getChildByName("label").color = cc.Color.RED;
            }
          } else if (this._itemData.buyType == $10GameEnum.BuyType.GEMBUY) {
            if ($10UserDataProxy.userDataProxy.userData.diamond >= this._priceTotal) {
              a.getChildByName("label").color = cc.Color.WHITE;
            } else {
              a.getChildByName("label").color = cc.Color.RED;
            }
          }
        } else {
          n.active = false;
        }
        if (this._awardData.radomData.buyNum < this._awardData.radomData.totalNum) {
          this.changeSpriteGray("2d-sprite");
        } else {
          this.changeSpriteGray("2d-gray-sprite");
        }
      }
    }
  };
  _ctor.prototype.changeSpriteGray = function (t) {
    this.node.getChildByName("videoBtn").active = "2d-sprite" == t && this._itemData.buyType == $10GameEnum.BuyType.VIDEOBUY;
    this.node.getChildByName("buyBtn").active = "2d-sprite" == t && this._itemData.buyType != $10GameEnum.BuyType.VIDEOBUY;
    this.node.getChildByName("tipsLabel").active = !("2d-sprite" == t);
    this.node.children.forEach(function (e) {
      var o = e.getComponent(cc.Sprite);
      o && o.setMaterial(0, cc.Material.getBuiltinMaterial(t));
    });
    cc.find("qulityBg/icon", this.node).getComponent(cc.Sprite).setMaterial(0, cc.Material.getBuiltinMaterial(t));
    this.node.getChildByName("nameLabel").color = "2d-sprite" == t ? cc.color(255, 240, 181) : cc.color(254, 254, 254);
  };
  _ctor.prototype.getItemPrice = function () {
    var t = 0;
    if (6 == this._awardData.cfg.id) {
      t = this._itemData.buyType == $10GameEnum.BuyType.GLODBUY ? Number($10DataManager.DataManager.instance.eData.datapara[11].num) : Number($10DataManager.DataManager.instance.eData.datapara[12].num);
    } else if (this._itemData.buyType == $10GameEnum.BuyType.GLODBUY) {
      if (9 == this._awardData.cfg.id) {
        t = Number($10DataManager.DataManager.instance.eData.datapara[218].num);
      } else if (10 == this._awardData.cfg.id) {
        t = Number($10DataManager.DataManager.instance.eData.datapara[220].num);
      } else if (2 == this._awardData.cfg.qulity) {
        t = Number($10DataManager.DataManager.instance.eData.datapara[2].num);
      } else if (3 == this._awardData.cfg.qulity) {
        t = Number($10DataManager.DataManager.instance.eData.datapara[4].num);
      } else {
        4 == this._awardData.cfg.qulity && (t = Number($10DataManager.DataManager.instance.eData.datapara[7].num));
      }
    } else if (9 == this._awardData.cfg.id) {
      t = Number($10DataManager.DataManager.instance.eData.datapara[219].num);
    } else if (10 == this._awardData.cfg.id) {
      t = Number($10DataManager.DataManager.instance.eData.datapara[221].num);
    } else if (2 == this._awardData.cfg.qulity) {
      t = Number($10DataManager.DataManager.instance.eData.datapara[3].num);
    } else if (3 == this._awardData.cfg.qulity) {
      t = Number($10DataManager.DataManager.instance.eData.datapara[5].num);
    } else {
      4 == this._awardData.cfg.qulity && (t = Number($10DataManager.DataManager.instance.eData.datapara[8].num));
    }
    return t;
  };
  _ctor.prototype.getRandomItemData = function (t) {
    var e = t.reward;
    var o = t.weight;
    var i = t.num;
    var n = e.split("|");
    var a = o.split("|");
    var s = [];
    for (var c = 0; c < n.length; c++) {
      var l = cc__read(n[c].split("_"), 2);
      var u = l[0];
      var p = l[1];
      u && p && s.push({
        id: parseInt(u, 10),
        num: parseInt(p, 10),
        weight: parseInt(a[c], 10)
      });
    }
    var h = $10UserDataProxy.userDataProxy.getWeightAwards(s, i);
    if (h.length > 0) {
      var d = h[0];
      var m = {
        id: d.id,
        num: d.num,
        buyNum: 0,
        totalNum: this._itemData.buyNum,
        freeNum: this._itemData.freeNum
      };
      $10UserDataProxy.userDataProxy.userData.dailyData[this._itemData.id] = m;
      $10UserDataProxy.userDataProxy.saveData();
      return m;
    }
    return null;
  };
  _ctor.prototype.onOpenPropDetailPopup = function () {};
  _ctor.prototype.getShopAward = function () {
    var t = $10UserDataProxy.userDataProxy.userData.dailyData[this._itemData.id];
    if (this._awardData.radomData.freeNum > 0) {
      t.freeNum -= 1;
    } else {
      t.buyNum += 1;
    }
    var e = [{
      id: t.id,
      num: t.num
    }];
    $10UserDataProxy.userDataProxy.saveData();
    this.init(this._itemData);
    $10GameUIManager.gameUIMgr.showCongratsGettingPopup({
      list: e,
      type: 1
    });
  };
  _ctor.prototype.onMfClick = function () {
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/click", $10HomeEnum.Bundles.RES);
    if (this._awardData.radomData.freeNum > 0) {
      this.getShopAward();
      $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.UPDATE_HOME_REDDOT, [$10HomeEnum.HOME_REDDOT.SHOPRED]);
    }
  };
  _ctor.prototype.onBuyClick = function () {
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/click", $10HomeEnum.Bundles.RES);
    if (this._itemData.buyType == $10GameEnum.BuyType.GLODBUY) {
      if ($10UserDataProxy.userDataProxy.userData.gold >= this._priceTotal) {
        $10UserDataProxy.userDataProxy.changeGold(-1 * this._priceTotal);
        this.getShopAward();
      } else {
        $10GameUIManager.gameUIMgr.showTips("金币不够！");
      }
    } else if (this._itemData.buyType == $10GameEnum.BuyType.GEMBUY) {
      if ($10UserDataProxy.userDataProxy.userData.diamond >= this._priceTotal) {
        $10UserDataProxy.userDataProxy.changeDiamond(-1 * this._priceTotal), this.getShopAward();
      } else {
        $10GameUIManager.gameUIMgr.showTips("钻石不够！"), $10EventManager.EventManager.instance.emit($10HomeEnum.EHomeEvent.SHOW_VIDEO_DIAMOMND_POPUP);
      }
    }
  };
  _ctor.prototype.onVideoClick = function () {
    var t = this;
    $10AudioManager.AudioManager.instance.playEffectPath("sounds/click", $10HomeEnum.Bundles.RES);
    $10AdsMgr.default.showVideoAds({
      id: 1,
      eventId: "shop_" + (1 == this._itemData.id ? "diamondBox" : "videoBox") + "_ad",
      success: function () {
        t.getShopAward();
      },
      fail: function () {},
      error: function (t) {
        cc.log(t);
        $10GameUIManager.gameUIMgr.showTips("暂无广告!");
      }
    }, true);
  };
  return cc__decorate([ccp_ccclass], _ctor);
}(cc.Component);
exports.default = def_ShopItem;