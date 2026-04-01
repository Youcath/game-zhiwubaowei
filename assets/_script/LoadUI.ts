/** Load 包入口 UI（原 LoadUI.js） */

import { _decorator, macro } from 'cc';
import { DataManager } from './DataManager';
import { Bundles } from './HomeEnum';
import { GGC } from './GameGlobal';
import { LoadUIBase } from './LoadUIBase';

macro.CLEANUP_IMAGE_CACHE = false;

const { ccclass } = _decorator;

@ccclass('LoadUI')
export class LoadUI extends LoadUIBase {
  onLoad(): void {
    super.onLoad();
    GGC?.registerEvents();
    this.bundles.push(Bundles.RES, Bundles.RES_JSON, Bundles.GAME);
  }

  loginComplete(): void {}

  gameConfigRes(_o: object): Promise<void> {
    return new Promise((resolve) => {
      DataManager.instance.initConfig(resolve);
    });
  }

  userDataRes(t: unknown): Promise<void> {
    DataManager.instance.init();
    return new Promise((resolve) => {
      DataManager.instance.initGameDataBase(t as { token?: string; props?: Record<string, string> } | null | undefined);
      resolve();
    });
  }

  loadComplete(): void {}
}
