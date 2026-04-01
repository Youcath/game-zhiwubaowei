/** 加载场景（原 LoadScene.js） */

import { _decorator, director, instantiate, Prefab, sp, sys } from 'cc';
import { AppBase } from './AppBase';
import { AudioManager } from './AudioManager';
import { BlockInputManager } from './BlockInputManager';
import { CommonUtil } from './CommonUtil';
import { CServerItem } from './CServerItem';
import { EngineExUtils } from './EngineExUtils';
import { EventManager } from './EventManager';
import { Bundles } from './HomeEnum';
import { PopupManager } from './PopupManager';
import { ResUtil } from './ResUtil';
import { SceneBase } from './SceneBase';

const { ccclass, property } = _decorator;

@ccclass('LoadScene')
export class LoadScene extends SceneBase {
  @property(sp.Skeleton)
  mLoadSpine: sp.Skeleton | null = null;

  onLoad(): void {
    const sc = director.getScene();
    if (sc) sc.name = 'Load';

    EventManager.instance.clear();
    CServerItem.instance.sessionId = '';

    ResUtil.preload({
      paths: 'uis/LoadUI',
      type: Prefab,
      bundleName: Bundles.LOAD,
    });

    super.onLoad();

    const spine = this.mLoadSpine;
    if (spine != null) {
      const o = Math.floor(Math.random() * 1000) % 4 + 1;
      spine.setSkin(`skin${o}`);
      spine.setAnimation(0, 'loading', false);
      spine.setCompleteListener(() => {
        const n = Math.floor(Math.random() * 1000) % 4 + 1;
        spine.setSkin(`skin${n}`);
        spine.setAnimation(0, 'loading', false);
      });
    }

    EngineExUtils.all();
    CommonUtil.print('nowData-----:', Date.now());
    if (sys.os === sys.OS.ANDROID) this.checkDuration();

    AudioManager.instance.stopBgm();
  }

  start(): void {
    super.start();
    AppBase.init();
    PopupManager.instance.init();
    BlockInputManager.instance.init();
    void this.showLoadUI();
  }

  private async showLoadUI(): Promise<void> {
    const t = await ResUtil.loadAsset({
      path: 'uis/LoadUI',
      type: Prefab,
      bundleName: Bundles.LOAD,
    });
    if (t != null) {
      const e = instantiate(t as Prefab);
      e.name = 'LoadUI';
      e.setParent(this.node);
    }
  }

  checkDuration(): void {}
}
