/** 本地存档结构（原 GameSave.js） */

import { GBaseData } from './GBaseData';

export class GameSave extends GBaseData {
  playerID = '';
  playerName = '';
  userCode = '';
  lifeTime = 0;
  lastLoginTime = 0;
  gold = 0;
  power = 0;
  myItemMap = new Map<string, unknown>();
  myEquipMap = new Map<string, unknown>();
  myRoleMap = new Map<string, unknown>();
  customData: Record<string, unknown> = {};
  autoRefreshData: Record<string, unknown> = {};
}
