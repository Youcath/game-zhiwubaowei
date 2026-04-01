/** 玩家持久化数据结构（原 UserDataProxy.js 内 UserData 构造函数） */

export class UserData {
  newPlayer = true;
  name = '玩家名字';
  gold = 0;
  diamond = 0;
  power = 0;
  manure = 0;
  passChapter = 0;
  curChapter = 1;
  lastLoginTime = 1;
  lastPowerTime = 1;
  isGetSideBarAward = 0;
  sweeping = 0;
  loopNum = 0;
  videoPower = 0;
  passWeatherChapter = 0;
  cursWeatherChapter = 1;
  combatEqus: number[] = [3];
  superEquipId = 0;
  curWave = 1;
  plantLvDatas: unknown[] = [];
  propData: Record<string, number> = {};
  refreshNum = 0;
  dailyData: Record<string, unknown> = {};
  passWave = 0;
  videoDiamondNum = 0;
  videoManureNum = 0;
  curWeatherWave = 0;
  plantDatas: { id: number; lv: number }[] = [];
  startGameRights = false;
  unlockPlantIds: number[] = [];
  versionStr = '';
  gameCourseData = {
    curId: 0,
    completeId: 0,
    isComplete: false,
  };
  hybridData = {
    plant1: 0,
    plant2: 0,
    time: 0,
  };
  gameModel = 1;
  newPropDatas: { propId: number; num: number }[] = [];
  hybridPlantDatas: { plantId: number; lv: number }[] = [];
  wearHybridPlantId = 0;
  boxData?: { cdTime: number; bigState: number; level?: number; exp?: number };
  endlessData?: { maxWave: number; isReceive: number; myRank?: number; playNum: number };
  goldData?: { videoNum: number; mfNum: number };
  /** 关卡宝箱领取状态 [chapter][slot]（2.x 稀疏数组） */
  rewardBox: Record<number, Record<number, boolean>> = {};
  /** 回合奖励 key → 是否已领 */
  roundReward: Record<string, boolean> = {};
  /** 天气关卡奖励 */
  weatherRewardBox: Record<number, boolean> = {};
}
