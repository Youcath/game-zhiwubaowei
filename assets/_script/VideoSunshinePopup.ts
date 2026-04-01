/**
 * 战斗中看视频阳光（原 VideoSunshinePopup.js）
 */

import { _decorator } from 'cc';
import { battleDataProxy } from './BattleDataProxy';
import { PopupBase } from './PopupBase';

const { ccclass } = _decorator;

interface InitParams {
  closeFunc?: (() => void) | null;
}

@ccclass('VideoSunshinePopup')
export default class VideoSunshinePopup extends PopupBase {
  private _closeFunc: (() => void) | null = null;

  override init(params?: unknown): void {
    super.init(params);
    const t = params as InitParams | undefined;
    this._closeFunc = t?.closeFunc ?? null;
    const videoIcon = this.node.getChildByName('BtnVideo')?.getChildByName('videoIcon') ?? null;
    battleDataProxy.setVideoCardIcon(videoIcon, 4, 1.5);
  }

  onVideoBtn(): void {
    this._closeFunc?.();
    this.removeUI();
  }
}
