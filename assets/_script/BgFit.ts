/** 背景全屏适配（原 BgFit.js） */

import { _decorator, Enum, UITransform, view } from 'cc';
import { ComponentBase } from './ComponentBase';

const { ccclass, property, menu } = _decorator;

export enum ZSFullFitType {
  ALL = 0,
  WIDTH = 1,
  HEIGHT = 2,
}

@ccclass('BgFit')
@menu('自定义组件/背景适配')
export class BgFit extends ComponentBase {
  @property({ type: Enum(ZSFullFitType), tooltip: '适配模式' })
  fitType = ZSFullFitType.ALL;

  @property({ tooltip: '是否等比缩放' })
  fit = true;

  onLoad(): void {
    super.onLoad();
    const vs = view.getVisibleSize();
    const uw = this.node.getComponent(UITransform);
    const nw = uw?.width ?? 1;
    const nh = uw?.height ?? 1;
    let sx = 1;
    let sy = 1;
    if (this.fitType === ZSFullFitType.WIDTH || this.fitType === ZSFullFitType.ALL) {
      sx = vs.width / nw;
    }
    if (this.fitType === ZSFullFitType.HEIGHT || this.fitType === ZSFullFitType.ALL) {
      sy = vs.height / nh;
    }
    if (this.fit) {
      const s = Math.max(sx, sy);
      this.node.setScale(s, s, 1);
    } else {
      this.node.setScale(sx, sy, 1);
    }
  }
}
