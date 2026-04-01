/**
 * 超级植物图鉴（原 SuperPlantMapPopup.js）
 * 列表用 Prefab + 父节点替代 2.x List。
 */

import { _decorator, Color, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { DataManager } from './DataManager';
import { Bundles } from './HomeEnum';
import { PopupBase } from './PopupBase';
import { ResUtil } from './ResUtil';
import Util from './Util';
import { userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

type PlantRow = { id?: number; name?: string; skillId?: string };

@ccclass('SuperPlantMapPopup')
export default class SuperPlantMapPopup extends PopupBase {
  @property(Node)
  mListContent: Node | null = null;

  @property(Prefab)
  mRowPrefab: Prefab | null = null;

  private _plantDatas: PlantRow[] = [];

  override init(params?: unknown): void {
    super.init(params);
    const t = DataManager.instance.eData.dataplant as Record<string, PlantRow>;
    this._plantDatas = [];
    for (const k in t) {
      this._plantDatas.push(t[k]!);
    }
  }

  override onShow(): void {
    super.onShow();
    const content = this.mListContent;
    const pb = this.mRowPrefab;
    if (!content || !pb) return;
    content.removeAllChildren();
    for (let i = 0; i < this._plantDatas.length; i++) {
      const row = instantiate(pb);
      row.parent = content;
      this.fillRow(row, this._plantDatas[i]!);
    }
  }

  private fillRow(t: Node, o: PlantRow): void {
    const pid = o.id ?? 0;
    const unlocked = this.getSuperPlantIsUnlock(pid);
    const bg2 = t.getChildByName('bg2');
    const bg1 = t.getChildByName('bg1');
    const r = t.getChildByName('plantImg')?.getComponent(Sprite);
    const c = t.getChildByName('plantName')?.getComponent(Label);
    if (bg1) bg1.active = !unlocked;
    if (bg2) bg2.active = unlocked;

    if (r) {
      void ResUtil.loadAsset({
        path: `textures/superBigImg/pic_CWplant${pid}`,
        type: SpriteFrame,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          if (r.isValid) r.spriteFrame = asset as SpriteFrame;
        })
        .catch((e) => console.log('error:', e));
    }
    if (c) {
      c.string = unlocked ? (o.name ?? '') : '未解锁';
      c.color = unlocked ? new Color().fromHEX('#FFEC4A') : new Color(125, 125, 125);
      /** 3.8+ 描边在 Label 上（`enableOutline`/`outlineColor`），不再依赖独立 `LabelOutline` 组件 */
      c.enableOutline = true;
      if (c.outlineWidth <= 0) c.outlineWidth = 2;
      c.outlineColor = unlocked ? new Color().fromHEX('#4D2A1E') : new Color(75, 75, 75);
      if (r) {
        if (unlocked) Util.setSpriteNormalMaterial(r);
        else Util.setSpriteGrayMaterial(r);
      }
    }
  }

  private getSuperPlantIsUnlock(t: number): boolean {
    const lv = userDataProxy.getPlantData(t).lv ?? 0;
    return lv >= this.getSuperUnlockLevel(t);
  }

  private getSuperUnlockLevel(t: number): number {
    const row = DataManager.instance.eData.dataplant[String(t)] as PlantRow | undefined;
    const skillId = row?.skillId ?? '';
    const e = skillId.split('|').map(Number);
    for (let o = 0; o < e.length; o++) {
      if (e[o]! % 1e4 === 5) {
        return o + 1;
      }
    }
    return 5;
  }
}
