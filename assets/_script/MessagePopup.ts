/**
 * 通用双按钮提示（原 MessagePopup.js）
 */

import { _decorator, Label, Node } from 'cc';
import { battleDataProxy } from './BattleDataProxy';
import { PopupBase } from './PopupBase';

const { ccclass, property } = _decorator;

interface InitParams {
  title?: string;
  tips?: string;
  isVideo?: boolean;
  isGameVideo?: boolean;
  closeLab?: string;
  sltLab?: string;
  hideClose?: boolean;
  callBack?: ((confirmed: boolean) => void) | null;
}

@ccclass('MessagePopup')
export default class MessagePopup extends PopupBase {
  @property(Node)
  mVideoIcon: Node | null = null;

  @property(Label)
  mTitle: Label | null = null;

  @property(Label)
  mTips: Label | null = null;

  private _callBack: ((confirmed: boolean) => void) | null = null;

  override init(params?: unknown): void {
    super.init(params);
    const t = params as InitParams | undefined;
    if (t == null) return;

    this._callBack = t.callBack ?? null;

    if (this.mTitle != null && t.title != null && t.title !== '') {
      this.mTitle.string = t.title;
    }
    if (this.mTips != null && t.tips != null && t.tips !== '') {
      this.mTips.string = t.tips;
    }

    const showVideo = Boolean(t.isVideo);
    if (this.mVideoIcon != null) {
      this.mVideoIcon.active = showVideo;
      if (showVideo && t.isGameVideo) {
        battleDataProxy.setVideoCardIcon(this.mVideoIcon, 1, 1.2);
      }
    }

    const btnClose = this.node.getChildByName('btnClose');
    const btnAgain = this.node.getChildByName('btnAgain');
    if (t.closeLab != null && t.closeLab !== '' && btnClose != null) {
      const lab = btnClose.getChildByName('lab')?.getComponent(Label);
      if (lab != null) lab.string = t.closeLab;
    }
    if (t.sltLab != null && t.sltLab !== '' && this.mVideoIcon != null) {
      const sltLab = this.mVideoIcon.parent?.getChildByName('lab')?.getComponent(Label);
      if (sltLab != null) sltLab.string = t.sltLab;
    }

    if (t.hideClose && btnClose != null && btnAgain != null) {
      btnClose.active = false;
      const p = btnAgain.position;
      btnAgain.setPosition(0, p.y, p.z);
    }
  }

  onBtnClose(): void {
    this._callBack?.(false);
    this.removeUI();
  }

  onBtnAgain(): void {
    this._callBack?.(true);
    this.removeUI();
  }
}
