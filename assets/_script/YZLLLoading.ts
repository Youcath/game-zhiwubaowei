/** 全屏加载条（原 YZLLLoading.js） */

import { _decorator, Component, Label, Node, sp, tween, Tween, UIOpacity } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('YZLLLoading')
export default class YZLLLoading extends Component {
  @property(Node)
  nBg: Node | null = null;

  @property(Node)
  nCenterView: Node | null = null;

  @property(Label)
  lPoint: Label | null = null;

  @property(Label)
  lDesc: Label | null = null;

  @property(sp.Skeleton)
  sSpine: sp.Skeleton | null = null;

  pointStr = '';
  isShow = false;
  isLock = false;

  show(text = '喵喵加载中', opacity = 120, onMid: (() => void) | null = null, lock = false): void {
    if (this.isShow || this.isLock) return;
    this.isLock = lock;
    if (this.node.parent) {
      this.node.setSiblingIndex(this.node.parent.children.length - 1);
    }
    if (this.nCenterView) this.nCenterView.active = false;
    const bgOp = this.ensureBgOpacity();
    Tween.stopAllByTarget(bgOp);
    bgOp.opacity = 0;
    if (this.lDesc) this.lDesc.string = text;
    this.pointStr = '';
    if (this.lPoint) this.lPoint.string = this.pointStr;
    this.unschedule(this.pointLoad);
    this.node.active = true;
    this.isShow = true;
    tween(bgOp)
      .to(0.3, { opacity })
      .call(() => {
        if (this.nCenterView) this.nCenterView.active = true;
        onMid?.();
      })
      .start();
    this.schedule(this.pointLoad, 0.2);
  }

  hide(onDone: (() => void) | null = null, force = false): void {
    if (!this.isShow) return;
    if (this.isLock && !force) return;
    if (force) this.isLock = false;
    this.isShow = false;
    const bgOp = this.nBg?.getComponent(UIOpacity);
    if (bgOp == null) return;
    Tween.stopAllByTarget(bgOp);
    tween(bgOp)
      .delay(0.1)
      .call(() => {
        this.unschedule(this.pointLoad);
        if (this.nCenterView) this.nCenterView.active = false;
      })
      .to(0.1, { opacity: 0 })
      .call(() => {
        onDone?.();
        this.node.active = false;
      })
      .start();
  }

  pointLoad(): void {
    if (this.pointStr.length >= 3) this.pointStr = '';
    else this.pointStr += '.';
    if (this.lPoint) this.lPoint.string = this.pointStr;
  }

  private ensureBgOpacity(): UIOpacity {
    if (this.nBg == null) {
      throw new Error('YZLLLoading.nBg 未绑定');
    }
    let op = this.nBg.getComponent(UIOpacity);
    if (op == null) op = this.nBg.addComponent(UIOpacity);
    return op;
  }
}
