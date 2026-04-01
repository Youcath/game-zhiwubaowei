/**
 * 杂交坑位（原 HybridPitItem.js）
 */

import { _decorator, Component, Label, Node, Sprite, SpriteAtlas, tween, Tween, v3 } from 'cc';
import { ResUtil } from './ResUtil';
import { Bundles } from './HomeEnum';
import { DataManager } from './DataManager';
import { userDataProxy } from './UserDataProxy';

const { ccclass } = _decorator;

/** 避免与 HomeHybridView 循环引用 */
export interface IHybridPitOwner {
  removePitPlant(pitIdx: number, plantId: number): void;
}

@ccclass('HybridPitItem')
export default class HybridPitItem extends Component {
  private _itemIdx = 0;
  private _homeHybridView: IHybridPitOwner | null = null;
  private _plantId = 0;

  get itemIdx(): number {
    return this._itemIdx;
  }

  get plantId(): number {
    return this._plantId;
  }

  set homeHybridView(v: IHybridPitOwner | null) {
    this._homeHybridView = v;
  }

  initHybridPitItem(t: number, plantId: number | null): void {
    this._itemIdx = t;
    this._plantId = plantId ?? 0;
    const onNd = this.node.getChildByName('on');
    const plantImg = this.node.getChildByName('plantImg');
    const mask = this.node.getChildByName('mask');
    const plantName = this.node.getChildByName('plantName')?.getComponent(Label);
    const plantedTips = this.node.getChildByName('plantedTips');
    const btnRemove = this.node.getChildByName('BtnRemove');
    const hd = userDataProxy.userData.hybridData;
    let e = plantId ?? 0;
    if (hd.time > 0 || e) {
      if (plantedTips) plantedTips.active = false;
      if (!e) {
        e = t === 1 ? hd.plant1 : hd.plant2;
      }
      const h = DataManager.instance.eData.dataplant[String(e)] as { id: number; name: string } | undefined;
      if (!h) return;
      if (plantName) plantName.string = h.name;
      if (mask) mask.active = true;
      if (onNd) onNd.active = false;
      if (plantName) plantName.node.active = true;
      void ResUtil.loadAsset({
        path: 'textures/botanyIcon/BotanyIcon',
        type: SpriteAtlas,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          const atlas = asset as SpriteAtlas;
          if (plantImg) {
            plantImg.active = true;
            const spr = plantImg.getComponent(Sprite);
            if (spr) spr.spriteFrame = atlas.getSpriteFrame(`pic_plant${h.id}`) ?? null;
          }
        })
        .catch((err) => console.log('error:', err));
      if (btnRemove) btnRemove.active = hd.time <= 0;
    } else {
      if (plantedTips) {
        plantedTips.active = true;
        Tween.stopAllByTarget(plantedTips);
        plantedTips.setPosition(plantedTips.position.x, 135, plantedTips.position.z);
        const bob = tween(plantedTips)
          .by(0.3, { position: v3(0, 20, 0) })
          .by(0.3, { position: v3(0, -20, 0) });
        tween(plantedTips).repeatForever(bob).start();
      }
      if (plantName) plantName.node.active = false;
      if (mask) mask.active = false;
      if (plantImg) plantImg.active = false;
      if (btnRemove) btnRemove.active = false;
      if (onNd) onNd.active = true;
    }
  }

  onBtnRemove(): void {
    this._homeHybridView?.removePitPlant(this._itemIdx, this._plantId);
    this.initHybridPitItem(this._itemIdx, null);
  }

  hideRemoveBtn(): void {
    this.node.getChildByName('BtnRemove')!.active = false;
  }
}
