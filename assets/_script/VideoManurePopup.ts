/**
 * 看视频得肥料（次数展示）（原 VideoManurePopup.js）
 */

import { _decorator, Label } from 'cc';
import { DataManager } from './DataManager';
import { PopupBase } from './PopupBase';
import { userDataProxy } from './UserDataProxy';

const { ccclass } = _decorator;

interface InitParams {
  closeFunc?: (() => void) | null;
}

@ccclass('VideoManurePopup')
export default class VideoManurePopup extends PopupBase {
  private _closeFunc: (() => void) | null = null;

  override init(params?: unknown): void {
    super.init(params);
    const t = params as InitParams | undefined;
    this._closeFunc = t?.closeFunc ?? null;

    const addNum = this.node.getChildByName('addNum')?.getComponent(Label);
    const n82 = DataManager.instance.eData.datapara['82']?.num;
    if (addNum) addNum.string = `+${n82 ?? ''}`;

    const residue = this.node.getChildByName('residue')?.getComponent(Label);
    const max = Number(DataManager.instance.eData.datapara['81']?.num ?? 0);
    const left = max - userDataProxy.userData.videoManureNum;
    if (residue) residue.string = `剩余次数：${left}/${max}`;
  }

  onVideoBtn(): void {
    this._closeFunc?.();
    this.removeUI();
  }
}
