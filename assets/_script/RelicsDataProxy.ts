/** 遗物数据（原 RelicsDataProxy.js） */

import { DataManager } from './DataManager';
import { ProxyBase, ProxyKey } from './ProxyBase';

export class RelicsData {
  lookAdNum = 0;
  relicsMap: Record<string, { id: number; level: number; curNum: number }> = {};
  radomNum = 0;
}

export default class RelicsDataProxy extends ProxyBase<RelicsData> {
  constructor() {
    super(RelicsData);
  }

  get relicsData(): RelicsData {
    return this._data;
  }

  addRelics(t: number, e: number): void {
    const k = String(t);
    let o = this.relicsData.relicsMap[k];
    if (o) {
      o.curNum += e;
    } else {
      o = { id: t, level: 1, curNum: e };
      this.relicsData.relicsMap[k] = o;
    }
    this.saveData();
  }

  getRelicsData(t: number): { id: number; level: number; curNum: number } | undefined {
    return this.relicsData.relicsMap[String(t)];
  }

  upgradeRelics(t: number): void {
    const e = DataManager.instance.eData.data_artifact[String(t)];
    const row = this.relicsData.relicsMap[String(t)];
    if (!e || !row || !e.needNum) return;
    let o = row.level;
    let i = Number(e.needNum.split('|')[o - 1] ?? 0);
    while (row.curNum >= i && row.level < e.maxLevel) {
      row.curNum -= i;
      row.level += 1;
      o = row.level;
      i = Number(e.needNum.split('|')[o - 1] ?? 0);
    }
  }

  addRadomNum(t: number): void {
    this.relicsData.radomNum += t;
    this.saveData();
  }

  addLookAdNum(t: number): void {
    this.relicsData.lookAdNum += t;
    this.saveData();
  }

  newDataReset(): void {
    this.relicsData.lookAdNum = 0;
    this.saveData();
  }

  saveData(): void {
    DataManager.instance.writeGameDataBase(ProxyKey.RelicsData, this.relicsData);
  }

  resetData(): void {
    this._data = new RelicsData();
    DataManager.instance.saveGame();
  }
}

export const relicsDataProxy = new RelicsDataProxy();
