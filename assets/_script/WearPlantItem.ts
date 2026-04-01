/**
 * 出战植物槽位项（原 WearPlantItem.js）
 */

import {
  _decorator,
  Button,
  Color,
  Component,
  Label,
  Node,
  Sprite,
  SpriteAtlas,
  SpriteFrame,
  tween,
  Tween,
  v3,
} from 'cc';
import { EventManager } from './EventManager';
import { ResUtil } from './ResUtil';
import { Bundles } from './HomeEnum';
import { DataManager } from './DataManager';
import { battleDataProxy, EBattleEvent } from './BattleDataProxy';
import { userDataProxy, EUserDataEvent } from './UserDataProxy';
import { gameUIMgr } from './GameUIManager';
import type { DataplantEquipRow } from './PlantEquipItem';
import Util from './Util';

const { ccclass, property } = _decorator;

@ccclass('WearPlantItem')
export default class WearPlantItem extends Component {
  @property(Node)
  mPlantInfo: Node | null = null;

  @property(Node)
  mLock: Node | null = null;

  @property(Node)
  mNotTips: Node | null = null;

  @property(Sprite)
  mGreadBg: Sprite | null = null;

  @property(Sprite)
  mPlantImg: Sprite | null = null;

  @property(Label)
  mPlantName: Label | null = null;

  @property(Label)
  mLvLab: Label | null = null;

  @property(Node)
  mBtnDetails: Node | null = null;

  @property(Node)
  mBtnRemove: Node | null = null;

  @property(Sprite)
  mBar: Sprite | null = null;

  @property(Label)
  mBarNum: Label | null = null;

  private _isUnlock = false;
  private _plantData: DataplantEquipRow | null = null;
  private _unlockChapter = 0;
  private _idx = 0;

  initWearPlantItem(isUnlock: boolean, idx: number, unlockChapter: number): void {
    this._isUnlock = isUnlock;
    this._idx = idx;
    this._unlockChapter = unlockChapter;
    if (this.mLock) this.mLock.active = !isUnlock;
    if (this.mBtnDetails) {
      this.mBtnDetails.active = false;
      this.mBtnDetails.setPosition(-65, this.mBtnDetails.position.y, this.mBtnDetails.position.z);
    }
    if (this.mBtnRemove) {
      this.mBtnRemove.active = true;
      this.mBtnRemove.setPosition(65, this.mBtnRemove.position.y, this.mBtnRemove.position.z);
    }
    if (this.mBtnDetails) this.mBtnDetails.setSiblingIndex(1);
    if (this.mBtnRemove) this.mBtnRemove.setSiblingIndex(1);
    const btn = this.node.getComponent(Button);
    if (btn) btn.interactable = isUnlock;
    if (this._isUnlock) {
      const wearId = userDataProxy.combatEqus[idx];
      if (wearId && wearId !== 0) {
        if (this.mNotTips) this.mNotTips.active = false;
        if (this.mPlantInfo) this.mPlantInfo.active = true;
        this.setPlantInfo(wearId);
      } else {
        if (this.mNotTips) this.mNotTips.active = true;
        if (this.mPlantInfo) this.mPlantInfo.active = false;
        if (btn) btn.interactable = false;
      }
    } else {
      if (this.mNotTips) this.mNotTips.active = false;
      if (this.mPlantInfo) this.mPlantInfo.active = false;
      const tips = this.mLock?.getChildByName('unlockTips')?.getComponent(Label);
      if (tips) tips.string = `通过第${unlockChapter}章后解锁`;
    }
  }

  setPlantInfo(plantTableId: number): void {
    const row = DataManager.instance.eData.dataplant[String(plantTableId)] as DataplantEquipRow | undefined;
    if (!row) return;
    this._plantData = row;
    const self = this;
    void ResUtil.loadAsset({
      path: `textures/public/pic_zhiwukuang_${row.qulity}`,
      type: SpriteFrame,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        if (self.mGreadBg) self.mGreadBg.spriteFrame = asset as SpriteFrame;
      })
      .catch((err) => console.log('error:', err));
    void ResUtil.loadAsset({
      path: 'textures/botanyIcon/BotanyIcon',
      type: SpriteAtlas,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        const atlas = asset as SpriteAtlas;
        if (self.mPlantImg) self.mPlantImg.spriteFrame = atlas.getSpriteFrame(`pic_plant${plantTableId}`) ?? null;
      })
      .catch((err) => console.log('error:', err));
    this.updatePlantLevel();
    const colors = userDataProxy.mPlantColors;
    const c = colors[row.qulity - 2];
    if (c && this.mPlantName) this.mPlantName.color = new Color().fromHEX(c);
    if (c && this.mLvLab) this.mLvLab.color = new Color().fromHEX(c);
  }

  onItemClick(): void {
    if (this.mBtnRemove) this.mBtnRemove.active = true;
    if (userDataProxy.userData.gameCourseData.curId === 5) {
      userDataProxy.completeCourse(6);
      EventManager.instance.emit(EBattleEvent.LOSE_COURSE_VIEW);
    }
    if (this._plantData) {
      gameUIMgr?.showPlantEquipDetailsPopup(this._plantData, false, this._idx);
    }
  }

  hideBtn(): void {}

  onBtnDetails(): void {
    if (this._plantData) {
      gameUIMgr?.showPlantEquipDetailsPopup(this._plantData, false, this._idx);
    }
  }

  onBtnRemove(): void {
    if (userDataProxy.userData.gameCourseData.curId <= 7) {
      console.log('教程中不能下植物');
      return;
    }
    userDataProxy.userData.combatEqus[this._idx] = 0;
    userDataProxy.saveData();
    this.initWearPlantItem(this._isUnlock, this._idx, this._unlockChapter);
    EventManager.instance.emit(EUserDataEvent.UPDATE_UNLOCK_PLANT);
  }

  updatePlantLevel(): void {
    if (!this._plantData || !this.mPlantName || !this.mLvLab || !this.mBar || !this.mBarNum) return;
    this.mPlantName.string = this._plantData.name;
    const t = userDataProxy.getPlantData(this._plantData.id).lv;
    this.mLvLab.string = `Lv.${t}`;
    const e = userDataProxy.getPropDatas(this._plantData.needItem);
    const parts = this._plantData.needNum.split('|');
    const o = Number(parts[t - 1] ?? 0);
    this.mBar.fillRange = o > 0 ? e / o : 0;
    this.mBarNum.string = `${e}/${o}`;
    const arrow = this.mBar.node.parent?.getChildByName('arrow');
    if (arrow) {
      arrow.active = e >= o;
      arrow.setPosition(arrow.position.x, -78, arrow.position.z);
      Tween.stopAllByTarget(arrow);
      if (arrow.active) {
        const loop = tween(arrow)
          .by(0.3, { position: v3(0, 5, 0) })
          .by(0.3, { position: v3(0, -5, 0) })
          .delay(0.15);
        tween(arrow).repeatForever(loop).start();
      }
    }
    this.checkMax();
  }

  checkMax(): void {
    if (!this._plantData || !this.mBar || !this.mBarNum) return;
    const t = userDataProxy.getPlantData(this._plantData.id).lv;
    if (battleDataProxy.getPlantAtk(this._plantData.id, 1, t + 1) <= 0) {
      this.mBar.fillRange = 1;
      this.mBarNum.string = 'Max';
      const arrow = this.mBar.node.parent?.getChildByName('arrow');
      if (arrow) arrow.active = false;
    }
  }
}
