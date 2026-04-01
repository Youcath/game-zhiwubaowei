/** 全局音频事件（原 GameGlobal.js） */

import { _decorator } from 'cc';
import { AppEvent, BgmTypes } from './AppProxy';
import { AudioManager } from './AudioManager';
import { audioUtil } from './AudioUtil';
import { CommonUtil } from './CommonUtil';
import { ComponentBase } from './ComponentBase';
import { EventManager } from './EventManager';
import { Bundles } from './HomeEnum';

const { ccclass } = _decorator;

/** 与 2.x 一致：首个 GameGlobal 实例 */
export let GGC: GameGlobal | null = null;

@ccclass('GameGlobal')
export class GameGlobal extends ComponentBase {
  static isFirstOpen = true;

  private _musicName = '';

  get musicName(): string {
    return this._musicName;
  }

  onLoad(): void {
    super.onLoad();
    GGC = this;
    audioUtil.init();
  }

  registerEvents(): void {
    EventManager.instance.on(AppEvent.AUDIO_CLICK, this.playBtnAudio, this);
    EventManager.instance.on(AppEvent.BGM_CHANGED, this.playBgm, this);
  }

  onDestroy(): void {
    EventManager.instance.off(AppEvent.AUDIO_CLICK, this.playBtnAudio, this);
    EventManager.instance.off(AppEvent.BGM_CHANGED, this.playBgm, this);
    super.onDestroy();
    if (GGC === this) GGC = null;
  }

  playBtnAudio = (): void => {
    audioUtil.playBtnAudio();
  };

  playBgm = (t: BgmTypes): void => {
    if (!CommonUtil.isEmpty(t)) {
      switch (t) {
        case BgmTypes.close:
          void this._musicName;
          AudioManager.instance.stopBgm();
          break;
        case BgmTypes.open:
          void this._musicName;
          AudioManager.instance.playBgmPath('sounds/bgm', Bundles.RES, true);
          break;
        case BgmTypes.load:
        case BgmTypes.main:
        case BgmTypes.draw:
        case BgmTypes.battle_ready:
          break;
        case BgmTypes.battle:
          break;
        default:
          break;
      }
    }
    AudioManager.instance.setBgmVolume(1);
  };
}
