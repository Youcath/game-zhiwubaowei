/** 激励视频占位（原 AdsMgr.js：直接 success + 埋点） */

import { _decorator } from 'cc';
import { userDataProxy } from './UserDataProxy';

const { ccclass } = _decorator;

export class AdsParam {
  id: string;
  eventId: string;
  success: (() => void) | null = null;
  fail: (() => void) | null = null;
  error: (() => void) | null = null;

  constructor(t: string, e: string, o?: (() => void) | null, i?: (() => void) | null, n?: (() => void) | null) {
    this.id = t;
    this.eventId = e;
    this.success = o ?? null;
    this.fail = i ?? null;
    this.error = n ?? null;
  }
}

@ccclass('AdsMgr')
export default class AdsMgr {
  static showVideoAds(t: AdsParam, _e = false): void {
    const mm = (globalThis as { mm?: { platform?: { umaTrackEvent?: (n: string, p: Record<string, string>) => void } } }).mm;
    mm?.platform?.umaTrackEvent?.('pay', {
      userA: `${t.eventId}_${userDataProxy.userData.curChapter}`,
    });
    t.success?.();
  }
}
