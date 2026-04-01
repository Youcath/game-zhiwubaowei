/**
 * 继续游戏确认（原 ContinueGamePopup.js）
 */

import { _decorator } from 'cc';
import { PopupBase } from './PopupBase';

const { ccclass } = _decorator;

interface InitParams {
  callBack?: ((confirmed: boolean) => void) | null;
}

@ccclass('ContinueGamePopup')
export default class ContinueGamePopup extends PopupBase {
  private _callBack: ((confirmed: boolean) => void) | null = null;

  override init(params?: unknown): void {
    super.init(params);
    const p = params as InitParams | undefined;
    this._callBack = p?.callBack ?? null;
  }

  onBtnAgain(): void {
    this._callBack?.(true);
    this.removeUI();
  }

  onBtnClose(): void {
    this._callBack?.(false);
    this.removeUI();
  }
}
