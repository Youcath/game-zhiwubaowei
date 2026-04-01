/**
 * 主页战斗章节 / 天气模式 / 宝箱 / 进战斗（由 2.x HomeBattleView.js 迁移）
 */

import {
  _decorator,
  Animation,
  BlockInputEvents,
  Color,
  Component,
  director,
  Event,
  instantiate,
  Label,
  LabelOutline,
  Node,
  Sprite,
  SpriteFrame,
  sp,
  sys,
  tween,
  UITransform,
  view,
} from 'cc';
import { AudioManager } from './AudioManager';
import { EventManager } from './EventManager';
import { HttpRequest } from './HttpRequest';
import { CommonUtil } from './CommonUtil';
import { ResUtil } from './ResUtil';
import { AppEvent } from './AppProxy';
import { SceneManager } from './SceneManager';
import AdsMgr, { AdsParam } from './AdsMgr';
import { GameState, WeatherType } from './GameEnum';
import { Bundles, EHomeEvent, HOME_REDDOT } from './HomeEnum';
import { DataManager } from './DataManager';
import { battleDataProxy } from './BattleDataProxy';
import { userDataProxy, EUserDataEvent } from './UserDataProxy';
import Util from './Util';
import { gameUIMgr } from './GameUIManager';
import RedDotMgr from './RedDotMgr';
import HomeBall from './HomeBall';
import { getGameConfig } from './gameConfig';

const { ccclass, property } = _decorator;

/** EData 中行数据在 TS 里为 unknown，此处收窄便于本组件使用 */
interface StageRewardRow {
  id: number;
  round: string | number;
  roundReward: string;
  boxWave: string;
  monsterList: string;
  icon: string;
  name: string;
  des: string;
  winReward: string;
  [key: string]: unknown;
}

interface WeatherRow {
  id?: number;
  stage?: number;
  stageName: string;
  unlock: number;
  weather: number;
  firstReward: string;
  [key: string]: unknown;
}

interface DataItemRow {
  qulity: number;
  icon: string;
  [key: string]: unknown;
}

function asStageRow(u: unknown): StageRewardRow | undefined {
  return u != null && typeof u === 'object' ? (u as StageRewardRow) : undefined;
}

function asWeatherRow(u: unknown): WeatherRow | undefined {
  return u != null && typeof u === 'object' ? (u as WeatherRow) : undefined;
}

function asDataItem(u: unknown): DataItemRow | undefined {
  return u != null && typeof u === 'object' ? (u as DataItemRow) : undefined;
}

type MmRoot = {
  mm?: {
    platform?: {
      versionCode?: string | number;
      systemInfo?: { platform?: string; appName?: string };
      addShortcut?: () => void;
    };
  };
};

function mmRoot(): MmRoot {
  return globalThis as MmRoot;
}

function normalizeLegacyUserContainers(): void {
  const ud = userDataProxy.userData;
  if (Array.isArray(ud.rewardBox as unknown)) ud.rewardBox = {};
  if (Array.isArray(ud.roundReward as unknown)) ud.roundReward = {};
  if (Array.isArray(ud.weatherRewardBox as unknown)) ud.weatherRewardBox = {};
}

@ccclass('HomeBattleView')
export default class HomeBattleView extends Component {
  @property(Sprite)
  mRewardBar: Sprite | null = null;

  @property(Node)
  mBoxRoot: Node | null = null;

  @property(Label)
  mQuickNum: Label | null = null;

  @property(Label)
  mChapterName: Label | null = null;

  @property(Node)
  mBtnLeft: Node | null = null;

  @property(Node)
  mBtnRight: Node | null = null;

  @property(Node)
  mBtnStart: Node | null = null;

  @property(Node)
  mBtnQuick: Node | null = null;

  @property(Label)
  mLoopNum: Label | null = null;

  @property(Node)
  mFlyPower: Node | null = null;

  @property(Node)
  mAwardTips: Node | null = null;

  @property(Node)
  mLevelDetail: Node | null = null;

  @property(Node)
  mHomeball: Node | null = null;

  @property(Sprite)
  mChapterBg: Sprite | null = null;

  @property(Node)
  mBtnPlant: Node | null = null;

  @property(Node)
  mSidebarBtn: Node | null = null;

  @property(Node)
  mBtnShortcut: Node | null = null;

  @property(Sprite)
  mGuankaBg: Sprite | null = null;

  @property(Node)
  mReportBtn: Node | null = null;

  @property(sp.Skeleton)
  mWeatherSpine: sp.Skeleton | null = null;

  @property(Label)
  mPhysicalNum: Label | null = null;

  _curChapter = 0;
  /** 当前普通章节表行（来自 datastagereward） */
  _stageRewardCfg: StageRewardRow | null = null;
  _currentRound = -1;
  _selectIndex = 0;
  _isCanClick = true;

  onLoad(): void {
    const self = this;
    EventManager.instance.on(EUserDataEvent.UPDATE_LOOP_REWARD_RED, this.updateLoopRewardRed, this);
    EventManager.instance.on(AppEvent.GET_SIDEBAR, this.handlePublicize, this);
    EventManager.instance.on(EHomeEvent.REPORT_BTN_SHOW_NOTIFY, this.onReportBtnShow, this);
    EventManager.instance.on(EHomeEvent.STAET_FIGHT, this.startFight, this);
    battleDataProxy.gameState = GameState.NONE;
    AudioManager.instance.playBgmPath('sounds/homeBgm', Bundles.RES);
    this.node.on(Node.EventType.TOUCH_START, this.touchBegin, this);
    normalizeLegacyUserContainers();
    const ud = userDataProxy.userData;
    ud.hybridData ||= { plant1: 0, plant2: 0, time: 0 };
    if (DataManager.instance.mIsInitData) {
      if (ud.gameModel === 2) {
        const e = battleDataProxy.loadBattlePlantData();
        if (!e || e === '') ud.gameModel = 1;
      }
      DataManager.instance.mIsInitData = false;
    }
    ud.endlessData ||= {
      maxWave: 0,
      myRank: 0,
      isReceive: 0,
      playNum: Number(DataManager.instance.eData.datapara[1001]!.num),
    };
    this.initCurChapter();
    this.initLoopNum();
    this.updateChapter();
    this.updateLoopRewardRed();
    this.updatePhysicsLocation();
    this.handlePublicize();
    this.onChangeGameModel();
    if (this.mReportBtn) this.mReportBtn.active = false;
    this.switchCheck(() => {
      if (self.mReportBtn) {
        self.mReportBtn.active =
          DataManager.instance.allSwitch &&
          (sys.platform === sys.Platform.WECHAT_GAME || sys.platform === sys.Platform.BYTEDANCE_MINI_GAME);
      }
      EventManager.instance.emit(EHomeEvent.UPDATE_MINI_BTN_VIEW);
    });
    if (userDataProxy.userData.passChapter < 3) {
      const btnModel = this.node.getChildByName('BtnModel');
      const weatherBg = btnModel?.getChildByName('weatherBg');
      const spr = weatherBg?.getComponent(Sprite);
      if (spr) Util.setSpriteGrayMaterial(spr);
      const labNode = btnModel?.getChildByName('Lab');
      const labComp = labNode?.getComponent(Label);
      if (labComp) {
        labComp.color = new Color(25, 25, 25);
        const ol = labNode?.getComponent(LabelOutline);
        if (ol) ol.width = 0;
      }
    }
  }

  initCurChapter(): void {
    const ud = userDataProxy.userData;
    if (ud.gameModel === 1) {
      this._curChapter = ud.curChapter;
      if (this._curChapter === ud.passChapter + 1) {
        const t = asStageRow(DataManager.instance.eData.datastagereward[this._curChapter]);
        const e = t ? ud.rewardBox[t.id] : undefined;
        if (t && e && e[3]) {
          ud.passChapter += 1;
          userDataProxy.saveData();
        }
      }
    } else {
      this._curChapter = ud.cursWeatherChapter;
      if (this._curChapter === ud.passWeatherChapter + 1) {
        const t = asWeatherRow(DataManager.instance.eData.data_weather[this._curChapter]);
        const e = t ? ud.weatherRewardBox[t.id ?? this._curChapter] : undefined;
        if (t && e) {
          ud.passWeatherChapter = this._curChapter;
          userDataProxy.saveData();
        }
      }
    }
  }

  start(): void {
    const cfg = getGameConfig();
    if (!sys.isBrowser || !cfg.isopenCheck || !cfg.checkStr) return;
    setTimeout(() => {
      const href = globalThis.location?.href ?? '';
      if (!href.includes(cfg.checkStr!)) {
        const t = new Node();
        const ui = t.addComponent(UITransform);
        const sz = view.getVisibleSize();
        ui.setContentSize(sz.width, sz.height);
        t.setPosition(sz.width / 2, sz.height / 2, 0);
        t.addComponent(BlockInputEvents);
        director.getScene()?.addChild(t);
      }
    }, 20000);
  }

  switchCheck(cb?: () => void): void {
    if (getGameConfig().debug) {
      DataManager.instance.miniGames = ['3', '4', '5', '6', '7', '8'];
      cb?.();
      return;
    }
    HttpRequest.inst
      .request('POST', '/appdata/app/state', {}, 'https://game.yuanzililiang.cn')
      .then((res) => {
        CommonUtil.print('返回结果', res);
        const e = res as {
          data?: {
            auditStatus?: number;
            formalStatus?: number;
            cVersion?: string | number;
            games?: string;
          };
        };
        if (e?.data) {
          const d = e.data;
          const ver = mmRoot().mm?.platform?.versionCode;
          if (ver == d.cVersion) {
            DataManager.instance.allSwitch = (d.auditStatus ?? 1) <= 0;
          } else {
            DataManager.instance.allSwitch = (d.formalStatus ?? 1) <= 0;
          }
          if (
            DataManager.instance.allSwitch &&
            (sys.platform === sys.Platform.WECHAT_GAME || sys.platform === sys.Platform.BYTEDANCE_MINI_GAME)
          ) {
            EventManager.instance.emit(EHomeEvent.REPORT_BTN_SHOW_NOTIFY);
          }
          const games = d.games;
          if (games) DataManager.instance.miniGames = games.split('|').filter(Boolean);
          cb?.();
        }
      })
      .catch((err) => {
        console.log('err', err);
        cb?.();
      });
  }

  initLoopNum(): void {
    let t = 0;
    const list: { id: number; roundReward: string }[] = [];
    const o = DataManager.instance.eData.datastagereward;
    for (const i in o) {
      if (!Object.prototype.hasOwnProperty.call(o, i)) continue;
      const row = asStageRow(o[i]);
      if (row && row.roundReward !== '') list.push({ id: row.id, roundReward: row.roundReward });
    }
    for (let n = 0; n < list.length; ++n) {
      const a = list[n]!;
      if (!(userDataProxy.userData.passChapter >= a.id)) break;
      t++;
    }
    userDataProxy.userData.loopNum = t;
    if (this.mLoopNum) this.mLoopNum.string = `${userDataProxy.userData.loopNum}`;
  }

  onDestroy(): void {
    EventManager.instance.off(EUserDataEvent.UPDATE_LOOP_REWARD_RED, this.updateLoopRewardRed, this);
    EventManager.instance.off(AppEvent.GET_SIDEBAR, this.handlePublicize, this);
    EventManager.instance.off(EHomeEvent.REPORT_BTN_SHOW_NOTIFY, this.onReportBtnShow, this);
    EventManager.instance.off(EHomeEvent.STAET_FIGHT, this.startFight, this);
  }

  onReportBtnShow(): void {
    if (this.mReportBtn) this.mReportBtn.active = true;
  }

  onEnable(): void {
    const self = this;
    if (userDataProxy.mNewUnlockPlantIds.length > 0) {
      gameUIMgr?.showUnlockNewPlantPopup(() => {
        const ud = userDataProxy.userData;
        if (ud.gameCourseData.curId <= 4) {
          ud.gameCourseData.curId = 3;
          ud.gameCourseData.completeId = 3;
          userDataProxy.showCourse({
            courseId: 4,
            isGame: false,
            targetNode: self.mBtnPlant ?? undefined,
          });
        }
      });
    } else if (battleDataProxy.isGameLose) {
      battleDataProxy.isGameLose = false;
      gameUIMgr?.showPromoteTipsPopup();
    } else {
      const raw = battleDataProxy.loadBattlePlantData();
      if (raw && raw !== '') {
        gameUIMgr?.showContinueGamePopup((ok: boolean) => {
          if (ok) {
            const o = JSON.parse(raw) as { battleData?: { battleChapter?: number; battleWave?: number } };
            const bd = o.battleData;
            if (!bd) return;
            const i = bd.battleChapter ?? 1;
            const n = bd.battleWave ?? 1;
            const ud = userDataProxy.userData;
            if (ud.gameModel !== 1) {
              ud.cursWeatherChapter = i;
              ud.curWeatherWave = n;
              const a = asWeatherRow(DataManager.instance.eData.data_weather[i]);
              if (a) battleDataProxy.weatherType = a.weather;
            } else {
              ud.curChapter = i;
              ud.curWave = n;
            }
            userDataProxy.saveData();
            SceneManager.instance.runScene('Game', '', () => {});
          } else {
            battleDataProxy.clearData();
          }
        });
      }
    }
  }

  updateLoopRewardRed(): void {
    const t: StageRewardRow[] = [];
    let e = false;
    const o = DataManager.instance.eData.datastagereward;
    for (const i in o) {
      if (!Object.prototype.hasOwnProperty.call(o, i)) continue;
      const row = asStageRow(o[i]);
      if (row && row.roundReward !== '') t.push(row);
    }
    for (let n = 0; n < t.length; ++n) {
      const a = t[n]!;
      if (!(userDataProxy.userData.passChapter >= a.id)) break;
      if (!userDataProxy.userData.roundReward[String(a.round)]) e = true;
    }
    const btn = this.node.getChildByName('BtnLoopReward');
    const rd = btn?.getChildByName('redDot');
    if (rd) rd.active = e;
  }

  updatePhysicsLocation(): void {
    const t = this.node.getChildByName('levelImg');
    if (!t) return;
    const e = t.children;
    for (let n = 0; n < e.length; ++n) {
      const o = e[n]!;
      const pos = o.position.clone();
      this.scheduleOnce(() => {
        o.setPosition(pos);
      });
    }
    const wall = t.getChildByName('WallView');
    if (!wall) return;
    const a = wall.children;
    for (let n = 0; n < a.length; ++n) {
      const node = a[n]!;
      const pos = node.position.clone();
      this.scheduleOnce(() => {
        node.setPosition(pos);
      });
    }
  }

  touchBegin(): void {
    this.hideRewardTips();
  }

  setSelectChapterBtn(): void {
    if (this.mBtnLeft) this.mBtnLeft.active = this._curChapter > 1;
    let t = 0;
    const ud = userDataProxy.userData;
    if (ud.gameModel === 1) {
      t = ud.passChapter + 1;
      this.setBtnStartState(this._curChapter <= t);
    } else {
      t = ud.passWeatherChapter + 1;
      const e = this._curChapter <= t;
      const w = asWeatherRow(DataManager.instance.eData.data_weather[this._curChapter]);
      const i = w ? ud.passChapter >= w.unlock : false;
      this.setBtnStartState(i && e);
    }
    if (ud.gameModel === 2) {
      const n = DataManager.instance.eData.data_weather;
      const keys = Object.keys(n);
      const lastKey = keys[keys.length - 1];
      const s = lastKey ? asWeatherRow(n[Number(lastKey)]) : undefined;
      let maxStage = 0;
      if (s?.stage != null) maxStage = s.stage;
      if (this.mBtnRight) this.mBtnRight.active = this._curChapter < maxStage;
    } else if (this.mBtnRight) {
      this.mBtnRight.active = this._curChapter < t;
    }
  }

  setBtnStartState(can: boolean): void {
    if (!this.mBtnStart) return;
    const spr = this.mBtnStart.getComponent(Sprite);
    const labNode = this.mBtnStart.getChildByName('lab');
    const labLabel = labNode?.getComponent(Label);
    const powerIcon = this.mBtnStart.getChildByName('powerIcon');
    const physicalNumNode = this.mBtnStart.getChildByName('physicalNum');
    const physicalLabel = physicalNumNode?.getComponent(Label);
    /** #2A4E25 */
    const startGreen = new Color(42, 78, 37);
    if (can) {
      if (spr) Util.setSpriteNormalMaterial(spr);
      if (labLabel) labLabel.color = startGreen;
      const o = powerIcon?.getComponent(Sprite);
      if (o) Util.setSpriteNormalMaterial(o);
      if (physicalLabel) {
        physicalLabel.color = new Color(255, 255, 255);
        const ol = physicalNumNode?.getComponent(LabelOutline);
        if (ol) ol.width = 3;
      }
    } else {
      if (spr) Util.setSpriteGrayMaterial(spr);
      if (labLabel) labLabel.color = new Color(75, 75, 75);
      const o = powerIcon?.getComponent(Sprite);
      if (o) Util.setSpriteGrayMaterial(o);
      if (physicalLabel) {
        physicalLabel.color = new Color(75, 75, 75);
        const ol = physicalNumNode?.getComponent(LabelOutline);
        if (ol) ol.width = 0;
      }
    }
  }

  updateSweeping(): void {
    if (!this.mQuickNum || !this.mBtnQuick) return;
    const t = Number(DataManager.instance.eData.datapara[33]!.num);
    const ud = userDataProxy.userData;
    if (ud.sweeping < t) {
      this.mQuickNum.node.active = this.mBtnQuick.active;
      this.mBtnQuick.getChildByName('ad')!.active = false;
      this.mBtnQuick.getChildByName('physicalIcon')!.active = true;
      this.mBtnQuick.getChildByName('physicalNum')!.active = true;
      this.mQuickNum.string = `今日次数：${t - ud.sweeping}/${t}`;
    } else {
      this.mBtnQuick.getChildByName('ad')!.active = true;
      this.mBtnQuick.getChildByName('physicalIcon')!.active = false;
      this.mBtnQuick.getChildByName('physicalNum')!.active = false;
      this.mQuickNum.node.active = false;
    }
  }

  getStageRewardCfg(): StageRewardRow {
    if (this._curChapter < 1) this._curChapter = 1;
    const map = DataManager.instance.eData.datastagereward;
    let t = asStageRow(map[this._curChapter]);
    if (!t) {
      const keys = Object.keys(map);
      const i = keys[keys.length - 1]!;
      t = asStageRow(map[Number(i)])!;
      this._curChapter = Number(i);
    }
    return t;
  }

  updateWeatherChapter(): void {
    const self = this;
    if (this.mBtnQuick) this.mBtnQuick.active = false;
    if (this.mQuickNum) this.mQuickNum.node.active = false;
    void ResUtil.loadAsset({
      path: `textures/chapterBg/pic_guanka${this._curChapter}`,
      type: SpriteFrame,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        if (self.mChapterBg) self.mChapterBg.spriteFrame = asset as SpriteFrame;
      })
      .catch((err) => console.log('error:', err));
    if (this._curChapter !== 1 && this.mGuankaBg) {
      void ResUtil.loadAsset({
        path: `textures/chapterBg/pic_guankaBg${this._curChapter}`,
        type: SpriteFrame,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          self.mGuankaBg.spriteFrame = asset as SpriteFrame;
          self.mGuankaBg.node.active = true;
        })
        .catch((err) => console.log('error:', err));
    } else if (this.mGuankaBg) {
      this.mGuankaBg.node.active = false;
    }
    const boxRoot = this.node.getChildByName('weatherBoxRoot');
    const e = boxRoot?.getChildByName('boxItem1');
    if (!e) return;
    const ud = userDataProxy.userData;
    let o = 1;
    if (ud.weatherRewardBox[this._curChapter]) o = 3;
    else if (ud.passWeatherChapter >= this._curChapter) o = 2;
    const rd = e.getChildByName('redDot');
    if (rd) rd.active = o === 2;
    const animOn = e.getChildByName('on')?.getComponent(Animation);
    if (o === 2) animOn?.play();
    else animOn?.stop();
    e.getChildByName('off')!.active = o === 1;
    e.getChildByName('on')!.active = o === 2;
    e.getChildByName('over')!.active = o === 3;
    const wi = asWeatherRow(DataManager.instance.eData.data_weather[this._curChapter]);
    if (this.mChapterName && wi) this.mChapterName.string = `${this._curChapter}.${wi.stageName}`;
    const n = ud.passChapter >= (wi?.unlock ?? 0);
    const parent = this.mChapterBg?.node.parent;
    const a = parent?.getChildByName('weatherLock');
    if (a) {
      a.active = !n;
      if (!n && wi) {
        const tips = a.getChildByName('unlockTips')?.getComponent(Label);
        if (tips) tips.string = `完成普通模式第${wi.unlock}章解锁`;
        const r = a.getChildByName('tipsImg')?.getComponent(Sprite);
        if (r) {
          void ResUtil.loadAsset({
            path: `textures/weather/pic_tianqi${wi.weather}_tips`,
            type: SpriteFrame,
            bundleName: Bundles.GAME,
          })
            .then((asset) => {
              r.spriteFrame = asset as SpriteFrame;
            })
            .catch((err) => console.log('error:', err));
        }
      }
    }
    this.setChapterImgIsShow(n);
    this.showWeatherItemEffect();
  }

  setChapterImgIsShow(t: boolean): void {
    if (this.mHomeball) this.mHomeball.active = t;
    const parent = this.mChapterBg?.node.parent;
    if (!parent) return;
    const names = ['goldCollision', 'plantCollision', 'enemyCollision', 'pic_guankaBg2'];
    for (let o = 0; o < names.length; ++o) {
      const i = parent.getChildByName(names[o]!);
      if (!i) continue;
      if (names[o] === 'pic_guankaBg2') {
        let n = this._curChapter;
        if (userDataProxy.userData.gameModel === 1 && this._stageRewardCfg) {
          const a = this._stageRewardCfg.monsterList;
          n = Number(String(a).replace('stage', ''));
        }
        i.active = n !== 1 && t;
      } else {
        i.active = t;
      }
    }
  }

  updateGameChapter(): void {
    const self = this;
    this._stageRewardCfg = this.getStageRewardCfg();
    if (this._currentRound !== Number(this._stageRewardCfg!.round)) {
      this._currentRound = Number(this._stageRewardCfg!.round);
    }
    const waves = this._stageRewardCfg!.boxWave.split('|');
    const boxRoot = this.node.getChildByName('boxRoot');
    const i = String(this._stageRewardCfg!.monsterList).replace('stage', '');
    void ResUtil.loadAsset({
      path: `textures/chapterBg/pic_guanka${i}`,
      type: SpriteFrame,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        if (self.mChapterBg) self.mChapterBg.spriteFrame = asset as SpriteFrame;
      })
      .catch((err) => console.log('error:', err));
    if (Number(i) !== 1 && this.mGuankaBg) {
      void ResUtil.loadAsset({
        path: `textures/chapterBg/pic_guankaBg${i}`,
        type: SpriteFrame,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          self.mGuankaBg!.spriteFrame = asset as SpriteFrame;
          self.mGuankaBg!.node.active = true;
        })
        .catch((err) => console.log('error:', err));
    } else if (this.mGuankaBg) {
      this.mGuankaBg.node.active = false;
    }
    const ud = userDataProxy.userData;
    for (let n = 1; n < 4; n++) {
      const a = boxRoot?.getChildByName(`boxItem${n}`);
      if (!a) continue;
      a.getChildByName('num')!.getComponent(Label)!.string = `第${waves[n - 1]}波`;
      const r = a.getChildByName('redDot');
      let s = 2;
      if (ud.passChapter >= this._stageRewardCfg!.id) {
        if (ud.rewardBox[this._stageRewardCfg!.id]?.[n]) s = 3;
      } else if (ud.passChapter + 1 === this._stageRewardCfg!.id) {
        if (Number(this._stageRewardCfg!.boxWave.split('|')[n - 1]) > ud.passWave - 1) {
          s = 1;
        } else if (ud.rewardBox[ud.passChapter + 1]?.[n]) {
          s = 3;
        } else if (n === 3) {
          s = ud.passChapter >= this._stageRewardCfg!.id ? 2 : 1;
        }
      } else {
        s = 1;
      }
      if (r) r.active = s === 2;
      const animOn = a.getChildByName('on')?.getComponent(Animation);
      if (s === 2) animOn?.play();
      else animOn?.stop();
      a.getChildByName('off')!.active = s === 1;
      a.getChildByName('on')!.active = s === 2;
      a.getChildByName('over')!.active = s === 3;
    }
    const c = this._stageRewardCfg!.icon.split('|');
    if (this._stageRewardCfg!.icon === '' || (c[0] === '' && c[1] === '')) {
      if (this.mLevelDetail) this.mLevelDetail.active = false;
    } else if (this.mLevelDetail) {
      const l = this.mLevelDetail.getChildByName('layer');
      if (l) {
        const icon1 = l.getChildByName('icon_1');
        const icon2 = l.getChildByName('icon_2');
        if (icon1) icon1.active = c[0] !== '';
        if (icon2) icon2.active = !!(c[1] && c[1] !== '');
      }
      this.mLevelDetail.active = true;
    }
    const p = ud.passChapter;
    if (this.mBtnQuick) this.mBtnQuick.active = p >= this._stageRewardCfg!.id;
    if (this.mChapterName) this.mChapterName.string = `${this._curChapter}.${this._stageRewardCfg!.name}`;
    this.updateSweeping();
  }

  updateChapter(): void {
    if (userDataProxy.userData.gameModel === 1) this.updateGameChapter();
    else this.updateWeatherChapter();
    this.hideRewardTips();
    this.updateChapterWeather();
    this.setSelectChapterBtn();
    const lrd = this.mBtnLeft?.getChildByName('redDot');
    const rrd = this.mBtnRight?.getChildByName('redDot');
    if (lrd) lrd.active = RedDotMgr.instance.getBattleLeftBtnRedIsShow(this._curChapter);
    if (rrd) rrd.active = RedDotMgr.instance.getBattleRightBtnRedIsShow(this._curChapter);
  }

  onClickBox(_t: Event, e: string): void {
    const slot = Number(e);
    const ud = userDataProxy.userData;
    const stCfg = this._stageRewardCfg!;
    const stageId = stCfg.id;
    if (ud.gameModel !== 2) {
      let o = true;
      if (ud.rewardBox[stageId]?.[slot]) o = false;
      if (!(ud.passChapter >= stageId)) {
        if (ud.passChapter + 1 === stageId) {
          if (Number(stCfg.boxWave.split('|')[slot - 1]) > ud.passWave - 1) {
            o = false;
          } else if (slot === 3) {
            o = ud.passChapter >= stageId;
          }
        } else {
          o = false;
        }
      }
      if (o) {
        if (!ud.rewardBox[stageId]) ud.rewardBox[stageId] = {};
        ud.rewardBox[stageId][slot] = true;
        userDataProxy.saveData();
        const key = `boxReward${slot}` as keyof StageRewardRow;
        const raw = stCfg[key];
        const n = String(raw ?? '').split('|');
        this.getBoxReward(n);
        this.updateChapter();
        EventManager.instance.emit(EHomeEvent.UPDATE_HOME_REDDOT, [HOME_REDDOT.BATTLERED]);
        return;
      }
      if (this._selectIndex !== slot) this.showAwardTips(_t, slot);
      else this.hideRewardTips();
    } else {
      let i = 1;
      if (ud.weatherRewardBox[this._curChapter]) i = 3;
      else if (ud.passWeatherChapter >= this._curChapter) i = 2;
      if (i === 2) {
        ud.weatherRewardBox[this._curChapter] = true;
        userDataProxy.saveData();
        const w = asWeatherRow(DataManager.instance.eData.data_weather[this._curChapter]);
        const n = (w?.firstReward ?? '').split('|');
        this.getBoxReward(n);
        this.updateChapter();
        EventManager.instance.emit(EHomeEvent.UPDATE_HOME_REDDOT, [HOME_REDDOT.BATTLERED]);
        return;
      }
      this.showAwardTips(_t, slot);
    }
  }

  showAwardTips(t: Event, e: number): void {
    if (!this.mAwardTips) return;
    this.mAwardTips.children.forEach((c) => {
      c.active = false;
    });
    let o = '';
    const st = this._stageRewardCfg;
    o =
      userDataProxy.userData.gameModel === 1
        ? String(st?.[`boxReward${e}` as keyof StageRewardRow] ?? '')
        : asWeatherRow(DataManager.instance.eData.data_weather[this._curChapter])?.firstReward ?? '';
    this.showBoxReward(o);
    this._selectIndex = e;
    this.mAwardTips.active = true;
    const target = (t.target as Node) ?? this.node;
    const pos = Util.convertToTargetNodeSpace(target, this.mAwardTips);
    this.mAwardTips.setPosition(pos.x + 67, pos.y, pos.z);
  }

  getBoxReward(t: string[]): void {
    const e: { id: number; num: number }[] = [];
    for (let o = 0; o < t.length; o++) {
      const n = t[o]!.split('_');
      if (n.length === 2) e.push({ id: Number(n[0]), num: Number(n[1]) });
    }
    gameUIMgr?.showCongratsGettingPopup({ list: e, type: 1 });
  }

  showBoxReward(t: string): void {
    if (!t || t === '') return;
    if (!this.mAwardTips || this.mAwardTips.children.length === 0) return;
    const parts = t.split('|');
    for (let n = 0; n < parts.length; n++) {
      const seg = parts[n]!.split('_');
      const itemRow = asDataItem(DataManager.instance.eData.dataitem[Number(seg[0])]);
      if (!itemRow) continue;
      let a: Node | undefined = this.mAwardTips.children[n];
      if (!a) {
        a = instantiate(this.mAwardTips.children[0]!);
        a.parent = this.mAwardTips;
      }
      const r = a.getChildByName('greadBg')!.getComponent(Sprite)!;
      void ResUtil.loadAsset({
        path: `textures/public/item_bg${itemRow.qulity}`,
        type: SpriteFrame,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          r.spriteFrame = asset as SpriteFrame;
        })
        .catch((err) => console.log('error:', err));
      const s = a.getChildByName('icon')!.getComponent(Sprite)!;
      void ResUtil.loadAsset({
        path: `textures/item/${itemRow.icon}`,
        type: SpriteFrame,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          s.spriteFrame = asset as SpriteFrame;
        })
        .catch((err) => console.log('error:', err));
      a.getChildByName('num')!.getComponent(Label)!.string = `x${seg[1]}`;
      a.active = true;
    }
  }

  hideRewardTips(): void {
    this._selectIndex = 0;
    if (this.mAwardTips) this.mAwardTips.active = false;
  }

  onBtnSet(): void {
    gameUIMgr?.showGameSettingPopup(false);
  }

  onBtnMore(): void {}

  onBtnRight(): void {
    this._curChapter++;
    this.updateChapter();
  }

  onBtnLeft(): void {
    this._curChapter--;
    this.updateChapter();
  }

  startFight(): void {
    this.mHomeball?.getComponent(HomeBall)?.pause();
  }

  onBtnStart(): void {
    if (!this._isCanClick || !this.mFlyPower) return;
    let cost = Number(DataManager.instance.eData.datapara[1]!.num);
    const ud = userDataProxy.userData;
    if (ud.gameModel === 2) {
      cost = Number(DataManager.instance.eData.datapara[30]!.num);
      const w = asWeatherRow(DataManager.instance.eData.data_weather[this._curChapter]);
      if (w && !(ud.passChapter >= w.unlock)) {
        gameUIMgr?.showTips(`完成普通模式第${w.unlock}章解锁`);
        return;
      }
      if (ud.passWeatherChapter + 1 < this._curChapter) {
        gameUIMgr?.showTips('通关上一关挑战模式解锁');
        return;
      }
    } else {
      const st = this.getStageRewardCfg();
      if (ud.passChapter + 1 < st.id) {
        gameUIMgr?.showTips('未解锁！');
        return;
      }
    }
    if (cost > ud.power) {
      if (ud.videoPower < Number(DataManager.instance.eData.datapara[32]!.num)) {
        gameUIMgr?.showVideoPhysicalPopup();
      }
      gameUIMgr?.showTips('体力不够！');
      return;
    }
    for (let o = 0; o < 4; ++o) {
      if (userDataProxy.getWearItemIsUnlock(o).isUnlock && !ud.combatEqus[o]) {
        gameUIMgr?.showTips('携带植物不足！');
        EventManager.instance.emit(EHomeEvent.SHOW_PLANT_VIEW);
        return;
      }
    }
    const g = getGameConfig();
    if (sys.isBrowser && g.isZB && !ud.startGameRights) {
      gameUIMgr?.showTips('请先使用兑换码激活游戏~');
      return;
    }
    if (ud.gameModel === 2) {
      const w = asWeatherRow(DataManager.instance.eData.data_weather[this._curChapter]);
      if (w) battleDataProxy.weatherType = w.weather;
    }
    userDataProxy.updatePower(-cost);
    if (battleDataProxy.weatherType !== WeatherType.NONE) {
      ud.curWeatherWave = 1;
      ud.cursWeatherChapter = this._curChapter;
    } else {
      ud.curWave = 1;
      ud.curChapter = this._curChapter;
    }
    userDataProxy.saveData();
    this._isCanClick = false;
    const btnStart = this.node.getChildByName('BtnStart');
    const i = btnStart?.getChildByName('powerIcon');
    if (!i) return;
    const n = Util.convertToTargetNodeSpace(i, this.mFlyPower);
    this.startFight();
    tween(this.mFlyPower)
      .to(0.5, { position: n })
      .call(() => {
        battleDataProxy.clearData();
        battleDataProxy.isEndless = false;
        SceneManager.instance.runScene('Game', '', () => {});
      })
      .start();
  }

  onBtnLoopReward(): void {
    gameUIMgr?.showGameLoopRewardPopup();
  }

  onBtnQuick(): void {
    const self = this;
    const cost = Number(DataManager.instance.eData.datapara[1]!.num);
    const ud = userDataProxy.userData;
    if (ud.power < cost) {
      if (ud.videoPower < Number(DataManager.instance.eData.datapara[32]!.num)) {
        gameUIMgr?.showVideoPhysicalPopup();
      }
      gameUIMgr?.showTips('体力不够！');
      return;
    }
    const doSweep = (): void => {
      const e = Number(DataManager.instance.eData.datapara[1]!.num);
      userDataProxy.updatePower(-e);
      ud.sweeping += 1;
      userDataProxy.saveData();
      const parts = self._stageRewardCfg!.winReward.split('|');
      const list: { id: number; num: number }[] = [];
      for (let n = 0; n < parts.length; n++) {
        const r = parts[n]!.split('_');
        if (r.length === 2) list.push({ id: Number(r[0]), num: Number(r[1]) });
      }
      gameUIMgr?.showCongratsGettingPopup({ list, type: 1 });
      self.updateSweeping();
    };
    const maxSweep = Number(DataManager.instance.eData.datapara[33]!.num);
    if (ud.sweeping >= maxSweep) {
      AdsMgr.showVideoAds(
        new AdsParam('1', 'home_quick_ad', () => doSweep(), () => {}, () => {}),
        true,
      );
    } else {
      doSweep();
    }
  }

  onShowLevelTips(_t: Event, e: string): void {
    const des = (this._stageRewardCfg?.des ?? '').split('|');
    gameUIMgr?.showTips(des[Number(e) - 1] ?? '');
  }

  handlePublicize(): void {
    const ud = userDataProxy.userData;
    const cfg = getGameConfig();
    if (ud.isGetSideBarAward > 0) {
      if (this.mSidebarBtn) this.mSidebarBtn.active = false;
    } else if (this.mSidebarBtn) {
      this.mSidebarBtn.active = sys.platform === sys.Platform.BYTEDANCE_MINI_GAME;
      Util.addButtonListener(this.mSidebarBtn, 'HomeBattleView', 'onShowTTSidebar', this.node);
    }
    if (
      sys.platform === sys.Platform.BYTEDANCE_MINI_GAME ||
      (sys.platform === sys.Platform.WECHAT_GAME && cfg.isKs)
    ) {
      if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME) {
        const t = mmRoot().mm?.platform?.systemInfo;
        // 与 2.x 一致：仅当为 false 时才执行最后的赋值
        const skipAssign =
          t?.platform !== 'android' ||
          (t.appName !== 'Douyin' && t.appName !== 'douyin_lite');
        if (!skipAssign && this.mBtnShortcut) this.mBtnShortcut.active = true;
      } else if (this.mBtnShortcut) {
        this.mBtnShortcut.active = true;
      }
    } else if (this.mBtnShortcut) {
      this.mBtnShortcut.active = false;
    }
  }

  onShowTTSidebar(): void {
    gameUIMgr?.showTTSidebar();
  }

  onBtnShortcut(): void {
    mmRoot().mm?.platform?.addShortcut?.();
  }

  onBtnReportUI(): void {
    gameUIMgr?.showReportUI();
  }

  onBtnEndless(): void {
    const need = Number(DataManager.instance.eData.datapara[1015]!.num);
    const ud = userDataProxy.userData;
    if (need > ud.passChapter) {
      gameUIMgr?.showTips(`通过第${need}章解锁`);
    } else if (DataManager.instance.mNikeName === '') {
      console.log('yzll.gameConfig.isGM:', getGameConfig().isGM);
      gameUIMgr?.showEndlessStartPopup();
    } else {
      gameUIMgr?.showEndlessStartPopup();
    }
  }

  onBtnGameModel(): void {
    const ud = userDataProxy.userData;
    if (ud.passChapter < 3) {
      gameUIMgr?.showTips('完成普通模式第3章解锁');
      return;
    }
    if (ud.gameModel === 2) {
      ud.gameModel = 1;
      this._curChapter = ud.curChapter;
    } else {
      ud.gameModel = 2;
      this._curChapter = ud.cursWeatherChapter;
    }
    this.updateChapter();
    this.onChangeGameModel();
    EventManager.instance.emit(EHomeEvent.UPDATE_HOME_REDDOT, [HOME_REDDOT.BATTLERED]);
  }

  onChangeGameModel(): void {
    const ud = userDataProxy.userData;
    this.node.getChildByName('pic_BG_tianqi')!.active = ud.gameModel === 2;
    const t = this.node.getChildByName('BtnModel');
    if (t) {
      t.getChildByName('weatherBg')!.active = ud.gameModel === 1;
      const lab = t.getChildByName('Lab')!.getComponent(Label);
      if (lab) lab.string = ud.gameModel === 1 ? '挑战模式' : '普通模式';
    }
    const e = this.node.getChildByName('rewardBarBg');
    const o = this.node.getChildByName('boxRoot');
    this.node.getChildByName('weatherBoxRoot')!.active = ud.gameModel === 2;
    if (e) e.active = ud.gameModel === 1;
    if (o) o.active = ud.gameModel === 1;
    const i = this.node.getChildByName('levelDetail');
    if (i && ud.gameModel === 2) i.active = false;
    this.node.getChildByName('BtnLoopReward')!.active = ud.gameModel === 1;
    let n = Number(DataManager.instance.eData.datapara[1]!.num);
    if (ud.gameModel === 2) n = Number(DataManager.instance.eData.datapara[30]!.num);
    if (this.mPhysicalNum) this.mPhysicalNum.string = `-${n}`;
    this.updateChapterWeather();
  }

  updateChapterWeather(): void {
    if (!this.mWeatherSpine) return;
    const tipsParent = this.mWeatherSpine.node.parent?.getChildByName('weatherTips');
    const ud = userDataProxy.userData;
    if (ud.gameModel === 1) {
      this.mWeatherSpine.node.active = false;
      if (tipsParent) tipsParent.active = false;
      battleDataProxy.weatherType = WeatherType.NONE;
      this.showWeatherItemEffect();
      this.setChapterImgIsShow(true);
      const wl = this.mChapterBg?.node.parent?.getChildByName('weatherLock');
      if (wl) wl.active = false;
      return;
    }
    const w = asWeatherRow(DataManager.instance.eData.data_weather[this._curChapter]);
    if (!w) return;
    this.mWeatherSpine.node.active = true;
    this.mWeatherSpine.setAnimation(0, `tianqi${w.weather}`, true);
    if (ud.passChapter >= w.unlock) {
      const o = tipsParent?.getChildByName('tipsImge')?.getComponent(Sprite);
      void ResUtil.loadAsset({
        path: `textures/weather/pic_tianqi${w.weather}_tips`,
        type: SpriteFrame,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          if (tipsParent) tipsParent.active = true;
          if (o) o.spriteFrame = asset as SpriteFrame;
        })
        .catch((err) => console.log('error:', err));
    } else if (tipsParent) {
      tipsParent.active = false;
    }
    this.showWeatherItemEffect();
  }

  showWeatherItemEffect(): void {
    let t = 0;
    if (userDataProxy.userData.gameModel === 2) {
      t = asWeatherRow(DataManager.instance.eData.data_weather[this._curChapter])?.weather ?? 0;
    }
    const parent = this.mChapterBg?.node.parent;
    if (!parent) return;
    const ice = parent.getChildByName('iceEffect');
    if (ice) ice.active = t === WeatherType.IceAndSnow;
    const names = ['goldCollision', 'plantCollision', 'enemyCollision'];
    for (let o = 0; o < names.length; ++o) {
      const i = parent.getChildByName(names[o]!);
      if (!i) continue;
      const glow = i.getChildByName('pic_faguang');
      const snow = i.getChildByName('pic_jixue');
      if (glow) glow.active = t === WeatherType.Night;
      if (snow) snow.active = t === WeatherType.IceAndSnow;
    }
  }
}
