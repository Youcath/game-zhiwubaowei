/** 场景基类：登记 SceneManager、Canvas 适配（原 SceneBase.js） */

import { _decorator, Canvas, ResolutionPolicy, view } from 'cc';
import { AppEvent } from './AppProxy';
import { ComponentBase } from './ComponentBase';
import { EventManager } from './EventManager';
import { SceneManager } from './SceneManager';

const { ccclass } = _decorator;

@ccclass('SceneBase')
export class SceneBase extends ComponentBase {
  bannerPosition: unknown = null;
  nativePosition: unknown = null;

  onLoad(): void {
    super.onLoad();
    SceneManager.instance.setCurScene(this);
    EventManager.instance.emit(AppEvent.SCENE_CHANGED);
    const design = view.getDesignResolutionSize();
    const vs = view.getVisibleSize();
    // 3.x Canvas 无 fitWidth/fitHeight，用设计分辨率策略等价 2.x 逻辑
    if (this.node.getComponent(Canvas) != null) {
      const policy =
        vs.width / vs.height < design.width / design.height
          ? ResolutionPolicy.FIXED_WIDTH
          : ResolutionPolicy.FIXED_HEIGHT;
      view.setResolutionPolicy(policy);
    }
  }

  switchSceneUI(_type = 0, ..._args: unknown[]): void {
    void _type;
    void _args;
  }
}
