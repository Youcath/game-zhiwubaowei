/** 其它玩法进度数据（原 OtherDataProxy.js） */

import { DataManager } from './DataManager';
import { ProxyBase, ProxyKey } from './ProxyBase';

export enum EOtherDataEvent {
  OLINE_UPDATE = 'EOtherDataEvent.OlineUpdate',
  TASK_UPDATE = 'EOtherDataEvent.TaskUpdate',
  CUMULATIVE_REWARD_UPDATE = 'EOtherDataEvent.CumulativeRewardUpdate',
  SIGN_UPDATE = 'EOtherDataEvent.SignUpdate',
}

export enum ConditionKey {
  MUTOU = 1,
  TIANFU = 2,
  SLAY = 3,
  BUILD = 4,
  LOOKAD = 5,
  DRAWWW = 6,
  UPGRADE = 7,
  BATTLE = 8,
  RESETSKILL = 9,
}

export class OtherData {
  onlineData: unknown[] = [];
  taskData: unknown[] = [];
  condition: Record<string, number> = {};
  starNum = 0;
  cumulativeRewardData = {
    onlineSecond: 0,
  };
  signData = {
    signDay: 0,
    signTime: 0,
    isTodaySign: false,
  };
}

export default class OtherDataProxy extends ProxyBase<OtherData> {
  constructor() {
    super(OtherData);
  }

  get otherData(): OtherData {
    return this._data;
  }

  addCondition(t: number, e = 1): void {
    const k = String(t);
    this.otherData.condition[k] = (this.otherData.condition[k] ?? 0) + e;
    this.saveData();
  }

  saveData(): void {
    DataManager.instance.writeGameDataBase(ProxyKey.OtherData, this.otherData);
  }

  resetData(): void {
    this._data = new OtherData();
    DataManager.instance.saveGame();
  }
}

export const otherDataProxy = new OtherDataProxy();
