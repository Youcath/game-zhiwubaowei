/** 弹窗基类：遮罩、阻挡点击、进出动画（原 PopupBase.js） */

import {
  _decorator,
  BlockInputEvents,
  Color,
  Enum,
  Node,
  Sprite,
  SpriteFrame,
  tween,
  Tween,
  UIOpacity,
  UITransform,
  Vec3,
  view,
  Widget,
} from 'cc';
import { AppEvent } from './AppProxy';
import { Bundles } from './HomeEnum';
import { ComponentBase } from './ComponentBase';
import { EventManager } from './EventManager';
import { PopupCacheMode, PopupManager } from './PopupManager';
import { ResUtil } from './ResUtil';

const { ccclass, property } = _decorator;

export enum AnimType {
  NONE = 0,
  SCALE = 1,
  FADE = 2,
  CUSTOM = 3,
  SCALE_EASING = 4,
}

function ensureUiOpacity(n: Node): UIOpacity {
  let o = n.getComponent(UIOpacity);
  if (o == null) o = n.addComponent(UIOpacity);
  return o;
}

@ccclass('PopupBase')
export class PopupBase extends ComponentBase {
  @property({ tooltip: '是否需要默认透明背景' })
  transBack = true;

  @property({ tooltip: '是否不能穿透' })
  blockInput = true;

  @property({
    tooltip: '背景颜色',
    visible(this: PopupBase) {
      return this.transBack;
    },
  })
  bgColor = new Color(0, 0, 0, 200);

  @property({ tooltip: '是否需要动画' })
  anim = true;

  @property({ tooltip: '是否需要关闭动画' })
  hideAnim = true;

  @property({
    type: Enum(AnimType),
    tooltip: '动画类型',
    visible(this: PopupBase) {
      return this.anim;
    },
  })
  animType = AnimType.SCALE;

  @property({
    tooltip: '关闭动画所需时间',
    visible(this: PopupBase) {
      return this.hideAnim;
    },
  })
  closeTime = 0.1;

  @property({ tooltip: '该弹框是否覆盖了整个屏幕' })
  protected _fullScreen = false;

  @property({
    tooltip: '播放 scale 动画时，不需要适配的节点',
    type: [Node],
    visible(this: PopupBase) {
      return this.animType === AnimType.SCALE;
    },
  })
  mWidgets: Node[] = [];

  bannerPosition: unknown = null;
  nativePosition: unknown = null;
  align = false;

  private _bgNode: Node | null = null;
  private _closePosition: unknown = null;
  _isShow = false;
  private _showComplete = false;
  private _popupName = '';

  @property
  get fullScreen(): boolean {
    return this._fullScreen;
  }

  set fullScreen(v: boolean) {
    this._fullScreen = v;
  }

  get popupName(): string {
    return this._popupName;
  }

  onLoad(): void {
    super.onLoad();
    const vs = view.getVisibleSize();
    if (this.transBack) {
      this._bgNode = new Node('BgNode');
      const bgUt = this._bgNode.addComponent(UITransform)!;
      bgUt.setContentSize(vs.width, vs.height);
      const spComp = this._bgNode.addComponent(Sprite);
      void ResUtil.loadAsset({
        path: 'textures/transback',
        type: SpriteFrame,
        bundleName: Bundles.RES,
      })
        .then((sf) => {
          spComp.spriteFrame = sf as SpriteFrame;
          spComp.type = Sprite.Type.SLICED;
          spComp.sizeMode = Sprite.SizeMode.CUSTOM;
          spComp.color = new Color(this.bgColor.r, this.bgColor.g, this.bgColor.b, 255);
        })
        .catch(() => {});
      this.node.insertChild(this._bgNode, 0);
      ensureUiOpacity(this._bgNode).opacity = 0;
    }
    if (this.blockInput) {
      const nut = this.node.getComponent(UITransform) ?? this.node.addComponent(UITransform);
      nut.setContentSize(vs.width, vs.height);
      this.node.addComponent(BlockInputEvents);
    }
  }

  _init(name: string, closePosition: unknown, params: unknown): void {
    this._popupName = name;
    this._closePosition = closePosition;
    this.init(params);
  }

  async _show(): Promise<void> {
    if (this._bgNode != null && this._bgNode.isValid) {
      const bgOp = ensureUiOpacity(this._bgNode);
      Tween.stopAllByTarget(bgOp);
      tween(bgOp).to(0.25, { opacity: this.bgColor.a }).start();
    }
    if (this.node == null || !this.node.isValid) return;
    this._isShow = true;
    EventManager.instance.emit(AppEvent.POPUP_SHOW, this._popupName);
    this.node.active = true;
    Tween.stopAllByTarget(this.node);
    this.node.setPosition(0, 0, 0);
    if (!this.anim) {
      this._showComplete = true;
      this.updateAlignment();
      this.onShow();
      return;
    }
    if (this.animType === AnimType.CUSTOM) {
      await this.customShowAnim();
    } else if (this.animType === AnimType.SCALE_EASING) {
      await this._scaleEasingAnim();
    } else if (this.animType === AnimType.SCALE) {
      await this._scaleAnim();
    } else if (this.animType === AnimType.FADE) {
      await this._fadeAnim();
    }
    this._showComplete = true;
    this.updateAlignment();
    this.onShow();
  }

  customShowAnim(): Promise<void> {
    const ga = PopupManager.instance.globalAnim;
    if (ga != null) {
      return new Promise((resolve) => {
        ga.clone(this.node).call(() => resolve()).start();
      });
    }
    return Promise.resolve();
  }

  private _scaleEasingAnim(): Promise<void> {
    this.node.setScale(0, 0, 1);
    return new Promise((resolve) => {
      tween(this.node)
        .to(0.35, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
        .call(() => resolve())
        .start();
    });
  }

  private _scaleAnim(): Promise<void> {
    this.node.setScale(0, 0, 1);
    return new Promise((resolve) => {
      tween(this.node)
        .to(
          0.25,
          { scale: new Vec3(1, 1, 1) },
          {
            easing: 'backOut',
            onUpdate: (_tgt?: Node, _ratio?: number) => {
              const sx = this.node.scale.x;
              if (this._bgNode != null && sx !== 0) {
                this._bgNode.setScale(1 / sx, 1 / sx, 1);
              }
            },
          },
        )
        .call(() => resolve())
        .start();
    });
  }

  private _fadeAnim(): Promise<void> {
    const op = ensureUiOpacity(this.node);
    op.opacity = 0;
    return new Promise((resolve) => {
      tween(op)
        .to(0.25, { opacity: 255 })
        .call(() => resolve())
        .start();
    });
  }

  _hide(playAnim = true): Promise<void> {
    EventManager.instance.emit(AppEvent.POPUP_HIDE, this._popupName);
    this.onHide();
    if (!this.anim || !this.hideAnim || !playAnim) {
      this.node.active = false;
      return Promise.resolve();
    }
    Tween.stopAllByTarget(this.node);
    const closePos = this._closePosition as { x?: number; y?: number; z?: number } | null | undefined;
    if (this.animType === AnimType.FADE) {
      const op = ensureUiOpacity(this.node);
      return new Promise((resolve) => {
        tween(op)
          .to(this.closeTime, { opacity: 0 })
          .call(() => {
            this.node.active = false;
            resolve();
          })
          .start();
      });
    }
    if (this._bgNode != null) {
      const bgOp = ensureUiOpacity(this._bgNode);
      tween(bgOp).to(this.closeTime, { opacity: 0 }).start();
    }
    return new Promise((resolve) => {
      const endScale = new Vec3(0.5, 0.5, 1);
      const props: Record<string, unknown> = { scale: endScale };
      if (closePos != null && typeof closePos.x === 'number') {
        props.position = new Vec3(closePos.x, closePos.y ?? 0, closePos.z ?? 0);
      }
      tween(this.node)
        .to(this.closeTime, props as { scale: Vec3; position?: Vec3 }, {
          onUpdate: () => {
            const sx = this.node.scale.x;
            if (this._bgNode != null && sx !== 0) {
              this._bgNode.setScale(1 / sx, 1 / sx, 1);
            }
          },
        })
        .call(() => {
          this.node.active = false;
          resolve();
        })
        .start();
    });
  }

  init(params?: unknown): void {
    void params;
    const vs = view.getVisibleSize();
    for (const t of this.mWidgets) {
      if (t?.getComponent(Widget) != null) {
        const ut = t.getComponent(UITransform);
        if (ut != null) ut.setContentSize(vs.width, vs.height);
        t.getComponent(Widget)!.enabled = false;
      }
    }
  }

  onShow(): void {
    for (const t of this.mWidgets) {
      const w = t?.getComponent(Widget);
      if (w != null) w.enabled = true;
    }
  }

  onHide(): void {}

  removeUI(mode = PopupCacheMode.ONCE, showLast = true): void {
    PopupManager.instance.remove(this.popupName, mode, true, showLast);
  }

  updateAlignment(): void {
    if (!this.align) {
      this.node.getComponent(Widget)?.updateAlignment();
    }
  }
}
