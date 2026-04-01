/**
 * 看视频得钻石（原 VideoDiamondPopup.js）
 */

import { _decorator, Label } from 'cc';
import { battleDataProxy } from './BattleDataProxy';
import { DataManager } from './DataManager';
import { PopupBase } from './PopupBase';
import { userDataProxy } from './UserDataProxy';

const { ccclass } = _decorator;

interface InitParams {
  closeFunc?: (() => void) | null;
}

@ccclass('VideoDiamondPopup')
export default class VideoDiamondPopup extends PopupBase {
  private _closeFunc: (() => void) | null = null;

  override init(params?: unknown): void {
    super.init(params);
    const p = params as InitParams | undefined;
    this._closeFunc = p?.closeFunc ?? null;

    const addNum = this.node.getChildByName('addNum')?.getComponent(Label);
    const n46 = DataManager.instance.eData.datapara['46']?.num;
    if (addNum != null) addNum.string = `+${n46 ?? ''}`;

    const residue = this.node.getChildByName('residue')?.getComponent(Label);
    const max = Number(DataManager.instance.eData.datapara['47']?.num ?? 0);
    const left = max - userDataProxy.userData.videoDiamondNum;
    if (residue != null) residue.string = `剩余次数：${left}/${max}`;
  }

  onVideoBtn(): void {
    this._closeFunc?.();
    this.removeUI();
  }
}
