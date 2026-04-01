/**
 * 通用飞物品动画（原 FlyItemAnimCtrl2.js）
 */

import { _decorator, Component, Node, Prefab, Sprite, SpriteFrame, UITransform, v3, Vec3 } from 'cc';
import { topNode } from './AppBase';
import { AudioManager } from './AudioManager';
import { AnimUtil } from './AnimUtils';
import { EventManager } from './EventManager';
import { Bundles } from './HomeEnum';
import NodePoolManager from './NodePoolManager';
import { ResUtil } from './ResUtil';
import Util from './Util';

const { ccclass, property } = _decorator;

export const EFlyItemAnimEvent = {
  FLY_ITEM_ANIM: 'EFlyItemAnimEvent.fly_item_anim',
} as const;

export enum E_ItemIDType {
  GOLD = 1,
  DIAMOND = 2,
  Star = 3,
  EnergySone = 4,
}

export interface IFlyItemAnimArg {
  itemId: number;
  startWorldPos: Vec3;
  endWorldPos?: Vec3;
  itemNum: number;
  iconPath: string;
  iconScale?: number;
  onComplete?: () => void;
}

@ccclass('FlyItemAnimCtrl2')
export default class FlyItemAnimCtrl2 extends Component {
  @property(Prefab)
  pFlyItem: Prefab | null = null;

  @property(Node)
  endNode1: Node | null = null;

  @property(Node)
  endNode2: Node | null = null;

  @property(Node)
  endNode3: Node | null = null;

  @property(Node)
  endNode4: Node | null = null;

  onLoad(): void {
    EventManager.instance.on(EFlyItemAnimEvent.FLY_ITEM_ANIM, this.flyItemAnim, this);
  }

  onDestroy(): void {
    EventManager.instance.off(EFlyItemAnimEvent.FLY_ITEM_ANIM, this.flyItemAnim, this);
  }

  getFlyTargetNode(t: number): Node | null {
    const k = `endNode${t}` as keyof this;
    return (this[k] as Node | null) ?? null;
  }

  flyItemAnim(t: IFlyItemAnimArg): void {
    const endN = this.getFlyTargetNode(t.itemId);
    let worldEnd: Vec3;
    if (endN != null) {
      const ut = endN.getComponent(UITransform);
      const wp = ut?.convertToWorldSpaceAR(v3(0, 0, 0)) ?? endN.worldPosition.clone();
      worldEnd = wp;
    } else {
      if (t.endWorldPos == null) return;
      worldEnd = t.endWorldPos;
    }
    const parent = topNode ?? this.node;
    const startLocal = Util.nodeLocalPos(parent, t.startWorldPos.clone());
    const endLocal = Util.nodeLocalPos(parent, worldEnd);
    let num = t.itemNum;
    if (num > 20) num = 20;
    const poolPrefab = this.pFlyItem;
    if (poolPrefab == null) return;
    const items: Node[] = [];
    for (let y = 0; y < num; ++y) {
      const e = NodePoolManager.instance.getNode(poolPrefab);
      parent.addChild(e);
      void ResUtil.loadAsset({
        bundleName: Bundles.GAME,
        path: t.iconPath,
        type: SpriteFrame,
      })
        .then((sf) => {
          const sp = e.getComponent(Sprite);
          if (sp != null) sp.spriteFrame = sf as SpriteFrame;
          e.setScale(t.iconScale ?? 1, t.iconScale ?? 1, 1);
        })
        .catch(() => {});
      e.setPosition(startLocal.clone());
      items.push(e);
    }
    if (t.itemId === E_ItemIDType.GOLD) {
      AudioManager.instance.playEffectPath('sounds/coin_001', Bundles.RES);
    } else if (t.itemId === E_ItemIDType.DIAMOND || t.itemId === E_ItemIDType.Star) {
      AudioManager.instance.playEffectPath('sounds/diamod_001', Bundles.RES);
    }
    const i = startLocal;
    const n = endLocal;
    AnimUtil.flyItemAnim(items, 35, i, n, 20, () => {
      items.forEach((node) => NodePoolManager.instance.putNode(node));
      t.onComplete?.();
    });
  }
}
