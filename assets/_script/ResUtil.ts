import { Asset, AssetManager, assetManager, resources, SpriteFrame } from 'cc';
import { Logger } from './Logger';
import { StringUtil } from './StringUtil';

export interface IErrResult {
  errCode: number;
  errMsg: string;
}

export interface ILoadRemoteRequest {
  url: string;
  option?: Record<string, unknown>;
  success?: (asset: Asset) => void;
  fail?: (err: IErrResult) => void;
  complete?: () => void;
}

export interface ILoadAssetRequest {
  path: string;
  type: typeof Asset;
  bundle?: import('cc').AssetManager.Bundle | null;
  bundleName?: string | null;
  success?: (asset: Asset) => void;
  fail?: (err: IErrResult) => void;
  complete?: () => void;
}

export interface ILoadBundleRequest {
  bundle?: import('cc').AssetManager.Bundle | null;
  bundleName?: string | null;
  success?: (bundle: import('cc').AssetManager.Bundle) => void;
  fail?: (err: IErrResult) => void;
  complete?: () => void;
}

export interface ILoadDirRequest {
  dir: string;
  bundle?: import('cc').AssetManager.Bundle | null;
  bundleName?: string | null;
  success?: (assets: Asset[]) => void;
  fail?: (err: IErrResult | unknown) => void;
  complete?: () => void;
}

export interface IPreloadRequest {
  paths: string | string[];
  type?: typeof Asset;
  bundle?: import('cc').AssetManager.Bundle | null;
  bundleName?: string | null;
}

export interface ILoadAssetAnyRequest {
  requests: ILoadAssetRequest[];
}

export class ResUtil {
  static loadRemote(req: ILoadRemoteRequest): Promise<Asset> | void {
    if (req.option == null) req.option = {};
    const { url, option, success, fail, complete } = req;
    if (!success) {
      return new Promise((resolve, reject) => {
        this._loadRemote(url, option, resolve, (e) => reject(e), undefined);
      });
    }
    this._loadRemote(url, option, success, fail, complete);
  }

  private static _loadRemote(
    url: string,
    option: Record<string, unknown>,
    onOk: (a: Asset) => void,
    onFail?: (e: IErrResult) => void,
    onComplete?: () => void,
  ): void {
    assetManager.loadRemote(url, option as never, (err: Error | null, asset: Asset | null) => {
      if (err) {
        onFail?.({ errCode: -1, errMsg: err.message });
        onComplete?.();
        return;
      }
      if (asset) onOk(asset);
      onComplete?.();
    });
  }

  static loadAssetAny(req: ILoadAssetAnyRequest): Promise<Asset[]> {
    return Promise.all(req.requests.map((r) => this.loadAsset(r) as Promise<Asset>));
  }

  static preload(req: IPreloadRequest): void {
    this.loadBundle({ bundle: req.bundle, bundleName: req.bundleName })
      .then((bundle) => {
        bundle.preload(req.paths, req.type);
      })
      .catch(() => {});
  }

  static loadAssetSync<T extends Asset>(path: string, type: typeof Asset, bundleName?: string | null): T | null {
    const bundle = StringUtil.isEmpty(bundleName)
      ? resources
      : assetManager.getBundle(bundleName!);
    if (!bundle) return null;
    return bundle.get(path, type) as T | null;
  }

  static loadAsset(req: ILoadAssetRequest & { success: (asset: Asset) => void }): void;
  static loadAsset(req: ILoadAssetRequest & { success?: undefined }): Promise<Asset>;
  static loadAsset(req: ILoadAssetRequest): Promise<Asset> | void;
  static loadAsset(req: ILoadAssetRequest): Promise<Asset> | void {
    if (!req.success) {
      return new Promise((resolve, reject) => {
        this._loadAsset(req.path, req.type, req.bundle, req.bundleName, resolve, (e) => reject(e), undefined);
      });
    }
    this._loadAsset(req.path, req.type, req.bundle, req.bundleName, req.success, req.fail, req.complete);
  }

  private static _loadAsset(
    path: string,
    type: typeof Asset,
    bundle: import('cc').AssetManager.Bundle | null | undefined,
    bundleName: string | null | undefined,
    onOk: (a: Asset) => void,
    onFail?: (e: IErrResult) => void,
    onComplete?: () => void,
  ): void {
    this.loadBundle({
      bundle,
      bundleName,
      success: (b) => {
        const cached = b.get(path, type);
        if (cached != null) {
          onOk(cached);
          onComplete?.();
          return;
        }
        b.load(path, type, (err, asset) => {
          if (err) {
            Logger.error(err);
            onFail?.({ errCode: -1, errMsg: err.message });
            onComplete?.();
            return;
          }
          if (asset) onOk(asset);
          onComplete?.();
        });
      },
      fail: (err) => {
        Logger.error(err);
        onFail?.(err as IErrResult);
        onComplete?.();
      },
    });
  }

  static loadBundle(
    req: ILoadBundleRequest & { success: (bundle: AssetManager.Bundle) => void },
  ): void;
  static loadBundle(req: ILoadBundleRequest & { success?: undefined }): Promise<AssetManager.Bundle>;
  static loadBundle(req: ILoadBundleRequest): Promise<AssetManager.Bundle> | void;
  static loadBundle(req: ILoadBundleRequest): Promise<AssetManager.Bundle> | void {
    if (!req.success) {
      return new Promise((resolve, reject) => {
        this._loadBundle(
          req.bundle,
          req.bundleName,
          resolve,
          (err) => reject(err),
          undefined,
        );
      });
    }
    this._loadBundle(req.bundle, req.bundleName, req.success, req.fail, req.complete);
  }

  private static _loadBundle(
    bundle: import('cc').AssetManager.Bundle | null | undefined,
    bundleName: string | null | undefined,
    onOk: (b: import('cc').AssetManager.Bundle) => void,
    onFail?: (e: IErrResult) => void,
    onComplete?: () => void,
  ): void {
    let b =
      bundle ??
      (StringUtil.isEmpty(bundleName) ? resources : assetManager.getBundle(bundleName!));
    if (b) {
      onOk(b);
      onComplete?.();
      return;
    }
    assetManager.loadBundle(bundleName!, (err, loaded) => {
      if (err) {
        onFail?.({ errCode: -1, errMsg: err.message });
        onComplete?.();
        return;
      }
      if (loaded) onOk(loaded);
      onComplete?.();
    });
  }

  static preloadDir(req: { dir: string; bundle?: import('cc').AssetManager.Bundle | null; bundleName?: string | null }): void {
    this.loadBundle({ bundle: req.bundle, bundleName: req.bundleName }).then((bundle) => {
      bundle.preloadDir(req.dir);
    });
  }

  static loadDir(req: ILoadDirRequest): Promise<Asset[]> | void {
    if (!req.success) {
      return new Promise((resolve, reject) => {
        this._loadDir(req.dir, req.bundle, req.bundleName, resolve, (err) => reject(err), undefined);
      });
    }
    this._loadDir(req.dir, req.bundle, req.bundleName, req.success, req.fail, req.complete);
  }

  private static _loadDir(
    dir: string,
    bundle: import('cc').AssetManager.Bundle | null | undefined,
    bundleName: string | null | undefined,
    onOk: (assets: Asset[]) => void,
    onFail?: (e: IErrResult | unknown) => void,
    onComplete?: () => void,
  ): void {
    this.loadBundle({
      bundle,
      bundleName,
      success: (b) => {
        b.loadDir(dir, (err, assets) => {
          if (err) {
            onFail?.({ errCode: -1, errMsg: err.message });
            onComplete?.();
            return;
          }
          onOk(assets ?? []);
          onComplete?.();
        });
      },
      fail: (err) => {
        onFail?.(err);
        onComplete?.();
      },
    });
  }

  static loadAssetAnySequence(req: ILoadAssetAnyRequest): Promise<{ asset: Asset; option: ILoadAssetRequest }[]> {
    const promises = req.requests.map((r) => this.loadAsset(r) as Promise<Asset>);
    const out: { asset: Asset; option: ILoadAssetRequest }[] = [];
    let n = 0;
    return new Promise((resolve) => {
      if (req.requests.length <= 0) {
        resolve(out);
        return;
      }
      const step = (): void => {
        promises[n]!.then((asset) => {
          out.push({ asset, option: req.requests[n]! });
          n++;
          if (n === promises.length) {
            resolve(out);
            return;
          }
          step();
        });
      };
      step();
    });
  }

  static setSpritFrame(
    sprite: import('cc').Sprite,
    bundleName: string,
    path: string,
    onDone?: () => void,
  ): void {
    this.loadAsset({
      bundleName,
      path,
      type: SpriteFrame,
    })
      .then((sf) => {
        sprite.spriteFrame = sf as SpriteFrame;
        onDone?.();
      })
      .catch((e) => {
        console.error(e);
      });
  }
}
