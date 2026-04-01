import { EventTarget } from 'cc';

/** 与 2.x `EventManager.instance.clear()` 一致：换用新的 EventTarget，丢弃旧监听 */
export type AppEventBus = EventTarget & { clear(): void };

export class EventManager {
  private static _instance: AppEventBus | null = null;

  private static wrapBus(et: EventTarget): AppEventBus {
    return Object.assign(et, {
      clear: () => {
        EventManager._instance = EventManager.wrapBus(new EventTarget());
      },
    }) as AppEventBus;
  }

  static get instance(): AppEventBus {
    if (this._instance == null) {
      this._instance = EventManager.wrapBus(new EventTarget());
    }
    return this._instance;
  }
}
