import { _decorator, Component, Node, Toggle } from 'cc';
import { ComponentBase } from './ComponentBase';

const { ccclass, property, menu, requireComponent } = _decorator;

@ccclass('CustomToggle')
@menu('自定义组件/Toggle')
@requireComponent(Toggle)
export class CustomToggle extends ComponentBase {
  @property(Node)
  unCheckMark: Node | null = null;

  private _toggle: Toggle | null = null;

  onLoad(): void {
    super.onLoad();
    this._toggle = this.getComponent(Toggle);
    if (this._toggle) {
      this.node.on(Toggle.EventType.TOGGLE, this._onToggle, this);
      this.updateCheckMark(this._toggle);
    }
  }

  onDestroy(): void {
    this.node.off(Toggle.EventType.TOGGLE, this._onToggle, this);
    super.onDestroy();
  }

  private _onToggle(toggle: Toggle): void {
    this.updateCheckMark(toggle);
  }

  updateCheckMark(toggle: Toggle): void {
    if (this.unCheckMark) {
      this.unCheckMark.active = !toggle.isChecked;
    }
  }
}
