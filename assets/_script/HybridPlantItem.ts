/**
 * 杂交植物选择格（原 HybridPlantItem.js）
 */

import { _decorator, Color, Component, Label, Node, Sprite, SpriteAtlas, SpriteFrame } from 'cc';
import { ResUtil } from './ResUtil';
import { Bundles } from './HomeEnum';
import { DataManager } from './DataManager';
import { userDataProxy } from './UserDataProxy';
import Util from './Util';

const { ccclass, property } = _decorator;

export type DataplantHybridRow = {
  id: number;
  name: string;
  qulity: number;
  type1?: number;
  /** 表字段，解锁关卡条件 */
  stageID?: number;
  /** 图集子图名 */
  icon?: string;
};

@ccclass('HybridPlantItem')
export default class HybridPlantItem extends Component {
  private _plantData: DataplantHybridRow | null = null;
  private _isUnlock = false;
  private _selectPlantIds: number[] = [];

  get plantData(): DataplantHybridRow {
    return this._plantData!;
  }

  get isUnlock(): boolean {
    return this._isUnlock;
  }

  setHybridPlantData(t: DataplantHybridRow, isUnlock: boolean, selectIds: number[]): void {
    this._plantData = t;
    this._isUnlock = isUnlock;
    this._selectPlantIds = selectIds;
    const gradeBg = this.node.getChildByName('gradeBg');
    const plantIcon = this.node.getChildByName('plantIcon');
    const plantName = this.node.getChildByName('plantName')?.getComponent(Label);
    const selectMask = this.node.getChildByName('selectMask');
    const lock = this.node.getChildByName('lock');
    if (selectMask) selectMask.active = this.getIsSelect();
    if (lock) lock.active = !isUnlock;
    if (plantName) plantName.string = t.name;
    const iSpr = gradeBg?.getComponent(Sprite);
    const nSpr = plantIcon?.getComponent(Sprite);
    void ResUtil.loadAsset({
      path: `textures/public/pic_zhiwukuang_${t.qulity}`,
      type: SpriteFrame,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        if (iSpr) iSpr.spriteFrame = asset as SpriteFrame;
      })
      .catch((err) => console.log('error:', err));
    void ResUtil.loadAsset({
      path: 'textures/botanyIcon/BotanyIcon',
      type: SpriteAtlas,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        const atlas = asset as SpriteAtlas;
        if (nSpr) nSpr.spriteFrame = atlas.getSpriteFrame(`pic_plant${t.id}`) ?? null;
      })
      .catch((err) => console.log('error:', err));
    const h = lock?.getChildByName('unlockTips')?.getComponent(Label);
    const d = Number(DataManager.instance.eData.datapara['73']?.num ?? 0);
    if (h) {
      h.string = `等级${d}解锁`;
      h.node.setScale(0.85, 0.85, 1);
      h.node.setPosition(h.node.position.x, -60, h.node.position.z);
    }
    if (isUnlock) {
      if (iSpr) Util.setSpriteNormalMaterial(iSpr);
      if (nSpr) Util.setSpriteNormalMaterial(nSpr);
      if (plantName) plantName.color = new Color(255, 255, 255);
    } else {
      if (iSpr) Util.setSpriteGrayMaterial(iSpr);
      if (nSpr) Util.setSpriteGrayMaterial(nSpr);
      if (plantName) plantName.color = new Color(75, 75, 75);
    }
  }

  setSelectIsShow(v: boolean): void {
    this.node.getChildByName('selectMask')!.active = v;
  }

  getIsCanSelect(): boolean {
    return !this.node.getChildByName('selectMask')!.active;
  }

  getIsSelect(): boolean {
    const d = userDataProxy.userData.hybridData;
    const id = this._plantData?.id;
    if (id == null) return false;
    return (
      d.plant1 === id ||
      d.plant2 === id ||
      this._selectPlantIds[0] === id ||
      this._selectPlantIds[1] === id
    );
  }
}
