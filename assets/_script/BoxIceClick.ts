/** 冰块点击特效 Spine，结束回池（原 BoxIceClick.js） */

import { _decorator, Component, sp } from 'cc';
import NodePoolManager from './NodePoolManager';

const { ccclass, property } = _decorator;

@ccclass('BoxIceClick')
export default class BoxIceClick extends Component {
  @property(sp.Skeleton)
  mClickSp: sp.Skeleton | null = null;

  initBoxIceClick(): void {
    this.mClickSp?.setCompleteListener(() => {
      NodePoolManager.instance.putNode(this.node);
    });
    this.mClickSp?.setAnimation(0, 'click', false);
  }
}
