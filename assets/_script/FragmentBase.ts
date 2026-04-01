/** 子场景/碎片根节点登记（原 FragmentBase.js） */

import { _decorator } from 'cc';
import { AppEvent } from './AppProxy';
import { ComponentBase } from './ComponentBase';
import { EventManager } from './EventManager';
import { SceneManager } from './SceneManager';

const { ccclass } = _decorator;

@ccclass('FragmentBase')
export class FragmentBase extends ComponentBase {
  onLoad(): void {
    super.onLoad();
  }

  onEnable(): void {
    super.onEnable();
    SceneManager.instance.fragment = this.node;
    EventManager.instance.emit(AppEvent.FRAGMENT_CHANGED);
  }

  onDisable(): void {
    if (SceneManager.instance.fragment === this.node) {
      SceneManager.instance.fragment = null;
    }
  }
}
