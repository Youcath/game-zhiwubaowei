/** 植物防线玩法（原 PlantDefenseDataProxy.js） */

import { Node, tween, v3 } from 'cc';
import { EventManager } from './EventManager';
import { GameState } from './GameEnum';
import { ProxyBase, ProxyKey } from './ProxyBase';
import { DataManager } from './DataManager';

export enum PDPlantEnum {
  MAX_ATK_DISTANCE = 575,
}

export class PlantDefenseData {
  reliveCnt = 1;
  hurtMulti = 1;
  btnStartTime = 0;
  btnStartTime2 = 0;
  unlockLevels = [1];
  unlocklookAd: Record<string, unknown> = {};
  stageLoseNum: Record<string, number> = {};
}

export enum PDDataEvent {
  WOOD_UPDATE = 'WOOD_UPDATE',
  ADD_PLANT_CARD = 'ADD_PLANT_CARD',
  WOOD_ADD = 'WOOD_ADD',
  UPDATE_PLANT = 'UPDATE_PLANT',
  Eenter_PD_GAME = 'Eenter_PD_GAME',
  CHECK_GAME_END = 'CHECK_GAME_END',
  GAME_OVER = 'GAME_OVER',
  SWITCH_SUPER_WEAPON = 'SWITCH_SUPER_WEAPON',
}

export enum PDGameMode {
  PD_GAME = 1,
  SJ_GAME = 2,
}

export default class PlantDefenseDataProxy extends ProxyBase<PlantDefenseData> {
  gameState = GameState.NONE;
  gameMode = PDGameMode.PD_GAME;
  mapLayer: unknown = null;
  iceView: unknown = null;
  pathView: unknown = null;
  battleView: unknown = null;
  bulletLayer: unknown = null;
  topLayer: unknown = null;
  effectLayer: unknown = null;
  keyboradList: unknown[] = [];
  selectStageId = 1;
  plantList = '';
  soldiers: unknown[] = [];
  enemySoldiers: unknown[] = [];
  curSunshine = 0;
  speedAtkBuff = 1;
  superPlantIds: number[] = [];
  stagetAddBuff = 1;
  stagetJianBuff = 0;
  jarStates = new Map<string, string>();
  priestZombie: unknown[] = [];
  enemyAirship: unknown[] = [];
  airshipSoldier: unknown[] = [];
  enemyPathIce: unknown[] = [];
  waveEnemyNum = 0;
  plantNode15: unknown = null;
  summerLayer: unknown = null;
  sumBoxNode: Node | null = null;
  idPlants: Record<string, unknown> = {};
  oncePlantItem: unknown[] = [];

  constructor() {
    super(PlantDefenseData);
  }

  resetData(): void {
    this.oncePlantItem = [];
    this.superPlantIds = [];
    this.priestZombie = [];
    this.enemyAirship = [];
    this.airshipSoldier = [];
    this.enemyPathIce = [];
    this.idPlants = {};
    this.plantNode15 = null;
    this.curSunshine = 0;
    this.soldiers = [];
    this.enemySoldiers = [];
    this.jarStates.clear();
    this.speedAtkBuff = 1;
  }

  addSunshine(t: number): void {
    this.curSunshine += t;
    if (this.curSunshine < 0) this.curSunshine = 0;
    EventManager.instance.emit(PDDataEvent.WOOD_UPDATE);
    if (this.sumBoxNode) {
      tween(this.sumBoxNode)
        .to(0.1, { scale: v3(1.1, 1.1, 1) })
        .to(0.1, { scale: v3(1, 1, 1) })
        .start();
    }
  }

  checkSuperPlant(): void {}

  deleteSuperPlant(): void {}

  removeEnemyNode(t: unknown): void {
    const e = this.enemySoldiers.indexOf(t);
    if (e !== -1) this.enemySoldiers.splice(e, 1);
  }

  getIsSuperPlant(t: number): boolean {
    return this.superPlantIds.indexOf(t) >= 0;
  }

  isJarIntact(t: string): boolean {
    return this.jarStates.get(t) !== 'broken' && this.jarStates.get(t) !== 'defender';
  }

  isJarfanzhi(t: string): boolean {
    return this.jarStates.get(t) !== 'broken';
  }

  get PlantDefenseData(): PlantDefenseData {
    return this._data;
  }

  saveData(): void {
    DataManager.instance.writeGameDataBase(ProxyKey.PlantDefenseData, this.PlantDefenseData);
  }
}

export const plantDefenseDataProxy = new PlantDefenseDataProxy();
