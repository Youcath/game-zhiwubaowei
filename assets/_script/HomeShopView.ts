/**
 * 商店页（原 HomeShopView.js）
 */

import { _decorator, Component, find, Label, Node, Sprite } from 'cc';
import { EventManager } from './EventManager';
import { TimeUtil } from './TimeUtil';
import AdsMgr, { AdsParam } from './AdsMgr';
import { DataManager } from './DataManager';
import { userDataProxy, EUserDataEvent } from './UserDataProxy';
import Util from './Util';
import { gameUIMgr } from './GameUIManager';
import GlodShopItem from './GlodShopItem';
import BigBoxShopLayer from './BigBoxShopLayer';
import ShopItem from './ShopItem';

const { ccclass, property } = _decorator;

@ccclass('HomeShopView')
export default class HomeShopView extends Component {
  /** 与 2.x 拼写一致 contant，便于预制体绑定 */
  @property(Node)
  contant: Node | null = null;

  @property(Node)
  dailyContant: Node | null = null;

  @property(Node)
  bigBoxShopLayer: Node | null = null;

  @property(Node)
  goldContant: Node | null = null;

  onEnable(): void {
    const ud = userDataProxy.userData;
    ud.boxData ||= { cdTime: 0, bigState: 0, level: 1, exp: 0 };
    ud.goldData ||= { videoNum: 0, mfNum: 0 };
    this.initView();
    this.startCdTimer();
    EventManager.instance.on(EUserDataEvent.REFRESH_DIAMOND, this.initView, this);
    EventManager.instance.on(EUserDataEvent.REFRESH_MONEY, this.initView, this);
  }

  onDisable(): void {
    this.unscheduleAllCallbacks();
    EventManager.instance.off(EUserDataEvent.REFRESH_DIAMOND, this.initView, this);
    EventManager.instance.off(EUserDataEvent.REFRESH_MONEY, this.initView, this);
  }

  initView = (): void => {
    if (!this.contant || !this.dailyContant || !this.bigBoxShopLayer || !this.goldContant) return;
    const daily = DataManager.instance.eData.datadailyshop as Record<string, Record<string, unknown>>;
    let e = 0;
    for (const o in daily) {
      if (!Object.prototype.hasOwnProperty.call(daily, o)) continue;
      const child = this.dailyContant.children[e];
      child?.getComponent(ShopItem)?.init(daily[o] as Parameters<ShopItem['init']>[0]);
      e++;
    }
    const videoBtn = find('dailyShopLayer/videoBtn', this.contant);
    if (videoBtn) {
      const pro = videoBtn.getChildByName('proLabel')?.getComponent(Label);
      if (pro) pro.string = `${20 - userDataProxy.userData.refreshNum}/20`;
    }
    this.bigBoxShopLayer.getComponent(BigBoxShopLayer)?.init();
    const goldTb = DataManager.instance.eData.databuygold as Record<string, Record<string, unknown>>;
    e = 0;
    for (const o in goldTb) {
      if (!Object.prototype.hasOwnProperty.call(goldTb, o)) continue;
      const item = this.goldContant.getChildByName(`glodItem_${e + 1}`);
      item?.getComponent(GlodShopItem)?.init(goldTb[o] as Parameters<GlodShopItem['init']>[0]);
      e++;
    }
    if (userDataProxy.userData.refreshNum >= 20 && videoBtn) {
      const iconAd = videoBtn.getChildByName('icon_ad')?.getComponent(Sprite);
      const spr = videoBtn.getComponent(Sprite);
      if (iconAd) Util.setSpriteGrayMaterial(iconAd);
      if (spr) Util.setSpriteGrayMaterial(spr);
    }
  };

  startCdTimer(): void {
    if (!this.contant) return;
    this.unscheduleAllCallbacks();
    let remain = Util.getNextDayZeroTimestamp() - Date.now();
    const o = find('dailyShopLayer/timerCd', this.contant)?.getComponent(Label);
    const i = find('bigBoxShopLayer/boxShopItem2/timerCd', this.contant)?.getComponent(Label);
    if (i) {
      i.node.active = userDataProxy.userData.boxData!.bigState === 1;
    }
    if (o) o.string = TimeUtil.format_HHMMSS(remain);
    this.schedule(() => {
      remain -= 1000;
      if (remain < 0) {
        this.unscheduleAllCallbacks();
        userDataProxy.userData.dailyData = {};
        userDataProxy.userData.boxData!.cdTime = 0;
        userDataProxy.userData.boxData!.bigState = 0;
        userDataProxy.saveData();
        this.initView();
        this.startCdTimer();
      }
      if (o) o.string = TimeUtil.format_HHMMSS(remain);
      if (userDataProxy.userData.boxData!.bigState === 1 && i) {
        i.string = TimeUtil.format_HHMMSS(remain);
      }
    }, 1);
  }

  refreshClick(): void {
    if (userDataProxy.userData.refreshNum >= 20) {
      gameUIMgr?.showTips('今日刷新次数已达上限！');
      return;
    }
    AdsMgr.showVideoAds(
      new AdsParam(
        '1',
        'shop_refresh_ad',
        () => {
          userDataProxy.userData.refreshNum += 1;
          const ds = DataManager.instance.eData.datadailyshop as Record<string, { id: number; videoRefresh?: number }>;
          for (const k in ds) {
            if (!Object.prototype.hasOwnProperty.call(ds, k)) continue;
            const row = ds[k]!;
            if (row.videoRefresh && row.videoRefresh > 0) {
              delete userDataProxy.userData.dailyData[String(row.id)];
            }
          }
          this.initView();
          userDataProxy.saveData();
        },
        () => {},
        () => {},
      ),
      true,
    );
  }

  openEquipmentFragmentsPopup(): void {
    gameUIMgr?.showEquipmentFragmentsPopup();
  }
}
