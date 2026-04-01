/**
 * 每日商店格子（原 ShopItem.js）
 */

import { _decorator, Color, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { AudioManager } from './AudioManager';
import { EventManager } from './EventManager';
import { MathUtil } from './MathUtil';
import { ResUtil } from './ResUtil';
import AdsMgr, { AdsParam } from './AdsMgr';
import { BoxType, BuyType, ItemType } from './GameEnum';
import { Bundles, EHomeEvent, HOME_REDDOT } from './HomeEnum';
import { DataManager } from './DataManager';
import { userDataProxy } from './UserDataProxy';

type WeightPick = { id: number; num: number; weight: number };
import { gameUIMgr } from './GameUIManager';
import Util from './Util';

const { ccclass } = _decorator;

type DailyShopRow = {
  id: number;
  reward: string;
  buyNum: number;
  freeNum: number;
  buyType: BuyType;
  showType: number;
  videoRefresh?: number;
};

type DailyRandState = {
  id: number;
  num: number;
  buyNum: number;
  totalNum: number;
  freeNum: number;
};

type ItemCfg = { id: number; name: string; icon: string; qulity: number; type?: number };

type AwardWrap = {
  cfg?: ItemCfg;
  radomData?: DailyRandState;
};

function paraNum(id: number): number {
  return Number(DataManager.instance.eData.datapara[String(id)]?.num ?? 0);
}

@ccclass('ShopItem')
export default class ShopItem extends Component {
  private _itemData: DailyShopRow | null = null;
  private _awardData: AwardWrap = {};
  private _priceTotal = 0;

  private applyGraySubtree(root: Node, gray: boolean): void {
    const walk = (n: Node): void => {
      const s = n.getComponent(Sprite);
      if (s) {
        if (gray) Util.setSpriteGrayMaterial(s);
        else Util.setSpriteNormalMaterial(s);
      }
      for (const c of n.children) walk(c);
    };
    walk(root);
  }

  init(t: DailyShopRow): void {
    this._itemData = t;
    this._awardData = {};
    const parts = t.reward.split('_');
    const itemId = Number(parts[0]);
    const o = DataManager.instance.eData.dataitem[String(itemId)] as ItemCfg | undefined;
    if (!o) return;
    if (o.type === ItemType.BOX) {
      const box = DataManager.instance.eData.databox[String(o.id)] as {
        type: BoxType;
        reward: string;
        weight: string;
        num: number;
      };
      let n = userDataProxy.userData.dailyData[String(t.id)] as DailyRandState | null | undefined;
      if (box.type === BoxType.FIXED) {
        const a = box.reward.split('_');
        if (!n) {
          n = {
            id: parseInt(a[0]!, 10),
            num: parseInt(a[1]!, 10),
            buyNum: 0,
            totalNum: t.buyNum,
            freeNum: t.freeNum,
          };
          userDataProxy.userData.dailyData[String(t.id)] = n;
        }
        this._awardData.cfg = DataManager.instance.eData.dataitem[String(n.id)] as ItemCfg;
      } else if (box.type === BoxType.RADOM) {
        if (!n) n = this.getRandomItemData(box) ?? undefined;
        if (n) {
          this._awardData.cfg = DataManager.instance.eData.dataitem[String(n.id)] as ItemCfg;
        }
      }
      this._awardData.radomData = n ?? undefined;
    }
    if (t.showType === 1) {
      this._awardData.cfg = o;
    }
    if (!this._awardData.radomData && parts.length >= 2) {
      this._awardData.radomData = {
        id: Number(parts[0]),
        num: Number(parts[1]),
        buyNum: 0,
        totalNum: t.buyNum,
        freeNum: t.freeNum,
      };
    }
    if (this._awardData.cfg) this.refreshItem(this._awardData.cfg);
  }

  refreshItem(t: ItemCfg): void {
    let rd = this._awardData.radomData;
    if (!this._itemData) return;
    if (!rd && this._itemData.reward.split('_').length >= 2) {
      const p = this._itemData.reward.split('_');
      rd = {
        id: Number(p[0]),
        num: Number(p[1]),
        buyNum: 0,
        totalNum: this._itemData.buyNum,
        freeNum: this._itemData.freeNum,
      };
      this._awardData.radomData = rd;
    }
    if (!rd) return;
    if (this._itemData.buyNum > 1 && rd.freeNum === 0) {
      this.node.getChildByName('proLabel')!.getComponent(Label)!.string = `${rd.buyNum}/${this._itemData.buyNum}`;
    }
    const qBg = this.node.getChildByName('qulityBg')!;
    const numBox = this.node.getChildByName('numBox')!;
    if (t.id !== 101 && t.id !== 102) {
      void ResUtil.loadAsset({
        path: `textures/public/item_bg${t.qulity}`,
        type: SpriteFrame,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          qBg.getComponent(Sprite)!.spriteFrame = asset as SpriteFrame;
        })
        .catch((err) => console.log('error:', err));
      numBox.active = false;
      this.node.getChildByName('numLabel')!.getComponent(Label)!.string = `x${rd.num}`;
    } else {
      qBg.getComponent(Sprite)!.spriteFrame = null;
      this.node.getChildByName('numLabel')!.active = false;
      numBox.getChildByName('numLabel')!.getComponent(Label)!.string = `x${rd.num}`;
      numBox.active = true;
      if (t.id === 102) numBox.active = false;
    }
    const i = qBg.getChildByName('icon')!.getComponent(Sprite)!;
    i.node.setScale(1.2, 1.2, 1);
    qBg.setScale(0.7, 0.7, 1);
    void ResUtil.loadAsset({
      path: `textures/item/${t.icon}`,
      type: SpriteFrame,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        i.spriteFrame = asset as SpriteFrame;
      })
      .catch((err) => console.log('error:', err));
    this.node.getChildByName('nameLabel')!.getComponent(Label)!.string = t.name;
    if (rd.freeNum > 0) {
      this.node.getChildByName('mfBtn')!.active = true;
      this.node.getChildByName('videoBtn')!.active = false;
      this.node.getChildByName('buyBtn')!.active = false;
    } else {
      if (t.id === 101) {
        this.node.getChildByName('proLabel')!.getComponent(Label)!.string = `${
          this._itemData.buyNum - rd.buyNum
        }/${this._itemData.buyNum}`;
      }
      this.node.getChildByName('mfBtn')!.active = false;
      const n = this.node.getChildByName('buyBtn')!;
      if (this._itemData.buyType === BuyType.GEMBUY || this._itemData.buyType === BuyType.GLODBUY) {
        const a = n.getChildByName('layer')!;
        const r = a.getChildByName('icon')!.getComponent(Sprite)!;
        const iconPath =
          this._itemData.buyType === BuyType.GEMBUY ? 'textures/item/icon_2' : 'textures/item/icon_1';
        void ResUtil.loadAsset({ path: iconPath, type: SpriteFrame, bundleName: Bundles.GAME })
          .then((asset) => {
            r.spriteFrame = asset as SpriteFrame;
          })
          .catch((err) => console.log('error:', err));
        this._priceTotal = Math.round(this.getItemPrice() * rd.num);
        const lab = a.getChildByName('label')!.getComponent(Label)!;
        lab.string = MathUtil.formatValue(this._priceTotal);
        if (this._itemData.buyType === BuyType.GLODBUY) {
          lab.color = userDataProxy.userData.gold >= this._priceTotal ? Color.WHITE : Color.RED;
        } else if (this._itemData.buyType === BuyType.GEMBUY) {
          lab.color = userDataProxy.userData.diamond >= this._priceTotal ? Color.WHITE : Color.RED;
        }
      } else {
        n.active = false;
      }
      if (rd.buyNum < rd.totalNum) {
        this.changeSpriteGray(false);
      } else {
        this.changeSpriteGray(true);
      }
    }
  }

  /** gray=true 表示售罄置灰 */
  changeSpriteGray(gray: boolean): void {
    if (!this._itemData) return;
    this.node.getChildByName('videoBtn')!.active = !gray && this._itemData.buyType === BuyType.VIDEOBUY;
    this.node.getChildByName('buyBtn')!.active = !gray && this._itemData.buyType !== BuyType.VIDEOBUY;
    this.node.getChildByName('tipsLabel')!.active = gray;
    this.applyGraySubtree(this.node, gray);
    const iconSpr = this.node.getChildByName('qulityBg')?.getChildByName('icon')?.getComponent(Sprite);
    if (iconSpr) {
      if (gray) Util.setSpriteGrayMaterial(iconSpr);
      else Util.setSpriteNormalMaterial(iconSpr);
    }
    this.node.getChildByName('nameLabel')!.getComponent(Label)!.color = gray
      ? new Color(254, 254, 254)
      : new Color(255, 240, 181);
  }

  getItemPrice(): number {
    const cfg = this._awardData.cfg;
    if (!cfg) return 0;
    let t = 0;
    if (cfg.id === 6) {
      t =
        this._itemData!.buyType === BuyType.GLODBUY ? paraNum(11) : paraNum(12);
    } else if (this._itemData!.buyType === BuyType.GLODBUY) {
      if (cfg.id === 9) t = paraNum(218);
      else if (cfg.id === 10) t = paraNum(220);
      else if (cfg.qulity === 2) t = paraNum(2);
      else if (cfg.qulity === 3) t = paraNum(4);
      else if (cfg.qulity === 4) t = paraNum(7);
    } else {
      if (cfg.id === 9) t = paraNum(219);
      else if (cfg.id === 10) t = paraNum(221);
      else if (cfg.qulity === 2) t = paraNum(3);
      else if (cfg.qulity === 3) t = paraNum(5);
      else if (cfg.qulity === 4) t = paraNum(8);
    }
    return t;
  }

  getRandomItemData(box: { reward: string; weight: string; num: number }): DailyRandState | null {
    if (!this._itemData) return null;
    const n = box.reward.split('|');
    const a = box.weight.split('|');
    const s: WeightPick[] = [];
    for (let c = 0; c < n.length; c++) {
      const pair = n[c]!.split('_');
      const u = pair[0];
      const p = pair[1];
      if (u && p) {
        s.push({
          id: parseInt(u, 10),
          num: parseInt(p, 10),
          weight: parseInt(a[c]!, 10),
        });
      }
    }
    const h = userDataProxy.getWeightAwards(s, box.num);
    if (h.length > 0) {
      const d = h[0]!;
      const m: DailyRandState = {
        id: d.id,
        num: d.num,
        buyNum: 0,
        totalNum: this._itemData.buyNum,
        freeNum: this._itemData.freeNum,
      };
      userDataProxy.userData.dailyData[String(this._itemData.id)] = m;
      userDataProxy.saveData();
      return m;
    }
    return null;
  }

  getShopAward(): void {
    if (!this._itemData) return;
    const t = userDataProxy.userData.dailyData[String(this._itemData.id)] as DailyRandState;
    if (!t) return;
    if (t.freeNum > 0) {
      t.freeNum -= 1;
    } else {
      t.buyNum += 1;
    }
    userDataProxy.saveData();
    this.init(this._itemData);
    gameUIMgr?.showCongratsGettingPopup({ list: [{ id: t.id, num: t.num }], type: 1 });
  }

  onMfClick(): void {
    AudioManager.instance.playEffectPath('sounds/click', Bundles.RES);
    const rd = this._awardData.radomData;
    if (rd && rd.freeNum > 0) {
      this.getShopAward();
      EventManager.instance.emit(EHomeEvent.UPDATE_HOME_REDDOT, [HOME_REDDOT.SHOPRED]);
    }
  }

  onBuyClick(): void {
    AudioManager.instance.playEffectPath('sounds/click', Bundles.RES);
    if (!this._itemData) return;
    if (this._itemData.buyType === BuyType.GLODBUY) {
      if (userDataProxy.userData.gold >= this._priceTotal) {
        userDataProxy.changeGold(-this._priceTotal);
        this.getShopAward();
      } else {
        gameUIMgr?.showTips('金币不够！');
      }
    } else if (this._itemData.buyType === BuyType.GEMBUY) {
      if (userDataProxy.userData.diamond >= this._priceTotal) {
        userDataProxy.changeDiamond(-this._priceTotal);
        this.getShopAward();
      } else {
        gameUIMgr?.showTips('钻石不够！');
        EventManager.instance.emit(EHomeEvent.SHOW_VIDEO_DIAMOMND_POPUP);
      }
    }
  }

  onVideoClick(): void {
    if (!this._itemData) return;
    AudioManager.instance.playEffectPath('sounds/click', Bundles.RES);
    const id = this._itemData.id === 1 ? 'diamondBox' : 'videoBox';
    AdsMgr.showVideoAds(
      new AdsParam(
        '1',
        `shop_${id}_ad`,
        () => this.getShopAward(),
        () => {},
        () => {
          gameUIMgr?.showTips('暂无广告!');
        },
      ),
      true,
    );
  }
}
