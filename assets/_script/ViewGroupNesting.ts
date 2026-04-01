import { _decorator, Component, EventTouch, NodeEventType } from 'cc';

const { ccclass } = _decorator;

type TouchExt = EventTouch & { sham?: boolean; simulate?: boolean };

@ccclass('ViewGroupNesting')
export default class ViewGroupNesting extends Component {
  private readonly events: EventTouch[] = [];

  onLoad(): void {
    this.node.on(NodeEventType.TOUCH_START, this.onTouchHandle, this, true);
    this.node.on(NodeEventType.TOUCH_MOVE, this.onTouchHandle, this, true);
    this.node.on(NodeEventType.TOUCH_END, this.onTouchHandle, this, true);
    this.node.on(NodeEventType.TOUCH_CANCEL, this.onTouchHandle, this, true);
  }

  private onTouchHandle(event: EventTouch): void {
    const t = event as TouchExt;
    if (t.sham || t.simulate) return;
    if (event.target !== this.node) {
      // 3.8：EventTouch(changedTouches, bubbles, eventType, touches?)
      const touches = event.getTouches();
      const e = new EventTouch(touches, event.bubbles, event.type, touches);
      (e as TouchExt).sham = true;
      this.events.push(e);
    }
  }

  update(): void {
    if (this.events.length === 0) return;
    for (let i = 0; i < this.events.length; i++) {
      this.node.dispatchEvent(this.events[i]);
    }
    this.events.length = 0;
  }
}
