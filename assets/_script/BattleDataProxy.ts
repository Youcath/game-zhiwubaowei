/**
 * 战斗运行时数据代理（原 BattleDataProxy.js 子集 + HomeBattleView 所需字段）。
 * 全量战斗逻辑待后续从 2.x 迁完。
 */

import { Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import AnimationMgr from './AnimationMgr';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import { GameState, WeatherType } from './GameEnum';
import { Bundles } from './HomeEnum';
import { HttpRequest } from './HttpRequest';
import { ProxyBase } from './ProxyBase';
import { ResUtil } from './ResUtil';
import SkillDataMgr from './SkillDataMgr';
import { SqlUtil } from './SqlUtil';
import { userDataProxy } from './UserDataProxy';

/** 与 2.x BattleDataProxy.EBattleEvent 一致，供 Home / 教程等派发 */
export namespace EBattleEvent {
  export const LOSE_COURSE_VIEW = 'LOSE_COURSE_VIEW';
  export const RESURGENCE = 'RESURGENCE';
  export const GM_ADD_BALL = 'GM_ADD_BALL';
  export const SELECT_SUPER_PLANT = 'SELECT_SUPER_PLANT';
  /** 已选择技能（参数：skillId） */
  export const SELECT_SKILL = 'SELECT_SKILL';
  /** 选技能动效播放完毕（参数：来源节点，可选） */
  export const SELECT_SKILL_FINISH = 'SELECT_SKILL_FINISH';
  export const UPDATE_HOUSE_HP = 'UPDATE_HOUSE_HP';
}

/** 超级植物随机/自选用的已加载帧（2.x `superFrameDatas`） */
export type SuperFrameData = { plantId: number; frame: SpriteFrame };

/** 关卡奖励表行（与 HomeBattleView / datastagereward 一致） */
export interface StageRewardCfgRow {
  id?: number;
  winReward?: string;
  wave?: string;
  stone?: string;
  [key: string]: unknown;
}

/** 配表 `dataskill` 行（选技能、SkillDataMgr 用） */
export interface SkillCfgRow {
  id: number;
  quality: number;
  des?: string;
  icon?: string | number;
  attribute: string;
  use?: number;
  equipId?: number;
  equipLevel?: number;
  Weight?: number;
  frontSkill?: number;
  repeat?: number;
  needTime?: number;
  [key: string]: unknown;
}

/** 与 2.x `new BattleData()` / ProxyManager 一致 */
export class BattleData {
  ownSkillList: { id: number; count: number }[] = [];
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
  /** 战斗场景 UI 根（2.x `battleView`；宝箱阳光飞入等） */
  battleView: Node | null = null;
  /** 战斗相机节点（2.x `gameCamera`；与 `sunshineRoot` 组合算飞行动画终点偏移） */
  gameCamera: Node | null = null;
  /** 当前出战植物的超级形态大图（2.x `loadSuperFrameDatas` 填充） */
  superFrameDatas: SuperFrameData[] = [];
  /** 上一波已选超级植物 id（2.x `topSuperId`，随机最后一波去重；由战斗 UI 写入） */
  topSuperId = 0;
  private _gameState = GameState.NONE;

  isGameLose = false;
  isEndless = false;
  /** 战斗时间缩放（2.x `gameSpeed`，AnimUtils 飞物品等用） */
  gameSpeed = 1;
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
  /**
   * 加载出战植物对应的超级形态展示图（2.x `loadSuperFrameDatas`）。
   */
  loadSuperFrameDatas(cb?: () => void): void {
    this.superFrameDatas.length = 0;
    const equIds = userDataProxy.userData.combatEqus;
    if (equIds.length === 0) {
      cb?.();
      return;
    }
    let finished = 0;
    const done = (): void => {
      finished++;
      if (finished >= equIds.length) cb?.();
    };
    for (let idx = 0; idx < equIds.length; idx++) {
      const plantId = equIds[idx]!;
      void ResUtil.loadAsset({
        path: `textures/superBigImg/pic_CWplant${plantId}`,
        type: SpriteFrame,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          this.superFrameDatas.push({ plantId, frame: asset as SpriteFrame });
        })
        .catch((e) => console.log('error:', e))
        .then(done, done);
    }
  }

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

  getSkillAttribute(skillId: number): number[] {
    const row = DataManager.instance.eData.dataskill[String(skillId)] as { attribute?: string } | undefined;
    return (row?.attribute ?? '').split('_').map(Number);
  }

  /**
   * 更新基地血量（2.x 子集：正数治疗与上限夹紧；负数伤害与游戏结束逻辑待与战斗场景对齐）。
   */
  updateHouseHp(t: { isCirt?: boolean; num: number }): void {
    let num = Math.floor(t.num);
    if (Number.isNaN(num)) num = 1;
    const b = this.battleData;
    b.houseHp += num;
    if (num > 0) {
      if (b.houseHp > b.houseMaxHp) b.houseHp = b.houseMaxHp;
    } else if (b.houseHp < 0) {
      b.houseHp = 0;
    }
    EventManager.instance.emit(EBattleEvent.UPDATE_HOUSE_HP, num);
  }

  checkHasSkill(skillId: number): { skillData: SkillCfgRow; count: number } | null {
    const list = this.battleData.ownSkillList;
    const e = list.find((x) => x.id === skillId);
    if (e == null) return null;
    const o = DataManager.instance.eData.dataskill[String(e.id)] as SkillCfgRow | undefined;
    if (o) {
      return { skillData: o, count: e.count };
    }
    return null;
  }

  /**
   * 当前波可选技能列表（原 `getSkillList`）。
   */
  getSkillList(): SkillCfgRow[] {
    const ud = userDataProxy.userData;
    if (ud.gameCourseData.curId <= 3 && ud.curChapter === 1 && ud.curWave === 1) {
      const ds = DataManager.instance.eData.dataskill;
      return [ds['4001'], ds['5001'], ds['30001']].filter(Boolean) as SkillCfgRow[];
    }
    const t: SkillCfgRow[] = [];
    const e = DataManager.instance.eData.dataskill as Record<string, SkillCfgRow>;
    for (const i in e) {
      const a = e[i]!;
      if (a.id % 1e4 === 5 || a.use !== 1) continue;
      if (a.equipId != null) {
        if (
          userDataProxy.combatEqus.indexOf(a.equipId) > -1 &&
          userDataProxy.getPlantData(a.equipId).lv >= (a.equipLevel ?? 0) &&
          (a.Weight ?? 0) > 0
        ) {
          t.push(a);
        }
      } else {
        t.push(a);
      }
    }
    for (let n = t.length - 1; n >= 0; n--) {
      const a = t[n]!;
      if (a.frontSkill != null && !this.checkHasSkill(a.frontSkill)) {
        t.splice(n, 1);
      }
    }
    for (let n = t.length - 1; n >= 0; n--) {
      const a = t[n]!;
      if (!a.repeat && this.checkHasSkill(a.id)) {
        t.splice(n, 1);
      }
    }
    return t;
  }

  /**
   * 选择技能入账（原 `selectSkill`）。
   */
  selectSkill(skillId: number, effectNode: Node | null): void {
    const list = this.battleData.ownSkillList;
    let idx = list.findIndex((x) => x.id === skillId);
    if (idx === -1) {
      list.push({ id: skillId, count: 1 });
    } else {
      list[idx]!.count++;
    }
    if (skillId === 6001) {
      const r = this.getSkillAttribute(skillId);
      const add = r[1] ?? 0;
      this.battleData.sunshineNum += add;
      const bv = this.battleView;
      const sr = this.sunshineRoot;
      if (effectNode != null && bv != null && sr != null) {
        const world = new Vec3();
        sr.getWorldPosition(world);
        const local = new Vec3();
        bv.getComponent(UITransform)?.convertToNodeSpaceAR(world, local);
        const cam = this.gameCamera;
        const camPos = cam != null ? cam.position.clone() : new Vec3();
        const end = new Vec3();
        Vec3.add(end, local, camPos);
        AnimationMgr.instance.showAwardAni({ id: 8, num: add }, bv, effectNode, 0, end);
      }
    } else if (skillId === 1001 || skillId === 1002 || skillId === 4001) {
      const r = this.getSkillAttribute(skillId);
      const m = this.battleData.houseMaxHp;
      const f = Math.floor(m * (r[1] ?? 0));
      this.battleData.houseMaxHp = m + f;
      this.updateHouseHp({ isCirt: false, num: f });
    }
    SkillDataMgr.instance.pushSkillInfo(skillId);
    EventManager.instance.emit(EBattleEvent.SELECT_SKILL, skillId);
    this.saveData();
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
    this.superFrameDatas.length = 0;
    this.topSuperId = 0;
    SkillDataMgr.instance.removeSkillInfo();
    this.saveBattlePlantData('');
    this.saveData('');
  }
}

export const battleDataProxy = new BattleDataProxy();
