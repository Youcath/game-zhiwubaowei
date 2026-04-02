/**
 * 微信小游戏平台（原 PlatformWX.js 主要逻辑，3.x API 映射）
 * 复杂能力（如 Camera 截图分享）未完全对齐时可再补。
 */

import { game, Game, Node, UITransform, view } from 'cc';
import { AudioManager } from './AudioManager';
import { battleDataProxy } from './BattleDataProxy';
import { DataManager } from './DataManager';
import { WeatherType } from './GameEnum';
import { gameUIMgr } from './GameUIManager';
import { CommonUtil } from './CommonUtil';
import { getGameConfig } from './gameConfig';
import type { AuthorizeParam, IPlatform, ShareAppMessageParam, VideoAdsParam } from './platformTypes';
import { SceneManager } from './SceneManager';
import { userDataProxy } from './UserDataProxy';

type WxGlobal = Record<string, unknown> & {
  getSystemInfoSync: () => { SDKVersion: string; screenWidth: number; screenHeight: number };
  getLaunchOptionsSync: () => Record<string, unknown>;
  showShareMenu: (o: Record<string, unknown>) => void;
  onShareAppMessage: (fn: () => Record<string, unknown>) => void;
  showToast: (o: { title: string; icon?: string; duration?: number }) => void;
  showLoading: (o: { title: string }) => void;
  hideLoading: () => void;
  login: (o: { success?: (e: unknown) => void; fail?: (e?: unknown) => void }) => void;
  getSetting: (o: { success?: (r: { authSetting: Record<string, boolean> }) => void; fail?: () => void }) => void;
  authorize: (o: { scope: string; success?: () => void; fail?: () => void }) => void;
  getUserInfo: (o: { withCredentials?: boolean; lang?: string; success?: (e: unknown) => void; fail?: (e: unknown) => void }) => void;
  createUserInfoButton: (o: Record<string, unknown>) => {
    onTap: (fn: (e: { userInfo?: unknown }) => void) => void;
    destroy: () => void;
  };
  showModal: (o: Record<string, unknown>) => void;
  shareAppMessage: (o: { title?: string; imageUrl?: string; query?: string }) => void;
  getUpdateManager: () => { onUpdateReady: (cb: () => void) => void; applyUpdate: () => void };
  vibrateLong: (o: Record<string, unknown>) => void;
  vibrateShort: (o: Record<string, unknown>) => void;
  requestSubscribeMessage: (o: { tmplIds: string[]; success?: (r: unknown) => void; fail?: (r: unknown) => void }) => void;
  requirePrivacyAuthorize: (o: { success?: () => void; fail?: (e: unknown) => void; complete?: () => void }) => void;
  setClipboardData: (o: { data: string; success?: () => void; fail?: (e: unknown) => void }) => void;
  createBannerAd: (o: Record<string, unknown>) => {
    onError: (fn: (e: unknown) => void) => void;
    onResize: (fn: () => void) => void;
    show: () => void;
    hide: () => void;
    destroy: () => void;
    style: { top: number; left: number; width: number; realHeight?: number };
  };
  createInterstitialAd: (o: { adUnitId: string }) => {
    load: () => Promise<void>;
    show: () => Promise<void>;
    destroy: () => void;
  };
  createRewardedVideoAd: (o: { adUnitId: string }) => {
    load: () => Promise<void>;
    show: () => Promise<void>;
    onClose: (fn: (r: { isEnded?: boolean }) => void) => void;
    onError: (fn: (e: unknown) => void) => void;
    offClose: () => void;
    offError: () => void;
  };
  createGameClubButton: (o: Record<string, unknown>) => { show: () => void; hide: () => void };
  uma?: { trackEvent: (id: string, data: Record<string, string>) => void };
};

function getWx(): WxGlobal | undefined {
  return (globalThis as { wx?: WxGlobal }).wx;
}

function getSfdata(): {
  SfTrackData: { instance: { trackEvent: (a: string, b: string, c?: string) => void } };
} | undefined {
  return (globalThis as { sfdata?: { SfTrackData: { instance: { trackEvent: (a: string, b: string, c?: string) => void } } } })
    .sfdata;
}

const SHARE_TITLES = ['[有人@我]僵尸来了，快上车！', '[有人@我]我被僵尸吃掉了~', '[有人@我]带好装备，出发！'];
const SHARE_IMG_KEYS = ['share_img_1', 'share_img_2', 'share_img_3'];

function shareImageUrl(index: number): string {
  return `resources/share/${SHARE_IMG_KEYS[index]}.png`;
}

export class PlatformWX implements IPlatform {
  versionStr = '1.0.0';
  versionCode = 100;
  systemInfo: ReturnType<WxGlobal['getSystemInfoSync']> | null = null;
  launchInfo: Record<string, unknown> | null = null;
  shareTitle = '[有人@我]加班，加班，我要加班！';
  shareImageUrl: string | null = null;
  adUintId: Record<string, Record<number, string>> = {
    Video: { 1: 'adunit-aec6f6125ea94a8b', 2: 'adunit-aec6f6125ea94a8b', 3: 'adunit-aec6f6125ea94a8b' },
    Banner: { 1: 'adunit-81db461af35a9730' },
    Interstitial: { 1: 'adunit-c7d874d483204568' },
  };
  gameClubButton: ReturnType<WxGlobal['createGameClubButton']> | null = null;
  shareTime = 0;
  shareSuccess: (() => void) | null = null;
  shareFail: (() => void) | null = null;
  shareComplete: (() => void) | null = null;
  bannerCache: Record<string, { banner: ReturnType<WxGlobal['createBannerAd']>; sCnt: number }> = {};
  interstitial: ReturnType<WxGlobal['createInterstitialAd']> | null = null;
  _adsId = 1;
  ttVideoObj: VideoAdsParam | null = null;

  constructor() {
    const wx = getWx();
    CommonUtil.print('运行环境：wx');
    if (!wx) return;
    this.systemInfo = wx.getSystemInfoSync();
    this.launchInfo = wx.getLaunchOptionsSync();
    this.showShareMenu();
    this.checkUpdate();
    game.on(Game.EVENT_SHOW, this.shareResult, this);
  }

  static compareVersion(min: string): boolean {
    const wx = getWx();
    if (!wx) return false;
    const e = wx.getSystemInfoSync().SDKVersion;
    const re = /\d+.\d+.\d+/;
    if (!re.test(min) || !re.test(e)) {
      console.warn('SDKVersion取值异常');
      return false;
    }
    const i = e.split('.');
    const n = min.split('.');
    for (let a = 0; a < 3; a++) {
      const r = parseInt(i[a], 10);
      const s = parseInt(n[a], 10);
      if (r > s) return true;
      if (r < s) return false;
    }
    return true;
  }

  getRandomNum(t: number, e: number, round = true): number {
    const i = e - t;
    let n = Math.random() * i + t;
    if (round) n = Math.round(n);
    return n;
  }

  getPlatform(): string {
    return 'wx';
  }

  showToast(msg: string, icon?: string, durationLong?: boolean): void {
    getWx()?.showToast({ title: msg, icon: icon as string, duration: durationLong ? 1500 : 500 });
  }

  showLoading(msg: string): void {
    getWx()?.showLoading({ title: msg });
  }

  hideLoading(): void {
    getWx()?.hideLoading();
  }

  getChannelId(): number {
    return 1;
  }

  login(cb?: (...args: unknown[]) => void): void {
    getWx()?.login({
      success: (e) => cb?.(true, e),
      fail: () => {
        CommonUtil.print('wx.login fail');
        cb?.(false, null);
      },
    });
  }

  authorize(param: AuthorizeParam): void {
    const wx = getWx();
    if (!wx) return;
    wx.getSetting({
      success(o) {
        if (o.authSetting[param.scope]) {
          if (param.scope !== 'scope.userInfo') param.success?.();
          else {
            wx.getUserInfo({
              withCredentials: true,
              lang: 'zh_CN',
              success(e) {
                param.success?.(e as never);
              },
            });
          }
        } else if (param.scope !== 'scope.userInfo') {
          wx.authorize({
            scope: param.scope,
            success: () => param.success?.(),
            fail: () => param.fail?.(),
          });
        } else if (PlatformWX.compareVersion('2.0.7')) {
          const vs = view.getVisibleSize();
          const btn = wx.createUserInfoButton({
            withCredentials: true,
            type: 'text',
            text: '',
            style: {
              left: 0,
              top: 0,
              width: vs.width,
              height: vs.height,
              backgroundColor: '#00000000',
              fontSize: 16,
              lineHeight: 20,
              color: '#000000',
              textAlign: 'center',
              borderRadius: 0,
            },
          });
          let once = true;
          btn.onTap((ev) => {
            if (ev.userInfo) {
              CommonUtil.print('用户授权');
              btn.destroy();
              if (once) {
                once = false;
                param.success?.(ev as never);
              }
            } else {
              CommonUtil.print('拒绝授权用户信息');
              btn.destroy();
              param.fail?.();
            }
          });
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '当前微信版本过低，请升级到最新版微信后重试!',
          });
        }
      },
      fail: () => {
        CommonUtil.print('wx.getSetting fail');
        param.fail?.();
      },
    });
  }

  createGameClubButton(t: { x: number; y: number; width: number; height: number }): void {
    const wx = getWx();
    if (!wx || !this.systemInfo) return;
    if (this.gameClubButton) {
      this.gameClubButton.show();
      return;
    }
    const e = { width: t.width + 10, height: t.height + 10 };
    const o = view.getVisibleSize();
    const fs = view.getFrameSize();
    const n = (0.5 * o.width + t.x - 0.5 * e.width) / o.width * fs.width;
    const a = (0.5 * o.height - t.y - 0.5 * e.height) / o.height * fs.height;
    const r = (e.width / o.width) * fs.width;
    const s = (e.height / o.height) * fs.height;
    this.gameClubButton = wx.createGameClubButton({
      type: 'text',
      text: '  ',
      style: { left: n, top: a, width: r, height: s },
    });
  }

  hideGameClubButton(): void {
    this.gameClubButton?.hide();
  }

  getUserInfo(cb?: (...args: unknown[]) => void): void {
    const wx = getWx();
    if (!wx) {
      cb?.();
      return;
    }
    wx.login({
      success: (o) => {
        CommonUtil.print('登录成功:', o);
        this.authorize({
          scope: 'scope.userInfo',
          success: () => {
            wx.getUserInfo({
              success: (e) => {
                CommonUtil.print('getUserInfo 调用成功', (e as { userInfo?: unknown }).userInfo);
                cb?.((e as { userInfo: unknown }).userInfo);
              },
              fail: (e) => {
                CommonUtil.print('getUserInfo 调用失败', (e as { errMsg?: string }).errMsg);
                cb?.();
              },
            });
          },
          fail: () => cb?.(),
        });
      },
      fail: (e) => {
        CommonUtil.print('登录失败', (e as { errMsg?: string }).errMsg);
        cb?.();
      },
    });
  }

  shareAppMessage(param?: ShareAppMessageParam | null): void {
    const wx = getWx();
    if (!wx) return;
    const t = param ?? {
      title: null,
      imageUrl: null,
      query: null,
      camera: null,
      success: null,
      fail: null,
      complete: null,
    };
    this.shareTime = Date.now();
    this.shareSuccess = t.success ?? null;
    this.shareFail = t.fail ?? null;
    this.shareComplete = t.complete ?? null;
    let imageUrl: string;
    if (t.camera) {
      imageUrl = this.getImageUrlFromCanvasCenter();
    } else if (t.imageUrl) {
      imageUrl = t.imageUrl;
    } else {
      imageUrl = this.getImageUrlFromCanvasCenter();
    }
    CommonUtil.print('分享出去：', t.query);
    const o = this.getRandomNum(0, SHARE_TITLES.length - 1);
    wx.shareAppMessage({
      title: SHARE_TITLES[o],
      imageUrl: imageUrl || shareImageUrl(o),
      query: t.query ?? '',
    });
  }

  shareResult(): void {
    AudioManager.instance.resumeBgm();
    if (Date.now() - this.shareTime > 3500) this.shareSuccess?.();
    else this.shareFail?.();
    this.shareComplete?.();
    this.shareTime = 0;
    this.shareSuccess = null;
    this.shareFail = null;
    this.shareComplete = null;
  }

  getImageUrlFromCanvasCenter(): string {
    const canvas = (game as unknown as { canvas?: HTMLCanvasElement }).canvas;
    if (!canvas) return '';
    const ctx =
      canvas.getContext('2d') ||
      canvas.getContext('webgl', { preserveDrawingBuffer: true }) ||
      canvas.getContext('webgl2', { preserveDrawingBuffer: true });
    if (!ctx) return '';
    let dw: number;
    let dh: number;
    if (ctx instanceof CanvasRenderingContext2D) {
      dw = canvas.width;
      dh = canvas.height;
    } else {
      const gl = ctx as WebGLRenderingContext | WebGL2RenderingContext;
      dw = gl.drawingBufferWidth;
      dh = gl.drawingBufferHeight;
    }
    const vs = view.getVisibleSize();
    let o: number;
    let i: number;
    if (vs.width > vs.height) {
      i = dh;
      o = (i / 4) * 5;
    } else {
      o = dw;
      i = (o / 5) * 4;
    }
    const t = (dw - o) / 2;
    const e = (dh - i) / 2;
    const wxCanvas = ctx.canvas as HTMLCanvasElement & {
      toTempFilePathSync?: (opts: Record<string, number>) => string;
    };
    if (typeof wxCanvas.toTempFilePathSync !== 'function') return '';
    return wxCanvas.toTempFilePathSync({
      x: t,
      y: e,
      width: o,
      height: i,
      destWidth: 500,
      destHeight: 400,
    });
  }

  showShareMenu(): void {
    const wx = getWx();
    if (!wx) return;
    wx.showShareMenu({
      showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment'],
      withShareTicket: true,
    });
    wx.onShareAppMessage(() => {
      const t = Math.round(2 * Math.random());
      return {
        title: SHARE_TITLES[t],
        imageUrl: shareImageUrl(t),
        query: '',
      };
    });
  }

  preloadAds(): void {}

  addBanner(opts: { id: number; posNode?: Node | null; width: number; sCnt?: number; preload?: boolean }): void {
    const wx = getWx();
    if (!wx || !this.systemInfo) return;
    const o = opts.id;
    const i = opts.posNode;
    let n = opts.width;
    const a = opts.sCnt ?? 5;
    const r = opts.preload;
    const s = this.adUintId.Banner[o];
    n = Math.min(Math.max(n, 300), this.systemInfo.screenHeight);
    this.hideAllBanner();
    const placeTop = (banner: ReturnType<WxGlobal['createBannerAd']>) => {
      if (i?.isValid) {
        const uit = i.getComponent(UITransform);
        const box = uit?.getBoundingBoxToWorld();
        const vs = view.getVisibleSize();
        if (box)
          banner.style.top =
            this.systemInfo!.screenHeight * (1 - box.yMin / vs.height) - Math.ceil(banner.style.realHeight ?? 0);
      } else {
        banner.style.top = this.systemInfo!.screenHeight - Math.ceil(banner.style.realHeight ?? 0) - 2;
      }
    };
    if (!this.bannerCache[s] || this.bannerCache[s].sCnt <= 0) {
      if (this.bannerCache[s]) this.bannerCache[s].banner.destroy();
      const u = (this.systemInfo.screenWidth - n) / 2;
      const p = wx.createBannerAd({
        adUnitId: s,
        style: { left: u, top: this.systemInfo.screenHeight, width: n },
      });
      p.onError((err) => CommonUtil.print(err));
      p.onResize(() => placeTop(p));
      this.bannerCache[s] = { banner: p, sCnt: a };
    } else {
      placeTop(this.bannerCache[s].banner);
    }
    if (!r) {
      this.bannerCache[s].banner.show();
      this.bannerCache[s].sCnt -= 1;
    }
  }

  showBanner(): void {
    this.addBanner({ id: 1, width: 300 });
  }

  hideBanner(): void {
    this.hideAllBanner();
  }

  hideAllBanner(): void {
    for (const k of Object.keys(this.bannerCache)) {
      this.bannerCache[k].banner.hide();
    }
  }

  showInterstitial(): void {
    this.addInterstitial(1);
  }

  addInterstitial(t: number): void {
    const wx = getWx();
    if (!wx || !this.compareVersionInstance('2.6.0')) return;
    const o = this.adUintId.Interstitial[t];
    const self = this;
    if (!this.interstitial) {
      this.interstitial = wx.createInterstitialAd({ adUnitId: o });
    }
    this.interstitial
      .load()
      .then(() => self.interstitial!.show())
      .catch((err) => console.error(err));
  }

  compareVersionInstance(min: string): boolean {
    const wx = getWx();
    if (!wx || !this.systemInfo) return false;
    const e = this.systemInfo.SDKVersion;
    const re = /\d+.\d+.\d+/;
    if (!re.test(min) || !re.test(e)) {
      console.warn('SDKVersion取值异常');
      return false;
    }
    const i = e.split('.');
    const n = min.split('.');
    for (let a = 0; a < 3; a++) {
      const r = parseInt(i[a], 10);
      const s = parseInt(n[a], 10);
      if (r > s) return true;
      if (r < s) return false;
    }
    return true;
  }

  hideInterstitial(): void {
    this.interstitial?.destroy();
  }

  setClipboardData(data?: string): void {
    const wx = getWx();
    if (!wx || data == null) return;
    wx.requirePrivacyAuthorize({
      success: () => {
        wx.setClipboardData({
          data,
          success: () => gameUIMgr?.showTips('复制成功~'),
          fail: (t) => {
            gameUIMgr?.showTips('复制失败~');
            console.log('setClipboardData调用失败', t);
          },
        });
      },
      fail: (t) => {
        console.log('授权失败', t);
        gameUIMgr?.showTips('授权失败~');
      },
      complete: () => {},
    });
  }

  restartMiniProgramSync(): void {}

  showVideoAds(t: VideoAdsParam): void {
    const g = getGameConfig();
    if (g.isTest || g.isGM) return;
    const wx = getWx();
    if (!wx) return;
    this._adsId = 1;
    this.ttVideoObj = t;
    const o = this.adUintId.Video[this._adsId];
    if (!o?.length) {
      t.error?.();
      return;
    }
    const n = wx.createRewardedVideoAd({ adUnitId: o });
    const self = this;
    SceneManager.instance.showLoading();
    n.offClose();
    n.offError();
    n.load()
      .then(() =>
        n.show().then(
          () => {
            SceneManager.instance.hideLoading();
            CommonUtil.print('视频广告显示成功');
          },
          () => {
            gameUIMgr?.showTips('广告加载失败!');
            self.ttVideoObj?.error?.();
            SceneManager.instance.hideLoading();
          },
        ),
      )
      .catch(() => {
        gameUIMgr?.showTips('广告加载失败!');
        self.ttVideoObj?.error?.();
        SceneManager.instance.hideLoading();
      });
    n.onClose((ev) => {
      SceneManager.instance.hideLoading();
      setTimeout(() => {
        if (ev.isEnded) {
          gameUIMgr?.showTips('视频播放完毕!');
          self.umaTrackEvent('video', { userA: self.ttVideoObj?.eventId ?? '' });
          self.umaTrackEvent('pay', {
            userA: `${self.ttVideoObj?.eventId ?? ''}_${userDataProxy.userData.curChapter}`,
          });
          self.ttVideoObj?.success?.();
        } else {
          gameUIMgr?.showTips('视频未播放完毕!');
          self.ttVideoObj?.fail?.();
        }
        AudioManager.instance.resumeBgm();
      }, 10);
      self._adsId++;
      if (self._adsId > 3) self._adsId = 1;
    });
    n.onError((err) => {
      SceneManager.instance.hideLoading();
      CommonUtil.print(err);
      self.ttVideoObj?.error?.();
      self._adsId++;
      if (self._adsId > 3) self._adsId = 1;
    });
  }

  checkUpdate(): void {
    const wx = getWx();
    if (!wx) return;
    const t = wx.getUpdateManager();
    t.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已准备好，是否重启应用？',
        success: (e: { confirm?: boolean }) => {
          if (e.confirm) t.applyUpdate();
        },
      });
    });
  }

  review(): void {}

  startVibrate(long?: boolean): void {
    const wx = getWx();
    if (!wx) return;
    if (long) {
      wx.vibrateLong({ type: 'medium', success: () => {}, fail: () => {}, complete: () => {} });
    } else {
      wx.vibrateShort({ type: 'medium', success: () => {}, fail: () => {}, complete: () => {} });
    }
  }

  uploadEvent(): void {}

  requestSubscribeMessage(tmplIds: string[], cb?: (ok: boolean, data?: unknown) => void): void {
    getWx()?.requestSubscribeMessage({
      tmplIds,
      success: (r) => cb?.(true, r),
      fail: (r) => cb?.(false, r),
    });
  }

  umaTrackEvent(id: string, e?: Record<string, string>): void {
    const g = getGameConfig();
    const can =
      (!battleDataProxy.isEndless && battleDataProxy.weatherType === WeatherType.NONE) ||
      id === 'video' ||
      id === 'pay' ||
      id === 'time';
    if (!can || !g.bUseUma) return;
    CommonUtil.print('友盟 trackEvent::', id);
    let o = e?.userA;
    let ver = this.versionStr;
    if (userDataProxy.userData.versionStr) ver = userDataProxy.userData.versionStr;
    if (o) o = `${ver}_${o}`;
    console.log('友盟上传数据:', o);
    const c: Record<string, string> = {};
    const sf = getSfdata()?.SfTrackData.instance;
    const uv = DataManager.instance.userVersion;
    if (uv === 'a') {
      if (id) sf?.trackEvent(id, 'userA', o);
      if (o) c.userA = o;
    } else if (uv === 'b') {
      if (id) sf?.trackEvent(id, 'userB', o);
      if (o) c.userB = o;
    } else {
      if (id) sf?.trackEvent(id, 'userD', o);
      if (o) c.userD = o;
    }
    const wx = getWx();
    if (id && wx?.uma) wx.uma.trackEvent(id, c);
  }

  addShortcut(): void {}
}
