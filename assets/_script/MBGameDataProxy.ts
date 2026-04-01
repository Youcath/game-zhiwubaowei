/** 某小游戏存档（原 MBGameDataProxy.js） */

import { DataManager } from './DataManager';
import { ProxyBase, ProxyKey } from './ProxyBase';

export class MBGameData {
  failCount = 0;
  weaponRefreshCDData: Record<string, number> = {};
  btnStartTime = 0;
}

export class MBGameDataProxy extends ProxyBase<MBGameData> {
  constructor() {
    super(MBGameData);
  }

  get failCount(): number {
    return this._data.failCount;
  }

  get btnStartTime(): number {
    return this._data.btnStartTime;
  }

  set btnStartTime(t: number) {
    this._data.btnStartTime = t;
    this.saveData();
  }

  enterGame(): void {
    for (const t in this._data.weaponRefreshCDData) {
      this._data.weaponRefreshCDData[t]!--;
      if (this._data.weaponRefreshCDData[t]! <= 0) {
        delete this._data.weaponRefreshCDData[t];
      }
    }
    this.saveData();
  }

  isEquipCd(t: string): boolean {
    const v = this._data.weaponRefreshCDData[t];
    return !!(v && v > 0);
  }

  getEquipCD(t: string): number {
    return this._data.weaponRefreshCDData[t] ?? 0;
  }

  enterCD(t: string, e: number): void {
    this._data.weaponRefreshCDData[t] = e;
    this.saveData();
  }

  saveData(): void {
    DataManager.instance.writeGameDataBase(ProxyKey.MBData, this._data);
  }

  fail(): void {
    this._data.failCount++;
    this._data.btnStartTime = Date.now();
    this.saveData();
  }

  win(): void {
    this._data.failCount = 0;
    this._data.btnStartTime = Date.now();
    this.saveData();
  }
}

export const mbGameDataProxy = new MBGameDataProxy();
