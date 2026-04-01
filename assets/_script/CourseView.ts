/**
 * 新手引导 / 教程视图（原 CourseView.js，挂在 `CoursePopup` 预制体根节点）
 * `showCoursePopup` 传入 `params: { args: ICourseOpenParam }`。
 */

import {
  _decorator,
  Label,
  Node,
  sp,
  tween,
  Tween,
  UITransform,
  Vec3,
  view,
  v3,
} from 'cc';
import { AudioManager } from './AudioManager';
import { battleDataProxy, EBattleEvent } from './BattleDataProxy';
import { GameState } from './GameEnum';
import { Bundles } from './HomeEnum';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import type { ICourseOpenParam } from './GameUIManager';
import { PopupBase } from './PopupBase';
import { userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

type GameGuidRow = {
  id?: number;
  voice?: string;
  des?: string;
  boradType?: number;
  desy?: number;
  falsh?: number;
  showType?: number;
  finishType?: number;
};

type CourseInitParams = { args?: ICourseOpenParam };

function setSpinePaused(sk: sp.Skeleton | null | undefined, paused: boolean): void {
  if (!sk) return;
  const anySk = sk as unknown as { paused?: boolean; timeScale?: number };
  if (typeof anySk.paused === 'boolean') {
    anySk.paused = paused;
  } else {
    sk.timeScale = paused ? 0 : 1;
  }
}

@ccclass('CourseView')
export default class CourseView extends PopupBase {
  @property({ type: Node, displayName: '纯黑遮罩' })
  mBlackMask: Node | null = null;

  @property({ type: Node, displayName: '抠洞遮罩' })
  mHoleMask: Node | null = null;

  @property({ type: Node, displayName: '文字窗口' })
  mContent: Node | null = null;

  @property({ type: Label, displayName: '文字' })
  mTxt: Label | null = null;

  @property(sp.Skeleton)
  mNpcSpine: sp.Skeleton | null = null;

  @property(Node)
  mFinger: Node | null = null;

  private readonly _dialogueTexts: string[] = [];
  private _dialogueIdx = 0;
  private _dialogueTextIdx = 0;
  private _plotIsOver = false;
  private _courseId = 0;
  private _isUpdate = false;
  private _courseData: ICourseOpenParam | null = null;
  private _oldGameState = GameState.PLAYING;
  private _soundId = -1;

  onLoad(): void {
    super.onLoad();
    EventManager.instance.on(EBattleEvent.LOSE_COURSE_VIEW, this.removeSelf, this);
  }

  override onDisable(): void {
    if (this._courseData?.isGame) {
      battleDataProxy.gameState = this._oldGameState;
    }
    EventManager.instance.off(EBattleEvent.LOSE_COURSE_VIEW, this.removeSelf, this);
    super.onDisable();
  }

  override init(params?: unknown): void {
    super.init(params);
    const t = params as CourseInitParams | undefined;
    const args = t?.args;
    if (!args) return;
    if (this._courseId !== args.courseId) {
      this._courseData = args;
      this._isUpdate = true;
      this._courseId = args.courseId;
      const mm = (globalThis as { mm?: { platform?: { umaTrackEvent?: (n: string, p: Record<string, string>) => void } } }).mm;
      mm?.platform?.umaTrackEvent?.('guide', { userA: `guide${this._courseId}` });
      if (this._courseData.isGame) {
        this._oldGameState = battleDataProxy.gameState;
        battleDataProxy.gameState = GameState.PAUSE;
      }
    } else {
      this._isUpdate = false;
    }
  }

  changeDes(): void {}

  private initDialogueData(): void {
    this._dialogueIdx = 0;
    this._dialogueTexts.length = 0;
    this._dialogueTextIdx = 0;
    this._plotIsOver = false;
  }

  private touchStart(): void {
    if (!this._plotIsOver) this.showFullDialogue();
  }

  private showTalk(): void {
    const e = DataManager.instance.eData.datagameguid[String(this._courseId)] as GameGuidRow | undefined;
    if (!e || !this.mNpcSpine) return;
    this.mNpcSpine.setAnimation(0, 'talk', true);
    if (this.mContent) this.mContent.active = true;
    this.initDialogueData();
    AudioManager.instance.playCourseSound(`sounds/${e.voice ?? ''}`, Bundles.RES, (sid) => {
      this._soundId = sid;
    });
    if (this._isUpdate) {
      if (this.mHoleMask) this.mHoleMask.active = false;
      if (this.mBlackMask) this.mBlackMask.active = true;
      if (this.mFinger) {
        this.mFinger.active = false;
        const ch0 = this.mFinger.children[0];
        setSpinePaused(ch0?.getComponent(sp.Skeleton), false);
      }
      if (this.mContent) this.mContent.active = (e.boradType ?? 0) > 0;
      if (this.mTxt) this.mTxt.string = '';
      const o = (e.des ?? '').replace(/\\n/g, '\n');
      this._dialogueTexts.push(o);
      if (this._dialogueTexts.length > 0) this.schedule(this.dialogueSchedule, 0.075);
      const i = this.mContent?.getChildByName('guangbiao');
      if (i) {
        Tween.stopAllByTarget(i);
        const n = tween(i)
          .by(0.25, { position: v3(0, -10, 0) })
          .by(0.25, { position: v3(0, 10, 0) })
          .delay(0.25);
        tween(i).repeatForever(n).start();
      }
      const a = this.node.getChildByName('touchNode');
      a?.targetOff(this);
      a?.on(Node.EventType.TOUCH_START, this.touchStart, this);
    } else {
      this.setTouchEvent();
    }
  }

  override onShow(): void {
    const e = DataManager.instance.eData.datagameguid[String(this._courseId)] as GameGuidRow | undefined;
    if (!e || !this.mContent || !this.mNpcSpine) return;
    const vs = view.getVisibleSize();
    if (e.id === 10 || e.id === 8) {
      this.mContent.setPosition(this.mContent.position.x, 500, this.mContent.position.z);
    } else if (e.id === 2) {
      this.mContent.setPosition(this.mContent.position.x, 600, this.mContent.position.z);
    } else if (e.id === 5) {
      this.mContent.setPosition(this.mContent.position.x, -270, this.mContent.position.z);
    } else {
      this.mContent.setPosition(this.mContent.position.x, Number(e.desy ?? 0), this.mContent.position.z);
    }
    const ny = this.mContent.position.y - 288;
    this.mNpcSpine.node.setPosition(this.mNpcSpine.node.position.x, ny, this.mNpcSpine.node.position.z);
    if (e.falsh === 1 || e.falsh === 3) {
      this.mContent.active = false;
      this.mNpcSpine.node.setPosition(vs.width / 2 + 300, this.mNpcSpine.node.y, this.mNpcSpine.node.position.z);
      Tween.stopAllByTarget(this.mNpcSpine.node);
      this.mNpcSpine.setAnimation(0, 'jinru', false);
      tween(this.mNpcSpine.node)
        .to(1 / 6, { position: v3(210, this.mNpcSpine.node.y, this.mNpcSpine.node.position.z) })
        .call(() => this.showTalk())
        .start();
    } else {
      this.showTalk();
    }
  }

  private setTouchEvent(): void {
    const e = DataManager.instance.eData.datagameguid[String(this._courseId)] as GameGuidRow | undefined;
    if (!e || !this._courseData) return;
    if (this.mHoleMask) this.mHoleMask.active = false;
    if (this.mBlackMask) this.mBlackMask.active = true;
    if (this.mFinger) {
      this.mFinger.active = e.showType === 2;
      Tween.stopAllByTarget(this.mFinger);
      const ch0 = this.mFinger.children[0];
      setSpinePaused(ch0?.getComponent(sp.Skeleton), false);
    }
    if (this.mContent) this.mContent.active = (e.boradType ?? 0) > 0;
    this.changeDes();
    switch (e.showType) {
      case 2:
        if (this.mHoleMask) this.mHoleMask.active = true;
        if (this.mBlackMask) this.mBlackMask.active = false;
        this.mHoleMask?.getChildByName('bg')?.targetOff(this);
        this.mHoleMask?.targetOff(this);
        break;
      default:
        if (e.id !== 11) {
          if (this.mBlackMask) this.mBlackMask.active = true;
          this.mBlackMask?.targetOff(this);
          this.mBlackMask?.on(Node.EventType.TOUCH_END, this.removeSelf, this);
        }
    }
    if (this.mFinger) Tween.stopAllByTarget(this.mFinger);
    const { targetNode, targetNode1, targetNode2 } = this._courseData;
    if (targetNode) {
      if (this.mHoleMask) this.mHoleMask.active = true;
      if (this.mBlackMask) this.mBlackMask.active = false;
      const ut = targetNode.getComponent(UITransform);
      const holeUt = this.mHoleMask?.getComponent(UITransform);
      if (ut && holeUt) {
        const sz = ut.contentSize;
        holeUt.setContentSize(sz.width, sz.height);
      }
      const world = new Vec3();
      targetNode.getWorldPosition(world);
      const local = new Vec3();
      this.node.getComponent(UITransform)?.convertToNodeSpaceAR(world, local);
      const anchorY = targetNode.getComponent(UITransform)?.anchorY ?? 0.5;
      const h = ut?.height ?? 0;
      local.y += (0.5 - anchorY) * h;
      this.mHoleMask?.setPosition(local);
      this.mFinger?.setPosition(local);
      const sk = this.mFinger?.children[0]?.getComponent(sp.Skeleton);
      sk?.setAnimation(0, 'Click', true);
    } else if (targetNode1 && targetNode2) {
      this.updateMoveTargetNode(targetNode1, targetNode2);
    }
    if (e.finishType === 3) {
      const holeBg = this.mHoleMask?.getChildByName('bg');
      if (this.mHoleMask?.active && holeBg) {
        holeBg.targetOff(this);
        holeBg.on(Node.EventType.TOUCH_END, () => {
          holeBg.targetOff(this);
          this.removeSelf();
        }, this);
      } else if (this.mBlackMask?.active) {
        this.mBlackMask.targetOff(this);
        this.mBlackMask.on(Node.EventType.TOUCH_END, this.removeSelf, this);
      } else {
        this.node.targetOff(this);
        this.node.on(Node.EventType.TOUCH_END, this.removeSelf, this);
      }
    } else {
      this.mHoleMask?.getChildByName('bg')?.targetOff(this);
    }
    if (e.id === 2) {
      if (this.mHoleMask) this.mHoleMask.active = false;
      if (this.mBlackMask) this.mBlackMask.active = false;
    }
    AudioManager.instance.stopEffectById(this._soundId);
    this.mNpcSpine?.setAnimation(0, 'stand', true);
  }

  /** 战斗 UI 等外部调用：手指在两点间循环拖动演示 */
  updateMoveTargetNode(t: Node, e: Node): void {
    const i = new Vec3();
    t.getWorldPosition(i);
    const n = new Vec3();
    e.getWorldPosition(n);
    const a = new Vec3();
    this.node.getComponent(UITransform)?.convertToNodeSpaceAR(i, a);
    const r = new Vec3();
    this.node.getComponent(UITransform)?.convertToNodeSpaceAR(n, r);
    if (!this.mFinger) return;
    Tween.stopAllByTarget(this.mFinger);
    const s = tween(this.mFinger)
      .call(() => {
        this.mFinger!.children[0]?.getComponent(sp.Skeleton)?.setAnimation(0, 'Drag', false);
        this.mFinger!.setPosition(a);
      })
      .delay(2 / 3)
      .to(1, { position: r })
      .delay(5 / 6);
    tween(this.mFinger).repeatForever(s).start();
  }

  removeSelf(t?: GameState): void {
    if (t != null) this._oldGameState = t;
    const o = DataManager.instance.eData.datagameguid[String(this._courseId)] as GameGuidRow | undefined;
    if (!o || !this.mNpcSpine) {
      this.removeUI();
      void userDataProxy.completeCourse(this._courseId);
      return;
    }
    if (o.falsh === 2 || o.falsh === 3) {
      Tween.stopAllByTarget(this.mNpcSpine.node);
      this.mNpcSpine.setAnimation(0, 'tuichu', false);
      const vs = view.getVisibleSize();
      const y = this.mNpcSpine.node.position.y;
      tween(this.mNpcSpine.node)
        .to(1 / 6, { position: v3(vs.width / 2 + 300, y, this.mNpcSpine.node.position.z) })
        .call(() => {
          this.removeUI();
          void userDataProxy.completeCourse(this._courseId);
        })
        .start();
    } else {
      this.removeUI();
      void userDataProxy.completeCourse(this._courseId);
    }
  }

  setFingerIsShow(t: boolean): void {
    if (this.mFinger) this.mFinger.active = t;
  }

  private dialogueSchedule = (): void => {
    if (this._dialogueIdx >= this._dialogueTexts.length) {
      this.showFullDialogue();
    } else if (this.mTxt) {
      this.mTxt.node.active = true;
      this.mTxt.string = this.getText(0);
    }
  };

  private showFullDialogue(): void {
    this._plotIsOver = true;
    this.unschedule(this.dialogueSchedule);
    this._dialogueIdx = this._dialogueTexts.length;
    if (this.mTxt) {
      this.mTxt.node.active = true;
      this.mTxt.string = this.getText(0);
    }
    this.node.getChildByName('touchNode')?.targetOff(this);
    this.setTouchEvent();
  }

  private getText(t: number): string {
    const e = this._dialogueTexts[t];
    if (!e) return '';
    if (this._dialogueIdx > t) return e;
    if (this._dialogueIdx < t) return '';
    let o = '';
    for (let i = 0; i < this._dialogueTextIdx; ++i) {
      o += e[i] ?? '';
    }
    if (o.length >= e.length) {
      this._dialogueIdx++;
      this._dialogueTextIdx = 0;
    } else {
      this._dialogueTextIdx++;
    }
    return o;
  }
}
