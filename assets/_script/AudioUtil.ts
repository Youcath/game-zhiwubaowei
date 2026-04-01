/** 点击音效 / 震动开关存 SqlUtil（原 AudioUtil.js） */

import { AudioManager } from './AudioManager';
import { Bundles } from './HomeEnum';
import { SqlUtil } from './SqlUtil';

export class AudioUtil {
  private _vibrate = 1;
  private _shockScreen = 1;

  get vibrate(): number {
    return this._vibrate;
  }

  set vibrate(t: number) {
    void SqlUtil.set('vibrate', t);
    this._vibrate = t;
  }

  get shockScreen(): number {
    return this._shockScreen;
  }

  set shockScreen(t: number) {
    void SqlUtil.set('shockScreen', t);
    this._shockScreen = t;
  }

  init(): void {
    this._vibrate = (SqlUtil.get('vibrate', 1) as number) ?? 1;
    this._shockScreen = (SqlUtil.get('shockScreen', 1) as number) ?? 1;
  }

  vibrateShort(): void {
    void this.vibrate;
  }

  vibrateLong(): void {
    void this.vibrate;
  }

  playBtnAudio(): void {
    AudioManager.instance.playEffectPath('sounds/click', Bundles.RES);
  }
}

export const audioUtil = new AudioUtil();
