/** 超级植物激活 Spine 一次性播放（原 ActiveSuperPlant.js） */

import { _decorator, Component, sp } from 'cc';
import { AudioManager } from './AudioManager';
import { Bundles } from './HomeEnum';

const { ccclass, property } = _decorator;

@ccclass('ActiveSuperPlant')
export default class ActiveSuperPlant extends Component {
  @property(sp.Skeleton)
  mSpine: sp.Skeleton | null = null;

  onLoad(): void {
    this.mSpine?.setCompleteListener(() => {
      this.node.destroy();
    });
  }

  play(): void {
    this.mSpine?.setAnimation(0, 'jihuo', false);
    AudioManager.instance.playEffectPath('sounds/New_Fish', Bundles.RES);
  }
}
