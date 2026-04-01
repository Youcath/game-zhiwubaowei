/**
 * 布局自适应：根据 Widget 对齐后的宽度变化均分 spacingX（原 LayoutAdaptive.js）。
 */

import { _decorator, Component, Layout, UITransform, Widget } from 'cc';

const { ccclass } = _decorator;

@ccclass('LayoutAdaptive')
export default class LayoutAdaptive extends Component {
  start(): void {
    const layout = this.node.getComponent(Layout);
    const widget = this.node.getComponent(Widget);
    const ut = this.node.getComponent(UITransform);
    if (layout == null || widget == null || ut == null) return;

    const w0 = ut.width;
    layout.resizeMode = Layout.ResizeMode.NONE;
    widget.updateAlignment();
    const delta = ut.width - w0;
    const n = this.node.children.length;
    if (n > 1) {
      layout.spacingX += delta / (n - 1);
    }
    widget.enabled = false;
    layout.resizeMode = Layout.ResizeMode.CONTAINER;
    layout.updateLayout();
  }
}
