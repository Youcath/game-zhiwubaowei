/** 引擎扩展：自定义头像等 URL 后缀加载（原 EngineExUtils.js） */

import { assetManager, ImageAsset, Texture2D } from 'cc';

export const headImgExt = '.head';

type FactoryRegister = (
  ext: string,
  handler: (
    id: string,
    data: HTMLImageElement,
    options: Record<string, unknown>,
    onComplete: (err: Error | null, asset: Texture2D | null) => void,
  ) => void,
) => void;

function registerHeadLoader(ext: string): void {
  assetManager.downloader.register(ext, (url: string, _options, onComplete) => {
    onComplete(null, url);
  });

  assetManager.parser.register(ext, (file: unknown, _options, onComplete) => {
    const url = String(file);
    const img = new Image();
    const onLoad = (): void => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onErr);
      onComplete(null, img);
    };
    const onErr = (): void => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onErr);
      onComplete(new Error(url), null);
    };
    if (typeof location !== 'undefined' && location.protocol !== 'file:') {
      img.crossOrigin = 'anonymous';
    }
    img.addEventListener('load', onLoad);
    img.addEventListener('error', onErr);
    img.src = url;
  });

  const factory = (assetManager as { factory?: { register: FactoryRegister } }).factory;
  factory?.register(ext, (id, data, _options, onComplete) => {
    try {
      const ia = new ImageAsset();
      ia.reset(data);
      const tex = new Texture2D();
      tex.image = ia;
      onComplete(null, tex);
    } catch (e) {
      onComplete(e instanceof Error ? e : new Error(String(e)), null);
    }
  });
}

export namespace EngineExUtils {
  export function all(): void {
    registerHeadLoader(headImgExt);
  }

  export function registerHeadImgLoader(): void {
    registerHeadLoader(headImgExt);
  }
}
