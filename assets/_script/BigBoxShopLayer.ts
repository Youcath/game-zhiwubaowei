/**
 * 商店大宝箱层（原 BigBoxShopLayer.js）
 */

import { _decorator, Color, Component, Label, Node, ProgressBar, Sprite, SpriteFrame } from 'cc';
import { AudioManager } from './AudioManager';
import { EventManager } from './EventManager';
import { ResUtil } from './ResUtil';
import AdsMgr, { AdsParam } from './AdsMgr';
import { Bundles, EHomeEvent, HOME_REDDOT } from './HomeEnum';
import { DataManager } from './DataManager';
import { userDataProxy, EUserDataEvent } from './UserDataProxy';
import Util from './Util';
import { gameUIMgr } from './GameUIManager';

const { ccclass, property } = _decorator;

type ShopBoxRow = {
  exp: number;
  cost: string;
  bigCost: string;
  reward: string;
  bigReward: string;
  gainExp: string;
  bigGainExp: string;
  freeTime: string;
  bigGainGold?: number;
};

@ccclass('BigBoxShopLayer')
export default class BigBoxShopLayer extends Component {
  @property(Node)
  bigBox: Node | null = null;

  @property(Node)
  bigbigBox: Node | null = null;

  @property(Label)
  levelLabel: Label | null = null;

  @property(ProgressBar)
  progressBar: ProgressBar | null = null;

  @property(Label)
  progressLabel: Label | null = null;

  private _bigBoxConfig: ShopBoxRow | null = null;
  private _buyType1 = 1;
  private _buyPrice1 = 0;
  private _buyType2 = 1;
  private _buyPrice2 = 0;

  init(): void {
    EventManager.instance.off(EUserDataEvent.DIAMOD_UPDATE, this.updateDiamond, this);
    EventManager.instance.on(EUserDataEvent.DIAMOD_UPDATE, this.updateDiamond, this);
    const box = userDataProxy.userData.boxData!;
    const lv = Math.min(box.level ?? 1, 10);
    this._bigBoxConfig = DataManager.instance.eData.datashopbox[String(lv)] as ShopBoxRow;
    if (!this._bigBoxConfig) return;
    if (box.exp! >= this._bigBoxConfig.exp) {
      box.exp! -= this._bigBoxConfig.exp;
      box.level = (box.level ?? 1) + 1;
      userDataProxy.saveData();
      this.init();
    } else {
      this.updateDisplay(box);
      this.handleCooldown(box);
      this.enableButtons(box);
    }
  }

  onDestroy(): void {
    EventManager.instance.off(EUserDataEvent.DIAMOD_UPDATE, this.updateDiamond, this);
  }

  private updateDisplay(t: { level?: number; exp?: number }): void {
    if (!this._bigBoxConfig || !this.levelLabel || !this.progressBar || !this.progressLabel) return;
    this.levelLabel.string = `Lv.${t.level ?? 1}`;
    this.progressBar.progress = (t.exp ?? 0) / this._bigBoxConfig.exp;
    this.progressLabel.string = `${t.exp ?? 0}/${this._bigBoxConfig.exp}`;
  }

  updateDiamond(): void {
    if (!this._bigBoxConfig || !this.bigBox || !this.bigbigBox) return;
    const p1 = this._bigBoxConfig.cost.split('_');
    const e = Number(p1[1] ?? 0);
    const o = this.bigBox.getChildByName('buyBtn')!.getChildByName('label')!.getComponent(Label)!;
    o.color = userDataProxy.userData.diamond >= e ? Color.WHITE : Color.RED;
    const p2 = this._bigBoxConfig.bigCost.split('_');
    const i = Number(p2[1] ?? 0);
    const n = this.bigbigBox.getChildByName('BtnBuy')!.getChildByName('label')!.getComponent(Label)!;
    n.color = userDataProxy.userData.diamond >= i ? Color.WHITE : Color.RED;
    const a = this.bigbigBox.getChildByName('buyBtn')!.getChildByName('label')!.getComponent(Label)!;
    a.color = userDataProxy.userData.diamond >= i ? Color.WHITE : Color.RED;
  }

  private handleCooldown(t: { cdTime?: number }): void {
    this.unscheduleAllCallbacks();
    const o = this.bigBox!.getChildByName('timerCd')!;
    o.active = (t.cdTime ?? 0) > 0;
    if ((t.cdTime ?? 0) > 0) {
      let i = (t.cdTime ?? 0) - Date.now();
      const n = o.getComponent(Label)!;
      n.string = Util.formatTimeMS(i, 3);
      this.schedule(() => {
        i -= 1000;
        n.string = Util.formatTimeMS(i, 3);
        if (i <= 0) {
          this.unscheduleAllCallbacks();
          this.resetCdTimer();
        }
      }, 1);
    }
  }

  private resetCdTimer(): void {
    userDataProxy.userData.boxData!.cdTime = 0;
    userDataProxy.saveData();
    this.init();
    EventManager.instance.emit(EHomeEvent.UPDATE_HOME_REDDOT, [HOME_REDDOT.SHOPRED]);
  }

  private enableButtons(t: { cdTime?: number; bigState?: number }): void {
    if (!this._bigBoxConfig || !this.bigBox || !this.bigbigBox) return;
    const o = !t.cdTime;
    this.bigBox.getChildByName('mianfeiBtn')!.active = !!o;
    this.bigBox.getChildByName('buyBtn')!.active = !o;
    if (t.cdTime) {
      const e = this._bigBoxConfig.cost.split('_');
      this._buyType1 = Number(e[0] ?? 1);
      this._buyPrice1 = Number(e[1] ?? 0);
    }
    const bc = this._bigBoxConfig.bigCost.split('_');
    this._buyType2 = Number(bc[0] ?? 1);
    this._buyPrice2 = Number(bc[1] ?? 0);
    this.updateBuyButton(this.bigBox.getChildByName('buyBtn')!, this._buyType1, this._buyPrice1);
    const i = this.bigbigBox.getChildByName('buyBtn')!;
    this.updateBuyButton(i, this._buyType2, this._buyPrice2);
    this.bigbigBox.getChildByName('videoBtn')!.active = !t.bigState;
    const n = this.bigbigBox.getChildByName('BtnBuy')!;
    i.active = !t.bigState;
    n.active = !!t.bigState;
    this.updateBuyButton(n, this._buyType2, this._buyPrice2);
  }

  private updateBuyButton(btn: Node, payType: number, price: number): void {
    const spr = btn.getChildByName('icon')!.getComponent(Sprite)!;
    const lab = btn.getChildByName('label')!.getComponent(Label)!;
    const path = payType === 1 ? 'textures/item/icon_1' : 'textures/item/icon_2';
    void ResUtil.loadAsset({ path, type: SpriteFrame, bundleName: Bundles.GAME })
      .then((asset) => {
        spr.spriteFrame = asset as SpriteFrame;
      })
      .catch((err) => console.log('error:', err));
    if (payType === 1) {
      lab.color = userDataProxy.userData.gold >= price ? Color.WHITE : Color.RED;
    } else {
      lab.color = userDataProxy.userData.diamond >= price ? Color.WHITE : Color.RED;
    }
    lab.string = `${price}`;
  }

  private getBigBoxProp(which: 1 | 2): void {
    if (!this._bigBoxConfig) return;
    const rewardKey = which === 1 ? 'reward' : 'bigReward';
    const expKey = which === 1 ? 'gainExp' : 'bigGainExp';
    const bd = userDataProxy.userData.boxData!;
    bd.exp = (bd.exp ?? 0) + Number(this._bigBoxConfig[expKey]);
    const raw = this._bigBoxConfig[rewardKey];
    const list: { id: number; num: number }[] = [];
    for (const seg of raw.split('|')) {
      const [id, num] = seg.split('_');
      list.push({ id: Number(id), num: Number(num) });
    }
    if (which === 2 && this._bigBoxConfig.bigGainGold) {
      list.push({ id: 1, num: this._bigBoxConfig.bigGainGold });
    }
    gameUIMgr?.showCongratsGettingPopup({ list, type: which + 1 });
    userDataProxy.saveData();
    this.init();
  }

  bigOneGetClick(_t: unknown, e: number): void {
    if (!this._bigBoxConfig) return;
    AudioManager.instance.playEffectPath('sounds/click', Bundles.RES);
    if (e === 1) {
      userDataProxy.userData.boxData!.cdTime = Date.now() + 3600000 * Number(this._bigBoxConfig.freeTime);
      this.getBigBoxProp(1);
      EventManager.instance.emit(EHomeEvent.UPDATE_HOME_REDDOT, [HOME_REDDOT.SHOPRED]);
    } else {
      this.purchaseBox(this._buyType1, this._buyPrice1, 1);
    }
  }

  bigTwoGetClick(_t: unknown, e: number): void {
    if (!this._bigBoxConfig) return;
    AudioManager.instance.playEffectPath('sounds/click', Bundles.RES);
    if (e === 1) {
      AdsMgr.showVideoAds(
        new AdsParam(
          '1',
          'shop_bigBox_ad',
          () => {
            userDataProxy.userData.boxData!.bigState = 1;
            const timerCd = this.bigbigBox?.getChildByName('timerCd');
            if (timerCd) timerCd.active = true;
            this.getBigBoxProp(2);
          },
          () => {},
          () => {},
        ),
        true,
      );
    } else {
      this.purchaseBox(this._buyType2, this._buyPrice2, 2);
    }
  }

  private purchaseBox(payType: number, price: number, which: 1 | 2): void {
    if (payType === 1 && userDataProxy.userData.gold >= price) {
      userDataProxy.changeGold(-price);
    } else if (payType === 2 && userDataProxy.userData.diamond >= price) {
      userDataProxy.changeDiamond(-price);
    } else {
      gameUIMgr?.showTips(payType === 1 ? '金币不够！' : '钻石不够！');
      if (payType !== 1) {
        EventManager.instance.emit(EHomeEvent.SHOW_VIDEO_DIAMOMND_POPUP);
      }
      return;
    }
    this.getBigBoxProp(which);
  }
}
