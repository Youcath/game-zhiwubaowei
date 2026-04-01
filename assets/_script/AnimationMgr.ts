/**
 * 奖励飞向 UI 等动画（原 AnimationMgr.js）；无场景挂载，单例直接使用。
 */

import { find, Node, Prefab, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { battleDataProxy } from './BattleDataProxy';
import { DataManager } from './DataManager';
import { Bundles } from './HomeEnum';
import NodePoolManager from './NodePoolManager';
import { PopupManager } from './PopupManager';
import { ResUtil } from './ResUtil';
import ItemAni, { type ItemAniAward } from './ItemAni';

function worldToNodeLocal(targetParent: Node, worldPos: Vec3, out: Vec3): Vec3 {
  const ui = targetParent.getComponent(UITransform);
  if (ui) {
    ui.convertToNodeSpaceAR(worldPos, out);
    return out;
  }
  targetParent.inverseTransformPoint(out, worldPos);
  return out;
}

export default class AnimationMgr {
  private static _instance: AnimationMgr | null = null;
  private _flyItemPb: Prefab | null = null;

  static get instance(): AnimationMgr {
    return (this._instance ??= new AnimationMgr());
  }

  showAwardAni(
    t: ItemAniAward,
    e: Node | null | undefined,
    o: Node | null | undefined,
    i?: number,
    n?: Vec3 | null,
  ): void {
    const d = e ?? PopupManager.instance.getPopupNode();
    if (!d) return;
    const out = new Vec3();
    const start = new Vec3();
    if (o) {
      o.getWorldPosition(out);
      worldToNodeLocal(d, out, start);
    } else {
      start.set(0, 0, 0);
    }
    const m = DataManager.instance.eData.dataitem[String(t.id)] as
      | { icon?: string; id?: number; type?: number }
      | undefined;
    const endPos = n ?? this.getEndPos(m as { id: number; type?: number }, d);
    if (!endPos) return;
    const f = t.num;
    let y = 20;
    if (t.id === 8) y = 30;
    this.getItemIconPrefab(() => {
      for (let idx = 0; idx < f && idx < y; idx++) {
        const flyPb = this._flyItemPb;
        if (!flyPb) break;
        const node = NodePoolManager.instance.getNode(flyPb);
        if (!node) {
          console.error('对象池没获取到');
          break;
        }
        node.setScale(t.id === 8 ? 1 : 0.8, t.id === 8 ? 1 : 0.8, 1);
        const icon = node.getChildByName('itemIcon');
        const spr = icon?.getComponent(Sprite);
        if (m?.icon && spr) {
          void ResUtil.loadAsset({
            path: `textures/item/${m.icon}`,
            type: SpriteFrame,
            bundleName: Bundles.GAME,
          })
            .then((asset) => {
              spr.spriteFrame = asset as SpriteFrame;
            })
            .catch((err) => console.log('error:', err));
        }
        node.parent = d;
        node.getComponent(ItemAni)?.init(t, start, endPos, i);
        node.active = true;
        node.setSiblingIndex(Math.min(node.parent.children.length - 1, 1000));
      }
    });
  }

  getItemIconPrefab(cb?: () => void): void {
    if (this._flyItemPb) {
      cb?.();
      return;
    }
    void ResUtil.loadAsset({
      path: 'prefabs/homeItem/FlyItem',
      type: Prefab,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        const prefab = asset as Prefab;
        prefab.addRef();
        this._flyItemPb = prefab;
        cb?.();
      })
      .catch((err) => console.log('error:', err));
  }

  getEndPos(t: { id: number; type?: number }, e: Node): Vec3 | null {
    const canvas = find('Canvas');
    if (!canvas) return null;
    let target: Node | null = null;
    if (t.id === 1) {
      target = find('Canvas/topUI/goldRoot');
    } else if (t.id === 2) {
      target = find('Canvas/topUI/diamondRoot');
    } else if (t.id === 4 || t.id === 6 || t.id === 7) {
      target = find('Canvas/downUI/BtnShop');
    } else if (t.id === 3) {
      target = find('Canvas/topUI/physicalRoot');
    } else if (t.id === 9) {
      target = find('Canvas/topUI/manureRoot');
    } else if (t.type === 2) {
      target = find('Canvas/downUI/BtnPlant');
    } else if (t.type === 5 || t.id === 5 || t.id === 8) {
      target = battleDataProxy.sunshineRoot;
    }
    if (t.id >= 2001) {
      return new Vec3(-106, 602, 0);
    }
    if (!target) return null;
    const w = new Vec3();
    target.getWorldPosition(w);
    const local = new Vec3();
    return worldToNodeLocal(e, w, local);
  }

  usePowerAni(t = 1): void {
    const canvas = find('Canvas');
    if (!canvas) return;
    this.getItemIconPrefab(() => {
      const flyPb = this._flyItemPb;
      if (!flyPb) return;
      const node = NodePoolManager.instance.getNode(flyPb);
      if (!node) return;
      const n = node.getChildByName('itemIcon');
      const spr = n?.getComponent(Sprite);
      void ResUtil.loadAsset({
        path: 'textures/item/icon_3',
        type: SpriteFrame,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          if (spr) spr.spriteFrame = asset as SpriteFrame;
        })
        .catch((err) => console.log('error:', err));
      const physicalBox = find('Canvas/TopLayer/physicalBox');
      const battleBtn =
        t === 1 ? find('Canvas/UILayer/HomeView/battleStarBtn') : find('Canvas/UILayer/HomeView/saodanBox');
      if (!physicalBox || !battleBtn) return;
      const uit = canvas.getComponent(UITransform);
      if (!uit) return;
      const lw = new Vec3();
      const pw = new Vec3();
      physicalBox.getWorldPosition(lw);
      battleBtn.getWorldPosition(pw);
      const lLocal = new Vec3();
      const pLocal = new Vec3();
      uit.convertToNodeSpaceAR(lw, lLocal);
      uit.convertToNodeSpaceAR(pw, pLocal);
      node.setScale(1.2, 1.2, 1);
      node.parent = canvas;
      node.setPosition(lLocal);
      node.active = true;
      node.getComponent(ItemAni)?.init2(pLocal, 0.5);
    });
  }

  getCardAni(): void {
    void 0;
  }
}
