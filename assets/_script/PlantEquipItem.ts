/**
 * 植物背包列表项（原 PlantEquipItem.js）
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
import { battleDataProxy, EBattleEvent } from './BattleDataProxy';
import { userDataProxy, EUserDataEvent } from './UserDataProxy';
import Util from './Util';
import { gameUIMgr } from './GameUIManager';

const { ccclass, property } = _decorator;

export type DataplantEquipRow = {
  id: number;
  name: string;
  qulity: number;
  stageID: number;
  needItem: number;
  needNum: string;
};

@ccclass('PlantEquipItem')
export default class PlantEquipItem extends Component {
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

  @property(Node)
  mLockTips: Node | null = null;

  @property(Node)
  mLock: Node | null = null;

  private _isUnlock = false;
  private _plantData: DataplantEquipRow | null = null;
  private _isShowWear = false;

  initPlantEquipItem(t: DataplantEquipRow, isUnlock: boolean, showWear: boolean): void {
    this._plantData = t;
    this._isUnlock = isUnlock;
    const btn = this.node.getComponent(Button);
    if (btn) btn.interactable = isUnlock;
    if (this.mBtnRemove) this.mBtnRemove.active = !!isUnlock && showWear;
    this._isShowWear = showWear;
    if (this.mBtnDetails) {
      this.mBtnDetails.active = false;
      this.mBtnDetails.setSiblingIndex(1);
    }
    if (this.mBtnRemove) this.mBtnRemove.setSiblingIndex(1);
    const self = this;
    void ResUtil.loadAsset({
      path: `textures/public/pic_zhiwukuang_${t.qulity}`,
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
        if (self.mPlantImg) self.mPlantImg.spriteFrame = atlas.getSpriteFrame(`pic_plant${t.id}`) ?? null;
      })
      .catch((err) => console.log('error:', err));
    this.updatePlantLevel();
    if (this.mLockTips) this.mLockTips.active = !isUnlock;
    if (this.mLock) this.mLock.active = !isUnlock;
    const colors = userDataProxy.mPlantColors;
    if (isUnlock) {
      if (this.mGreadBg) Util.setSpriteNormalMaterial(this.mGreadBg);
      if (this.mPlantImg) Util.setSpriteNormalMaterial(this.mPlantImg);
      if (this.mLvLab) this.mLvLab.node.active = true;
      if (this.mBar) this.mBar.node.parent!.active = true;
      const c = colors[t.qulity - 2];
      if (c && this.mPlantName) this.mPlantName.color = new Color().fromHEX(c);
      if (c && this.mLvLab) this.mLvLab.color = new Color().fromHEX(c);
    } else {
      if (this.mGreadBg) Util.setSpriteGrayMaterial(this.mGreadBg);
      if (this.mPlantImg) Util.setSpriteGrayMaterial(this.mPlantImg);
      if (this.mPlantName) this.mPlantName.color = new Color(75, 75, 75);
      if (this.mLvLab) this.mLvLab.node.active = false;
      if (this.mBar) this.mBar.node.parent!.active = false;
      const tips = this.mLock?.getChildByName('unlockTips')?.getComponent(Label);
      if (tips) tips.string = `通过第${t.stageID}章后解锁`;
    }
  }

  setIsShowWear(t: boolean): void {
    if (this.mBtnRemove) {
      this.mBtnRemove.active = this._isUnlock ? t : false;
    }
  }

  onItemClick(): void {
    if (this._plantData) {
      gameUIMgr?.showPlantEquipDetailsPopup(this._plantData, true, 0, this._isShowWear);
    }
  }

  onBtnDetails(): void {
    if (this._plantData) {
      gameUIMgr?.showPlantEquipDetailsPopup(this._plantData, true, 0, this._isShowWear);
    }
  }

  onBtnRemove(): void {
    if (!this._plantData) return;
    let slot = -1;
    for (let e = 0; e < 4 && userDataProxy.getWearItemIsUnlock(e).isUnlock; ++e) {
      const eq = userDataProxy.combatEqus[e];
      if (!eq || eq === 0) {
        slot = e;
        break;
      }
    }
    if (slot !== -1) {
      userDataProxy.userData.combatEqus[slot] = this._plantData.id;
      userDataProxy.saveData();
      if (userDataProxy.userData.gameCourseData.curId === 4) {
        userDataProxy.completeCourse(5);
        EventManager.instance.emit(EBattleEvent.LOSE_COURSE_VIEW);
      }
      EventManager.instance.emit(EUserDataEvent.UPDATE_WEAR_PLANT);
      EventManager.instance.emit(EUserDataEvent.UPDATE_UNLOCK_PLANT);
    } else {
      gameUIMgr?.showTips('没有位置了');
    }
  }

  updatePlantLevel(): void {
    if (!this._plantData || !this.mPlantName || !this.mLvLab || !this.mBar || !this.mBarNum) return;
    this.mPlantName.string = this._plantData.name;
    const lv = userDataProxy.getPlantData(this._plantData.id).lv;
    this.mLvLab.string = `Lv.${lv}`;
    const e = userDataProxy.getPropDatas(this._plantData.needItem);
    const needParts = this._plantData.needNum.split('|');
    const o = Number(needParts[lv - 1] ?? 0);
    this.mBar.fillRange = o > 0 ? e / o : 0;
    this.mBarNum.string = `${e}/${o}`;
    const parent = this.mBar.node.parent;
    const arrow = parent?.getChildByName('arrow');
    if (arrow) {
      arrow.active = e >= o;
      arrow.setPosition(arrow.position.x, 6.529, arrow.position.z);
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
