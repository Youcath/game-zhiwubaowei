/** 跨天检测（原 AppManager.js） */

import { AppEvent } from './AppProxy';
import { EventManager } from './EventManager';
import { TimeUtil } from './TimeUtil';

export class AppManager {
  private static _instance: AppManager | null = null;

  static get instance(): AppManager {
    if (this._instance == null) this._instance = new AppManager();
    return this._instance;
  }

  private _endTime = 0;

  checkEndTime(): void {
    const t = TimeUtil.getTime();
    if (this._endTime === 0) this._endTime = TimeUtil.getDayEndTime(t);
    if (t > this._endTime) {
      this._endTime = TimeUtil.getDayEndTime(t);
      EventManager.instance.emit(AppEvent.DAY_UPDATE);
    }
    setTimeout(() => this.checkEndTime(), 60_000);
  }
}
