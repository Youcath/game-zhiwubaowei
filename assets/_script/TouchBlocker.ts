import { _decorator, Component, EventTouch, Node, NodeEventType, UITransform } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TouchBlocker')
export default class TouchBlocker extends Component {
  @property(Node)
  target: Node | null = null;

  isBlockAll = false;
  isPassAll = false;
  clickEvent: ((...args: unknown[]) => void) | null = null;
  clickEventCaller: unknown = null;

  onLoad(): void {
    this.registerEvent();
  }

  start(): void {
    this.reset();
  }

  onDestroy(): void {
    this.unregisterEvent();
  }

  private registerEvent(): void {
    this.node.on(NodeEventType.TOUCH_START, this.onTouchEvent, this);
    this.node.on(NodeEventType.TOUCH_MOVE, this.onTouchEvent, this);
    this.node.on(NodeEventType.TOUCH_END, this.onTouchEvent, this);
  }

  private unregisterEvent(): void {
    this.node.targetOff(this);
  }

  reset(): void {
    this.setSwallowTouches(false);
  }

  /** 对齐 2.x `stopPropagationImmediate`：立即截断，当前节点上尚未触发的监听也不会再收到该触摸。 */
  private stopTouchImmediate(t: EventTouch): void {
    t.propagationImmediateStopped = true;
  }

  private onTouchEvent(t: EventTouch): void {
    const loc = t.getUILocation();
    if (this.isPassAll) {
      if (
        this.target?.activeInHierarchy &&
        this.target.getComponent(UITransform)?.getBoundingBoxToWorld().contains(loc) &&
        t.type === NodeEventType.TOUCH_END
      ) {
        this.clickEvent?.call(this.clickEventCaller);
      }
    } else if (this.isBlockAll) {
      if (this.target == null && t.type === NodeEventType.TOUCH_END) {
        this.clickEvent?.call(this.clickEventCaller);
      } else {
        this.stopTouchImmediate(t);
      }
    } else if (this.target?.activeInHierarchy) {
      const box = this.target.getComponent(UITransform)?.getBoundingBoxToWorld();
      if (box?.contains(loc)) {
        if (t.type === NodeEventType.TOUCH_END) {
          this.clickEvent?.call(this.clickEventCaller);
        }
      } else {
        this.stopTouchImmediate(t);
      }
    } else {
      this.node.active = false;
    }
  }

  blockAll(): void {
    this.isBlockAll = true;
    this.isPassAll = false;
  }

  passAll(): void {
    this.isPassAll = true;
    this.isBlockAll = false;
  }

  setTarget(t: Node | null): void {
    this.target = t;
    this.isBlockAll = false;
    this.isPassAll = false;
  }

  setSwallowTouches(swallow: boolean): void {
    const proc = (
      this.node as unknown as { _eventProcessor?: { setSwallowTouches?: (v: boolean) => void } }
    )._eventProcessor;
    proc?.setSwallowTouches?.(swallow);
  }

  setClickTargetEvent(fn: (...args: unknown[]) => void, caller: unknown): void {
    this.clickEvent = fn;
    this.clickEventCaller = caller;
  }
}
