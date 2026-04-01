/**
 * 自选超级植物（原 SelectSuperPlantPopup.js）
 */

import { _decorator, Button, Label, Node, Sprite, SpriteAtlas } from 'cc';
import { battleDataProxy, EBattleEvent } from './BattleDataProxy';
import { DataManager } from './DataManager';
import { Bundles } from './HomeEnum';
import { EventManager } from './EventManager';
import { PopupBase } from './PopupBase';
import { ResUtil } from './ResUtil';

const { ccclass, property } = _decorator;

@ccclass('SelectSuperPlantPopup')
export default class SelectSuperPlantPopup extends PopupBase {
  @property(Node)
  mItemLayout: Node | null = null;

  override init(params?: unknown): void {
    super.init(params);
    const t = battleDataProxy.superFrameDatas;
    const layout = this.mItemLayout;
    if (!layout) return;
    const e = layout.getChildByName('items1');
    const o = layout.getChildByName('items2');
    if (o) o.active = t.length > 2;
    if (e) {
      for (const c of e.children) c.active = false;
    }
    if (o) {
      for (const c of o.children) c.active = false;
    }

    for (let i = 0; i < t.length; i++) {
      const a = t[i]!;
      const r = i >= 2 ? o?.children[i - 2] : e?.children[i];
      if (!r) continue;
      r.active = true;
      const c = r.getChildByName('plantIcon');
      const p = r.getChildByName('plantName');
      const row = DataManager.instance.eData.dataplant[String(a.plantId)] as { name?: string } | undefined;
      const nameLab = p?.getComponent(Label);
      if (nameLab) nameLab.string = `超级${row?.name ?? ''}`;
      const spr = c?.getComponent(Sprite);
      if (spr) spr.spriteFrame = a.frame;

      const m = r.getChildByName('btnSelect');
      if (m) {
        m.off(Button.EventType.CLICK);
        m.on(Button.EventType.CLICK, () => this.onBtnSelectPlant(a.plantId), this);
      }

      const f = r.getChildByName('normalBg')?.getChildByName('normalIcon');
      if (f) {
        void ResUtil.loadAsset({
          path: 'textures/botanyIcon/BotanyIcon',
          type: SpriteAtlas,
          bundleName: Bundles.GAME,
        })
          .then((atlas) => {
            const fs = f.getComponent(Sprite);
            if (!fs?.isValid) return;
            fs.spriteFrame = (atlas as SpriteAtlas).getSpriteFrame(`pic_plant${a.plantId}`);
          })
          .catch((err) => console.log('error:', err));
      }
    }
  }

  override onShow(): void {
    super.onShow();
  }

  private onBtnSelectPlant(plantId: number): void {
    battleDataProxy.battleData.superPlantId = plantId;
    EventManager.instance.emit(EBattleEvent.SELECT_SUPER_PLANT);
    this.removeUI();
  }
}
