/** 各数据代理从服务端/本地合并入口（原 ProxyManager.js） */

import { BattleData, battleDataProxy } from './BattleDataProxy';
import { GuardingData, guardingDataProxy } from './GuardingDataProxy';
import { MBGameData, mbGameDataProxy } from './MBGameDataProxy';
import { OtherData, otherDataProxy } from './OtherDataProxy';
import { PlantDefenseData, plantDefenseDataProxy } from './PlantDefenseDataProxy';
import { ProxyKey } from './ProxyBase';
import { RelicsData, relicsDataProxy } from './RelicsDataProxy';
import { STJData, sTJDataProxy } from './STJDataProxy';
import { UserData, userDataProxy } from './UserDataProxy';
import { SetData, userSetDataProxy } from './UserSetDataProxy';

export class ProxyManager {
  private static _instance: ProxyManager | null = null;

  static get instance(): ProxyManager {
    if (this._instance == null) this._instance = new ProxyManager();
    return this._instance;
  }

  readGameDataBase(t: string, e: unknown): void {
    switch (t) {
      case ProxyKey.BattleData: {
        const o = new BattleData();
        this.readDataItem(o, e);
        battleDataProxy.init(o as unknown as Partial<BattleData>);
        break;
      }
      case ProxyKey.UserData: {
        const d = new UserData();
        this.readDataItem(d, e);
        userDataProxy.init(d as unknown as Partial<UserData>);
        break;
      }
      case ProxyKey.SetData: {
        const m = new SetData();
        this.readDataItem(m, e);
        userSetDataProxy.init(m as unknown as Partial<SetData>);
        break;
      }
      case ProxyKey.RelicsData: {
        const f = new RelicsData();
        this.readDataItem(f, e);
        relicsDataProxy.init(f as unknown as Partial<RelicsData>);
        break;
      }
      case ProxyKey.OtherData: {
        const y = new OtherData();
        this.readDataItem(y, e);
        otherDataProxy.init(y as unknown as Partial<OtherData>);
        break;
      }
      case ProxyKey.MBData: {
        const g = new MBGameData();
        this.readDataItem(g, e);
        mbGameDataProxy.init(g as unknown as Partial<MBGameData>);
        break;
      }
      case ProxyKey.GuardingData: {
        const x = new GuardingData();
        this.readDataItem(x, e);
        guardingDataProxy.init(x as unknown as Partial<GuardingData>);
        break;
      }
      case ProxyKey.STJData: {
        const v = new STJData();
        this.readDataItem(v, e);
        sTJDataProxy.init(v as unknown as Partial<STJData>);
        break;
      }
      case ProxyKey.PlantDefenseData: {
        const b = new PlantDefenseData();
        this.readDataItem(b, e);
        plantDefenseDataProxy.init(b as unknown as Partial<PlantDefenseData>);
        break;
      }
      default:
        break;
    }
  }

  readDataItem(t: object, e: unknown): void {
    if (e == null || typeof e !== 'object') return;
    const target = t as Record<string, unknown>;
    const src = e as Record<string, unknown>;
    for (const o in src) {
      const ev = src[o];
      const tv = target[o];
      if (typeof ev === 'object' && ev !== null && tv != null && typeof tv === 'object') {
        this.readDataItem(tv as object, ev);
      } else {
        target[o] = ev;
      }
    }
  }
}
