import { game, Game, sys, view } from 'cc';
import { getGameConfig } from './gameConfig';
import { gameUIMgr } from './GameUIManager';
import type { AuthorizeParam, IPlatform, ShareAppMessageParam, VideoAdsParam } from './platformTypes';

/** 开发 / 默认 H5 平台（原 Platform.js 匿名 p） */
export class PlatformDev implements IPlatform {
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
    return 'dev';
  }

  startVibrate(_long?: boolean): void {}

  preloadAds(): void {}

  showBanner(): void {}

  hideBanner(): void {}

  showInterstitial(): void {}

  createGameClubButton(..._args: unknown[]): void {}

  hideGameClubButton(): void {}

  umaTrackEvent(id: string, data?: Record<string, string>): void {
    const g = getGameConfig();
    if (g.bUseUma) {
      console.log('umaTrackEvent', id, data);
    }
  }

  showVideoAds(param: VideoAdsParam): void {
    param.success?.();
  }

  uploadEvent(): void {}

  showToast(_msg: string, _icon?: string, _durationLong?: boolean, _extra?: unknown): void {}

  showLoading(msg: string): void {
    gameUIMgr?.showTips(msg);
  }

  hideLoading(): void {}

  shareAppMessage(param?: ShareAppMessageParam | null): void {
    param?.success?.();
  }

  requestSubscribeMessage(_tmplIds: string[], cb?: (ok: boolean, data?: unknown) => void): void {
    cb?.(false, {});
  }

  review(): void {}

  setClipboardData(_data?: string): void {}

  restartMiniProgramSync(): void {}

  addShortcut(): void {}

  authorize(_param: AuthorizeParam): void {}
}

game.once(Game.EVENT_GAME_INITED, () => {
  const g = getGameConfig();
  if (g.isGM) {
    view.setResizeCallback(() => {
      const size = view.getVisibleSize();
      console.log('setResizeCallback', size.width, size.height);
    });
  }
});
