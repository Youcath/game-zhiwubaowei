/** 音量 / 震动等基础设置（原 BasicsProxy.js） */

import { ProxyBase } from './ProxyBase';
import { TimeUtil } from './TimeUtil';

class BasicsData {
  bgm_volume = 1;
  effect_volume = 1;
  vibrate_enable = true;
  follow_time = 0;
  shortcut_time = 0;
  favorite_guide_time = 0;
  rv_sum = 0;
  rv_list = '';
  custom_ad_num = 0;
  today_num: Record<string, number> = {};
  sync_time = 0;
  push_id: string | null = null;
  push_open_time = 0;
}

class BasicsProxyImpl extends ProxyBase<BasicsData> {
  constructor() {
    super(BasicsData);
  }

  get bgmVolume(): number {
    return this._data.bgm_volume;
  }

  set bgmVolume(v: number) {
    this._data.bgm_volume = v;
  }

  get effectVolume(): number {
    return this._data.effect_volume;
  }

  set effectVolume(v: number) {
    this._data.effect_volume = v;
  }

  get vibrateEnable(): boolean {
    return this._data.vibrate_enable;
  }

  set vibrateEnable(v: boolean) {
    this._data.vibrate_enable = v;
  }

  get followTime(): number {
    return this._data.follow_time;
  }

  get shortcutTime(): number {
    return this._data.shortcut_time;
  }

  get favoriteGuideTime(): number {
    return this._data.favorite_guide_time;
  }

  addCustomAdNum(): void {
    this._data.custom_ad_num = (this._data.custom_ad_num || 0) + 1;
  }

  saveSettings(): void {}

  getTodayNum(key: string): number {
    this.checkSameDay();
    return this._data.today_num[key] || 0;
  }

  private checkSameDay(): void {
    const t = TimeUtil.getTime();
    if (!TimeUtil.isSameDay(t, this._data.sync_time)) {
      for (const k in this._data.today_num) {
        this._data.today_num[k] = 0;
      }
      this._data.sync_time = t;
    }
  }
}

export const basicsProxy = new BasicsProxyImpl();
