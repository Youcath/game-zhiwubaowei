/**
 * 解锁新植物展示（原 UnlockNewPlantPopup.js）
 */

import { _decorator, Label, Node, sp } from 'cc';
import { AudioManager } from './AudioManager';
import { DataManager } from './DataManager';
import { Bundles } from './HomeEnum';
import { PopupBase } from './PopupBase';
import { userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

interface InitParams {
  closeFunc?: (() => void) | null;
}

@ccclass('UnlockNewPlantPopup')
export default class UnlockNewPlantPopup extends PopupBase {
  @property(sp.Skeleton)
  mPlantSpine: sp.Skeleton | null = null;

  @property(Label)
  mPlantName: Label | null = null;

  @property(Node)
  mBtnClose: Node | null = null;

  private _plantId = 0;
  private _closeFunc: (() => void) | null = null;

  override init(params?: unknown): void {
    super.init(params);
    const t = params as InitParams | undefined;
    this._closeFunc = t?.closeFunc ?? null;
    const spine = this.mPlantSpine;
    if (spine) {
      spine.setCompleteListener((te) => {
        const name = te?.animation?.name ?? '';
        if (name === '1') {
          if (this.mBtnClose) this.mBtnClose.active = true;
          spine.setAnimation(0, '2', true);
        } else if (name === '3') {
          if (userDataProxy.mNewUnlockPlantIds.length <= 0) {
            this._closeFunc?.();
            this.removeUI();
          } else {
            this.setPlantInfo();
            this.playSpine();
          }
        }
      });
    }
    this.setPlantInfo();
  }

  private setPlantInfo(): void {
    const first = userDataProxy.mNewUnlockPlantIds[0];
    if (first == null) return;
    this._plantId = first;
    const row = DataManager.instance.eData.dataplant[String(this._plantId)] as { name?: string } | undefined;
    if (this.mPlantName) {
      this.mPlantName.node.active = true;
      this.mPlantName.string = row?.name ?? '';
    }
    if (this.mBtnClose) this.mBtnClose.active = false;
    const sn = this.mPlantSpine?.node;
    if (sn) sn.active = false;
    userDataProxy.mNewUnlockPlantIds.splice(0, 1);
  }

  private playSpine(): void {
    const spine = this.mPlantSpine;
    if (!spine) return;
    spine.node.active = true;
    spine.setSkin(`plant${this._plantId}`);
    spine.setAnimation(0, '1', false);
  }

  override onShow(): void {
    super.onShow();
    this.playSpine();
    AudioManager.instance.playEffectPath('sounds/getPlant', Bundles.RES);
  }

  onBtnClose(): void {
    if (this.mBtnClose) this.mBtnClose.active = false;
    if (this.mPlantName) this.mPlantName.node.active = false;
    this.mPlantSpine?.setAnimation(0, '3', false);
  }
}
