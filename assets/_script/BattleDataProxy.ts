/**
 * 战斗运行时数据代理（原 BattleDataProxy.js 子集 + HomeBattleView 所需字段）。
 * 全量战斗逻辑待后续从 2.x 迁完。
 */

import { Node, Sprite, SpriteFrame } from 'cc';
import { GameState, WeatherType } from './GameEnum';
import { DataManager } from './DataManager';
import { Bundles } from './HomeEnum';
import { HttpRequest } from './HttpRequest';
import { ProxyBase } from './ProxyBase';
import { ResUtil } from './ResUtil';
import { SqlUtil } from './SqlUtil';
import { userDataProxy } from './UserDataProxy';

/** 与 2.x BattleDataProxy.EBattleEvent 一致，供 Home / 教程等派发 */
export namespace EBattleEvent {
  export const LOSE_COURSE_VIEW = 'LOSE_COURSE_VIEW';
  export const RESURGENCE = 'RESURGENCE';
}

/** 关卡奖励表行（与 HomeBattleView / datastagereward 一致） */
export interface StageRewardCfgRow {
  id?: number;
  winReward?: string;
  wave?: string;
  stone?: string;
  [key: string]: unknown;
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
  /** 阳光数字等 UI 根节点（战斗内赋值，供 AnimationMgr 飞图标终点） */
  sunshineRoot: Node | null = null;
  private _gameState = GameState.NONE;

  isGameLose = false;
  isEndless = false;
  weatherType = WeatherType.NONE;
  /** 是否已进入战斗流程（2.x 同名字段） */
  isStartFight = false;
  /** 无尽当前波次（2.x 同名字段） */
  endlessCurWave = 1;
  /** 无尽模式剩余选技能次数相关（2.x endlessSelectSkillNum，选技能弹窗用） */
  endlessSelectSkillNum = 3;

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

  /** 2.x 为空实现，clearData 会调用 */
  saveData(_s?: string): void {
    void _s;
  }

  /**
   * 当前章节关卡奖励配置（原 getStageRewardCfg）。
   */
  getStageRewardCfg(chapter?: number): StageRewardCfgRow {
    let t = chapter ?? userDataProxy.userData.curChapter;
    if (t < 1) t = 1;
    const map = DataManager.instance.eData.datastagereward as Record<string, StageRewardCfgRow>;
    let row = map[String(t)];
    if (row == null) {
      const keys = Object.keys(map);
      const last = keys[keys.length - 1];
      if (last != null) row = map[last]!;
    }
    return row ?? {};
  }

  /**
   * 上传无尽成绩（原 uploadEndlessResult）。
   */
  uploadEndlessResult(cb?: (ok: boolean) => void): void {
    let key = 'endless';
    if (DataManager.instance.getIsZbRank()) key = 'endlessZB';
    const maxW = userDataProxy.userData.endlessData.maxWave;
    if (this.endlessCurWave > maxW) {
      userDataProxy.userData.endlessData.maxWave = maxW;
    }
    const body = {
      key,
      sort: 0,
      value: this.endlessCurWave,
    };
    const payload = JSON.stringify({
      params: HttpRequest.inst.encryptStr(JSON.stringify(body)),
    });
    HttpRequest.inst
      .request('POST', '/rank/update', payload)
      .then((e) => {
        console.log('上传成绩成功:', e);
        cb?.(true);
      })
      .catch((e) => {
        console.error('上传成绩失败：', e);
        cb?.(false);
      });
  }

  /**
   * 拉取无尽排行榜（原 getEndlessRankDatas）。
   */
  getEndlessRankDatas(cb?: (e: unknown) => void): void {
    let key = 'endless';
    if (DataManager.instance.getIsZbRank()) key = 'endlessZB';
    const payload = JSON.stringify({
      params: HttpRequest.inst.encryptStr(JSON.stringify({ key })),
    });
    HttpRequest.inst
      .request('POST', '/rank/list', payload)
      .then((e) => {
        cb?.(e);
        const code = (e as { code?: number })?.code;
        if (code === 200) {
          const myRank = (e as { data?: { myRank?: { rank?: number } } })?.data?.myRank;
          if (myRank?.rank != null) {
            userDataProxy.userData.endlessData.myRank = myRank.rank;
          }
        }
      })
      .catch((t) => {
        console.error('获取排行榜失败：', t);
      });
  }

  /**
   * 视频/道具图标（原 setVideoCardIcon）：有道具 4 时用 icon_4，否则用广告图 pic_AD_{index}。
   */
  setVideoCardIcon(iconNode: Node | null, adPicIndex = 1, baseScale = 1): void {
    if (iconNode == null) return;
    const hasItem = userDataProxy.getProp(4) > 0;
    let scale = baseScale;
    let path: string;
    if (hasItem) {
      path = 'textures/item/icon_4';
      scale = 0.5 * baseScale;
    } else {
      path = `textures/public/pic_AD_${adPicIndex}`;
    }
    ResUtil.loadAsset({
      path,
      type: SpriteFrame,
      bundleName: Bundles.GAME,
    })
      .then((sf) => {
        if (!iconNode.isValid) return;
        const sp = iconNode.getComponent(Sprite);
        if (sp != null) sp.spriteFrame = sf as SpriteFrame;
        iconNode.setScale(scale, scale, 1);
      })
      .catch((e) => console.log('error:', e));
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

  /** Home 进关前清理（对齐 2.x clearData 主流程；战斗专有节点数组等仍待全量迁） */
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
    this.isStartFight = false;
    this.endlessCurWave = 1;
    this.endlessSelectSkillNum = 3;
    this.weatherType = WeatherType.NONE;
    this.saveBattlePlantData('');
    this.saveData('');
  }
}

export const battleDataProxy = new BattleDataProxy();
