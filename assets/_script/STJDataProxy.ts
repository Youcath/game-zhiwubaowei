/** 砸罐玩法（原 STJDataProxy.js） */

import { DataManager } from './DataManager';
import { GameState } from './GameEnum';
import { ProxyBase, ProxyKey } from './ProxyBase';

export class STJData {
  reliveCnt = 1;
  hurtMulti = 1;
  btnStartTime = 0;
  unlockLevels = [1];
  unlocklookAd: Record<string, unknown> = {};
  stageLoseNum: Record<string, number> = {};
}

export enum STJDataEvent {
  WOOD_UPDATE = 'WOOD_UPDATE',
  WOOD_ADD = 'WOOD_ADD',
  Eenter_STJ_GAME = 'Eenter_STJ_GAME',
  CHECK_GAME_END = 'CHECK_GAME_END',
}

export default class STJDataProxy extends ProxyBase<STJData> {
  gameState = GameState.NONE;
  gridLayer: unknown = null;
  battleView: unknown = null;
  bulletLayer: unknown = null;
  effectLayer: unknown = null;
  keyboradList: unknown[] = [];
  selectStageId = 1;
  soldiers: unknown[] = [];
  enemySoldiers: unknown[] = [];
  curWood = 0;
  speedAtkBuff = 1;
  stagetAddBuff = 1;
  stagetJianBuff = 0;
  jarStates = new Map<string, string>();

  constructor() {
    super(STJData);
  }

  resetData(): void {
    this.curWood = 0;
    this.soldiers = [];
    this.enemySoldiers = [];
    this.jarStates.clear();
    this.speedAtkBuff = 1;
  }

  isJarIntact(t: string): boolean {
    return this.jarStates.get(t) !== 'broken' && this.jarStates.get(t) !== 'defender';
  }

  isJarfanzhi(t: string): boolean {
    return this.jarStates.get(t) !== 'broken';
  }

  get STJData(): STJData {
    return this._data;
  }

  saveData(): void {
    DataManager.instance.writeGameDataBase(ProxyKey.STJData, this.STJData);
  }
}

export const sTJDataProxy = new STJDataProxy();
