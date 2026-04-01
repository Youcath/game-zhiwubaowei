/** 玩家数据代理（原 UserDataProxy.js）；DataManager 在方法内 require，避免循环依赖 */

import { gameUIMgr, type ICourseOpenParam } from './GameUIManager';
import { BoxType, ItemType } from './GameEnum';
import { EHomeEvent, HOME_REDDOT } from './HomeEnum';
import { EventManager } from './EventManager';
import { ProxyBase, ProxyKey } from './ProxyBase';
import { UserData } from './UserData';
import { DataManager } from './DataManager';

function dm(): DataManager {
  return DataManager.instance;
}

export namespace EUserDataEvent {
  export const POWER_UPDATE = 'EUserDataEvent.PowerUpdate';
  export const GOLD_UPDATE = 'EUserDataEvent.GoldUpdate';
  export const DIAMOD_UPDATE = 'EUserDataEvent.DiamodUpdate';
  export const MANURE_UPDATE = 'EUserDataEvent.ManureUpdate';
  export const GM_COMMAND = 'GM_COMMAND';
  export const UPDATE_UNLOCK_PLANT = 'UPDATE_UNLOCK_PLANT';
  export const UPDATE_WEAR_PLANT = 'UPDATE_WEAR_PLANT';
  export const UPDATE_PLANT_LEVEL = 'UPDATE_PLANT_LEVEL';
  export const REFRESH_DIAMOND = 'REFRESH_DIAMOND';
  export const REFRESH_MONEY = 'REFRESH_MONEY';
  export const UPDATE_VIDEO_CARD = 'UPDATE_VIDEO_CARD';
  export const UPDATE_LOOP_REWARD_RED = 'UPDATE_LOOP_REWARD_RED';
  export const COURSE_OPEN = 'COURSE_OPEN';
  export const CLOSE_EQUIP_DETAILS = 'CLOSE_EQUIP_DETAILS';
  export const UPDATE_HYBRID_WEAR_PLANT = 'UPDATE_HYBRID_WEAR_PLANT';
}

export const SaveUserDataKey: Record<string, never> = {};

type WeightItem = { id: number; num: number; weight: number };

export class UserDataProxy extends ProxyBase<UserData> {
  mPlantColors = ['#2A6E2E', '#2D438C', '#6B30A6'];
  mNewUnlockPlantIds: number[] = [];
  mOnLineTime = 0;
  mIsChangeVersion = false;
  mYesterdayRank = 0;

  constructor() {
    super(UserData);
  }

  get userData(): UserData {
    return this._data;
  }

  get combatEqus(): number[] {
    return this.userData.combatEqus;
  }

  protected initData(): void {
    const mm = (globalThis as { mm?: { platform?: { umaTrackEvent?: (n: string, p: Record<string, string>) => void; versionStr?: string } } }).mm;
    setInterval(() => {
      this.mOnLineTime++;
      if ([1, 3, 5, 7, 10, 12, 15, 20, 30].indexOf(this.mOnLineTime) >= 0) {
        mm?.platform?.umaTrackEvent?.('time', { userA: `time_${this.mOnLineTime}` });
      }
    }, 60000);

    const eData = dm().eData.dataplant;
    const n = userDataProxy.userData.passChapter;
    for (let a = 0; a < this.userData.combatEqus.length; ++a) {
      const eqId = this.userData.combatEqus[a];
      const r = eData[String(eqId)] as { stageID?: number; id?: number } | undefined;
      if (r) {
        const remove =
          r.stageID != null &&
          r.stageID >= n + 1 &&
          r.id != null &&
          userDataProxy.userData.combatEqus.indexOf(r.id) >= 0;
        if (remove) this.userData.combatEqus.splice(a--, 1);
      } else {
        this.userData.combatEqus.splice(a--, 1);
      }
    }
    if (!(this.userData.versionStr && this.userData.versionStr !== '')) {
      this.userData.versionStr = mm?.platform?.versionStr ?? '';
      this.saveData();
    }
    const proc = (globalThis as { process?: { on?: (ev: string, fn: (t: unknown) => void) => void } }).process;
    proc?.on?.('unhandledRejection', (t: unknown) => {
      console.log('未处理的拒绝:', t);
    });
  }

  getPropDatas(t: number): number {
    return this.userData.propData[String(t)] ?? 0;
  }

  changeGold(t: string | number): void {
    const e = Number(t);
    if (e) {
      this.userData.gold += Math.floor(e);
      if (this.userData.gold < 0) this.userData.gold = 0;
      EventManager.instance.emit(EUserDataEvent.GOLD_UPDATE);
    } else {
      console.log('changeGold内容不合法！:', t);
    }
  }

  changeDiamond(t: string | number): void {
    const e = Number(t);
    if (e) {
      this.userData.diamond += e;
      if (this.userData.diamond < 0) this.userData.diamond = 0;
      this.saveData();
      EventManager.instance.emit(EUserDataEvent.DIAMOD_UPDATE);
    } else {
      console.log('changeDiamond内容不合法！:', t);
    }
  }

  updatePower(t: string | number): void {
    const e = Number(t);
    if (e) {
      userDataProxy.userData.power += e;
      if (userDataProxy.userData.power < 0) userDataProxy.userData.power = 0;
      this.saveData();
      EventManager.instance.emit(EUserDataEvent.POWER_UPDATE);
    } else {
      console.log('updatePower内容不合法！:', t);
    }
  }

  changeManure(t: string | number): void {
    const e = Number(t);
    if (e) {
      this.userData.manure += e;
      if (this.userData.manure < 0) this.userData.manure = 0;
      this.saveData();
      EventManager.instance.emit(EUserDataEvent.MANURE_UPDATE);
    } else {
      console.log('changeManure内容不合法！:', t);
    }
  }

  saveData(cb?: () => void): void {
    dm().writeGameDataBase(ProxyKey.UserData, this.userData, cb);
  }

  resetData(cb?: () => void): void {
    const e = this.userData.startGameRights;
    this._data = new UserData();
    this._data.startGameRights = e;
    this.saveData(cb);
  }

  newDataReset(): void {
    const mm = (globalThis as { mm?: { platform?: { umaTrackEvent?: (n: string, p: Record<string, string>) => void } } }).mm;
    this.userData.sweeping = 0;
    this.userData.videoPower = 0;
    this.userData.refreshNum = 0;
    this.userData.dailyData = {};
    this.userData.refreshNum = 0;
    this.userData.videoDiamondNum = 0;
    this.userData.videoManureNum = 0;
    if (userDataProxy.userData.boxData) {
      this.userData.boxData!.cdTime = 0;
      this.userData.boxData!.bigState = 0;
    } else {
      userDataProxy.userData.boxData = {
        cdTime: 0,
        bigState: 0,
        level: 1,
        exp: 0,
      };
    }
    this.userData.goldData = { videoNum: 0, mfNum: 0 };
    const p1001 = dm().eData.datapara[1001]?.num;
    const playNum = p1001 != null ? Number(p1001) : 0;
    if (userDataProxy.userData.endlessData) {
      this.userData.endlessData!.maxWave = 0;
      this.userData.endlessData!.isReceive = 0;
      userDataProxy.userData.endlessData.playNum = playNum;
    } else {
      userDataProxy.userData.endlessData = {
        maxWave: 0,
        isReceive: 0,
        myRank: 0,
        playNum,
      };
    }
    this.saveData();
    mm?.platform?.umaTrackEvent?.('dau', { userA: 'dau' });
  }

  getAward(t: { id: number; num: number }[]): void {
    for (let e = 0; e < t.length; ++e) {
      const o = t[e];
      if (o.id === 1) {
        this.changeDiamond(o.num);
      } else if (o.id !== 2) {
        if (o.id === 3) {
          this.changeGold(o.num);
        }
      }
    }
  }

  showCourse(t: ICourseOpenParam): boolean | undefined {
    if (t.courseId > 27) return false;
    if (this.checkCourseCanOpen(t.courseId)) {
      gameUIMgr?.showCoursePopup(t);
      return true;
    }
    return undefined;
  }

  checkCourseIsComplete(t: number): true | undefined {
    if (this.checkCourseCanOpen(t)) {
      return true;
    }
    return undefined;
  }

  checkCourseCanOpen(t: number): boolean {
    const e = this.userData.gameCourseData;
    return !e.isComplete && t === e.curId + 1;
  }

  completeCourse(t: number): boolean {
    const e = this.userData.gameCourseData;
    if (t !== e.curId + 1) {
      return false;
    }
    e.completeId = t;
    e.curId = t;
    const o = t + 1;
    if (!dm().eData.datagameguid[e.curId]) {
      e.isComplete = true;
    }
    this.saveData();
    EventManager.instance.emit(EUserDataEvent.COURSE_OPEN, o);
    return true;
  }

  getPlantData(t: number): { id: number; lv: number } {
    for (let e = 0; e < this.userData.plantDatas.length; ++e) {
      const o = this.userData.plantDatas[e];
      if (o.id === t) return o;
    }
    return { id: t, lv: 1 };
  }

  updatePlantLv(t: number, e: number): void {
    for (let o = 0; o < this.userData.plantDatas.length; ++o) {
      const i = this.userData.plantDatas[o];
      if (i.id === t) {
        i.lv = e;
        return;
      }
    }
    this.userData.plantDatas.push({ id: t, lv: e });
    this.saveData();
  }

  updateHybridPlantLv(t: number, e: number): void {
    for (let o = 0; o < this.userData.hybridPlantDatas.length; ++o) {
      const i = this.userData.hybridPlantDatas[o];
      if (i.plantId === t) {
        i.lv = e;
        return;
      }
    }
    this.userData.hybridPlantDatas.push({ plantId: t, lv: e });
    this.saveData();
  }

  getWeightAwards(t: WeightItem[], e: number): WeightItem[] {
    const o: WeightItem[] = [];
    const arr = t;
    for (let i = 0; i < e && !(arr.length <= 0); i++) {
      const n = this.getWeightAward(arr);
      for (let a = 0; a < arr.length; a++) {
        if (arr[a]!.id === n.id) {
          arr.splice(a, 1);
          break;
        }
      }
      o.push(n);
    }
    return o;
  }

  getWeightAward(t: WeightItem[]): WeightItem {
    t.sort((a, b) => a.weight - b.weight);
    const e = this.arrWeightAdd(t);
    const o = e[e.length - 1]!.weight;
    const i = Math.random() * o;
    return this.getRadomAward(i, e);
  }

  arrWeightAdd(t: WeightItem[]): WeightItem[] {
    if (!t || t.length <= 0) return [];
    const e: WeightItem[] = [];
    for (let o = 0; o < t.length; o++) {
      if (o === 0) {
        e[o] = t[o]!;
      } else {
        e[o] = t[o]!;
        e[o]!.weight = e[o - 1]!.weight + t[o]!.weight;
      }
    }
    return e;
  }

  getRadomAward(t: number, e: WeightItem[]): WeightItem {
    if (e.length === 1) {
      return e[0]!;
    }
    let o = 0;
    if (t <= e[0]!.weight) {
      return e[o]!;
    }
    if (t >= e[e.length - 1]!.weight) {
      o = e.length - 1;
      return e[o]!;
    }
    for (let i = 0; i < e.length; i++) {
      if (t <= e[i]!.weight) {
        o = i;
      } else if (t > e[i]!.weight && t <= e[i + 1]!.weight) {
        o = i + 1;
        break;
      } else if (t > e[i]!.weight && t <= e[i + 1]!.weight) {
        o = i + 1;
        break;
      }
    }
    return e[o]!;
  }

  checkBoxRetrunAwards(t: { id: number; num: number }[]): { id: string; num: number }[] {
    const i: { id: number; num: number }[] = [];
    for (let n = 0; n < t.length; n++) {
      const c = t[n]!;
      const dataItem = dm().eData.dataitem[String(c.id)] as { type?: number } | undefined;
      if (dataItem) {
        if (dataItem.type === ItemType.BOX) {
          const l = dm().eData.databox[String(c.id)] as { type?: number; reward?: string; weight?: string } | undefined;
          if (!l) continue;
          if (l.type === BoxType.FIXED) {
            const u = l.reward!.split('_');
            for (let p = 0; p < c.num; p++) {
              i.push({ id: Number(u[0]), num: Number(u[0]) });
            }
          } else if (l.type === BoxType.RADOM) {
            const d = l.reward!.split('|');
            const f = l.weight!.split('|');
            const y: WeightItem[] = [];
            for (let g = 0; g < d.length; g++) {
              const parts = d[g]!.split('_');
              const v = parts[0];
              const b = parts[1];
              if (v && b) {
                y.push({
                  id: parseInt(v, 10),
                  num: parseInt(b, 10),
                  weight: parseInt(f[g]!, 10),
                });
              }
            }
            for (let p = 0; p < c.num; p++) {
              const P = this.getWeightAwards(JSON.parse(JSON.stringify(y)) as WeightItem[], 1);
              if (P.length > 0) {
                const D = P[0]!;
                i.push({ id: D.id, num: D.num });
              }
            }
          }
        } else {
          i.push({ id: c.id, num: c.num });
        }
      }
    }
    const S: Record<string, number> = {};
    for (const B of i) {
      const id = String(B.id);
      if (S[id]) S[id] += B.num;
      else S[id] = B.num;
    }
    const x: { id: string; num: number }[] = [];
    for (const M in S) {
      x.push({ id: M, num: S[M]! });
    }
    return x;
  }

  getWearItemIsUnlock(t: number): { isUnlock: boolean; unlockChapter: number } {
    const d34 = dm().eData.datapara[34]?.num;
    if (t < Number(d34 ?? 0)) {
      return { isUnlock: true, unlockChapter: 0 };
    }
    const e = userDataProxy.userData.passChapter;
    if (t === 2) {
      const i = Number(dm().eData.datapara[35]?.num ?? 0);
      return { isUnlock: e >= i, unlockChapter: i };
    }
    if (t === 1) {
      const n = Number(dm().eData.datapara[43]?.num ?? 0);
      return { isUnlock: e >= n, unlockChapter: n };
    }
    const a = Number(dm().eData.datapara[36]?.num ?? 0);
    return { isUnlock: e >= a, unlockChapter: a };
  }

  addProp(t: number, e: number, _o = true): void {
    if (t === 1) {
      this.changeGold(e);
      return;
    }
    if (t === 2) {
      this.changeDiamond(e);
      return;
    }
    if (t === 3) {
      this.updatePower(e);
      return;
    }
    if (t === 9) {
      this.changeManure(e);
      return;
    }
    if (t >= 2001) {
      this.addNewProp(t, e);
      return;
    }
    const i = this.userData.propData;
    if (i[String(t)]) {
      i[String(t)]! += e;
    } else {
      i[String(t)] = e;
    }
    if (t !== 6) {
      if (t >= 1001 && t <= 1014) {
        EventManager.instance.emit(EHomeEvent.UPDATE_HOME_REDDOT, [HOME_REDDOT.PLANTRED]);
      } else if (t === 5 || t === 2001 || t === 2002 || t === 4) {
        EventManager.instance.emit(EUserDataEvent.UPDATE_VIDEO_CARD);
      }
    }
    this.saveData();
  }

  getProp(t: number): number {
    if (t >= 2001) {
      return this.getNewProp(t);
    }
    return 0 | (this.userData.propData[String(t)] ?? 0);
  }

  addNewProp(t: number, e: number): void {
    if (!this.userData.newPropDatas) this.userData.newPropDatas = [];
    const o = this.userData.newPropDatas.findIndex((x) => x.propId === t);
    if (o >= 0) {
      this.userData.newPropDatas[o]!.num += e;
    } else {
      this.userData.newPropDatas.push({ propId: t, num: e });
    }
    this.saveData();
  }

  getNewProp(t: number): number {
    if (!this.userData.newPropDatas) this.userData.newPropDatas = [];
    const o = this.userData.newPropDatas.findIndex((x) => x.propId === t);
    if (o >= 0) return this.userData.newPropDatas[o]!.num;
    return 0;
  }

  getIsUnlockPlant(t: number): boolean {
    return !(
      this.userData.unlockPlantIds.indexOf(t) < 0 &&
      (this.userData.unlockPlantIds.push(t), this.saveData(), true)
    );
  }

  getHybridAllStar(): number {
    let t = 0;
    for (let e = 0; e < this.userData.hybridPlantDatas.length; ++e) {
      t += this.userData.hybridPlantDatas[e]!.lv;
    }
    return t;
  }
}

export const userDataProxy = new UserDataProxy();
