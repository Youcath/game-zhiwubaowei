/**
 * 设置昵称（原 SetNikeNamePopup.js）
 */

import { _decorator, EditBox } from 'cc';
import SensitiveUtils from './SensitiveUtils';
import { gameUIMgr } from './GameUIManager';
import { PopupBase } from './PopupBase';

const { ccclass, property } = _decorator;

export interface SetNikeNameInitParams {
  closeFunc?: ((name: string) => void) | null;
}

@ccclass('SetNikeNamePopup')
export default class SetNikeNamePopup extends PopupBase {
  @property(EditBox)
  mEditBox: EditBox | null = null;

  private _closeFunc: ((name: string) => void) | null = null;

  override init(params?: unknown): void {
    super.init(params);
    const t = params as SetNikeNameInitParams | undefined;
    this._closeFunc = t?.closeFunc ?? null;
  }

  onBtnSet(): void {
    const s = this.mEditBox?.string?.trim() ?? '';
    if (SensitiveUtils.getIsSensitive(s)) {
      gameUIMgr.showTips('名字不合法');
    } else if (s !== '') {
      this._closeFunc?.(s);
      this.removeUI();
    } else {
      gameUIMgr.showTips('请输入昵称');
    }
  }
}
