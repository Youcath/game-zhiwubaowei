/** 渠道平台统一接口（由各 Platform*.ts 实现） */

export interface VideoAdsParam {
  eventId: string;
  success?: (() => void) | null;
  fail?: (() => void) | null;
  error?: (() => void) | null;
}

export interface ShareAppMessageParam {
  title?: string | null;
  imageUrl?: string | null;
  query?: string | null;
  camera?: unknown;
  success?: (() => void) | null;
  fail?: (() => void) | null;
  complete?: (() => void) | null;
}

export interface AuthorizeParam {
  scope: string;
  success?: ((...args: unknown[]) => void) | null;
  fail?: (() => void) | null;
}

/** 与 2.x 各渠道 `login` / `getUserInfo` 回调形参不完全一致，用变参兼容 */
export interface IPlatform {
  versionStr: string;
  versionCode: number;
  adUintId: Record<string, unknown>;
  getChannelId(): number;
  login(cb?: (...args: unknown[]) => void): void;
  getUserInfo(cb?: (...args: unknown[]) => void): void;
  getPlatform(): string;
  startVibrate(long?: boolean): void;
  preloadAds(): void;
  showBanner(): void;
  hideBanner(): void;
  showInterstitial(): void;
  createGameClubButton(...args: unknown[]): void;
  hideGameClubButton(): void;
  umaTrackEvent(id: string, data?: Record<string, string>): void;
  showVideoAds(param: VideoAdsParam): void;
  uploadEvent(): void;
  showToast(msg: string, icon?: string, durationLong?: boolean, extra?: unknown): void;
  showLoading(msg: string): void;
  hideLoading(): void;
  shareAppMessage(param?: ShareAppMessageParam | null): void;
  requestSubscribeMessage(tmplIds: string[], cb?: (ok: boolean, data?: unknown) => void): void;
  review(): void;
  setClipboardData(data?: string): void;
  restartMiniProgramSync(): void;
  addShortcut(): void;
  authorize(param: AuthorizeParam): void;
}

export interface MmRuntime {
  config: { env: number };
  orientation: number;
  screen: number;
  lang: string;
  platform: IPlatform | null;
}

/** 原 PlatformApp.js / Platform4399.js 导出的输入框参数类型 */
export class EditInputParams {
  defaultText: string | null = null;
  keyboardStateCllback: ((...args: unknown[]) => void) | null = null;
  textChangeCllback: ((...args: unknown[]) => void) | null = null;
  textCompleteCllback: ((...args: unknown[]) => void) | null = null;
  keyboardDeleteCallback: ((...args: unknown[]) => void) | null = null;
  maxLength = 1000;
  inputType = 'text';
}
