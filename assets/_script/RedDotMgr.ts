/** 主界面红点（原 RedDotMgr.js） */

import { Node } from 'cc';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import { EHomeEvent, HOME_REDDOT } from './HomeEnum';
import { TimeUtil } from './TimeUtil';
import { userDataProxy } from './UserDataProxy';

type StageRewardRow = { id?: number; round?: string | number; roundReward?: string; boxWave?: string };
type PlantRow = { id?: number; use?: number; stageID?: number; needItem?: number; needNum?: string };

export default class RedDotMgr {
  private static _instance: RedDotMgr | null = null;

  static get instance(): RedDotMgr {
    return (this._instance ??= new RedDotMgr());
  }

  mShopRed: Node | null = null;
  mBattleRed: Node | null = null;
  mPlantRed: Node | null = null;
  mHybridRed: Node | null = null;
  mBaseRed: Node | null = null;
  mWeatherRed: Node | null = null;
  mUnlockPlantDatas: PlantRow[] = [];

  initRedState(): void {
    const t = DataManager.instance.eData.dataplant as Record<string, PlantRow>;
    const e = userDataProxy.userData.passChapter;
    for (const o in t) {
      const n = t[o]!;
      if (n.use === 1 && n.stageID != null && n.stageID < e + 1) {
        this.mUnlockPlantDatas.push(n);
      }
    }
    this.updateRedDotState([
      HOME_REDDOT.BASERED,
      HOME_REDDOT.BATTLERED,
      HOME_REDDOT.HYBRIDRED,
      HOME_REDDOT.PLANTRED,
      HOME_REDDOT.SHOPRED,
    ]);
    EventManager.instance.on(EHomeEvent.UPDATE_HOME_REDDOT, this.updateRedDotState, this);
  }

  updateRedDotState = (keys: HOME_REDDOT[]): void => {
    for (let e = 0; e < keys.length; ++e) {
      const o = keys[e]!;
      if (o === HOME_REDDOT.SHOPRED && this.mShopRed) {
        this.mShopRed.active = this.getShopRedIsShow();
      } else if (o === HOME_REDDOT.BATTLERED && this.mBattleRed && this.mWeatherRed) {
        this.mBattleRed.active = this.getBattleRedIsShow();
        if (userDataProxy.userData.gameModel === 1) {
          this.mWeatherRed.active = this.getWeatherModelRedIsShow();
        } else {
          this.mWeatherRed.active = this.getBattleRedIsShow();
        }
      } else if (o === HOME_REDDOT.PLANTRED && this.mPlantRed) {
        this.mPlantRed.active = this.getPlantRedIsShow();
      } else if (o === HOME_REDDOT.HYBRIDRED && this.mHybridRed) {
        this.mHybridRed.active = this.getHybridRedIsShow();
      } else if (o === HOME_REDDOT.BASERED && this.mBaseRed) {
        this.mBaseRed.active = this.getBaseRedIsShow();
      }
    }
  };

  getBattleRedIsShow(): boolean {
    const t = userDataProxy.userData.passChapter;
    for (let e = 1; e <= t; ++e) {
      const o = (DataManager.instance.eData.datastagereward as Record<string, StageRewardRow>)[String(e)];
      if (o) {
        for (let i = 1; i < 4; i++) {
          if (this.getBattleBoxRedIsShow(o, i)) {
            return true;
          }
        }
      }
    }
    const n: StageRewardRow[] = [];
    const a = DataManager.instance.eData.datastagereward as Record<string, StageRewardRow>;
    for (const c in a) {
      if (a[c]!.roundReward !== '') n.push(a[c]!);
    }
    const rr = userDataProxy.userData.roundReward;
    if (rr) {
      for (let i = 0; i < n.length; ++i) {
        const l = n[i]!;
        if (!(userDataProxy.userData.passChapter >= (l.id ?? 0))) {
          break;
        }
        const roundKey = String(l.round ?? l.id ?? '');
        if (!rr[roundKey]) {
          return true;
        }
      }
    }
    return false;
  }

  getBattleBoxRedIsShow(t: StageRewardRow, e: number): boolean {
    const rb = userDataProxy.userData.rewardBox;
    let o = 2;
    const pid = t.id ?? 0;
    const pass = userDataProxy.userData.passChapter;
    if (pass >= pid) {
      if (rb[pid]?.[e]) o = 3;
    } else if (pass + 1 === pid) {
      const waves = (t.boxWave ?? '').split('|');
      if (Number(waves[e - 1] ?? 0) > userDataProxy.userData.passWave) {
        o = 1;
      } else if (rb[pass + 1]?.[e]) {
        o = 3;
      } else if (e === 3) {
        o = pass >= pid ? 2 : 1;
      }
    } else {
      o = 1;
    }
    return o === 2;
  }

  getShopRedIsShow(): boolean {
    const t = userDataProxy.userData.boxData;
    if (!t || t.cdTime === 0) {
      return true;
    }
    const e = userDataProxy.userData.dailyData;
    if (!e || (e['freeNum'] as number | undefined) === 0) {
      return true;
    }
    const o = userDataProxy.userData.goldData;
    return !o || o.mfNum === 0;
  }

  getPlantRedIsShow(): boolean {
    for (let t = 0; t < this.mUnlockPlantDatas.length; ++t) {
      const e = this.mUnlockPlantDatas[t]!;
      const o = userDataProxy.getPlantData(e.id!).lv;
      const i = userDataProxy.getPropDatas(e.needItem!);
      const parts = (e.needNum ?? '').split('|');
      const n = Number(parts[o - 1] ?? 0);
      if (!(n < 0) && i >= n) {
        return true;
      }
    }
    return false;
  }

  getHybridRedIsShow(): boolean {
    if (!this.getHybridIsUnlock()) {
      return false;
    }
    const p79 = DataManager.instance.eData.datapara[79]?.num;
    const t = (p79 != null ? String(p79) : '').split('_');
    if (
      Number(t[1] ?? 0) <= userDataProxy.userData.manure &&
      userDataProxy.userData.hybridData.time <= 0
    ) {
      return true;
    }
    const e = userDataProxy.userData.hybridData.time;
    return !!(e && e - TimeUtil.getDate().getTime() <= 0) || this.getHybridPlantRedIsShow();
  }

  getHybridIsUnlock(): boolean {
    let e = 0;
    const o = Number(DataManager.instance.eData.datapara[73]?.num ?? 0);
    for (let i = 1; i <= 15; ++i) {
      const lv = userDataProxy.getPlantData(i).lv ?? 1;
      if (lv >= o && ++e >= 2) {
        return true;
      }
    }
    return false;
  }

  getHybridPlantRedIsShow(): boolean {
    for (let t = 0; t < userDataProxy.userData.hybridPlantDatas.length; ++t) {
      const e = userDataProxy.userData.hybridPlantDatas[t]!;
      const o = e.lv;
      const i = (DataManager.instance.eData.dataplant as Record<string, PlantRow>)[String(e.plantId)]!;
      const needNum = (i.needNum ?? '').split('|');
      if (userDataProxy.getNewProp(i.needItem!) >= Number(needNum[o - 1] ?? 0)) {
        return true;
      }
    }
    return (
      userDataProxy.userData.hybridPlantDatas.length > 0 &&
      (!userDataProxy.userData.wearHybridPlantId || userDataProxy.userData.wearHybridPlantId === 0)
    );
  }

  getBaseRedIsShow(): boolean {
    return false;
  }

  getWeatherModelRedIsShow(): boolean {
    const w = DataManager.instance.eData.data_weather as Record<string, unknown>;
    for (let t = 1; t <= userDataProxy.userData.passWeatherChapter; ++t) {
      if (w[String(t)] && !userDataProxy.userData.weatherRewardBox?.[t]) {
        return true;
      }
    }
    return false;
  }

  getBattleLeftBtnRedIsShow(t: number): boolean {
    if (userDataProxy.userData.gameModel === 1) {
      for (let e = 1; e < t; ++e) {
        const row = (DataManager.instance.eData.datastagereward as Record<string, StageRewardRow>)[String(e)];
        if (row) {
          for (let o = 1; o < 4; o++) {
            if (this.getBattleBoxRedIsShow(row, o)) {
              return true;
            }
          }
        }
      }
    } else {
      for (let e = 1; e < t; ++e) {
        const row = (DataManager.instance.eData.data_weather as Record<string, unknown>)[String(e)];
        if (row && !userDataProxy.userData.weatherRewardBox?.[e]) {
          return true;
        }
      }
    }
    return false;
  }

  getBattleRightBtnRedIsShow(t: number): boolean {
    if (userDataProxy.userData.gameModel === 1) {
      const e = userDataProxy.userData.passChapter;
      for (let o = t + 1; o <= e; ++o) {
        const row = (DataManager.instance.eData.datastagereward as Record<string, StageRewardRow>)[String(o)];
        if (row) {
          for (let i = 1; i < 4; i++) {
            if (this.getBattleBoxRedIsShow(row, i)) {
              return true;
            }
          }
        }
      }
    } else {
      const e = userDataProxy.userData.passWeatherChapter;
      for (let o = t + 1; o <= e; ++o) {
        const row = (DataManager.instance.eData.data_weather as Record<string, unknown>)[String(o)];
        if (row && !userDataProxy.userData.weatherRewardBox?.[o]) {
          return true;
        }
      }
    }
    return false;
  }
}
