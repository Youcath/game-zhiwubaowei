/**
 * 解锁杂交植物展示（原 UnlockHybridPlantPopup.js）
 */

import { _decorator, Label, Sprite, SpriteAtlas, tween, Vec3 } from 'cc';
import { DataManager } from './DataManager';
import { Bundles } from './HomeEnum';
import { PopupBase } from './PopupBase';
import { PopupCacheMode } from './PopupManager';
import { ResUtil } from './ResUtil';

const { ccclass, property } = _decorator;

interface InitParams {
  plantId?: number | string;
  callback?: (() => void) | null;
}

@ccclass('UnlockHybridPlantPopup')
export default class UnlockHybridPlantPopup extends PopupBase {
  @property(Sprite)
  mPlantImg: Sprite | null = null;

  @property(Label)
  mPlantName: Label | null = null;

  private _closeFunc: (() => void) | null = null;

  override init(params?: unknown): void {
    super.init(params);
    const t = params as InitParams | undefined;
    const plantId = t?.plantId;
    this._closeFunc = t?.callback ?? null;
    const row = DataManager.instance.eData.dataplant[String(plantId ?? '')] as
      | { icon?: string; name?: string }
      | undefined;
    if (!row || !this.mPlantImg) return;

    this.mPlantImg.spriteFrame = null;
    const img = this.mPlantImg;
    void ResUtil.loadAsset({
      path: 'textures/botanyIcon/BotanyIcon',
      type: SpriteAtlas,
      bundleName: Bundles.GAME,
    })
      .then((atlas) => {
        if (!img.isValid) return;
        img.spriteFrame = (atlas as SpriteAtlas).getSpriteFrame(`${row.icon ?? ''}`);
        img.node.setScale(0.3, 0.3, 1);
        tween(img.node)
          .to(0.15, { scale: new Vec3(3, 3, 1) })
          .to(0.1, { scale: new Vec3(2.5, 2.5, 1) })
          .call(() => {
            const pulse = tween(img.node)
              .to(0.3, { scale: new Vec3(2.7, 2.7, 1) })
              .to(0.3, { scale: new Vec3(2.5, 2.5, 1) });
            tween(img.node).repeatForever(pulse).start();
          })
          .start();
      })
      .catch((e) => console.log('error:', e));

    if (this.mPlantName) this.mPlantName.string = row.name ?? '';
  }

  override removeUI(mode = PopupCacheMode.ONCE, showLast = true): void {
    this._closeFunc?.();
    super.removeUI(mode, showLast);
  }
}
