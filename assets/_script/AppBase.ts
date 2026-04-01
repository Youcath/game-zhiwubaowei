/** 根节点 / 顶层触摸（原 AppBase.js） */

import { director, game, Game, Node, NodeEventType, UITransform, view } from 'cc';
import { EventManager } from './EventManager';
import { EGameEvent } from './GameEnum';

export let rootNode: Node | null = null;
export let topNode: Node | null = null;

export class AppBase {
  private static appBaseInit = false;
  private static readonly _systemInfo: Record<string, unknown> = {};

  static getSystemInfoSync(): Record<string, unknown> {
    return this._systemInfo;
  }

  static init(): void {
    if (this.appBaseInit) return;
    const sz = view.getVisibleSize();

    rootNode = new Node('Root');
    const rut = rootNode.addComponent(UITransform)!;
    rut.setContentSize(sz.width, sz.height);
    rootNode.setPosition(sz.width / 2, sz.height / 2, 0);
    director.getScene()!.addChild(rootNode);
    game.addPersistRootNode(rootNode);

    topNode = new Node('Top');
    const tut = topNode.addComponent(UITransform)!;
    tut.setContentSize(sz.width, sz.height);
    topNode.setPosition(sz.width / 2, sz.height / 2, 0);
    director.getScene()!.addChild(topNode);
    game.addPersistRootNode(topNode);

    topNode.on(NodeEventType.TOUCH_START, (ev) => {
      EventManager.instance.emit(EGameEvent.SCENE_TOUCH_START, ev);
    });

    this.appBaseInit = true;
  }

  static getRoot(): Promise<Node | null> {
    if (rootNode != null) return Promise.resolve(rootNode);
    return new Promise((resolve) => {
      const id = setInterval(() => {
        if (rootNode != null) {
          clearInterval(id);
          resolve(rootNode);
        }
      }, 100);
    });
  }

  static onShow(cb: () => void): void {
    game.on(Game.EVENT_SHOW, cb);
  }

  static offShow(cb: () => void): void {
    game.off(Game.EVENT_SHOW, cb);
  }

  static onHide(cb: () => void): void {
    game.on(Game.EVENT_HIDE, cb);
  }

  static offHide(cb: () => void): void {
    game.off(Game.EVENT_HIDE, cb);
  }
}
