/**
 * 运行时 `mm` 与渠道实例（原 Platform.js 中 window.mm + EVENT_GAME_INITED 逻辑）
 */

import { game, Game, sys, view } from 'cc';
import { getGameConfig } from './gameConfig';
import type { IPlatform, MmRuntime } from './platformTypes';
import { PlatformApp } from './PlatformApp';
import { Platform4399 } from './Platform4399';
import { PlatformDev } from './PlatformDev';
import PlatformQGame from './PlatformQGame';
import { PlatformKS } from './PlatformKS';
import { PlatformTT } from './PlatformTT';
import { PlatformWX } from './PlatformWX';

declare global {
  // eslint-disable-next-line no-var
  var mm: MmRuntime;
}

/** 与 2.x 一致：先挂空壳，再在 EVENT_GAME_INITED 里补全并创建 platform */
(globalThis as typeof globalThis & { mm: MmRuntime }).mm = {
  config: { env: 1 },
  orientation: 1,
  screen: 1,
  lang: '',
  platform: null,
};

function pickPlatform(): IPlatform {
  const g = getGameConfig();
  if (g.is4399) return new Platform4399();
  if (sys.platform === sys.Platform.WECHAT_GAME) {
    return g.isKs ? new PlatformKS() : new PlatformWX();
  }
  if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME) {
    return new PlatformTT();
  }
  if (sys.platform === sys.Platform.ANDROID || sys.os === sys.OS.IOS) {
    return new PlatformApp();
  }
  if (sys.platform === sys.Platform.OPPO_MINI_GAME || sys.platform === sys.Platform.VIVO_MINI_GAME) {
    return new PlatformQGame();
  }
  return new PlatformDev();
}

game.once(Game.EVENT_GAME_INITED, () => {
  const fs = view.getFrameSize();
  let lang = sys.localStorage.getItem('SysLanguage') ?? sys.languageCode;
  if (lang?.includes('zh')) lang = 'zh';
  console.log('Lang:', lang, ' LanguageCode:', sys.languageCode);

  const m = (globalThis as typeof globalThis & { mm: MmRuntime }).mm;
  m.orientation = fs.width < fs.height ? 1 : 2;
  m.screen = Math.max(fs.width, fs.height) / Math.min(fs.width, fs.height) < 1.78 ? 1 : 2;
  m.lang = lang ?? '';
  m.platform = pickPlatform();
});
