/**
 * 促销/引导去植物页（原 PromoteTipsPopup.js）
 */

import { _decorator, Node } from 'cc';
import { EGameEvent } from './GameEnum';
import { EventManager } from './EventManager';
import { PopupBase } from './PopupBase';
import RedDotMgr from './RedDotMgr';

const { ccclass, property } = _decorator;

@ccclass('PromoteTipsPopup')
export default class PromoteTipsPopup extends PopupBase {
  @property(Node)
  mShopItem: Node | null = null;

  override init(params?: unknown): void {
    super.init(params);
    if (this.mShopItem) {
      this.mShopItem.active = RedDotMgr.instance.getPlantRedIsShow();
    }
  }

  /** 按钮 customEventData 传底栏索引（与 OPEN_HOME_VIEW 一致） */
  onItemClick(_t: unknown, e: string): void {
    EventManager.instance.emit(EGameEvent.OPEN_HOME_VIEW, Number(e));
    this.removeUI();
  }
}
