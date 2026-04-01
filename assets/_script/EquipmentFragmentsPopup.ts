/**
 * 装备宝箱碎片等级预览（原 EquipmentFragmentsPopup.js）
 */

import { _decorator, instantiate, Label, Node, Sprite, SpriteFrame } from 'cc';
import { DataManager } from './DataManager';
import { Bundles } from './HomeEnum';
import { PopupBase } from './PopupBase';
import { ResUtil } from './ResUtil';
import { userDataProxy } from './UserDataProxy';

const { ccclass } = _decorator;

type ShopBoxRow = { reward?: string; bigReward?: string };

@ccclass('EquipmentFragmentsPopup')
export default class EquipmentFragmentsPopup extends PopupBase {
  private _curLevel = 1;

  override init(params?: unknown): void {
    super.init(params);
    let lv = userDataProxy.userData.boxData?.level ?? 1;
    if (lv < 1) lv = 1;
    else if (lv > 10) lv = 10;
    this._curLevel = lv;
    this.initView();
  }

  private initView(): void {
    const row = DataManager.instance.eData.datashopbox[String(this._curLevel)] as ShopBoxRow | undefined;
    if (!row) return;

    const levelLabel = this.node.getChildByName('levelLabel')?.getComponent(Label);
    if (levelLabel) levelLabel.string = `Lv.${this._curLevel}`;

    const rewards = (row.reward ?? '').split('|').filter((s) => s !== '');
    this.updateAwardList(rewards, 'contant1');
    const bigRewards = (row.bigReward ?? '').split('|').filter((s) => s !== '');
    this.updateAwardList(bigRewards, 'contant2');

    const leftBtn = this.node.getChildByName('leftBtn');
    const rightBtn = this.node.getChildByName('rightBtn');
    if (leftBtn) leftBtn.active = this._curLevel > 1;
    if (rightBtn) rightBtn.active = this._curLevel < 10;
  }

  private updateAwardList(parts: string[], containerName: string): void {
    const o = this.node.getChildByName(containerName);
    if (!o) return;
    for (const c of o.children) {
      c.active = false;
    }
    const template = o.children[0];
    if (!template) return;

    for (let e = 0; e < parts.length; e++) {
      const seg = parts[e]!;
      const pair = seg.split('_');
      if (pair.length !== 2) continue;
      const itemRow = DataManager.instance.eData.dataitem[pair[0]!] as { icon?: string } | undefined;
      if (!itemRow?.icon) continue;

      let cell = o.children[e];
      if (!cell) {
        cell = instantiate(template);
        cell.parent = o;
      }

      const spr = cell.getChildByName('icon')?.getComponent(Sprite);
      if (spr) {
        void ResUtil.loadAsset({
          path: `textures/item/${itemRow.icon}`,
          type: SpriteFrame,
          bundleName: Bundles.GAME,
        })
          .then((t) => {
            if (spr.isValid) spr.spriteFrame = t as SpriteFrame;
          })
          .catch((err) => console.log('error:', err));
      }
      const numLab = cell.getChildByName('numLabel')?.getComponent(Label);
      if (numLab) numLab.string = `x${pair[1]}`;
      cell.active = true;
    }
  }

  onClickLeftBtn(): void {
    this._curLevel -= 1;
    if (this._curLevel < 1) this._curLevel = 1;
    this.initView();
  }

  onClickRightBtn(): void {
    this._curLevel += 1;
    if (this._curLevel > 10) this._curLevel = 10;
    this.initView();
  }
}
