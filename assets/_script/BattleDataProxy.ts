/**
 * 战斗运行时数据代理（原 BattleDataProxy.js 子集 + HomeBattleView 所需字段）。
 * 全量战斗逻辑待后续从 2.x 迁完。
 */

import { GameState, WeatherType } from './GameEnum';
import { DataManager } from './DataManager';
import { ProxyBase } from './ProxyBase';
import { SqlUtil } from './SqlUtil';
import { userDataProxy } from './UserDataProxy';

/** 与 2.x BattleDataProxy.EBattleEvent 一致，供 Home / 教程等派发 */
export namespace EBattleEvent {
  export const LOSE_COURSE_VIEW = 'LOSE_COURSE_VIEW';
}

/** 与 2.x `new BattleData()` / ProxyManager 一致 */
export class BattleData {
  ownSkillList: unknown[] = [];
  houseHp = 0;
  houseMaxHp = 0;
  sunshineNum = 0;
  expNum = 0;
  expLevel = 1;
  refreshNum = 0;
  getAllNum = 0;
  reviveNum = 0;
  ballNum = 1;
  superPlantId = 0;
  battleChapter = 0;
  battleWave = 0;
}

export class BattleDataProxy extends ProxyBase<BattleData> {
  /** 音效去重冷却（由战斗场景里每帧扣减 time，见原 BattleView / HomeScene） */
  audioFilterInfo: Record<string, { time: number }> = {};
  private _gameState = GameState.NONE;

  isGameLose = false;
  isEndless = false;
  weatherType = WeatherType.NONE;

  constructor() {
    super(BattleData);
  }

  get battleData(): BattleData {
    return this._data;
  }

  set battleData(v: BattleData) {
    this._data = v;
  }

  get gameState(): GameState {
    return this._gameState;
  }

  set gameState(v: GameState) {
    this._gameState = v;
  }

  loadBattleData(): string {
    return SqlUtil.getLocalUserData('BattleData', '');
  }

  saveBattlePlantData(t: string): void {
    if (!this.isEndless) {
      SqlUtil.setLocalUserData('BattlePlantData', t);
    }
  }

  loadBattlePlantData(): string {
    return `${SqlUtil.getLocalUserData('BattlePlantData', '')}`;
  }

  /**
   * 植物攻击力（2.x 全量含技能/杂交星等；此处仅 atack×growup，供 Home 装备条「Max」判断）。
   */
  getPlantAtk(plantId: number, growIdx: number, lv?: number): number {
    const row = DataManager.instance.eData.dataplant[String(plantId)] as
      | { atack?: string; growup?: string }
      | undefined;
    if (!row?.atack || !row.growup) return 0;
    let effLv = lv;
    if (effLv == null || effLv <= 0) {
      if (plantId >= 10001) {
        const h = userDataProxy.userData.hybridPlantDatas.find((x) => x.plantId === plantId);
        effLv = h?.lv ?? 1;
      } else {
        effLv = userDataProxy.getPlantData(plantId).lv;
      }
    }
    const atkArr = row.atack.split('|').map(Number);
    const growArr = row.growup.split('|').map(Number);
    const a = atkArr[effLv - 1];
    if (a == null || !Number.isFinite(a)) return 0;
    const r = growArr[growIdx - 1];
    if (r == null || !Number.isFinite(r)) return 0;
    return Math.floor(a * r);
  }

  /** Home 进关前清理（全量见 2.x，此处仅重置持久化子集） */
  clearData(): void {
    const b = this.battleData;
    b.ownSkillList = [];
    b.houseHp = 0;
    b.houseMaxHp = 0;
    b.sunshineNum = 0;
    b.expNum = 0;
    b.expLevel = 1;
    b.refreshNum = 0;
    b.getAllNum = 0;
    b.reviveNum = 0;
    b.ballNum = 1;
    b.battleChapter = 0;
    b.battleWave = 0;
    b.superPlantId = 0;
    this.weatherType = WeatherType.NONE;
  }
}

export const battleDataProxy = new BattleDataProxy();
