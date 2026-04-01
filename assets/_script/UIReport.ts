/**
 * 问题上报 UI（原 res_Report/_script/UIReport.js）
 */

import { _decorator, EditBox, Node, tween, Vec3 } from 'cc';
import { PopupBase } from './PopupBase';

const { ccclass, property } = _decorator;

@ccclass('UIReport')
export default class UIReport extends PopupBase {
  @property(Node)
  root: Node | null = null;

  @property(Node)
  btnClose: Node | null = null;

  @property(Node)
  btnPublicity: Node | null = null;

  @property(Node)
  btnDataloss: Node | null = null;

  @property(Node)
  btnGameStuck: Node | null = null;

  @property(Node)
  btnunableAD: Node | null = null;

  @property(Node)
  btnRender: Node | null = null;

  @property(Node)
  tips: Node | null = null;

  @property(EditBox)
  editBox: EditBox | null = null;

  start(): void {
    this.initEvent();
  }

  private initEvent(): void {
    this.btnClose?.on(Node.EventType.TOUCH_END, () => this.removeUI(), this);
    this.btnPublicity?.on(Node.EventType.TOUCH_END, () => {
      const c0 = this.btnPublicity?.children[0];
      if (c0) c0.active = !c0.active;
      this.radio(1);
      this.canRender();
    }, this);
    this.btnDataloss?.on(Node.EventType.TOUCH_END, () => {
      const c0 = this.btnDataloss?.children[0];
      if (c0) c0.active = !c0.active;
      this.radio(2);
      this.canRender();
    }, this);
    this.btnGameStuck?.on(Node.EventType.TOUCH_END, () => {
      const c0 = this.btnGameStuck?.children[0];
      if (c0) c0.active = !c0.active;
      this.radio(3);
      this.canRender();
    }, this);
    this.btnunableAD?.on(Node.EventType.TOUCH_END, () => {
      const c0 = this.btnunableAD?.children[0];
      if (c0) c0.active = !c0.active;
      this.radio(4);
      this.canRender();
    }, this);
    this.btnRender?.on(Node.EventType.TOUCH_END, () => this.renderSubmit(), this);
  }

  private canRender(): void {
    const a = this.btnPublicity?.children[0]?.active;
    const b = this.btnDataloss?.children[0]?.active;
    const c = this.btnGameStuck?.children[0]?.active;
    const d = this.btnunableAD?.children[0]?.active;
    if (this.btnRender) this.btnRender.active = !!(a || b || c || d);
  }

  /** 单选：保留当前项选中态，其余选项取消选中（与 2.x Radio 一致） */
  private radio(t: number): void {
    const r = this.root;
    if (r == null) return;
    for (let e = 1; e < 5; e++) {
      if (e !== t) {
        const row = r.children[e];
        const mark = row?.children[0];
        if (mark) mark.active = false;
      }
    }
  }

  private renderSubmit(): void {
    const r = this.root;
    if (r == null) return;
    for (let t = 1; t < 5; t++) {
      const mark = r.children[t]?.children[0];
      if (mark?.active) {
        mark.active = false;
        if (this.btnRender) this.btnRender.active = false;
      }
    }
    if (this.tips) {
      this.tips.active = true;
      tween(this.tips).to(1, { position: new Vec3(this.tips.position.x, 143.079, this.tips.position.z) }).start();
    }
    this.scheduleOnce(() => this.removeUI(), 1);
  }
}
