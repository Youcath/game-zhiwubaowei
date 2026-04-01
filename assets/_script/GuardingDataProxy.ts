/** 守桥玩法运行时 + 存档（原 GuardingDataProxy.js，去掉 cc_class） */

import { DataManager } from './DataManager';
import { GameState } from './GameEnum';
import { ProxyBase, ProxyKey } from './ProxyBase';

export class GuardingData {
  btnStartTime = 0;
  unlockLevels = [1];
  unlocklookAd: Record<string, unknown> = {};
}

export enum GuardingDataEvent {
  ITEM_UPDATE = 'ITEM_UPDATE',
  UPDATE_EQUIPMENT = 'UPDATE_EQUIPMENT',
  KILL_MONSTER = 'KILL_MONSTER',
  ENTER_LEVEL = 'ENTER_LEVEL',
}

export default class GuardingDataProxy extends ProxyBase<GuardingData> {
  gameState = GameState.NONE;
  bulletLayout: unknown = null;
  battleView: unknown = null;
  effectLayer: unknown = null;
  buffLayer: unknown = null;
  factions = 1;
  monsters: unknown[] = [];
  equipments: unknown[] = [];
  skillBoxs: unknown[] = [];
  keyboradList: unknown[] = [];
  currStageId = 1;
  bridgeIndex = 0;
  curRoleImgsrc = 'pic_plant10';
  curBulletImgsrc = 'xiandao_1';
  bulletCount = 1;
  attackSpeed = 0.2;
  attackCrit = 0;
  attackSpeedMax = 0.08;
  attackNum = 10;
  playerNode: unknown = null;
  bulletSpeed = 1000;
  bPenetrate = 1;
  selectLevel = 1;
  keyBoradList: unknown[] = [];

  constructor() {
    super(GuardingData);
  }

  refreshData(): void {
    this.curRoleImgsrc = 'juese_1';
    this.curBulletImgsrc = 'xiandao_1';
    this.bPenetrate = 1;
    this.attackNum = 10;
    this.attackCrit = 0;
    this.attackSpeed = 0.2;
    this.bulletCount = 1;
    this.currStageId = 1;
    this.bridgeIndex = 0;
  }

  get GuardingData(): GuardingData {
    return this._data;
  }

  saveData(): void {
    DataManager.instance.writeGameDataBase(ProxyKey.GuardingData, this.GuardingData);
  }
}

export const guardingDataProxy = new GuardingDataProxy();
