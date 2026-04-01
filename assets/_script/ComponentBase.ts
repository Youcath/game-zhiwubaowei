import { _decorator, assetManager, Asset, Component, Sprite, SpriteFrame } from 'cc';
import { ResUtil } from './ResUtil';
import Util from './Util';

const { ccclass } = _decorator;

export interface ILoadSpriteFrameOpt {
  bundleName: string;
  path: string;
  sprite: Sprite | null;
  complete?: () => void;
}

@ccclass('ComponentBase')
export class ComponentBase extends Component {
  private readonly _assets: Asset[] = [];

  get assets(): readonly Asset[] {
    return this._assets;
  }

  onLoad(): void {}
  start(): void {}
  onEnable(): void {}
  onDisable(): void {}

  onDestroy(): void {
    this._assets.forEach((t) => t.decRef());
    this._assets.length = 0;
    this.unscheduleAllCallbacks();
  }

  addRef(t: Asset | null): void {
    if (t == null || this._assets.includes(t)) return;
    if (this.node?.isValid) {
      t.addRef();
      this._assets.push(t);
    } else if (t.refCount === 0) {
      assetManager.releaseAsset(t);
    }
  }

  decRef(t: Asset): void {
    const e = this._assets.indexOf(t);
    if (e >= 0) {
      if (t.refCount > 0) t.decRef();
      this._assets.splice(e, 1);
    }
  }

  clearAssets(): void {
    this._assets.forEach((t) => t.decRef());
    this._assets.length = 0;
  }

  getAsset<T extends Asset>(name: string, ctor: new (...args: unknown[]) => T): T | null {
    for (let o = 0; o < this._assets.length; ++o) {
      const a = this._assets[o];
      if (a.name === name && Util.getClassName(ctor) === Util.getClassName(a)) {
        return a as T;
      }
    }
    return null;
  }

  loadSpriteFrame(t: ILoadSpriteFrameOpt): void {
    const p = ResUtil.loadAsset({
      bundleName: t.bundleName,
      path: t.path,
      type: SpriteFrame,
    }) as Promise<SpriteFrame>;
    p.then((sf) => {
      const spr = t.sprite;
      if (spr?.isValid) {
        if (spr.spriteFrame !== sf) {
          if (spr.spriteFrame) {
            this.decRef(spr.spriteFrame);
            spr.spriteFrame = null;
          }
          this.addRef(sf);
          spr.spriteFrame = sf;
          t.complete?.();
        }
      } else if (sf.refCount === 0) {
        assetManager.releaseAsset(sf);
      }
    }).catch(() => {});
  }
}
