/**
 * 杂交主页（原 HomeHybridView.js）
 */

import {
  _decorator,
  Color,
  Component,
  EventTouch,
  Label,
  Node,
  Sprite,
  SpriteAtlas,
  UITransform,
  Vec2,
  Vec3,
  sp,
  tween,
  Tween,
} from 'cc';
import { EventManager } from './EventManager';
import { ResUtil } from './ResUtil';
import { TimeUtil } from './TimeUtil';
import AdsMgr, { AdsParam } from './AdsMgr';
import { Bundles, EHomeEvent, HOME_REDDOT } from './HomeEnum';
import { DataManager } from './DataManager';
import { userDataProxy, EUserDataEvent } from './UserDataProxy';
import Util from './Util';
import { gameUIMgr } from './GameUIManager';
import RedDotMgr from './RedDotMgr';
import HybridPitItem from './HybridPitItem';
import HybridPlantItem, { type DataplantHybridRow } from './HybridPlantItem';
import { Prefab } from 'cc';
import { instantiate } from 'cc';

const { ccclass, property } = _decorator;

function paraStr(id: number): string {
  return String(DataManager.instance.eData.datapara[String(id)]?.num ?? '');
}

type CombineRow = { plantA: number; plantB: number; time: number; firstCombine: number; repeatCombine: string };

@ccclass('HomeHybridView')
export default class HomeHybridView extends Component {
  @property(Node)
  mBtnBag: Node | null = null;

  @property(Node)
  mBtnHybrid: Node | null = null;

  @property(Node)
  mHybridView: Node | null = null;

  @property(Node)
  mPits: Node | null = null;

  @property(Node)
  mSelectView: Node | null = null;

  @property(Node)
  mWateringView: Node | null = null;

  @property(Label)
  mHybridTime: Label | null = null;

  @property(Node)
  mSelectContent: Node | null = null;

  @property(Label)
  mPriceNumLab: Label | null = null;

  @property(Node)
  mDots: Node | null = null;

  @property(Node)
  mBtnRight: Node | null = null;

  @property(Node)
  mBtnLeft: Node | null = null;

  @property(Node)
  mTouchNode: Node | null = null;

  @property(Node)
  mTouchPlant: Node | null = null;

  @property(sp.Skeleton)
  mSaplingSp: sp.Skeleton | null = null;

  @property(sp.Skeleton)
  mWateringSp: sp.Skeleton | null = null;

  @property(Node)
  mBtnWatering: Node | null = null;

  @property(Node)
  mHybridResult: Node | null = null;

  @property(Node)
  mBagRedDot: Node | null = null;

  @property(Node)
  mRotateBg: Node | null = null;

  @property(Label)
  mHybridTitle: Label | null = null;

  private _selectPlantIds: number[] = [0, 0];
  private _pageIdx = 0;
  private _selectPlantItem: Node | null = null;
  private _isCanTouch = true;
  private _needTime = 0;
  private _saplingStage = 0;
  private _isCanClickWatering = true;
  private _resultPlantData: DataplantHybridRow | null = null;
  private _isVideoResult = false;
  private _hybridBagView: Node | null = null;

  onLoad(): void {
    const self = this;
    userDataProxy.userData.hybridPlantDatas ||= [];
    const touch = this.mTouchNode;
    if (touch) {
      touch.on(Node.EventType.TOUCH_START, this.touchBegin, this);
      touch.on(Node.EventType.TOUCH_MOVE, this.touchMoved, this);
      touch.on(Node.EventType.TOUCH_END, this.touchEnded, this);
      touch.on(Node.EventType.TOUCH_CANCEL, this.touchEnded, this);
      const tl = (touch as unknown as { _touchListener?: { swallowTouches?: boolean } })._touchListener;
      if (tl) tl.swallowTouches = false;
    }
    EventManager.instance.on(EHomeEvent.UPDATE_HOME_REDDOT, this.updateRedDotState, this);
    EventManager.instance.on(EUserDataEvent.MANURE_UPDATE, this.updateManure, this);
    const sap = this.mSaplingSp;
    if (sap) {
      sap.setCompleteListener((te) => {
        const name = te?.animation?.name ?? '';
        if (name === 'phase1') {
          sap.setAnimation(0, 'phase1stand', true);
        } else if (name === 'phase2') {
          sap.setAnimation(0, 'phase2stand', true);
        } else if (name === 'phase3') {
          sap.setAnimation(0, 'phase3stand', true);
          if (self._isVideoResult) {
            self._isVideoResult = false;
            self.hybridResult();
          }
        }
      });
    }
    const ws = this.mWateringSp;
    if (ws) {
      ws.setCompleteListener(() => {
        ws.node.active = false;
      });
      ws.node.active = false;
    }
  }

  onDestroy(): void {
    this.mTouchNode?.off(Node.EventType.TOUCH_START, this.touchBegin, this);
    this.mTouchNode?.off(Node.EventType.TOUCH_MOVE, this.touchMoved, this);
    this.mTouchNode?.off(Node.EventType.TOUCH_END, this.touchEnded, this);
    this.mTouchNode?.off(Node.EventType.TOUCH_CANCEL, this.touchEnded, this);
    EventManager.instance.off(EHomeEvent.UPDATE_HOME_REDDOT, this.updateRedDotState, this);
    EventManager.instance.off(EUserDataEvent.MANURE_UPDATE, this.updateManure, this);
  }

  private updateRedDotState = (): void => {
    if (this.mBagRedDot) this.mBagRedDot.active = RedDotMgr.instance.getHybridPlantRedIsShow();
  };

  onDisable(): void {
    userDataProxy.saveData();
  }

  updateManure(): void {
    const t = paraStr(79).split('_');
    const need = Number(t[1] ?? 0);
    const lab = this.mPriceNumLab;
    if (!lab) return;
    if (need > userDataProxy.userData.manure) {
      lab.color = new Color(255, 75, 25);
    } else {
      lab.color = new Color(255, 255, 255);
    }
  }

  /** 浇水界面 BtnVideo / BtnWatering 显隐（避免对 `?.` 左侧赋值） */
  private setWateringActionBtnsActive(active: boolean): void {
    const wv = this.mWateringView;
    if (!wv) return;
    const btnVideo = wv.getChildByName('BtnVideo');
    const btnWatering = wv.getChildByName('BtnWatering');
    if (btnVideo) btnVideo.active = active;
    if (btnWatering) btnWatering.active = active;
  }

  onRotateBg(): void {
    if (!this.mRotateBg) return;
    Tween.stopAllByTarget(this.mRotateBg);
    const tw = tween(this.mRotateBg).by(0.3, { eulerAngles: new Vec3(0, 0, -15) });
    tween(this.mRotateBg).repeatForever(tw).start();
  }

  onEnable(): void {
    this.initCanHybridPlantDatas();
    this.initPageBtn();
    this.unschedule(this.scheduleTimer);
    this.setCombineNeedTime();
    const hd = userDataProxy.userData.hybridData;
    if (!hd.plant1 || !hd.plant2) {
      userDataProxy.userData.hybridData = { plant1: 0, plant2: 0, time: 0 };
    }
    if (userDataProxy.userData.hybridData.time > 0) {
      if (this.mSelectView) this.mSelectView.active = false;
      if (this.mWateringView) {
        this.mWateringView.active = true;
        this.setWateringActionBtnsActive(true);
      }
      this._selectPlantIds[0] = userDataProxy.userData.hybridData.plant1;
      this._selectPlantIds[1] = userDataProxy.userData.hybridData.plant2;
      this.schedule(this.scheduleTimer, 1);
      this.scheduleTimer();
    } else {
      if (this.mSelectView) this.mSelectView.active = true;
      if (this.mWateringView) this.mWateringView.active = false;
    }
    const parts = paraStr(79).split('_');
    if (this.mPriceNumLab) this.mPriceNumLab.string = parts[1] ?? '';
    this.updateManure();
    if (this.mBagRedDot) this.mBagRedDot.active = RedDotMgr.instance.getHybridPlantRedIsShow();
    this.initPits();
    this.onRotateBg();
  }

  private touchBegin(evt: EventTouch): void {
    if (this._isCanTouch && this.mSelectView?.active) {
      const loc = evt.getUILocation();
      const i = this.findSelectEquipment(loc);
      if (i) {
        this._selectPlantItem = i;
        const pd = i.getComponent(HybridPlantItem)!.plantData;
        const ui = this.mTouchNode!.getComponent(UITransform)!;
        const np = new Vec3();
        ui.convertToNodeSpaceAR(new Vec3(loc.x, loc.y, 0), np);
        this.mTouchPlant!.setPosition(np);
        void ResUtil.loadAsset({
          path: 'textures/botanyIcon/BotanyIcon',
          type: SpriteAtlas,
          bundleName: Bundles.GAME,
        }).then((asset) => {
          const atlas = asset as SpriteAtlas;
          this.mTouchPlant!.active = true;
          const spr = this.mTouchPlant!.getChildByName('plantImg')!.getComponent(Sprite)!;
          spr.spriteFrame = atlas.getSpriteFrame(`pic_plant${pd.id}`) ?? null;
        });
      }
    } else {
      const c = this.mWateringView?.getChildByName('BtnWatering');
      if (this.mWateringView?.active && c?.active) this.onBtnWatering();
    }
  }

  private touchMoved(evt: EventTouch): void {
    if (this._selectPlantItem && this._isCanTouch && this.mSelectView?.active) {
      const loc = evt.getUILocation();
      const ui = this.mTouchNode!.getComponent(UITransform)!;
      const np = new Vec3();
      ui.convertToNodeSpaceAR(new Vec3(loc.x, loc.y, 0), np);
      this.mTouchPlant!.setPosition(np);
    }
  }

  private touchEnded(evt: EventTouch): void {
    const self = this;
    if (this._selectPlantItem && this._isCanTouch && this.mSelectView?.active) {
      const loc = evt.getUILocation();
      const pit = this.findSelectPit(loc);
      if (pit) {
        const pitComp = pit.getComponent(HybridPitItem)!;
        const existing = pitComp.plantId;
        if (existing) {
          const a = this.getHybridPlantItemById(existing);
          a?.getComponent(HybridPlantItem)?.setSelectIsShow(false);
        }
        const idx = Number(pit.name.split('pit')[1]);
        const s = this._selectPlantItem.getComponent(HybridPlantItem)!.plantData;
        this._selectPlantIds[idx - 1] = s.id;
        this.mTouchPlant!.active = false;
        pitComp.initHybridPitItem(idx, s.id);
        this._selectPlantItem.getComponent(HybridPlantItem)!.setSelectIsShow(true);
      } else {
        this._isCanTouch = false;
        Tween.stopAllByTarget(this.mTouchPlant!);
        const c = Util.convertToTargetNodeSpace(this._selectPlantItem, this.mTouchNode!);
        tween(this.mTouchPlant!)
          .to(0.3, { position: c })
          .call(() => {
            self.mTouchPlant!.active = false;
            self._isCanTouch = true;
          })
          .start();
      }
      this._selectPlantItem = null;
    }
  }

  private findSelectPit(screenLoc: Vec2): Node | null {
    const ch = this.mPits?.children ?? [];
    for (const i of ch) {
      const uit = i.getComponent(UITransform);
      if (uit?.hitTest(screenLoc)) return i;
    }
    return null;
  }

  private findSelectEquipment(screenLoc: Vec2): Node | null {
    const page = this.mSelectContent?.children[this._pageIdx];
    if (!page) return null;
    for (const item of page.children) {
      const uit = item.getComponent(UITransform);
      if (!uit?.hitTest(screenLoc)) continue;
      const comp = item.getComponent(HybridPlantItem)!;
      if (!comp.isUnlock) {
        gameUIMgr?.showTips(`植物升到${Number(DataManager.instance.eData.datapara['73']?.num ?? 0)}级解锁杂交`);
        return null;
      }
      if (comp.getIsCanSelect()) return item;
      gameUIMgr?.showTips('该植物已被选择');
      return null;
    }
    return null;
  }

  initPageBtn(): void {
    if (!this.mBtnRight || !this.mBtnLeft || !this.mDots || !this.mSelectContent) return;
    this._isCanTouch = false;
    this.mBtnRight.active = this._pageIdx < 2;
    this.mBtnLeft.active = this._pageIdx > 0;
    for (let e = 0; e < this.mDots.children.length; ++e) {
      const on = this.mDots.children[e]!.getChildByName('on');
      if (on) on.active = e === this._pageIdx;
    }
    const first = this.mSelectContent.children[0];
    const w = first?.getComponent(UITransform)?.width ?? 0;
    const target = new Vec3(-280 - this._pageIdx * w, this.mSelectContent.position.y, this.mSelectContent.position.z);
    Tween.stopAllByTarget(this.mSelectContent);
    tween(this.mSelectContent)
      .to(0.3, { position: target })
      .call(() => {
        this._isCanTouch = true;
      })
      .start();
  }

  initPits(): void {
    if (!this.mPits) return;
    for (let t = 0; t < this.mPits.children.length; ++t) {
      const e = this.mPits.children[t]!;
      const pit = e.getComponent(HybridPitItem)!;
      pit.initHybridPitItem(t + 1, this._selectPlantIds[t] ?? 0);
      pit.homeHybridView = this;
    }
  }

  removePitPlant(t: number, plantId: number): void {
    this._selectPlantIds[t - 1] = 0;
    const o = this.getHybridPlantItemById(plantId);
    o?.getComponent(HybridPlantItem)?.setSelectIsShow(false);
  }

  initCanHybridPlantDatas(): void {
    if (this.mHybridResult) this.mHybridResult.active = false;
    const pass = userDataProxy.userData.passChapter;
    const needLv = Number(DataManager.instance.eData.datapara['73']?.num ?? 0);
    const plants = DataManager.instance.eData.dataplant as Record<string, DataplantHybridRow>;
    let idx = 0;
    for (const n in plants) {
      if (!Object.prototype.hasOwnProperty.call(plants, n)) continue;
      const a = plants[n]!;
      if (a.type1 === 2) {
        const r = userDataProxy.getPlantData(a.id).lv;
        const unlocked = (a.stageID ?? 0) < pass + 1 && r >= needLv;
        this.getSelectItem(idx)?.getComponent(HybridPlantItem)?.setHybridPlantData(a, unlocked, this._selectPlantIds);
        idx++;
      }
    }
  }

  private getSelectItem(t: number): Node | null {
    let e = 0;
    if (t >= 4 && t < 8) e = 1;
    else if (t >= 8) e = 2;
    const page = this.mSelectContent?.children[e];
    return page?.children[Math.floor(t % 4)] ?? null;
  }

  onBtnHybrid(): void {
    if (!this._isCanTouch || !this.mBtnBag || !this.mBtnHybrid || !this.mHybridView) return;
    if (this._hybridBagView) this._hybridBagView.active = false;
    this.mBtnBag.getChildByName('btn_right_green')!.active = false;
    this.mBtnHybrid.getChildByName('btn_left_green')!.active = true;
    this.mHybridView.active = true;
  }

  onBtnBag(): void {
    if (!this._isCanTouch || !this.mBtnBag || !this.mBtnHybrid || !this.mHybridView) return;
    this.mBtnBag.getChildByName('btn_right_green')!.active = true;
    this.mBtnHybrid.getChildByName('btn_left_green')!.active = false;
    if (this.mBagRedDot) this.mBagRedDot.active = false;
    this.mHybridView.active = false;
    if (this._hybridBagView) {
      this._hybridBagView.active = true;
    } else {
      this._isCanTouch = false;
      void ResUtil.loadAsset({
        path: 'uis/homeView/HybridBagView',
        type: Prefab,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          this._isCanTouch = true;
          const prefab = asset as Prefab;
          this._hybridBagView = instantiate(prefab);
          this.node.addChild(this._hybridBagView);
        })
        .catch((err) => console.log('error:', err));
    }
  }

  onBtnVideo(): void {
    const self = this;
    if (!this._isCanTouch) return;
    AdsMgr.showVideoAds(
      new AdsParam(
        '1',
        'hybrid_quickGet_ad',
        () => {
          self._isCanTouch = false;
          if (self._saplingStage !== 3) {
            userDataProxy.userData.hybridData.time -= 1e7;
            self.unschedule(self.scheduleTimer);
            self.mSaplingSp?.setAnimation(0, 'phase3', false);
            self._saplingStage = 3;
            self._isVideoResult = true;
            self.setWateringActionBtnsActive(false);
          } else {
            self.hybridResult();
          }
        },
        () => {},
        () => {},
      ),
      true,
    );
  }

  onBtnWatering(): void {
    const self = this;
    if (!this._isCanClickWatering || !this._isCanTouch) return;
    this._isCanClickWatering = false;
    this.scheduleOnce(() => {
      self._isCanClickWatering = true;
    }, 0.3);
    const ws = this.mWateringSp;
    if (ws && !ws.node.active) {
      ws.node.active = true;
      ws.setAnimation(0, 'watering', false);
    }
    if (this.mRotateBg) {
      Tween.stopAllByTarget(this.mRotateBg);
      tween(this.mRotateBg)
        .by(0.3, { eulerAngles: new Vec3(0, 0, -90) })
        .call(() => this.onRotateBg())
        .start();
    }
    userDataProxy.userData.hybridData.time -= 1000;
    this.scheduleTimer();
  }

  onBtnStart(): void {
    if (!this._isCanTouch) return;
    for (let t = 0; t < this._selectPlantIds.length; ++t) {
      if (this._selectPlantIds[t]! <= 0) {
        gameUIMgr?.showTips('请选择要杂交的植物');
        return;
      }
    }
    const e = paraStr(79).split('_');
    if (Number(e[1] ?? 0) > userDataProxy.userData.manure) {
      gameUIMgr?.showTips('肥料不足');
      const lim = Number(DataManager.instance.eData.datapara['81']?.num ?? 0);
      if (userDataProxy.userData.videoManureNum < lim) {
        gameUIMgr?.showVideoManurePopup(() => {
          AdsMgr.showVideoAds(
            new AdsParam(
              '1',
              'add_manure_ad',
              () => {
                const add = Number(DataManager.instance.eData.datapara['82']?.num ?? 0);
                gameUIMgr?.showCongratsGettingPopup({ list: [{ id: 9, num: add }], type: 1 });
                userDataProxy.userData.videoManureNum += 1;
                userDataProxy.saveData();
              },
              () => {},
              () => {},
            ),
            true,
          );
        });
      }
      return;
    }
    userDataProxy.changeManure(-Number(e[1] ?? 0));
    if (this.mSelectView) this.mSelectView.active = false;
    if (this.mWateringView) {
      this.mWateringView.active = true;
      this.setWateringActionBtnsActive(true);
    }
    const pits = this.mPits?.children ?? [];
    for (const p of pits) {
      p.getComponent(HybridPitItem)?.hideRemoveBtn();
    }
    const hd = userDataProxy.userData.hybridData;
    hd.plant1 = this._selectPlantIds[0]!;
    hd.plant2 = this._selectPlantIds[1]!;
    hd.time = Date.now() + this._needTime;
    userDataProxy.saveData();
    this.scheduleTimer();
    this.unschedule(this.scheduleTimer);
    this.schedule(this.scheduleTimer, 1);
    RedDotMgr.instance.updateRedDotState([HOME_REDDOT.HYBRIDRED]);
  }

  setCombineNeedTime(): void {
    const t = this.getHybridCombineData(this._selectPlantIds[0]!, this._selectPlantIds[1]!);
    this._needTime = t ? t.time * 1000 : 1000 * Number(DataManager.instance.eData.datapara['80']?.num ?? 0);
  }

  getHybridCombineData(a: number, b: number): CombineRow | null {
    const o = DataManager.instance.eData.data_hybridizationcombine as Record<string, CombineRow>;
    for (const k in o) {
      if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
      const n = o[k]!;
      if (n.plantA === a) {
        if (n.plantB === b) return n;
      } else if (n.plantB === a && n.plantA === b) {
        return n;
      }
    }
    return null;
  }

  scheduleTimer(): void {
    const left = userDataProxy.userData.hybridData.time - TimeUtil.getDate().getTime();
    if (left <= 0) {
      this.hybridResult();
    } else {
      if (this.mHybridTime) this.mHybridTime.string = TimeUtil.format_MMSS(left);
      const st = this.getSaplingStage();
      if (st !== this._saplingStage) {
        this.mSaplingSp?.setAnimation(0, `phase${st}`, false);
        this._saplingStage = st;
      }
      if (this.mHybridTitle) {
        this.mHybridTitle.string = '杂交成长中';
        this.mHybridTitle.color = new Color().fromHEX('#FFFFFF');
      }
    }
  }

  hybridResult(): void {
    const self = this;
    userDataProxy.userData.hybridData.time -= 1e8;
    this.unschedule(this.scheduleTimer);
    if (this.mHybridTime) this.mHybridTime.string = '已成熟';
    const res = this.mHybridResult;
    if (res) {
      res.active = true;
      res.setPosition(0, 325, 0);
      res.setScale(0.5, 0.5, 1);
      Tween.stopAllByTarget(res);
      tween(res)
        .to(0.3, { scale: new Vec3(1.1, 1.1, 1) })
        .to(0.1, { scale: new Vec3(1, 1, 1) })
        .call(() => {
          self._isCanTouch = true;
        })
        .start();
    }
    const comb = this.getHybridCombineData(this._selectPlantIds[0]!, this._selectPlantIds[1]!);
    const o = this.mHybridResult?.getChildByName('plantImg');
    const i = this.mHybridResult?.getChildByName('plantName')?.getComponent(Label);
    let iconKey = '';
    if (comb) {
      this._resultPlantData = DataManager.instance.eData.dataplant[String(comb.firstCombine)] as DataplantHybridRow;
      if (i) i.string = this._resultPlantData.name;
      iconKey = `${this._resultPlantData.icon}`;
      if (this.mHybridTitle) {
        this.mHybridTitle.string = '杂交成功';
        this.mHybridTitle.color = new Color().fromHEX('#FFFFFF');
      }
    } else {
      if (i) i.string = '杂树根';
      iconKey = 'wp_zashugen';
      if (this.mHybridTitle) {
        this.mHybridTitle.string = '杂交失败';
        this.mHybridTitle.color = new Color(125, 125, 125);
      }
    }
    void ResUtil.loadAsset({
      path: 'textures/botanyIcon/BotanyIcon',
      type: SpriteAtlas,
      bundleName: Bundles.GAME,
    }).then((asset) => {
      const atlas = asset as SpriteAtlas;
      const spr = o?.getComponent(Sprite);
      if (spr) spr.spriteFrame = atlas.getSpriteFrame(iconKey) ?? null;
    });
    this.setWateringActionBtnsActive(false);
  }

  getHybridResult(): void {
    const self = this;
    const hd = userDataProxy.userData.hybridData;
    hd.plant1 = 0;
    hd.plant2 = 0;
    hd.time = 0;
    const comb = this.getHybridCombineData(this._selectPlantIds[0]!, this._selectPlantIds[1]!);
    if (comb && this._resultPlantData) {
      const exists =
        userDataProxy.userData.hybridPlantDatas.findIndex((x) => x.plantId === this._resultPlantData!.id) >= 0;
      if (!exists) {
        userDataProxy.userData.hybridPlantDatas.push({ plantId: this._resultPlantData.id, lv: 1 });
        userDataProxy.saveData();
        if (this.mBagRedDot) this.mBagRedDot.active = true;
        gameUIMgr?.showUnlockHybridPlantPopup(this._resultPlantData.id, () => {
          const bag = self.node.getChildByName('BtnBag');
          if (bag && self.mHybridResult) {
            const o = Util.convertToTargetNodeSpace(bag, self.mHybridResult);
            Tween.stopAllByTarget(self.mHybridResult);
            tween(self.mHybridResult)
              .to(0.5, { position: o, scale: new Vec3(0.3, 0.3, 1) })
              .call(() => self.initView())
              .start();
          }
        });
      } else {
        const o = comb.repeatCombine.split('_').map(Number);
        this.getShopAward([{ id: o[0]!, num: o[1]! }], false);
        this.initView();
      }
    } else {
      const list: { id: number; num: number }[] = [];
      for (let n = 0; n < this._selectPlantIds.length; ++n) {
        const pid = this._selectPlantIds[n]!;
        const aid = 1000 + pid;
        const r = DataManager.instance.eData.dataitem[String(aid)] as { qulity?: number };
        let s = 74;
        if (r?.qulity === 3) s = 75;
        else if (r?.qulity === 4) s = 76;
        const c = Number(DataManager.instance.eData.datapara[String(s)]?.num ?? 0);
        list.push({ id: aid, num: c });
      }
      this.getShopAward(list, true);
      this.initView();
    }
  }

  initView(): void {
    this._selectPlantIds = [0, 0];
    this.initPits();
    if (this.mWateringView) this.mWateringView.active = false;
    if (this.mSelectView) this.mSelectView.active = true;
    this.initCanHybridPlantDatas();
  }

  getShopAward(t: { id: number; num: number }[], failTitle: boolean): void {
    if (failTitle) {
      gameUIMgr?.showCongratsGettingPopup({ list: t, type: 1 }, '杂交失败', true);
    } else {
      gameUIMgr?.showCongratsGettingPopup({ list: t, type: 1 });
    }
  }

  onHybridResult(): void {
    if (this._isCanTouch) this.getHybridResult();
  }

  onBtnRight(): void {
    if (this._isCanTouch) {
      this._pageIdx++;
      this.initPageBtn();
    }
  }

  onBtnLeft(): void {
    if (this._isCanTouch) {
      this._pageIdx--;
      this.initPageBtn();
    }
  }

  getHybridPlantItemById(t: number): Node | null {
    const pages = this.mSelectContent?.children ?? [];
    const cur = pages[this._pageIdx]?.children ?? [];
    for (const r of cur) {
      if (r.getComponent(HybridPlantItem)?.plantData.id === t) return r;
    }
    for (let i = 0; i < pages.length; i++) {
      if (i === this._pageIdx) continue;
      const n = pages[i]!.children;
      for (const r of n) {
        if (r.getComponent(HybridPlantItem)?.plantData.id === t) return r;
      }
    }
    return null;
  }

  getSaplingStage(): number {
    const end = userDataProxy.userData.hybridData.time;
    const now = TimeUtil.getDate().getTime();
    const secLeft = Math.floor((end - now) / 1000);
    const totalSec = Math.floor(this._needTime / 1000);
    let i = 1;
    if (secLeft <= Math.floor(totalSec * 0.33)) i = 3;
    else if (secLeft <= Math.floor(totalSec * 0.66)) i = 2;
    return i;
  }
}
