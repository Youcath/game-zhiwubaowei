import { _decorator, Button, CCFloat, Component, EventHandler } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ButtonSafe')
export default class ButtonSafe extends Component {
  @property(CCFloat)
  safeTime = 0.5;

  private _clickEvents: EventHandler[] = [];

  onLoad(): void {
    const btn = this.getComponent(Button);
    if (!btn) return;
    this._clickEvents = [...btn.clickEvents];
    this.node.on(Button.EventType.CLICK, () => {
      btn.clickEvents = [];
      this.scheduleOnce(() => {
        if (this.isValid && this.node.isValid && btn.isValid) {
          btn.clickEvents = [...this._clickEvents];
        }
      }, this.safeTime);
    }, this);
  }
}
