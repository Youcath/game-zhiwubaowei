/**
 * 主界面场景（原 HomeScene.js）：底栏切换战斗/商店/植物/杂交、资源条、体力恢复、红点挂载。
 */

import {
  _decorator,
  Event,
  instantiate,
  Label,
  Node,
  Prefab,
  Sprite,
  sys,
} from 'cc';
import AdsMgr, { AdsParam } from './AdsMgr';
import { EGameEvent } from './GameEnum';
import { Bundles, EHomeEvent, HOME_REDDOT } from './HomeEnum';
import { DataManager } from './DataManager';
import { battleDataProxy, EBattleEvent } from './BattleDataProxy';
import { userDataProxy, EUserDataEvent } from './UserDataProxy';
import Util from './Util';
import { gameUIMgr } from './GameUIManager';
import RedDotMgr from './RedDotMgr';
import { EventManager } from './EventManager';
import { MathUtil } from './MathUtil';
import { TimeUtil } from './TimeUtil';
import { ResUtil } from './ResUtil';
import { PopupManager } from './PopupManager';
import { SceneBase } from './SceneBase';
import { getGameConfig } from './gameConfig';

const { ccclass, property } = _decorator;

function paraNum(id: number): number {
  return Number(DataManager.instance.eData.datapara[String(id)]?.num ?? 0);
}

@ccclass('HomeScene')
export default class HomeScene extends SceneBase {
  @property(Label)
  mGoldNum: Label | null = null;

  @property(Label)
  mDiamondNum: Label | null = null;

  @property(Label)
  mPhysicalNum: Label | null = null;

  @property(Label)
  mPowerTime: Label | null = null;

  @property(Node)
  mNowBtn: Node | null = null;

  @property(Node)
  mBattleView: Node | null = null;

  @property(Node)
  mGoldRoot: Node | null = null;

  @property(Node)
  mDiamondRoot: Node | null = null;

  @property(Node)
  mPhysicalRoot: Node | null = null;

  @property(Node)
  mManureRoot: Node | null = null;

  @property(Label)
  mManureNum: Label | null = null;

  /** 动态加载，无 @property */
  mPlantView: Node | null = null;
  mShopView: Node | null = null;
  mHybridView: Node | null = null;

  private _maxPower = 0;
  private _powerCd = 0;
  private _isCanClick = true;

  onLoad(): void {
    super.onLoad();
    EventManager.instance.on(EUserDataEvent.POWER_UPDATE, this.updatePhysical, this);
    EventManager.instance.on(EUserDataEvent.GOLD_UPDATE, this.updateGold, this);
    EventManager.instance.on(EUserDataEvent.DIAMOD_UPDATE, this.updateDiamond, this);
    EventManager.instance.on(EUserDataEvent.MANURE_UPDATE, this.updateManure, this);
    EventManager.instance.on(EGameEvent.OPEN_HOME_VIEW, this.onOpenHomeView, this);
    EventManager.instance.on(EHomeEvent.SHOW_VIDEO_DIAMOMND_POPUP, this.showVideoDiamondPopup, this);
    EventManager.instance.on(EHomeEvent.SHOW_PLANT_VIEW, this.showPlantView, this);
    EventManager.instance.on(EUserDataEvent.UPDATE_PLANT_LEVEL, this.onUpdatePlantLevel, this);

    this._maxPower = paraNum(21);
    this._powerCd = 60 * paraNum(22);
    const ud = userDataProxy.userData;
    if (ud.lastPowerTime === 0 && ud.power === 0) {
      ud.power = this._maxPower;
      userDataProxy.saveData();
    }
    this.setPhysicalRootIsShow(1);
    this.initRedDot();
    this.updateGold();
    this.updateDiamond();
    this.updatePhysical();
    this.updateManure();
    this.onUpdatePlantLevel();
    if (this.mBattleView) this.mBattleView.active = true;
    PopupManager.instance.remove('SelectSkillPopup');
  }

  initRedDot(): void {
    const down = this.node.getChildByName('downUI');
    const home = this.node.getChildByName('homeUI');
    if (!down || !home) return;
    const battleView = home.getChildByName('BattleView');
    const btnRed = (btn: string) => down.getChildByName(btn)?.getChildByName('redDot') ?? null;
    const mgr = RedDotMgr.instance;
    mgr.mBattleRed = btnRed('BtnFight');
    mgr.mShopRed = btnRed('BtnShop');
    mgr.mPlantRed = btnRed('BtnPlant');
    mgr.mHybridRed = btnRed('BtnHybrid');
    mgr.mBaseRed = btnRed('BtnBase');
    const weatherRd = battleView?.getChildByName('BtnModel')?.getChildByName('redDot');
    if (weatherRd) mgr.mWeatherRed = weatherRd;
    mgr.initRedState();
  }

  onDestroy(): void {
    EventManager.instance.off(EUserDataEvent.POWER_UPDATE, this.updatePhysical, this);
    EventManager.instance.off(EUserDataEvent.GOLD_UPDATE, this.updateGold, this);
    EventManager.instance.off(EUserDataEvent.DIAMOD_UPDATE, this.updateDiamond, this);
    EventManager.instance.off(EUserDataEvent.MANURE_UPDATE, this.updateManure, this);
    EventManager.instance.off(EGameEvent.OPEN_HOME_VIEW, this.onOpenHomeView, this);
    EventManager.instance.off(EHomeEvent.SHOW_VIDEO_DIAMOMND_POPUP, this.showVideoDiamondPopup, this);
    EventManager.instance.off(EHomeEvent.SHOW_PLANT_VIEW, this.showPlantView, this);
    EventManager.instance.off(EUserDataEvent.UPDATE_PLANT_LEVEL, this.onUpdatePlantLevel, this);
    super.onDestroy();
  }

  onUpdatePlantLevel(): void {
    const t = this.node.getChildByName('downUI')?.getChildByName('BtnHybrid')?.getChildByName('icon_zhandou');
    const spr = t?.getComponent(Sprite);
    if (!spr) return;
    if (this.getHybridIsUnlock()) {
      Util.setSpriteNormalMaterial(spr);
      RedDotMgr.instance.updateRedDotState([HOME_REDDOT.HYBRIDRED]);
    } else {
      Util.setSpriteGrayMaterial(spr);
    }
  }

  onOpenHomeView(t: number): void {
    const e = this.node.getChildByName('downUI');
    if (!e) return;
    if (t === 1) {
      this.onBtnPlant({ target: e.getChildByName('BtnPlant')! } as unknown as Event);
    } else if (t === 2) {
      this.onBtnShop({ target: e.getChildByName('BtnShop')! } as unknown as Event);
    }
  }

  updateGold(): void {
    if (this.mGoldNum) this.mGoldNum.string = MathUtil.formatValue(userDataProxy.userData.gold);
  }

  updateDiamond(): void {
    if (this.mDiamondNum) this.mDiamondNum.string = MathUtil.formatValue(userDataProxy.userData.diamond);
  }

  updateManure(): void {
    if (this.mManureNum) this.mManureNum.string = MathUtil.formatValue(userDataProxy.userData.manure);
  }

  updatePhysical(): void {
    const ud = userDataProxy.userData;
    if (this.mPhysicalNum) this.mPhysicalNum.string = MathUtil.formatValue(ud.power);
    if (ud.power < this._maxPower) {
      if (this.mPowerTime) this.mPowerTime.node.active = true;
      if (ud.lastPowerTime) {
        this.updatePowerCd(ud.lastPowerTime);
      } else {
        ud.lastPowerTime = Date.now();
        userDataProxy.saveData();
        this.updatePowerCd(ud.lastPowerTime);
      }
    } else {
      if (ud.lastPowerTime > 0) {
        ud.lastPowerTime = 0;
        userDataProxy.saveData();
        this.unscheduleAllCallbacks();
      }
      if (this.mPowerTime) this.mPowerTime.node.active = false;
    }
  }

  updatePowerCd(t: number): void {
    const now = Date.now();
    this.unscheduleAllCallbacks();
    let elapsed = Math.floor((now - t) / 1000);
    if (elapsed >= this._powerCd) {
      const n = Math.floor(elapsed / this._powerCd);
      const ud = userDataProxy.userData;
      if (ud.power + n > this._maxPower) {
        ud.power = this._maxPower;
        ud.lastPowerTime = 0;
        if (this.mPowerTime) this.mPowerTime.node.active = false;
        userDataProxy.saveData();
      } else {
        ud.power += n;
        ud.lastPowerTime = t + n * this._powerCd * 1000;
        userDataProxy.saveData();
      }
      this.updatePhysical();
    } else {
      let remain = this._powerCd - elapsed;
      if (this.mPowerTime) this.mPowerTime.string = TimeUtil.format_MMSS(1000 * remain);
      this.schedule(() => {
        remain--;
        if (this.mPowerTime) this.mPowerTime.string = TimeUtil.format_MMSS(1000 * remain);
        if (remain <= 0) {
          this.unscheduleAllCallbacks();
          this.updatePhysical();
        }
      }, 1);
    }
  }

  showPlantView(): void {
    const t = this.node.getChildByName('downUI')?.getChildByName('BtnPlant');
    if (t) this.onBtnPlant({ target: t } as unknown as Event);
  }

  onBtnFight(t: Event): void {
    if (!this._isCanClick || !this.mBattleView) return;
    const g = getGameConfig();
    if (sys.isBrowser && g.isZB && !userDataProxy.userData.startGameRights) {
      gameUIMgr?.showTips('请先使用兑换码激活游戏~');
      return;
    }
    this.setPhysicalRootIsShow(1);
    this.setSelectIsShow(t);
    this.mBattleView.active = true;
    if (this.mPlantView) this.mPlantView.active = false;
    if (this.mShopView) this.mShopView.active = false;
    if (this.mHybridView) this.mHybridView.active = false;
  }

  onBtnShop(t: Event): void {
    if (!this._isCanClick || !this.mBattleView) return;
    const g = getGameConfig();
    if (sys.isBrowser && g.isZB && !userDataProxy.userData.startGameRights) {
      gameUIMgr?.showTips('请先使用兑换码激活游戏~');
      return;
    }
    this.setPhysicalRootIsShow(2);
    this.setSelectIsShow(t);
    this.mBattleView.active = false;
    if (this.mPlantView) this.mPlantView.active = false;
    if (this.mShopView) {
      this.mShopView.active = true;
    } else {
      this._isCanClick = false;
      void ResUtil.loadAsset({
        path: 'uis/homeView/ShopView',
        type: Prefab,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          this._isCanClick = true;
          const prefab = asset as Prefab;
          this.mShopView = instantiate(prefab);
          this.mBattleView!.parent!.insertChild(this.mShopView, 3);
        })
        .catch((err) => console.log('error:', err));
    }
    if (this.mHybridView) this.mHybridView.active = false;
  }

  onBtnPlant(t: Event): void {
    if (!this._isCanClick || !this.mBattleView) return;
    const g = getGameConfig();
    if (sys.isBrowser && g.isZB && !userDataProxy.userData.startGameRights) {
      gameUIMgr?.showTips('请先使用兑换码激活游戏~');
      return;
    }
    this.setPhysicalRootIsShow(3);
    if (userDataProxy.userData.gameCourseData.curId === 3) {
      userDataProxy.completeCourse(4);
      EventManager.instance.emit(EBattleEvent.LOSE_COURSE_VIEW);
    }
    this.setSelectIsShow(t);
    this.mBattleView.active = false;
    if (this.mPlantView) {
      this.mPlantView.active = true;
    } else {
      this._isCanClick = false;
      void ResUtil.loadAsset({
        path: 'uis/homeView/PlantView',
        type: Prefab,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          this._isCanClick = true;
          const prefab = asset as Prefab;
          this.mPlantView = instantiate(prefab);
          this.mBattleView!.parent!.insertChild(this.mPlantView, 3);
        })
        .catch((err) => console.log('error:', err));
    }
    if (this.mShopView) this.mShopView.active = false;
    if (this.mHybridView) this.mHybridView.active = false;
  }

  getHybridIsUnlock(): boolean {
    let count = 0;
    const needLv = paraNum(73);
    for (let i = 1; i <= 15; ++i) {
      const p = userDataProxy.getPlantData(i);
      const lv = p.lv || 1;
      if (lv >= needLv && ++count >= 2) return true;
    }
    return false;
  }

  onBtnHybrid(t: Event): void {
    if (!this._isCanClick || !this.mBattleView) return;
    const g = getGameConfig();
    if (sys.isBrowser && g.isZB && !userDataProxy.userData.startGameRights) {
      gameUIMgr?.showTips('请先使用兑换码激活游戏~');
      return;
    }
    if (!this.getHybridIsUnlock()) {
      gameUIMgr?.showTips(`任意两个植物升级${paraNum(73)}级解锁`);
      return;
    }
    this.setPhysicalRootIsShow(4);
    this.setSelectIsShow(t);
    this.mBattleView.active = false;
    if (this.mPlantView) this.mPlantView.active = false;
    if (this.mShopView) this.mShopView.active = false;
    if (this.mHybridView) {
      this.mHybridView.active = true;
    } else {
      this._isCanClick = false;
      void ResUtil.loadAsset({
        path: 'uis/homeView/HybridView',
        type: Prefab,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          this._isCanClick = true;
          const prefab = asset as Prefab;
          this.mHybridView = instantiate(prefab);
          this.mBattleView!.parent!.insertChild(this.mHybridView, 3);
        })
        .catch((err) => console.log('error:', err));
    }
  }

  onBtnBase(): void {
    if (!this._isCanClick) return;
    const g = getGameConfig();
    if (sys.isBrowser && g.isZB && !userDataProxy.userData.startGameRights) {
      gameUIMgr?.showTips('请先使用兑换码激活游戏~');
      return;
    }
    gameUIMgr?.showTips('尚未解锁!');
  }

  setSelectIsShow(t: Event): void {
    const target = t.target as Node;
    if (!this.mNowBtn || !target) return;
    let e = this.mNowBtn.getChildByName('selectBg');
    if (e) e.active = false;
    e = target.getChildByName('selectBg');
    if (e) e.active = true;
    this.mNowBtn = target;
  }

  onCourseNotify(): void {}

  setPhysicalRootIsShow(t: number): void {
    const ud = userDataProxy.userData;
    if (this.mPhysicalRoot) this.mPhysicalRoot.active = t === 1;
    if (this.mDiamondRoot) this.mDiamondRoot.active = t !== 1 && t !== 4;
    if (this.mManureRoot) this.mManureRoot.active = t === 4;
    if (this.mPowerTime) {
      this.mPowerTime.node.active = t === 1 && ud.power < this._maxPower;
    }
  }

  update(dt: number): void {
    const info = battleDataProxy.audioFilterInfo;
    for (const k in info) {
      if (Object.prototype.hasOwnProperty.call(info, k)) {
        info[k]!.time -= dt;
      }
    }
  }

  onDiamondRoot(): void {
    this.showVideoDiamondPopup();
  }

  showVideoDiamondPopup(): void {
    const limit = paraNum(47);
    const ud = userDataProxy.userData;
    if (ud.videoDiamondNum >= limit) return;
    gameUIMgr?.showVideoDiamondPopup(() => {
      AdsMgr.showVideoAds(
        new AdsParam(
          '1',
          'add_diamond_ad',
          () => {
            const add = paraNum(46);
            gameUIMgr?.showCongratsGettingPopup({ list: [{ id: 2, num: add }], type: 1 });
            ud.videoDiamondNum += 1;
            userDataProxy.saveData();
          },
          () => {},
          () => {},
        ),
        true,
      );
    });
  }
}
