/**
 * 视频/免广告角标切换（原 VideoFlagLogic.js）
 */

import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
import { Bundles } from './HomeEnum';
import { ResUtil } from './ResUtil';

const { ccclass } = _decorator;

/** 与 2.x 预制体节点名一致 */
const EXTEND_VIDEO_ICON = '加时视频小图标';

@ccclass('VideoFlagLogic')
export default class VideoFlagLogic extends Component {
  private _originSpf: SpriteFrame | null = null;

  onLoad(): void {
    this._originSpf = this.node.getComponent(Sprite)?.spriteFrame ?? null;
  }

  onEnable(): void {
    if (this.node.name === EXTEND_VIDEO_ICON) {
      this.node.active = true;
    } else {
      const sp = this.node.getComponent(Sprite);
      if (sp != null && this._originSpf != null) sp.spriteFrame = this._originSpf;
    }
    this.refreshFlagStatus();
  }

  playHideAnim(): void {
    if (this.node.name === EXTEND_VIDEO_ICON) {
      this.node.active = false;
      return;
    }
    const sp = this.node.getComponent(Sprite);
    if (sp == null) return;
    ResUtil.loadAsset({
      bundleName: Bundles.RES,
      path: 'FreeAdFlag',
      type: SpriteFrame,
    })
      .then((sf) => {
        if (sp.isValid) sp.spriteFrame = sf as SpriteFrame;
      })
      .catch(() => {});
  }

  reLightVideoFlag(): void {
    if (this.node.name === EXTEND_VIDEO_ICON) {
      this.node.active = true;
    } else {
      const spr = this.node.getComponent(Sprite);
      if (spr != null && this._originSpf != null) spr.spriteFrame = this._originSpf;
    }
    this.refreshFlagStatus();
  }

  refreshFlagStatus(): void {}
}
