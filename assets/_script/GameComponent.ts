/**
 * 全局持久节点与前后台钩子（原 GameComponent.js，挂 Load 场景 Global 节点）
 */

import { _decorator, game, Game, Rect, view } from 'cc';
import { AppBase } from './AppBase';
import { ComponentBase } from './ComponentBase';
import { TimeUtil } from './TimeUtil';

const { ccclass, property } = _decorator;

@ccclass('GameComponent')
export class GameComponent extends ComponentBase {
  @property
  debugArea = 200;

  private multiTouchCount = 0;
  private multiTouchTime = 0;
  private clickRect: Rect | null = null;

  onLoad(): void {
    super.onLoad();
    game.addPersistRootNode(this.node);
    AppBase.onShow(this.onShow);
    AppBase.onHide(this.onHide);
  }

  start(): void {
    super.start();
    const vs = view.getVisibleSize();
    this.clickRect = new Rect(0, vs.height - this.debugArea, vs.width, this.debugArea);
  }

  onDestroy(): void {
    AppBase.offShow(this.onShow);
    AppBase.offHide(this.onHide);
    super.onDestroy();
  }

  onShow = (): void => {};

  onHide = (): void => {};

  showDebugInfo(): void {
    const t = TimeUtil.getTime();
    if (this.multiTouchTime !== 0 && t - this.multiTouchTime > 1000) this.multiTouchCount = 0;
    this.multiTouchTime = t;
    this.multiTouchCount++;
    if (this.multiTouchCount >= 10) this.multiTouchCount = 0;
  }
}
