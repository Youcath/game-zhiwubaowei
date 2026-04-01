/**
 * 杂交背包界面（原 HybridBagView.js）
 * 列表由 Prefab + mItemContent 构建，替代 2.x List 组件。
 */

import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc';
import { EventManager } from './EventManager';
import { userDataProxy, EUserDataEvent } from './UserDataProxy';
import Util from './Util';
import { gameUIMgr } from './GameUIManager';
import HybridBagItem from './HybridBagItem';

const { ccclass, property } = _decorator;

type HybridPlantSave = { plantId: number; lv: number };

@ccclass('HybridBagView')
export default class HybridBagView extends Component {
  @property(Prefab)
  mHybridBagItemPb: Prefab | null = null;

  @property(Node)
  mWearHybridBagItem: Node | null = null;

  @property(Node)
  mItemContent: Node | null = null;

  @property(Label)
  mStarNum: Label | null = null;

  private _hybridPlantDatas: HybridPlantSave[] = [];
  /** 当前佩戴槽展示的数据（用于事件里区分 wear / 列表索引） */
  private _wearHybridData: HybridPlantSave | null = null;

  onLoad(): void {
    EventManager.instance.on(EUserDataEvent.UPDATE_HYBRID_WEAR_PLANT, this.onUpdateHybridWearPlant, this);
  }

  onDestroy(): void {
    EventManager.instance.off(EUserDataEvent.UPDATE_HYBRID_WEAR_PLANT, this.onUpdateHybridWearPlant, this);
  }

  onEnable(): void {
    this.onUpdateHybridWearPlant();
  }

  onUpdateHybridWearPlant = (): void => {
    const t = userDataProxy.userData.wearHybridPlantId;
    const wearRoot = this.mWearHybridBagItem;
    if (!wearRoot) return;
    const e = wearRoot.getChildByName('BtnAdd');
    const o = wearRoot.getChildByName('HybridBagItem');
    if (!e || !o) return;

    if (t) {
      e.active = false;
      o.active = true;
      const i = userDataProxy.userData.hybridPlantDatas.findIndex((x) => x.plantId === t);
      if (i < 0) {
        console.log('佩戴有误：', t);
        return;
      }
      const dat = userDataProxy.userData.hybridPlantDatas[i]!;
      this._wearHybridData = dat;
      this.setHybridBagItem(dat, o, true, 'wear');
    } else {
      this._wearHybridData = null;
      e.active = true;
      o.active = false;
    }

    const content = this.mItemContent;
    if (!content) return;
    content.removeAllChildren();
    this._hybridPlantDatas = [];
    for (const a of userDataProxy.userData.hybridPlantDatas) {
      if (a.plantId !== t) this._hybridPlantDatas.push(a);
    }
    for (let n = 0; n < this._hybridPlantDatas.length; n++) {
      const data = this._hybridPlantDatas[n]!;
      let cell: Node | null = null;
      if (this.mHybridBagItemPb) {
        cell = instantiate(this.mHybridBagItemPb);
        cell.parent = content;
      }
      if (!cell) continue;
      this.setHybridBagItem(data, cell, false, String(n));
    }
    if (this.mStarNum) this.mStarNum.string = `${userDataProxy.getHybridAllStar()}`;
  };

  private setHybridBagItem(data: HybridPlantSave, itemNode: Node, isWear: boolean, eventKey: string): void {
    itemNode.getComponent(HybridBagItem)?.initHybridBagItem(data);
    const i = itemNode.getChildByName('BtnRemove');
    if (!i) return;
    const wearId = userDataProxy.userData.wearHybridPlantId;
    i.active = isWear || !wearId;
    Util.addButtonListener(itemNode, 'HybridBagView', 'onBagPlantItem', this.node, eventKey);
    Util.addButtonListener(i, 'HybridBagView', 'onBtnRemove', this.node, eventKey);
  }

  onBtnStar(): void {
    gameUIMgr?.showHybridStarPopup();
  }

  onBagPlantItem(_t: unknown, customEventData: string): void {
    const data =
      customEventData === 'wear'
        ? this._wearHybridData
        : this._hybridPlantDatas[Number(customEventData)];
    if (!data) return;
    const isWear = customEventData === 'wear';
    let showWear = !userDataProxy.userData.wearHybridPlantId || userDataProxy.userData.wearHybridPlantId === 0;
    if (isWear) showWear = true;
    gameUIMgr?.showHybridPlantDetailsPopup(data, !isWear, showWear);
  }

  onBtnRemove(_t: unknown, customEventData: string): void {
    const isWear = customEventData === 'wear';
    const data =
      isWear ? this._wearHybridData : this._hybridPlantDatas[Number(customEventData)];
    if (!data) return;
    userDataProxy.userData.wearHybridPlantId = isWear ? 0 : data.plantId;
    userDataProxy.saveData();
    EventManager.instance.emit(EUserDataEvent.UPDATE_HYBRID_WEAR_PLANT);
  }

  updateRemoveBtn(): void {
    const content = this.mItemContent;
    if (!content) return;
    const wearId = userDataProxy.userData.wearHybridPlantId;
    for (const ch of content.children) {
      const btn = ch.getChildByName('BtnRemove');
      if (btn) btn.active = !wearId;
    }
  }
}
