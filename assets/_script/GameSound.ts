/**
 * 全局点击音效（原 GameSound.js）：监听 APP_AUDIO_CLICK 播放 click 音效。
 */

import { _decorator } from 'cc';
import { AudioManager } from './AudioManager';
import { AppEvent } from './AppProxy';
import { ComponentBase } from './ComponentBase';
import { EventManager } from './EventManager';
import { Bundles } from './HomeEnum';

const { ccclass } = _decorator;

@ccclass('GameSound')
export class GameSound extends ComponentBase {
  onLoad(): void {
    super.onLoad();
    EventManager.instance.on(AppEvent.AUDIO_CLICK, this.playClick, this);
  }

  onDestroy(): void {
    EventManager.instance.off(AppEvent.AUDIO_CLICK, this.playClick, this);
    super.onDestroy();
  }

  playClick(): void {
    AudioManager.instance.playEffectPath('sounds/click', Bundles.RES);
  }
}
