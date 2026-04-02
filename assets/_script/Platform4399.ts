import { _decorator, game, sys } from 'cc';
import { AudioManager } from './AudioManager';
import { gameUIMgr } from './GameUIManager';
import { ConditionKey, otherDataProxy } from './OtherDataProxy';
import type { AuthorizeParam, IPlatform, ShareAppMessageParam, VideoAdsParam } from './platformTypes';
import { EditInputParams } from './platformTypes';

export { EditInputParams };

const { ccclass } = _decorator;

type H5Api = {
  login: (cb: (e: { uId: string; userName: string }) => void) => void;
  playAd: (cb: (t: { code: number; message: string }) => void) => void;
  playInterstitialAd: () => void;
};

function getH5api(): H5Api | undefined {
  return (globalThis as { h5api?: H5Api }).h5api;
}

@ccclass('Platform4399')
export class Platform4399 implements IPlatform {
  static inst: Platform4399 | null = null;
  static get Inst(): Platform4399 {
    return (this.inst ??= new Platform4399());
  }

  static _ohayooInitCallback: (() => void) | null = null;
  static _successCallback: (() => void) | null = null;
  static _failCallback: (() => void) | null = null;
  static _errorCallback: (() => void) | null = null;
  static isAntiAddictionOK = false;
  static mInitOhayooSdkCallback: ((msg: unknown) => void) | null = null;
  static mLoginComplete: ((n: string, o: string, a: string) => void) | null = null;
  static isRequestVideo = false;
  static _eventId = '';

  versionStr = '1.0.1';
  versionCode = 101;
  adUintId: Record<string, unknown> = {};

  constructor() {
    console.log('4399');
  }

  getChannelId(): number {
    return 0;
  }

  login(cb?: (...args: unknown[]) => void): void {
    const h5 = getH5api();
    if (!h5) {
      cb?.();
      return;
    }
    h5.login((e) => {
      cb?.(e.uId, e.userName);
    });
  }

  getUserInfo(cb?: (...args: unknown[]) => void): void {
    cb?.();
  }

  getPlatform(): string {
    return String(sys.os);
  }

  authorize(_param: AuthorizeParam): void {}

  preloadAds(): void {}

  showBanner(): void {}

  hideBanner(): void {}

  showInterstitial(): void {
    getH5api()?.playInterstitialAd();
  }

  setClipboardData(_data?: string): void {}

  restartMiniProgramSync(): void {}

  showVideoAds(param: VideoAdsParam): void {
    Platform4399._eventId = param.eventId;
    Platform4399.isRequestVideo = true;
    Platform4399._successCallback = param.success ?? null;
    Platform4399._failCallback = param.fail ?? null;
    Platform4399._errorCallback = param.error ?? null;
    const h5 = getH5api();
    if (!h5) {
      Platform4399.appVideoError();
      return;
    }
    h5.playAd((t) => {
      console.log('代码:' + t.code + ',消息:' + t.message);
      if (t.code === 10000) {
        console.log('开始播放');
        if (AudioManager.instance.isOpenBackgroundAudio) AudioManager.instance.pauseBgm();
        game.pause();
      } else if (t.code === 10001) {
        console.log('播放结束');
        Platform4399.appVideoCompleted();
      } else {
        console.log('广告异常');
        Platform4399.appVideoError();
      }
    });
  }

  static appVideoCompleted(): void {
    game.resume();
    console.log('=====广告回调成功');
    this.isRequestVideo = false;
    setTimeout(() => {
      otherDataProxy.addCondition(ConditionKey.LOOKAD);
      this._successCallback?.();
      this._successCallback = null;
      this._errorCallback = null;
      if (AudioManager.instance.isOpenBackgroundAudio) AudioManager.instance.resumeBgm();
    }, 10);
  }

  static appVideoClose(): void {
    game.resume();
    console.log('=====广告未看完');
    this.isRequestVideo = false;
    setTimeout(() => {
      this._failCallback?.();
      this._failCallback = null;
      this._errorCallback = null;
      if (AudioManager.instance.isOpenBackgroundAudio) AudioManager.instance.resumeBgm();
    }, 10);
  }

  static appVideoError(): void {
    game.resume();
    console.log('=====广告回调失败');
    this.isRequestVideo = false;
    this._errorCallback?.();
    this._errorCallback = null;
    this._successCallback = null;
    this._failCallback = null;
    if (AudioManager.instance.isOpenBackgroundAudio) AudioManager.instance.resumeBgm();
  }

  static resultFeedError(): void {}

  static resultSplash(): void {}

  uploadEvent(): void {}

  static exitGame(): void {
    const g = game as unknown as { end?: () => void };
    g.end?.();
  }

  static ohayooSdkInitFail(t: unknown): void {
    console.log(' ------------ errorMsg:', t);
    this.mInitOhayooSdkCallback?.(t);
    this.mInitOhayooSdkCallback = null;
  }

  static loginComplete(t: string, e: string, o: string): void {
    console.log(' ------------ 登录回调回来:', 'nikeName:' + t + '---openId:' + e + '---avatar:' + o);
    this.mLoginComplete?.(t, e, o);
    this.mLoginComplete = null;
  }

  static initSDK(t: () => void): void {
    this._ohayooInitCallback = t;
  }

  static initSDKResult(): void {
    this._ohayooInitCallback?.();
  }

  static showAgeTips(): void {}

  static showPrivacyPolicy(): void {}

  addShortcut(): void {}

  umaTrackEvent(_id: string, _data?: Record<string, string>): void {}

  startVibrate(_long?: boolean): void {}

  showToast(msg: string, _icon?: string, _durationLong?: boolean, _extra?: unknown): void {
    gameUIMgr?.showTips(msg);
  }

  showLoading(msg: string): void {
    gameUIMgr?.showTips(msg);
  }

  hideLoading(): void {}

  shareAppMessage(_param?: ShareAppMessageParam | null): void {}

  review(): void {}

  createGameClubButton(..._args: unknown[]): void {}

  hideGameClubButton(): void {}

  requestSubscribeMessage(_tmplIds: string[], cb?: (ok: boolean, data?: unknown) => void): void {
    cb?.(false, {});
  }
}

(globalThis as typeof globalThis & { Platform4399?: typeof Platform4399 }).Platform4399 = Platform4399;
