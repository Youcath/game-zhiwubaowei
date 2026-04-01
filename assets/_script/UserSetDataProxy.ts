/** 设置项代理（原 UserSetDataProxy.js） */

import { AudioManager } from './AudioManager';
import { EGameEvent } from './GameEnum';
import { EventManager } from './EventManager';
import { ProxyBase, ProxyKey } from './ProxyBase';
import { DataManager } from './DataManager';

export class SetData {
  isOpenShake = true;
  musicVolume = 1;
  effectVolume = 1;
}

export default class UserSetDataProxy extends ProxyBase<SetData> {
  notActiveTime = 0;

  constructor() {
    super(SetData);
  }

  get setData(): SetData {
    return this._data;
  }

  protected initData(): void {
    EventManager.instance.on(EGameEvent.SCENE_TOUCH_START, this.onSceneTouch, this);
    AudioManager.instance.setBgmVolume(this._data.musicVolume);
    AudioManager.instance.setEffectVolume(this._data.effectVolume);
  }

  updateSecond(): void {}

  onSceneTouch = (): void => {
    this.resetNotActiveTime();
  };

  resetNotActiveTime(): void {
    this.notActiveTime = 0;
  }

  setEffectAudio(t: boolean): void {
    AudioManager.instance.isOpenEffectAudio = t;
    this.saveData();
  }

  setBackgroundAudio(t: boolean): void {
    AudioManager.instance.isOpenBackgroundAudio = t;
    this.saveData();
  }

  setVibrate(t: boolean): void {
    this.setData.isOpenShake = t;
    this.saveData();
  }

  saveData(): void {
    DataManager.instance.writeGameDataBase(ProxyKey.SetData, this.setData);
  }
}

export const userSetDataProxy = new UserSetDataProxy();
