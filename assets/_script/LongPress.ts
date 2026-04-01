import { _decorator, CCFloat, Component, Enum, EventHandler, Node, NodeEventType } from 'cc';

const { ccclass, property, menu } = _decorator;

export const LONG_PRESS = 'longpress';

export enum TriggerWay {
  Immediately = 1,
  AfterLoosing = 2,
  Duration = 3,
}

@ccclass('LongPress')
@menu('Utils/Components/LongPress')
export default class LongPress extends Component {
  @property(CCFloat)
  triggerTime = 2;

  @property(CCFloat)
  trggerDelayTime = 0.05;

  @property({ type: Enum(TriggerWay) })
  trggerWay = TriggerWay.Immediately;

  @property([EventHandler])
  longPressEvents: EventHandler[] = [];

  private hasAccomplished = false;
  private _isComplateLongPress = false;
  private durationTime = 0;

  onEnable(): void {
    this._isComplateLongPress = false;
    this.registerNodeEvent();
    this.unscheduleAllCallbacks();
  }

  onDisable(): void {
    this._isComplateLongPress = false;
    this.unregisterNodeEvent();
    this.unscheduleAllCallbacks();
  }

  private registerNodeEvent(): void {
    this.node.on(NodeEventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(NodeEventType.TOUCH_CANCEL, this.onTouchCancel, this);
  }

  private unregisterNodeEvent(): void {
    this.node.off(NodeEventType.TOUCH_START, this.onTouchStart, this);
    this.node.off(NodeEventType.TOUCH_END, this.onTouchEnd, this);
    this.node.off(NodeEventType.TOUCH_CANCEL, this.onTouchCancel, this);
  }

  private onTouchStart(): void {
    this.durationTime = 0;
    this.hasAccomplished = false;
    this._isComplateLongPress = false;
    this.scheduleOnce(this.onPressAccomplished, this.triggerTime);
  }

  private onTouchEnd(): void {
    if (this.hasAccomplished) {
      this.hasAccomplished = false;
      this.trigger();
    }
    this._isComplateLongPress = false;
    this.unscheduleAllCallbacks();
  }

  private onTouchCancel(): void {
    if (this.hasAccomplished) {
      this.hasAccomplished = false;
      this.trigger();
    }
    this._isComplateLongPress = false;
    this.unscheduleAllCallbacks();
  }

  update(dt: number): void {
    if (this._isComplateLongPress && this.trggerWay === TriggerWay.Duration) {
      this.durationTime -= dt;
      if (this.durationTime <= 0) {
        this.trigger();
        this.durationTime = this.trggerDelayTime;
      }
    }
  }

  private onPressAccomplished = (): void => {
    if (this.trggerWay === TriggerWay.Immediately) {
      this.trigger();
    } else if (this.trggerWay === TriggerWay.AfterLoosing) {
      this.hasAccomplished = true;
    }
    this._isComplateLongPress = true;
  };

  private trigger(): void {
    EventHandler.emitEvents(this.longPressEvents, this);
    this.node.emit(LONG_PRESS, this);
  }

  isComplateLongPress(): boolean {
    return this._isComplateLongPress;
  }
}
