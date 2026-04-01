/**
 * 金币商店单项（原 GlodShopItem.js，类名保留 Glod 与预制体一致）
 */

import { _decorator, Color, Component, Label } from 'cc';
import { AudioManager } from './AudioManager';
import { EventManager } from './EventManager';
import { TimeUtil } from './TimeUtil';
import AdsMgr, { AdsParam } from './AdsMgr';
import { Bundles, EHomeEvent, HOME_REDDOT } from './HomeEnum';
import { userDataProxy, EUserDataEvent } from './UserDataProxy';
import Util from './Util';
import { gameUIMgr } from './GameUIManager';

const { ccclass } = _decorator;

type BuyGoldRow = {
  buyType: number;
  reward: string;
  buyNum: number;
  freeNum: number;
  cost: string;
};

@ccclass('GlodShopItem')
export default class GlodShopItem extends Component {
  private _itemData: BuyGoldRow | null = null;

  init(t: BuyGoldRow): void {
    EventManager.instance.off(EUserDataEvent.DIAMOD_UPDATE, this.updateDiamond, this);
    EventManager.instance.on(EUserDataEvent.DIAMOD_UPDATE, this.updateDiamond, this);
    this._itemData = t;
    const gd = userDataProxy.userData.goldData!;
    const buyType = t.buyType;
    const n = Number(t.reward.split('_')[1] ?? 0);
    this.node.getChildByName('numLabel')!.getComponent(Label)!.string = `X${n}`;
    if (buyType === 1) {
      this.unscheduleAllCallbacks();
      this.node.getChildByName('mianfeiBtn')!.active = t.freeNum > gd.mfNum;
      const pro = this.node.getChildByName('proLabel');
      if (t.buyNum > 1 && t.freeNum === gd.mfNum) {
        const r = 10 - gd.videoNum;
        pro!.getComponent(Label)!.string = `${r}/${t.buyNum}`;
        pro!.active = true;
      }
      this.node.getChildByName('videoBtn')!.active = t.freeNum <= gd.mfNum && t.buyNum > gd.videoNum;
      if (gd.videoNum >= t.buyNum) {
        let l = Util.getNextDayZeroTimestamp() - Date.now();
        const u = this.node.getChildByName('timerCd')!.getComponent(Label)!;
        u.node.active = true;
        u.string = TimeUtil.format_MMSS(l);
        this.schedule(() => {
          l -= 1000;
          if (l < 0) this.unscheduleAllCallbacks();
          u.string = TimeUtil.format_MMSS(l);
        }, 1);
      }
    } else {
      const d = Number(t.cost.split('_')[1] ?? 0);
      const m = this.node.getChildByName('buyBtn')!;
      m.getChildByName('label')!.getComponent(Label)!.string = `${d}`;
      m.active = true;
      const lab = m.getChildByName('label')!.getComponent(Label)!;
      lab.color = userDataProxy.userData.diamond >= d ? Color.WHITE : Color.RED;
    }
  }

  onDestroy(): void {
    EventManager.instance.off(EUserDataEvent.DIAMOD_UPDATE, this.updateDiamond, this);
  }

  updateDiamond(): void {
    if (!this._itemData) return;
    const t = Number(this._itemData.cost.split('_')[1] ?? 0);
    const e = this.node.getChildByName('buyBtn');
    const lab = e?.getChildByName('label')?.getComponent(Label);
    if (!lab) return;
    lab.color = userDataProxy.userData.diamond >= t ? Color.WHITE : Color.RED;
  }

  onMianFeiClick(): void {
    if (!this._itemData) return;
    AudioManager.instance.playEffectPath('sounds/click', Bundles.RES);
    userDataProxy.userData.goldData!.mfNum += 1;
    userDataProxy.saveData();
    const parts = this._itemData.reward.split('_');
    gameUIMgr?.showCongratsGettingPopup({
      list: [{ id: Number(parts[0]), num: Number(parts[1]) }],
      type: 1,
    });
    this.init(this._itemData);
    EventManager.instance.emit(EHomeEvent.UPDATE_HOME_REDDOT, [HOME_REDDOT.SHOPRED]);
  }

  onBuyClick(): void {
    if (!this._itemData) return;
    AudioManager.instance.playEffectPath('sounds/click', Bundles.RES);
    const t = Number(this._itemData.cost.split('_')[1] ?? 0);
    if (userDataProxy.userData.diamond < t) {
      gameUIMgr?.showTips('钻石不够！');
      EventManager.instance.emit(EHomeEvent.SHOW_VIDEO_DIAMOMND_POPUP);
      return;
    }
    userDataProxy.changeDiamond(-t);
    const parts = this._itemData.reward.split('_');
    gameUIMgr?.showCongratsGettingPopup({
      list: [{ id: Number(parts[0]), num: Number(parts[1]) }],
      type: 1,
    });
  }

  onVideoClick(): void {
    if (!this._itemData) return;
    AudioManager.instance.playEffectPath('sounds/click', Bundles.RES);
    if (this._itemData.buyNum > userDataProxy.userData.goldData!.videoNum) {
      AdsMgr.showVideoAds(
        new AdsParam(
          '1',
          'shop_getGold_ad',
          () => {
            userDataProxy.userData.goldData!.videoNum += 1;
            userDataProxy.saveData();
            const parts = this._itemData!.reward.split('_');
            gameUIMgr?.showCongratsGettingPopup({
              list: [{ id: Number(parts[0]), num: Number(parts[1]) }],
              type: 1,
            });
            this.init(this._itemData!);
          },
          () => {},
          () => {},
        ),
        true,
      );
    } else {
      gameUIMgr?.showTips('广告次数超过了!');
    }
  }
}
