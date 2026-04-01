/**
 * 通用恭喜获得弹窗（原 CongratsGettingPopup.js）
 */

import {
  _decorator,
  Color,
  instantiate,
  Label,
  Layout,
  Node,
  Sprite,
  SpriteFrame,
  sp,
  v3,
} from 'cc';
import { DataManager } from './DataManager';
import { PopupBase } from './PopupBase';
import { Bundles } from './HomeEnum';
import { ResUtil } from './ResUtil';
import { userDataProxy } from './UserDataProxy';
import Util from './Util';
import AnimationMgr from './AnimationMgr';

const { ccclass } = _decorator;

type PopupArgs = { list: { id: number; num: number }[]; type: number };
type InitParams = { args: PopupArgs; title?: string; isGray?: boolean };
type AwardRow = { id: string; num: number; noSave?: boolean };

@ccclass('CongratsGettingPopup')
export default class CongratsGettingPopup extends PopupBase {
  private _awardsList: AwardRow[] = [];
  private _contant: Node | null = null;
  private _data: PopupArgs | null = null;

  override init(params?: unknown): void {
    super.init(params);
    const t = params as InitParams | undefined;
    if (!t?.args) return;
    this._data = t.args;
    const title = t.title;
    const gray = t.isGray;
    const n = this.node.getChildByName('pic_huode_title_di');
    const a = n?.getChildByName('New Label');
    if (n && gray) {
      const spr = n.getComponent(Sprite);
      if (spr) Util.setSpriteGrayMaterial(spr);
      const lab = a?.getComponent(Label);
      if (lab) lab.color = new Color(125, 125, 125);
    }
    if (title && a) {
      const lab = a.getComponent(Label);
      if (lab) lab.string = title;
    }
    this.scheduleOnce(() => {
      this.initView();
    });
  }

  private initView(): void {
    if (!this._data) return;
    const getBtn = this.node.getChildByName('getBtn');
    if (getBtn) getBtn.active = false;
    const e = this.node.getChildByName('contant');
    const o = this.node.getChildByName('aniLayer');
    if (!e || !o) return;
    this._awardsList = userDataProxy.checkBoxRetrunAwards(this._data.list) as AwardRow[];
    const i = this._data.type;
    let n = v3(0, 0, 0);
    if (this._awardsList.length > 4) {
      n.x = -260;
      n.y = 300;
    } else {
      n.x = 82.5 - 82.5 * this._awardsList.length;
    }
    let a = 0;
    if (i !== 1) {
      const titleDi = this.node.getChildByName('pic_huode_title_di');
      if (titleDi) titleDi.active = false;
      a = 1;
      const shopSummon = this.node.getChildByName('shop_summon');
      const s = shopSummon?.getComponent(sp.Skeleton);
      if (s) {
        s.node.active = true;
        s.setSkin(`baoxiang${i - 1}`);
        this.scheduleOnce(() => {
          s.clearTracks();
          s.setAnimation(0, 'open', false);
          s.setCompleteListener((te) => {
            void te?.animation?.name;
            if (titleDi) titleDi.active = true;
            s.node.active = false;
            const spawnCard = (idx: number): void => {
              const tpl = this.node.getChildByName('shop_summon_card');
              if (!tpl) return;
              const card = instantiate(tpl);
              card.parent = o;
              const r = v3(n.x + (idx % 4) * 168, n.y - (210 * Math.floor(idx / 4) - 25), 0);
              card.setPosition(r);
              card.active = true;
              const sk = card.getComponent(sp.Skeleton);
              sk?.setAnimation(0, 'Knapsack_1', false);
              sk?.setCompleteListener(() => {
                const cell = e.children[idx];
                if (cell) cell.active = true;
              });
            };
            for (let r = 0; r < this._awardsList.length; r++) {
              spawnCard(r);
            }
          });
        });
      }
    }
    e.active = true;
    e.children.forEach((t) => {
      t.active = false;
    });
    this._contant = e;
    this.scheduleOnce(() => {
      const total = this._awardsList.length;
      for (let oi = 0; oi < total; oi++) {
        const row = DataManager.instance.eData.dataitem[this._awardsList[oi]!.id] as
          | { qulity?: number; icon?: string; name?: string }
          | undefined;
        if (row) {
          let p = e.children[oi];
          if (!p) {
            const first = e.children[0];
            if (first) {
              p = instantiate(first);
              p.parent = e;
            }
          }
          if (!p) continue;
          const h = p.getChildByName('qimg')?.getComponent(Sprite);
          void ResUtil.loadAsset({
            path: `textures/public/item_bg${row.qulity}`,
            type: SpriteFrame,
            bundleName: Bundles.GAME,
          })
            .then((asset) => {
              if (h) h.spriteFrame = asset as SpriteFrame;
            })
            .catch((err) => console.log('error:', err));
          const d = p.getChildByName('icon')?.getComponent(Sprite);
          void ResUtil.loadAsset({
            path: `textures/item/${row.icon}`,
            type: SpriteFrame,
            bundleName: Bundles.GAME,
          })
            .then((asset) => {
              if (d) d.spriteFrame = asset as SpriteFrame;
            })
            .catch((err) => console.log('error:', err));
          const numL = p.getChildByName('numLabel')?.getComponent(Label);
          const nameL = p.getChildByName('nameLabel')?.getComponent(Label);
          if (numL) numL.string = `x${this._awardsList[oi]!.num}`;
          if (nameL) nameL.string = `${row.name ?? ''}`;
          p.active = i === 1;
          const aw = this._awardsList[oi]!;
          if (!aw.noSave) {
            userDataProxy.addProp(Number(aw.id), aw.num, oi + 1 === total);
          }
          p.setPosition(v3(n.x + (oi % 4) * 168, n.y - 210 * Math.floor(oi / 4), 0));
        } else {
          console.error('无此道具id', this._awardsList[oi]!.id);
        }
      }
    }, 2 * a);
    this.scheduleOnce(() => {
      if (this._awardsList.length > 1) {
        if (getBtn) getBtn.active = true;
      } else {
        this.scheduleOnce(() => {
          this.onGetAwardList();
        }, 0.5);
      }
    }, 4 * a);
  }

  onGetAwardList(): void {
    const getBtn = this.node.getChildByName('getBtn');
    if (getBtn) getBtn.active = false;
    let e = 0;
    const cont = this._contant;
    if (!cont) return;
    const layout = cont.getComponent(Layout);
    if (layout) layout.enabled = false;
    cont.children.forEach((o) => {
      const i = this._awardsList[e];
      this.scheduleOnce(() => {
        if (i) {
          o.active = false;
          AnimationMgr.instance.showAwardAni(
            { id: Number(i.id), num: i.num },
            null,
            o,
          );
        }
      }, 0.1 * e);
      e++;
    });
    this.scheduleOnce(() => {
      this.removeUI();
    }, 0.1 * e + 0.3);
  }
}
