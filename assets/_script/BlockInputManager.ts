/** 全屏拦截点击（弹窗 / 网络层计数）（原 BlockInputManager.js） */

import { BlockInputEvents, Node, UITransform } from 'cc';
import { rootNode } from './AppBase';

export class BlockInputManager {
  private static _instance: BlockInputManager | null = null;

  static get instance(): BlockInputManager {
    if (this._instance == null) this._instance = new BlockInputManager();
    return this._instance;
  }

  private blockInputInit = false;
  private _blockInputNode: Node | null = null;
  private _popupBlockInputNum = 0;
  private _netBlockInputNum = 0;

  get popupBlockInputNum(): number {
    return this._popupBlockInputNum;
  }

  set popupBlockInputNum(v: number) {
    this._popupBlockInputNum = v;
    if (this._blockInputNode != null) {
      this._blockInputNode.active = this._popupBlockInputNum + this._netBlockInputNum > 0;
    }
  }

  get netBlockInputNum(): number {
    return this._netBlockInputNum;
  }

  set netBlockInputNum(v: number) {
    this._netBlockInputNum = v;
    if (this._blockInputNode != null) {
      if (this._popupBlockInputNum + this._netBlockInputNum === 0) {
        setTimeout(() => {
          if (this._popupBlockInputNum + this._netBlockInputNum === 0 && this._blockInputNode != null) {
            this._blockInputNode.active = false;
          }
        }, 100);
      } else {
        this._blockInputNode.active = true;
      }
    }
  }

  init(): void {
    if (this.blockInputInit || rootNode == null) return;
    const t = this._blockInputNode = new Node('BlockInputNode');
    const rut = rootNode.getComponent(UITransform);
    const w = rut?.width ?? 0;
    const h = rut?.height ?? 0;
    const ut = t.addComponent(UITransform)!;
    ut.setContentSize(w, h);
    t.addComponent(BlockInputEvents);
    t.setParent(rootNode);
    t.setSiblingIndex(9);
    t.active = false;
    this.blockInputInit = true;
  }
}
