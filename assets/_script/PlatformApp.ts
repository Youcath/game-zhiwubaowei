import { game, Game, sys } from 'cc';
import { AudioManager } from './AudioManager';
import { getGameConfig } from './gameConfig';
import type { AuthorizeParam, IPlatform, ShareAppMessageParam, VideoAdsParam } from './platformTypes';
import { EditInputParams } from './platformTypes';

export { EditInputParams };

type JsbReflection = {
  callStaticMethod(className: string, methodName: string, signature: string, ...args: unknown[]): unknown;
};

function getJsb(): { reflection: JsbReflection } | undefined {
  return (globalThis as { jsb?: { reflection: JsbReflection } }).jsb;
}

/** 原生 Android / iOS（原 PlatformApp.js） */
export class PlatformApp implements IPlatform {
  versionStr = '1.0.0';
  versionCode = 1;
  adUintId: Record<string, unknown> = {};

  getChannelId(): number {
    return 0;
  }

  login(cb?: (...args: unknown[]) => void): void {
    cb?.(false, null);
  }

  getUserInfo(cb?: (...args: unknown[]) => void): void {
    cb?.();
  }

  getPlatform(): string {
    return String(sys.os);
  }

  startVibrate(long?: boolean): void {
    const jsb = getJsb();
    if (!jsb) return;
    if (sys.os === sys.OS.ANDROID) {
      jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'vibrate', '(Z)V', !!long);
    } else if (sys.os === sys.OS.IOS) {
      jsb.reflection.callStaticMethod('AppController', 'vibrate:', 'i', long ? 1 : 0);
    }
  }

  preloadAds(): void {}

  showBanner(): void {}

  hideBanner(): void {}

  showInterstitial(): void {}

  createGameClubButton(..._args: unknown[]): void {}

  hideGameClubButton(): void {}

  umaTrackEvent(_id: string, _data?: Record<string, string>): void {}

  showVideoAds(param: VideoAdsParam): void {
    const g = getGameConfig();
    if (g.isTest) {
      param.success?.();
      return;
    }
    const jsb = getJsb();
    if (!jsb) {
      param.fail?.();
      return;
    }
    game.pause();
    if (AudioManager.instance.isOpenBackgroundAudio) {
      AudioManager.instance.pauseBgm();
    }
    if (sys.os === sys.OS.ANDROID) {
      jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showVideo', '(Ljava/lang/String;)V', param.eventId);
    } else if (sys.os === sys.OS.IOS) {
      jsb.reflection.callStaticMethod('AppController', 'showVideo:', '@', param.eventId);
    }
  }

  uploadEvent(): void {}

  showToast(msg: string, _icon?: string, _durationLong?: boolean, _extra?: unknown): void {
    const jsb = getJsb();
    if (!jsb) return;
    if (sys.os === sys.OS.ANDROID) {
      jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showToast', '(Ljava/lang/String;)V', msg);
    } else if (sys.os === sys.OS.IOS) {
      jsb.reflection.callStaticMethod('AppController', 'showToast:', '@', msg);
    }
  }

  showLoading(msg: string): void {
    const jsb = getJsb();
    if (!jsb) return;
    if (sys.os === sys.OS.ANDROID) {
      jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showLoading', '(Ljava/lang/String;)V', msg);
    } else if (sys.os === sys.OS.IOS) {
      jsb.reflection.callStaticMethod('AppController', 'showLoading:', '@', msg);
    }
  }

  hideLoading(): void {
    const jsb = getJsb();
    if (!jsb) return;
    if (sys.os === sys.OS.ANDROID) {
      jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'hideLoading', '()V');
    } else if (sys.os === sys.OS.IOS) {
      jsb.reflection.callStaticMethod('AppController', 'hideLoading', 'v');
    }
  }

  shareAppMessage(_param?: ShareAppMessageParam | null): void {}

  requestSubscribeMessage(_tmplIds: string[], cb?: (ok: boolean, data?: unknown) => void): void {
    cb?.(false, {});
  }

  review(): void {}

  setClipboardData(_data?: string): void {}

  restartMiniProgramSync(): void {}

  addShortcut(): void {}

  authorize(_param: AuthorizeParam): void {}

  /** 原生激励视频结束回调（保持 window.PlatformApp 供原生调用） */
  static appVideoCompleted(): void {
    game.resume();
    if (AudioManager.instance.isOpenBackgroundAudio) {
      AudioManager.instance.resumeBgm();
    }
  }

  static appVideoFail(): void {
    game.resume();
    if (AudioManager.instance.isOpenBackgroundAudio) {
      AudioManager.instance.resumeBgm();
    }
  }
}

game.once(Game.EVENT_GAME_INITED, () => {
  const w = globalThis as typeof globalThis & { PlatformApp?: typeof PlatformApp };
  w.PlatformApp = PlatformApp;
});
