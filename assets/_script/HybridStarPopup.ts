/**
 * 杂交总星数奖励说明弹窗（原 HybridStarPopup.js）
 * 用 Prefab + 列表父节点替代 2.x List。
 */

import { _decorator, instantiate, Label, Node, Prefab } from 'cc';
import { DataManager } from './DataManager';
import { userDataProxy } from './UserDataProxy';
import { PopupBase } from './PopupBase';

const { ccclass, property } = _decorator;

type StarMasterRow = { star: number; att: string };
type DataAttRow = { showType: number; des: string };

@ccclass('HybridStarPopup')
export default class HybridStarPopup extends PopupBase {
  /** 原挂载 List 的节点，作为行预制体的父节点 */
  @property(Node)
  mStarListContent: Node | null = null;

  @property(Prefab)
  mStarRowPb: Prefab | null = null;

  private _dataKeys: string[] = [];

  override init(params?: unknown): void {
    super.init(params);
  }

  override onShow(): void {
    super.onShow();
    const t = DataManager.instance.eData.data_hybridizationstarmaster;
    this._dataKeys = Object.keys(t);
    const content = this.mStarListContent;
    if (!content) return;
    content.removeAllChildren();
    if (!this.mStarRowPb) return;
    for (let i = 0; i < this._dataKeys.length; i++) {
      const row = instantiate(this.mStarRowPb);
      row.parent = content;
      this.fillStarRow(row, i);
    }
  }

  private fillStarRow(t: Node, e: number): void {
    const o = t.getChildByName('starNum');
    const i = t.getChildByName('tips');
    const n = t.getChildByName('propertyNum');
    const a = t.getChildByName('lockMask');
    if (!o || !i || !n || !a) return;
    const r = a.getChildByName('layout')?.getChildByName('starNum');
    const row = DataManager.instance.eData.data_hybridizationstarmaster[this._dataKeys[e]!] as StarMasterRow | undefined;
    if (!row) return;
    const u = row.star;
    o.getComponent(Label)!.string = `x${u}`;
    i.getComponent(Label)!.string = `总星数达到${u}个`;
    const p = row.att.split('_').map(Number);
    const h = DataManager.instance.eData.dataatt[String(p[0]!)] as DataAttRow | undefined;
    if (!h) return;
    const d = userDataProxy.getHybridAllStar();
    if (h.showType === 1) {
      n.getComponent(Label)!.string = `${h.des} +${p[1]}`;
    } else {
      const pct = (100 * (p[1] ?? 0)).toString().match(/^-?\d+(?:\.\d{0,2})?/)?.[0] ?? '0';
      n.getComponent(Label)!.string = `${h.des} +${pct}%`;
    }
    a.active = d < u;
    if (a.active && r) r.getComponent(Label)!.string = `(${d}/${u})`;
  }
}
