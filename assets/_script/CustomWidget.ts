import { _decorator, CCFloat, Widget, view } from 'cc';
import { AppBase } from './AppBase';
import { ComponentBase } from './ComponentBase';

const { ccclass, property, menu, requireComponent } = _decorator;

@ccclass('CustomWidget')
@menu('自定义组件/widget')
@requireComponent(Widget)
export class CustomWidget extends ComponentBase {
  @property({ tooltip: '是否开启刘海屏适配' })
  bar = false;

  @property({ tooltip: '自定义顶边距' })
  customMargin = false;

  @property({
    tooltip: '自定义定边距的距离',
    visible(this: CustomWidget) {
      return this.customMargin;
    },
  })
  margin = 0;

  @property({ tooltip: '是否延迟适配' })
  delay = false;

  @property({
    type: CCFloat,
    tooltip: '延迟适配的时间',
    visible(this: CustomWidget) {
      return this.delay;
    },
  })
  delayTime = 1;

  private _borderMargin = 0;

  onLoad(): void {
    super.onLoad();
    const frame = view.getFrameSize();
    const w = this.node.getComponent(Widget);
    if (!w) return;
    const ratio = frame.height / frame.width;
    this._borderMargin = ratio > 1 ? w.top : w.left;
    if (this.bar && (ratio > 2 || ratio < 0.5)) {
      const n = AppBase.getSystemInfoSync();
      const safeArea = n.safeArea as { top?: number; left?: number } | undefined;
      let statusBarHeight = (n.statusBarHeight as number) ?? 0;
      if (statusBarHeight === 0 && safeArea) {
        statusBarHeight = safeArea.top ?? safeArea.left ?? 0;
      }
      const win = view.getVisibleSize();
      const c = ratio > 1 ? (statusBarHeight / frame.height) * win.height : (statusBarHeight / frame.width) * win.width;
      if (this.customMargin) {
        this._borderMargin = this.margin + c;
      } else {
        this._borderMargin += c;
      }
      this.setWidget();
    } else {
      this.bar = false;
    }
  }

  onEnable(): void {
    super.onEnable();
    if (this.bar) {
      if (this.delay) {
        this.scheduleOnce(this.setWidget, this.delayTime);
      } else {
        this.setWidget();
      }
    }
  }

  setWidget = (): void => {
    const w = this.node.getComponent(Widget);
    if (!w) return;
    const frame = view.getFrameSize();
    if (frame.height / frame.width > 1) {
      w.top = this._borderMargin;
    } else {
      w.left = this._borderMargin;
    }
    w.updateAlignment();
  };
}
