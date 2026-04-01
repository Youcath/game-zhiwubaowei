/**
 * 看视频得体力（原 VideoPhysicalPopup.js）
 */

import { _decorator, Label } from 'cc';
import AdsMgr from './AdsMgr';
import AnimationMgr from './AnimationMgr';
import { DataManager } from './DataManager';
import { PopupBase } from './PopupBase';
import { userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

@ccclass('VideoPhysicalPopup')
export default class VideoPhysicalPopup extends PopupBase {
  @property(Label)
  mAddNum: Label | null = null;

  override init(params?: unknown): void {
    super.init(params);
    const n = DataManager.instance.eData.datapara['24']?.num;
    if (this.mAddNum) this.mAddNum.string = `+${n ?? ''}`;
  }

  onBtnVideo(): void {
    AdsMgr.showVideoAds(
      {
        id: '1',
        eventId: 'video_physical_ad',
        success: () => {
          const e = Number(DataManager.instance.eData.datapara['24']?.num ?? 0);
          userDataProxy.addProp(3, e);
          AnimationMgr.instance.showAwardAni(
            { id: 3, num: e },
            this.node.parent,
            this.mAddNum?.node ?? null,
          );
          this.removeUI();
        },
        fail: () => {},
        error: () => {},
      },
      true,
    );
  }
}
