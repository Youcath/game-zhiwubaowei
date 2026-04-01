/**
 * 植物界面（原 HomePlantView.js）
 */

import { _decorator, Component, Node } from 'cc';
import { EventManager } from './EventManager';
import { DataManager } from './DataManager';
import { battleDataProxy, EBattleEvent } from './BattleDataProxy';
import { userDataProxy, EUserDataEvent } from './UserDataProxy';
import PlantEquipItem, { type DataplantEquipRow } from './PlantEquipItem';
import WearPlantItem from './WearPlantItem';
import { Prefab } from 'cc';
import { instantiate } from 'cc';

const { ccclass, property } = _decorator;

type DataplantRow = DataplantEquipRow & { use?: number; stageID?: number };

@ccclass('HomePlantView')
export default class HomePlantView extends Component {
  @property(Prefab)
  mPlantEquipItemPb: Prefab | null = null;

  @property(Node)
  mWearLayout: Node | null = null;

  @property(Node)
  mUnlockItemLayout: Node | null = null;

  @property(Node)
  mLockItemLayout: Node | null = null;

  private _unlockPlantDatas: DataplantEquipRow[] = [];
  private _lockPlantDatas: DataplantEquipRow[] = [];

  onLoad(): void {
    EventManager.instance.on(EUserDataEvent.UPDATE_UNLOCK_PLANT, this.updateUnlockPlantLayout, this);
    EventManager.instance.on(EUserDataEvent.UPDATE_WEAR_PLANT, this.updateWearPlant, this);
    EventManager.instance.on(EUserDataEvent.UPDATE_PLANT_LEVEL, this.updatePlantLevel, this);
    EventManager.instance.on(EUserDataEvent.CLOSE_EQUIP_DETAILS, this.closeEquipDetails, this);
  }

  onDestroy(): void {
    EventManager.instance.off(EUserDataEvent.UPDATE_UNLOCK_PLANT, this.updateUnlockPlantLayout, this);
    EventManager.instance.off(EUserDataEvent.UPDATE_WEAR_PLANT, this.updateWearPlant, this);
    EventManager.instance.off(EUserDataEvent.UPDATE_PLANT_LEVEL, this.updatePlantLevel, this);
    EventManager.instance.off(EUserDataEvent.CLOSE_EQUIP_DETAILS, this.closeEquipDetails, this);
  }

  onEnable(): void {
    this.updateWearPlant();
    this.updateUnlockPlantLayout();
    const ud = userDataProxy.userData;
    if (ud.gameCourseData.curId === 4 && this.mUnlockItemLayout && this.mUnlockItemLayout.children.length > 0) {
      this.scheduleOnce(() => {
        const first = this.mUnlockItemLayout!.children[0];
        const btn = first?.getChildByName('BtnRemove');
        userDataProxy.changeGold(1000);
        userDataProxy.addProp(1003, 5);
        userDataProxy.showCourse({
          courseId: 5,
          isGame: false,
          targetNode: btn ?? undefined,
        });
      }, 0.15);
    }
  }

  onDisable(): void {
    userDataProxy.completeCourse(8);
    EventManager.instance.emit(EBattleEvent.LOSE_COURSE_VIEW);
  }

  closeEquipDetails(): void {
    if (userDataProxy.userData.gameCourseData.curId !== 7) return;
    const scroll = this.node.getChildByName('scrollView');
    if (!scroll) return;
    const onTouch = (): void => {
      userDataProxy.completeCourse(8);
      EventManager.instance.emit(EBattleEvent.LOSE_COURSE_VIEW);
    };
    scroll.once(Node.EventType.TOUCH_START, onTouch, this);
    userDataProxy.showCourse({
      courseId: 8,
      isGame: false,
      targetNode: scroll,
    });
  }

  updatePlantLevel(): void {
    if (this.mWearLayout) {
      for (const c of this.mWearLayout.children) {
        c.getComponent(WearPlantItem)?.updatePlantLevel();
      }
    }
    if (this.mUnlockItemLayout) {
      for (const c of this.mUnlockItemLayout.children) {
        c.getComponent(PlantEquipItem)?.updatePlantLevel();
      }
    }
  }

  updateWearPlant(): void {
    if (!this.mWearLayout) return;
    const t = this.mWearLayout.children;
    t.forEach((n) => {
      n.active = false;
    });
    for (let e = 0; e < t.length; ++e) {
      const o = t[e]!;
      o.active = true;
      const i = userDataProxy.getWearItemIsUnlock(e);
      o.getComponent(WearPlantItem)?.initWearPlantItem(i.isUnlock, e, i.unlockChapter);
    }
    if (userDataProxy.userData.gameCourseData.curId === 5) {
      userDataProxy.showCourse({
        courseId: 6,
        isGame: false,
        targetNode: t[0],
      });
    }
  }

  updateUnlockPlantLayout(slot?: number): void {
    this.initLayoutPlantIds();
    if (this.mUnlockItemLayout) {
      this.mUnlockItemLayout.children.forEach((n) => {
        n.active = false;
      });
      if (this.mUnlockItemLayout.parent) {
        this.mUnlockItemLayout.parent.active = this._unlockPlantDatas.length > 0;
      }
      for (let o = 0; o < this._unlockPlantDatas.length; ++o) {
        let cell = this.mUnlockItemLayout.children[o];
        if (!cell && this.mPlantEquipItemPb) {
          cell = instantiate(this.mPlantEquipItemPb);
          cell.parent = this.mUnlockItemLayout;
        }
        if (!cell) continue;
        cell.active = true;
        cell.getComponent(PlantEquipItem)?.initPlantEquipItem(this._unlockPlantDatas[o]!, true, this.getIsShowDetails());
      }
    }
    if (this.mLockItemLayout) {
      this.mLockItemLayout.children.forEach((n) => {
        n.active = false;
      });
      if (this.mLockItemLayout.parent) {
        this.mLockItemLayout.parent.active = this._lockPlantDatas.length > 0;
      }
      for (let o = 0; o < this._lockPlantDatas.length; ++o) {
        let cell = this.mLockItemLayout.children[o];
        if (!cell && this.mPlantEquipItemPb) {
          cell = instantiate(this.mPlantEquipItemPb);
          cell.parent = this.mLockItemLayout;
        }
        if (!cell) continue;
        cell.active = true;
        cell.getComponent(PlantEquipItem)?.initPlantEquipItem(this._lockPlantDatas[o]!, false, this.getIsShowDetails());
      }
      this.mUnlockItemLayout?.children.forEach((t) => {
        t.getComponent(PlantEquipItem)?.setIsShowWear(this.getIsShowDetails());
      });
    }
    if (typeof slot === 'number') {
      const n = this.mWearLayout?.children[slot];
      const a = userDataProxy.getWearItemIsUnlock(slot);
      n?.getComponent(WearPlantItem)?.initWearPlantItem(a.isUnlock, slot, a.unlockChapter);
    }
  }

  getIsShowDetails(): boolean {
    let emptySlot = -1;
    for (let e = 0; e < 4 && userDataProxy.getWearItemIsUnlock(e).isUnlock; ++e) {
      const eq = userDataProxy.combatEqus[e];
      if (!eq || eq === 0) {
        emptySlot = e;
        break;
      }
    }
    return emptySlot !== -1;
  }

  initLayoutPlantIds(): void {
    this._unlockPlantDatas = [];
    this._lockPlantDatas = [];
    const t = DataManager.instance.eData.dataplant as Record<string, DataplantRow>;
    const pass = userDataProxy.userData.passChapter;
    for (const o in t) {
      if (!Object.prototype.hasOwnProperty.call(t, o)) continue;
      const i = t[o]!;
      if (i.use === 1) {
        if ((i.stageID ?? 0) < pass + 1) {
          if (userDataProxy.userData.combatEqus.indexOf(i.id) < 0) {
            this._unlockPlantDatas.push(i);
          }
        } else {
          this._lockPlantDatas.push(i);
        }
      }
    }
  }
}
