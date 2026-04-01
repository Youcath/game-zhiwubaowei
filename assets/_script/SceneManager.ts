/** 场景切换与加载遮罩（原 SceneManager.js） */

import { Component, director, Node } from 'cc';
import YZLLLoading from './YZLLLoading';
import { ResUtil } from './ResUtil';
import { StringUtil } from './StringUtil';

export class SceneManager {
  private static _instance: SceneManager | null = null;

  static get instance(): SceneManager {
    if (this._instance == null) this._instance = new SceneManager();
    return this._instance;
  }

  private _scene: Component | null = null;
  private _fragment: unknown = null;
  loading: YZLLLoading | null = null;

  get curScene(): Component | null {
    return this._scene;
  }

  get fragment(): unknown {
    return this._fragment;
  }

  set fragment(v: unknown) {
    this._fragment = v;
  }

  showLoading(text = '加载中', opacity = 120, onMid: (() => void) | null = null, lock = false): void {
    this.loading?.show(text, opacity, onMid, lock);
  }

  hideLoading(onDone: (() => void) | null = null, force = false): void {
    this.loading?.hide(onDone, force);
  }

  runScene(sceneName: string, bundleName: string | null | undefined, onDone?: () => void): void {
    this._scene && (this._scene = null);
    this.showLoading('玩命加载中', 255);
    if (StringUtil.isEmpty(bundleName)) {
      this.goScene(sceneName, onDone);
    } else {
      ResUtil.loadBundle({ bundleName })
        .then(() => this.goScene(sceneName, onDone))
        .catch(() => this.hideLoading());
    }
  }

  goScene(sceneName: string, onDone?: () => void): void {
    director.loadScene(sceneName, (err) => {
      this.hideLoading();
      if (err == null) onDone?.();
    });
  }

  setCurScene(t: Component): void {
    this._scene = t;
  }

  setLoading(t: Node): void {
    this.loading = t.getComponent(YZLLLoading);
  }
}
